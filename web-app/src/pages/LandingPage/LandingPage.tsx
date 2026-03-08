import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PublicNavbar } from '@/components/Layout';

export default function LandingPage() {
    const location = useLocation();

    // Scroll to hash on mount
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            setTimeout(() => {
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location]);

    // Scroll reveal logic kept here
    useEffect(() => {
        const reveals = document.querySelectorAll('.landing .reveal');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e, i) => {
                    if (e.isIntersecting) {
                        setTimeout(() => e.target.classList.add('visible'), i * 60);
                        observer.unobserve(e.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        reveals.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing">
            <PublicNavbar />

            {/* ─── HERO ─── */}
            <section className="hero">
                <div className="hero-grid-bg" />

                <div className="hero-badge">
                    <div className="hero-badge-dot">✦</div>
                    Now with real-time collaboration &nbsp;·&nbsp; <span>Meta Quest 3 support</span>
                </div>

                <h1 className="hero-title">
                    Architecture, <em>experienced</em><br />at full scale
                </h1>

                <p className="hero-sub">
                    Upload your models, step inside them in VR, and walk clients through every detail — all from a single cloud platform.
                </p>

                <div className="hero-actions">
                    <Link to="/signup" className="l-btn l-btn-primary l-btn-lg">Start for free →</Link>
                    <a className="l-btn l-btn-outline l-btn-lg" href="#">Watch demo ▶</a>
                </div>

                <div className="hero-trust">
                    <div className="hero-trust-avatars">
                        <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>AK</div>
                        <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>ME</div>
                        <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#B45309,#D97706)' }}>EK</div>
                        <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#0891B2,#2D5BE3)' }}>RY</div>
                    </div>
                    Trusted by 500+ architecture firms
                    <div className="trust-sep" />
                    ★★★★★ 4.9 rating
                </div>

                {/* DASHBOARD PREVIEW */}
                <div className="preview-wrap">
                    <div className="preview-glow" />
                    <div className="preview-frame">
                        <div className="preview-bar">
                            <div className="preview-dots">
                                <div className="preview-dot" style={{ background: '#F87171' }} />
                                <div className="preview-dot" style={{ background: '#FBBF24' }} />
                                <div className="preview-dot" style={{ background: '#4ADE80' }} />
                            </div>
                            <div className="preview-url">app.vrarchitecture.io/dashboard</div>
                        </div>
                        <div className="dash-mockup">
                            {/* Sidebar */}
                            <div className="dash-sidebar">
                                <div className="dash-logo-row">
                                    <div className="dash-logo-sq" />
                                    <div className="dash-logo-text">VR Architecture</div>
                                </div>
                                <div className="dash-nav-item act"><div className="dash-nav-icon" style={{ borderRadius: 3 }} /> Overview</div>
                                <div className="dash-nav-item reg"><div className="dash-nav-icon" style={{ borderRadius: 2 }} /> Projects</div>
                                <div className="dash-nav-item reg"><div className="dash-nav-icon" style={{ borderRadius: '50%' }} /> VR Sessions</div>
                                <div className="dash-nav-item reg"><div className="dash-nav-icon" style={{ clipPath: 'polygon(50% 0%,100% 100%,0% 100%)' }} /> 3D Models</div>
                                <div className="dash-nav-item reg"><div className="dash-nav-icon" style={{ borderRadius: '50%' }} /> Analytics</div>
                                <div className="dash-nav-item reg"><div className="dash-nav-icon" /> Team</div>
                            </div>
                            {/* Main */}
                            <div className="dash-main">
                                <div className="dash-stats">
                                    <div className="dash-stat">
                                        <div className="dash-stat-l">Projects</div>
                                        <div className="dash-stat-v">8</div>
                                        <div className="dash-stat-d">↑ +2 this month</div>
                                    </div>
                                    <div className="dash-stat">
                                        <div className="dash-stat-l">VR Sessions</div>
                                        <div className="dash-stat-v">3</div>
                                        <div className="dash-stat-d" style={{ color: '#B45309' }}>● Live now</div>
                                    </div>
                                    <div className="dash-stat">
                                        <div className="dash-stat-l">Models</div>
                                        <div className="dash-stat-v">47</div>
                                        <div className="dash-stat-d">↑ +12 this week</div>
                                    </div>
                                    <div className="dash-stat">
                                        <div className="dash-stat-l">Reviews</div>
                                        <div className="dash-stat-v">3</div>
                                        <div className="dash-stat-d" style={{ color: '#B45309' }}>Pending action</div>
                                    </div>
                                </div>
                                <div className="dash-row">
                                    <div className="dash-table-card">
                                        <div className="dash-table-head">
                                            <div className="dash-th">Project</div>
                                            <div className="dash-th">Status</div>
                                            <div className="dash-th">Progress</div>
                                        </div>
                                        <div className="dash-tr"><div className="dash-tr-name">Skyline Tower</div><div className="dash-pill vr">VR Active</div><div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)' }}>78%</div></div>
                                        <div className="dash-tr"><div className="dash-tr-name">Villa Azura</div><div className="dash-pill ok">Approved</div><div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)' }}>100%</div></div>
                                        <div className="dash-tr"><div className="dash-tr-name">Metro Nexus</div><div className="dash-pill rev">In Review</div><div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)' }}>55%</div></div>
                                        <div className="dash-tr"><div className="dash-tr-name">Harbor Museum</div><div className="dash-pill dr">Draft</div><div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-3)' }}>22%</div></div>
                                    </div>
                                    <div className="dash-side-card">
                                        <div className="dash-side-label">Live Sessions</div>
                                        <div className="dash-session-item">
                                            <div className="dash-session-name"><span className="dash-live-dot" />Skyline Tower</div>
                                            <div className="dash-session-meta">3 users · 00:47:12</div>
                                        </div>
                                        <div className="dash-session-item">
                                            <div className="dash-session-name"><span className="dash-live-dot" />Eco Campus</div>
                                            <div className="dash-session-meta">2 users · 01:12:05</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ─── */}
            <section className="how l-section" id="how">
                <div className="how-inner reveal">
                    <div>
                        <div className="section-eyebrow">How it works</div>
                        <h2 className="section-title">From model to<br /><em>immersive experience</em><br />in minutes</h2>
                        <p className="section-sub" style={{ marginBottom: 40 }}>A workflow designed for architects, built to impress clients. No hardware expertise required.</p>

                        <div className="steps">
                            <div className="step">
                                <div className="step-num">01</div>
                                <div>
                                    <div className="step-title">Upload your model</div>
                                    <div className="step-desc">Drag and drop any GLB, GLTF or OBJ file. We optimize it automatically for VR rendering on Azure cloud infrastructure.</div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-num">02</div>
                                <div>
                                    <div className="step-title">Invite your client</div>
                                    <div className="step-desc">Share a secure link. Clients join from their Meta Quest 3 — no app install, no technical setup, just put on the headset.</div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-num">03</div>
                                <div>
                                    <div className="step-title">Walk through together</div>
                                    <div className="step-desc">Explore the space at 1:1 scale in real time. Add annotations, request revisions, and get approvals — all inside VR.</div>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-num">04</div>
                                <div>
                                    <div className="step-title">Manage from the dashboard</div>
                                    <div className="step-desc">Track all projects, sessions, and client feedback from your web panel. Session recordings and reports generated automatically.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VR Visual */}
                    <div className="vr-visual">
                        <div className="vr-visual-inner">
                            <div className="vr-grid" />
                            <div className="vr-glow" />

                            <div className="building">
                                <div className="b-block" style={{ width: 60, height: 200 }} />
                                <div className="b-block" style={{ width: 80, height: 280 }} />
                                <div className="b-block" style={{ width: 40, height: 160 }} />
                                <div className="b-block" style={{ width: 100, height: 320 }} />
                                <div className="b-block" style={{ width: 50, height: 180 }} />
                                <div className="b-block" style={{ width: 70, height: 240 }} />
                            </div>

                            <div className="vr-label">
                                <div className="vr-label-dot" />
                                Live session · 3 users
                            </div>

                            <div className="vr-users">
                                <div className="vr-user-tag">
                                    <div className="vr-user-dot" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>A</div>
                                    Alex K.
                                </div>
                                <div className="vr-user-tag">
                                    <div className="vr-user-dot" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>M</div>
                                    Martin &amp; Co.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ─── */}
            <section className="l-section" id="features">
                <div className="features">
                    <div className="features-header reveal">
                        <div className="section-eyebrow">Platform features</div>
                        <h2 className="section-title">Everything you need to<br /><em>close the deal</em></h2>
                        <p className="section-sub">Purpose-built for architectural practices. Every feature exists to make you look better in front of clients.</p>
                    </div>

                    <div className="feat-grid reveal">
                        <div className="feat-card">
                            <div className="feat-icon">🥽</div>
                            <div className="feat-title">1:1 Scale VR Walkthroughs</div>
                            <div className="feat-desc">Clients experience your project at real human scale on Meta Quest 3. No static renders — they actually feel the space.</div>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">☁️</div>
                            <div className="feat-title">Cloud-Native Storage</div>
                            <div className="feat-desc">Models are stored on Azure Blob Storage and streamed to VR at runtime. Update a model and it's live instantly — no app updates.</div>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">👥</div>
                            <div className="feat-title">Real-Time Collaboration</div>
                            <div className="feat-desc">Multiple users in the same VR session simultaneously. Architects, engineers, and clients — all in the same space.</div>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">📝</div>
                            <div className="feat-title">In-VR Annotations</div>
                            <div className="feat-desc">Place spatial notes and revision requests directly inside the model. Feedback is anchored to exact locations in 3D space.</div>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">✅</div>
                            <div className="feat-title">Client Approval Workflow</div>
                            <div className="feat-desc">Send a review link, receive digital sign-off. The entire approval chain from walkthrough to contract is tracked automatically.</div>
                        </div>
                        <div className="feat-card">
                            <div className="feat-icon">📊</div>
                            <div className="feat-title">Session Analytics</div>
                            <div className="feat-desc">See where clients spend time, what they look at most, and how long sessions run. Data-backed design decisions.</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── STATS BAR ─── */}
            <div className="stats-bar">
                <div className="stats-bar-inner reveal">
                    <div className="stat-b">
                        <div className="stat-b-val">500<em>+</em></div>
                        <div className="stat-b-label">Architecture firms</div>
                    </div>
                    <div className="stat-b">
                        <div className="stat-b-val">12k<em>+</em></div>
                        <div className="stat-b-label">VR sessions delivered</div>
                    </div>
                    <div className="stat-b">
                        <div className="stat-b-val">98<em>%</em></div>
                        <div className="stat-b-label">Client approval rate</div>
                    </div>
                    <div className="stat-b">
                        <div className="stat-b-val">3x<em> faster</em></div>
                        <div className="stat-b-label">Approval cycles</div>
                    </div>
                </div>
            </div>

            {/* ─── TESTIMONIALS ─── */}
            <section className="l-section" id="testimonials">
                <div className="testimonials">
                    <div className="test-header reveal">
                        <div className="section-eyebrow">Customer stories</div>
                        <h2 className="section-title">Architects who<br /><em>changed the conversation</em></h2>
                    </div>
                    <div className="test-grid reveal">
                        <div className="test-card">
                            <div className="stars">★★★★★</div>
                            <div className="test-quote">"Our clients used to request three or four revision rounds before approving. Now they walk through in VR and sign off in the same session. It's completely transformed how we present."</div>
                            <div className="test-author">
                                <div className="test-avatar" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>AK</div>
                                <div>
                                    <div className="test-name">Alex Carter</div>
                                    <div className="test-role">Lead Architect, Studio Arc</div>
                                </div>
                            </div>
                        </div>
                        <div className="test-card">
                            <div className="stars">★★★★★</div>
                            <div className="test-quote">"We work with international clients who can't always fly in. VR Architecture closed that gap entirely. A client in Berlin walked through our London project without leaving their office."</div>
                            <div className="test-author">
                                <div className="test-avatar" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>SE</div>
                                <div>
                                    <div className="test-name">Sarah Eriksson</div>
                                    <div className="test-role">Principal, Eriksson &amp; Partners</div>
                                </div>
                            </div>
                        </div>
                        <div className="test-card">
                            <div className="stars">★★★★★</div>
                            <div className="test-quote">"The platform is remarkably clean for something this technically complex. Upload, invite, explore. Our team was up and running in an afternoon. The client dashboard is genuinely impressive."</div>
                            <div className="test-author">
                                <div className="test-avatar" style={{ background: 'linear-gradient(135deg,#B45309,#D97706)' }}>MC</div>
                                <div>
                                    <div className="test-name">Marco Caruso</div>
                                    <div className="test-role">Design Director, Caruso Atelier</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CTA ─── */}
            <section className="cta-section">
                <div className="cta-inner reveal">
                    <div className="section-eyebrow" style={{ textAlign: 'center' }}>Get started today</div>
                    <h2 className="cta-title">Your next client<br />walkthrough is<br /><em>in VR</em></h2>
                    <p className="cta-sub">Join 500+ architecture firms already using VR Architecture. Free 14-day trial, no credit card required.</p>

                    <div className="cta-input-row">
                        <input className="cta-input" type="email" placeholder="you@studio.com" />
                        <Link to="/signup" className="l-btn l-btn-primary l-btn-lg" style={{ whiteSpace: 'nowrap' }}>Get started →</Link>
                    </div>
                    <div className="cta-note">Free 14 days · No credit card · Cancel anytime</div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="l-footer">
                <div className="footer-inner">
                    <div className="footer-top">
                        <div>
                            <div className="footer-brand-row">
                                <div className="footer-brand-sq" />
                                <div className="footer-brand-name">VR Architecture</div>
                            </div>
                            <div className="footer-brand-desc">The platform for architectural VR experiences. Built on .NET 8 and Azure, designed for the way architects work.</div>
                        </div>
                        <div>
                            <div className="footer-col-title">Product</div>
                            <a className="footer-col-link" href="#features">Features</a>
                            <Link className="footer-col-link" to="/pricing">Pricing</Link>
                            <Link className="footer-col-link" to="/changelog">Changelog</Link>
                            <Link className="footer-col-link" to="/changelog#roadmap">Roadmap</Link>
                        </div>
                        <div>
                            <div className="footer-col-title">Company</div>
                            <a className="footer-col-link" href="#">About</a>
                            <a className="footer-col-link" href="#">Blog</a>
                            <a className="footer-col-link" href="#">Careers</a>
                            <a className="footer-col-link" href="#">Contact</a>
                        </div>
                        <div>
                            <div className="footer-col-title">Legal</div>
                            <a className="footer-col-link" href="#">Privacy</a>
                            <a className="footer-col-link" href="#">Terms</a>
                            <a className="footer-col-link" href="#">Security</a>
                            <a className="footer-col-link" href="#">Status</a>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2025 VR Architecture. All rights reserved.</span>
                        <span>Built with .NET 8 · Azure · Unity</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
