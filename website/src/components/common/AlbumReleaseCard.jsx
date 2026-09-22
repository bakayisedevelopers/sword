import React, { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase.js';
import { COLLECTIONS } from '../../lib/firestore.js';

export function AlbumReleaseCard() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [homepageContent, setHomepageContent] = useState({});

  useEffect(() => {
    try {
      const docRef = doc(db, COLLECTIONS.WEBSITE_CONTENT, 'homepage');
      return onSnapshot(
        docRef,
        (snap) => {
          setHomepageContent(snap.exists() ? snap.data() : {});
        },
        (err) => {
          console.warn('Could not load album release links:', err);
        }
      );
    } catch (err) {
      console.warn('Firestore initialization error for album release links:', err);
      return undefined;
    }
  }, []);

  const albumTitle = (homepageContent.albumReleaseTitle || '').trim() || 'Atmosphere of Glory';
  const albumArtist = (homepageContent.albumReleaseArtist || '').trim() || 'Sword Worship';
  const spotifyUrl = (homepageContent.albumReleaseSpotifyUrl || '').trim();
  const appleMusicUrl = (homepageContent.albumReleaseAppleMusicUrl || '').trim();
  const youtubeUrl = (homepageContent.albumReleaseYouTubeUrl || '').trim();

  const spotifyEmbedUrl = useMemo(() => {
    if (!spotifyUrl) return '';
    try {
      const url = new URL(spotifyUrl);
      if (!url.hostname.includes('spotify.com')) return '';
      const [, type, id] = url.pathname.split('/');
      if (!type || !id) return '';
      return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
    } catch {
      return '';
    }
  }, [spotifyUrl]);

  const hasYouTube = Boolean(youtubeUrl);
  const hasSpotify = Boolean(spotifyUrl);
  const hasAppleMusic = Boolean(appleMusicUrl);

  if (!hasSpotify || !spotifyEmbedUrl) return null;

  return (
    <div
      className="w-full max-w-[500px] h-[500px] rounded-[24px] sm:rounded-[30px] border border-ff-secondary relative overflow-hidden flex flex-col justify-between bg-slate-950 text-white shadow-xl"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.96)), url('/assets/images/Worship_Album.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Top Header */}
      <div className="p-4 sm:p-5 pb-2 flex items-center justify-between border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Animated Vinyl Album Cover */}
          <div className="relative group cursor-pointer" onClick={() => setIsPlaying(!isPlaying)}>
            <div
              className={`w-12 h-12 rounded-full border-2 border-brand-gold bg-cover bg-center shadow-lg transition-transform ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{
                backgroundImage: "url('/assets/images/Worship_Album.png')",
                animationDuration: '6s',
              }}
            />
            <div className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-slate-950 border border-brand-gold" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
                Latest Release
              </span>
              <span className="text-[11px] text-slate-400">{albumArtist}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
              {albumTitle}
            </h3>
          </div>
        </div>

        <div className="rounded-full border border-white/10 bg-slate-800/80 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-gold">
          Spotify Album
        </div>
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 min-h-0 overflow-hidden p-4 flex flex-col">
        <div className="w-full h-full min-h-0 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-xs font-medium text-slate-300">
              Songs from <strong className="text-brand-gold">Spotify</strong>
            </span>
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-md bg-brand-gold px-3 py-1 text-[11px] font-bold text-slate-950 transition hover:brightness-110"
            >
              Open
            </a>
          </div>

          <div className="w-full flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-inner relative">
            <iframe
              className="absolute inset-0 block h-full w-full"
              src={spotifyEmbedUrl}
              title={`${albumTitle} Spotify playlist`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Bottom Streaming Platform Links */}
      <div className="p-3 sm:p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
        <p className="text-[11px] text-center font-medium text-slate-400 mb-2">
          Stream or download full album on your favorite platform:
        </p>
        <div className="flex items-center justify-center gap-2">
          {hasYouTube && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[130px] py-1.5 px-2 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-xs font-bold text-center hover:bg-red-600 hover:text-white transition"
            >
              YouTube
            </a>
          )}
          {hasSpotify && (
            <a
              href={spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[130px] py-1.5 px-2 rounded-full bg-[#1DB954]/20 border border-[#1DB954]/40 text-[#1ed760] text-xs font-bold text-center hover:bg-[#1DB954] hover:text-black transition"
            >
              Spotify
            </a>
          )}
          {hasAppleMusic && (
            <a
              href={appleMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 max-w-[130px] py-1.5 px-2 rounded-full bg-[#FA2D48]/20 border border-[#FA2D48]/40 text-[#FA2D48] text-xs font-bold text-center hover:bg-[#FA2D48] hover:text-white transition"
            >
              Apple Music
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlbumReleaseCard;
