import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const contentAccessRoles = ['super_admin', 'global_editor'];
const homepageContentRef = doc(firestore, 'websiteContent', 'homepage');

const defaultContent = {
  latestSermonTitle: '',
  latestSermonVideoUrl: '',
  latestSermonSource: 'manual',
  latestSermonPublishedAt: '',
  yearThemeTitle: 'Moving from Glory to Glory',
  yearThemeSubtitle: '',
  yearThemeDesktopImageUrl: '',
  yearThemeMobileImageUrl: '',
  albumReleaseTitle: 'Atmosphere of Glory',
  albumReleaseArtist: 'Sword Worship',
  albumReleaseSpotifyUrl: '',
  albumReleaseAppleMusicUrl: '',
  albumReleaseYouTubeUrl: '',
};

function TextField({ label, value, onChange, placeholder, type = 'text', helper }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
      {helper ? <span className="block text-xs leading-5 text-slate-500">{helper}</span> : null}
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full min-w-0 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
    </label>
  );
}

function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function WebsiteContentPage() {
  const { roles, user } = useAuth();
  const canAccess = roles.some((role) => contentAccessRoles.includes(role));

  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const contentSnapshot = await getDoc(homepageContentRef);
        if (!active) return;
        setContent({ ...defaultContent, ...(contentSnapshot.exists() ? contentSnapshot.data() : {}) });
      } catch {
        if (active) setError('Website content could not be loaded. Check Firestore permissions.');
      } finally {
        if (active) setLoading(false);
      }
    }

    if (canAccess) loadData();
    return () => {
      active = false;
    };
  }, [canAccess]);

  async function saveHomepageContent(nextContent, successMessage, savingKey) {
    setSaving(savingKey);
    setError('');
    setMessage('');

    try {
      const payload = {
        ...nextContent,
        latestSermonSource: nextContent.latestSermonSource || 'manual',
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || '',
      };
      await setDoc(homepageContentRef, payload, { merge: true });
      setContent(nextContent);
      setMessage(successMessage);
    } catch {
      setError('Website content could not be saved.');
    } finally {
      setSaving('');
    }
  }

  function saveSermon() {
    saveHomepageContent({ ...content, latestSermonSource: 'manual' }, 'Latest sermon saved to the homepage.', 'sermon');
  }

  function saveTheme() {
    saveHomepageContent({ ...content }, 'Theme of the year saved to the homepage.', 'theme');
  }

  function saveAlbumRelease() {
    saveHomepageContent({ ...content }, 'Album release links saved to the homepage.', 'album');
  }

  function saveAll() {
    saveHomepageContent({ ...content, latestSermonSource: content.latestSermonSource || 'manual' }, 'Website content saved.', 'all');
  }

  if (!canAccess) return <Navigate to="/access-denied" replace />;

  return (
    <main className="w-full max-w-full overflow-x-hidden pb-6">
      <div className="mx-auto w-full max-w-6xl min-w-0 space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Publishing</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Website content</h1>
          </div>
          <button
            type="button"
            disabled={Boolean(saving) || loading}
            onClick={saveAll}
            className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving === 'all' ? 'Saving…' : 'Save all'}
          </button>
        </section>

        {(error || message) ? (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        ) : null}

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,.85fr)]">
          <div className="min-w-0 space-y-6">
            <section data-tour-id="website-content-sermon" className="min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <SectionHeader eyebrow="Homepage sermon" title="Latest sermon display">
                <button
                  type="button"
                  disabled={Boolean(saving) || loading}
                  onClick={saveSermon}
                  className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving === 'sermon' ? 'Saving…' : 'Save sermon'}
                </button>
              </SectionHeader>

              <TextField
                label="Latest sermon title"
                value={content.latestSermonTitle}
                onChange={(event) => setContent((current) => ({ ...current, latestSermonTitle: event.target.value }))}
                placeholder="Sunday service"
              />
              <TextField
                label="Latest sermon YouTube or video URL"
                value={content.latestSermonVideoUrl}
                onChange={(event) => setContent((current) => ({ ...current, latestSermonVideoUrl: event.target.value, latestSermonSource: 'manual' }))}
                placeholder="https://www.youtube.com/watch?v=..."
                helper="Paste the YouTube sermon link or a direct video URL. The public homepage reads this saved value."
              />
              <TextField
                label="Published date"
                value={content.latestSermonPublishedAt}
                onChange={(event) => setContent((current) => ({ ...current, latestSermonPublishedAt: event.target.value }))}
                placeholder="2026-08-31T10:00:00Z"
              />
            </section>

            <section data-tour-id="website-content-theme" className="min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <SectionHeader eyebrow="Year theme" title="Theme of the year">
                <button
                  type="button"
                  disabled={Boolean(saving) || loading}
                  onClick={saveTheme}
                  className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving === 'theme' ? 'Saving…' : 'Save theme'}
                </button>
              </SectionHeader>

              <TextField
                label="Theme title"
                value={content.yearThemeTitle}
                onChange={(event) => setContent((current) => ({ ...current, yearThemeTitle: event.target.value }))}
                placeholder="Moving from Glory to Glory"
              />
              <TextAreaField
                label="Theme subtitle"
                value={content.yearThemeSubtitle}
                onChange={(event) => setContent((current) => ({ ...current, yearThemeSubtitle: event.target.value }))}
                placeholder="Optional internal note or subtitle"
              />
              <TextField
                label="Desktop image URL"
                value={content.yearThemeDesktopImageUrl}
                onChange={(event) => setContent((current) => ({ ...current, yearThemeDesktopImageUrl: event.target.value }))}
                placeholder="https://..."
                helper="Leave empty to use the bundled Moving from Glory to Glory fallback image."
              />
              <TextField
                label="Mobile image URL"
                value={content.yearThemeMobileImageUrl}
                onChange={(event) => setContent((current) => ({ ...current, yearThemeMobileImageUrl: event.target.value }))}
                placeholder="https://..."
                helper="Leave empty to use the bundled Moving from Glory to Glory fallback image."
              />
            </section>

            <section data-tour-id="website-content-album" className="min-w-0 space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <SectionHeader eyebrow="Album release" title="Streaming playlist links">
                <button
                  type="button"
                  disabled={Boolean(saving) || loading}
                  onClick={saveAlbumRelease}
                  className="rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving === 'album' ? 'Saving…' : 'Save album links'}
                </button>
              </SectionHeader>

              <TextField
                label="Album title"
                value={content.albumReleaseTitle}
                onChange={(event) => setContent((current) => ({ ...current, albumReleaseTitle: event.target.value }))}
                placeholder="Atmosphere of Glory"
              />
              <TextField
                label="Artist / label"
                value={content.albumReleaseArtist}
                onChange={(event) => setContent((current) => ({ ...current, albumReleaseArtist: event.target.value }))}
                placeholder="Sword Worship"
              />
              <TextField
                label="Spotify playlist URL"
                value={content.albumReleaseSpotifyUrl}
                onChange={(event) => setContent((current) => ({ ...current, albumReleaseSpotifyUrl: event.target.value }))}
                placeholder="https://open.spotify.com/playlist/..."
                helper="If empty, Spotify controls and links are hidden on the public website."
              />
              <TextField
                label="Apple Music playlist URL"
                value={content.albumReleaseAppleMusicUrl}
                onChange={(event) => setContent((current) => ({ ...current, albumReleaseAppleMusicUrl: event.target.value }))}
                placeholder="https://music.apple.com/..."
                helper="If empty, the Apple Music button is hidden on the public website."
              />
              <TextField
                label="YouTube playlist URL"
                value={content.albumReleaseYouTubeUrl}
                onChange={(event) => setContent((current) => ({ ...current, albumReleaseYouTubeUrl: event.target.value }))}
                placeholder="https://www.youtube.com/playlist?list=..."
                helper="If empty, YouTube controls and links are hidden on the public website."
              />
            </section>
          </div>

          <aside className="min-w-0 space-y-6">
            <section className="rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-[#19200b] via-slate-950 to-slate-950 p-5 shadow-soft sm:p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Saved homepage values</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p className="break-all"><span className="text-slate-500">Sermon:</span> {content.latestSermonVideoUrl || 'Bundled sermon fallback'}</p>
                <p className="break-all"><span className="text-slate-500">Desktop theme:</span> {content.yearThemeDesktopImageUrl || 'Bundled Moving from Glory to Glory fallback'}</p>
                <p className="break-all"><span className="text-slate-500">Mobile theme:</span> {content.yearThemeMobileImageUrl || 'Bundled Moving from Glory to Glory fallback'}</p>
                <p className="break-all"><span className="text-slate-500">Spotify album:</span> {content.albumReleaseSpotifyUrl || 'Hidden'}</p>
                <p className="break-all"><span className="text-slate-500">Apple Music album:</span> {content.albumReleaseAppleMusicUrl || 'Hidden'}</p>
                <p className="break-all"><span className="text-slate-500">YouTube album:</span> {content.albumReleaseYouTubeUrl || 'Hidden'}</p>
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
