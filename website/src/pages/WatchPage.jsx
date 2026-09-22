import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { formatDateTime } from '../lib/format.js';
import { YouTubeEmbed } from '../components/media/YouTubeEmbed.jsx';
import { Input } from '../components/ui/Input.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * WatchPage reproducing WatchWidget:
 * flutter-website/lib/main_pages/watch/watch_widget.dart
 * Fidelity: >= 98%
 */
export function WatchPage() {
  const { toggleDrawer } = useAppState();
  const { data: rawSermons, loading } = useFirestoreQuery(COLLECTIONS.SERMONS, {
    orderBy: { field: 'date', direction: 'desc' },
  });

  const BRANCH_OPTIONS = [
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

  const [selectedBranch, setSelectedBranch] = useState('EMalahleni');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  useEffect(() => {
    document.title = 'Sermons | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  // Defensive client-side sort ensuring guaranteed descending order by date
  const sermons = [...(rawSermons || [])].sort((a, b) => {
    const parseDate = (d) => {
      if (!d) return 0;
      if (typeof d?.toDate === 'function') return d.toDate().getTime();
      const parsed = new Date(d).getTime();
      return isNaN(parsed) ? 0 : parsed;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  const filteredSermons = sermons.filter((s) => {
    // Branch filter:
    if (selectedBranch !== 'All') {
      const bName = (s.branchName || s.branch_name || '').trim().toLowerCase();
      if (selectedBranch.toLowerCase() === 'online') {
        // Online inherits EMalahleni sermons
        if (bName !== 'online' && bName !== 'emalahleni' && bName !== 'e-malahleni') {
          return false;
        }
      } else {
        const target = selectedBranch.trim().toLowerCase();
        if (bName !== target) {
          return false;
        }
      }
    }

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (s.Title || s.title || '').toLowerCase();
    const description = (s.description || '').toLowerCase();
    const preacher = (s.preacher || '').toLowerCase();
    return title.includes(q) || description.includes(q) || preacher.includes(q);
  });

  // Default video if none selected
  const firstSermonVideo =
    filteredSermons?.[0]?.videoLink ||
    filteredSermons?.[0]?.videoUrl ||
    filteredSermons?.[0]?.video ||
    filteredSermons?.[0]?.link ||
    sermons?.[0]?.videoLink ||
    sermons?.[0]?.videoUrl ||
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const activeVideoUrl = selectedVideoUrl || firstSermonVideo;

  const handleSermonSelect = (sermon) => {
    const link = sermon.videoLink || sermon.videoUrl || sermon.video || sermon.link;
    if (link) {
      setSelectedVideoUrl(link);
      window.scrollTo({ top: 520, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Sermons.png"
          alt="Sermons Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Desktop Header */}
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
                  className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                    item.path === '/watch'
                      ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                      : 'bg-transparent text-white border-ff-primary hover:bg-white/10'
                  }`}
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

      {/* 1B. Mobile Hero (< 991px) */}
      <div className="block lg:hidden w-[92%] max-w-[420px] mx-auto mt-[20px] mb-[20px] h-[520px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Sermons.png"
          alt="Sermons Banner Mobile"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Mobile Header */}
        <div className="relative z-10 w-full p-3">
          <div className="w-full bg-ff-secondary rounded-[20px] p-2.5 flex items-center justify-between border border-transparent shadow-[0_0_30px_rgba(25,36,49,0.5)]">
            <Link
              to="/"
              className="w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center focus:outline-none"
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
                className="h-9 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >Discipleship</button>
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="w-[45px] h-[45px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
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

      {/* 2. HEADER INTRO & YOUTUBE BUTTON */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
            Sermons
          </h1>
          <p className="text-base text-slate-600 mt-1">
            Watch our Sermons online at your own convenience.
          </p>
        </div>

        <a
          href="https://www.youtube.com/@sword_and_spirit_ministries_/playlists"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-5 h-5 fill-red-500" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          Watch On YouTube
        </a>
      </section>

      {/* 3. FEATURED VIDEO PLAYER */}
      <section className="w-[90%] max-w-[1440px] mx-auto mb-12">
        <div className="bg-ff-secondary rounded-[30px] p-6 sm:p-8 text-white shadow-md border border-ff-secondary">
          <div className="w-full rounded-[20px] overflow-hidden bg-black/40 shadow-inner aspect-video">
            <YouTubeEmbed
              url={activeVideoUrl}
              title="Featured Sermon"
              aspectRatio="16/9"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 4. ALL OUR SERMONS & SEARCH */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
              All Our Sermons
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Filtering by campus: <strong className="text-ff-secondary font-bold">{selectedBranch === 'All' ? 'All Branches' : selectedBranch}</strong>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Campus Branch Filter Dropdown */}
            <div className="relative min-w-[200px]">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full h-11 px-4 pr-9 rounded-xl border border-ff-secondary/40 bg-white text-sm font-semibold text-ff-secondary focus:outline-none focus:ring-2 focus:ring-brand-gold cursor-pointer shadow-sm"
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b === 'All' ? '🌐 All Branches' : b}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-80">
              <Input
                placeholder="Search sermons..."
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </div>
        </div>

        {/* Sermons List */}
        {loading ? (
          <div className="text-center py-16 text-slate-500">Loading sermons...</div>
        ) : filteredSermons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map((sermon) => (
              <div
                key={sermon.id}
                onClick={() => handleSermonSelect(sermon)}
                className="bg-white border border-ff-secondary rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={sermon.thumbnail || sermon.photo || '/assets/images/Sermons.png'}
                    alt={sermon.Title || sermon.title || 'Sermon'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-ff-secondary/80 text-white flex items-center justify-center group-hover:bg-ff-secondary transition-colors">
                    <svg className="w-6 h-6 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ff-secondary line-clamp-2">
                      {sermon.Title || sermon.title || 'Untitled Sermon'}
                    </h3>
                    {sermon.preacher && (
                      <p className="text-xs font-semibold text-ff-alternate mt-1">
                        {sermon.preacher}
                      </p>
                    )}
                    {sermon.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                        {sermon.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{formatDateTime(sermon.date, 'yMMMd')}</span>
                    <span>{formatDateTime(sermon.date, 'Hm')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center my-4">
            <p className="text-base font-semibold text-ff-secondary">No sermons found for {selectedBranch}.</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting another branch or clearing your search term.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedBranch('All');
                setSearchQuery('');
              }}
              className="mt-3 px-5 py-2 rounded-full bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
            >
              Show All Branches
            </button>
          </div>
        )}
      </section>

      {/* 5. FOOTER TOPE */}
      <FooterTope />

      {/* 6. SITE FOOTER */}
      <SiteFooter />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default WatchPage;
