import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';
import swordLogo from '@ssmi/flutter-assets/sword_logo.png';

const copy = {
  signIn: ['Welcome back', 'Sign in to your workspace.', 'Manage the Sword & Spirit digital experience with your secure admin account.', 'Sign in'],
  signUp: ['Create your account', 'Start your admin access request.', 'Create your account, then ask an SSMI super administrator to grant your role.', 'Create account'],
  activation: ['Activate account', 'Create your password.', 'We found your profile in the platform. Create a password to activate your login account.', 'Activate account'],
  reset: ['Account recovery', 'Reset your password.', 'Enter your email address and we will send you a secure password-reset link.', 'Send reset link'],
};

function authErrorMessage(error, action) {
  if (error?.code === 'auth/email-already-in-use') return 'An account already exists for this email. Sign in instead.';
  if (error?.code === 'auth/weak-password') return 'Choose a stronger password with at least six characters.';
  if (error?.code === 'auth/invalid-email') return 'Enter a valid email address.';
  if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(error?.code)) return 'Your email or password is incorrect.';
  return `We could not ${action}. Please try again.`;
}

function GoogleMark() {
  return <span className="auth-google-mark" aria-hidden="true">G</span>;
}

function Icon({ name }) {
  const paths = name === 'eye'
    ? <><path d="M2.5 12s3.4-5.5 9.5-5.5S21.5 12 21.5 12s-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="2.5" /></>
    : <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>;
  return <svg className="auth-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths}</svg>;
}

export default function SignInPage() {
  const { user, isAuthorized, signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState('signIn');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [eyebrow, title, description, submitLabel] = copy[mode];

  if (user && isAuthorized) return <Navigate to={location.state?.from || '/'} replace />;
  if (user && !isAuthorized) return <Navigate to="/access-denied" replace />;

  function chooseMode(nextMode) {
    setMode(nextMode);
    setError('');
    setNotice('');
    if (nextMode !== 'activation') setPendingProfile(null);
    setConfirmPassword('');
  }

  async function checkPendingProfile() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes('@')) return null;

    setCheckingProfile(true);
    try {
      const snapshot = await getDocs(query(collection(firestore, 'users'), where('email', '==', normalizedEmail)));
      const match = snapshot.docs
        .map((userDoc) => ({ id: userDoc.id, ...userDoc.data() }))
        .find((profileDoc) => profileDoc.authAccount !== true && profileDoc.authStatus !== 'migrated');

      if (match) {
        setPendingProfile(match);
        setName(match.displayName || `${match.name || ''} ${match.surname || ''}`.trim() || name);
        setMode('activation');
        setNotice('We found your profile. Create a password to activate your account.');
      }
      return match || null;
    } catch {
      return null;
    } finally {
      setCheckingProfile(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'activation') {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        await signUp(name || pendingProfile?.displayName || '', email.trim(), password);
      } else if (mode === 'signUp') await signUp(name, email.trim(), password);
      else if (mode === 'reset') {
        await resetPassword(email.trim());
        setNotice('Your password-reset email is on its way. Check your inbox and spam folder.');
      } else {
        const match = await checkPendingProfile();
        if (match) return;
        await signIn(email.trim(), password);
      }
    } catch (authError) {
      const action = mode === 'reset' ? 'send the reset link' : mode === 'signUp' || mode === 'activation' ? 'create your account' : 'sign you in';
      setError(authErrorMessage(authError, action));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleAuth() {
    setSubmitting(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (googleError) {
      if (googleError.code !== 'auth/popup-closed-by-user') {
        setError('Google access could not be completed. Confirm that Google is enabled in Firebase Authentication and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-background" />
      <section className="auth-story">
        <div className="auth-dot-grid" />
        <div className="auth-brand">
          <img src={swordLogo} alt="Sword & Spirit Ministries" className="auth-logo" />
          <div><p>Sword & Spirit</p><span>Administration workspace</span></div>
        </div>
        <div className="auth-story-copy">
          <div className="auth-orb" />
          <p>A secure content studio</p>
          <h2>A calm place to lead what people see.</h2>
          <span>Publish with intention, protect sensitive information, and keep every branch connected to the same trusted source.</span>
        </div>
        <small>© {new Date().getFullYear()} Sword & Spirit Ministries</small>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand"><img src={swordLogo} alt="Sword & Spirit Ministries" /><p>Secure admin</p></div>
          {mode !== 'reset' && mode !== 'activation' && <div className="auth-mode-tabs"><button type="button" onClick={() => chooseMode('signIn')} className={mode === 'signIn' ? 'active' : ''}>Sign in</button><button type="button" onClick={() => chooseMode('signUp')} className={mode === 'signUp' ? 'active' : ''}>Sign up</button></div>}
          {mode === 'reset' && <button type="button" onClick={() => chooseMode('signIn')} className="auth-back"><Icon name="back" />Back to sign in</button>}
          {mode === 'activation' && <button type="button" onClick={() => chooseMode('signIn')} className="auth-back"><Icon name="back" />Back to sign in</button>}
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          <form onSubmit={handleSubmit}>
            {mode === 'signUp' && <label>Full name<input className="auth-input" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></label>}
            {mode === 'activation' && <label>Full name<input className="auth-input" type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></label>}
            <label>Email address<input className="auth-input" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} onBlur={mode === 'signIn' ? checkPendingProfile : undefined} placeholder="you@example.com" readOnly={mode === 'activation'} required /></label>
            {mode !== 'reset' && <label>Password<span className="auth-password"><input className="auth-input" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signUp' ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" minLength="6" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} title={showPassword ? 'Hide password' : 'Show password'}><Icon name="eye" /></button></span></label>}
            {mode === 'activation' && <label>Confirm password<input className="auth-input" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="••••••••" minLength="6" required /></label>}
            {mode === 'signIn' && <button type="button" onClick={() => chooseMode('reset')} className="auth-forgot">Forgot password?</button>}
            {error && <p className="auth-message auth-error">{error}</p>}
            {notice && <p className="auth-message auth-notice">{notice}</p>}
            <button disabled={submitting || checkingProfile} className="auth-submit" type="submit">{submitting || checkingProfile ? 'Please wait…' : submitLabel}</button>
          </form>
          {mode !== 'reset' && mode !== 'activation' && <><div className="auth-divider">or continue with</div><button disabled={submitting} onClick={handleGoogleAuth} className="auth-google" type="button"><GoogleMark />Continue with Google</button>{mode === 'signIn' && <p className="auth-role-note">A new account needs an SSMI super administrator to grant its admin role before it can access the workspace.</p>}</>}
        </div>
      </section>
    </main>
  );
}
