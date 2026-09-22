import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const requestAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];
const statusOptions = ['new', 'in_progress', 'followed_up', 'closed'];
const defaultBranchOptions = [
  'Online',
  'Mbabane',
  'Siteki',
  'Hlutsi',
  'Ludzeludze',
  'EMalahleni',
  'Boksburg',
  'Orange Farm',
  'Lagos',
];

function whatsappUrl(rawCell) {
  if (!rawCell) return null;
  const digits = rawCell.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const normalized = digits.startsWith('0') ? `27${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

function telUrl(rawCell) {
  if (!rawCell) return null;
  const clean = rawCell.replace(/[^\d+]/g, '');
  return clean ? `tel:${clean}` : null;
}

function requestName(request) {
  return `${request?.name || ''} ${request?.surname || ''}`.trim() || 'Unnamed request';
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

function formatStatus(value) {
  return `${value || 'new'}`
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
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

export default function RequestDetailPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { user, roles, profile } = useAuth();
  const canAccess = roles.some((role) => requestAccessRoles.includes(role));
  const canReviewAll = roles.includes('super_admin') || roles.includes('global_editor') || roles.includes('care_team');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);

  const [request, setRequest] = useState(null);
  const [branches, setBranches] = useState([]);
  const [assignedBranch, setAssignedBranch] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [requestSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'requests', requestId)),
          getDocs(collection(firestore, 'branches')).catch(() => ({ docs: [] })),
        ]);

        const nextRequest = requestSnapshot.exists()
          ? { id: requestSnapshot.id, ref: requestSnapshot.ref, ...requestSnapshot.data() }
          : null;

        if (!nextRequest) {
          if (active) setRequest(null);
          return;
        }

        const scoped = canReviewAll || branchScopes.includes(nextRequest.branch);
        if (!scoped) {
          if (active) {
            setRequest(null);
            setError('This request is outside your branch access.');
          }
          return;
        }

        const loadedBranches = branchesSnapshot.docs
          .map((bDoc) => bDoc.data()?.name || bDoc.id)
          .filter(Boolean);
        const combinedBranches = Array.from(new Set([...defaultBranchOptions, ...loadedBranches])).sort();

        if (active) {
          setRequest(nextRequest);
          setBranches(combinedBranches);
          setAssignedBranch(nextRequest.branch || 'Online');
          setAdminNotes(nextRequest.adminNotes || nextRequest.notes || '');
        }
      } catch {
        if (active) {
          setRequest(null);
          setError('The request could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (requestId) loadData();
    return () => {
      active = false;
    };
  }, [branchScopes, canReviewAll, requestId]);

  async function updateRequest(payload, successMessage) {
    if (!request?.id) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nextPayload = {
        ...payload,
        updatedAt: serverTimestamp(),
        updatedBy: user?.displayName || user?.email || user?.uid || '',
      };
      await setDoc(doc(firestore, 'requests', request.id), nextPayload, { merge: true });
      setRequest((current) => ({ ...current, ...nextPayload }));
      setMessage(successMessage);
    } catch {
      setError('The request could not be updated right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleBranchChange(nextBranch) {
    setAssignedBranch(nextBranch);
    await updateRequest({
      branch: nextBranch,
    }, `Branch assigned to ${nextBranch}.`);
  }

  async function handleSaveNotes(event) {
    if (event?.preventDefault) event.preventDefault();
    await updateRequest({
      adminNotes: adminNotes.trim(),
      notes: adminNotes.trim(),
    }, 'Admin notes saved.');
  }

  async function handleAcknowledge() {
    await updateRequest({
      acknowledged: true,
      acknowledgedAt: serverTimestamp(),
      acknowledgedBy: user?.displayName || user?.email || user?.uid || '',
      status: request.status && request.status !== 'new' ? request.status : 'in_progress',
    }, 'Request acknowledged.');
  }

  async function handleFollowUp() {
    await updateRequest({
      status: 'followed_up',
      followedUpAt: serverTimestamp(),
      followedUpBy: user?.displayName || user?.email || user?.uid || '',
      acknowledged: true,
      ...(adminNotes.trim() ? { adminNotes: adminNotes.trim(), notes: adminNotes.trim() } : {}),
    }, 'Request marked as followed up.');
  }

  async function handleClose() {
    await updateRequest({
      status: 'closed',
      closedAt: serverTimestamp(),
      closedBy: user?.displayName || user?.email || user?.uid || '',
      acknowledged: true,
    }, 'Request closed.');
  }

  async function handleReopen() {
    await updateRequest({
      status: 'in_progress',
    }, 'Request reopened.');
  }

  const branchDropdownOptions = useMemo(() => {
    return branches.map((b) => ({ id: b, label: b }));
  }, [branches]);

  const phoneUrl = telUrl(request?.cell);
  const chatUrl = whatsappUrl(request?.cell);
  const status = request?.status || (request?.acknowledged ? 'in_progress' : 'new');

  async function handleDeleteRequest() {
    if (!request?.id) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(firestore, 'requests', request.id));
      navigate('/workspace/requests', { replace: true });
    } catch {
      setError('The request could not be deleted right now. Check permissions.');
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (!canAccess) return <Navigate to="/access-denied" replace />;
  if (!requestId) return <Navigate to="/workspace/requests" replace />;
  if (!loading && !request && !error) return <Navigate to="/workspace/requests" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Request</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{loading ? 'Loading request…' : requestName(request)}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-full border border-red-500/30 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
            >
              Delete request
            </button>
            <Link to="/workspace/requests" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
              Back to requests
            </Link>
          </div>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && request ? (
          <>
            {/* Overview Card */}
            <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Request details</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{request.type || 'General request'}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {request.branch ? (
                    <span className="rounded-full border border-brand-gold/30 px-3 py-1 text-xs font-semibold text-brand-gold">{request.branch}</span>
                  ) : null}
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${request.acknowledged ? 'border-brand-gold/30 text-brand-gold' : 'border-white/10 text-slate-300'}`}>
                    {request.acknowledged ? 'Acknowledged' : 'New request'}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300">{formatStatus(status)}</span>
                </div>
              </div>

              {/* Action Buttons bar */}
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {!request.acknowledged && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleAcknowledge}
                    className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
                  >
                    Acknowledge request
                  </button>
                )}
                {status !== 'followed_up' && status !== 'closed' && (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleFollowUp}
                    className="rounded-full border border-brand-gold/40 px-4 py-2.5 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:opacity-50"
                  >
                    Mark as followed up
                  </button>
                )}
                {status !== 'closed' ? (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleClose}
                    className="rounded-full border border-white/10 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-red-400/50 hover:text-red-300 disabled:opacity-50"
                  >
                    Close request
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleReopen}
                    className="rounded-full border border-brand-gold/40 px-4 py-2.5 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:opacity-50"
                  >
                    Reopen request
                  </button>
                )}
              </div>

              {/* Data Grid */}
              <div className="grid gap-4 md:grid-cols-3">
                <DetailItem label="Name" value={requestName(request)} />
                <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cell / Phone</p>
                  <p className="mt-2 text-sm font-semibold text-white">{request.cell || '—'}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {phoneUrl && (
                      <a
                        href={phoneUrl}
                        className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
                      >
                        Call
                      </a>
                    )}
                    {chatUrl && (
                      <a
                        href={chatUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
                <DetailItem label="Assigned branch" value={request.branch} />
                <DetailItem label="Type" value={request.type} />
                <DetailItem label="Submitted" value={formatDateTime(request.date || request.createdAt)} />
                <DetailItem label="Status" value={formatStatus(status)} />
              </div>

              {/* Submitted message */}
              <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Message / Request</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{request.message || '—'}</p>
              </div>
            </section>

            {/* Workflow & Assignment Grid */}
            <section className="grid gap-6 md:grid-cols-2">
              {/* Branch Assignment */}
              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branch routing</p>
                  <h3 className="mt-2 text-xl font-bold text-white">Assign to branch</h3>
                  <p className="mt-1 text-xs text-slate-400">Route this request to a local SSMI branch team for localized pastoral care.</p>
                </div>
                <ChoiceDropdown
                  label="Select Branch"
                  value={assignedBranch}
                  onChange={handleBranchChange}
                  options={branchDropdownOptions}
                  placeholder="Select branch"
                  disabled={saving || (!canReviewAll && !branchScopes.includes(assignedBranch))}
                />
              </div>

              {/* Status Management */}
              <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Request lifecycle</p>
                  <h3 className="mt-2 text-xl font-bold text-white">Status management</h3>
                  <p className="mt-1 text-xs text-slate-400">Update the request&apos;s care progression through the workflow.</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {statusOptions.map((option) => (
                    <TogglePill
                      key={option}
                      active={status === option}
                      disabled={saving}
                      onClick={() => updateRequest({
                        status: option,
                        acknowledged: option !== 'new',
                        acknowledgedAt: option !== 'new' ? (request.acknowledgedAt || new Date()) : null,
                        acknowledgedBy: option !== 'new' ? (request.acknowledgedBy || user?.uid || '') : '',
                      }, `Request marked as ${formatStatus(option)}.`)}
                    >
                      {formatStatus(option)}
                    </TogglePill>
                  ))}
                </div>
              </div>
            </section>

            {/* Admin Notes & Follow-up Documentation */}
            <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Care team documentation</p>
                <h3 className="mt-2 text-2xl font-bold text-white">Admin notes & follow-up log</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Record internal notes, pastoral call summaries, follow-up actions, and prayer points. These notes are visible only to authorized staff.
                </p>
              </div>

              <form onSubmit={handleSaveNotes} className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Internal notes</span>
                  <textarea
                    value={adminNotes}
                    onChange={(event) => setAdminNotes(event.target.value)}
                    rows={4}
                    placeholder="Enter care notes, pastoral call summaries, or next steps…"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save notes'}
                  </button>
                </div>
              </form>

              {/* Attribution & Audit metadata */}
              <div className="grid gap-3 border-t border-white/10 pt-4 text-xs text-slate-400 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <span className="font-semibold text-slate-300">Submitted:</span> {formatDateTime(request.date || request.createdAt)}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Acknowledged:</span> {formatDateTime(request.acknowledgedAt)}
                  {request.acknowledgedBy ? ` (${request.acknowledgedBy})` : ''}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Followed up:</span> {formatDateTime(request.followedUpAt)}
                  {request.followedUpBy ? ` (${request.followedUpBy})` : ''}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Closed:</span> {formatDateTime(request.closedAt)}
                  {request.closedBy ? ` (${request.closedBy})` : ''}
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete request"
        itemName={`${requestName(request)} (${request?.type || 'Request'})`}
        message="Are you sure you want to delete this pastoral care / prayer request document? This action is permanent and cannot be undone."
        loading={deleting}
        onConfirm={handleDeleteRequest}
        onClose={() => setDeleteOpen(false)}
      />
    </main>
  );
}
