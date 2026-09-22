import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { GeoPoint, addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const eventAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'ministry_editor'];
const creatorRoles = ['super_admin', 'global_editor', 'branch_editor'];
const dayOptions = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const repeatOptions = ['', 'Once-off', 'Weekly', 'Monthly', 'Yearly', 'Every weekday', 'Every weekend'];
const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const emptyDraft = {
  title: '',
  description: '',
  date: '',
  time: '',
  booking: false,
  picture: '',
  global: false,
  branchId: '',
  location: '',
  location_link: '',
  locationPinLat: '',
  locationPinLng: '',
  price: '',
  recurring: false,
  day: '',
  branch_name: '',
  repeat: '',
  date_details: '',
  time_details: '',
  contactPersonId: '',
  mininstryName: '',
  ministryId: '',
  branches: [],
  checkInEnabled: false,
  checkOutEnabled: false,
  multiSession: false,
  sessions: [],
  sessionTitle: '',
  sessionStart: '',
  sessionEnd: '',
  recurrenceEnd: '',
  recurrenceDays: [],
  ticketLimit: '',
};

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

function eventTitle(eventDoc) {
  return eventDoc?.title || 'Untitled event';
}

function eventDateLabel(eventDoc) {
  if (eventDoc?.date_details) return eventDoc.date_details;
  const value = eventDoc?.date;
  if (!value) return 'No date';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? 'No date' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

function eventTimeLabel(eventDoc) {
  if (eventDoc?.time_details) return eventDoc.time_details;
  const value = eventDoc?.time;
  if (!value) return '';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { timeStyle: 'short' }).format(date);
}

function eventBranches(eventDoc) {
  return Array.isArray(eventDoc?.branches) ? eventDoc.branches.filter(Boolean) : [];
}

function eventMatchesBranch(eventDoc, branchDoc) {
  const selectedName = branchLabel(branchDoc).toLowerCase();
  const selectedId = `${branchDoc?.id || ''}`.trim().toLowerCase();
  const branchName = `${eventDoc?.branch_name || ''}`.trim().toLowerCase();

  if (eventDoc?.global) return true;
  if (branchName === selectedName || branchName === selectedId) return true;

  return eventBranches(eventDoc).some((branch) => {
    const value = `${branch || ''}`.trim().toLowerCase();
    return value === selectedName || value === selectedId;
  });
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function EventRow({ eventDoc, canEdit }) {
  return (
    <Link
      to={`/workspace/events/${eventDoc.id}`}
      className="group flex w-full min-w-0 items-center justify-between gap-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="whitespace-normal break-words font-semibold leading-6 text-white">{eventTitle(eventDoc)}</p>
        <div className="mt-1 hidden flex-wrap gap-2 text-xs text-slate-400 sm:flex">
          <span>{eventDateLabel(eventDoc)}</span>
          {eventTimeLabel(eventDoc) ? <span>{eventTimeLabel(eventDoc)}</span> : null}
          {eventDoc.booking ? <span className="text-brand-gold">Registration enabled</span> : null}
          {eventDoc.recurring ? <span>Recurring</span> : null}
          {eventDoc.global ? <span>Global</span> : null}
          {!canEdit ? <span>View only</span> : null}
        </div>
      </div>
      <ArrowIcon />
    </Link>
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

function dateTimeOrNull(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function normalizeGeoPoint(value) {
  if (!value) {
    return { lat: '', lng: '' };
  }

  if (value instanceof GeoPoint) {
    return {
      lat: value.latitude?.toString?.() || '',
      lng: value.longitude?.toString?.() || '',
    };
  }

  if (typeof value === 'object') {
    const lat = value.latitude ?? value._latitude ?? '';
    const lng = value.longitude ?? value._longitude ?? '';
    if (lat !== '' || lng !== '') {
      return {
        lat: `${lat}`,
        lng: `${lng}`,
      };
    }
  }

  return { lat: '', lng: '' };
}

function generatedMapUrl(lat, lng) {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function openStreetMapUrl(lat, lng) {
  if (!lat || !lng) return '';
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=18/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`;
}

function toDateInputValue(date) {
  if (!date) return '';
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
}

function combineDateAndTime(baseDate, timeValue) {
  const date = new Date(baseDate);
  const time = dateTimeOrNull(timeValue);
  if (time) {
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  }
  return date;
}

function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function buildSessions(draft, occurrenceDate = null) {
  if (draft.multiSession && Array.isArray(draft.sessions) && draft.sessions.length) {
    return draft.sessions.map((session, index) => ({
      id: session.id || `session-${index + 1}`,
      title: session.title?.trim() || `Session ${index + 1}`,
      startAt: occurrenceDate && session.start ? combineDateAndTime(occurrenceDate, session.start) : dateTimeOrNull(session.start),
      endAt: occurrenceDate && session.end ? combineDateAndTime(occurrenceDate, session.end) : dateTimeOrNull(session.end),
    })).filter((session) => session.startAt || session.endAt || session.title);
  }

  const startAt = occurrenceDate ? combineDateAndTime(occurrenceDate, draft.time || draft.date) : (dateTimeOrNull(draft.time) || dateTimeOrNull(draft.date));
  return [{
    id: 'main',
    title: 'Main session',
    startAt,
    endAt: null,
  }];
}

function buildOccurrenceDates(draft) {
  const start = dateTimeOrNull(draft.date);
  if (!draft.recurring || !draft.recurrenceEnd || !start) return [start].filter(Boolean);

  const end = dateTimeOrNull(`${draft.recurrenceEnd}T23:59`);
  if (!end || end < start) return [start];

  const selectedDays = draft.recurrenceDays.length
    ? draft.recurrenceDays
    : [weekDayNames[start.getDay()]];
  const selectedDayNumbers = selectedDays.map((day) => weekDayNames.indexOf(day)).filter((index) => index >= 0);
  const dates = [];
  let cursor = new Date(start);

  while (cursor <= end && dates.length <= 104) {
    if (selectedDayNumbers.includes(cursor.getDay())) {
      dates.push(combineDateAndTime(cursor, draft.time || draft.date));
    }
    cursor = addDays(cursor, 1);
  }

  return dates.length ? dates : [start];
}

function buildCreatePayload(draft, user, branches, users, ministries) {
  const isGlobal = Boolean(
    draft.global ||
    draft.branchId === 'global' ||
    draft.branch_name?.trim().toLowerCase() === 'global' ||
    (Array.isArray(draft.branches) && draft.branches.some((b) => `${b}`.trim().toLowerCase() === 'global'))
  );
  const branchDoc = isGlobal ? null : branches.find((branch) => branch.id === draft.branchId);
  const ministryDoc = ministries.find((ministry) => ministry.id === draft.ministryId);
  const contactDoc = users.find((profile) => profile.id === draft.contactPersonId);
  const date = dateTimeOrNull(draft.date);
  const time = dateTimeOrNull(draft.time);
  const locationPinLat = Number.parseFloat(draft.locationPinLat);
  const locationPinLng = Number.parseFloat(draft.locationPinLng);
  const ministryNameValue = draft.mininstryName.trim() || ministryDoc?.name || ministryDoc?.ministryName || '';

  const branchesList = isGlobal
    ? Array.from(new Set(['Global', ...(draft.branches || [])]))
    : (draft.branches || []);

  const payload = {
    title: draft.title.trim(),
    description: draft.description.trim(),
    booking: draft.booking,
    picture: draft.picture.trim(),
    global: isGlobal,
    location: draft.location.trim(),
    location_link: draft.location_link.trim(),
    price: Number.parseFloat(draft.price || '0') || 0,
    ticketLimit: Number.parseInt(draft.ticketLimit || '0', 10) || 0,
    recurring: draft.recurring,
    day: draft.day,
    branch_name: isGlobal ? 'Global' : draft.branch_name.trim(),
    repeat: draft.repeat,
    date_details: draft.date_details.trim(),
    time_details: draft.time_details.trim(),
    mininstryName: ministryNameValue,
    ministryName: ministryNameValue,
    branches: branchesList,
    checkInEnabled: draft.checkInEnabled,
    checkOutEnabled: draft.checkOutEnabled,
    multiSession: draft.multiSession,
    sessions: buildSessions(draft),
    recurrenceEnd: draft.recurrenceEnd || '',
    recurrenceDays: draft.recurrenceDays,
    createdAt: serverTimestamp(),
    createdBy: user?.uid || '',
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid || '',
  };

  if (date) payload.date = date;
  if (time) payload.time = time;
  if (Number.isFinite(locationPinLat) && Number.isFinite(locationPinLng)) {
    payload.locationPIN = new GeoPoint(locationPinLat, locationPinLng);
  }
  if (branchDoc?.ref) payload.branch = branchDoc.ref;
  if (ministryDoc?.ref) payload.ministry = ministryDoc.ref;
  if (contactDoc?.ref) payload.contactPerson = contactDoc.ref;

  return payload;
}

export default function EventsWorkspacePage() {
  const { user, roles, profile } = useAuth();
  const canAccessEvents = roles.some((role) => eventAccessRoles.includes(role));
  const canCreateEvent = roles.some((role) => creatorRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && roles.includes('branch_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loadingFoundation, setLoadingFoundation] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [branches, setBranches] = useState([]);
  const [events, setEvents] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('events');
  const [geocodingEvent, setGeocodingEvent] = useState(false);
  const [draft, setDraft] = useState({ ...emptyDraft });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoadingFoundation(true);
      setLoadingEvents(true);
      setError('');

      try {
        const [branchesSnapshot, eventsSnapshot, ministriesSnapshot, usersSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'branches')),
          getDocs(collection(firestore, 'events')),
          getDocs(collection(firestore, 'ministries')),
          getDocs(collection(firestore, 'users')).catch(() => ({ docs: [] })),
        ]);

        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ref: branchDoc.ref, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));
        const nextEvents = eventsSnapshot.docs
          .map((eventDoc) => ({ id: eventDoc.id, ref: eventDoc.ref, ...eventDoc.data() }))
          .sort((left, right) => {
            const leftDate = typeof left.date?.toDate === 'function' ? left.date.toDate() : new Date(left.date || 0);
            const rightDate = typeof right.date?.toDate === 'function' ? right.date.toDate() : new Date(right.date || 0);
            return rightDate.getTime() - leftDate.getTime();
          });
        const nextMinistries = ministriesSnapshot.docs
          .map((ministryDoc) => ({ id: ministryDoc.id, ref: ministryDoc.ref, ...ministryDoc.data() }))
          .sort((left, right) => `${left.name || left.ministryName || ''}`.localeCompare(`${right.name || right.ministryName || ''}`));
        const nextUsers = usersSnapshot.docs
          .map((userDoc) => ({ id: userDoc.id, ref: userDoc.ref, ...userDoc.data() }))
          .sort((left, right) => `${left.displayName || left.name || left.email || ''}`.localeCompare(`${right.displayName || right.name || right.email || ''}`));

        if (active) {
          setBranches(nextBranches);
          setEvents(nextEvents);
          setMinistries(nextMinistries);
          setUsers(nextUsers);
        }
      } catch {
        if (active) {
          setError('Events could not be loaded. Check Firestore permissions.');
          setBranches([]);
          setEvents([]);
          setMinistries([]);
          setUsers([]);
        }
      } finally {
        if (active) {
          setLoadingFoundation(false);
          setLoadingEvents(false);
        }
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, []);

  const visibleBranches = useMemo(() => {
    if (!isBranchScoped) return branches;
    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchScoped]);

  useEffect(() => {
    if (!visibleBranches.length) {
      setSelectedBranchId('');
      return;
    }

    if (!visibleBranches.some((branchDoc) => branchDoc.id === selectedBranchId)) {
      const scopeMatch = visibleBranches.find((branchDoc) => branchMatchesScope(branchDoc, branchScope));
      setSelectedBranchId(scopeMatch?.id || visibleBranches[0].id);
    }
  }, [branchScope, selectedBranchId, visibleBranches]);

  const selectedBranch = useMemo(
    () => visibleBranches.find((branchDoc) => branchDoc.id === selectedBranchId) || null,
    [selectedBranchId, visibleBranches],
  );

  const selectedBranchName = selectedBranch ? branchLabel(selectedBranch) : 'Select a branch';
  const visibleEvents = selectedBranch ? events.filter((eventDoc) => eventMatchesBranch(eventDoc, selectedBranch)) : [];

  useEffect(() => {
    if (!selectedBranch || activeTab !== 'create') return;

    const label = branchLabel(selectedBranch);
    if (!canManageAll) {
      setDraft((current) => ({
        ...current,
        global: false,
        branchId: selectedBranch.id,
        branch_name: label,
        branches: [label],
      }));
      return;
    }

    setDraft((current) => ({
      ...current,
      branchId: current.branchId || selectedBranch.id,
      branch_name: current.branch_name || label,
      branches: current.branches.length ? current.branches : [label],
    }));
  }, [activeTab, canManageAll, selectedBranch]);

  function toggleDraftBranch(value) {
    if (!canManageAll && value !== selectedBranchName) return;

    setDraft((current) => ({
      ...current,
      branches: current.branches.includes(value)
        ? current.branches.filter((branch) => branch !== value)
        : [...current.branches, value],
    }));
  }

  async function handleFindCoordinates() {
    const address = `${draft.location || ''}`.trim();

    if (!address) {
      setError('Enter the event address first.');
      setMessage('');
      return;
    }

    setGeocodingEvent(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`);

      if (!response.ok) {
        throw new Error(`Nominatim returned ${response.status}`);
      }

      const results = await response.json();
      const place = Array.isArray(results) ? results[0] : null;

      if (!place?.lat || !place?.lon) {
        setError('No map result was found for that event address. Try adding the city and country.');
        return;
      }

      const lat = Number.parseFloat(place.lat).toFixed(6);
      const lng = Number.parseFloat(place.lon).toFixed(6);

      setDraft((current) => ({
        ...current,
        location: place.display_name || address,
        locationPinLat: lat,
        locationPinLng: lng,
        location_link: generatedMapUrl(lat, lng),
      }));
      setMessage('Coordinates found from the event address. Review them before saving.');
    } catch (err) {
      console.error('Event address geocoding failed:', err);
      setError('The event address could not be geocoded right now. Try again or enter coordinates manually.');
    } finally {
      setGeocodingEvent(false);
    }
  }

  async function handleCreateEvent(event) {
    event.preventDefault();
    if (!canCreateEvent) {
      setError('This account cannot create events.');
      setMessage('');
      return;
    }

    const scopedDraft = !canManageAll && selectedBranch
      ? { ...draft, global: false, branchId: selectedBranch.id, branch_name: selectedBranchName, branches: [selectedBranchName] }
      : draft;

    if (!scopedDraft.title.trim()) {
      setError('Add an event title first.');
      setMessage('');
      return;
    }

    if (!scopedDraft.description.trim()) {
      setError('Add an event description first.');
      setMessage('');
      return;
    }

    if (!scopedDraft.global && !scopedDraft.branch_name.trim()) {
      setError('Select the branch this event belongs to.');
      setMessage('');
      return;
    }

    if (scopedDraft.booking && !scopedDraft.branches.length) {
      setError('Add at least one registration branch when registration is enabled.');
      setMessage('');
      return;
    }

    const occurrenceDates = buildOccurrenceDates(scopedDraft);
    if (occurrenceDates.length > 104) {
      setError('This recurrence range creates too many events. Use a shorter range for now.');
      setMessage('');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const payload = buildCreatePayload(scopedDraft, user, branches, users, ministries);
      const recurrenceBatchId = scopedDraft.recurring && occurrenceDates.length > 1
        ? `events-${Date.now()}-${Math.random().toString(36).slice(2)}`
        : '';
      const payloads = occurrenceDates.length
        ? occurrenceDates.map((occurrenceDate) => ({
          ...payload,
          date: occurrenceDate,
          time: combineDateAndTime(occurrenceDate, scopedDraft.time || scopedDraft.date),
          sessions: buildSessions(scopedDraft, occurrenceDate),
          recurrenceBatchId,
        }))
        : [payload];

      const createdDocs = await Promise.all(payloads.map((eventPayload) => addDoc(collection(firestore, 'events'), eventPayload)));
      setEvents((existing) => [
        ...createdDocs.map((created, index) => ({ id: created.id, ref: created, ...payloads[index] })),
        ...existing,
      ]);
      setDraft({ ...emptyDraft });
      setActiveTab('events');
      setMessage(payloads.length > 1 ? `Created ${payloads.length} recurring events.` : `Created ${payload.title}.`);
    } catch {
      setError('The event could not be created right now.');
    } finally {
      setCreating(false);
    }
  }

  if (!canAccessEvents) return <Navigate to="/access-denied" replace />;

  if (isBranchScoped && !loadingFoundation && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Events</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Assign a branch on the user profile first. Branch editors can only manage events for their branch.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Events</h1>
          </div>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branches</p>
            <span className="text-sm text-slate-300">{loadingFoundation ? 'Loading…' : selectedBranchName}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
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

        <section data-tour-id="events-tabs" className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button type="button" onClick={() => setActiveTab('events')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'events' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>Events</button>
            <button type="button" onClick={() => setActiveTab('create')} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'create' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}>Create event</button>
          </div>
        </section>

        {activeTab === 'events' ? (
          <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Events</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{loadingEvents ? 'Loading…' : `${visibleEvents.length} records`}</span>
            </div>

            <div className="space-y-3">
              {visibleEvents.map((eventDoc) => <EventRow key={eventDoc.id} eventDoc={eventDoc} canEdit={canUserEditEvent(roles, profile, eventDoc)} />)}
              {!visibleEvents.length && !loadingEvents ? (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">No events are linked to this branch yet.</div>
              ) : null}
            </div>
          </section>
        ) : (
          <form data-tour-id="events-create-form" onSubmit={handleCreateEvent} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Create event</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">New event profile</h2>
              </div>
              {!canManageAll ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{selectedBranchName} only</span> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Title" value={draft.title} onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))} placeholder="Event title" />
              <TextField label="Picture URL" value={draft.picture} onChange={(event) => setDraft((current) => ({ ...current, picture: event.target.value }))} placeholder="Image URL" />
              <TextField label="Event date" type="datetime-local" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} />
              <TextField label="Event time" type="datetime-local" value={draft.time} onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))} />
              <TextField label="Date details" value={draft.date_details} onChange={(event) => setDraft((current) => ({ ...current, date_details: event.target.value }))} placeholder="e.g. Every Sunday / 14-16 June" />
              <TextField label="Time details" value={draft.time_details} onChange={(event) => setDraft((current) => ({ ...current, time_details: event.target.value }))} placeholder="e.g. 09:00 AM / Doors open 18:00" />
              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Event location and map</p>
                    <p className="mt-1 text-xs text-slate-400">Type the venue address, find coordinates, then save the generated map URL.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleFindCoordinates}
                    disabled={geocodingEvent}
                    className="rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {geocodingEvent ? 'Finding...' : 'Find coordinates'}
                  </button>
                </div>
                <TextField label="Location" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Venue or address" />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Location pin lat" value={draft.locationPinLat} onChange={(event) => setDraft((current) => ({ ...current, locationPinLat: event.target.value, location_link: generatedMapUrl(event.target.value, current.locationPinLng) }))} placeholder="Latitude" />
                  <TextField label="Location pin lng" value={draft.locationPinLng} onChange={(event) => setDraft((current) => ({ ...current, locationPinLng: event.target.value, location_link: generatedMapUrl(current.locationPinLat, event.target.value) }))} placeholder="Longitude" />
                </div>
                <TextField label="Location link" value={draft.location_link} onChange={(event) => setDraft((current) => ({ ...current, location_link: event.target.value }))} placeholder="Generated Google Maps URL" />
                <div className="flex flex-wrap gap-3">
                  {draft.locationPinLat && draft.locationPinLng && (
                    <a
                      href={openStreetMapUrl(draft.locationPinLat, draft.locationPinLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                    >
                      Preview on map
                    </a>
                  )}
                  {draft.location_link && (
                    <a
                      href={draft.location_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                    >
                      Open saved URL
                    </a>
                  )}
                </div>
              </div>
              <TextField label="Price" type="number" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} placeholder="0" />
              <TextField label="Seat capacity / Ticket limit" type="number" value={draft.ticketLimit} onChange={(event) => setDraft((current) => ({ ...current, ticketLimit: event.target.value }))} placeholder="0 = unlimited" />
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Day</span>
                <select value={draft.day} onChange={(event) => setDraft((current) => ({ ...current, day: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  {dayOptions.map((option) => <option key={option || 'none'} value={option}>{option || 'No day selected'}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Repeat</span>
                <select value={draft.repeat} onChange={(event) => setDraft((current) => ({ ...current, repeat: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  {repeatOptions.map((option) => <option key={option || 'none'} value={option}>{option || 'No repeat selected'}</option>)}
                </select>
              </label>
            </div>

            <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Public event description" rows={4} />

              <section data-tour-id="events-registration-settings" className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visibility and registrations</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <TogglePill active={draft.booking} onClick={() => setDraft((current) => ({ ...current, booking: !current.booking }))}>Enable registration</TogglePill>
                  <TogglePill active={draft.recurring} onClick={() => setDraft((current) => ({ ...current, recurring: !current.recurring }))}>Recurring event</TogglePill>
                  <TogglePill active={draft.global} disabled={!canManageAll} onClick={() => setDraft((current) => ({ ...current, global: !current.global }))}>Global event</TogglePill>
                  <TogglePill active={draft.checkInEnabled} onClick={() => setDraft((current) => ({ ...current, checkInEnabled: !current.checkInEnabled }))}>Enable check-in</TogglePill>
                  <TogglePill active={draft.checkOutEnabled} onClick={() => setDraft((current) => ({ ...current, checkOutEnabled: !current.checkOutEnabled }))}>Enable check-out</TogglePill>
                  <TogglePill active={draft.multiSession} onClick={() => setDraft((current) => ({ ...current, multiSession: !current.multiSession }))}>Multiple sessions</TogglePill>
                </div>
              </section>

            {draft.recurring ? (
              <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Recurring schedule</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">When an end date is provided, the create action will generate event records for every selected weekday in the range.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <TextField label="Repeat until" type="date" value={draft.recurrenceEnd} onChange={(event) => setDraft((current) => ({ ...current, recurrenceEnd: event.target.value }))} />
                  <TextField label="Estimated records" value={`${buildOccurrenceDates(draft).length || 1}`} onChange={() => {}} readOnly />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {weekDayNames.map((day) => (
                    <TogglePill
                      key={day}
                      active={draft.recurrenceDays.includes(day)}
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
                <p className="mt-2 text-sm leading-6 text-slate-400">Each session becomes a selectable check-in target on the event detail page.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <TextField label="Session name" value={draft.sessionTitle} onChange={(event) => setDraft((current) => ({ ...current, sessionTitle: event.target.value }))} placeholder="Morning session" />
                  <TextField label="Starts" type="datetime-local" value={draft.sessionStart} onChange={(event) => setDraft((current) => ({ ...current, sessionStart: event.target.value }))} />
                  <TextField label="Ends" type="datetime-local" value={draft.sessionEnd} onChange={(event) => setDraft((current) => ({ ...current, sessionEnd: event.target.value }))} />
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!draft.sessionTitle.trim() && !draft.sessionStart) return;
                      setDraft((current) => ({
                        ...current,
                        sessions: [
                          ...current.sessions,
                          {
                            id: `session-${Date.now()}`,
                            title: current.sessionTitle.trim() || `Session ${current.sessions.length + 1}`,
                            start: current.sessionStart,
                            end: current.sessionEnd,
                          },
                        ],
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
                <div className="mt-4 space-y-2">
                  {draft.sessions.map((session) => (
                    <div key={session.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                      <div>
                        <p className="font-semibold text-white">{session.title}</p>
                        <p className="text-xs text-slate-400">{session.start || 'No start time'} {session.end ? `→ ${session.end}` : ''}</p>
                      </div>
                      <button type="button" onClick={() => setDraft((current) => ({ ...current, sessions: current.sessions.filter((item) => item.id !== session.id) }))} className="text-xs font-semibold text-red-200 transition hover:text-red-100">Remove</button>
                    </div>
                  ))}
                  {!draft.sessions.length ? <p className="text-sm text-slate-500">No extra sessions added. The event will use the main event time.</p> : null}
                </div>
              </section>
            ) : null}

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Primary branch</span>
                <select
                  value={draft.branchId}
                  disabled={!canManageAll}
                  onChange={(event) => {
                    const selectedVal = event.target.value;
                    if (selectedVal === 'global') {
                      setDraft((current) => ({
                        ...current,
                        branchId: 'global',
                        branch_name: 'Global',
                        global: true,
                        branches: Array.from(new Set(['Global', ...current.branches])),
                      }));
                      return;
                    }
                    const branchDoc = branches.find((branch) => branch.id === selectedVal);
                    setDraft((current) => ({
                      ...current,
                      branchId: selectedVal,
                      branch_name: branchDoc ? branchLabel(branchDoc) : '',
                      global: false,
                      branches: current.branches.length ? current.branches : branchDoc ? [branchLabel(branchDoc)] : [],
                    }));
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70"
                >
                  <option value="">Select branch</option>
                  <option value="global">🌐 Global (All Branches)</option>
                  {branches.map((branchDoc) => <option key={branchDoc.id} value={branchDoc.id}>{branchLabel(branchDoc)}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry</span>
                <select value={draft.ministryId} onChange={(event) => {
                  const ministryDoc = ministries.find((ministry) => ministry.id === event.target.value);
                  setDraft((current) => ({ ...current, ministryId: event.target.value, mininstryName: ministryDoc?.name || ministryDoc?.ministryName || '' }));
                }} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  <option value="">No ministry selected</option>
                  {ministries.map((ministry) => <option key={ministry.id} value={ministry.id}>{ministry.name || ministry.ministryName || 'Untitled ministry'}</option>)}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Contact person</span>
                <select value={draft.contactPersonId} onChange={(event) => setDraft((current) => ({ ...current, contactPersonId: event.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5">
                  <option value="">No contact selected</option>
                  {users.map((userDoc) => <option key={userDoc.id} value={userDoc.id}>{userDoc.displayName || `${userDoc.name || ''} ${userDoc.surname || ''}`.trim() || userDoc.email || 'Unnamed user'}</option>)}
                </select>
              </label>
              <TextField label="Ministry name" value={draft.mininstryName} onChange={(event) => setDraft((current) => ({ ...current, mininstryName: event.target.value }))} placeholder="Website field: mininstryName" />
            </div>

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Registration branches</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">The public registration page uses this list for the branch dropdown.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TogglePill
                  active={draft.global || draft.branches.includes('Global')}
                  onClick={() => {
                    const nextGlobal = !(draft.global || draft.branches.includes('Global'));
                    setDraft((current) => ({
                      ...current,
                      global: nextGlobal,
                      branchId: nextGlobal ? 'global' : (current.branchId === 'global' ? '' : current.branchId),
                      branch_name: nextGlobal ? 'Global' : (current.branch_name === 'Global' ? '' : current.branch_name),
                      branches: nextGlobal
                        ? Array.from(new Set(['Global', ...current.branches]))
                        : current.branches.filter((b) => b !== 'Global'),
                    }));
                  }}
                >
                  🌐 Global (All Branches)
                </TogglePill>
                {branches.map((branchDoc) => {
                  const label = branchLabel(branchDoc);
                  const disabled = !canManageAll && label !== selectedBranchName;
                  return <TogglePill key={branchDoc.id} active={draft.branches.includes(label)} disabled={disabled} onClick={() => toggleDraftBranch(label)}>{label}</TogglePill>;
                })}
              </div>
            </section>

            <div className="flex justify-end">
              <button type="submit" disabled={creating || !canCreateEvent} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {creating ? 'Creating…' : 'Create event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
