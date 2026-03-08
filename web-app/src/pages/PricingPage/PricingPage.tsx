import { useState, useCallback } from 'react';

/* ─── DATA ────────────────────────────────────────── */
const pricesData = {
    monthly: { starter: 0, pro: 79, studio: 199 },
    annual: { starter: 0, pro: 63, studio: 159 },
};

type BillingMode = 'monthly' | 'annual';

interface PlanFeature {
    icon: 'yes' | 'no';
    text: string;
    bold?: string;
}

const starterFeatures: PlanFeature[] = [
    { icon: 'yes', bold: '1 project', text: '' },
    { icon: 'yes', bold: '2 seats', text: 'included' },
    { icon: 'yes', bold: '5 GB', text: 'model storage' },
    { icon: 'yes', bold: '5 VR sessions', text: '/ month' },
    { icon: 'yes', text: 'GLB / GLTF model upload' },
    { icon: 'no', text: 'Session analytics' },
    { icon: 'no', text: 'Client approval workflow' },
];

const proFeatures: PlanFeature[] = [
    { icon: 'yes', bold: 'Unlimited projects', text: '' },
    { icon: 'yes', bold: '7 seats', text: 'included' },
    { icon: 'yes', bold: '50 GB', text: 'model storage' },
    { icon: 'yes', bold: 'Unlimited', text: 'VR sessions' },
    { icon: 'yes', text: 'Session replay & heatmaps' },
    { icon: 'yes', text: 'Client approval workflow' },
    { icon: 'yes', text: 'Priority support' },
];

const studioFeatures: PlanFeature[] = [
    { icon: 'yes', bold: 'Unlimited projects', text: '' },
    { icon: 'yes', bold: '25 seats', text: 'included' },
    { icon: 'yes', bold: '250 GB', text: 'model storage' },
    { icon: 'yes', bold: 'Unlimited', text: 'VR sessions' },
    { icon: 'yes', text: 'Advanced analytics + PDF reports' },
    { icon: 'yes', text: 'Custom branding on Client Portal' },
    { icon: 'yes', text: 'Dedicated account manager' },
];

interface CompareRow {
    name: string;
    desc: string;
    starter: string;
    pro: string;
    studio: string;
}

const compareGroups: { label: string; rows: CompareRow[] }[] = [
    {
        label: 'Core',
        rows: [
            { name: 'Projects', desc: 'Concurrent active projects', starter: '1', pro: 'Unlimited', studio: 'Unlimited' },
            { name: 'Team seats', desc: 'Members in workspace', starter: '2', pro: '7', studio: '25' },
            { name: 'Model storage', desc: 'Azure Blob Storage', starter: '5 GB', pro: '50 GB', studio: '250 GB' },
        ],
    },
    {
        label: 'VR Experience',
        rows: [
            { name: 'VR sessions / month', desc: 'Meta Quest 3 walkthroughs', starter: '5', pro: 'Unlimited', studio: 'Unlimited' },
            { name: 'Concurrent users in VR', desc: 'Per session', starter: '2', pro: '8', studio: '20' },
            { name: 'Runtime model streaming', desc: 'No app update required', starter: '✕', pro: '✓', studio: '✓' },
            { name: 'Spatial annotations', desc: 'In-VR revision pins', starter: '✕', pro: '✓', studio: '✓' },
        ],
    },
    {
        label: 'Analytics & Workflow',
        rows: [
            { name: 'Session replay + heatmaps', desc: 'Where clients spent time', starter: '✕', pro: '✓', studio: '✓' },
            { name: 'PDF report export', desc: 'Auto-generated session reports', starter: '✕', pro: '✕', studio: '✓' },
            { name: 'Client approval + digital sign', desc: 'Full audit trail', starter: '✕', pro: '✓', studio: '✓' },
            { name: 'Custom branding', desc: 'Your logo on Client Portal', starter: '✕', pro: '✕', studio: '✓' },
        ],
    },
];

const faqItems = [
    { q: 'Can I try VR Architecture before paying?', a: "Yes — the Starter plan is permanently free with no credit card required. Every paid plan also includes a 14-day free trial, so you can test the full feature set before being charged." },
    { q: 'What happens if I exceed my storage limit?', a: "You'll receive an email notification at 80% capacity. You won't be cut off immediately — you'll have 7 days to upgrade or delete models before new uploads are paused. We never delete your existing models." },
    { q: 'Do clients need a VR Architecture account?', a: 'No. Clients receive a secure shareable link and can join a VR session or review via the Client Portal without creating an account. Only your internal team members occupy seats.' },
    { q: 'Can I add extra seats beyond my plan limit?', a: 'Yes. Additional seats can be added at $12/seat/month on Pro and $9/seat/month on Studio. You can manage this at any time from your billing settings.' },
    { q: 'Is my model data secure on Azure?', a: 'All models are stored on Azure Blob Storage with AES-256 encryption at rest and TLS in transit. Access is authenticated per-session with time-limited tokens. Models are never shared between workspaces.' },
    { q: 'What file formats are supported?', a: 'GLB and GLTF 2.0 are the primary formats with full texture and animation support. OBJ files are also accepted and automatically converted on upload. FBX support was deprecated in v2.3.0.' },
];

const enterpriseFeats = ['Custom seat limits', 'Dedicated Azure tenant', 'SSO / SAML login', 'White-label Client Portal', '99.9% SLA', 'Priority onboarding'];

/* ─── HELPERS ─────────────────────────────────────── */
function CompareCell({ value }: { value: string }) {
    if (value === '✓') return <span className="ct-yes">✓</span>;
    if (value === '✕') return <span className="ct-no">✕</span>;
    const isHighlight = value === 'Unlimited' || parseInt(value) > 5;
    return <span className={`ct-val${isHighlight ? ' hl' : ''}`}>{value}</span>;
}

import { PublicNavbar } from '@/components/Layout';

/* ─── COMPONENT ───────────────────────────────────── */
export default function PricingPage() {
    const [billing, setBilling] = useState<BillingMode>('monthly');
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    // Calculator state
    const [seats, setSeats] = useState(7);
    const [sessions, setSessions] = useState(20);
    const [storage, setStorage] = useState(30);
    const [projects, setProjects] = useState(5);

    const prices = pricesData[billing];
    const periodText = billing === 'annual' ? 'per month, billed annually' : 'per month, billed monthly';

    // Calculator logic
    const calcResult = useCallback(() => {
        let plan: 'starter' | 'pro' | 'studio' = 'starter';
        let baseCost = 0;
        let includedSeats = 2, includedStorage = 5;

        // Studio: high seat count, high sessions, or high storage (both Pro & Studio have unlimited projects)
        if (seats > 7 || sessions > 50 || storage > 50) {
            plan = 'studio';
            baseCost = billing === 'annual' ? 159 : 199;
            includedSeats = 25; includedStorage = 250;
            // Pro: more than 1 project, more than 2 seats, more than 5 sessions, more than 5GB
        } else if (projects > 1 || seats > 2 || sessions > 5 || storage > 5) {
            plan = 'pro';
            baseCost = billing === 'annual' ? 63 : 79;
            includedSeats = 7; includedStorage = 50;
        }

        const extraSeats = Math.max(0, seats - includedSeats);
        const seatPrice = plan === 'studio' ? 9 : 12;
        const seatCost = extraSeats * seatPrice;
        const extraStorageGB = Math.max(0, storage - includedStorage);
        const storageCost = Math.ceil(extraStorageGB / 50) * 10;
        const total = baseCost + seatCost + storageCost;

        const planNames = { starter: 'Starter', pro: 'Pro Architect', studio: 'Studio' };

        return { plan, baseCost, includedSeats, includedStorage, seatCost, storageCost, total, planName: planNames[plan] };
    }, [seats, sessions, storage, projects, billing]);

    const calc = calcResult();

    const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
        starter: { bg: 'var(--bg-inset)', color: 'var(--ink-3)', border: 'var(--border)' },
        pro: { bg: 'var(--blue-soft)', color: 'var(--blue)', border: 'rgba(45,91,227,0.15)' },
        studio: { bg: 'var(--green-soft)', color: 'var(--green)', border: 'rgba(26,122,74,0.15)' },
    };

    return (
        <div className="pricing-page">
            <PublicNavbar alwaysScrolled />

            {/* HERO */}
            <div className="hero">
                <div className="hero-bg-grid" />
                <div className="hero-eyebrow">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2l1.5 4H14l-3.5 2.5L12 13 8 10.5 4 13l1.5-4.5L2 6h4.5z" /></svg>
                    Simple, transparent pricing
                </div>
                <h1 className="hero-title">Pay for what<br />you <em>actually use</em></h1>
                <p className="hero-sub">No hidden seat fees. No surprise overages. Scale up when your studio grows, cancel anytime.</p>

                {/* Billing toggle */}
                <div className="billing-toggle">
                    <button className={`bt-option ${billing === 'monthly' ? 'active' : ''}`} onClick={() => setBilling('monthly')}>Monthly</button>
                    <button className={`bt-option ${billing === 'annual' ? 'active' : ''}`} onClick={() => setBilling('annual')}>
                        Annual
                        <span className="bt-save">Save 20%</span>
                    </button>
                </div>
            </div>

            {/* PLANS */}
            <div className="plans">
                {/* Starter */}
                <div className="p-card">
                    <div className="p-badge p-badge-free">Free</div>
                    <div className="p-name">Starter</div>
                    <div className="p-desc">For architects exploring VR. Get started without a credit card.</div>
                    <div className="p-price-row">
                        <span className="p-currency">$</span>
                        <span className="p-price">{prices.starter}</span>
                    </div>
                    <div className="p-period">forever free</div>
                    <div className="p-divider" />
                    <div className="p-features">
                        {starterFeatures.map((f, i) => (
                            <div className="pf-item" key={i}>
                                <div className={`pf-icon ${f.icon}`}>{f.icon === 'yes' ? '✓' : '✕'}</div>
                                <div className="pf-text" style={f.icon === 'no' ? { color: 'var(--ink-3)' } : undefined}>
                                    {f.bold && <strong>{f.bold}</strong>} {f.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-cta p-cta-outline">Start free →</button>
                </div>

                {/* Pro (featured) */}
                <div className="p-card featured">
                    <div className="p-badge p-badge-pro">Pro Architect</div>
                    <div className="p-name">Pro</div>
                    <div className="p-desc">For active studios running client walkthroughs every week.</div>
                    <div className="p-price-row">
                        <span className="p-currency">$</span>
                        <span className="p-price">{prices.pro}</span>
                    </div>
                    <div className="p-period">{periodText}</div>
                    <div className="p-divider" />
                    <div className="p-features">
                        {proFeatures.map((f, i) => (
                            <div className="pf-item" key={i}>
                                <div className={`pf-icon ${f.icon}`}>{f.icon === 'yes' ? '✓' : '✕'}</div>
                                <div className="pf-text">
                                    {f.bold && <strong>{f.bold}</strong>} {f.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-cta p-cta-featured">Get started →</button>
                </div>

                {/* Studio */}
                <div className="p-card">
                    <div className="p-badge p-badge-studio">Studio</div>
                    <div className="p-name">Studio</div>
                    <div className="p-desc">For larger firms managing multiple concurrent projects and teams.</div>
                    <div className="p-price-row">
                        <span className="p-currency">$</span>
                        <span className="p-price">{prices.studio}</span>
                    </div>
                    <div className="p-period">{periodText}</div>
                    <div className="p-divider" />
                    <div className="p-features">
                        {studioFeatures.map((f, i) => (
                            <div className="pf-item" key={i}>
                                <div className={`pf-icon ${f.icon}`}>{f.icon === 'yes' ? '✓' : '✕'}</div>
                                <div className="pf-text">
                                    {f.bold && <strong>{f.bold}</strong>} {f.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="p-cta p-cta-filled">Get started →</button>
                </div>
            </div>

            {/* CALCULATOR */}
            <div className="calculator-section">
                <div className="calc-header">
                    <div className="calc-eyebrow">Usage estimator</div>
                    <div className="calc-title">Build your <em>own plan</em></div>
                </div>

                <div className="calc-body">
                    {/* Sliders */}
                    <div className="calc-left">
                        <div className="calc-slider-group">
                            <div className="csg-top">
                                <div><div className="csg-label">Team members</div><div className="csg-sub">seats in workspace</div></div>
                                <div className="csg-value">{seats}</div>
                            </div>
                            <input type="range" min={1} max={50} value={seats} onChange={(e) => setSeats(+e.target.value)} />
                            <div className="slider-marks"><span>1</span><span>10</span><span>25</span><span>50</span></div>
                        </div>

                        <div className="calc-slider-group">
                            <div className="csg-top">
                                <div><div className="csg-label">VR sessions / month</div><div className="csg-sub">across all projects</div></div>
                                <div className="csg-value">{sessions}</div>
                            </div>
                            <input type="range" min={0} max={200} step={5} value={sessions} onChange={(e) => setSessions(+e.target.value)} />
                            <div className="slider-marks"><span>0</span><span>50</span><span>100</span><span>200</span></div>
                        </div>

                        <div className="calc-slider-group">
                            <div className="csg-top">
                                <div><div className="csg-label">Model storage</div><div className="csg-sub">total GB uploaded</div></div>
                                <div className="csg-value">{storage} GB</div>
                            </div>
                            <input type="range" min={5} max={500} step={5} value={storage} onChange={(e) => setStorage(+e.target.value)} />
                            <div className="slider-marks"><span>5 GB</span><span>50 GB</span><span>250 GB</span><span>500 GB</span></div>
                        </div>

                        <div className="calc-slider-group" style={{ marginBottom: 0 }}>
                            <div className="csg-top">
                                <div><div className="csg-label">Active projects</div><div className="csg-sub">concurrent projects</div></div>
                                <div className="csg-value">{projects}</div>
                            </div>
                            <input type="range" min={1} max={30} value={projects} onChange={(e) => setProjects(+e.target.value)} />
                            <div className="slider-marks"><span>1</span><span>10</span><span>20</span><span>30</span></div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="calc-right">
                        <div className="calc-result-label">Recommended plan</div>
                        <div className="calc-result-plan">
                            <span>{calc.planName}</span>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center',
                                padding: '2px 8px', borderRadius: 4,
                                fontFamily: 'var(--mono)', fontSize: 10,
                                background: badgeColors[calc.plan].bg,
                                color: badgeColors[calc.plan].color,
                                border: `1px solid ${badgeColors[calc.plan].border}`,
                            }}>Best match</span>
                        </div>

                        <div className="calc-price-display">
                            <span className="cpd-cur">$</span>
                            <span className="cpd-num">{calc.total}</span>
                            <span className="cpd-per">&nbsp;/ month</span>
                        </div>

                        <div className="calc-breakdown">
                            <div className="cbd-row">
                                <span>Base plan</span>
                                <span className="cbd-val">{calc.baseCost > 0 ? `$${calc.baseCost}` : 'Free'}</span>
                            </div>
                            <div className="cbd-row">
                                <span>Seats ({calc.includedSeats} included)</span>
                                <span className="cbd-val">{calc.seatCost > 0 ? `+$${calc.seatCost}` : '—'}</span>
                            </div>
                            <div className="cbd-row">
                                <span>Storage ({calc.includedStorage} GB included)</span>
                                <span className="cbd-val">{calc.storageCost > 0 ? `+$${calc.storageCost}` : '—'}</span>
                            </div>
                            <div className="cbd-total">
                                <span>Estimated total</span>
                                <span className="cbd-total-val">${calc.total} / mo</span>
                            </div>
                        </div>

                        <div className="calc-cta">
                            <button className="calc-cta-btn">Start with {calc.planName} →</button>
                            <div className="calc-note">14-day free trial · No credit card required</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* COMPARE TABLE */}
            <div className="compare-section">
                <div className="compare-header">
                    <div className="compare-title">Compare <em>all features</em></div>
                </div>

                <div className="compare-table">
                    <div className="ct-head">
                        <div className="ct-th">Feature</div>
                        <div className="ct-th">Starter</div>
                        <div className="ct-th featured-col">Pro</div>
                        <div className="ct-th">Studio</div>
                    </div>

                    {compareGroups.map((group) => (
                        <div key={group.label}>
                            <div className="ct-group-label">{group.label}</div>
                            {group.rows.map((row) => (
                                <div className="ct-row" key={row.name}>
                                    <div className="ct-cell ct-cell-feat">
                                        <div className="ct-feat-name">{row.name}</div>
                                        <div className="ct-feat-desc">{row.desc}</div>
                                    </div>
                                    <div className="ct-cell"><CompareCell value={row.starter} /></div>
                                    <div className="ct-cell featured-col"><CompareCell value={row.pro} /></div>
                                    <div className="ct-cell"><CompareCell value={row.studio} /></div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ */}
            <div className="faq-section">
                <div className="faq-header">
                    <div className="faq-title">Common <em>questions</em></div>
                </div>

                {faqItems.map((item, i) => (
                    <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                        <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                            {item.q}
                            <div className="faq-icon">+</div>
                        </button>
                        <div className="faq-a">{item.a}</div>
                    </div>
                ))}
            </div>

            {/* ENTERPRISE */}
            <div className="enterprise-banner">
                <div className="eb-inner">
                    <div>
                        <div className="eb-eyebrow">Enterprise</div>
                        <div className="eb-title">Need something<br />more <em>bespoke?</em></div>
                        <div className="eb-desc">Custom contracts, SLA guarantees, dedicated infrastructure, SSO/SAML, and white-label options for large practices and property developers.</div>
                        <div className="eb-features">
                            {enterpriseFeats.map((f) => (
                                <div className="eb-feat" key={f}>{f}</div>
                            ))}
                        </div>
                    </div>
                    <div className="eb-cta">
                        <button className="eb-btn eb-btn-primary">Talk to sales →</button>
                        <button className="eb-btn eb-btn-ghost">View case studies</button>
                    </div>
                </div>
            </div>

            {/* TRUST BAR */}
            <div className="trust-bar">
                <div className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 1l2 5h5l-4 3 1.5 5L8 10.5 4 14l1.5-5L1 6h5z" /></svg>
                    Trusted by 500+ architecture firms
                </div>
                <div className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5l-5 5-3-3" /></svg>
                    14-day free trial, no card required
                </div>
                <div className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="12" height="9" rx="1" /><path d="M5 6V4a3 3 0 016 0v2" /></svg>
                    Azure-backed security
                </div>
                <div className="trust-item">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" /></svg>
                    Cancel anytime
                </div>
            </div>

            {/* FOOTER */}
            <footer>
                <span>© 2025 VR Architecture. All rights reserved.</span>
                <span>Built with .NET 8 · Azure · Unity</span>
            </footer>
        </div>
    );
}
