import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '@/components/Layout';

export default function Stories() {
    const [activeFilter, setActiveFilter] = useState('All stories');

    useEffect(() => {
        const reveals = document.querySelectorAll('.stories-page .reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e, i) => {
                    if (e.isIntersecting) {
                        setTimeout(() => e.target.classList.add('visible'), i * 60);
                        observer.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.08 }
        );
        reveals.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const filters = ['All stories', 'Residential', 'Commercial', 'Cultural', 'Education', 'Hospitality'];

    return (
        <div className="stories-page">
            <PublicNavbar />

            {/* HERO */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-left">
                        <div className="hero-issue">
                            <div className="hero-issue-line" />
                            Customer stories
                        </div>
                        <h1 className="hero-title">
                            How firms<br />build <em>trust</em><br />in VR
                        </h1>
                    </div>
                    <div className="hero-right">
                        <p className="hero-sub">
                            Real projects, real clients, real outcomes. Architecture firms around the world share how VR changed the way they work and win.
                        </p>
                        <div className="hero-meta">
                            <span>14 stories</span>
                            <div className="hero-meta-sep" />
                            <span>9 countries</span>
                            <div className="hero-meta-sep" />
                            <span>Updated Feb 2026</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED STORY */}
            <div className="featured-wrap">
                <div className="featured-story">
                    <div className="fs-visual">
                        <div className="arch-scene">
                            <div className="scene-gradient" />
                            <div className="scene-grid-floor" />
                            <div className="scene-glow" />
                            <div className="scene-building">
                                <div className="sb-block" style={{ width: 55, height: 180 }} />
                                <div className="sb-block" style={{ width: 70, height: 260 }} />
                                <div className="sb-block" style={{ width: 40, height: 140 }} />
                                <div className="sb-block" style={{ width: 90, height: 320 }} />
                                <div className="sb-block" style={{ width: 50, height: 200 }} />
                                <div className="sb-block" style={{ width: 65, height: 240 }} />
                                <div className="sb-block" style={{ width: 45, height: 160 }} />
                            </div>
                        </div>
                        <div className="scene-label">
                            <div className="scene-live" />
                            Skyline Tower · Live walkthrough
                        </div>
                        <div className="scene-badge">
                            <strong>3×</strong> faster approvals
                        </div>
                    </div>

                    <div className="fs-content">
                        <div>
                            <div className="fs-firm-tag">
                                <div className="fs-firm-logo">SK</div>
                                <div>
                                    <div className="fs-firm-name">Studio Koç</div>
                                    <div className="fs-firm-loc">Istanbul, Turkey</div>
                                </div>
                            </div>
                            <div className="fs-tag">Featured story</div>
                            <h2 className="fs-title">From four revision rounds to <em>sign-off in one session</em></h2>
                            <blockquote className="fs-pull">
                                "Our clients used to struggle to read floor plans. Now they walk into the living room, look out the window, and understand immediately. The conversation changes completely."
                            </blockquote>
                            <div className="fs-metrics">
                                <div className="fm"><div className="fm-val">3×</div><div className="fm-label">Faster approval cycle</div></div>
                                <div className="fm"><div className="fm-val">—67%</div><div className="fm-label">Revision rounds</div></div>
                                <div className="fm"><div className="fm-val">8</div><div className="fm-label">Projects in VR</div></div>
                                <div className="fm"><div className="fm-val">100%</div><div className="fm-label">Client retention</div></div>
                            </div>
                        </div>
                        <Link to="#" className="fs-read-more">
                            Read the full story <div className="fs-read-more-arrow">→</div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="filter-section reveal">
                <span className="filter-label">Filter</span>
                {filters.map(f => (
                    <div
                        key={f}
                        className={`filter-chip ${activeFilter === f ? 'filter-chip-active' : ''}`}
                        onClick={() => setActiveFilter(f)}
                    >
                        {f}
                    </div>
                ))}
            </div>

            {/* STORY GRID */}
            <div className="stories-grid reveal">
                <div className="stories-mosaic">
                    {/* Wide Card */}
                    <div className="story-card wide">
                        <div className="sc-visual">
                            <div className="vis-interior">
                                <div className="vis-shape" style={{ width: 100, height: 80, left: '20%' }} />
                                <div className="vis-shape" style={{ width: 60, height: 120, left: '45%' }} />
                                <div className="vis-shape" style={{ width: 80, height: 60, left: '65%' }} />
                                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 80%,rgba(180,83,9,0.15),transparent 60%)' }} />
                            </div>
                            <div className="vis-stat"><strong>4.2×</strong>win rate increase</div>
                        </div>
                        <div className="sc-tag tag-hospitality">Hospitality</div>
                        <div className="sc-firm">Caruso Atelier · Milan</div>
                        <div className="sc-title">The hotel that <em>closed €4M in contracts</em> before a single brick was laid</div>
                        <p className="sc-excerpt">Marco Caruso's team was pitching a boutique hotel renovation in Lake Como. One VR walkthrough changed everything.</p>
                        <div className="sc-footer">
                            <div className="sc-author">
                                <div className="sc-av" style={{ background: 'linear-gradient(135deg,#B45309,#D97706)' }}>MC</div>
                                <div><div className="sc-author-name">Marco Caruso</div><div className="sc-author-role">Design Director</div></div>
                            </div>
                            <div><div className="sc-metric">€4M</div><div className="sc-metric-label">contracts won</div></div>
                        </div>
                    </div>

                    {/* Tall Card */}
                    <div className="story-card">
                        <div className="sc-visual" style={{ aspectRatio: '4/3' }}>
                            <div className="vis-residential">
                                <div className="vis-shape" style={{ width: 70, height: 100, left: '25%' }} />
                                <div className="vis-shape" style={{ width: 50, height: 70, left: '55%' }} />
                            </div>
                            <div className="vis-stat"><strong>0</strong>revision rounds</div>
                        </div>
                        <div className="sc-tag tag-residential">Residential</div>
                        <div className="sc-firm">Eriksson & Partners · Stockholm</div>
                        <div className="sc-title">A <em>Berlin client</em> approved an Istanbul villa remotely</div>
                        <div className="sc-footer">
                            <div className="sc-author">
                                <div className="sc-av" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>SE</div>
                                <div><div className="sc-author-name">Sarah Eriksson</div><div className="sc-author-role">Principal</div></div>
                            </div>
                            <div><div className="sc-metric">1</div><div className="sc-metric-label">session to approve</div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PULL QUOTE */}
            <section className="pull-quote-section reveal">
                <div className="pq-grid-bg" />
                <div className="pq-inner">
                    <div className="pq-mark">"</div>
                    <div>
                        <div className="pq-text">
                            The moment a client steps into their future home in VR, the conversation stops being about <em>dimensions and drawings</em> and starts being about how they'll actually live there.
                        </div>
                        <div className="pq-attribution">Sarah Eriksson · Principal, Eriksson & Partners</div>
                    </div>
                </div>
            </section>

            {/* NUMBERS */}
            <section className="numbers-section reveal">
                {[
                    { val: '3', unit: '×', label: 'Faster client approval cycles', source: 'Avg. across 500+ firms' },
                    { val: '—67', unit: '%', label: 'Reduction in design revision rounds', source: '12-month customer survey' },
                    { val: '98', unit: '%', label: 'Client satisfaction score', source: 'Post-session feedback' },
                    { val: '12k', unit: '+', label: 'VR walkthroughs delivered', source: 'Platform data · 2026' }
                ].map((n, i) => (
                    <div key={i} className="num-item">
                        <div className="num-val">{n.val}<em>{n.unit}</em></div>
                        <div className="num-label">{n.label}</div>
                        <div className="num-source">{n.source}</div>
                    </div>
                ))}
            </section>

            {/* CTA */}
            <section className="cta-section reveal">
                <div className="cta-eyebrow">Your firm, next</div>
                <h2 className="cta-title">Ready to write<br />your <em>own story?</em></h2>
                <p className="cta-sub">Join 500+ architecture firms already closing faster and designing better in VR.</p>
                <div className="cta-actions">
                    <Link to="/signup" className="btn btn-primary">Start free trial →</Link>
                    <Link to="#" className="btn btn-secondary">Talk to sales</Link>
                </div>
            </section>

            <footer className="l-footer">
                <span>© 2025 VR Architecture. All rights reserved.</span>
                <span>Built with .NET 8 · Azure · Unity</span>
            </footer>
        </div>
    );
}