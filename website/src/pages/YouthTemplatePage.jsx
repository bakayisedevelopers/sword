import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { isFutureEvent } from '../lib/format.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * YouthTemplatePage matching FlutterFlow:
 * flutter-website/lib/templates/youth_template/youth_template_widget.dart
 */
export function YouthTemplatePage() {
  const { toggleDrawer } = useAppState();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const youthEvents = events
    .filter(isFutureEvent)
    .filter(
    (e) =>
      e.department?.toLowerCase()?.includes('youth') ||
      e.title?.toLowerCase()?.includes('youth') ||
      e.name?.toLowerCase()?.includes('youth')
  );

  useEffect(() => {
    document.title = 'Youth | Sword of the Spirit Ministries';
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
            Youth
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            Raising the next Generation to dominate and influence the world for Jesus Christ.
          </p>
        </div>
      </section>

      {/* 3. WHAT TO EXPECT & SERVICE TIMES */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            What to Expect
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
            Upon your arrival to church you will be shown where kids seat in church and when it's time for the Kids to go to their Sunday school, they will be safely escourted by our volunteers to their hall. Please ensure to go and take your child from the hall or Kids' venue.
            {'\n\n'}
            SuperKids Ministry is a vibrant and exciting ministry designed to teach children about God’s Word in a fun, safe, and engaging way. Through age-appropriate lessons, music, games, and activities, we help children build a strong foundation of faith while discovering their identity in Christ. Our goal is to raise a generation of confident, Spirit-filled leaders who love Jesus and live by His Word.
          </p>
        </div>

        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Service Times
          </h2>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[20px] border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-ff-secondary text-white flex items-center justify-center font-bold">
              Fri
            </div>
            <div>
              <div className="font-bold text-ff-secondary text-lg">Every Friday</div>
              <div className="text-sm text-slate-600">From 17:00</div>
            </div>
          </div>
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
            {youthEvents.map((evt) => (
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

export default YouthTemplatePage;
