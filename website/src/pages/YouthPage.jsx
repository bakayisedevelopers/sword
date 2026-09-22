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
 * YouthPage matching FlutterFlow:
 * flutter-website/lib/ministries/youth/youth_widget.dart
 */
export function YouthPage() {
  const { toggleDrawer } = useAppState();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const youthEvents = useMemo(() => {
    return events
      .filter(isFutureEvent)
      .filter((e) => {
        const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
        const dept = (e.department || '').toLowerCase();
        const title = (e.title || e.name || '').toLowerCase();
        return (
          dept.includes('youth') ||
          dept.includes('nextgen') ||
          ministry.includes('youth') ||
          title.includes('youth')
        );
      })
      .sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(0) : new Date(0));
        return dateB - dateA;
      });
  }, [events]);

  useEffect(() => {
    document.title = 'Youth Ministry | Sword of the Spirit Ministries';
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
          src="/assets/images/Youth_(2).png"
          alt="Youth Banner"
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
          src="/assets/images/Youth.png"
          alt="Youth Banner"
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
            Youth
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed whitespace-pre-line">
            Raising the next Generation to dominate and influence the world for Jesus Christ.
            {'\n\n'}
            Youth meets every Friday from 18:00.
          </p>
        </div>
      </section>

      {/* 3. WHAT TO EXPECT */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            What to Expect
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Upon arrival at Church please look to your right and the Youth hall will be on your right. This is where our Youth meets every Friday.
          </p>
        </div>
      </section>

      {/* 4. AGES 13 - 21 & BAPTISM */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Ages 13 - 21 */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[260px] w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/IMG-20250919-WA0008.jpg"
                alt="Ages 13 - 21"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-ff-secondary mb-2">Ages 13 - 21</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  A prayerful, spirit filled and led group of young people that will defenitely change the way you do life with Jesus. They are not only all about Jesus but love people with the love of Jesus.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Baptism */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[260px] w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/Baptism.png"
                alt="Baptism"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-ff-secondary mb-2">Baptism</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  Do you want to get baptised?
                  {'\n\n'}
                  Baptism is a public declaration of our faith. it is a symbolism of us dying to self and and rising again with Christ.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/baptism"
                  className="inline-flex items-center gap-1.5 px-6 py-3 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <span>Learn About Baptism</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVE IN YOUTH */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-bold text-ff-secondary">Serve in Youth</h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              Serving in Youth requires a genuine relationship with Christ, a love for youth, patience, and a commitment to consistent attendance.
              {'\n\n'}
              A prayer life is important in everyone one who wants to serve, because God is always speaking and it requires that each volunteer cultivates an altar.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm shrink-0 inline-flex items-center gap-1.5"
            >
              <span>Volunteer in Youth</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. YOUTH EVENTS */}
      {youthEvents.length > 0 && (
        <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Youth Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {youthEvents.map((evt) => {
              const eventTitle = evt.title || evt.name || 'Youth Event';
              const eventImg = evt.picture || evt.image || evt.poster || '/assets/images/Youth.png';
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
          defaultMinistry="Youth"
          defaultDepartment="NextGen"
        />
      )}

      {/* 7. FOOTER TOPE */}
      <FooterTope />

      {/* 8. SITE FOOTER */}
      <SiteFooter />

      {/* 9. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default YouthPage;
