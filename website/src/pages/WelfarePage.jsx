import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { isFutureEvent } from '../lib/format.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * WelfarePage matching FlutterFlow:
 * flutter-website/lib/ministries/welfare/welfare_widget.dart
 */
export function WelfarePage() {
  const { toggleDrawer } = useAppState();
  const [isReachOutOpen, setIsReachOutOpen] = useState(false);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);

  const { data: ministries } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const welfareMinistries = ministries.filter(
    (m) =>
      (m.FEWDS || m.fewds)?.toLowerCase() === 'welfare' ||
      m.department?.toLowerCase() === 'welfare' ||
      m.name?.toLowerCase().includes('welfare')
  );

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const welfareEvents = events
    .filter(isFutureEvent)
    .filter(
    (e) => {
      const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
      const dept = (e.department || '').toLowerCase();
      const title = (e.title || e.name || '').toLowerCase();
      return dept.includes('welfare') || ministry.includes('welfare') || title.includes('welfare');
    }
  );

  useEffect(() => {
    document.title = 'Welfare Ministry | Sword of the Spirit Ministries';
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
          src="/assets/images/Welfare_(2).png"
          alt="Welfare Banner"
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
              onClick={() => console.log('My Dashboard clicked')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >
              My Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Welfare.png"
          alt="Welfare Banner"
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
      </div>

      {/* 2. HEADER INTRO */}
      <section className="w-[90%] max-w-[1440px] mx-auto mt-12 mb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold text-ff-secondary">
            Welfare
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            Our Welfare Ministry is aimed at being the hands and feet for Jesus to those who need our help.
          </p>
        </div>
      </section>

      {/* 3. ABOUT WELFARE & E-RESOURCES */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* About Welfare Card */}
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
              About Welfare
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              From food provisions to Job seeking, our welfare provides the help you need.
              {'\n\n'}
              If you have a need, always reach out.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={() => setIsReachOutOpen(true)}
              className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Reach Out</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsVolunteerOpen(true)}
              className="px-8 py-3.5 rounded-[30px] border border-ff-secondary bg-white text-ff-secondary font-bold text-sm hover:bg-slate-50 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Volunteer</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* e-Resources Centre Card */}
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
              e-Resources Centre
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our e-Resources centre will offer access to information relating to, but not limited to, Apprenticeship, Bursary, Careers, Employment, Internships, Learnerships, etc.
            </p>
          </div>
          <div>
            <Link
              to="/e-resources-center"
              className="inline-flex items-center gap-1.5 px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
            >
              <span>Explore e-Resources</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WELFARE MINISTRIES */}
      {welfareMinistries.length > 0 && (
        <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Welfare Ministries
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {welfareMinistries.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-[24px] border border-ff-secondary p-6 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                    {m.FEWDS || m.fewds || 'Welfare'}
                  </span>
                  <h3 className="text-xl font-bold text-ff-secondary mt-1">
                    {m.name || m.ministryName}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                    {m.description || m.servingDetails || 'Empowering communities and extending the love of Jesus Christ.'}
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    to={`/ministry?id=${m.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-ff-secondary hover:text-ff-alternate"
                  >
                    <span>View Ministry</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. EVENTS */}
      {welfareEvents.length > 0 && (
        <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {welfareEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-[24px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col"
              >
                {evt.picture && (
                  <div className="h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.picture}
                      alt={evt.title || evt.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="font-bold text-lg text-ff-secondary">
                    {evt.title || evt.name}
                  </h3>
                  <Link
                    to={`/event?id=${evt.id}`}
                    className="inline-flex items-center gap-1 text-sm font-bold text-ff-secondary hover:text-ff-alternate"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* MODALS */}
      {isReachOutOpen && (
        <RequestModal
          isOpen={isReachOutOpen}
          onClose={() => setIsReachOutOpen(false)}
          requestType="Welfare"
        />
      )}

      {isVolunteerOpen && (
        <SignUpModal
          onClose={() => setIsVolunteerOpen(false)}
          defaultMinistry="Welfare"
          defaultDepartment="Welfare"
        />
      )}

      {/* 6. FOOTER TOPE */}
      <FooterTope />

      {/* 7. SITE FOOTER */}
      <SiteFooter />

      {/* 8. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default WelfarePage;
