import { useEffect, useMemo, useState } from 'react';
import { updateProfile as updateFirebaseProfile } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { adminRoles, ministryRoleLabel, ministryRoleOptions, roleLabel } from '../auth/roles';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { firebaseAuth, firestore } from '../lib/firebase';
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  NOTIFICATION_CATEGORIES,
  getBrowserNotificationPermission,
  getLocalPreferences,
  isBrowserNotificationSupported,
  requestBrowserNotificationPermission,
  setLocalPreferences,
} from '../services/notificationService';

function TextField({ label, value, onChange, placeholder, readOnly = false, type = 'text' }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
    </label>
  );
}

function findMatchingBranch(options, targetBranch) {
  if (!targetBranch || !options || !options.length) return targetBranch || '';
  const needle = `${targetBranch}`.trim().toLowerCase();
  const found = options.find(
    (opt) => `${opt.id}`.trim().toLowerCase() === needle || `${opt.label}`.trim().toLowerCase() === needle
  );
  return found ? found.id : targetBranch;
}

export default function ProfilePage() {
  const { user, roles, profile } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [submittingRequest, setSubmittingRequest] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [branchOptions, setBranchOptions] = useState([]);
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [office, setOffice] = useState('');
  const [ministryRoles, setMinistryRoles] = useState([]);
  const [requestBranch, setRequestBranch] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [requestReason, setRequestReason] = useState('');

  const [notificationPreferences, setNotificationPreferences] = useState(() => ({
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    ...getLocalPreferences(user?.uid),
    ...(profile?.notificationPreferences || {}),
  }));
  const [browserPermission, setBrowserPermission] = useState(() => getBrowserNotificationPermission());
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [prefMessage, setPrefMessage] = useState('');
  const [prefError, setPrefError] = useState('');

  useEffect(() => {
    if (user?.uid) {
      setNotificationPreferences({
        ...DEFAULT_NOTIFICATION_PREFERENCES,
        ...getLocalPreferences(user.uid),
        ...(profile?.notificationPreferences || {}),
      });
      setBrowserPermission(getBrowserNotificationPermission());
    }
  }, [user?.uid, profile?.notificationPreferences]);

  const savedBranch = profile?.branch || user?.branch || '';

  useEffect(() => {
    setName(profile?.displayName || user?.displayName || '');
    setOffice(profile?.office || user?.office || '');
    setMinistryRoles(Array.isArray(profile?.staff_positions) ? profile.staff_positions : []);
  }, [profile, user]);

  useEffect(() => {
    let active = true;

    async function loadBranches() {
      try {
        const snapshot = await getDocs(collection(firestore, 'branches'));
        const nextBranches = snapshot.docs
          .map((branchDoc) => {
            const data = branchDoc.data() || {};
            return {
              id: data.name || branchDoc.id,
              label: data.name || branchDoc.id,
            };
          })
          .sort((left, right) => left.label.localeCompare(right.label));

        if (active) {
          setBranchOptions(nextBranches);
        }
      } catch {
        if (active) {
          setBranchOptions([]);
        }
      }
    }

    loadBranches();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (savedBranch) {
      const matched = findMatchingBranch(branchOptions, savedBranch);
      setBranch(matched);
      setRequestBranch((current) => current || matched);
    }
  }, [savedBranch, branchOptions]);

  const currentRoles = useMemo(() => roles || [], [roles]);

  async function handleSaveProfile(event) {
    event.preventDefault();
    setSavingProfile(true);
    setError('');
    setMessage('');

    try {
      if (user?.displayName !== name) {
        await updateFirebaseProfile(firebaseAuth.currentUser, { displayName: name.trim() });
      }

      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        email: user.email || '',
        displayName: name.trim(),
        branch: branch.trim(),
        office: office.trim(),
        staff_positions: ministryRoles,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setMessage('Profile details saved.');
    } catch (profileError) {
      setError('The profile could not be saved right now. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleRequestSubmit(event) {
    event.preventDefault();
    setSubmittingRequest(true);
    setError('');
    setMessage('');

    try {
      await addDoc(collection(firestore, 'accessRequests'), {
        uid: user.uid,
        email: user.email || '',
        displayName: name.trim() || user.displayName || '',
        requestedBranch: requestBranch.trim(),
        requestedRoles: selectedRoles,
        reason: requestReason.trim(),
        currentRoles,
        status: 'pending',
        createdAt: serverTimestamp(),
        source: 'admin_profile',
      });
      setRequestReason('');
      setSelectedRoles([]);
      setMessage('Access request submitted for review.');
    } catch (requestError) {
      setError('The access request could not be sent right now. Please try again.');
    } finally {
      setSubmittingRequest(false);
    }
  }

  function toggleRole(role) {
    setSelectedRoles((existing) => (
      existing.includes(role)
        ? existing.filter((entry) => entry !== role)
        : [...existing, role]
    ));
  }

  function toggleMinistryRole(role) {
    setMinistryRoles((existing) => (
      existing.includes(role)
        ? existing.filter((entry) => entry !== role)
        : [...existing, role]
    ));
  }

  function togglePrefCategory(key) {
    setNotificationPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  async function handleToggleBrowserPush() {
    if (!isBrowserNotificationSupported()) {
      setPrefError('Browser notifications are not supported in this browser.');
      return;
    }

    if (notificationPreferences.browserNotifications) {
      setNotificationPreferences((current) => ({
        ...current,
        browserNotifications: false,
      }));
      return;
    }

    const permission = await requestBrowserNotificationPermission();
    setBrowserPermission(permission);
    if (permission === 'granted') {
      setNotificationPreferences((current) => ({
        ...current,
        browserNotifications: true,
      }));
      setPrefMessage('Browser notifications enabled.');
    } else {
      setPrefError('Browser notification permission was not granted. Check your browser settings.');
    }
  }

  async function handleSavePreferences(event) {
    event.preventDefault();
    if (!user?.uid) return;

    setSavingPreferences(true);
    setPrefMessage('');
    setPrefError('');

    try {
      await setDoc(
        doc(firestore, 'users', user.uid),
        {
          notificationPreferences,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setLocalPreferences(user.uid, notificationPreferences);
      setPrefMessage('Notification preferences saved.');
    } catch {
      setPrefError('Could not save notification preferences right now. Please try again.');
    } finally {
      setSavingPreferences(false);
    }
  }

  return (
    <main className="space-y-5 pb-6 lg:pr-1 lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Profile</p>
        <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Account settings and access requests</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Keep your personal details in sync, request a branch change, or ask for additional admin access from the same place.
        </p>
      </section>

      {(error || message) && (
        <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
          {error || message}
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <form data-tour-id="profile-details" onSubmit={handleSaveProfile} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Profile details</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Personal information</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Editable</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" />
            <TextField label="Email" value={user?.email || ''} readOnly placeholder="Email address" />
            <ChoiceDropdown
              label="Branch"
              value={branch}
              onChange={setBranch}
              placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
              options={branchOptions}
              disabled={!branchOptions.length}
            />
            <TextField label="Office" value={office} onChange={(event) => setOffice(event.target.value)} placeholder="Office or team" />
          </div>

          <section className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ministry role</p>
                <h3 className="mt-2 text-lg font-semibold text-white">Choose the role you play in ministry</h3>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {ministryRoles.length ? `${ministryRoles.length} selected` : 'None selected'}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ministryRoleOptions.map((option) => {
                const active = ministryRoles.includes(option.id);
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => toggleMinistryRole(option.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'}`}
                  >
                    {ministryRoleLabel(option.id)}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingProfile ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </form>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Current roles</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Access snapshot</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{currentRoles.length} roles</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {currentRoles.length ? currentRoles.map((role) => (
              <span key={role} className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
                {roleLabel(role)}
              </span>
            )) : <span className="text-sm text-slate-400">No roles loaded</span>}
          </div>

          <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Ministry role</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ministryRoles.length ? ministryRoles.map((role) => (
                <span key={role} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
                  {ministryRoleLabel(role)}
                </span>
              )) : <span className="text-sm text-slate-400">No ministry role selected</span>}
            </div>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Requests</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Ask for branch reassignment or additional admin access here. Requests are stored separately for review.
            </p>
          </div>
        </section>
      </section>

      <form data-tour-id="profile-access-request" onSubmit={handleRequestSubmit} className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Access requests</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Branch and role request</h2>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Pending review</span>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <ChoiceDropdown
            label="Requested branch"
            value={requestBranch}
            onChange={setRequestBranch}
            placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
            options={branchOptions}
            disabled={!branchOptions.length}
          />
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Requested roles</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {adminRoles.map((role) => {
                const active = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'}`}
                  >
                    {roleLabel(role)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reason</span>
          <textarea
            value={requestReason}
            onChange={(event) => setRequestReason(event.target.value)}
            placeholder="Explain why you need the branch or role change"
            rows={4}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
          />
        </label>

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-slate-400">Email is read-only. Branch and roles are submitted as requests for review.</p>
          <button
            type="submit"
            disabled={submittingRequest}
            className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submittingRequest ? 'Submitting…' : 'Send request'}
          </button>
        </div>
      </form>

      {/* Notifications Preferences */}
      <form data-tour-id="profile-notification-preferences" onSubmit={handleSavePreferences} className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Settings</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Notifications Preferences</h2>
            <p className="mt-1 text-sm text-slate-300">
              Customize which activities notify you in the admin app and enable browser push alerts.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {Object.values(notificationPreferences).filter(Boolean).length} enabled
          </span>
        </div>

        {(prefError || prefMessage) && (
          <div className={`mt-4 rounded-[1.25rem] border p-3.5 text-sm ${prefError ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {prefError || prefMessage}
          </div>
        )}

        {/* Browser Notifications Controller */}
        <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">Desktop & Browser Notifications</h3>
                <span className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider ${
                  browserPermission === 'granted'
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : browserPermission === 'denied'
                    ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                    : 'border border-amber-500/30 bg-amber-500/10 text-amber-300'
                }`}>
                  {browserPermission}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Receive instant pop-up notifications on your desktop or device when new records or updates arrive.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleBrowserPush}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                notificationPreferences.browserNotifications
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'border border-white/15 bg-white/5 text-slate-200 hover:border-brand-gold hover:text-brand-gold'
              }`}
            >
              {notificationPreferences.browserNotifications ? '✓ Enabled' : 'Enable browser alerts'}
            </button>
          </div>
        </div>

        {/* Category Toggles Grid */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {NOTIFICATION_CATEGORIES.map((category) => {
            const isEnabled = notificationPreferences[category.key] !== false;
            return (
              <div
                key={category.key}
                onClick={() => togglePrefCategory(category.key)}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-[1.4rem] border p-4 transition ${
                  isEnabled
                    ? 'border-brand-gold/30 bg-brand-gold/5'
                    : 'border-white/5 bg-slate-950/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">{category.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400 line-clamp-2">{category.description}</p>
                </div>
                <button
                  type="button"
                  aria-pressed={isEnabled}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isEnabled ? 'bg-brand-gold' : 'bg-slate-700'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                      isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Preferences directly control your admin header alerts, sidebar badges, and browser push alerts.
          </p>
          <button
            type="submit"
            disabled={savingPreferences}
            className="rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingPreferences ? 'Saving…' : 'Save notification preferences'}
          </button>
        </div>
      </form>
    </main>
  );
}
