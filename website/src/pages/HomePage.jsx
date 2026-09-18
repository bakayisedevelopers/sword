import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { YouTubeEmbed } from '../components/media/YouTubeEmbed.jsx';
import { VideoPlayer } from '../components/media/VideoPlayer.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { QuickActionButtons } from '../components/common/QuickActionButtons.jsx';
import { isFutureEvent } from '../lib/format.js';
import { ChevronRight } from '../components/common/Icons.jsx';

const DEFAULT_SERMON_URL =
  'https://firebasestorage.googleapis.com/v0/b/ssmi-database.firebasestorage.app/o/Sunday%20Videos%2F14%20Sep%2025%20Live%20Sermons.mp4?alt=media&token=2b9bfc8a-00e9-46b1-91d2-3586aba37202';
const DEFAULT_THEME_IMAGE = '/assets/images/moving_from_glory_to_glory_theme.png';

/**
 * HomePage reproducing HomeWidget:
 * flutter-website/lib/main_pages/home/home_widget.dart
 */
export function HomePage() {
  const { toggleDrawer } = useAppState();

  const [homepageContent, setHomepageContent] = useState({});
  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const { data: branches } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  useEffect(() => {
    document.title = 'Sword of the Spirit Ministries | Moving from Glory to Glory';

    try {
      const docRef = doc(db, COLLECTIONS.WEBSITE_CONTENT, 'homepage');
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            setHomepageContent(snap.data());
          }
        },
        (err) => {
          console.warn('Could not load websiteContent/homepage:', err);
        }
      );
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore initialization error on homepage:', err);
    }
  }, []);

  const sermonVideoUrl =
    (homepageContent.latestSermonVideoUrl || '').trim() || DEFAULT_SERMON_URL;
  const isYouTube =
    sermonVideoUrl.includes('youtube.com') || sermonVideoUrl.includes('youtu.be');

  const themeImageDesktop =
    (homepageContent.yearThemeDesktopImageUrl || '').trim() || DEFAULT_THEME_IMAGE;
  const themeImageMobile =
    (homepageContent.yearThemeMobileImageUrl || '').trim() || DEFAULT_THEME_IMAGE;
  const yearThemeTitle =
    (homepageContent.yearThemeTitle || '').trim() || 'Moving from Glory to Glory';
  const yearThemeSubtitle =
    (homepageContent.yearThemeSubtitle || '').trim();
  const latestSermonTitle =
    (homepageContent.latestSermonTitle || '').trim();

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Welcome_(1).png"
          alt="Welcome to SSMI"
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
                  className="h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border bg-transparent text-white border-ff-primary hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => console.log('My Dashboard clicked')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >
              My Dashboard
            </button>
          </div>
        </div>

        {/* Action Button at bottom of hero */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
          <Link
            to="/watch"
            className="h-[65px] px-8 rounded-[40px] bg-ff-primary text-ff-primary-text text-xl font-bold border border-ff-secondary flex items-center gap-3 hover:bg-white/95 transition-transform hover:scale-105 shadow-lg"
          >
            <span>Watch our Sermons</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-7 h-7 text-ff-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* 1B. Mobile Hero (< 991px) */}
      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg bg-white">
        <img
          src="/assets/images/About_Us_Mobile.png"
          alt="Welcome to SSMI"
          className="absolute inset-0 w-full h-full object-cover object-center"
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
                onClick={() => console.log('Dashboard clicked')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >
                Dashboard
              </button>
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

        {/* Action Button on mobile hero */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center z-10">
          <Link
            to="/watch"
            className="h-[55px] px-6 rounded-[40px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-secondary flex items-center gap-2 hover:bg-white/95 transition-transform shadow-lg"
          >
            <span>Watch our Sermons</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-ff-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* 2. THEME OF THE YEAR BANNER */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="w-full rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm bg-slate-900">
          <picture>
            <source media="(min-width: 991px)" srcSet={themeImageDesktop} />
            <img
              src={themeImageMobile}
              alt={yearThemeTitle ? `Year Theme: ${yearThemeTitle}` : 'Year Theme: Moving from Glory to Glory'}
              title={yearThemeSubtitle || yearThemeTitle}
              className="w-full h-auto object-contain max-h-[500px]"
              onError={(e) => {
                e.target.src = DEFAULT_THEME_IMAGE;
              }}
            />
          </picture>
        </div>
      </section>

      {/* 3. FEATURED LIVE / LATEST SERMON SECTION */}
      <section className="w-[90%] max-w-[1100px] mx-auto my-12 grid grid-cols-1 lg:grid-cols-[minmax(0,800px)_minmax(300px,1fr)] gap-5 items-center">
        <div className="flex flex-col space-y-3">
          <div className="bg-black rounded-[30px] overflow-hidden border border-ff-secondary shadow-lg aspect-video flex items-center justify-center">
            {isYouTube ? (
              <YouTubeEmbed url={sermonVideoUrl} />
            ) : (
              <VideoPlayer src={sermonVideoUrl} controls poster="/assets/images/Sermons.png" />
            )}
          </div>
        </div>

        <QuickActionButtons className="lg:py-5" />
      </section>

      {/* 4. UPCOMING EVENTS SPOTLIGHT */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
              What's Happening
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
              Upcoming Events & Convocations
            </h2>
          </div>
          <Link
            to="/events"
            className="px-6 py-2.5 rounded-[30px] border border-ff-secondary text-ff-secondary font-bold text-sm hover:bg-slate-50 transition-colors inline-flex items-center gap-1"
          >
            <span>View Full Calendar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {events.filter(isFutureEvent).length > 0 ? (
            events.filter(isFutureEvent).slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-[20px] border border-ff-secondary/30 hover:border-ff-secondary p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                      {event.category || event.branchName || event.branch_name || 'Church Event'}
                    </span>
                    {(event.dateDetails || event.date_details) && (
                      <span className="text-xs text-slate-500 font-semibold">
                        • {event.dateDetails || event.date_details}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-ff-secondary truncate">
                    {event.title || 'Church Gathering'}
                  </h3>
                  {event.location && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      Location: {event.location}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/event?id=${event.id}`}
                    className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shadow-sm"
                  >
                    <span>Details & Register</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-[20px] border border-ff-secondary/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Flagship Event</span>
                  <h3 className="text-lg font-bold text-ff-secondary">Annual Fire Conference</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Apostolic convocation of revelation, healing, and holy impartation</p>
                </div>
                <Link
                  to="/fire-conference"
                  className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>Register Free</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-[20px] border border-ff-secondary/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Youth Convocation</span>
                  <h3 className="text-lg font-bold text-ff-secondary">Camp YOLO Retreat</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Annual 4-day summer youth adventure & bonfire encounters</p>
                </div>
                <Link
                  to="/camp-yolo"
                  className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="bg-white rounded-[20px] border border-ff-secondary/30 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Men's Gathering</span>
                  <h3 className="text-lg font-bold text-ff-secondary">Superman Men’s Conference</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Brotherhood gathering focused on spiritual leadership & wealth</p>
                </div>
                <Link
                  to="/superman-conference"
                  className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shrink-0"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. LOCATIONS & BRANCH DIRECTORY */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 bg-ff-secondary text-white rounded-[30px] p-8 sm:p-12 border border-ff-secondary shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
              Find a Campus
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">
              One Church Across Nations
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Join us in-person across South Africa, Eswatini, Nigeria, or connect online.
            </p>
          </div>
          <Link
            to="/locations"
            className="px-6 py-3 rounded-[30px] bg-ff-primary text-ff-primary-text font-bold text-sm hover:bg-white/90 transition-colors shrink-0 inline-flex items-center gap-1.5"
          >
            <span>All Campus Locations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'eMalahleni (HQ)', slug: 'emalahleni', desc: 'Main Campus • 6 Clarendon Ave' },
            { name: 'Ludzeludze', slug: 'ludzeludze', desc: 'Eswatini Branch' },
            { name: 'Lagos', slug: 'lagos', desc: 'Nigeria Campus' },
            { name: 'Online Campus', slug: 'online', desc: 'Live Digital Stream' },
          ].map((b) => (
            <Link
              key={b.slug}
              to={`/${b.slug}`}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-[20px] p-5 transition-colors group block"
            >
              <h4 className="text-lg font-bold text-white group-hover:text-ff-alternate transition-colors">
                {b.name}
              </h4>
              <p className="text-xs text-white/60 mt-1">{b.desc}</p>
              <span className="text-xs text-ff-alternate font-semibold mt-3 inline-flex items-center gap-1">
                <span>Visit Campus Page</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. SITE FOOTER */}
      <SiteFooter />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default HomePage;
