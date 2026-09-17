import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const mediaAccessRoles = ['super_admin', 'global_editor', 'branch_editor'];
const sourceTypes = [
  { key: 'youtube', title: 'YouTube', collectionName: 'sermons' },
  { key: 'podcast', title: 'Podcast', collectionName: 'podcast' },
  { key: 'facebook', title: 'Facebook', collectionName: 'sermons' },
];

const emptySourceDraft = {
  platform: 'youtube',
  sourceName: '',
  sourceUrl: '',
  syncFrequency: 'daily',
  notes: '',
  enabled: true,
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

function mediaTitle(item) {
  return item?.Title || item?.title || 'Untitled sermon';
}

function mediaDate(item) {
  const value = item?.date;
  if (!value) return 'No date';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime())
    ? 'No date'
    : new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function sourceTypeForSermon(item) {
  const value = `${item?.sourceType || ''}`.trim().toLowerCase();
  return value || 'youtube';
}

function mediaMatchesBranch(item, branchDoc) {
  const itemBranchName = `${item?.branchName || ''}`.trim().toLowerCase();
  const selectedName = branchLabel(branchDoc).toLowerCase();
  const selectedId = `${branchDoc?.id || ''}`.trim().toLowerCase();
  return itemBranchName === selectedName || itemBranchName === selectedId;
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

function MediaRow({ item, activeTab }) {
  return (
    <Link
      to={`/workspace/sermons/${activeTab}/${item.id}`}
      className="group flex w-full min-w-0 items-center justify-between gap-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="whitespace-normal break-words font-semibold leading-6 text-white">{mediaTitle(item)}</p>
        <div className="mt-1 hidden flex-wrap gap-2 text-xs text-slate-400 sm:flex">
          <span>{mediaDate(item)}</span>
          {item.preacher ? <span>{item.preacher}</span> : null}
          {item.videoLink || item.link ? <span className="text-brand-gold">Link ready</span> : null}
        </div>
      </div>
      <ArrowIcon />
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

function AddSourceOverlay({ branches, selectedBranch, draft, setDraft, saving, onClose, onSave }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <form onSubmit={onSave} className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-5 shadow-soft [scrollbar-width:none] [-ms-overflow-style:none] sm:p-6 [&::-webkit-scrollbar]:hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Media puller</p>
            <h2 className="mt-2 text-2xl font-bold text-white">Add source</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Save the branch source now. The backend sync can later pull from YouTube, podcast RSS, or Facebook into the native website collections.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:border-brand-gold hover:text-brand-gold">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Branch</span>
            <select
              value={selectedBranch?.id || ''}
              disabled
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none"
            >
              {branches.map((branchDoc) => <option key={branchDoc.id} value={branchDoc.id}>{branchLabel(branchDoc)}</option>)}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Source type</span>
            <select
              value={draft.platform}
              onChange={(event) => setDraft((current) => ({ ...current, platform: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
            >
              {sourceTypes.map((type) => <option key={type.key} value={type.key}>{type.title}</option>)}
            </select>
          </label>
          <TextField label="Source name" value={draft.sourceName} onChange={(event) => setDraft((current) => ({ ...current, sourceName: event.target.value }))} placeholder="e.g. SSMI Boksburg YouTube" />
          <TextField label="Source URL" value={draft.sourceUrl} onChange={(event) => setDraft((current) => ({ ...current, sourceUrl: event.target.value }))} placeholder="Channel, playlist, podcast RSS, Spotify show, or Facebook page URL" />
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sync frequency</span>
            <select
              value={draft.syncFrequency}
              onChange={(event) => setDraft((current) => ({ ...current, syncFrequency: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
            >
              <option value="daily">Daily</option>
              <option value="manual">Manual only</option>
              <option value="weekly">Weekly</option>
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <input
              type="checkbox"
              checked={draft.enabled}
              onChange={(event) => setDraft((current) => ({ ...current, enabled: event.target.checked }))}
              className="h-4 w-4 accent-brand-gold"
            />
            <span className="text-sm font-semibold text-white">Enable this source</span>
          </label>
        </div>

        <div className="mt-4">
          <TextAreaField label="Notes" value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} placeholder="Optional source notes for the team" rows={3} />
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-brand-gold/20 bg-brand-gold/10 p-4 text-sm leading-6 text-brand-light">
          API keys and access tokens will be configured later in backend secrets, not saved from this browser form.
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button type="button" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 opacity-60" disabled>
            Run sync later
          </button>
          <button type="submit" disabled={saving} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? 'Saving…' : 'Save source'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function SermonsWorkspacePage() {
  const { user, roles, profile } = useAuth();
  const canAccessMedia = roles.some((role) => mediaAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && roles.includes('branch_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loading, setLoading] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [savingSource, setSavingSource] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [branches, setBranches] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('youtube');
  const [showSourceOverlay, setShowSourceOverlay] = useState(false);
  const [sourceDraft, setSourceDraft] = useState({ ...emptySourceDraft });

  useEffect(() => {
    let active = true;

    async function loadBranches() {
      setLoading(true);
      setError('');

      try {
        const snapshot = await getDocs(collection(firestore, 'branches'));
        const nextBranches = snapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ref: branchDoc.ref, ...branchDoc.data() }))
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
        if (active) setLoading(false);
      }
    }

    loadBranches();
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

  useEffect(() => {
    let active = true;

    async function loadMedia() {
      if (!selectedBranch) {
        setItems([]);
        return;
      }

      const source = sourceTypes.find((type) => type.key === activeTab);
      if (!source) return;

      setLoadingMedia(true);
      setError('');

      try {
        const selectedBranchName = branchLabel(selectedBranch);
        const snapshot = await getDocs(query(collection(firestore, source.collectionName), where('branchName', '==', selectedBranchName)));
        const nextItems = snapshot.docs
          .map((mediaDoc) => ({ id: mediaDoc.id, sourceCollection: source.collectionName, ...mediaDoc.data() }))
          .filter((item) => {
            if (!mediaMatchesBranch(item, selectedBranch)) return false;
            if (activeTab === 'podcast') return true;
            return sourceTypeForSermon(item) === activeTab;
          })
          .sort((left, right) => {
            const leftDate = typeof left.date?.toDate === 'function' ? left.date.toDate() : new Date(left.date || 0);
            const rightDate = typeof right.date?.toDate === 'function' ? right.date.toDate() : new Date(right.date || 0);
            return rightDate.getTime() - leftDate.getTime();
          });

        if (active) {
          setItems(nextItems);
        }
      } catch {
        if (active) {
          setItems([]);
          setError('Media could not be loaded. Check admin role access and branch permissions.');
        }
      } finally {
        if (active) setLoadingMedia(false);
      }
    }

    loadMedia();
    return () => {
      active = false;
    };
  }, [activeTab, selectedBranch]);

  async function handleSaveSource(event) {
    event.preventDefault();

    if (!selectedBranch) {
      setError('Select a branch before saving a source.');
      setMessage('');
      return;
    }

    if (!sourceDraft.sourceName.trim() || !sourceDraft.sourceUrl.trim()) {
      setError('Add a source name and source URL first.');
      setMessage('');
      return;
    }

    setSavingSource(true);
    setError('');
    setMessage('');

    try {
      const platform = sourceDraft.platform;
      const payload = {
        branch: selectedBranch.ref,
        branchName: branchLabel(selectedBranch),
        platform,
        sourceType: platform,
        sourceName: sourceDraft.sourceName.trim(),
        sourceUrl: sourceDraft.sourceUrl.trim(),
        syncFrequency: sourceDraft.syncFrequency,
        enabled: sourceDraft.enabled,
        notes: sourceDraft.notes.trim(),
        lastSyncStatus: 'not_configured',
        createdAt: serverTimestamp(),
        createdBy: user?.uid || '',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };

      await addDoc(collection(firestore, 'mediaSources'), payload);
      setSourceDraft({ ...emptySourceDraft, platform: activeTab });
      setShowSourceOverlay(false);
      setMessage('Media source saved. Backend sync can be connected in the next phase.');
    } catch {
      setError('The media source could not be saved right now.');
    } finally {
      setSavingSource(false);
    }
  }

  if (!canAccessMedia) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchScoped && !loading && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Sermons</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign a branch on the user profile first. Branch editors can only manage media for their branch.
          </p>
        </section>
      </main>
    );
  }

  const selectedBranchName = selectedBranch ? branchLabel(selectedBranch) : 'Select a branch';

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Sermons</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              setSourceDraft((current) => ({ ...current, platform: activeTab }));
              setShowSourceOverlay(true);
            }}
            className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
          >
            Add source
          </button>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branches</p>
            <span className="text-sm text-slate-300">{loading ? 'Loading…' : selectedBranchName}</span>
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
            {sourceTypes.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setActiveTab(type.key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === type.key ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
              >
                {type.title}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{sourceTypes.find((type) => type.key === activeTab)?.title}</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {loadingMedia ? 'Loading…' : `${items.length} records`}
            </span>
          </div>

          <div className="space-y-3">
            {items.map((item) => <MediaRow key={item.id} item={item} activeTab={activeTab} />)}
            {!items.length && !loadingMedia && (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                No {sourceTypes.find((type) => type.key === activeTab)?.title.toLowerCase()} media has been linked to this branch yet.
              </div>
            )}
          </div>
        </section>
      </div>

      {showSourceOverlay ? (
        <AddSourceOverlay
          branches={visibleBranches}
          selectedBranch={selectedBranch}
          draft={sourceDraft}
          setDraft={setSourceDraft}
          saving={savingSource}
          onClose={() => setShowSourceOverlay(false)}
          onSave={handleSaveSource}
        />
      ) : null}
    </main>
  );
}
