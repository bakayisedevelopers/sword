import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { useAuth } from '../auth/AuthProvider';
import { adminRoles, highestRole, ministryRoleLabel, ministryRoleOptions, roleLabel } from '../auth/roles';
import { firestore } from '../lib/firebase';

function TextField({ label, value, onChange, placeholder, readOnly = false, type = 'text' }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
    </label>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'bg-brand-gold text-slate-950'
          : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'
      }`}
    >
      {children}
    </button>
  );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleString();
}

function normalizeUserRoleList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return [];
}

function userNameLabel(userDoc) {
  const name = `${userDoc?.displayName || ''}`.trim();
  if (name) {
    return name;
  }

  const email = `${userDoc?.email || ''}`.trim();
  if (email.includes('@')) {
    const localPart = email.split('@')[0] || '';
    if (localPart) {
      return `${localPart.charAt(0).toUpperCase()}${localPart.slice(1)}`;
    }
  }

  return 'No Name';
}

function partnerName(partner) {
  const name = `${partner?.name || ''} ${partner?.surname || ''}`.trim();
  return name || partner?.email || 'Unnamed partner';
}

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

export default function UsersDetailPage() {
  const { userId } = useParams();
  const { roles } = useAuth();
  const canEdit = roles.includes('super_admin') || roles.includes('global_editor');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userDoc, setUserDoc] = useState(null);
  const [branchOptions, setBranchOptions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [partnerMatches, setPartnerMatches] = useState([]);
  const [draft, setDraft] = useState({
    displayName: '',
    email: '',
    branch: '',
    office: '',
    bio: '',
    roles: [],
    staff_positions: [],
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [userSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'users', userId)),
          getDocs(collection(firestore, 'branches')),
        ]);

        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => {
            const data = branchDoc.data() || {};
            return {
              id: data.name || branchDoc.id,
              label: data.name || branchDoc.id,
            };
          })
          .sort((left, right) => left.label.localeCompare(right.label));

        const nextUser = userSnapshot.exists()
          ? { id: userSnapshot.id, ...userSnapshot.data(), branchOptions: nextBranches }
          : null;

        let nextRequests = [];
        try {
          const requestsSnapshot = await getDocs(collection(firestore, 'accessRequests'));
          nextRequests = requestsSnapshot.docs
            .map((requestDoc) => ({ id: requestDoc.id, ...requestDoc.data() }))
            .filter((request) => request.uid === userId || request.email === nextUser?.email);
        } catch {
          nextRequests = [];
        }

        let nextPartnerMatches = [];
        if (nextUser?.email) {
          try {
            const partnersSnapshot = await getDocs(query(collection(firestore, 'partners'), where('email', '==', nextUser.email)));
            nextPartnerMatches = partnersSnapshot.docs
              .map((partnerDoc) => ({ id: partnerDoc.id, ref: partnerDoc.ref, ...partnerDoc.data() }))
              .filter((partnerDoc) => !partnerDoc.userId && !partnerDoc.linkedUserId);
          } catch {
            nextPartnerMatches = [];
          }
        }

        if (active) {
          setUserDoc(nextUser);
          setBranchOptions(nextBranches);
          setRequests(nextRequests);
          setPartnerMatches(nextPartnerMatches);
          setDraft({
            displayName: nextUser?.displayName || '',
            email: nextUser?.email || '',
            branch: nextUser?.branch || '',
            office: nextUser?.office || '',
            bio: nextUser?.bio || '',
            roles: normalizeUserRoleList(nextUser?.roles),
            staff_positions: normalizeUserRoleList(nextUser?.staff_positions),
          });
        }
      } catch {
        if (active) {
          setUserDoc(null);
          setBranchOptions([]);
          setRequests([]);
          setPartnerMatches([]);
          setError('The user profile could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (userId) {
      loadData();
    }

    return () => {
      active = false;
    };
  }, [userId]);

  const linked = Boolean(userDoc?.authAccount || userDoc?.uid);
  const highest = highestRole(draft.roles);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!userDoc) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await setDoc(doc(firestore, 'users', userDoc.id), {
        uid: userDoc.uid || userDoc.id,
        email: draft.email.trim(),
        displayName: draft.displayName.trim(),
        branch: draft.branch.trim(),
        office: draft.office.trim(),
        bio: draft.bio.trim(),
        roles: draft.roles,
        staff_positions: draft.staff_positions,
        authAccount: Boolean(userDoc.authAccount || userDoc.uid),
        authStatus: userDoc.authAccount || userDoc.uid ? 'linked' : 'pending_auth',
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setMessage(`Saved ${draft.displayName || draft.email || userDoc.id}.`);
    } catch {
      setError('The user could not be saved right now. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkPartner(partner) {
    if (!userDoc || !partner) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const userRef = doc(firestore, 'users', userDoc.id);
      const partnerRef = doc(firestore, 'partners', partner.id);
      await Promise.all([
        setDoc(userRef, {
          partnerId: partner.id,
          partnerRef,
          partnerDoc: partnerRef,
          partnerLinkedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true }),
        setDoc(partnerRef, {
          userId: userDoc.id,
          linkedUserId: userDoc.id,
          userRef,
          linkedUserRef: userRef,
          linkedEmail: userDoc.email || partner.email || '',
          userLinkedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ]);
      setUserDoc((current) => ({ ...current, partnerId: partner.id, partnerDoc: partnerRef, partnerRef }));
      setPartnerMatches((current) => current.filter((entry) => entry.id !== partner.id));
      setMessage('Partner record linked to this user.');
    } catch {
      setError('The partner record could not be linked right now.');
    } finally {
      setSaving(false);
    }
  }

  if (!userId) {
    return <Navigate to="/workspace/users" replace />;
  }

  if (!loading && !userDoc) {
    return <Navigate to="/workspace/users" replace />;
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Users</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">User details</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              View and edit the selected user’s account, branch, ministry roles, and access roles.
            </p>
          </div>
          <Link to="/workspace/users" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
            Back to users
          </Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && userDoc && (
          <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">User profile</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{userNameLabel(userDoc)}</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${linked ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200'}`}>
                  {linked ? 'Auth linked' : 'No auth account'}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  Highest role: {highest ? roleLabel(highest) : 'None'}
                </span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Display name" value={draft.displayName} onChange={(event) => setDraft((current) => ({ ...current, displayName: event.target.value }))} placeholder="Full name" />
              <TextField label="Email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" />
              <ChoiceDropdown
                label="Branch"
                value={draft.branch}
                onChange={(value) => setDraft((current) => ({ ...current, branch: value }))}
                placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
                options={branchOptions}
                disabled={!branchOptions.length}
              />
              <TextField label="Office" value={draft.office} onChange={(event) => setDraft((current) => ({ ...current, office: event.target.value }))} placeholder="Office or team" />
            </div>

            <TextAreaField label="Bio" value={draft.bio} onChange={(event) => setDraft((current) => ({ ...current, bio: event.target.value }))} placeholder="Short staff bio" rows={4} />

            <div className="grid gap-5 xl:grid-cols-2">
              <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry roles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ministryRoleOptions.map((option) => (
                    <Pill
                      key={option.id}
                      active={draft.staff_positions.includes(option.id)}
                      onClick={() => setDraft((current) => ({ ...current, staff_positions: toggleValue(current.staff_positions, option.id) }))}
                    >
                      {option.label}
                    </Pill>
                  ))}
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin access roles</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {adminRoles.map((role) => (
                    <Pill
                      key={role}
                      active={draft.roles.includes(role)}
                      onClick={() => setDraft((current) => ({ ...current, roles: toggleValue(current.roles, role) }))}
                    >
                      {roleLabel(role)}
                    </Pill>
                  ))}
                </div>
              </section>
            </div>

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Account status</p>
                  <p className="mt-1 text-sm text-slate-300">
                    {linked ? 'This user has an auth account or an auth-linked profile document.' : 'This is only a Firestore user document for now.'}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                  Last login: {formatDate(userDoc.lastLoginAt)}
                </span>
              </div>
            </section>

            {partnerMatches.length ? (
              <section className="rounded-[1.6rem] border border-brand-gold/20 bg-brand-gold/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Possible partner match</p>
                    <p className="mt-2 text-sm leading-6 text-slate-200">This user email matches partner records that are not linked yet.</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {partnerMatches.map((partner) => (
                    <article key={partner.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div>
                        <p className="font-semibold text-white">{partnerName(partner)}</p>
                        <p className="mt-1 text-xs text-slate-400">{partner.branch || 'No branch'} · {partner.cell || 'No cell'}</p>
                      </div>
                      <button type="button" disabled={saving} onClick={() => handleLinkPartner(partner)} className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50">
                        Link partner
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Requests</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{requests.length} linked</span>
              </div>
              <div className="mt-4 space-y-3">
                {requests.length ? requests.map((request) => (
                  <article key={request.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-semibold text-white">{request.status || 'pending'}</p>
                      <span className="text-xs text-slate-400">{formatDate(request.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{request.reason || request.message || 'No reason supplied.'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(request.requestedRoles || []).map((role) => (
                        <span key={role} className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
                          {roleLabel(role)}
                        </span>
                      ))}
                    </div>
                  </article>
                )) : (
                  <p className="text-sm text-slate-400">No requests are linked to this user yet.</p>
                )}
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save user'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
