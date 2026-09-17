import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const signUpAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];
const acknowledgedStatuses = ['acknowledged', 'active', 'approved', 'contacted', 'completed'];

function branchLabel(branchDoc) {
  return branchDoc?.name || branchDoc?.id || 'Untitled branch';
}

function branchMatchesScope(branchDoc, scopeValue) {
  const needle = `${scopeValue || ''}`.trim().toLowerCase();
  if (!needle) {
    return false;
  }

  const branchName = `${branchDoc?.name || ''}`.trim().toLowerCase();
  const branchId = `${branchDoc?.id || ''}`.trim().toLowerCase();
  return needle === branchName || needle === branchId;
}

function personName(record) {
  const name = `${record?.name || ''} ${record?.surname || ''}`.trim();
  if (name) {
    return name;
  }

  const cell = `${record?.cell || ''}`.trim();
  return cell || 'No Name';
}

function normalizeStatus(record) {
  return `${record?.status || ''}`.trim().toLowerCase() || 'pending';
}

function isAcknowledged(record) {
  return acknowledgedStatuses.includes(normalizeStatus(record));
}

function typeLabel(type) {
  if (Array.isArray(type)) {
    return type.filter(Boolean).join(', ') || 'No ministry selected';
  }

  return `${type || ''}`.trim() || 'No ministry selected';
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 5l7 7-7 7" />
    </svg>
  );
}

function SignUpRow({ acknowledging, onAcknowledge, signUp }) {
  const acknowledged = isAcknowledged(signUp);

  return (
    <article className="group flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5">
      <Link to={`/workspace/sign-ups/${signUp.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-white">{personName(signUp)}</p>
            <span className="shrink-0 rounded-full border border-brand-gold/30 px-2.5 py-0.5 text-[0.68rem] font-semibold text-brand-gold">{typeLabel(signUp.type)}</span>
            {signUp.branch ? <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-[0.68rem] font-semibold text-slate-300">{signUp.branch}</span> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>{signUp.cell || 'No cell'}</span>
            <span>·</span>
            <span className={acknowledged ? 'text-brand-gold' : 'text-slate-400'}>{normalizeStatus(signUp)}</span>
            {signUp.assignedToName ? <span>· Assigned to {signUp.assignedToName}</span> : null}
          </div>
        </div>
        <ChevronIcon />
      </Link>

      {!acknowledged ? (
        <button
          type="button"
          disabled={acknowledging}
          onClick={() => onAcknowledge(signUp)}
          className="shrink-0 rounded-full border border-brand-gold/35 px-3 py-1.5 text-xs font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {acknowledging ? 'Saving…' : 'Acknowledge'}
        </button>
      ) : null}
    </article>
  );
}

export default function MinistrySignUpsWorkspacePage() {
  const { roles, profile, user } = useAuth();
  const canAccessSignUps = roles.some((role) => signUpAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && (roles.includes('branch_editor') || roles.includes('care_team'));
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingSignUps, setLoadingSignUps] = useState(false);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState([]);
  const [signUps, setSignUps] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('signUps');
  const [search, setSearch] = useState('');
  const [ministryFilter, setMinistryFilter] = useState('');
  const [acknowledgingId, setAcknowledgingId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadBranches() {
      setLoadingBranches(true);
      setError('');

      try {
        const branchesSnapshot = await getDocs(collection(firestore, 'branches'));
        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        if (active) {
          setBranches(nextBranches);
        }
      } catch {
        if (active) {
          setBranches([]);
          setError('Branches could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoadingBranches(false);
        }
      }
    }

    loadBranches();

    return () => {
      active = false;
    };
  }, []);

  const visibleBranches = useMemo(() => {
    if (!isBranchScoped) {
      return branches;
    }

    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchScoped]);

  useEffect(() => {
    if (!visibleBranches.length) {
      setSelectedBranchId('');
      return;
    }

    if (selectedBranchId !== 'all' && !visibleBranches.some((branchDoc) => branchDoc.id === selectedBranchId)) {
      const scopeMatch = visibleBranches.find((branchDoc) => branchMatchesScope(branchDoc, branchScope));
      setSelectedBranchId(scopeMatch?.id || (!isBranchScoped ? 'all' : visibleBranches[0].id));
    }
  }, [branchScope, isBranchScoped, selectedBranchId, visibleBranches]);

  const selectedBranch = useMemo(() => {
    if (selectedBranchId === 'all') {
      return { id: 'all', name: 'All Branches' };
    }
    return visibleBranches.find((branchDoc) => branchDoc.id === selectedBranchId) || null;
  }, [selectedBranchId, visibleBranches]);

  useEffect(() => {
    let active = true;

    async function loadSignUps() {
      if (!selectedBranch) {
        setSignUps([]);
        return;
      }

      setLoadingSignUps(true);
      setError('');

      try {
        const selectedBranchName = branchLabel(selectedBranch);
        const signUpsSnapshot = (isBranchScoped && selectedBranch.id !== 'all')
          ? await getDocs(query(collection(firestore, 'signUps'), where('branch', '==', selectedBranchName)))
          : await getDocs(collection(firestore, 'signUps'));

        const nextSignUps = signUpsSnapshot.docs
          .map((signUpDoc) => ({ id: signUpDoc.id, ...signUpDoc.data() }))
          .filter((signUp) => {
            if (selectedBranch.id === 'all') return true;
            const signUpBranch = `${signUp.branch || ''}`.trim().toLowerCase();
            return signUpBranch === selectedBranchName.toLowerCase() || signUpBranch === selectedBranch.id.toLowerCase();
          })
          .sort((left, right) => personName(left).localeCompare(personName(right)));

        if (active) {
          setSignUps(nextSignUps);
        }
      } catch {
        if (active) {
          setSignUps([]);
          setError('Ministry SignUps could not be loaded. Check admin role access and branch permissions.');
        }
      } finally {
        if (active) {
          setLoadingSignUps(false);
        }
      }
    }

    loadSignUps();

    return () => {
      active = false;
    };
  }, [isBranchScoped, selectedBranch]);

  async function acknowledgeSignUp(record) {
    if (!record?.id) return;
    setAcknowledgingId(record.id);
    setError('');

    try {
      const nowIso = new Date().toISOString();
      const payload = {
        status: 'acknowledged',
        acknowledgedAt: serverTimestamp(),
        acknowledgedBy: user?.displayName || user?.email || user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'signUps', record.id), payload, { merge: true });
      setSignUps((current) =>
        current.map((item) =>
          item.id === record.id
            ? { ...item, status: 'acknowledged', acknowledgedAt: nowIso, acknowledgedBy: payload.acknowledgedBy }
            : item
        )
      );
    } catch (err) {
      console.error('Error acknowledging signup:', err);
      setError('The signup could not be acknowledged right now.');
    } finally {
      setAcknowledgingId('');
    }
  }

  const acknowledgedSignUps = signUps.filter(isAcknowledged);
  const pendingSignUps = signUps.filter((signUp) => !isAcknowledged(signUp));
  const visibleSignUps = activeTab === 'signUps' ? acknowledgedSignUps : pendingSignUps;

  const ministryTypes = useMemo(() => {
    const set = new Set();
    signUps.forEach((s) => {
      if (Array.isArray(s.type)) s.type.forEach((t) => t && set.add(t));
      else if (s.type) set.add(s.type);
    });
    return Array.from(set).sort();
  }, [signUps]);

  const filteredSignUps = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return visibleSignUps.filter((s) => {
      if (ministryFilter) {
        const typeStr = Array.isArray(s.type) ? s.type.join(' ') : `${s.type || ''}`;
        if (!typeStr.toLowerCase().includes(ministryFilter.toLowerCase())) return false;
      }
      if (!needle) return true;
      return [s.name, s.surname, s.cell, s.branch, Array.isArray(s.type) ? s.type.join(' ') : s.type, s.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [visibleSignUps, search, ministryFilter]);

  const selectedBranchName = selectedBranchId === 'all' ? 'All Branches' : (selectedBranch ? branchLabel(selectedBranch) : 'Select a branch');

  if (!canAccessSignUps) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchScoped && !loadingBranches && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministry SignUps</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign a branch on the user profile first. Branch-scoped users can only review ministry signups for their own branch.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ministry SignUps</h1>
          </div>
        </section>

        {error && (
          <section className="rounded-[1.6rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branches</p>
            <span className="text-sm text-slate-300">{loadingBranches ? 'Loading…' : selectedBranchName}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {!isBranchScoped && (
              <button
                type="button"
                onClick={() => setSelectedBranchId('all')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedBranchId === 'all' ? 'bg-brand-gold text-slate-950' : 'border border-white/10 bg-slate-950/40 text-slate-300 hover:border-brand-gold hover:text-white'}`}
              >
                All Branches
              </button>
            )}
            {visibleBranches.map((branchDoc) => {
              const active = branchDoc.id === selectedBranchId;
              return (
                <button
                  key={branchDoc.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branchDoc.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 bg-slate-950/40 text-slate-300 hover:border-brand-gold hover:text-white'}`}
                >
                  {branchLabel(branchDoc)}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('signUps')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'signUps' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              SignUps
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'requests' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              New requests
            </button>
          </div>
        </section>

        <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {activeTab === 'signUps' ? 'Acknowledged signups' : 'Pending intake'}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {loadingSignUps ? 'Loading…' : `${filteredSignUps.length} records`}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_16rem]">
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search volunteer name, phone, branch, or message"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by ministry</span>
              <select
                value={ministryFilter}
                onChange={(e) => setMinistryFilter(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
              >
                <option value="">All ministries</option>
                {ministryTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="space-y-3">
            {filteredSignUps.map((signUp) => (
              <SignUpRow
                key={signUp.id}
                signUp={signUp}
                acknowledging={acknowledgingId === signUp.id}
                onAcknowledge={acknowledgeSignUp}
              />
            ))}
            {!filteredSignUps.length && !loadingSignUps && (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                {search || ministryFilter
                  ? 'No ministry signups match your search or filter criteria.'
                  : activeTab === 'signUps'
                  ? 'No acknowledged ministry signups for this branch yet.'
                  : 'No new ministry signup requests for this branch right now.'}
              </div>
            )}
            {loadingSignUps && <p className="text-sm text-slate-400">Loading signups…</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
