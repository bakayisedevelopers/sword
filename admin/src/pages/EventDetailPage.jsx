import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const eventAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'ministry_editor'];
const dayOptions = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const repeatOptions = ['', 'Once-off', 'Weekly', 'Monthly', 'Yearly', 'Every weekday', 'Every weekend'];
const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function branchLabel(branchDoc) {
  return branchDoc?.name || branchDoc?.id || 'Untitled branch';
}

function branchMatchesScope(branchDoc, scopeValue) {
  const needle = `${scopeValue || ''}`.trim().toLowerCase();
  if (!needle) return false;

  const branchName = `${branchDoc?.name || ''}`.trim().toLowerCase();
  const branchId = `${branchDoc?.id || ''}`.trim().toLowerCase();
  return needle === branchName || needle === branchId;
}

function eventBranches(eventDoc) {
  return Array.isArray(eventDoc?.branches) ? eventDoc.branches.filter(Boolean) : [];
}

function eventTitle(eventDoc) {
  return eventDoc?.title || 'Untitled event';
}

function toDateTimeInput(value) {
  if (!value) return '';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function dateTimeOrNull(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildDraft(eventDoc) {
  return {
    title: eventDoc?.title || '',
    description: eventDoc?.description || '',
    date: toDateTimeInput(eventDoc?.date),
    time: toDateTimeInput(eventDoc?.time),
    booking: Boolean(eventDoc?.booking),
    picture: eventDoc?.picture || '',
    global: Boolean(eventDoc?.global),
    branchId: '',
    location: eventDoc?.location || '',
    location_link: eventDoc?.location_link || '',
    price: eventDoc?.price === undefined || eventDoc?.price === null ? '' : `${eventDoc.price}`,
    recurring: Boolean(eventDoc?.recurring),
    day: eventDoc?.day || '',
    branch_name: eventDoc?.branch_name || '',
    repeat: eventDoc?.repeat || '',
    date_details: eventDoc?.date_details || '',
    time_details: eventDoc?.time_details || '',
    contactPersonId: '',
    mininstryName: eventDoc?.mininstryName || eventDoc?.ministryName || '',
    ministryId: '',
    branches: eventBranches(eventDoc),
    checkInEnabled: Boolean(eventDoc?.checkInEnabled),
    checkOutEnabled: Boolean(eventDoc?.checkOutEnabled),
    multiSession: Boolean(eventDoc?.multiSession || (Array.isArray(eventDoc?.sessions) && eventDoc.sessions.length > 1)),
    sessions: Array.isArray(eventDoc?.sessions) ? eventDoc.sessions : [],
    sessionTitle: '',
    sessionStart: '',
    sessionEnd: '',
    recurrenceEnd: eventDoc?.recurrenceEnd || '',
    recurrenceDays: Array.isArray(eventDoc?.recurrenceDays) ? eventDoc.recurrenceDays : [],
  };
}

function canUserEditEvent(roles, profile, eventDoc) {
  if (roles.includes('super_admin') || roles.includes('global_editor')) return true;

  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranches = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];
  const scopedBranches = [branchScope, ...otherBranches].filter(Boolean);
  const branchName = `${eventDoc?.branch_name || ''}`.trim().toLowerCase();
  const branches = eventBranches(eventDoc).map((branch) => `${branch}`.trim().toLowerCase());

  return roles.includes('branch_editor') && !eventDoc?.global && (
    scopedBranches.includes(branchName) ||
    branches.some((branch) => scopedBranches.includes(branch))
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text', readOnly = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5 read-only:opacity-70"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4, readOnly = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5 read-only:opacity-70"
      />
    </label>
  );
}

function TogglePill({ active, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'}`}
    >
      {children}
    </button>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-200">{value || '—'}</p>
    </div>
  );
}

function timestampToDate(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value) {
  const date = timestampToDate(value);
  return date ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : '';
}

function registrationName(registration) {
  return `${registration?.name || ''} ${registration?.surname || ''}`.trim() || 'Unnamed registration';
}

function registrationSearchText(registration) {
  return [
    registration?.name,
    registration?.surname,
    registration?.cell,
    registration?.email,
    registration?.message,
    registration?.branch,
    registration?.eventName,
  ].filter(Boolean).join(' ').toLowerCase();
}

function eventSessions(eventDoc) {
  const sessions = Array.isArray(eventDoc?.sessions) ? eventDoc.sessions.filter(Boolean) : [];
  if (sessions.length) return sessions;
  return [{ id: 'main', title: 'Main session', startAt: eventDoc?.time || eventDoc?.date || null, endAt: null }];
}

function hasSessionCheck(registration, sessionId, status) {
  return Array.isArray(registration?.checkIns) && registration.checkIns.some((check) => check?.sessionId === sessionId && check?.status === status);
}

function SessionLabel({ session }) {
  return (
    <span>
      {session?.title || 'Session'}
      {formatDateTime(session?.startAt) ? <span className="ml-2 text-slate-500">{formatDateTime(session.startAt)}</span> : null}
    </span>
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { user, roles, profile } = useAuth();
  const canAccessEvents = roles.some((role) => eventAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const canReviewRegistrations = canManageAll || roles.includes('care_team');
  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranchScopes = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [eventDoc, setEventDoc] = useState(null);
  const [branches, setBranches] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [users, setUsers] = useState([]);
  const [draft, setDraft] = useState(buildDraft(null));
  const [activeTab, setActiveTab] = useState('details');
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSearch, setRegistrationSearch] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('main');
  const [checkingRegistrationId, setCheckingRegistrationId] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [eventSnapshot, branchesSnapshot, ministriesSnapshot, usersSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'events', eventId)),
          getDocs(collection(firestore, 'branches')),
          getDocs(collection(firestore, 'ministries')),
          getDocs(collection(firestore, 'users')).catch(() => ({ docs: [] })),
        ]);

        const nextEvent = eventSnapshot.exists() ? { id: eventSnapshot.id, ref: eventSnapshot.ref, ...eventSnapshot.data() } : null;
        const nextBranches = branchesSnapshot.docs.map((branchDoc) => ({ id: branchDoc.id, ref: branchDoc.ref, ...branchDoc.data() })).sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));
        const nextMinistries = ministriesSnapshot.docs.map((ministryDoc) => ({ id: ministryDoc.id, ref: ministryDoc.ref, ...ministryDoc.data() })).sort((left, right) => `${left.name || left.ministryName || ''}`.localeCompare(`${right.name || right.ministryName || ''}`));
        const nextUsers = usersSnapshot.docs.map((userDoc) => ({ id: userDoc.id, ref: userDoc.ref, ...userDoc.data() })).sort((left, right) => `${left.displayName || left.name || left.email || ''}`.localeCompare(`${right.displayName || right.name || right.email || ''}`));

        if (active) {
          const nextDraft = buildDraft(nextEvent);
          const branchId = nextBranches.find((branchDoc) => branchMatchesScope(branchDoc, nextEvent?.branch_name))?.id || '';
          const ministryId = nextMinistries.find((ministry) => ministry.ref?.path === nextEvent?.ministry?.path || ministry.name === nextEvent?.mininstryName || ministry.ministryName === nextEvent?.mininstryName)?.id || '';
          const contactPersonId = nextUsers.find((profileDoc) => profileDoc.ref?.path === nextEvent?.contactPerson?.path)?.id || '';

          setEventDoc(nextEvent);
          setBranches(nextBranches);
          setMinistries(nextMinistries);
          setUsers(nextUsers);
          setDraft({ ...nextDraft, branchId, ministryId, contactPersonId });
        }
      } catch {
        if (active) {
          setEventDoc(null);
          setError('The event could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (eventId) loadData();
    return () => {
      active = false;
    };
  }, [eventId]);

  const canEdit = useMemo(
    () => Boolean(eventDoc && canUserEditEvent(roles, profile, eventDoc)),
    [eventDoc, profile, roles],
  );

  const selectedBranch = useMemo(() => branches.find((branchDoc) => branchDoc.id === draft.branchId) || null, [branches, draft.branchId]);
  const registrationBranchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);
  const sessions = useMemo(() => eventSessions(eventDoc), [eventDoc]);
  const selectedSession = useMemo(() => sessions.find((session) => session.id === selectedSessionId) || sessions[0] || null, [selectedSessionId, sessions]);
  const filteredRegistrations = useMemo(() => {
    const needle = registrationSearch.trim().toLowerCase();
    if (!needle) return registrations;
    return registrations.filter((registration) => registrationSearchText(registration).includes(needle));
  }, [registrationSearch, registrations]);

  useEffect(() => {
    if (!sessions.length) return;
    if (!sessions.some((session) => session.id === selectedSessionId)) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [selectedSessionId, sessions]);

  useEffect(() => {
    let active = true;

    async function loadRegistrations() {
      if (!eventDoc?.title) {
        setRegistrations([]);
        return;
      }

      setLoadingRegistrations(true);
      setRegistrationError('');

      try {
        const registrationQueries = canReviewRegistrations
          ? [query(collection(firestore, 'registrations'), where('eventName', '==', eventDoc.title))]
          : registrationBranchScopes.map((branch) => query(
            collection(firestore, 'registrations'),
            where('eventName', '==', eventDoc.title),
            where('branch', '==', branch),
          ));

        if (!registrationQueries.length) {
          if (active) setRegistrations([]);
          return;
        }

        const registrationSnapshots = await Promise.all(registrationQueries.map((registrationQuery) => getDocs(registrationQuery)));
        const nextRegistrations = registrationSnapshots.flatMap((snapshot) => snapshot.docs)
          .map((registrationDoc) => ({ id: registrationDoc.id, ref: registrationDoc.ref, ...registrationDoc.data() }))
          .filter((registration, index, allRegistrations) => allRegistrations.findIndex((item) => item.id === registration.id) === index)
          .sort((left, right) => registrationName(left).localeCompare(registrationName(right)));

        if (active) setRegistrations(nextRegistrations);
      } catch {
        if (active) {
          setRegistrations([]);
          setRegistrationError('Registrations could not be loaded. Check Firestore permissions for event registrations.');
        }
      } finally {
        if (active) setLoadingRegistrations(false);
      }
    }

    if (activeTab === 'checkins') loadRegistrations();
    return () => {
      active = false;
    };
  }, [activeTab, canReviewRegistrations, eventDoc?.title, registrationBranchScopes]);

  function toggleDraftBranch(value) {
    if (!canEdit) return;

    const normalizedValue = `${value || ''}`.trim().toLowerCase();
    if (!canManageAll && normalizedValue !== branchScope && !otherBranchScopes.includes(normalizedValue)) return;

    setDraft((current) => ({
      ...current,
      branches: current.branches.includes(value)
        ? current.branches.filter((branch) => branch !== value)
        : [...current.branches, value],
    }));
  }

  async function handleSave(saveEvent) {
    saveEvent.preventDefault();
    if (!eventDoc || !canEdit) return;

    if (!draft.title.trim()) {
      setError('Add an event title first.');
      setMessage('');
      return;
    }

    if (!draft.description.trim()) {
      setError('Add an event description first.');
      setMessage('');
      return;
    }

    const scopedDraft = !canManageAll
      ? { ...draft, global: false, branch_name: eventDoc.branch_name, branches: eventBranches(eventDoc) }
      : draft;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const ministryDoc = ministries.find((ministry) => ministry.id === scopedDraft.ministryId);
      const ministryNameValue = scopedDraft.mininstryName.trim() || ministryDoc?.name || ministryDoc?.ministryName || '';
      const contactDoc = users.find((profileDoc) => profileDoc.id === scopedDraft.contactPersonId);
      const date = dateTimeOrNull(scopedDraft.date);
      const time = dateTimeOrNull(scopedDraft.time);

      const sanitizedSessions = scopedDraft.multiSession && Array.isArray(scopedDraft.sessions) && scopedDraft.sessions.length
        ? scopedDraft.sessions.map((session, index) => {
            const startAt = session.startAt ? timestampToDate(session.startAt) : dateTimeOrNull(session.start);
            const endAt = session.endAt ? timestampToDate(session.endAt) : dateTimeOrNull(session.end);
            return {
              id: session.id || `session-${index + 1}`,
              title: session.title?.trim() || `Session ${index + 1}`,
              ...(startAt ? { startAt } : {}),
              ...(endAt ? { endAt } : {}),
            };
          })
        : (date ? [{ id: 'main', title: 'Main session', startAt: time || date, endAt: null }] : []);

      const payload = {
        title: scopedDraft.title.trim(),
        description: scopedDraft.description.trim(),
        booking: scopedDraft.booking,
        picture: scopedDraft.picture.trim(),
        global: scopedDraft.global,
        location: scopedDraft.location.trim(),
        location_link: scopedDraft.location_link.trim(),
        price: Number.parseFloat(scopedDraft.price || '0') || 0,
        recurring: scopedDraft.recurring,
        day: scopedDraft.day,
        branch_name: scopedDraft.branch_name.trim(),
        repeat: scopedDraft.repeat,
        date_details: scopedDraft.date_details.trim(),
        time_details: scopedDraft.time_details.trim(),
        mininstryName: ministryNameValue,
        ministryName: ministryNameValue,
        branches: scopedDraft.branches,
        checkInEnabled: scopedDraft.checkInEnabled,
        checkOutEnabled: scopedDraft.checkOutEnabled,
        multiSession: scopedDraft.multiSession,
        sessions: sanitizedSessions,
        recurrenceEnd: scopedDraft.recurrenceEnd || '',
        recurrenceDays: scopedDraft.recurrenceDays || [],
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };

      if (date) payload.date = date;
      if (time) payload.time = time;
      if (selectedBranch?.ref && canManageAll) payload.branch = selectedBranch.ref;
      if (ministryDoc?.ref) payload.ministry = ministryDoc.ref;
      if (contactDoc?.ref) payload.contactPerson = contactDoc.ref;

      await setDoc(doc(firestore, 'events', eventDoc.id), payload, { merge: true });
      setEventDoc((current) => ({ ...current, ...payload }));
      setMessage('Event saved.');
    } catch {
      setError('The event could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  async function markRegistration(registration, status) {
    if (!registration?.id || !selectedSession) return;

    setCheckingRegistrationId(registration.id);
    setRegistrationError('');
    setMessage('');
    setError('');

    try {
      const existingChecks = Array.isArray(registration.checkIns) ? registration.checkIns : [];
      const payload = {
        checkIns: [
          ...existingChecks,
          {
            sessionId: selectedSession.id,
            sessionTitle: selectedSession.title || 'Main session',
            status,
            recordedAt: new Date(),
            recordedBy: user?.uid || '',
          },
        ],
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };

      if (status === 'checked_in') {
        payload.checkedIn = true;
        payload.checkedInAt = new Date();
        payload.checkedInBy = user?.uid || '';
        payload.checkInSessionId = selectedSession.id;
      }

      if (status === 'checked_out') {
        payload.checkedOut = true;
        payload.checkedOutAt = new Date();
        payload.checkedOutBy = user?.uid || '';
        payload.checkOutSessionId = selectedSession.id;
      }

      await setDoc(doc(firestore, 'registrations', registration.id), payload, { merge: true });
      setRegistrations((current) => current.map((item) => (
        item.id === registration.id
          ? { ...item, ...payload, checkIns: payload.checkIns }
          : item
      )));
      setMessage(status === 'checked_out' ? 'Registration checked out.' : 'Registration checked in.');
    } catch {
      setRegistrationError('This registration could not be updated right now.');
    } finally {
      setCheckingRegistrationId('');
    }
  }

  if (!canAccessEvents) return <Navigate to="/access-denied" replace />;
  if (!eventId) return <Navigate to="/workspace/events" replace />;
  if (!loading && !eventDoc) return <Navigate to="/workspace/events" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Events</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{loading ? 'Loading event…' : eventTitle(eventDoc)}</h1>
          </div>
          <Link to="/workspace/events" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">Back to events</Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && eventDoc ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <DetailItem label="Branch" value={eventDoc.branch_name || 'Global'} />
              <DetailItem label="Registration" value={eventDoc.booking ? 'Enabled' : 'Disabled'} />
              <DetailItem label="Event type" value={eventDoc.recurring ? 'Recurring' : 'Once-off'} />
            </section>

            <section className="flex justify-center">
              <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
                <button type="button" onClick={() => setActiveTab('details')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'details' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>Event details</button>
                <button type="button" onClick={() => setActiveTab('checkins')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'checkins' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>Event check-ins</button>
              </div>
            </section>

            {activeTab === 'details' ? (
            <form onSubmit={handleSave} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{canEdit ? 'Editable' : 'Read-only'}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Event details</h2>
                </div>
                {!canEdit ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">View only</span> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Picture URL" value={draft.picture} onChange={(event) => setDraft((current) => ({ ...current, picture: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Event date" type="datetime-local" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Event time" type="datetime-local" value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Date details" value={draft.date_details} onChange={(event) => setDraft((current) => ({ ...current, date_details: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Time details" value={draft.time_details} onChange={(event) => setDraft((current) => ({ ...current, time_details: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Location" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Location link" value={draft.location_link} onChange={(event) => setDraft((current) => ({ ...current, location_link: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Price" type="number" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} readOnly={!canEdit} />
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Day</span>
                  <select disabled={!canEdit} value={draft.day} onChange={(event) => setDraft((current) => ({ ...current, day: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70">
                    {dayOptions.map((option) => <option key={option || 'none'} value={option}>{option || 'No day selected'}</option>)}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Repeat</span>
                  <select disabled={!canEdit} value={draft.repeat} onChange={(event) => setDraft((current) => ({ ...current, repeat: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70">
                    {repeatOptions.map((option) => <option key={option || 'none'} value={option}>{option || 'No repeat selected'}</option>)}
                  </select>
                </label>
              </div>

              <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} readOnly={!canEdit} />

              <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visibility and registrations</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <TogglePill active={draft.booking} disabled={!canEdit} onClick={() => setDraft((current) => ({ ...current, booking: !current.booking }))}>Enable registration</TogglePill>
                  <TogglePill active={draft.recurring} disabled={!canEdit} onClick={() => setDraft((current) => ({ ...current, recurring: !current.recurring }))}>Recurring event</TogglePill>
                  <TogglePill active={draft.global} disabled={!canEdit || !canManageAll} onClick={() => setDraft((current) => ({ ...current, global: !current.global }))}>Global event</TogglePill>
                  <TogglePill active={draft.checkInEnabled} disabled={!canEdit} onClick={() => setDraft((current) => ({ ...current, checkInEnabled: !current.checkInEnabled }))}>Enable check-in</TogglePill>
                  <TogglePill active={draft.checkOutEnabled} disabled={!canEdit} onClick={() => setDraft((current) => ({ ...current, checkOutEnabled: !current.checkOutEnabled }))}>Enable check-out</TogglePill>
                  <TogglePill active={draft.multiSession} disabled={!canEdit} onClick={() => setDraft((current) => ({ ...current, multiSession: !current.multiSession }))}>Multiple sessions</TogglePill>
                </div>
              </section>

              {draft.recurring ? (
                <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recurring schedule</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Recurrence parameters and active weekdays for recurring services or events.</p>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextField label="Repeat until" type="date" value={draft.recurrenceEnd} onChange={(event) => setDraft((current) => ({ ...current, recurrenceEnd: event.target.value }))} readOnly={!canEdit} />
                    <TextField label="Repeat frequency" value={draft.repeat || 'Weekly'} onChange={(event) => setDraft((current) => ({ ...current, repeat: event.target.value }))} readOnly={!canEdit} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {weekDayNames.map((day) => (
                      <TogglePill
                        key={day}
                        active={draft.recurrenceDays.includes(day)}
                        disabled={!canEdit}
                        onClick={() => setDraft((current) => ({
                          ...current,
                          recurrenceDays: current.recurrenceDays.includes(day)
                            ? current.recurrenceDays.filter((selectedDay) => selectedDay !== day)
                            : [...current.recurrenceDays, day],
                        }))}
                      >
                        {day}
                      </TogglePill>
                    ))}
                  </div>
                </section>
              ) : null}

              {draft.multiSession ? (
                <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Event sessions</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">Configure distinct sessions (e.g. morning, evening, breakout) for check-in attendance tracking.</p>
                  {canEdit ? (
                    <div className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <TextField label="Session name" value={draft.sessionTitle} onChange={(event) => setDraft((current) => ({ ...current, sessionTitle: event.target.value }))} placeholder="e.g. Evening session" />
                        <TextField label="Starts" type="datetime-local" value={draft.sessionStart} onChange={(event) => setDraft((current) => ({ ...current, sessionStart: event.target.value }))} />
                        <TextField label="Ends" type="datetime-local" value={draft.sessionEnd} onChange={(event) => setDraft((current) => ({ ...current, sessionEnd: event.target.value }))} />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            if (!draft.sessionTitle.trim() && !draft.sessionStart) return;
                            const newSession = {
                              id: `session-${Date.now()}`,
                              title: draft.sessionTitle.trim() || `Session ${draft.sessions.length + 1}`,
                              start: draft.sessionStart,
                              end: draft.sessionEnd,
                              startAt: dateTimeOrNull(draft.sessionStart),
                              endAt: dateTimeOrNull(draft.sessionEnd),
                            };
                            setDraft((current) => ({
                              ...current,
                              sessions: [...current.sessions, newSession],
                              sessionTitle: '',
                              sessionStart: '',
                              sessionEnd: '',
                            }));
                          }}
                          className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950"
                        >
                          Add session
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className="mt-4 space-y-2">
                    {draft.sessions.map((session, idx) => (
                      <div key={session.id || idx} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <div>
                          <p className="font-semibold text-white">{session.title || `Session ${idx + 1}`}</p>
                          <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-400">
                            <span>Starts: {formatDateTime(session.startAt || session.start) || 'Not set'}</span>
                            <span>Ends: {formatDateTime(session.endAt || session.end) || 'Not set'}</span>
                          </div>
                        </div>
                        {canEdit ? (
                          <button
                            type="button"
                            onClick={() => setDraft((current) => ({
                              ...current,
                              sessions: current.sessions.filter((_, i) => i !== idx),
                            }))}
                            className="rounded-full border border-red-400/30 px-3 py-1 text-xs text-red-300 transition hover:bg-red-500/10"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    ))}
                    {!draft.sessions.length ? (
                      <p className="text-sm text-slate-400">No custom sessions added yet. The main event date/time will be used as the default session.</p>
                    ) : null}
                  </div>
                </section>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Primary branch</span>
                  <select disabled={!canEdit || !canManageAll} value={draft.branchId} onChange={(event) => {
                    const branchDoc = branches.find((branch) => branch.id === event.target.value);
                    setDraft((current) => ({ ...current, branchId: event.target.value, branch_name: branchDoc ? branchLabel(branchDoc) : '' }));
                  }} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70">
                    <option value="">No branch selected</option>
                    {branches.map((branchDoc) => <option key={branchDoc.id} value={branchDoc.id}>{branchLabel(branchDoc)}</option>)}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry</span>
                  <select disabled={!canEdit} value={draft.ministryId} onChange={(event) => {
                    const ministryDoc = ministries.find((ministry) => ministry.id === event.target.value);
                    setDraft((current) => ({ ...current, ministryId: event.target.value, mininstryName: ministryDoc?.name || ministryDoc?.ministryName || '' }));
                  }} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70">
                    <option value="">No ministry selected</option>
                    {ministries.map((ministry) => <option key={ministry.id} value={ministry.id}>{ministry.name || ministry.ministryName || 'Untitled ministry'}</option>)}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact person</span>
                  <select disabled={!canEdit} value={draft.contactPersonId} onChange={(event) => setDraft((current) => ({ ...current, contactPersonId: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70">
                    <option value="">No contact selected</option>
                    {users.map((userDoc) => <option key={userDoc.id} value={userDoc.id}>{userDoc.displayName || `${userDoc.name || ''} ${userDoc.surname || ''}`.trim() || userDoc.email || 'Unnamed user'}</option>)}
                  </select>
                </label>
                <TextField label="Ministry name" value={draft.mininstryName} onChange={(event) => setDraft((current) => ({ ...current, mininstryName: event.target.value }))} readOnly={!canEdit} />
              </div>

              <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Registration branches</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {branches.map((branchDoc) => {
                    const label = branchLabel(branchDoc);
                    const normalizedLabel = label.trim().toLowerCase();
                    const disabled = !canEdit || (!canManageAll && normalizedLabel !== branchScope && !otherBranchScopes.includes(normalizedLabel));
                    return <TogglePill key={branchDoc.id} active={draft.branches.includes(label)} disabled={disabled} onClick={() => toggleDraftBranch(label)}>{label}</TogglePill>;
                  })}
                </div>
              </section>

              {canEdit ? (
                <div className="flex justify-end">
                  <button type="submit" disabled={saving} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save event'}
                  </button>
                </div>
              ) : null}
            </form>
            ) : (
              <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Check-ins</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Registered attendees</h2>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {loadingRegistrations ? 'Loading…' : `${registrations.length} registrations`}
                  </span>
                </div>

                {!eventDoc.booking ? (
                  <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                    Public registration is disabled for this event. You can still use check-ins if registration records exist for the same event name.
                  </div>
                ) : null}

                {!eventDoc.checkInEnabled ? (
                  <div className="rounded-[1.35rem] border border-brand-gold/20 bg-brand-gold/10 p-4 text-sm leading-6 text-brand-gold">
                    Check-in is not enabled on this event yet. Enable it in Event details if this event needs attendance tracking.
                  </div>
                ) : null}

                {registrationError ? (
                  <div className="rounded-[1.35rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{registrationError}</div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <TextField
                    label="Search registrations"
                    value={registrationSearch}
                    onChange={(event) => setRegistrationSearch(event.target.value)}
                    placeholder="Search by name, surname, phone, email, branch, or message"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('checkins');
                      setRegistrationSearch('');
                    }}
                    className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
                  >
                    Clear search
                  </button>
                </div>

                {sessions.length > 1 ? (
                  <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Check-in session</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sessions.map((session) => (
                        <TogglePill key={session.id} active={selectedSessionId === session.id} onClick={() => setSelectedSessionId(session.id)}>
                          <SessionLabel session={session} />
                        </TogglePill>
                      ))}
                    </div>
                  </section>
                ) : null}

                <div className="space-y-3">
                  {filteredRegistrations.map((registration) => {
                    const checkedIn = hasSessionCheck(registration, selectedSession?.id || 'main', 'checked_in') || (selectedSession?.id === 'main' && registration.checkedIn);
                    const checkedOut = hasSessionCheck(registration, selectedSession?.id || 'main', 'checked_out') || (selectedSession?.id === 'main' && registration.checkedOut);
                    return (
                      <article key={registration.id} className="rounded-[1.35rem] border border-white/10 bg-slate-950/40 p-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="break-words font-semibold text-white">{registrationName(registration)}</p>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-400">
                              {registration.cell ? <span>{registration.cell}</span> : null}
                              {registration.email ? <span>{registration.email}</span> : null}
                              {registration.branch ? <span>{registration.branch}</span> : null}
                              <span className={checkedIn ? 'text-brand-gold' : 'text-slate-500'}>{checkedIn ? 'Checked in' : 'Not checked in'}</span>
                              {eventDoc.checkOutEnabled ? <span className={checkedOut ? 'text-brand-gold' : 'text-slate-500'}>{checkedOut ? 'Checked out' : 'Not checked out'}</span> : null}
                            </div>
                            {registration.message ? <p className="mt-3 break-words text-sm leading-6 text-slate-300">{registration.message}</p> : null}
                          </div>
                          <div className="flex shrink-0 flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={!eventDoc.checkInEnabled || checkingRegistrationId === registration.id}
                              onClick={() => markRegistration(registration, 'checked_in')}
                              className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {checkedIn ? 'Check in again' : 'Check in'}
                            </button>
                            {eventDoc.checkOutEnabled ? (
                              <button
                                type="button"
                                disabled={!eventDoc.checkInEnabled || checkingRegistrationId === registration.id}
                                onClick={() => markRegistration(registration, 'checked_out')}
                                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {checkedOut ? 'Check out again' : 'Check out'}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {!filteredRegistrations.length && !loadingRegistrations ? (
                    <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                      No matching registrations found for this event.
                    </div>
                  ) : null}
                </div>
              </section>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}
