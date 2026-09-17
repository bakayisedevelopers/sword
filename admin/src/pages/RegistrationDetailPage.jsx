import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const registrationAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];

function registrationName(registration) {
  return `${registration?.name || ''} ${registration?.surname || ''}`.trim() || 'Unnamed registration';
}

function toDate(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(value) {
  const date = toDate(value);
  return date ? new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date) : '—';
}

function eventPrice(eventDoc) {
  if (!eventDoc?.price) return 0;
  const raw = typeof eventDoc.price === 'string' ? eventDoc.price.replace(/[^0-9.]/g, '') : eventDoc.price;
  const price = Number.parseFloat(raw || '0') || 0;
  return price > 0 ? price : 0;
}

function eventSessions(eventDoc) {
  const sessions = Array.isArray(eventDoc?.sessions) ? eventDoc.sessions.filter(Boolean) : [];
  if (sessions.length) return sessions;
  return [{ id: 'main', title: 'Main session', startAt: eventDoc?.time || eventDoc?.date || null, endAt: null }];
}

function hasSessionCheck(registration, sessionId, status) {
  return Array.isArray(registration?.checkIns) && registration.checkIns.some((check) => check?.sessionId === sessionId && check?.status === status);
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-200">{value || '—'}</p>
    </div>
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

export default function RegistrationDetailPage() {
  const { registrationId } = useParams();
  const { user, roles, profile } = useAuth();
  const canAccess = roles.some((role) => registrationAccessRoles.includes(role));
  const canReviewAll = roles.includes('super_admin') || roles.includes('global_editor') || roles.includes('care_team');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);

  const [registration, setRegistration] = useState(null);
  const [eventDoc, setEventDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('main');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const registrationSnapshot = await getDoc(doc(firestore, 'registrations', registrationId));
        const nextRegistration = registrationSnapshot.exists() ? { id: registrationSnapshot.id, ref: registrationSnapshot.ref, ...registrationSnapshot.data() } : null;

        if (!nextRegistration) {
          if (active) setRegistration(null);
          return;
        }

        const scoped = canReviewAll || branchScopes.includes(nextRegistration.branch);
        if (!scoped) {
          if (active) {
            setRegistration(null);
            setError('This registration is outside your branch access.');
          }
          return;
        }

        const eventTitleNeedle = `${nextRegistration.eventName || ''}`.trim();
        const eventsSnapshot = eventTitleNeedle
          ? await getDocs(query(collection(firestore, 'events'), where('title', '==', eventTitleNeedle)))
          : { docs: [] };
        let nextEvent = eventsSnapshot.docs[0] ? { id: eventsSnapshot.docs[0].id, ref: eventsSnapshot.docs[0].ref, ...eventsSnapshot.docs[0].data() } : null;
        if (!nextEvent && eventTitleNeedle) {
          try {
            const allEventsSnap = await getDocs(collection(firestore, 'events'));
            const match = allEventsSnap.docs.find((d) => (d.data()?.title || '').trim().toLowerCase() === eventTitleNeedle.toLowerCase());
            if (match) nextEvent = { id: match.id, ref: match.ref, ...match.data() };
          } catch {
            // ignore fallback query error
          }
        }

        if (active) {
          setRegistration(nextRegistration);
          setEventDoc(nextEvent);
        }
      } catch {
        if (active) {
          setRegistration(null);
          setError('The registration could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (registrationId) loadData();
    return () => {
      active = false;
    };
  }, [branchScopes, canReviewAll, registrationId]);

  const sessions = useMemo(() => eventSessions(eventDoc), [eventDoc]);
  const selectedSession = useMemo(() => sessions.find((session) => session.id === selectedSessionId) || sessions[0] || null, [selectedSessionId, sessions]);
  const price = eventPrice(eventDoc);
  const paymentDone = !price || registration?.paymentStatus === 'paid' || registration?.paymentDone === true;
  const reviewed = registration?.reviewed === true || registration?.acknowledged === true;
  const checkedIn = hasSessionCheck(registration, selectedSession?.id || 'main', 'checked_in') || (selectedSession?.id === 'main' && registration?.checkedIn);
  const checkedOut = hasSessionCheck(registration, selectedSession?.id || 'main', 'checked_out') || (selectedSession?.id === 'main' && registration?.checkedOut);

  useEffect(() => {
    if (!sessions.length) return;
    if (!sessions.some((session) => session.id === selectedSessionId)) setSelectedSessionId(sessions[0].id);
  }, [selectedSessionId, sessions]);

  async function updateRegistration(payload, successMessage) {
    if (!registration?.id) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextPayload = {
        ...payload,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };
      await setDoc(doc(firestore, 'registrations', registration.id), nextPayload, { merge: true });
      setRegistration((current) => ({ ...current, ...nextPayload }));
      setMessage(successMessage);
    } catch {
      setError('The registration could not be updated right now.');
    } finally {
      setSaving(false);
    }
  }

  async function markCheck(status) {
    if (!registration || !selectedSession) return;

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

    await updateRegistration(payload, status === 'checked_out' ? 'Registration checked out.' : 'Registration checked in.');
  }

  if (!canAccess) return <Navigate to="/access-denied" replace />;
  if (!registrationId) return <Navigate to="/workspace/registrations" replace />;
  if (!loading && !registration && !error) return <Navigate to="/workspace/registrations" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Event registration</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{loading ? 'Loading registration…' : registrationName(registration)}</h1>
          </div>
          <Link to="/workspace/registrations" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">Back to registrations</Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && registration ? (
          <>
            <section className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Registered for</p>
                  {eventDoc ? (
                    <Link to={`/workspace/events/${eventDoc.id}`} className="mt-2 inline-flex max-w-full rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110">
                      <span className="truncate">{eventDoc.title}</span>
                    </Link>
                  ) : (
                    <span className="mt-2 inline-flex max-w-full rounded-full border border-brand-gold/30 px-4 py-2 text-sm font-semibold text-brand-gold">
                      <span className="truncate">{registration.eventName || 'No event linked'}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${reviewed ? 'border-brand-gold/30 text-brand-gold' : 'border-white/10 text-slate-300'}`}>
                    {reviewed ? 'Reviewed' : 'New registration'}
                  </span>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${paymentDone ? 'border-brand-gold/30 text-brand-gold' : 'border-amber-300/30 text-amber-200'}`}>
                    {paymentDone ? 'Payment done' : 'Payment pending'}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <DetailItem label="Name" value={registrationName(registration)} />
                <DetailItem label="Cell" value={registration.cell} />
                <DetailItem label="Branch" value={registration.branch} />
                <DetailItem label="Submitted" value={formatDateTime(registration.date || registration.createdAt)} />
                <DetailItem label="Event price" value={price ? `R ${price.toFixed(2)}` : 'Free'} />
                <DetailItem label="Payment status" value={paymentDone ? 'Payment done' : 'Payment pending'} />
              </div>

              {registration.message ? (
                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Message</p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{registration.message}</p>
                </div>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2">
                {!reviewed ? (
                  <button type="button" disabled={saving} onClick={() => updateRegistration({ reviewed: true, reviewedAt: new Date(), reviewedBy: user?.uid || '', acknowledged: true, acknowledgedAt: new Date(), acknowledgedBy: user?.uid || '' }, 'Registration marked as reviewed.')} className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:opacity-50">
                    Mark as reviewed
                  </button>
                ) : null}
                {price ? (
                  <button type="button" disabled={saving} onClick={() => updateRegistration({ paymentStatus: paymentDone ? 'pending' : 'paid', paymentDone: !paymentDone, paymentMarkedAt: new Date(), paymentMarkedBy: user?.uid || '' }, paymentDone ? 'Payment marked as pending.' : 'Payment marked as paid.')} className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50">
                    {paymentDone ? 'Mark payment pending' : 'Mark paid'}
                  </button>
                ) : null}
              </div>
            </section>

            <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Attendance</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Check-in and check-out</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${checkedIn ? 'border-brand-gold/30 text-brand-gold' : 'border-white/10 text-slate-300'}`}>
                  {checkedIn ? 'Checked in' : 'Not checked in'}
                </span>
              </div>

              {!eventDoc ? (
                <div className="rounded-[1.35rem] border border-white/10 bg-slate-950/50 p-4 text-sm leading-6 text-slate-300">
                  No matching event document was found by title. Check-in works best when the registration `eventName` matches the event title.
                </div>
              ) : null}

              {sessions.length > 1 ? (
                <div className="flex flex-wrap gap-2">
                  {sessions.map((session) => (
                    <TogglePill key={session.id} active={selectedSessionId === session.id} onClick={() => setSelectedSessionId(session.id)}>
                      {session.title || 'Session'} {formatDateTime(session.startAt) !== '—' ? `· ${formatDateTime(session.startAt)}` : ''}
                    </TogglePill>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-wrap justify-end gap-2">
                <button type="button" disabled={saving || (eventDoc && eventDoc.checkInEnabled === false)} onClick={() => markCheck('checked_in')} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                  {checkedIn ? 'Check in again' : 'Check in'}
                </button>
                {eventDoc?.checkOutEnabled ? (
                  <button type="button" disabled={saving || eventDoc.checkInEnabled === false} onClick={() => markCheck('checked_out')} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold disabled:cursor-not-allowed disabled:opacity-50">
                    {checkedOut ? 'Check out again' : 'Check out'}
                  </button>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
