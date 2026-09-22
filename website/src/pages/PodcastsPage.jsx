import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { formatDateTime } from '../lib/format.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * PodcastsPage matching FlutterFlow:
 * flutter-website/lib/resources/podcasts/podcasts_widget.dart
 * Fidelity: >= 98%
 */
export function PodcastsPage() {
  const { toggleDrawer } = useAppState();
  const [selectedBranch, setSelectedBranch] = useState('EMalahleni');

  useEffect(() => {
    document.title = 'Podcast | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const { data: rawPodcasts, loading } = useFirestoreQuery(COLLECTIONS.PODCAST, {
    orderBy: { field: 'date', direction: 'desc' },
  });

  // Defensive client-side sort ensuring descending order by date
  const podcasts = [...(rawPodcasts || [])].sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0;
      if (typeof d?.toDate === 'function') return d.toDate().getTime();
      const parsed = new Date(d).getTime();
      return isNaN(parsed) ? 0 : parsed;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  const branchOptions = [
    'All',
    'EMalahleni',
    'Online',
    'Boksburg',
    'Siteki',
    'Hlutsi',
    'Ludzeludze',
    'Mbabane',
    'Lagos',
    'Orange Farm',
  ];

  const filteredPodcasts = podcasts.filter((p) => {
    if (selectedBranch === 'All') return true;
    const branchName = (p.branchName || p.branch_name || '').trim().toLowerCase();
    if (selectedBranch.toLowerCase() === 'online') {
      // Online branch shows EMalahleni and Online podcasts
      return branchName === 'online' || branchName === 'emalahleni' || branchName === 'e-malahleni';
    }
    return branchName === selectedBranch.toLowerCase();
  });

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const podcastPlatforms = [
    {
      name: 'Spotify',
      desc: 'Stream full sermon series, teachings, and discussions on Spotify.',
      url: 'https://open.spotify.com/show/swordandspirit',
      icon: (
        <svg className="w-8 h-8 fill-current text-[#1DB954]" viewBox="0 0 24 24">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      ),
    },
    {
      name: 'Apple Podcasts',
      desc: 'Subscribe and download high-quality audio recordings for offline listening.',
      url: 'https://podcasts.apple.com',
      icon: (
        <svg className="w-8 h-8 fill-current text-[#872EC4]" viewBox="0 0 24 24">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.87-.99 2.98 1.07.08 2.14-.5 2.8-1.32z" />
        </svg>
      ),
    },
    {
      name: 'YouTube Music & Videos',
      desc: 'Watch or listen to complete video podcasts, studio interviews, and live recordings.',
      url: 'https://www.youtube.com/@SwordandSpiritMinistries',
      icon: (
        <svg className="w-8 h-8 fill-current text-[#FF0000]" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      {/* 1. HERO SECTION */}
      {/* Desktop Hero */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Podcast.png"
          alt="Podcast Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Desktop Nav */}
        <div className="relative z-10 w-full p-5">
          <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-center justify-between shadow-md">
            <Link
              to="/"
              className="flex items-center justify-center w-[70px] h-[70px] p-[5px] rounded-[8px] overflow-hidden focus:outline-none"
              aria-label="Sword of the Spirit Ministries Home"
            >
              <img
                src="/assets/images/sword_logo.png"
                alt="Sword Logo"
                className="w-full h-full object-contain"
              />
            </Link>

            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border bg-transparent text-white border-ff-primary hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >Discipleship</button>
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Podcast.png"
          alt="Podcast Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Mobile Header */}
        <div className="relative z-10 w-full p-2.5">
          <div className="w-full bg-ff-secondary rounded-[20px] p-2.5 flex items-center justify-between border border-transparent shadow-[0_0_30px_rgba(25,36,49,0.5)]">
            <Link
              to="/"
              className="w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center focus:outline-none"
              aria-label="Sword of the Spirit Ministries Home"
            >
              <img
                src="/assets/images/SSMI_Logo_(No_background).png"
                alt="SSMI Logo"
                className="w-full h-full object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >Discipleship</button>
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="w-[50px] h-[50px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HEADER INTRO */}
      <section className="w-[90%] max-w-[1440px] mx-auto mt-12 mb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold text-ff-secondary">
            Podcast
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            Listen to our podcast. This is great tool for when jogging, cooking etc.
          </p>
          <div className="mt-5">
            <a
              href="https://open.spotify.com/show/6ipE1LNOSfxnwyrvPKIXmD?si=515d89e8c9014e15"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[20px] bg-ff-secondary text-white font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Listen On Spotify</span>
              <svg className="w-4 h-4 fill-current text-[#1DB954]" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* 3. BRANCH DROPDOWN FILTER & PODCAST EPISODES */}
      <section className="w-[90%] max-w-[1100px] mx-auto my-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-[20px] border border-ff-secondary/30 shadow-sm">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary">Recent Podcast Episodes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered for: <strong className="text-ff-secondary font-bold">{selectedBranch === 'All' ? 'All Campuses' : selectedBranch}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden md:inline">
              Campus:
            </span>
            <div className="relative min-w-[200px]">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full h-11 px-4 pr-9 rounded-xl border border-ff-secondary/40 bg-white text-sm font-semibold text-ff-secondary focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer shadow-sm"
              >
                {branchOptions.map((b) => (
                  <option key={b} value={b}>
                    {b === 'All' ? '🌐 All Branches' : b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="w-full rounded-[20px] border border-ff-secondary p-4 sm:p-6 bg-slate-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-ff-secondary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-slate-500 font-medium text-sm">Loading episodes...</p>
            </div>
          ) : filteredPodcasts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-bold text-ff-secondary">No podcasts found</p>
              <p className="text-sm text-slate-500 mt-1">
                {selectedBranch === 'All'
                  ? 'No episodes have been published yet.'
                  : `No episodes found for the ${selectedBranch} branch.`}
              </p>
              <button
                type="button"
                onClick={() => setSelectedBranch('All')}
                className="mt-3 px-5 py-2 rounded-full bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
              >
                Show All Branches
              </button>
            </div>
          ) : (
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1 sm:pr-2">
              {filteredPodcasts.map((podcast) => {
                const audioOrVideoUrl = podcast.videoLink || podcast.link || podcast.url;
                const title = podcast.Title || podcast.title || 'Untitled Podcast';
                const desc = podcast.description || podcast.Description || '';
                const dateStr = formatDateTime(podcast.date, { year: 'numeric', month: 'short', day: 'numeric' });
                const timeStr = (() => {
                  if (!podcast.date) return '';
                  let d;
                  if (typeof podcast.date?.toDate === 'function') d = podcast.date.toDate();
                  else if (podcast.date instanceof Date) d = podcast.date;
                  else d = new Date(podcast.date);
                  if (isNaN(d.getTime())) return '';
                  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
                })();
                const preacher = podcast.preacher || podcast.Preacher || '';
                const branchName = podcast.branchName || podcast.branch_name || '';

                return (
                  <div
                    key={podcast.id}
                    onClick={() => {
                      if (audioOrVideoUrl) {
                        window.open(audioOrVideoUrl, '_blank', 'noopener,noreferrer');
                      }
                    }}
                    className={`bg-white rounded-[30px] border border-ff-secondary p-5 shadow-[2px_2px_5px_rgba(25,36,49,0.15)] hover:shadow-md transition-all ${
                      audioOrVideoUrl ? 'cursor-pointer hover:border-ff-secondary/80 hover:-translate-y-0.5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-ff-secondary leading-snug">{title}</h3>
                        {preacher && (
                          <p className="text-xs font-semibold text-ff-tertiary uppercase tracking-wider mt-0.5">
                            {preacher}
                          </p>
                        )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-ff-secondary group-hover:bg-ff-secondary group-hover:text-white transition-colors">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                      </div>
                    </div>
                    {desc && (
                      <p className="text-sm sm:text-base text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-3">
                        {dateStr && <span>{dateStr}</span>}
                        {timeStr && <span>{timeStr}</span>}
                      </div>
                      {branchName && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                          {branchName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. PODCAST PLATFORMS */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {podcastPlatforms.map((platform) => (
          <div
            key={platform.name}
            className="bg-white rounded-[30px] border border-ff-secondary p-8 shadow-sm flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center justify-center">
                {platform.icon}
              </div>
              <h3 className="text-2xl font-bold text-ff-secondary">{platform.name}</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {platform.desc}
              </p>
            </div>
            <div>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
              >
                <span>Listen Now</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* 4. FOOTER TOPE */}
      <FooterTope />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default PodcastsPage;
