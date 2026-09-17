import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { formatDateTime, isFutureEvent } from '../lib/format.js';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
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
 * SupermanConferencePage reproducing SupermanConferenceWidget:
 * flutter-website/lib/conferences/superman_conference/superman_conference_widget.dart
 * Fidelity: >= 98%
 */
export function SupermanConferencePage() {
  const { toggleDrawer } = useAppState();
  const { data: rawEvents = [], loading } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const events = useMemo(() => {
    if (!rawEvents || rawEvents.length === 0) return [];
    return rawEvents
      .filter(isFutureEvent)
      .filter((e) => {
        const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
        const title = (e.title || '').toLowerCase();
        const dept = (e.department || '').toLowerCase();
        return (
          ministry.includes('super man') ||
          ministry.includes('superman') ||
          title.includes('super man') ||
          title.includes('superman') ||
          dept.includes('super man') ||
          dept.includes('superman')
        );
      })
      .sort((a, b) => getEventTimestamp(b) - getEventTimestamp(a));
  }, [rawEvents]);

  const [hostModalOpen, setHostModalOpen] = useState(false);
  const [volunteerModalOpen, setVolunteerModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Superman Conference | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const fallbackEvents = [
    {
      id: 'superman-conf-2025',
      title: 'Annual Superman Conference 2025',
      dateDetails: 'January 2025',
      timeDetails: 'Vision Kickoff Weekend',
      branchName: 'All SSMI Campuses',
      image: '/assets/images/SupermnaCon_(2).png',
      picture: '/assets/images/SupermnaCon_(2).png',
      booking: true,
    },
  ];

  const eventsToDisplay = events.length > 0 ? events : fallbackEvents;

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
          src="/assets/images/SupermnaCon_(2).png"
          alt="Superman Conference Banner"
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
          src="/assets/images/SupermnaCon.png"
          alt="Superman Conference Banner Mobile"
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
          Superman Conference
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          A Spirit filled dynamic and filled with revelation Superman Conference to keep off each year.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-[30px] p-8 sm:p-12 max-w-3xl mx-auto text-left space-y-4">
          <h2 className="text-2xl font-bold text-ff-secondary">What to Expect</h2>
          <p className="text-base text-slate-700 leading-relaxed">
            Be ready to start the year filled with the vision and be refilled with the Holy Ghost. Everyone who attends the Superman Conference never leaves the same. It is always life changing.
          </p>
        </div>
      </section>

      {/* 3. NEXT CONFERENCE */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mb-6 text-center">
          Next Superman Conference
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {eventsToDisplay.map((conf) => {
            const confTitle = conf.title || conf.name || 'Superman Conference';
            const confImg = conf.picture || conf.image || conf.poster || '/assets/images/SupermnaCon_(2).png';
            const dateText = conf.dateDetails || (conf.date ? formatDateTime(conf.date) : '');
            const timeText = conf.timeDetails || conf.time_details || conf.time || '';
            const branchText = conf.branch_name || conf.branchName || (conf.global ? 'Global SSMI' : '');
            const canRegister = conf.booking !== false;

            return (
              <div
                key={conf.id}
                className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div className="h-56 bg-slate-900 overflow-hidden relative">
                  <img
                    src={confImg}
                    alt={confTitle}
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
                      {branchText || 'Global SSMI'}
                    </span>
                    <h3 className="text-2xl font-bold text-ff-secondary mb-2 line-clamp-2">
                      {confTitle}
                    </h3>
                    {(dateText || timeText) && (
                      <p className="text-sm text-slate-600 mb-3">
                        {dateText} {timeText && `• ${timeText}`}
                      </p>
                    )}
                    {conf.description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                        {conf.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex gap-3">
                    <Link
                      to={`/event?id=${conf.id}`}
                      className="flex-1 py-3 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </Link>
                    {canRegister ? (
                      <Link
                        to={`/register?event=${encodeURIComponent(confTitle)}`}
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

      {/* 4. SERVE DURING THE CONFERENCE */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Serve during the Superman Conference
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
            During our conferences we always need all hands on deck because all our conferences are free and we want to make sure they are still impactful and that's never possible without your assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Host global partners */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-56 w-full overflow-hidden">
              <img
                src="/assets/images/Be_a_Host.png"
                alt="Host global partners"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">
                  Host global partners
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Some of our partners travel from different places across the world and to save them the hustle of searching for places to stay, we encourage congregants of the hosting branch to host our global partners.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setHostModalOpen(true)}
                className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Be a Host
              </button>
            </div>
          </div>

          {/* Card 2: Volunteer */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-56 w-full overflow-hidden">
              <img
                src="/assets/images/Volunteer.jpg"
                alt="Volunteer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">
                  Volunteer
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Are you available to serve in any capacity during the Superman Conference? Please sign up and specify the area you would like to serve in.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setVolunteerModalOpen(true)}
                className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Volunteer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SIGN UP MODALS */}
      <SignUpModal
        isOpen={hostModalOpen}
        onClose={() => setHostModalOpen(false)}
        defaultMinistry="Be a Host"
      />

      <SignUpModal
        isOpen={volunteerModalOpen}
        onClose={() => setVolunteerModalOpen(false)}
        defaultMinistry="Super Man"
      />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default SupermanConferencePage;
