import { useState, type FormEvent, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getHomeForRole } from '@/constants/roles';
import { renderRoom } from './roomRenderer';
import '@/styles/login.css';

/**
 * 🏛️ LoginPage — Immersive Building Animation Design
 * Incorporates full furniture sliding logic, detailed rendering of books, cushions, orbs,
 * and ambient lighting from the premium design.
 */
export default function LoginPage() {
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [emailOk, setEmailOk] = useState(false);
  const [pwLen, setPwLen] = useState(0);
  const [pwShown, setPwShown] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Refs for animation state (persistent drawing state)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animStateRef = useRef({
    currentT: 0.0,
    targetT: 0.0,
    slideP: [0, 0, 0, 0, 0, 0, 0], // slide progress for objects 1-6
    W: 0,
    H: 0
  });

  const rafIdRef = useRef<number | null>(null);
  const slideRafRef = useRef<number | null>(null);
  const lampOnRef = useRef(false);
  const pwLenRef = useRef(0);
  const errorFlashRef = useRef(0);



  // Sync state to refs and calculate target animation value (T)
  useEffect(() => {
    lampOnRef.current = lampOn;
    pwLenRef.current = pwLen;

    const s = animStateRef.current;
    const calcT = () => {
      const base = emailOk ? 0.40 : 0.18;
      const fromPw = (emailOk && pwLen > 0) ? Math.max(0, Math.min(0.48, pwLen * 0.052)) : 0;
      return Math.max(0, Math.min(0.88, base + fromPw));
    };

    let target = calcT();
    if (lampOn) target = Math.max(target, 0.76);
    if (isSubmitting || isSuccess) target = 1.0;
    s.targetT = target;

    kickAnim();
    kickSlide();
  }, [emailOk, pwLen, lampOn, isSubmitting, isSuccess]);

  // Animation activation mechanisms
  const kickAnim = () => {
    if (!rafIdRef.current) rafIdRef.current = requestAnimationFrame(animLoop);
  };
  const kickSlide = () => {
    if (!slideRafRef.current) slideRafRef.current = requestAnimationFrame(tickSlide);
  };

  const animLoop = () => {
    const s = animStateRef.current;
    s.currentT += (s.targetT - s.currentT) * 0.035;
    if (Math.abs(s.currentT - s.targetT) > 0.0005) {
      rafIdRef.current = requestAnimationFrame(animLoop);
    } else {
      s.currentT = s.targetT;
      rafIdRef.current = null;
    }
    renderCanvas();
  };

  const tickSlide = () => {
    const s = animStateRef.current;
    const curPwLen = pwLenRef.current;
    let anyMoving = false;
    for (let i = 1; i <= 6; i++) {
      const target = curPwLen >= i ? 1 : 0;
      s.slideP[i] += (target - s.slideP[i]) * 0.10;
      if (Math.abs(s.slideP[i] - target) > 0.002) anyMoving = true;
    }
    renderCanvas();
    if (anyMoving) {
      slideRafRef.current = requestAnimationFrame(tickSlide);
    } else {
      slideRafRef.current = null;
    }
  };

  // ─────────────────────────────────────────────
  //  CANVAS RENDERING — delegates to roomRenderer.ts
  // ─────────────────────────────────────────────
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    renderRoom(ctx, animStateRef.current, lampOnRef.current, errorFlashRef.current);
  };

  // Resize handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const s = animStateRef.current;
      s.W = canvas.width = parent.offsetWidth;
      s.H = canvas.height = parent.offsetHeight;
      renderCanvas();
    };

    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Auth Redirect
  useEffect(() => {
    // Only auto-redirect if we are already authenticated AND NOT currently submitting a login form
    if (isAuthenticated && user && !isSuccess && !isSubmitting) {
      navigate(getHomeForRole(user.role));
    }
  }, [isAuthenticated, user, navigate, isSuccess, isSubmitting]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setEmailOk(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
    kickAnim();
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    setPwLen(val.length);
    kickAnim();
    kickSlide();
  };

  const togglePw = () => {
    const nextVal = !pwShown;
    setPwShown(nextVal);
    setLampOn(nextVal);
    kickAnim();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailOk || !pwLen) return;
    setLoginError(null);
    setIsSubmitting(true);
    kickAnim();

    try {
      const loggedInUser = await login({ email, password });
      if (loggedInUser) {
        setIsSuccess(true);
        setTimeout(() => navigate(getHomeForRole(loggedInUser.role)), 2800);
      } else {
        setIsSubmitting(false);
        setLoginError('Invalid credentials. Please try again.');
        triggerErrorFlash();
        kickAnim();
      }
    } catch (err: any) {
      const errMsg = err?.message || 'An unexpected error occurred. Please try again.';
      setLoginError(errMsg);
      setIsSubmitting(false);
      triggerErrorFlash();
      kickAnim();
    }
  };

  // ─── ERROR FLASH: lamp blinks red twice then returns ───
  const triggerErrorFlash = () => {
    // Turn lamp on so the flash is visible
    setLampOn(true);
    lampOnRef.current = true;
    animStateRef.current.targetT = Math.max(animStateRef.current.targetT, 0.76);
    kickAnim();

    const flashSequence = [
      { delay: 0, value: 1 },  // RED ON
      { delay: 200, value: 0 },  // OFF
      { delay: 400, value: 1 },  // RED ON again
      { delay: 600, value: 0 },  // OFF — back to normal
    ];

    flashSequence.forEach(({ delay, value }) => {
      setTimeout(() => {
        errorFlashRef.current = value;
        renderCanvas();
      }, delay);
    });

    // After the flash, restore lamp to its pre-flash state
    setTimeout(() => {
      setLampOn(pwShown);
      lampOnRef.current = pwShown;
      errorFlashRef.current = 0;
      renderCanvas();
    }, 800);
  };

  const curT = animStateRef.current.currentT;
  const isFull = curT >= 0.68;
  const statusClass = `room-status ${isFull ? 'full' : emailOk ? 'lit' : ''}`;

  return (
    <div className="login-container">
      <div className="left-panel">
        <div className="lp-logo">
          <div className="lp-logo-sq">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
          </div>
          <span className="lp-logo-name">VR Architecture</span>
        </div>
        <div className="room">
          <canvas ref={canvasRef}></canvas>
          <div className={statusClass}></div>
        </div>
      </div>

      <div className="right-panel">
        <div className="rp-topbar">
          <span className="rp-topbar-hint">New to VR Architecture?</span>
          <Link to="/signup" className="rp-topbar-link">Create account →</Link>
        </div>
        <div className="rp-body">
          <div className="eyebrow">Sign in</div>
          <h1 className="rp-title">Step inside<br /><em>your space.</em></h1>
          <p className="rp-sub">Enter your credentials and watch the room come to life.</p>

          <form onSubmit={handleSubmit}>
            {loginError && <div className="login-error-toast">⚠ {loginError}</div>}

            <div className="field-group">
              <label className="field-label">Email address</label>
              <input type="email" className={`field-input ${emailOk ? 'filled' : ''} ${isFull ? 'complete' : ''}`} placeholder="you@studio.com" value={email} onChange={handleEmailChange} required />
            </div>

            <div className="field-group">
              <label className="field-label">
                Password
                <span className="field-label-right" onClick={() => navigate('/forgot-password')}>Forgot password?</span>
              </label>
              <div className="pw-wrap">
                <input type={pwShown ? "text" : "password"} className={`pw-input ${isFull ? 'complete' : (pwLen > 0 ? 'active' : '')}`} placeholder="Enter password" value={password} onChange={handlePwChange} required />
                <button className={`pw-toggle ${pwShown ? 'revealed' : ''}`} type="button" onClick={togglePw}>
                  <svg className="pw-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {pwShown ? (
                      <g key="eye-open">
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </g>
                    ) : (
                      <g key="eye-closed">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </g>
                    )}
                  </svg>
                  <span className="pw-blur-label">{pwShown ? 'hide' : 'show'}</span>
                </button>
              </div>
              <div className="ray-progress">
                <div className="ray-bar-track">
                  <div className={`ray-bar-fill ${isFull ? 'success' : (pwLen > 0 || lampOn ? 'active' : '')}`} style={{ width: `${Math.round(curT * 100)}%` }}></div>
                </div>
              </div>
            </div>

            <button className={`btn-signin ${isSubmitting ? 'loading' : ''} ${isSuccess ? 'success-state' : ''}`} type="submit" disabled={isSubmitting}>
              <span className="btn-text">{isSuccess ? '✓  Welcome back' : 'Enter workspace'}</span>
            </button>
          </form>

          <div className="or-divider">or</div>
          <button className="btn-sso" type="button">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
            </svg>
            Continue with SSO
          </button>
          <div className="forgot-link">Having trouble? <Link to="/support">Contact admin</Link></div>
        </div>
      </div>

      <div className={`success-overlay ${isSuccess ? 'show' : ''}`} id="successOverlay">
        <div className="success-title">Welcome back.</div>
        <div className="success-sub">Loading workspace…</div>
      </div>
    </div>
  );
}
