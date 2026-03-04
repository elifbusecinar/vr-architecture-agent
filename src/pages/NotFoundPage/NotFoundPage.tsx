import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="vr-app" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg)', minHeight: '100vh' }}>
      <div className="error-state" style={{ padding: '64px 32px' }}>
        <div className="error-state-icon blue">{'\u25CE'}</div>
        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: 72,
          color: 'var(--bg-inset)',
          lineHeight: 1,
          letterSpacing: '-0.04em',
          userSelect: 'none',
          marginBottom: 8,
        }}>
          404
        </div>
        <div className="error-state-title" style={{ fontSize: 18 }}>Page not found</div>
        <div className="error-state-desc" style={{ maxWidth: 320 }}>
          The page you&apos;re looking for has been moved or doesn&apos;t exist.
        </div>
        <div className="error-state-actions">
          <Link to="/" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13 }}>
            Go to dashboard
          </Link>
        </div>
        <div className="error-state-code">404 · {window.location.pathname}</div>
      </div>
    </div>
  );
}
