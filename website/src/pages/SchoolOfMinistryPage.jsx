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
 * SchoolOfMinistryPage matching FlutterFlow:
 * flutter-website/lib/ministries/school_of_ministry/school_of_ministry_widget.dart
 */
export function SchoolOfMinistryPage() {
  const { toggleDrawer } = useAppState();
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const somEvents = useMemo(() => {
    return events
      .filter(isFutureEvent)
      .filter((e) => {
        const ministry = (e.mininstryName || e.ministryName || '').toLowerCase();
        const dept = (e.department || '').toLowerCase();
        const title = (e.title || e.name || '').toLowerCase();
        return (
          ministry.includes('school of ministry') ||
          ministry.includes('som') ||
          dept.includes('school of ministry') ||
          dept.includes('education') ||
          title.includes('school of ministry') ||
          title.includes('som')
        );
      })
      .sort((a, b) => {
        const dateA = a.date?.toDate ? a.date.toDate() : (a.date ? new Date(a.date) : new Date(0));
        const dateB = b.date?.toDate ? b.date.toDate() : (b.date ? new Date(0) : new Date(0));
        return dateB - dateA;
      });
  }, [events]);

  useEffect(() => {
    document.title = 'School of Ministry | Sword of the Spirit Ministries';
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
          src="/assets/images/SOM_(2).png"
          alt="School of Ministry Banner"
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
          src="/assets/images/SOM.png"
          alt="School of Ministry Banner"
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
            School of Ministry
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            In every ministry we found or start, we are always dedicated to Raising a people of dominion and influence through revelation knowledge and by the Spirit.
          </p>
        </div>
      </section>

      {/* 3. DETAILED CURRICULUM & MANDATE CARD */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed">
          {/* Welcome section */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mb-3">
              Welcome to the School of Ministry
            </h2>
            <blockquote className="border-l-4 border-ff-secondary pl-4 italic text-slate-600 my-4 text-base sm:text-lg">
              "Study to show yourself approved unto God, a workman that needeth not to be ashamed, rightly dividing the word of truth." – 2 Timothy 2:15 (KJV)
            </blockquote>
            <p className="text-sm sm:text-base leading-relaxed">
              The School of Ministry is a place where men and women are equipped, empowered, and released into their God-given calling. School of Ministry exists to provide sound biblical training, develop servant leaders, and raise disciples who are effective in their families, churches, and communities.
            </p>
          </div>

          {/* Impact */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary mb-2">
              Our Impact
            </h3>
            <p className="text-sm sm:text-base">
              Since its beginning, the School of Ministry has trained and empowered over 350+ students who are now actively serving in local churches, missions, and various ministries across South Africa and beyond.
            </p>
          </div>

          {/* Levels of Training */}
          <div className="border-t border-slate-200 pt-6 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary">
              Levels of Training & Qualifications
            </h3>
            <p className="text-sm sm:text-base">
              We offer structured ministry-based training through the following levels:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-50 p-6 rounded-[20px] border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Level 1</span>
                <h4 className="text-lg font-bold text-ff-secondary">Certificate in Ministry Foundations</h4>
                <p className="text-sm text-slate-600">
                  Introduction to the Bible, Prayer, Discipleship, and Servanthood. Focus on developing a strong spiritual foundation.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[20px] border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Level 2</span>
                <h4 className="text-lg font-bold text-ff-secondary">Diploma in Christian Leadership</h4>
                <p className="text-sm text-slate-600">
                  In-depth study of Theology, Pastoral Care, Evangelism, and Church Leadership. Equips students to serve in church ministries and leadership roles.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[20px] border border-slate-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Level 3</span>
                <h4 className="text-lg font-bold text-ff-secondary">Advanced Diploma in Ministry & Missions</h4>
                <p className="text-sm text-slate-600">
                  Focus on Missions, Apostolic Ministry, Church Planting, and Advanced Biblical Studies. Prepares students for long-term ministry assignments.
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-500 italic pt-2">
              Note: These qualifications are for ministry purposes only and are not accredited with the South African Qualifications Authority (SAQA) or the Department of Education. They are recognized within our ministry context for equipping and ordination purposes.
            </p>
          </div>

          {/* Biblical Mandate */}
          <div className="border-t border-slate-200 pt-6 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary">
              4. Our Biblical Mandate
            </h3>
            <p className="text-sm sm:text-base italic bg-slate-50 p-4 rounded-[16px] border border-slate-200">
              “And He Himself gave some to be apostles, some prophets, some evangelists, and some pastors and teachers, for the equipping of the saints for the work of ministry, for the edifying of the body of Christ.” – Ephesians 4:11–12 (NKJV)
            </p>
            <p className="text-sm sm:text-base italic bg-slate-50 p-4 rounded-[16px] border border-slate-200">
              “Go therefore and make disciples of all the nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all things that I have commanded you.” – Matthew 28:19–20 (NKJV)
            </p>
          </div>

          {/* Program Duration */}
          <div className="border-t border-slate-200 pt-6 space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary">
              5. Program Duration
            </h3>
            <p className="text-sm sm:text-base">
              Our School of Ministry runs on a yearly basis and is for every partener at Sword and Spirit.
            </p>
            <p className="text-xs text-slate-500 italic">
              This is not a government-registered or accredited educational institution, but rather a ministry-based training program. Our focus is spiritual formation, biblical understanding, and practical ministry training for those called to serve in the Kingdom of God.
            </p>
          </div>

          {/* Sign Up CTA */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsSignUpOpen(true)}
              className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Sign Up for School of Ministry</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SCHOOL OF MINISTRY EVENTS */}
      {somEvents.length > 0 && (
        <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            School of Ministry Events
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {somEvents.map((evt) => {
              const eventTitle = evt.title || evt.name || 'School of Ministry Event';
              const eventImg = evt.picture || evt.image || evt.poster || '/assets/images/SOM.png';
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

      {/* SIGN UP MODAL */}
      {isSignUpOpen && (
        <SignUpModal
          onClose={() => setIsSignUpOpen(false)}
          defaultMinistry="School of Ministry"
          defaultDepartment="Education"
        />
      )}

      {/* 4. FOOTER TOPE */}
      <FooterTope />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default SchoolOfMinistryPage;
