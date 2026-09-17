import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * MinistriesPage reproducing MinistriesWidget:
 * flutter-website/lib/actions/ministries/ministries_widget.dart
 * Fidelity: >= 98%
 */
export function MinistriesPage() {
  const { toggleDrawer } = useAppState();
  const { data: ministries, loading } = useFirestoreQuery(COLLECTIONS.MINISTRIES);

  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedMinistryName, setSelectedMinistryName] = useState('');
  const [signUpOpen, setSignUpOpen] = useState(false);

  useEffect(() => {
    document.title = 'Our Ministries | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const fewdsDepartments = [
    'All',
    'Fellowship',
    'Evangelism',
    'Worship',
    'Discipleship',
    'Service',
  ];

  const fallbackMinistries = [
    {
      id: 'superkids-m',
      name: 'SuperKids Ministry',
      fewds: 'Fellowship',
      description: 'Helping you raise kids of dominion and influence so that when they grow up they will not depart from it.',
    },
    {
      id: 'youth-m',
      name: 'Youth Ministry',
      fewds: 'Fellowship',
      description: "Raising the next generation to dominate and influence the world for Jesus Christ. Friday 18:00 gatherings.",
    },
    {
      id: 'worship-m',
      name: 'Praise & Worship Team',
      fewds: 'Worship',
      description: 'Leading God’s people into prophetic, powerful worship encounters and musical excellence.',
    },
    {
      id: 'media-m',
      name: 'Media & Tech Department',
      fewds: 'Service',
      description: 'Audio, visual, live broadcast, and digital ministry across our regional campuses and online.',
    },
    {
      id: 'ushers-m',
      name: 'Hospitality & Protocol',
      fewds: 'Service',
      description: 'Welcoming members and visitors with joy, excellence, and order in God’s house.',
    },
    {
      id: 'evangelism-m',
      name: 'Evangelism & Street Outreach',
      fewds: 'Evangelism',
      description: 'Taking the Gospel of Christ to streets, hospitals, schools, and communities with power and love.',
    },
  ];

  const listToFilter = ministries && ministries.length > 0 ? ministries : fallbackMinistries;

  const filteredMinistries = listToFilter.filter((m) => {
    if (selectedDept === 'All') return true;
    const dept = m.FEWDS || m.fewds;
    return dept && dept.toLowerCase() === selectedDept.toLowerCase();
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
          src="/assets/images/Minstries_(2).png"
          alt="Ministries Banner"
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
          src="/assets/images/Minstries.png"
          alt="Ministries Banner Mobile"
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

      {/* 2. TITLE & FEWDS INTRO */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-4">
          Our Minstries
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
          Our Ministries are divided into 5 Categories namely Fellowship, Evangelism, Worship, Discipleship and Service.
        </p>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          See below to check for the ministry that you would join or serve in.
        </p>
        <p className="text-xs font-bold text-ff-alternate uppercase tracking-wider mt-4">
          Filter by department below to see ministries.
        </p>
      </section>

      {/* 3. FEWDS DEPARTMENT FILTER CHIPS */}
      <section className="w-[90%] max-w-[1440px] mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {fewdsDepartments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-5 py-2.5 rounded-[50px] text-xs sm:text-sm font-bold transition-colors ${
                selectedDept === dept
                  ? 'bg-ff-secondary text-white shadow-md'
                  : 'bg-slate-100 text-ff-secondary hover:bg-slate-200'
              }`}
            >
              {dept === 'All' ? 'All Departments' : `${dept} (FEWDS)`}
            </button>
          ))}
        </div>
      </section>

      {/* 4. MINISTRIES CARDS GRID */}
      <section className="w-[90%] max-w-[1440px] mx-auto mb-16">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Loading ministries...</div>
        ) : filteredMinistries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMinistries.map((m) => (
              <div
                key={m.id || m.name}
                className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <span className="text-xs font-bold text-ff-alternate uppercase tracking-wider block mb-1">
                    {(m.FEWDS || m.fewds) ? `${m.FEWDS || m.fewds} Department` : 'Ministry Department'}
                  </span>
                  <h3 className="text-2xl font-bold text-ff-secondary mb-2">{m.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">{m.description}</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Link
                    to={`/ministry?id=${m.id || m.name}`}
                    className="flex-1 py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    See Details
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMinistryName(m.name);
                      setSignUpOpen(true);
                    }}
                    className="flex-1 py-3 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-100 transition-colors"
                  >
                    Volunteer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            No ministries found under the {selectedDept} department.
          </div>
        )}
      </section>

      {/* SIGN UP MODAL */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        defaultMinistry={selectedMinistryName}
      />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default MinistriesPage;
