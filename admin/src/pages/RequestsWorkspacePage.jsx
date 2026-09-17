import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const requestAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];

function requestName(request) {
  return `${request?.name || ''} ${request?.surname || ''}`.trim() || 'Unnamed request';
}

function initials(value) {
  return `${value || ''}`
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase() || '—';
}

function requestDateLabel(request) {
  const value = request?.date || request?.createdAt;
  if (!value) return 'No date';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'No date' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function requestTypeLabel(request) {
  return request?.type || 'General request';
}

function formatStatus(value) {
  return `${value || 'new'}`
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function ToggleTab({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
    >
      {children}
    </button>
  );
}

function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
    </label>
  );
}

function RequestRow({ acknowledging, onAcknowledge, request }) {
  const status = request?.status || (request?.acknowledged ? 'in_progress' : 'new');

  return (
    <article className="group flex w-full min-w-0 items-center justify-between gap-3 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5">
      <Link to={`/workspace/requests/${request.id}`} className="flex min-w-0 flex-1 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-white">{requestName(request)}</p>
            {request.branch ? <span className="shrink-0 rounded-full border border-brand-gold/30 px-2 py-0.5 text-[0.68rem] font-semibold text-brand-gold">{request.branch}</span> : null}
            {request.type ? <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.68rem] font-semibold text-slate-300">{request.type}</span> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 sm:hidden">
            <span>{requestDateLabel(request)}</span>
            <span>·</span>
            <span className={request.acknowledged ? 'text-brand-gold' : 'text-slate-400'}>{formatStatus(status)}</span>
          </div>
        </div>

        <div className="hidden min-w-[8rem] text-right text-xs text-slate-500 md:block">
          <p>{requestDateLabel(request)}</p>
          <p className={request.acknowledged ? 'text-brand-gold' : 'text-slate-400'}>{formatStatus(status)}</p>
        </div>

        <ArrowIcon />
      </Link>

      {!request.acknowledged ? (
        <button
          type="button"
          disabled={acknowledging}
          onClick={() => onAcknowledge(request)}
          className="shrink-0 rounded-full border border-brand-gold/35 px-3 py-1.5 text-xs font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {acknowledging ? 'Saving…' : 'Acknowledge'}
        </button>
      ) : null}
    </article>
  );
}

export default function RequestsWorkspacePage() {
  const { roles, profile, user } = useAuth();
  const canAccess = roles.some((role) => requestAccessRoles.includes(role));
  const canReviewAll = roles.includes('super_admin') || roles.includes('global_editor') || roles.includes('care_team');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);

  const [activeTab, setActiveTab] = useState('new');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [acknowledgingId, setAcknowledgingId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const requestQueries = canReviewAll
          ? [query(collection(firestore, 'requests'))]
          : branchScopes.map((branch) => query(collection(firestore, 'requests'), where('branch', '==', branch)));

        if (!requestQueries.length) {
          if (active) setRequests([]);
          return;
        }

        const requestSnapshots = await Promise.all(requestQueries.map((requestQuery) => getDocs(requestQuery)));
        const nextRequests = requestSnapshots.flatMap((snapshot) => snapshot.docs)
          .map((requestDoc) => ({ id: requestDoc.id, ref: requestDoc.ref, ...requestDoc.data() }))
          .filter((request, index, allRequests) => allRequests.findIndex((item) => item.id === request.id) === index)
          .sort((left, right) => {
            const leftDate = typeof left.date?.toDate === 'function' ? left.date.toDate() : new Date(left.date || 0);
            const rightDate = typeof right.date?.toDate === 'function' ? right.date.toDate() : new Date(right.date || 0);
            return rightDate.getTime() - leftDate.getTime();
          });

        if (active) setRequests(nextRequests);
      } catch {
        if (active) {
          setRequests([]);
          setError('Requests could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [branchScopes, canReviewAll]);

  const branchNames = useMemo(() => {
    const list = new Set(['Online', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'EMalahleni', 'Boksburg', 'Orange Farm', 'Lagos']);
    requests.forEach((req) => {
      if (req.branch) list.add(req.branch);
    });
    return Array.from(list).sort();
  }, [requests]);

  const requestTypes = useMemo(() => [...new Set(requests.map((request) => request.type).filter(Boolean))].sort(), [requests]);
  const visibleRequests = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return requests.filter((request) => {
      if (activeTab === 'new' && (request.acknowledged === true || request.status === 'closed')) return false;
      if (branchFilter && request.branch !== branchFilter) return false;
      if (activeTab === 'all' && typeFilter && request.type !== typeFilter) return false;
      if (!needle) return true;
      return [request.name, request.surname, request.cell, request.branch, request.type, request.message]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [activeTab, branchFilter, requests, search, typeFilter]);

  async function acknowledgeRequest(request) {
    if (!request?.id) return;
    setAcknowledgingId(request.id);
    setError('');

    try {
      const payload = {
        acknowledged: true,
        acknowledgedAt: serverTimestamp(),
        acknowledgedBy: user?.uid || '',
        status: request.status && request.status !== 'new' ? request.status : 'in_progress',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };
      await setDoc(doc(firestore, 'requests', request.id), payload, { merge: true });
      setRequests((current) => current.map((item) => (item.id === request.id ? { ...item, ...payload, acknowledgedAt: new Date(), updatedAt: new Date() } : item)));
    } catch {
      setError('The request could not be acknowledged right now.');
    } finally {
      setAcknowledgingId('');
    }
  }

  if (!canAccess) return <Navigate to="/access-denied" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Requests</h1>
          </div>
        </section>

        {error ? (
          <section className="rounded-[1.6rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</section>
        ) : null}

        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <ToggleTab active={activeTab === 'new'} onClick={() => setActiveTab('new')}>New Requests</ToggleTab>
            <ToggleTab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Requests</ToggleTab>
          </div>
        </section>

        <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, branch, type, or message" />
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by branch</span>
              <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                <option value="">All branches</option>
                {branchNames.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
              </select>
            </label>
            {activeTab === 'all' ? (
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by type</span>
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  <option value="">All types</option>
                  {requestTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>
            ) : null}
          </div>

          <div className="space-y-3">
            {visibleRequests.map((request) => <RequestRow key={request.id} acknowledging={acknowledgingId === request.id} onAcknowledge={acknowledgeRequest} request={request} />)}
          </div>

          {!visibleRequests.length && !loading ? (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No requests found for this view.
            </div>
          ) : null}

          {loading ? <p className="text-sm text-slate-400">Loading requests…</p> : null}
        </section>
      </div>
    </main>
  );
}
