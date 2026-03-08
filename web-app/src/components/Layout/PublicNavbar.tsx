import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface PublicNavbarProps {
    alwaysScrolled?: boolean;
}

export default function PublicNavbar({ alwaysScrolled = false }: PublicNavbarProps) {
    const navRef = useRef<HTMLElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (alwaysScrolled) return;

        const handleScroll = () => {
            navRef.current?.classList.toggle('scrolled', window.scrollY > 30);
        };

        // Initial check
        handleScroll();

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [alwaysScrolled]);

    const scrollToSection = (id: string) => {
        if (location.pathname === '/') {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate(`/#${id}`);
        }
    };

    const handleNavClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        scrollToSection(id);
    };

    const getLinkClass = (path: string) => {
        return `l-nav-link${location.pathname === path ? ' active' : ''}`;
    };

    return (
        <nav className={`l-nav${alwaysScrolled ? ' scrolled' : ''}`} ref={navRef}>
            <Link to="/" className="l-nav-logo">
                <div className="l-nav-logo-mark">
                    <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                </div>
                <div className="l-nav-logo-name">VR Architecture</div>
            </Link>

            <div className="l-nav-links">
                <a href="/#how" className="l-nav-link" onClick={(e) => handleNavClick(e, 'how')}>How it works</a>
                <a href="/#features" className={getLinkClass('/')} onClick={(e) => handleNavClick(e, 'features')}>Features</a>
                <a href="/#testimonials" className="l-nav-link" onClick={(e) => handleNavClick(e, 'testimonials')}>Customers</a>
                <Link className={getLinkClass('/pricing')} to="/pricing">Pricing</Link>
                <Link className={getLinkClass('/stories')} to="/stories">Stories</Link>
                <Link className={getLinkClass('/about')} to="/about">About</Link>
                <Link className={getLinkClass('/changelog')} to="/changelog">Changelog</Link>
            </div>

            <div className="l-nav-actions">
                <Link to="/login" className="l-btn l-btn-ghost">Log in</Link>
                <Link to="/signup" className="l-btn l-btn-primary">Get started →</Link>
            </div>
        </nav>
    );
}
