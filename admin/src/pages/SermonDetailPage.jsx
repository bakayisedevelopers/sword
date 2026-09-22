import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import { firestore } from '../lib/firebase';

const mediaAccessRoles = ['super_admin', 'global_editor', 'branch_editor'];
const sourceConfig = {
  youtube: { title: 'YouTube', collectionName: 'sermons' },
  podcast: { title: 'Podcast', collectionName: 'podcast' },
  facebook: { title: 'Facebook', collectionName: 'sermons' },
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

function buildDraft(item) {
  const dateValue = item?.date;
  const date = typeof dateValue?.toDate === 'function' ? dateValue.toDate() : dateValue ? new Date(dateValue) : null;

  return {
    Title: item?.Title || item?.title || '',
    date: date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 16) : '',
    description: item?.description || '',
    video: item?.video || '',
    videoLink: item?.videoLink || '',
    link: item?.link || '',
    preacher: item?.preacher || '',
    branchName: item?.branchName || '',
    sourceType: item?.sourceType || '',
    externalId: item?.externalId || '',
    thumbnailUrl: item?.thumbnailUrl || '',
    sourceUrl: item?.sourceUrl || '',
    syncSourceId: item?.syncSourceId || '',
  };
}

function mediaTitle(item) {
  return item?.Title || item?.title || 'Untitled sermon';
}

function mediaBranchName(item) {
  return `${item?.branchName || ''}`.trim();
}

function canUserEditMedia(roles, profile, item) {
  if (roles.includes('super_admin') || roles.includes('global_editor')) {
    return true;
  }

  const branchName = mediaBranchName(item).toLowerCase();
  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranches = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];

  return roles.includes('branch_editor') && branchName && (branchName === branchScope || otherBranches.includes(branchName));
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

function TextAreaField({ label, value, onChange, placeholder, rows = 5, readOnly = false }) {
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

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-200">{value || '—'}</p>
    </div>
  );
}

export default function SermonDetailPage() {
  const { sourceType, mediaId } = useParams();
  const navigate = useNavigate();
  const { user, roles, profile } = useAuth();
  const source = sourceConfig[sourceType];
  const canAccessMedia = roles.some((role) => mediaAccessRoles.includes(role));

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [item, setItem] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [draft, setDraft] = useState(buildDraft(null));

  useEffect(() => {
    let active = true;

    async function loadData() {
      if (!source || !mediaId) return;

      setLoading(true);
      setError('');

      try {
        const [mediaSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, source.collectionName, mediaId)),
          getDocs(collection(firestore, 'branches')),
        ]);

        const nextItem = mediaSnapshot.exists()
          ? { id: mediaSnapshot.id, sourceCollection: source.collectionName, ...mediaSnapshot.data() }
          : null;
        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ref: branchDoc.ref, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        if (active) {
          setItem(nextItem);
          setBranches(nextBranches);
          setDraft(buildDraft(nextItem));
          const matchedBranch = nextBranches.find((branchDoc) => branchMatchesScope(branchDoc, nextItem?.branchName));
          setSelectedBranchId(matchedBranch?.id || '');
        }
      } catch {
        if (active) {
          setItem(null);
          setError('This media item could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();
    return () => {
      active = false;
    };
  }, [mediaId, source]);

  const selectedBranch = useMemo(
    () => branches.find((branchDoc) => branchDoc.id === selectedBranchId) || null,
    [branches, selectedBranchId],
  );

  const canEdit = useMemo(
    () => Boolean(item && canUserEditMedia(roles, profile, item)),
    [item, profile, roles],
  );

  async function handleSave(event) {
    event.preventDefault();
    if (!item || !source || !canEdit) return;

    if (!draft.Title.trim()) {
      setError('Add a title first.');
      setMessage('');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const parsedDate = draft.date ? new Date(draft.date) : null;
      const payload = {
        Title: draft.Title.trim(),
        description: draft.description.trim(),
        video: draft.video.trim(),
        videoLink: draft.videoLink.trim(),
        link: draft.link.trim(),
        preacher: draft.preacher.trim(),
        branchName: selectedBranch ? branchLabel(selectedBranch) : draft.branchName.trim(),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };

      if (parsedDate && !Number.isNaN(parsedDate.getTime())) {
        payload.date = parsedDate;
      }

      if (selectedBranch?.ref) {
        payload.branch = selectedBranch.ref;
      }

      if (sourceType !== 'podcast') {
        payload.sourceType = sourceType === 'facebook' ? 'facebook' : 'youtube';
      }

      ['externalId', 'thumbnailUrl', 'sourceUrl', 'syncSourceId'].forEach((field) => {
        if (draft[field].trim()) {
          payload[field] = draft[field].trim();
        }
      });

      await setDoc(doc(firestore, source.collectionName, item.id), payload, { merge: true });
      setItem((current) => ({ ...current, ...payload }));
      setMessage('Media details saved.');
    } catch {
      setError('The media item could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteMedia() {
    if (!item?.id || !source || !canEdit) return;
    setDeleting(true);
    try {
      await deleteDoc(doc(firestore, source.collectionName, item.id));
      navigate('/workspace/sermons', { replace: true });
    } catch {
      setError('The media item could not be deleted right now. Check permissions.');
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  if (!canAccessMedia) {
    return <Navigate to="/access-denied" replace />;
  }

  if (!source) {
    return <Navigate to="/workspace/sermons" replace />;
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <Link to="/workspace/sermons" className="text-sm font-semibold text-brand-gold">← Back to Sermons</Link>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{source.title}</p>
              <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{loading ? 'Loading media…' : mediaTitle(item)}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setDeleteOpen(true)}
                  className="rounded-full border border-red-500/30 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                >
                  Delete {sourceType === 'podcast' ? 'podcast' : 'sermon'}
                </button>
              )}
              {!canEdit && item ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">View only</span>
              ) : null}
            </div>
          </div>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && !item ? (
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
            This media item was not found.
          </section>
        ) : null}

        {item ? (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <DetailItem label="Collection" value={source.collectionName} />
              <DetailItem label="Branch" value={draft.branchName} />
              <DetailItem label="Source" value={source.title} />
            </section>

            <form onSubmit={handleSave} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Title" value={draft.Title} onChange={(event) => setDraft((current) => ({ ...current, Title: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Date" type="datetime-local" value={draft.date} onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))} readOnly={!canEdit} />
                <TextField label="Preacher" value={draft.preacher} onChange={(event) => setDraft((current) => ({ ...current, preacher: event.target.value }))} placeholder="Speaker or host" readOnly={!canEdit} />
                <label className="block space-y-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Branch</span>
                  <select
                    value={selectedBranchId}
                    onChange={(event) => setSelectedBranchId(event.target.value)}
                    disabled={!canEdit}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:opacity-70"
                  >
                    <option value="">No branch selected</option>
                    {branches.map((branchDoc) => <option key={branchDoc.id} value={branchDoc.id}>{branchLabel(branchDoc)}</option>)}
                  </select>
                </label>
                <TextField label="Video/audio link" value={draft.videoLink} onChange={(event) => setDraft((current) => ({ ...current, videoLink: event.target.value }))} placeholder="Embed or playable URL" readOnly={!canEdit} />
                <TextField label="Public link" value={draft.link} onChange={(event) => setDraft((current) => ({ ...current, link: event.target.value }))} placeholder="Original platform URL" readOnly={!canEdit} />
                <TextField label="Video field" value={draft.video} onChange={(event) => setDraft((current) => ({ ...current, video: event.target.value }))} placeholder="Existing website video value" readOnly={!canEdit} />
                <TextField label="Thumbnail URL" value={draft.thumbnailUrl} onChange={(event) => setDraft((current) => ({ ...current, thumbnailUrl: event.target.value }))} placeholder="Imported thumbnail later" readOnly={!canEdit} />
                <TextField label="External ID" value={draft.externalId} onChange={(event) => setDraft((current) => ({ ...current, externalId: event.target.value }))} placeholder="YouTube video ID, podcast GUID, Facebook video ID" readOnly={!canEdit} />
                <TextField label="Sync source ID" value={draft.syncSourceId} onChange={(event) => setDraft((current) => ({ ...current, syncSourceId: event.target.value }))} placeholder="Future media source reference" readOnly={!canEdit} />
              </div>

              <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} readOnly={!canEdit} />

              {draft.videoLink || draft.link ? (
                <div className="flex flex-wrap gap-3">
                  {draft.videoLink ? <a href={draft.videoLink} target="_blank" rel="noreferrer" className="rounded-full border border-brand-gold/40 px-4 py-2 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold/10">Open media</a> : null}
                  {draft.link ? <a href={draft.link} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-brand-gold">Open public link</a> : null}
                </div>
              ) : null}

              {canEdit ? (
                <div className="flex justify-end">
                  <button type="submit" disabled={saving} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {saving ? 'Saving…' : 'Save media'}
                  </button>
                </div>
              ) : null}
            </form>
          </>
        ) : null}
      </div>

      <ConfirmDeleteModal
        open={deleteOpen}
        title={`Delete ${sourceType === 'podcast' ? 'podcast' : 'sermon'}`}
        itemName={mediaTitle(item)}
        message={`Are you sure you want to delete this ${sourceType === 'podcast' ? 'podcast episode' : 'sermon'}? This will remove it permanently from archives and member apps.`}
        loading={deleting}
        onConfirm={handleDeleteMedia}
        onClose={() => setDeleteOpen(false)}
      />
    </main>
  );
}
