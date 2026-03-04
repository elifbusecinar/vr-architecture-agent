import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES, getHomeForRole, type AppRole } from '@/constants/roles';
import BuildingScene, { getPasswordStrength } from './BuildingScene';
import '@/styles/onboarding.css';

// ─── ICONS ──────────────────────────────────────────────────────────────────
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 8l3.5 4L13 4" /></svg>;
const LogoIcon = () => <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>;
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 8h14M8 1l7 7-7 7" /></svg>;
const EyeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /><circle cx="12" cy="12" r="3" /></svg>;
const EyeOffIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><path d="M1 1l22 22" /></svg>;

const STEPS = [
  { id: 1, title: 'Your studio', desc: 'Name, size, location' },
  { id: 2, title: 'Your role', desc: 'How you\'ll use VRA' },
  { id: 3, title: 'First project', desc: 'Upload a model or start blank' },
  { id: 4, title: 'Invite team', desc: 'Colleagues & clients' },
  { id: 5, title: 'Connect headset', desc: 'Meta Quest 3 pairing' }
];

const ROLES_DATA = [
  { value: ROLES.ARCHITECT, label: 'Architect', desc: 'I design buildings and lead client presentations in VR.', icon: '🏛️' },
  {
    value: ROLES.ADMIN,
    label: 'Project Manager',
    desc: 'I coordinate teams and oversee design approvals and timelines.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" width="20" height="14" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
  },
  {
    value: ROLES.CLIENT,
    label: 'Developer / Client',
    desc: 'I commission projects and want to review designs before approving.',
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18" /><path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" /><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4" /><path d="M9 9h.01" /><path d="M15 9h.01" /><path d="M9 13h.01" /><path d="M15 13h.01" /></svg>
  },
];

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCompletion, setShowCompletion] = useState(false);

  // Form State
  const [studioName, setStudioName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('uk');
  const [website, setWebsite] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>(ROLES.ARCHITECT);
  const [teamSize, setTeamSize] = useState('2–5 people');
  const [projectName, setProjectName] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string, size: string } | null>(null);
  const [invites, setInvites] = useState<{ email: string, role: string }[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('designer');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const { register, user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user && showCompletion) {
      // Only navigate if we've shown the success screen and user clicks the CTA
    }
  }, [isAuthenticated, user, showCompletion]);

  const handleNext = async () => {
    if (currentStep === 1) {
      if (!studioName || !userName || !email || !password) return;
      setCurrentStep(2);
    } else if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setSignupError(null);
      try {
        await register({ username: userName, email, password, role: selectedRole });
        setShowCompletion(true);
      } catch (err: any) {
        setSignupError(err.message || 'Registration failed. Please try again.');
        setCurrentStep(1); // Go back to first step where email/pw fields are
      }
    }
  };

  const skipSetup = async () => {
    if (userName && email && password) {
      setSignupError(null);
      try {
        await register({ username: userName, email, password, role: selectedRole });
        setShowCompletion(true);
      } catch (err: any) {
        setSignupError(err.message || 'Registration failed. Please try again.');
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(1);
    }
  };

  const addInvite = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) return;
    setInvites([...invites, { email: inviteEmail, role: inviteRole }]);
    setInviteEmail('');
  };

  return (
    <div className="onboarding-container">
      {/* LEFT PANEL */}
      <div className="left-panel">
        <div className="lp-logo">
          <div className="lp-logo-sq"><LogoIcon /></div>
          <span className="lp-logo-name">VR Architecture</span>
        </div>

        <div className="lp-steps">
          {STEPS.map(s => (
            <div
              key={s.id}
              className={`lp-step ${currentStep === s.id ? 'active' : ''} ${currentStep > s.id ? 'done' : ''}`}
            >
              <div className="lp-step-num">{currentStep > s.id ? <CheckIcon /> : s.id}</div>
              <div className="lp-step-info">
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <BuildingScene strength={passwordStrength} wireframe={showPassword} />
      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">
        <div className="rp-topbar">
          <div className="rpt-progress">
            <div className="rpt-bar-wrap">
              <div className="rpt-bar-fill" style={{ width: `${(currentStep / 5) * 100}%` }}></div>
            </div>
            <div className="rpt-label">Step {currentStep} of 5</div>
          </div>
          <button className="rpt-skip" onClick={skipSetup}>Skip setup →</button>
        </div>

        <div className="steps-wrapper">
          {/* STEP 1: STUDIO */}
          <div className={`step-slide ${currentStep === 1 && !showCompletion ? 'active' : ''} ${currentStep > 1 ? 'exit' : ''}`}>
            {signupError && <div className="login-error-toast" style={{ marginBottom: 20 }}>⚠ {signupError}</div>}
            <div className="step-eyebrow">Step 1 of 5</div>
            <h1 className="step-title">Tell us about<br />your <em>studio</em></h1>
            <p className="step-sub">This helps us tailor VR Architecture to the way your team works. Takes about 60 seconds.</p>

            <div className="form-grid-2">
              <div className="field-group">
                <div className="field-label">Studio name <span className="field-required">*</span></div>
                <input className="field-input" type="text" placeholder="e.g. Studio Arc" value={studioName} onChange={e => setStudioName(e.target.value)} />
              </div>
              <div className="field-group">
                <div className="field-label">Your name <span className="field-required">*</span></div>
                <input className="field-input" type="text" placeholder="Alex Carter" value={userName} onChange={e => setUserName(e.target.value)} />
              </div>
            </div>

            <div className="form-grid-2">
              <div className="field-group">
                <div className="field-label">Country</div>
                <select className="field-select" value={country} onChange={e => setCountry(e.target.value)}>
                  <option value="tr">Turkey</option>
                  <option value="nl">Netherlands</option>
                  <option value="de">Germany</option>
                  <option value="uk">United Kingdom</option>
                  <option value="sg">Singapore</option>
                  <option value="us">United States</option>
                </select>
              </div>
              <div className="field-group">
                <div className="field-label">Website</div>
                <input className="field-input" type="text" placeholder="studioname.com" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
            </div>

            <div className="form-grid-1">
              <div className="field-group">
                <div className="field-label">Email Address (for your account) <span className="field-required">*</span></div>
                <input className="field-input" type="email" placeholder="you@studio.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="form-grid-1">
              <div className="field-group">
                <div className="field-label">Create Password <span className="field-required">*</span></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    className="field-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setPasswordStrength(getPasswordStrength(e.target.value)); }}
                    style={{ flex: 1, fontFamily: showPassword ? 'var(--mono)' : undefined, letterSpacing: showPassword ? '0.08em' : undefined }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ob-pw-toggle"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20, fontSize: 13, color: 'var(--ink-3)' }}>
              Already have an account? <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign in</Link>
            </div>
          </div>

          {/* STEP 2: ROLE */}
          <div className={`step-slide ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'exit' : ''} ${currentStep < 2 ? 'enter' : ''}`}>
            <div className="step-eyebrow">Step 2 of 5</div>
            <h1 className="step-title">What's your<br /><em>primary role?</em></h1>
            <p className="step-sub">We'll set up your workspace to match how you work. You can always change this later.</p>

            <div className="role-grid">
              {ROLES_DATA.map((r, i) => (
                <div key={i} className={`role-card ${selectedRole === r.value ? 'selected' : ''}`} onClick={() => setSelectedRole(r.value)}>
                  <div className="rc-check">{selectedRole === r.value ? '✓' : ''}</div>
                  <div className="rc-icon">{r.icon}</div>
                  <div className="rc-title">{r.label}</div>
                  <div className="rc-desc">{r.desc}</div>
                </div>
              ))}
            </div>

            <div className="field-label" style={{ marginBottom: 12 }}>How large is your team?</div>
            <div className="size-chips">
              {['Just me', '2–5 people', '6–15 people', '16–50 people', '50+ people'].map(s => (
                <div key={s} className={`size-chip ${teamSize === s ? 'selected' : ''}`} onClick={() => setTeamSize(s)}>{s}</div>
              ))}
            </div>
          </div>

          {/* STEP 3: PROJECT */}
          <div className={`step-slide ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'exit' : ''}`}>
            <div className="step-eyebrow">Step 3 of 5</div>
            <h1 className="step-title">Create your<br /><em>first project</em></h1>
            <p className="step-sub">Give it a name and optionally upload a 3D model. You can always add models later.</p>

            <div className="project-name-wrap">
              <input className="project-name-input" type="text" placeholder="e.g. Skyline Tower — Unit 14B" value={projectName} onChange={e => setProjectName(e.target.value)} />
            </div>

            <div className={`upload-zone ${uploadedFile ? 'has-file' : ''}`} onClick={() => !uploadedFile && setUploadedFile({ name: 'modern_concept.glb', size: '15.2 MB' })}>
              <div className="uz-icon">📦</div>
              <div className="uz-title">{uploadedFile ? '✓ Model uploaded' : 'Drop your 3D model here'}</div>
              <div className="uz-sub">{uploadedFile ? `${uploadedFile.name} (${uploadedFile.size})` : 'or click to browse files'}</div>
            </div>

            <div className="skip-model" onClick={() => setCurrentStep(4)}>Skip for now — I'll upload a model later</div>
          </div>

          {/* STEP 4: INVITE */}
          <div className={`step-slide ${currentStep === 4 ? 'active' : ''} ${currentStep > 4 ? 'exit' : ''}`}>
            <div className="step-eyebrow">Step 4 of 5</div>
            <h1 className="step-title">Invite your<br /><em>team</em></h1>
            <p className="step-sub">Add colleagues and clients to your workspace. They'll get an email with instructions to join.</p>

            <div className="invite-row">
              <input className="invite-email" type="email" placeholder="colleague@studio.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
              <select className="invite-role-sel" value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                <option value="architect">Architect</option>
                <option value="designer">Designer</option>
                <option value="client">Client</option>
                <option value="viewer">Viewer</option>
              </select>
              <button className="invite-add" onClick={addInvite}>+ Add</button>
            </div>

            <div className="skip-invite" onClick={() => setCurrentStep(5)} style={{ display: 'block', margin: '0 auto' }}>
              Skip — I'll invite people later
            </div>

            <div className="invited-list" style={{ marginTop: 24 }}>
              {invites.map((inv, i) => (
                <div key={i} className="invited-item">
                  <div className="ii-av" style={{ background: 'var(--ink)', color: 'white' }}>{inv.email.slice(0, 2).toUpperCase()}</div>
                  <div className="ii-email">{inv.email}</div>
                  <div className="ii-role">{inv.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 5: HEADSET */}
          <div className={`step-slide ${currentStep === 5 ? 'active' : ''}`}>
            <div className="step-eyebrow">Step 5 of 5</div>
            <h1 className="step-title">Connect your<br /><em>Meta Quest 3</em></h1>
            <p className="step-sub">Pair your headset to start running VR sessions. Takes about 2 minutes.</p>

            <div className="headset-card">
              <div className="hc-top" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div className="hc-icon" style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🥽</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Meta Quest 3</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--mono)' }}>Supported firmware: v63+</div>
                </div>
              </div>

              <div className="qr-wrap">
                <div className="qr-code">
                  {[1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1].map((v, i) => (
                    <div key={i} style={{ background: v ? 'var(--ink)' : 'white', borderRadius: 1 }}></div>
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', marginBottom: 6 }}>Scan with your headset</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>Open the Meta Quest browser and scan this code to install VR Architecture.</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[1, 2, 3].map(n => (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>{n}</div>
                        {n === 1 ? 'Put on your headset' : n === 2 ? 'Open the browser app' : 'Scan this QR code'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="headset-skip" onClick={handleNext}>
              <div style={{ fontSize: 24 }}>💻</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>I don't have a headset yet</div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Go to the dashboard — connect anytime from Settings</div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--ink-3)' }}>→</div>
            </div>
          </div>

          {/* COMPLETION */}
          <div className={`completion-screen ${showCompletion ? 'show' : ''}`}>
            <div style={{ fontSize: 48, marginBottom: 24 }}>🎉</div>
            <h2 className="step-title">You're all set,<br /><em>let's build.</em></h2>
            <p className="step-sub">Your workspace {studioName} is ready. Welcome to the future of architecture.</p>
            <button className="sf-next" style={{ padding: '16px 40px', fontSize: 16 }} onClick={() => navigate(getHomeForRole(user?.role || ROLES.ARCHITECT))}>
              Open your dashboard <ArrowRight />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        {
          !showCompletion && (
            <div className="step-footer">
              <button className="sf-back" onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}>
                {currentStep > 1 && '← Back'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div className="sf-dots">
                  {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className={`sf-dot ${currentStep === n ? 'active' : ''}`}></div>
                  ))}
                </div>
                <button className="sf-next" onClick={handleNext} disabled={isLoading}>
                  {isLoading ? 'Setting up...' : currentStep === 5 ? 'Finish setup ✓' : 'Continue'}
                  {currentStep < 5 && <span style={{ marginLeft: 8 }}>→</span>}
                </button>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
}
