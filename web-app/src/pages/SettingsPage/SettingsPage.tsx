import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

// ─── ICONS ──────────────────────────────────────────────────────────────────
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="5" r="3" /><path d="M2 14c0-3 2.5-5 6-5s6 2 6 5" /></svg>;
const BellIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2a3 3 0 00-3 3v3.5l-1.5 2h9l-1.5-2V5a3 3 0 00-3-3zM6 13a2 2 0 004 0" /></svg>;
const LockIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5 7V4.5a3 3 0 116 0V7" /></svg>;
const MonitorIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="12" height="8" rx="1.5" /><path d="M5 14h6M8 11v3" /></svg>;
const WarningIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 2.5l6.5 11H1.5l6.5-11z" /><path d="M8 6v4m0 2h.01" /></svg>;
const SmartphoneIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="8" height="12" rx="2" /><path d="M8 11h.01" /></svg>;
const PencilIcon = () => <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 2l3 3-9 9H2v-3l9-9zM9 4l3 3" /></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3.5 4L13 4" /></svg>;
const CreditCardIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="12" height="8" rx="1.5" /><path d="M2 7h12" /></svg>;

// ─── DATA ───────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'profile', icon: <UserIcon />, label: 'Profile' },
  { id: 'notifs', icon: <BellIcon />, label: 'Notifications' },
  { id: 'security', icon: <LockIcon />, label: 'Security' },
  { id: 'billing', icon: <CreditCardIcon />, label: 'Billing & Plan' },
  { id: 'sessions', icon: <MonitorIcon />, label: 'Active sessions' },
  { id: 'danger', icon: <WarningIcon />, label: 'Danger zone', danger: true },
];

const SESSIONS = [
  {
    icon: <MonitorIcon />,
    name: 'MacBook Pro — Chrome 122',
    loc: 'Istanbul, Turkey',
    date: 'Now',
    current: true,
  },
  {
    icon: <SmartphoneIcon />,
    name: 'iPhone 15 — Safari',
    loc: 'Istanbul, Turkey',
    date: '2h ago',
    current: false,
  },
  {
    icon: <MonitorIcon />,
    name: 'Windows PC — Firefox 124',
    loc: 'Amsterdam, Netherlands',
    date: '3 days ago',
    current: false,
  },
];

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      alert('Subscription upgraded successfully! Your new limits are now active.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const emailName = user?.username || user?.email?.split('@')[0] || 'User';
  const initials = emailName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeNav, setActiveNav] = useState('profile');
  const [revokedSessions, setRevokedSessions] = useState<number[]>([]);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const sectionsRef = useRef<Record<string, HTMLDivElement | null>>({});

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/Billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(1) // 1 == PlanType.Pro
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to initialize checkout.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpgrading(false);
    }
  };

  const markDirty = () => {
    setDirty(true);
    setSaved(false);
  };

  const discard = () => {
    setDirty(false);
    window.location.reload();
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => {
      setDirty(false);
      setSaved(false);
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    sectionsRef.current[id]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="settings-content">
        <nav className="settings-nav">
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`sn-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => scrollToSection(item.id)}
            >
              <div
                className="sn-icon"
                style={item.danger ? { color: 'var(--red)', opacity: 1 } : undefined}
              >
                {item.icon}
              </div>
              {item.label}
            </div>
          ))}
        </nav>

        <div className="settings-body">
          {/* PROFILE */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.profile = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Profile</div>
              <div className="ss-desc">Your personal details visible to your team and clients.</div>
            </div>

            <div className="avatar-row" style={{ marginBottom: 16 }}>
              <div className="big-avatar">
                {initials}
                <div className="av-edit-btn" title="Change photo">
                  <PencilIcon />
                </div>
              </div>
              <div className="av-info" style={{ flex: 1 }}>
                <div className="av-name">{emailName}</div>
                <div className="av-email">{user?.email}</div>
              </div>
              <button className="btn btn-secondary">Change photo</button>
            </div>

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <div className="field">
                <div className="field-label">First name</div>
                <input
                  className="field-input"
                  type="text"
                  defaultValue={emailName}
                  onChange={markDirty}
                />
              </div>
              <div className="field">
                <div className="field-label">Last name</div>
                <input className="field-input" type="text" defaultValue="" onChange={markDirty} />
              </div>
            </div>

            <div className="form-grid" style={{ marginBottom: 14 }}>
              <div className="field">
                <div className="field-label">Email</div>
                <input
                  className="field-input"
                  type="email"
                  defaultValue={user?.email}
                  onChange={markDirty}
                />
              </div>
              <div className="field">
                <div className="field-label">Job title</div>
                <input
                  className="field-input"
                  type="text"
                  defaultValue="Architect"
                  onChange={markDirty}
                />
              </div>
            </div>

            <div className="form-grid-1">
              <div className="field">
                <div className="field-label">Language</div>
                <select className="field-select" onChange={markDirty}>
                  <option value="en">English</option>
                  <option value="tr">Turkish (Türkçe)</option>
                  <option value="de">German (Deutsch)</option>
                  <option value="nl">Dutch (Nederlands)</option>
                </select>
              </div>
            </div>
          </div>

          {/* NOTIFICATIONS */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.notifs = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Notifications</div>
              <div className="ss-desc">Choose what you get notified about, and how.</div>
            </div>

            <SectionLabel>Sessions</SectionLabel>
            <Toggle
              title="Session started"
              desc="When a client joins a VR session you've shared"
              defaultChecked
              onChange={markDirty}
            />
            <Toggle
              title="Session annotation added"
              desc="When anyone leaves a note during a session"
              defaultChecked
              onChange={markDirty}
            />
            <Toggle
              title="Design approved"
              desc="When a client signs off on a design"
              defaultChecked
              onChange={markDirty}
            />

            <SectionLabel style={{ marginTop: 16 }}>Team & billing</SectionLabel>
            <Toggle
              title="New team member joined"
              desc="When someone accepts an invitation to your workspace"
              defaultChecked
              onChange={markDirty}
            />
            <Toggle
              title="Invoice generated"
              desc="Monthly billing emails with your invoice attached"
              onChange={markDirty}
            />
            <Toggle
              title="Storage nearing limit"
              desc="Alert when your workspace reaches 80% of storage capacity"
              defaultChecked
              onChange={markDirty}
            />
          </div>

          {/* SECURITY */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.security = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Security</div>
              <div className="ss-desc">Manage your password and two-factor authentication.</div>
            </div>

            <div className="form-grid" style={{ marginBottom: 16 }}>
              <div className="field">
                <div className="field-label">Current password</div>
                <input
                  className="field-input"
                  type="password"
                  placeholder="••••••••••••"
                  onChange={markDirty}
                />
              </div>
              <div className="field" style={{ gridColumn: '1/-1', maxWidth: '50%' }}>
                <div className="field-label">New password</div>
                <input
                  className="field-input"
                  type="password"
                  placeholder="Min. 12 characters"
                  onChange={markDirty}
                />
                <div className="field-hint">Use a mix of letters, numbers, and symbols.</div>
              </div>
            </div>

            <div style={{ marginBottom: 8, fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>
              Two-factor authentication
            </div>
            <Toggle
              title="Authenticator app (TOTP)"
              desc="Use an app like 1Password, Authy, or Google Authenticator"
              defaultChecked
              onChange={markDirty}
            />
          </div>

          {/* BILLING */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.billing = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Billing & Plan</div>
              <div className="ss-desc">Manage your workspace subscription and Stripe billing details.</div>
            </div>

            <div className="panel" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>Free Starter Plan</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-2)' }}>5 GB Storage • 1 Project • 5 VR Sessions/mo</p>
                </div>
                <div style={{ padding: '6px 12px', background: 'var(--bg-inset)', borderRadius: 6, fontSize: 12, fontWeight: 600, color: 'var(--ink-3)' }}>
                  Current Plan
                </div>
              </div>
              <div style={{ marginTop: 24, padding: 16, background: 'var(--blue-soft)', borderRadius: 8, border: '1px solid rgba(45,91,227,0.15)' }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--blue)', marginBottom: 8 }}>Ready to scale? Upgrade to Pro</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-2)', marginBottom: 16 }}>Unlimited projects, 50 GB storage, unmetered VR sessions, and advanced analytics for just $79/mo.</p>
                <button className="btn btn-primary" onClick={handleUpgrade} disabled={isUpgrading}>
                  {isUpgrading ? 'Redirecting to Stripe...' : 'Upgrade safely via Stripe'}
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE SESSIONS */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.sessions = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Active sessions</div>
              <div className="ss-desc">
                Devices currently signed into your account. Revoke any you don't recognise.
              </div>
            </div>

            <div className="sessions-table">
              <div className="st-header">
                <div className="sth">Device</div>
                <div className="sth">Last active</div>
                <div className="sth">Status</div>
                <div className="sth" />
              </div>
              {SESSIONS.map((s, i) => (
                <div
                  key={i}
                  className="st-row"
                  style={revokedSessions.includes(i) ? { opacity: 0.4 } : undefined}
                >
                  <div className="str-device">
                    <div className="str-dev-icon">{s.icon}</div>
                    <div>
                      <div className="str-dev-name">{s.name}</div>
                      <div className="str-dev-loc">{s.loc}</div>
                    </div>
                  </div>
                  <div className="str-date">{s.date}</div>
                  <div>
                    <span className={`str-badge ${s.current ? 'badge-current' : 'badge-other'}`}>
                      {s.current ? '● This device' : 'Active'}
                    </span>
                  </div>
                  <div>
                    {!s.current && !revokedSessions.includes(i) && (
                      <button
                        className="str-revoke"
                        onClick={() => setRevokedSessions(prev => [...prev, i])}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DANGER ZONE */}
          <div
            className="settings-section"
            ref={el => {
              sectionsRef.current.danger = el;
            }}
          >
            <div className="ss-header">
              <div className="ss-title">Danger zone</div>
              <div className="ss-desc">Irreversible actions. Proceed with caution.</div>
            </div>
            <div className="danger-box">
              <div className="dz-text">
                <div className="dz-title">Delete account</div>
                <div className="dz-desc">
                  Permanently delete your account and all associated data. This cannot be undone.
                </div>
              </div>
              <button
                className="btn btn-danger"
                onClick={() => window.confirm('Are you sure? This cannot be undone.')}
              >
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`unsaved-bar${dirty ? ' show' : ''}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {saved && <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center' }}><CheckIcon /></span>}
          <span className="ub-text">{saved ? 'Saved' : 'Unsaved changes'}</span>
        </div>
        <button className="ub-discard" onClick={discard}>
          Discard
        </button>
        <button className="ub-save" onClick={save}>
          Save changes
        </button>
      </div>
    </>
  );
}

// ─── HELPER COMPONENTS ──────────────────────────────────────────────────────
function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        marginBottom: 8,
        fontFamily: 'var(--mono)',
        fontSize: 10,
        color: 'var(--ink-3)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '0 2px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Toggle({ title, desc, defaultChecked, onChange }: { title: string; desc: string; defaultChecked?: boolean; onChange?: () => void }) {
  return (
    <div className="toggle-row">
      <div className="tr-left">
        <div className="tr-title">{title}</div>
        <div className="tr-desc">{desc}</div>
      </div>
      <label className="toggle">
        <input type="checkbox" defaultChecked={defaultChecked} onChange={onChange} />
        <div className="toggle-track" />
        <div className="toggle-thumb" />
      </label>
    </div>
  );
}
