import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const signUpAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'care_team'];
const defaultMinistryTypeOptions = [
  'General',
  'Parking/Security',
  'Transport',
  'Intercessors',
  'Camp Yolo',
  'Women on the Move',
  'Men of Dominion',
  'Fire Conference',
  'Be a Host',
  'Super Kids',
  'Youth',
  'Young Adults',
  'Couples',
  'Singles',
  'Super Man',
  'Media/Sound',
  'Ushers',
  'Hospitality',
];

const defaultBranches = [
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

function formatDate(value) {
  if (!value) {
    return '—';
  }

  if (typeof value === 'object' && ('_methodName' in value || 'isEqual' in value)) {
    return new Date().toLocaleString();
  }

  try {
    const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
    if (!date || Number.isNaN(date.getTime())) {
      return '—';
    }
    return date.toLocaleString();
  } catch {
    return '—';
  }
}

function normalizeStatus(record) {
  return `${record?.status || ''}`.trim().toLowerCase() || 'pending';
}

function normalizeType(value) {
  if (Array.isArray(value)) {
    const first = value.find(Boolean);
    return first === 'Parking/Sceurity' ? 'Parking/Security' : first || '';
  }

  return value === 'Parking/Sceurity' ? 'Parking/Security' : `${value || ''}`.trim();
}

function TextField({ label, value, onChange, placeholder, readOnly = false }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
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

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-200">{value || '—'}</p>
    </div>
  );
}

const editableSignUpStatuses = ['acknowledged', 'active', 'approved', 'contacted', 'completed'];

function buildDraft(signUp) {
  return {
    name: signUp?.name || '',
    surname: signUp?.surname || '',
    cell: signUp?.cell || '',
    branch: signUp?.branch || '',
    type: normalizeType(signUp?.type),
    message: signUp?.message || '',
    followUpStatus: signUp?.followUpStatus || '',
    adminNotes: signUp?.adminNotes || '',
  };
}

export default function MinistrySignUpDetailPage() {
  const { signUpId } = useParams();
  const { user, roles, profile } = useAuth();
  const canAccessSignUps = roles.some((role) => signUpAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && (roles.includes('branch_editor') || roles.includes('care_team'));
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [signUp, setSignUp] = useState(null);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [draft, setDraft] = useState(buildDraft(null));

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [signUpSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'signUps', signUpId)),
          getDocs(collection(firestore, 'branches')),
        ]);

        const nextSignUp = signUpSnapshot.exists()
          ? { id: signUpSnapshot.id, ...signUpSnapshot.data() }
          : null;

        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        let nextUsers = [];
        try {
          const usersSnapshot = await getDocs(collection(firestore, 'users'));
          nextUsers = usersSnapshot.docs
            .map((userDoc) => ({ id: userDoc.id, ...userDoc.data() }))
            .sort((left, right) => `${left.displayName || left.email || left.id}`.localeCompare(`${right.displayName || right.email || right.id}`));
        } catch {
          nextUsers = [];
        }

        if (active) {
          setSignUp(nextSignUp);
          setBranches(nextBranches);
          setUsers(nextUsers);
          setDraft(buildDraft(nextSignUp));
        }
      } catch {
        if (active) {
          setSignUp(null);
          setError('The ministry signup could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (signUpId) {
      loadData();
    }

    return () => {
      active = false;
    };
  }, [signUpId]);

  const visibleBranches = useMemo(() => {
    if (!isBranchScoped) {
      return branches;
    }

    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchScoped]);

  const branchOptions = visibleBranches.map((branchDoc) => ({
    id: branchLabel(branchDoc),
    label: branchLabel(branchDoc),
  }));

  const ministryTypeOptions = useMemo(
    () => defaultMinistryTypeOptions.map((option) => ({ id: option, label: option })),
    []
  );

  const assignedUserOptions = users.map((entry) => ({
    id: entry.id,
    label: entry.displayName || entry.name || entry.email || entry.id,
  }));

  const status = normalizeStatus(signUp);
  const assignedUserId = signUp?.assignedToUserId || '';
  const canEditSignUp = editableSignUpStatuses.includes(status);

  async function handleSave(event) {
    event.preventDefault();
    if (!signUp) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        name: draft.name.trim(),
        surname: draft.surname.trim(),
        cell: draft.cell.trim(),
        branch: draft.branch.trim(),
        message: draft.message.trim(),
        type: draft.type ? [draft.type] : [],
        followUpStatus: draft.followUpStatus.trim(),
        adminNotes: draft.adminNotes.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, 'signUps', signUp.id), payload, { merge: true });
      setSignUp((current) => ({ ...current, ...payload }));
      setMessage('Ministry signup saved.');
    } catch {
      setError('The ministry signup could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAcknowledge() {
    if (!signUp) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const nowIso = new Date().toISOString();
      const payload = {
        status: 'acknowledged',
        acknowledgedAt: serverTimestamp(),
        acknowledgedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'signUps', signUp.id), payload, { merge: true });
      setSignUp((current) => ({
        ...current,
        status: 'acknowledged',
        acknowledgedBy: user?.uid || current?.acknowledgedBy,
        acknowledgedAt: nowIso,
      }));
      setMessage('Ministry signup acknowledged.');
    } catch (err) {
      console.error('Error acknowledging signup:', err);
      setError('The ministry signup could not be acknowledged right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkContacted() {
    if (!signUp) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        status: 'contacted',
        contactedAt: serverTimestamp(),
        contactedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'signUps', signUp.id), payload, { merge: true });
      setSignUp((current) => ({ ...current, status: 'contacted', contactedBy: user?.uid || current?.contactedBy, contactedAt: payload.contactedAt }));
      setMessage('Ministry signup marked as contacted.');
    } catch {
      setError('The signup status could not be updated right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkCompleted() {
    if (!signUp) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        status: 'completed',
        completedAt: serverTimestamp(),
        completedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'signUps', signUp.id), payload, { merge: true });
      setSignUp((current) => ({ ...current, status: 'completed', completedBy: user?.uid || current?.completedBy, completedAt: payload.completedAt }));
      setMessage('Ministry signup marked as completed.');
    } catch {
      setError('The signup status could not be updated right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAssignUser(nextUserId) {
    if (!signUp) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const selectedUser = users.find((entry) => entry.id === nextUserId);
      const payload = {
        assignedToUserId: nextUserId,
        assignedToUserRef: nextUserId ? doc(firestore, 'users', nextUserId) : null,
        assignedToName: selectedUser ? selectedUser.displayName || selectedUser.name || selectedUser.email || selectedUser.id : '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'signUps', signUp.id), payload, { merge: true });
      setSignUp((current) => ({ ...current, ...payload }));
      setMessage(nextUserId ? 'Assigned follow-up person.' : 'Assignment cleared.');
    } catch {
      setError('The assignment could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  if (!canAccessSignUps) {
    return <Navigate to="/access-denied" replace />;
  }

  if (!signUpId) {
    return <Navigate to="/workspace/sign-ups" replace />;
  }

  if (!loading && !signUp) {
    return <Navigate to="/workspace/sign-ups" replace />;
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministry SignUps</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Signup details</h1>
          </div>
          <Link to="/workspace/sign-ups" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
            Back to SignUps
          </Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && signUp && (
          <>
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Signup request</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{personName(signUp)}</h2>
                  <p className="mt-2 text-sm text-slate-400">Status: {status} · Submitted: {formatDate(signUp.date)}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {status !== 'acknowledged' && status !== 'contacted' && status !== 'completed' && (
                    <button
                      type="button"
                      onClick={handleAcknowledge}
                      disabled={saving}
                      className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Acknowledge request
                    </button>
                  )}
                  {status !== 'contacted' && status !== 'completed' && (
                    <button
                      type="button"
                      onClick={handleMarkContacted}
                      disabled={saving}
                      className="rounded-full border border-sky-500/30 bg-sky-500/10 px-5 py-3 text-sm font-semibold text-sky-400 transition hover:bg-sky-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark contacted
                    </button>
                  )}
                  {status !== 'completed' && (
                    <button
                      type="button"
                      onClick={handleMarkCompleted}
                      disabled={saving}
                      className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Mark completed
                    </button>
                  )}
                </div>
              </div>
            </section>

            {canEditSignUp ? (
              <>
                <form onSubmit={handleSave} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Name" />
                    <TextField label="Surname" value={draft.surname} onChange={(event) => setDraft((current) => ({ ...current, surname: event.target.value }))} placeholder="Surname" />
                    <div>
                      <TextField label="Cell" value={draft.cell} onChange={(event) => setDraft((current) => ({ ...current, cell: event.target.value }))} placeholder="Cell number" />
                      {(telUrl(draft.cell) || whatsappUrl(draft.cell)) && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {telUrl(draft.cell) && (
                            <a
                              href={telUrl(draft.cell)}
                              className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
                            >
                              Call
                            </a>
                          )}
                          {whatsappUrl(draft.cell) && (
                            <a
                              href={whatsappUrl(draft.cell)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                            >
                              WhatsApp
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <ChoiceDropdown
                      label="Branch"
                      value={draft.branch}
                      onChange={(value) => setDraft((current) => ({ ...current, branch: value }))}
                      options={branchOptions}
                      placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
                      disabled={!branchOptions.length}
                    />
                    <ChoiceDropdown
                      label="Ministry"
                      value={draft.type}
                      onChange={(value) => setDraft((current) => ({ ...current, type: value }))}
                      options={ministryTypeOptions}
                      placeholder="Select ministry"
                    />
                    <TextField label="Follow-up status" value={draft.followUpStatus} onChange={(event) => setDraft((current) => ({ ...current, followUpStatus: event.target.value }))} placeholder="Follow-up status" />
                  </div>

                  <TextAreaField label="Message" value={draft.message} onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))} placeholder="Submitted message" rows={4} />
                  <TextAreaField label="Admin notes" value={draft.adminNotes} onChange={(event) => setDraft((current) => ({ ...current, adminNotes: event.target.value }))} placeholder="Internal notes for ministry or branch team" rows={4} />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? 'Saving…' : 'Save signup'}
                    </button>
                  </div>
                </form>

                <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Follow-up assignment</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Responsible person</h3>
                  <div className="mt-4 max-w-xl">
                    <ChoiceDropdown
                      label="Assign to user"
                      value={assignedUserId}
                      onChange={handleAssignUser}
                      options={assignedUserOptions}
                      placeholder={assignedUserOptions.length ? 'Select user' : 'No users found'}
                      disabled={!assignedUserOptions.length}
                    />
                  </div>
                  <p className="mt-4 text-sm text-slate-400">
                    {signUp.assignedToName ? `Assigned to ${signUp.assignedToName}.` : 'No follow-up person assigned yet.'}
                  </p>
                </section>
              </>
            ) : (
              <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Read-only request</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Submitted ministry signup</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    This is the original website submission. Acknowledge it first before editing, assigning follow-up, or changing ministry details.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <DetailItem label="Name" value={signUp.name} />
                  <DetailItem label="Surname" value={signUp.surname} />
                  <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cell</p>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-200">{signUp.cell || '—'}</p>
                    {(telUrl(signUp.cell) || whatsappUrl(signUp.cell)) && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {telUrl(signUp.cell) && (
                          <a
                            href={telUrl(signUp.cell)}
                            className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400 transition hover:bg-sky-500/20"
                          >
                            Call
                          </a>
                        )}
                        {whatsappUrl(signUp.cell) && (
                          <a
                            href={whatsappUrl(signUp.cell)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  <DetailItem label="Branch" value={signUp.branch} />
                  <DetailItem label="Ministry" value={normalizeType(signUp.type)} />
                  <DetailItem label="Submitted" value={formatDate(signUp.date)} />
                </div>
                <DetailItem label="Message" value={signUp.message} />
              </section>
            )}

            {/* Audit & Workflow Metadata */}
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="grid gap-3 text-xs text-slate-400 sm:grid-cols-2 md:grid-cols-4">
                <div>
                  <span className="font-semibold text-slate-300">Submitted:</span> {formatDate(signUp.date)}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Acknowledged:</span> {formatDate(signUp.acknowledgedAt)}
                  {signUp.acknowledgedBy ? ` (${signUp.acknowledgedBy})` : ''}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Contacted:</span> {formatDate(signUp.contactedAt)}
                  {signUp.contactedBy ? ` (${signUp.contactedBy})` : ''}
                </div>
                <div>
                  <span className="font-semibold text-slate-300">Completed:</span> {formatDate(signUp.completedAt)}
                  {signUp.completedBy ? ` (${signUp.completedBy})` : ''}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
