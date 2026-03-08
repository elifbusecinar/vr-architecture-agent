import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '@/components/Layout';

export default function About() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 60);
                    observer.unobserve(e.target);
                }
            });
        }, { threshold: 0.07 });

        const elements = document.querySelectorAll('.about-page .reveal, .about-page .reveal-slow');
        elements.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="about-page">
            <PublicNavbar alwaysScrolled />

            {/* OPENER */}
            <div className="opener">
                <div className="opener-bg-num">01</div>
                <div className="opener-content">
                    <div className="opener-issue">About VR Architecture</div>
                    <h1 className="opener-title">
                        We believe<br />
                        architecture<br />
                        deserves to be<br />
                        <em>felt, not read.</em>
                    </h1>
                    <p className="opener-lede">
                        A floor plan is a translation. Something always gets lost. We're building the tools to close that gap — so the building people imagine is the building that gets built.
                    </p>
                </div>
                <div className="scroll-hint">↓ Read</div>
            </div>

            {/* MANIFESTO BODY */}
            <div className="manifesto reveal">
                <div className="section-marker">The problem</div>

                <p className="drop-cap">
                    Every architecture project begins with a shared vision. An architect holds it in their head — the way morning light crosses a kitchen floor, the compression of a corridor before it opens into a grand room, the texture of a wall you'll touch every day. Then they hand the client a drawing.
                </p>

                <p>
                    A drawing is a <em>code</em>. To read it, you need years of training. Most clients don't have those years. They nod. They sign. They imagine something. And then, eight months and several hundred thousand euros later, they walk through the finished building and say: <em>"I didn't realise it would feel like this."</em>
                </p>

                <p className="large">
                    The gap between what an architect designs and what a client understands is where projects fail, relationships break down, and trust is lost.
                </p>

                <p>
                    This isn't a failure of imagination on the client's part. It's a failure of the tools. The industry has been solving a communication problem with documentation — and documentation, no matter how detailed, cannot replace experience.
                </p>

                <div className="manifesto-rule"></div>

                <div className="section-marker">Our answer</div>

                <p>
                    We built VR Architecture because we believe the only faithful translation of a space is the space itself. Not a rendering. Not a walkthrough video. Not an animated flythrough. <strong>The actual space — at 1:1 scale, walked through, looked up at, stood in.</strong>
                </p>

                <p>
                    When a client puts on a headset and walks into their future home, something changes in the room. The conversation stops being about measurements and starts being about <em>living</em>. They move their hands where the furniture will go. They notice the view from the window they didn't realise mattered. They feel the ceiling height.
                </p>

                <p>
                    And then they tell you exactly what to change — with confidence, not guesswork.
                </p>

                <p className="large">
                    Three revision rounds become one. A six-month approval becomes an afternoon. A client who was nervous becomes a client who can't wait to move in.
                </p>
            </div>

            {/* FULL BLEED QUOTE */}
            <div className="full-bleed-quote reveal-slow">
                <div className="fbq-mark">"</div>
                <p className="fbq-text">
                    The greatest waste in architecture isn't money. It's <em>understanding</em> — the perfect design, built wrong, because no one could see it coming.
                </p>
                <div className="fbq-attr">Alex Carter, Co-founder & CEO</div>
            </div>

            {/* FOUNDING STORY */}
            <div className="founding reveal">
                <div className="founding-left">
                    <div className="founding-year">2023</div>
                    <div className="founding-text">
                        <p>
                            VR Architecture was founded in London by <strong>Alex Carter</strong>, a practising architect, and <strong>Michael Reed</strong>, a software engineer who'd spent a decade building real-time systems.
                        </p>
                        <p>
                            Alex had just finished a residential project in Chelsea. The clients — a couple who'd trusted him completely — were devastated when they saw how dark the living room was. The windows were exactly where he'd drawn them. But they'd never been able to visualise it from the plans.
                        </p>
                        <p>
                            He called Mehmet that evening. Four months later, they had a prototype running on a borrowed Meta Quest 2. Six months after that, they had their first twenty paying studios.
                        </p>
                    </div>
                </div>
                <div className="founding-right">
                    <h2 className="founding-heading">
                        Not a startup.<br /><em>A studio that built<br />its own tools.</em>
                    </h2>
                    <div className="founding-text">
                        <p>
                            We've never thought of ourselves as a tech company that happens to serve architects. We're architects — and engineers — who were frustrated enough to build the software we wished existed.
                        </p>
                        <p>
                            That perspective shapes everything: how we design the product, which features we prioritise, what we refuse to ship before it's ready. We know what it feels like to be in a client meeting where the presentation fails. We've been there.
                        </p>
                        <p>
                            Today we're a team of twelve, distributed between London, Amsterdam, and Singapore. Every major decision is still made by people who have stood in a half-finished building and wished they'd caught something earlier.
                        </p>
                    </div>
                </div>
            </div>

            {/* VALUES STRIP */}
            <div className="values-strip">
                <div className="values-track">
                    {[1, 2].map((group) => (
                        <div key={group} style={{ display: 'contents' }}>
                            <div className="values-item"><div className="vi-dot"></div>Honesty over polish</div>
                            <div className="values-item"><div className="vi-dot"></div>Craft in every detail</div>
                            <div className="values-item"><div className="vi-dot"></div>The architect's perspective</div>
                            <div className="values-item"><div className="vi-dot"></div>Speed as a feature</div>
                            <div className="values-item"><div className="vi-dot"></div>Client trust is everything</div>
                            <div className="values-item"><div className="vi-dot"></div>Build for longevity</div>
                            <div className="values-item"><div className="vi-dot"></div>Less, but better</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRINCIPLES */}
            <div className="principles reveal">
                <div className="principles-header">
                    <h2 className="principles-title">
                        How we<br /><em>think</em>
                    </h2>
                    <div className="principles-count">5 principles</div>
                </div>

                <div className="principle">
                    <div className="principle-num">I</div>
                    <div className="principle-body">
                        <h3 className="principle-title">Experience over <em>explanation</em></h3>
                        <p className="principle-text">No amount of detail in a floor plan replaces five minutes in a VR walkthrough. We design our entire product around the moment of understanding — when a client finally <em>gets it</em>. Everything else is scaffolding.</p>
                    </div>
                </div>

                <div className="principle">
                    <div className="principle-num">II</div>
                    <div className="principle-body">
                        <h3 className="principle-title">Ship with <em>conviction</em></h3>
                        <p className="principle-text">We don't ship features we aren't proud of. We don't release to hit a roadmap date. The tools architects rely on to represent their work to clients must be flawless — because one bad experience in a critical meeting can undo months of relationship building. We hold ourselves to that standard.</p>
                    </div>
                </div>

                <div className="principle">
                    <div className="principle-num">III</div>
                    <div className="principle-body">
                        <h3 className="principle-title">The architect is <em>always right</em></h3>
                        <p className="principle-text">We don't tell architects how to work. We observe how they already work — and build software that fits that reality. Feature requests from practitioners carry more weight than any market research. The people using VR Architecture daily know more about what it needs than we do.</p>
                    </div>
                </div>

                <div className="principle">
                    <div className="principle-num">IV</div>
                    <div className="principle-body">
                        <h3 className="principle-title">Transparency <em>earns trust</em></h3>
                        <p className="principle-text">We publish our changelog publicly. We write honestly about what we're building and why. When something breaks, we say so and explain what happened. Trust, once broken, is extraordinarily difficult to rebuild — and we're asking architects to trust us with their client relationships. We don't take that lightly.</p>
                    </div>
                </div>

                <div className="principle">
                    <div className="principle-num">V</div>
                    <div className="principle-body">
                        <h3 className="principle-title">Simplicity is the <em>hardest feature</em></h3>
                        <p className="principle-text">It's easy to add. It's hard to say no. Every unnecessary feature is a distraction in a client meeting, an extra step in a workflow, one more thing to learn. We spend as much time deciding what not to build as we spend building. The software should disappear — and leave only the conversation between architect and client.</p>
                    </div>
                </div>
            </div>

            {/* TEAM */}
            <div className="team-section reveal">
                <div className="team-header">
                    <h2 className="team-title">The <em>team</em></h2>
                    <p className="team-sub">Twelve people who've worked in architecture firms, game studios, and cloud infrastructure — and couldn't stop thinking about this problem.</p>
                </div>

                <div className="team-grid">
                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#1A1917,#3D3A35)' }}>AC</div>
                        <div className="tm-name">Alex Carter</div>
                        <div className="tm-role">Co-founder & CEO</div>
                        <div className="tm-bio">Practising architect for 12 years before co-founding VRA. MSc Architecture, UCL London. Still reviews every major product decision with his architect's eye.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#2D5BE3,#7C3AED)' }}>MR</div>
                        <div className="tm-name">Michael Reed</div>
                        <div className="tm-role">Co-founder & CTO</div>
                        <div className="tm-bio">10 years building real-time systems at scale. Previously led infrastructure at a gaming studio. Built the first VR prototype on a borrowed Quest 2 in his living room.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#1A7A4A,#059669)' }}>SF</div>
                        <div className="tm-name">Sarah Finn</div>
                        <div className="tm-role">Head of Product</div>
                        <div className="tm-bio">Joined from a UX role at an architecture software company. Knows intimately what architects need and what they'll never use. Obsessively removes features.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#B45309,#D97706)' }}>EK</div>
                        <div className="tm-name">Eliza Key</div>
                        <div className="tm-role">Lead Designer</div>
                        <div className="tm-bio">Interior architect by training, interface designer by practice. Believes every pixel is an architectural decision. Designed the entire VR Architecture visual system.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#0891B2,#06B6D4)' }}>JV</div>
                        <div className="tm-name">Jonas Veld</div>
                        <div className="tm-role">Unity Engineer</div>
                        <div className="tm-bio">Built immersive experiences for museums and cultural institutions before joining. Responsible for everything you see inside the headset. Amsterdam-based.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#7C3AED,#A78BFA)' }}>YT</div>
                        <div className="tm-name">Yuna Tanaka</div>
                        <div className="tm-role">Backend Engineer</div>
                        <div className="tm-bio">Azure specialist. Designed the streaming infrastructure that delivers 3D models to headsets in under two seconds. Singapore-based. Joined from Microsoft.</div>
                    </div>

                    <div className="team-member">
                        <div className="tm-avatar" style={{ background: 'linear-gradient(135deg,#BE185D,#EC4899)' }}>LA</div>
                        <div className="tm-name">Layla Amin</div>
                        <div className="tm-role">Customer Success</div>
                        <div className="tm-bio">Onboards every new studio personally. Former architect. When a customer has a problem, Layla knows about it before they do. Amsterdam-based.</div>
                    </div>

                    <div className="team-member" style={{ background: 'var(--fog)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, cursor: 'pointer' }}>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--ink-4)' }}>+5</div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>More team →</div>
                    </div>
                </div>
            </div>

            {/* MILESTONES */}
            <div className="milestones reveal">
                <h2 className="milestones-title">
                    Two years,<br /><em>measured in moments</em>
                </h2>

                <div className="milestone-row">
                    <div className="ms-year">2023</div>
                    <div className="ms-content">
                        <div className="ms-title">The first session</div>
                        <div className="ms-desc">Alex's client walked through a Chelsea apartment in VR and immediately pointed to a wall. "Can we move this?" The project changed. The partnership deepened. VRA was born.</div>
                        <div className="ms-tag">Origin</div>
                    </div>
                </div>

                <div className="milestone-row">
                    <div className="ms-year">2023</div>
                    <div className="ms-content">
                        <div className="ms-title">First 20 paying studios</div>
                        <div className="ms-desc">Launched quietly with a waitlist. Within six months, 20 London-based architecture firms were using VRA for active client projects. Zero marketing spend.</div>
                        <div className="ms-tag">Growth</div>
                    </div>
                </div>

                <div className="milestone-row">
                    <div className="ms-year">2024</div>
                    <div className="ms-content">
                        <div className="ms-title">Real-time multi-user sessions</div>
                        <div className="ms-desc">The feature that changed everything. For the first time, architect, engineer, and client could stand in the same virtual space together — from different cities.</div>
                        <div className="ms-tag">Product</div>
                    </div>
                </div>

                <div className="milestone-row">
                    <div className="ms-year">2024</div>
                    <div className="ms-content">
                        <div className="ms-title">Expanded to 9 countries</div>
                        <div className="ms-desc">Firms in the Netherlands, Singapore, Denmark, Italy, and beyond began adopting VRA. The problem of spatial communication is universal — geography was never the barrier.</div>
                        <div className="ms-tag">Scale</div>
                    </div>
                </div>

                <div className="milestone-row">
                    <div className="ms-year">2025</div>
                    <div className="ms-content">
                        <div className="ms-title">500 studios, 12,000 sessions</div>
                        <div className="ms-desc">Crossed 500 active firms and 12,000 delivered VR sessions. The data confirmed what we always believed: studios using VRA close projects 3× faster on average.</div>
                        <div className="ms-tag">Milestone</div>
                    </div>
                </div>

                <div className="milestone-row">
                    <div className="ms-year">2026</div>
                    <div className="ms-content">
                        <div className="ms-title">Session analytics & heatmaps</div>
                        <div className="ms-desc">After a session ends, architects can now see exactly where clients spent time, where they paused, what they annotated. The first tool to make client intent legible at scale.</div>
                        <div className="ms-tag">Now</div>
                    </div>
                </div>
            </div>

            {/* MANIFESTO CLOSE */}
            <div className="manifesto-close reveal">
                <div className="mc-rule"></div>
                <h2 className="mc-title">
                    Start your<br />first <em>session</em> today
                </h2>
                <p className="mc-sub">
                    We're early. There's still a long way to go. But the gap between what architects design and what clients understand is closing — and we'd like your studio to be part of that.
                </p>
                <div className="mc-actions">
                    <Link to="/signup" className="btn-serif btn-serif-dark">Begin for free →</Link>
                    <Link to="/changelog" className="btn-serif btn-serif-ghost">Read our changelog</Link>
                </div>
            </div>

            {/* FOOTER */}
            <footer>
                <div>
                    <div className="footer-logo">
                        <div className="footer-logo-sq"><svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg></div>
                        <span className="footer-logo-name">VR Architecture</span>
                    </div>
                    <div className="footer-tagline">The only faithful translation of a space<br />is the space itself.</div>
                </div>

                <div>
                    <div className="footer-col-title">Product</div>
                    <Link className="footer-link" to="/#features">Features</Link>
                    <Link className="footer-link" to="/pricing">Pricing</Link>
                    <Link className="footer-link" to="/changelog">Changelog</Link>
                    <Link className="footer-link" to="#">Integrations</Link>
                    <Link className="footer-link" to="#">API docs</Link>
                </div>

                <div>
                    <div className="footer-col-title">Company</div>
                    <Link className="footer-link" to="/about">About</Link>
                    <Link className="footer-link" to="/stories">Stories</Link>
                    <Link className="footer-link" to="#">Careers</Link>
                    <Link className="footer-link" to="#">Press</Link>
                    <Link className="footer-link" to="#">Contact</Link>
                </div>
            </footer>

            <div className="footer-bottom">
                <span>© 2025 VR Architecture. London · Amsterdam · Singapore.</span>
                <span>Built with .NET 8 · Azure · Unity</span>
            </div>
        </div>
    );
}