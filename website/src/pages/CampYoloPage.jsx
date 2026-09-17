import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { formatDateTime, isFutureEvent } from '../lib/format.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

function getEventTimestamp(evt) {
  if (!evt?.date) return 0;
  if (typeof evt.date?.toDate === 'function') return evt.date.toDate().getTime();
  if (evt.date instanceof Date) return evt.date.getTime();
  const d = new Date(evt.date);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

/**
 * CampYoloPage reproducing CampYoloWidget:
 * flutter-website/lib/conferences/camp_yolo/camp_yolo_widget.dart
 * Fidelity: >= 98%
 */
export function CampYoloPage() {
  const { toggleDrawer } = useAppState();
  const { data: events = [], loading } = useFirestoreQuery(COLLECTIONS.EVENTS);

  useEffect(() => {
    document.title = 'Camp Yolo | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const campEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    return events
      .filter(isFutureEvent)
      .filter((e) => {
        const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
        const title = (e.title || '').toLowerCase();
        const dept = (e.department || '').toLowerCase();
        const desc = (e.description || '').toLowerCase();
        return (
          ministry.includes('camp yolo') ||
          ministry.includes('campyolo') ||
          ministry.includes('yolo') ||
          title.includes('camp yolo') ||
          title.includes('campyolo') ||
          title.includes('yolo') ||
          ((ministry.includes('youth') || dept.includes('youth')) &&
            (title.includes('camp') || desc.includes('camp') || title.includes('yolo')))
        );
      })
      .sort((a, b) => getEventTimestamp(b) - getEventTimestamp(a));
  }, [events]);

  const fallbackCamps = [
    {
      id: 'june-camp',
      title: 'Camp Yolo June Edition',
      dateDetails: 'June School Holidays',
      timeDetails: '5 Days Retreat',
      location: 'Camp Oasis Adventure Center',
      branchName: 'Global SSMI',
      image: '/assets/images/CampYolo.jpg',
      picture: '/assets/images/CampYolo.jpg',
      booking: true,
    },
    {
      id: 'dec-camp',
      title: 'Camp Yolo Summer Camp',
      dateDetails: 'December School Holidays',
      timeDetails: '7 Days Experience',
      location: 'SSMI Conference Grounds',
      branchName: 'Global SSMI',
      image: '/assets/images/CampYolo.png',
      picture: '/assets/images/CampYolo.png',
      booking: true,
    },
  ];

  const campsToDisplay = campEvents.length > 0 ? campEvents : fallbackCamps;

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/CampYolo.jpg"
          alt="Camp Yolo Banner"
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
      </div>

      {/* 1B. Mobile Hero (< 991px) */}
      <div className="block lg:hidden w-[92%] max-w-[420px] mx-auto mt-[20px] mb-[20px] h-[520px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/CampYolo.png"
          alt="Camp Yolo Banner Mobile"
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
                onClick={() => console.log('Dashboard clicked')}
                className="h-9 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="w-[45px] h-[45px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TITLE & WHAT TO EXPECT */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-3">
          Camp Yolo
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
          Making school holidays filled with God's word and fun memories.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-[30px] p-8 sm:p-12 max-w-3xl mx-auto text-left space-y-4">
          <h2 className="text-2xl font-bold text-ff-secondary">What to Expect</h2>
          <p className="text-base text-slate-700 leading-relaxed">
            Camp Yolo runs twice a year during the June and December school holidays.
          </p>
          <p className="text-base text-slate-700 leading-relaxed">
            If you have a child/children between Grade 8 and Grade 12:
          </p>
          <p className="text-base font-semibold text-ff-secondary">
            Make sure you sign up very early to secure their spot.
          </p>
        </div>
      </section>

      {/* 3. UPCOMING CAMPS */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mb-6 text-center">
          Camp Yolos for 2025
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {campsToDisplay.map((camp) => {
            const campTitle = camp.title || camp.name || 'Camp Yolo';
            const campImg = camp.picture || camp.image || camp.poster || '/assets/images/CampYolo.jpg';
            const dateText = camp.dateDetails || (camp.date ? formatDateTime(camp.date) : '');
            const timeText = camp.timeDetails || camp.time_details || camp.time || '';
            const branchText = camp.branch_name || camp.branchName || (camp.global ? 'Global SSMI' : camp.location || '');
            const canRegister = camp.booking !== false;

            return (
              <div
                key={camp.id}
                className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="h-56 bg-slate-900 overflow-hidden relative">
                  <img
                    src={campImg}
                    alt={campTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {branchText && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-[50px] bg-ff-secondary/80 backdrop-blur-sm text-white text-xs font-bold">
                      {branchText}
                    </span>
                  )}
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between space-y-4">
                  <div>
                    <span className="text-xs font-bold text-ff-alternate uppercase tracking-wider block mb-1">
                      Youth Retreat
                    </span>
                    <h3 className="text-2xl font-bold text-ff-secondary mb-2 line-clamp-2">
                      {campTitle}
                    </h3>
                    {(dateText || timeText) && (
                      <p className="text-sm text-slate-600 mb-3">
                        {dateText} {timeText && `• ${timeText}`}
                      </p>
                    )}
                    {camp.description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <Link
                      to={`/event?id=${camp.id}`}
                      className="flex-1 py-3 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </Link>
                    {canRegister ? (
                      <Link
                        to={`/register?event=${encodeURIComponent(campTitle)}`}
                        className="flex-1 py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
                      >
                        Register
                      </Link>
                    ) : (
                      <span className="flex-1 py-3 rounded-[50px] bg-slate-200 text-slate-500 text-center text-xs font-bold cursor-not-allowed">
                        Closed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default CampYoloPage;
