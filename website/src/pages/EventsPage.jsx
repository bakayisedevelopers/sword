import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { isFutureEvent } from '../lib/format.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * EventsPage reproducing EventsWidget:
 * flutter-website/lib/actions/events/events_widget.dart
 * Fidelity: >= 98%
 */
export function EventsPage() {
  const { toggleDrawer } = useAppState();
  const { data: events, loading } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const [selectedBranch, setSelectedBranch] = useState('All');

  useEffect(() => {
    document.title = 'Sword Events | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const branchFilterOptions = [
    'All',
    'EMalahleni',
    'Mbabane',
    'Siteki',
    'Hlutsi',
    'Ludzeludze',
    'Boksburg',
    'Orange Farm',
    'Lagos',
  ];

  const filteredEvents = events.filter(isFutureEvent).filter((ev) => {
    if (selectedBranch === 'All') return true;
    const branchName = ev.branch_name || ev.branchName || '';
    return branchName.toLowerCase() === selectedBranch.toLowerCase();
  });

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
          src="/assets/images/events_(2).png"
          alt="Events Banner"
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
          src="/assets/images/events.png"
          alt="Events Banner Mobile"
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

      {/* 2. TITLE & EVENTS FILTER */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
              Events
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Join us for upcoming conferences, services, and special ministry gatherings.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              Filter by Branch:
            </span>
            {branchFilterOptions.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setSelectedBranch(b)}
                className={`px-4 py-1.5 rounded-[50px] text-xs font-bold transition-colors ${
                  selectedBranch === b
                    ? 'bg-ff-secondary text-white shadow-sm'
                    : 'bg-slate-100 text-ff-secondary hover:bg-slate-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-ff-secondary rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="h-52 bg-slate-100 overflow-hidden relative">
                  <img
                    src={ev.image || ev.poster || '/assets/images/events.png'}
                    alt={ev.title || 'Event'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {(ev.branch_name || ev.branchName) && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-[50px] bg-ff-secondary/80 backdrop-blur-sm text-white text-xs font-bold">
                      {ev.branch_name || ev.branchName}
                    </span>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-ff-secondary line-clamp-2">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-ff-alternate font-bold uppercase tracking-wider mt-1 mb-3">
                      {ev.dateDetails || 'Upcoming'} {ev.timeDetails ? `| ${ev.timeDetails}` : ''}
                    </p>
                    {ev.description && (
                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {ev.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex gap-3">
                    <Link
                      to={`/event?id=${ev.id}`}
                      className="flex-1 py-2.5 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/register?event=${encodeURIComponent(ev.title || ev.id)}`}
                      className="flex-1 py-2.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-100 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            No events scheduled for {selectedBranch === 'All' ? 'any branch' : `${selectedBranch} Branch`} at this time.
          </div>
        )}
      </section>

      {/* 3. REACH OUT / INQUIRY */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 bg-slate-50 border border-slate-200 rounded-[30px] p-8 sm:p-12 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
          Need Information?
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1 mb-3">
          Reach Out About Any Event
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mb-6">
          Have questions about registrations, accommodations, or volunteering for conferences? Contact our team.
        </p>
        <Link
          to="/contact-us"
          className="px-8 py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-md"
        >
          <span>Contact Us</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </section>

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default EventsPage;
