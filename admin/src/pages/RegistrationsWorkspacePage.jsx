import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const registrationAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];

function registrationName(registration) {
  const fullName = `${registration?.name || ''} ${registration?.surname || ''}`.trim();
  if (fullName) return fullName;
  return 'Unnamed registration';
}

function registrationEmail(registration) {
  if (registration?.email) return registration.email;
  const match = (registration?.message || '').match(/Email:\s*([^\s\n\r]+)/i);
  return match ? match[1] : '';
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

function registrationDateLabel(registration) {
  const value = registration?.date || registration?.createdAt;
  if (!value) return 'No date';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'No date' : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function eventPrice(eventDoc) {
  if (!eventDoc?.price) return 0;
  const raw = typeof eventDoc.price === 'string' ? eventDoc.price.replace(/[^0-9.]/g, '') : eventDoc.price;
  const price = Number.parseFloat(raw || '0') || 0;
  return price > 0 ? price : 0;
}

function paymentLabel(registration, eventDoc) {
  if (!eventPrice(eventDoc)) return 'Payment done';
  return registration?.paymentStatus === 'paid' || registration?.paymentDone === true ? 'Payment done' : 'Payment pending';
}

function isReviewed(registration) {
  return registration?.reviewed === true || registration?.acknowledged === true;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function RegistrationRow({ registration, eventDoc }) {
  return (
    <Link
      to={`/workspace/registrations/${registration.id}`}
      className="group flex w-full min-w-0 items-center justify-between gap-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate font-semibold text-white">{registrationName(registration)}</p>
          {registration.branch ? <span className="shrink-0 rounded-full border border-brand-gold/30 px-2 py-0.5 text-[0.68rem] font-semibold text-brand-gold sm:hidden">{initials(registration.branch)}</span> : null}
          {registration.eventName ? <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[0.68rem] font-semibold text-slate-300 sm:hidden">{initials(registration.eventName)}</span> : null}
        </div>
        {registrationEmail(registration) ? (
          <p className="mt-0.5 truncate text-xs text-slate-400">{registrationEmail(registration)}</p>
        ) : null}
      </div>

      <div className="hidden min-w-0 flex-1 items-center gap-2 text-sm text-slate-400 sm:flex">
        {registration.branch ? <span className="rounded-full border border-brand-gold/25 px-2.5 py-1 text-xs text-brand-gold">{registration.branch}</span> : null}
        {registration.eventName ? <span className="truncate">{registration.eventName}</span> : null}
      </div>

      <div className="hidden min-w-[8rem] text-right text-xs text-slate-500 md:block">
        <p>{registrationDateLabel(registration)}</p>
        <p className={paymentLabel(registration, eventDoc) === 'Payment done' ? 'text-brand-gold' : 'text-amber-200'}>{paymentLabel(registration, eventDoc)}</p>
        <p className={isReviewed(registration) ? 'text-brand-gold' : 'text-slate-400'}>{isReviewed(registration) ? 'Reviewed' : 'New'}</p>
      </div>

      <ArrowIcon />
    </Link>
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

export default function RegistrationsWorkspacePage() {
  const { roles, profile } = useAuth();
  const canAccess = roles.some((role) => registrationAccessRoles.includes(role));
  const canReviewAll = roles.includes('super_admin') || roles.includes('global_editor') || roles.includes('care_team');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);

  const [activeTab, setActiveTab] = useState('new');
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [eventFilter, setEventFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const registrationQueries = canReviewAll
          ? [query(collection(firestore, 'registrations'))]
          : branchScopes.map((branch) => query(collection(firestore, 'registrations'), where('branch', '==', branch)));

        if (!registrationQueries.length) {
          if (active) {
            setRegistrations([]);
            setEvents([]);
          }
          return;
        }

        const [registrationSnapshots, eventsSnapshot] = await Promise.all([
          Promise.all(registrationQueries.map((registrationQuery) => getDocs(registrationQuery))),
          getDocs(collection(firestore, 'events')),
        ]);

        const nextRegistrations = registrationSnapshots.flatMap((snapshot) => snapshot.docs)
          .map((registrationDoc) => ({ id: registrationDoc.id, ref: registrationDoc.ref, ...registrationDoc.data() }))
          .filter((registration, index, allRegistrations) => allRegistrations.findIndex((item) => item.id === registration.id) === index)
          .sort((left, right) => {
            const leftDate = typeof left.date?.toDate === 'function' ? left.date.toDate() : new Date(left.date || 0);
            const rightDate = typeof right.date?.toDate === 'function' ? right.date.toDate() : new Date(right.date || 0);
            return rightDate.getTime() - leftDate.getTime();
          });

        const nextEvents = eventsSnapshot.docs.map((eventDoc) => ({ id: eventDoc.id, ref: eventDoc.ref, ...eventDoc.data() }));

        if (active) {
          setRegistrations(nextRegistrations);
          setEvents(nextEvents);
        }
      } catch {
        if (active) {
          setRegistrations([]);
          setEvents([]);
          setError('Event registrations could not be loaded. Check Firestore permissions.');
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

  const eventsByTitle = useMemo(() => {
    const map = new Map();
    events.forEach((eventDoc) => {
      if (eventDoc.title && !map.has(eventDoc.title)) map.set(eventDoc.title, eventDoc);
    });
    return map;
  }, [events]);

  const eventNames = useMemo(() => [...new Set(registrations.map((registration) => registration.eventName).filter(Boolean))].sort(), [registrations]);
  const branchNames = useMemo(() => [...new Set(registrations.map((registration) => registration.branch).filter(Boolean))].sort(), [registrations]);
  const visibleRegistrations = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return registrations.filter((registration) => {
      if (activeTab === 'new' && isReviewed(registration)) return false;
      if (branchFilter && registration.branch !== branchFilter) return false;
      if (activeTab === 'all' && eventFilter && registration.eventName !== eventFilter) return false;
      if (!needle) return true;
      return [registration.name, registration.surname, registration.cell, registration.email, registration.branch, registration.eventName]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [activeTab, branchFilter, eventFilter, registrations, search]);

  if (!canAccess) return <Navigate to="/access-denied" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Event registrations</h1>
          </div>
        </section>

        {error ? (
          <section className="rounded-[1.6rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</section>
        ) : null}

        <section data-tour-id="registrations-tabs" className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <ToggleTab active={activeTab === 'new'} onClick={() => setActiveTab('new')}>New registrations</ToggleTab>
            <ToggleTab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All registrations</ToggleTab>
          </div>
        </section>

        <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div data-tour-id="registrations-filters" className={`grid gap-4 ${activeTab === 'all' ? 'md:grid-cols-[1fr_14rem_14rem]' : 'md:grid-cols-[1fr_14rem]'}`}>
            <TextField label="Search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone, branch, or event" />
            <label className="block space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by branch</span>
              <select value={branchFilter} onChange={(event) => setBranchFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                <option value="">All branches</option>
                {branchNames.map((branchName) => <option key={branchName} value={branchName}>{branchName}</option>)}
              </select>
            </label>
            {activeTab === 'all' ? (
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Filter by event</span>
                <select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  <option value="">All events</option>
                  {eventNames.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}
                </select>
              </label>
            ) : null}
          </div>

          <div data-tour-id="registrations-list" className="space-y-3">
            {visibleRegistrations.map((registration) => (
              <RegistrationRow key={registration.id} registration={registration} eventDoc={eventsByTitle.get(registration.eventName)} />
            ))}
          </div>

          {!visibleRegistrations.length && !loading ? (
            <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
              No registrations found for this view.
            </div>
          ) : null}

          {loading ? <p className="text-sm text-slate-400">Loading registrations…</p> : null}
        </section>
      </div>
    </main>
  );
}
