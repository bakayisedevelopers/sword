import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const ministryAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'ministry_editor'];
const creatorRoles = ['super_admin', 'global_editor', 'branch_editor'];
const fewdsOptions = ['Fellowship', 'Evangelism', 'Worship', 'Discipleship', 'Service'];

const emptyDraft = {
  name: '',
  ministryName: '',
  description: '',
  picture: '',
  FEWDS: 'Fellowship',
  branches: [],
  meetingDetails: '',
  servingDetails: '',
  contactName: '',
  contactEmail: '',
  contactWhatsApp: '',
  donations: false,
  volunteers: false,
  forServing: false,
  bankingDetails: '',
};

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

function ministryName(ministry) {
  return ministry?.name || ministry?.ministryName || 'Untitled ministry';
}

function ministryBranches(ministry) {
  return Array.isArray(ministry?.branches) ? ministry.branches.filter(Boolean) : [];
}

function ministryMatchesBranch(ministry, branchDoc) {
  const selectedName = branchLabel(branchDoc).toLowerCase();
  const selectedId = `${branchDoc?.id || ''}`.toLowerCase();
  return ministryBranches(ministry).some((branch) => {
    const value = `${branch || ''}`.trim().toLowerCase();
    return value === selectedName || value === selectedId;
  });
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

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 5l7 7-7 7" />
    </svg>
  );
}

function MinistryRow({ ministry, canEdit }) {
  return (
    <Link
      to={`/workspace/ministries/${ministry.id}`}
      className="group flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{ministryName(ministry)}</p>
        <div className="mt-1 hidden flex-wrap gap-2 text-xs text-slate-400 sm:flex">
          <span>{ministry.FEWDS || 'No department'}</span>
          {ministry.donations ? <span className="text-brand-gold">Giving enabled</span> : null}
          {ministry.volunteers || ministry.forServing ? <span>Volunteer enabled</span> : null}
          {!canEdit ? <span>View only</span> : null}
        </div>
      </div>
      <ChevronIcon />
    </Link>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
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

function buildCreatePayload(draft, user) {
  return {
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
    status: 'active',
    createdAt: serverTimestamp(),
    createdBy: user?.uid || '',
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid || '',
  };
}

export default function MinistriesWorkspacePage() {
  const { user, roles, profile } = useAuth();
  const canAccessMinistries = roles.some((role) => ministryAccessRoles.includes(role));
  const canCreateMinistry = roles.some((role) => creatorRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && roles.includes('branch_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingMinistries, setLoadingMinistries] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [branches, setBranches] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('ministries');
  const [draft, setDraft] = useState({ ...emptyDraft });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoadingBranches(true);
      setLoadingMinistries(true);
      setError('');

      try {
        const [branchesSnapshot, ministriesSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'branches')),
          getDocs(collection(firestore, 'ministries')),
        ]);

        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        const nextMinistries = ministriesSnapshot.docs
          .map((ministryDoc) => ({ id: ministryDoc.id, ...ministryDoc.data() }))
          .sort((left, right) => ministryName(left).localeCompare(ministryName(right)));

        if (active) {
          setBranches(nextBranches);
          setMinistries(nextMinistries);
        }
      } catch {
        if (active) {
          setBranches([]);
          setMinistries([]);
          setError('Ministries could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoadingBranches(false);
          setLoadingMinistries(false);
        }
      }
    }

    loadData();

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
  const visibleMinistries = selectedBranch
    ? ministries.filter((ministry) => ministryMatchesBranch(ministry, selectedBranch))
    : [];

  useEffect(() => {
    if (!selectedBranch || activeTab !== 'create') {
      return;
    }

    const label = branchLabel(selectedBranch);
    if (!canManageAll) {
      setDraft((current) => ({ ...current, branches: [label] }));
      return;
    }

    setDraft((current) => (
      current.branches.length ? current : { ...current, branches: [label] }
    ));
  }, [activeTab, canManageAll, selectedBranch]);

  function toggleDraftBranch(value) {
    if (!canManageAll && value !== selectedBranchName) {
      return;
    }

    setDraft((current) => ({
      ...current,
      branches: current.branches.includes(value)
        ? current.branches.filter((branch) => branch !== value)
        : [...current.branches, value],
    }));
  }

  async function handleCreateMinistry(event) {
    event.preventDefault();
    if (!canCreateMinistry) {
      setError('Only super admins, global editors, and branch editors can create ministries.');
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

    const scopedDraft = !canManageAll && selectedBranch
      ? { ...draft, branches: [selectedBranchName] }
      : draft;

    if (!scopedDraft.branches.length) {
      setError('Select at least one branch for this ministry.');
      setMessage('');
      return;
    }

    if (scopedDraft.donations && !scopedDraft.bankingDetails.trim()) {
      setError('Add banking details before enabling giving for this ministry.');
      setMessage('');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const payload = buildCreatePayload(scopedDraft, user);
      const created = await addDoc(collection(firestore, 'ministries'), payload);
      setMinistries((existing) => [...existing, { id: created.id, ...payload }].sort((left, right) => ministryName(left).localeCompare(ministryName(right))));
      setDraft({ ...emptyDraft });
      setActiveTab('ministries');
      setMessage(`Created ${payload.name}.`);
    } catch {
      setError('The ministry could not be created right now.');
    } finally {
      setCreating(false);
    }
  }

  if (!canAccessMinistries) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchScoped && !loadingBranches && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministries</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign a branch on the user profile first. Branch editors can only manage ministries linked to their branch.
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
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ministries</h1>
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
            <span className="text-sm text-slate-300">{loadingBranches ? 'Loading…' : selectedBranchName}</span>
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

        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('ministries')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'ministries' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Ministries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'create' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Create ministry
            </button>
          </div>
        </section>

        {activeTab === 'ministries' ? (
          <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministries</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {loadingMinistries ? 'Loading…' : `${visibleMinistries.length} records`}
              </span>
            </div>

            <div className="space-y-3">
              {visibleMinistries.map((ministry) => (
                <MinistryRow key={ministry.id} ministry={ministry} canEdit={canUserEditMinistry(roles, profile, ministry)} />
              ))}
              {!visibleMinistries.length && !loadingMinistries && (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  No ministries are linked to this branch yet.
                </div>
              )}
            </div>
          </section>
        ) : (
          <form onSubmit={handleCreateMinistry} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Create ministry</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">New ministry profile</h2>
              </div>
              {!canCreateMinistry ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">No create access</span>
              ) : !canManageAll ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{selectedBranchName} only</span>
              ) : null}
            </div>

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
                  const disabled = !canManageAll && label !== selectedBranchName;
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
                disabled={creating || !canCreateMinistry}
                className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating…' : 'Create ministry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
