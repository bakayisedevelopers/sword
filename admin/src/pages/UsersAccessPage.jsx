import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { useAuth } from '../auth/AuthProvider';
import { adminRoles, highestRole, ministryRoleLabel, ministryRoleOptions, roleLabel } from '../auth/roles';
import { firestore } from '../lib/firebase';

const emptyDraft = {
  displayName: '',
  email: '',
  branch: '',
  office: '',
  bio: '',
  roles: [],
  staff_positions: [],
};

const adminRoleOptions = adminRoles.map((role) => ({
  id: role,
  label: roleLabel(role),
}));

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

function Modal({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90dvh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-brand-gold"
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
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

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

function requestNameLabel(request) {
  return request?.displayName || request?.email || 'Unnamed request';
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 text-slate-400 transition group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M7 4l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function UsersAccessPage() {
  const { roles, profile } = useAuth();
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const canReviewBranchRequests = canManageAll || roles.includes('branch_editor');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({ ...emptyDraft });
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const userQueries = canManageAll
          ? [query(collection(firestore, 'users'))]
          : branchScopes.map((branch) => query(collection(firestore, 'users'), where('branch', '==', branch)));
        const requestQueries = canManageAll
          ? [query(collection(firestore, 'accessRequests'), where('status', '==', 'pending'))]
          : branchScopes.map((branch) => query(collection(firestore, 'accessRequests'), where('status', '==', 'pending'), where('requestedBranch', '==', branch)));

        const [usersSnapshots, branchesSnapshot, requestSnapshots] = await Promise.all([
          userQueries.length ? Promise.all(userQueries.map((userQuery) => getDocs(userQuery))) : Promise.resolve([]),
          getDocs(collection(firestore, 'branches')),
          canReviewBranchRequests && requestQueries.length ? Promise.all(requestQueries.map((requestQuery) => getDocs(requestQuery))) : Promise.resolve([]),
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

        const nextUsers = usersSnapshots.flatMap((snapshot) => snapshot.docs)
          .map((userDoc) => {
            const data = userDoc.data() || {};
            return {
              id: userDoc.id,
              ...data,
              branchOptions: nextBranches,
            };
          })
          .filter((userDoc, index, allUsers) => allUsers.findIndex((item) => item.id === userDoc.id) === index)
          .filter((userDoc) => canManageAll || `${userDoc.branch || ''}`.trim())
          .sort((left, right) => {
            const leftRole = highestRole(left.roles || []);
            const rightRole = highestRole(right.roles || []);
            const roleDifference = adminRoles.indexOf(leftRole || 'reports_viewer') - adminRoles.indexOf(rightRole || 'reports_viewer');
            if (roleDifference !== 0) {
              return roleDifference;
            }

            return `${left.displayName || left.email || left.id}`.localeCompare(`${right.displayName || right.email || right.id}`);
          });
        const nextRequests = requestSnapshots.flatMap((snapshot) => snapshot.docs)
          .map((requestDoc) => ({ id: requestDoc.id, ...requestDoc.data() }))
          .filter((requestDoc, index, allRequests) => allRequests.findIndex((item) => item.id === requestDoc.id) === index)
          .sort((left, right) => {
            const leftDate = typeof left.createdAt?.toDate === 'function' ? left.createdAt.toDate() : new Date(left.createdAt || 0);
            const rightDate = typeof right.createdAt?.toDate === 'function' ? right.createdAt.toDate() : new Date(right.createdAt || 0);
            return rightDate.getTime() - leftDate.getTime();
          });

        if (active) {
          setUsers(nextUsers);
          setAccessRequests(nextRequests);
          setBranchOptions(nextBranches);
        }
      } catch {
        if (active) {
          setUsers([]);
          setAccessRequests([]);
          setBranchOptions([]);
          setError('The users list could not be loaded. Check your admin role claims and Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, [branchScopes, canManageAll, canReviewBranchRequests]);

  async function handleCreateUser(event) {
    event.preventDefault();
    if (!createDraft.email.trim()) {
      setError('Enter an email address first.');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        uid: '',
        email: createDraft.email.trim(),
        displayName: createDraft.displayName.trim(),
        branch: createDraft.branch.trim(),
        office: createDraft.office.trim(),
        bio: createDraft.bio.trim(),
        roles: createDraft.roles,
        staff_positions: createDraft.staff_positions,
        authAccount: false,
        authStatus: 'pending_auth',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const created = await addDoc(collection(firestore, 'users'), payload);
      const nextUser = { id: created.id, ...payload, branchOptions };
      setUsers((existing) => [...existing, nextUser].sort((left, right) => {
        const leftRole = highestRole(left.roles || []);
        const rightRole = highestRole(right.roles || []);
        const roleDifference = adminRoles.indexOf(leftRole || 'reports_viewer') - adminRoles.indexOf(rightRole || 'reports_viewer');
        if (roleDifference !== 0) {
          return roleDifference;
        }

        return `${left.displayName || left.email || left.id}`.localeCompare(`${right.displayName || right.email || right.id}`);
      }));
      setCreateDraft({ ...emptyDraft });
      setCreateOpen(false);
      setMessage(`Created ${createDraft.email.trim()}.`);
    } catch {
      setError('The user could not be created right now. Please try again.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Partners</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Users</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
              Manage staff profiles, ministry roles, admin access, auth-linked accounts, and requests from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
          >
            Create user
          </button>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
              <button type="button" onClick={() => setActiveTab('users')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'users' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>All Users</button>
              <button type="button" onClick={() => setActiveTab('requests')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'requests' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>New Requests</button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{activeTab === 'users' ? 'User list' : 'Access requests'}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{activeTab === 'users' ? 'People and accounts' : 'Pending role requests'}</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {loading ? 'Loading…' : activeTab === 'users' ? `${users.length} profiles` : `${accessRequests.length} pending`}
            </span>
          </div>

          <div className="space-y-3">
            {activeTab === 'users' ? users.map((userDoc) => {
              const label = userNameLabel(userDoc);
              const userRoles = Array.isArray(userDoc.roles) ? userDoc.roles : [];
              const ministryPositions = Array.isArray(userDoc.staff_positions) ? userDoc.staff_positions : [];
              const primaryRole = highestRole(userRoles);

              return (
                <Link
                  key={userDoc.id}
                  to={`/workspace/users/${userDoc.id}`}
                  className="group flex w-full items-center justify-between rounded-[1.4rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-left transition hover:border-brand-gold/40"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-white">{label}</p>
                      {userDoc.branch && (
                        <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-gold">
                          {userDoc.branch}
                        </span>
                      )}
                      {primaryRole && (
                        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium text-slate-200">
                          {roleLabel(primaryRole)}
                        </span>
                      )}
                      {userDoc.office && (
                        <span className="text-[11px] text-slate-400">
                          · {userDoc.office}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      {userDoc.email && <span className="truncate">{userDoc.email}</span>}
                      {userRoles.length > 1 && (
                        <span className="hidden sm:inline text-slate-500">
                          ({userRoles.map(roleLabel).join(', ')})
                        </span>
                      )}
                      {ministryPositions.length > 0 && (
                        <div className="hidden flex-wrap gap-1.5 md:flex">
                          {ministryPositions.map((pos) => (
                            <span key={pos} className="rounded-md border border-white/5 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                              {ministryRoleLabel(pos)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ChevronIcon />
                </Link>
              );
            }) : accessRequests.map((request) => (
              <Link
                key={request.id}
                to={`/workspace/users/requests/${request.id}`}
                className="group flex w-full items-center justify-between rounded-[1.4rem] border border-white/10 bg-slate-950/45 px-4 py-4 text-left transition hover:border-brand-gold/40"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-white">{requestNameLabel(request)}</p>
                    {request.requestedBranch && (
                      <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-gold">
                        {request.requestedBranch}
                      </span>
                    )}
                    <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200 uppercase tracking-wider">
                      {request.status || 'pending'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    {request.email && <span>{request.email}</span>}
                    {(request.requestedRoles || []).map((role) => (
                      <span key={role} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-brand-gold">
                        {roleLabel(role)}
                      </span>
                    ))}
                    {(request.requestedStaffPositions || []).map((pos) => (
                      <span key={pos} className="rounded-md border border-white/5 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300">
                        {ministryRoleLabel(pos)}
                      </span>
                    ))}
                    <span className="text-slate-500">{formatDate(request.createdAt)}</span>
                  </div>
                  {request.reason && (
                    <p className="truncate text-xs text-slate-500 italic max-w-xl">
                      "{request.reason}"
                    </p>
                  )}
                </div>
                <ChevronIcon />
              </Link>
            ))}
            {activeTab === 'users' && !users.length && !loading && (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                No users found yet.
              </div>
            )}
            {activeTab === 'requests' && !accessRequests.length && !loading && (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                No new user access requests.
              </div>
            )}
          </div>
        </section>
      </div>

      <Modal open={createOpen} title="Create user" onClose={() => setCreateOpen(false)}>
        <form onSubmit={handleCreateUser} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Display name" value={createDraft.displayName} onChange={(event) => setCreateDraft((current) => ({ ...current, displayName: event.target.value }))} placeholder="Full name" />
            <TextField label="Email" value={createDraft.email} onChange={(event) => setCreateDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" />
            <ChoiceDropdown
              label="Branch"
              value={createDraft.branch}
              onChange={(value) => setCreateDraft((current) => ({ ...current, branch: value }))}
              placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
              options={branchOptions}
              disabled={!branchOptions.length}
            />
            <TextField label="Office" value={createDraft.office} onChange={(event) => setCreateDraft((current) => ({ ...current, office: event.target.value }))} placeholder="Office or team" />
          </div>

          <TextAreaField label="Bio" value={createDraft.bio} onChange={(event) => setCreateDraft((current) => ({ ...current, bio: event.target.value }))} placeholder="Short bio or notes" rows={4} />

          <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry roles</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {ministryRoleOptions.map((option) => (
                <Pill
                  key={option.id}
                  active={createDraft.staff_positions.includes(option.id)}
                  onClick={() => setCreateDraft((current) => ({ ...current, staff_positions: toggleValue(current.staff_positions, option.id) }))}
                >
                  {option.label}
                </Pill>
              ))}
            </div>
          </section>

          <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Admin roles</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {adminRoleOptions.map((option) => (
                <Pill
                  key={option.id}
                  active={createDraft.roles.includes(option.id)}
                  onClick={() => setCreateDraft((current) => ({ ...current, roles: toggleValue(current.roles, option.id) }))}
                >
                  {option.label}
                </Pill>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? 'Creating…' : 'Create user'}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
