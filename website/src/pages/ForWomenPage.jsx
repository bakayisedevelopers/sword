import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { formatDateTime, isFutureEvent } from '../lib/format.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * ForWomenPage matching FlutterFlow:
 * flutter-website/lib/ministries/for_women/for_women_widget.dart
 */
export function ForWomenPage() {
  const { toggleDrawer } = useAppState();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const womenEvents = useMemo(() => {
    return events
      .filter(isFutureEvent)
      .filter((e) => {
        const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
        const dept = (e.department || '').toLowerCase();
        const title = (e.title || e.name || '').toLowerCase();
        return (
          dept.includes('women') ||
          dept.includes('ladies') ||
          ministry.includes('women') ||
          ministry.includes('ladies') ||
          title.includes('women') ||
          title.includes('ladies')
        );
      })
      .sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(0) : new Date(0));
        return dateB - dateA;
      });
  }, [events]);

  useEffect(() => {
    document.title = 'Sword Ladies | Sword of the Spirit Ministries';
  }, []);

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
      {/* Desktop Hero */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Ladies_(2).png"
          alt="Sword Ladies Banner"
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
          src="/assets/images/Ladies.png"
          alt="Sword Ladies Banner"
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
            Sword Ladies
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            Raising women of dominion and influence, to make sure that each woman reaches their God given destiny and purpose in Christ.
          </p>
        </div>
      </section>

      {/* 3. ABOUT SWORD LADIES */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Sword Ladies
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            Women on the Move meets on regular bases throughout the branches over lots of food and the Word of God.
            {'\n\n'}
            Women in Ministry and Pastor's Wives meet also under Pastor Zandi Ministries to get equipped on how to be the woman God intended women to be in Christ.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Join Sword Ladies</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SWORD LADIES EVENTS */}
      {womenEvents.length > 0 && (
        <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Sword Ladies Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {womenEvents.map((evt) => {
              const eventTitle = evt.title || evt.name || 'Sword Ladies Event';
              const eventImg = evt.picture || evt.image || evt.poster || '/assets/images/Ladies.png';
              const dateText = evt.dateDetails || (evt.date ? formatDateTime(evt.date) : '');
              const branchText = evt.branch_name || evt.branchName || (evt.global ? 'Global Event' : '');
              const canRegister = evt.booking !== false;

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-[24px] border border-ff-secondary overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="h-52 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={eventImg}
                      alt={eventTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {branchText && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-[50px] bg-ff-secondary/80 backdrop-blur-sm text-white text-xs font-bold">
                        {branchText}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-xl text-ff-secondary line-clamp-2">
                        {eventTitle}
                      </h3>
                      {(dateText || evt.timeDetails) && (
                        <p className="text-xs text-ff-alternate font-bold uppercase tracking-wider mt-1 mb-2">
                          {dateText} {evt.timeDetails ? `| ${evt.timeDetails}` : ''}
                        </p>
                      )}
                      {evt.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex gap-3">
                      <Link
                        to={`/event?id=${evt.id}`}
                        className="flex-1 py-2.5 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
                      >
                        View Details
                      </Link>
                      {canRegister ? (
                        <Link
                          to={`/register?event=${encodeURIComponent(eventTitle)}`}
                          className="flex-1 py-2.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-100 transition-colors"
                        >
                          Register
                        </Link>
                      ) : (
                        <span className="flex-1 py-2.5 rounded-[50px] border border-slate-200 text-slate-400 text-center text-xs font-bold cursor-not-allowed">
                          No Booking
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MODALS */}
      {isSignUpOpen && (
        <SignUpModal
          onClose={() => setIsSignUpOpen(false)}
          defaultMinistry="Sword Ladies"
          defaultDepartment="Women's Ministry"
        />
      )}

      {/* 5. FOOTER TOPE */}
      <FooterTope />

      {/* 6. SITE FOOTER */}
      <SiteFooter />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default ForWomenPage;
