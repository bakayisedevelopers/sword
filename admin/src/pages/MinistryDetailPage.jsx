import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const ministryAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'ministry_editor'];
const fewdsOptions = ['Fellowship', 'Evangelism', 'Worship', 'Discipleship', 'Service'];

function branchLabel(branchDoc) {
  return branchDoc?.name || branchDoc?.id || 'Untitled branch';
}

function ministryName(ministry) {
  return ministry?.name || ministry?.ministryName || 'Untitled ministry';
}

function ministryBranches(ministry) {
  return Array.isArray(ministry?.branches) ? ministry.branches.filter(Boolean) : [];
}

function buildDraft(ministry) {
  return {
    name: ministry?.name || '',
    ministryName: ministry?.ministryName || '',
    description: ministry?.description || '',
    picture: ministry?.picture || '',
    FEWDS: ministry?.FEWDS || 'Fellowship',
    branches: ministryBranches(ministry),
    meetingDetails: ministry?.meetingDetails || '',
    servingDetails: ministry?.servingDetails || '',
    contactName: ministry?.contactName || '',
    contactEmail: ministry?.contactEmail || '',
    contactWhatsApp: ministry?.contactWhatsApp || '',
    donations: Boolean(ministry?.donations),
    volunteers: Boolean(ministry?.volunteers),
    forServing: Boolean(ministry?.forServing),
    bankingDetails: ministry?.bankingDetails || '',
    status: ministry?.status || 'active',
  };
}

function canUserEditMinistry(roles, profile, ministry) {
  if (roles.includes('super_admin') || roles.includes('global_editor')) {
    return true;
  }

  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranches = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];
  const branches = ministryBranches(ministry).map((branch) => `${branch}`.trim().toLowerCase());

  if (roles.includes('branch_editor') && branches.some((branch) => branch === branchScope || otherBranches.includes(branch))) {
    return true;
  }

  const ministryScopes = Array.isArray(profile?.ministries) ? profile.ministries : [];
  const ministryIdScopes = Array.isArray(profile?.ministryIds) ? profile.ministryIds : [];
  return roles.includes('ministry_editor') && (
    ministryScopes.includes(ministry.name) ||
    ministryScopes.includes(ministry.ministryName) ||
    ministryIdScopes.includes(ministry.id)
  );
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
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'}`}
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

export default function MinistryDetailPage() {
  const { ministryId } = useParams();
  const { user, roles, profile } = useAuth();
  const canAccessMinistries = roles.some((role) => ministryAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranchScopes = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [ministry, setMinistry] = useState(null);
  const [branches, setBranches] = useState([]);
  const [draft, setDraft] = useState(buildDraft(null));

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [ministrySnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'ministries', ministryId)),
          getDocs(collection(firestore, 'branches')),
        ]);

        const nextMinistry = ministrySnapshot.exists()
          ? { id: ministrySnapshot.id, ...ministrySnapshot.data() }
          : null;
        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        if (active) {
          setMinistry(nextMinistry);
          setBranches(nextBranches);
          setDraft(buildDraft(nextMinistry));
        }
      } catch {
        if (active) {
          setMinistry(null);
          setBranches([]);
          setError('The ministry could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (ministryId) {
      loadData();
    }

    return () => {
      active = false;
    };
  }, [ministryId]);

  const canEdit = useMemo(
    () => Boolean(ministry && canUserEditMinistry(roles, profile, ministry)),
    [ministry, profile, roles],
  );

  function toggleDraftBranch(value) {
    if (!canEdit) {
      return;
    }

    const normalizedValue = `${value || ''}`.trim().toLowerCase();
    if (!canManageAll && normalizedValue !== branchScope && !otherBranchScopes.includes(normalizedValue)) {
      return;
    }

    setDraft((current) => ({
      ...current,
      branches: current.branches.includes(value)
        ? current.branches.filter((branch) => branch !== value)
        : [...current.branches, value],
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!ministry || !canEdit) {
      return;
    }

    if (!draft.name.trim()) {
      setError('Enter a ministry name first.');
      setMessage('');
      return;
    }

    if (!draft.description.trim()) {
      setError('Add a ministry description first.');
      setMessage('');
      return;
    }

    if (!draft.branches.length) {
      setError('Select at least one branch for this ministry.');
      setMessage('');
      return;
    }

    if (draft.donations && !draft.bankingDetails.trim()) {
      setError('Add banking details before enabling giving for this ministry.');
      setMessage('');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        name: draft.name.trim(),
        ministryName: draft.ministryName.trim() || draft.name.trim(),
        description: draft.description.trim(),
        picture: draft.picture.trim(),
        FEWDS: draft.FEWDS,
        branches: draft.branches,
        meetingDetails: draft.meetingDetails.trim(),
        servingDetails: draft.servingDetails.trim(),
        contactName: draft.contactName.trim(),
        contactEmail: draft.contactEmail.trim(),
        contactWhatsApp: draft.contactWhatsApp.trim(),
        donations: draft.donations,
        volunteers: draft.volunteers,
        forServing: draft.forServing,
        bankingDetails: draft.bankingDetails.trim(),
        status: draft.status,
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };

      await setDoc(doc(firestore, 'ministries', ministry.id), payload, { merge: true });
      setMinistry((current) => ({ ...current, ...payload }));
      setMessage('Ministry saved.');
    } catch {
      setError('The ministry could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  if (!canAccessMinistries) {
    return <Navigate to="/access-denied" replace />;
  }

  if (!ministryId) {
    return <Navigate to="/workspace/ministries" replace />;
  }

  if (!loading && !ministry) {
    return <Navigate to="/workspace/ministries" replace />;
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministries</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ministry details</h1>
          </div>
          <Link to="/workspace/ministries" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
            Back to ministries
          </Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && ministry && (
          <>
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{draft.FEWDS || 'Department'}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{ministryName(ministry)}</h2>
                  <p className="mt-2 text-sm text-slate-400">{canEdit ? 'Editable ministry record' : 'View-only ministry record'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {draft.donations ? <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">Giving</span> : null}
                  {draft.volunteers ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Volunteer</span> : null}
                  {draft.forServing ? <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Serving</span> : null}
                </div>
              </div>
            </section>

            {canEdit ? (
              <form onSubmit={handleSave} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Ministry name" />
                  <TextField label="Ministry name alias" value={draft.ministryName} onChange={(event) => setDraft((current) => ({ ...current, ministryName: event.target.value }))} placeholder="Optional alias" />
                  <TextField label="Picture URL" value={draft.picture} onChange={(event) => setDraft((current) => ({ ...current, picture: event.target.value }))} placeholder="Image URL" />
                  <label className="block space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FEWDS department</span>
                    <select
                      value={draft.FEWDS}
                      onChange={(event) => setDraft((current) => ({ ...current, FEWDS: event.target.value }))}
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
                    >
                      {fewdsOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                </div>

                <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Public ministry description" rows={4} />

                <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Branches</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {branches.map((branchDoc) => {
                      const label = branchLabel(branchDoc);
                      const normalizedLabel = label.trim().toLowerCase();
                      const disabled = !canManageAll && normalizedLabel !== branchScope && !otherBranchScopes.includes(normalizedLabel);
                      return (
                        <TogglePill key={branchDoc.id} active={draft.branches.includes(label)} disabled={disabled} onClick={() => toggleDraftBranch(label)}>
                          {label}
                        </TogglePill>
                      );
                    })}
                  </div>
                </section>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextAreaField label="Meeting details" value={draft.meetingDetails} onChange={(event) => setDraft((current) => ({ ...current, meetingDetails: event.target.value }))} placeholder="When and where this ministry meets" rows={4} />
                  <TextAreaField label="Serving details" value={draft.servingDetails} onChange={(event) => setDraft((current) => ({ ...current, servingDetails: event.target.value }))} placeholder="How people can serve" rows={4} />
                  <TextField label="Contact name" value={draft.contactName} onChange={(event) => setDraft((current) => ({ ...current, contactName: event.target.value }))} placeholder="Contact person" />
                  <TextField label="Contact email" value={draft.contactEmail} onChange={(event) => setDraft((current) => ({ ...current, contactEmail: event.target.value }))} placeholder="Email address" />
                  <TextField label="Contact WhatsApp" value={draft.contactWhatsApp} onChange={(event) => setDraft((current) => ({ ...current, contactWhatsApp: event.target.value }))} placeholder="WhatsApp number" />
                  <TextField label="Status" value={draft.status} onChange={(event) => setDraft((current) => ({ ...current, status: event.target.value }))} placeholder="active / draft / archived" />
                </div>

                <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Website visibility</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <TogglePill active={draft.donations} onClick={() => setDraft((current) => ({ ...current, donations: !current.donations }))}>Show in Giving</TogglePill>
                    <TogglePill active={draft.volunteers} onClick={() => setDraft((current) => ({ ...current, volunteers: !current.volunteers }))}>Allow Volunteer</TogglePill>
                    <TogglePill active={draft.forServing} onClick={() => setDraft((current) => ({ ...current, forServing: !current.forServing }))}>For Serving</TogglePill>
                  </div>
                </section>

                <TextAreaField label="Banking details" value={draft.bankingDetails} onChange={(event) => setDraft((current) => ({ ...current, bankingDetails: event.target.value }))} placeholder="Required if this ministry appears in Giving" rows={4} />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save ministry'}
                  </button>
                </div>
              </form>
            ) : (
              <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Read-only</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Public ministry content</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <DetailItem label="Name" value={ministry.name} />
                  <DetailItem label="Department" value={ministry.FEWDS} />
                  <DetailItem label="Branches" value={ministryBranches(ministry).join(', ')} />
                  <DetailItem label="Contact name" value={ministry.contactName} />
                  <DetailItem label="Contact email" value={ministry.contactEmail} />
                  <DetailItem label="Contact WhatsApp" value={ministry.contactWhatsApp} />
                  <DetailItem label="Giving enabled" value={ministry.donations ? 'Yes' : 'No'} />
                  <DetailItem label="Volunteer enabled" value={ministry.volunteers ? 'Yes' : 'No'} />
                  <DetailItem label="For serving" value={ministry.forServing ? 'Yes' : 'No'} />
                </div>
                <DetailItem label="Description" value={ministry.description} />
                <DetailItem label="Meeting details" value={ministry.meetingDetails} />
                <DetailItem label="Serving details" value={ministry.servingDetails} />
                <DetailItem label="Banking details" value={ministry.bankingDetails} />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
