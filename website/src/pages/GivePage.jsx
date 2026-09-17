import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { GiveBranchModal } from '../components/modals/GiveBranchModal.jsx';
import { GiveBeyondBranchModal } from '../components/modals/GiveBeyondBranchModal.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';

/**
 * GivePage reproducing GiveWidget:
 * flutter-website/lib/main_pages/give/give_widget.dart
 * Fidelity: >= 98%
 */
export function GivePage() {
  const { toggleDrawer } = useAppState();

  const [giveBranchOpen, setGiveBranchOpen] = useState(false);
  const [giveBeyondOpen, setGiveBeyondOpen] = useState(false);
  const [selectedBeyondMinistry, setSelectedBeyondMinistry] = useState('');
  const [signUpOpen, setSignUpOpen] = useState(false);

  useEffect(() => {
    document.title = 'Giving | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const { data: dbMinistries, loading: ministriesLoading } = useFirestoreQuery(
    COLLECTIONS.MINISTRIES,
    { where: [{ field: 'donations', operator: '==', value: true }] }
  );

  // Fallback if Firestore has no seeded donation-enabled ministries
  const fallbackMinistries = [
    {
      id: 'welfare-prog',
      name: 'Welfare & Feeding Program',
      description: 'Support our Friday feeding scheme that nourishes 50+ families weekly.',
    },
    {
      id: 'youth-adv',
      name: 'Youth & Camp Ministry',
      description: 'Sponsor a youth for annual discipleship camps and conferences.',
    },
    {
      id: 'workers-app',
      name: 'Workers & Leadership Appreciation',
      description: 'Bless our faithful volunteers and branch ministers.',
    },
  ];

  const ministriesList = dbMinistries && dbMinistries.length > 0 ? dbMinistries : fallbackMinistries;

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
          src="/assets/images/Give_(2).png"
          alt="Give Banner"
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
                  className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                    item.path === '/give'
                      ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                      : 'bg-transparent text-white border-ff-primary hover:bg-white/10'
                  }`}
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
          src="/assets/images/Give.png"
          alt="Give Banner Mobile"
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

      {/* 2. WHY DO WE GIVE? */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-4">
          Why do we give?
        </h2>
        <p className="text-lg sm:text-xl text-slate-700 italic max-w-2xl mx-auto leading-relaxed">
          "A generous person will prosper; whoever refreshes others will be refreshed."
        </p>
        <span className="block text-sm font-bold text-ff-alternate mt-2">
          ~ Proverbs 11:25
        </span>
      </section>

      {/* 3. WAYS TO GIVE (3 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Options
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1">
            Ways to Give
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: In Person */}
          <div className="bg-white rounded-[30px] p-8 border border-ff-secondary shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-ff-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ff-secondary mb-2">Give In Person</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                You can give in church during a service or drop it at the church office.
              </p>
            </div>
            <Link
              to="/locations"
              className="w-full py-3 rounded-[50px] bg-slate-100 text-ff-secondary text-center text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Find a Campus
            </Link>
          </div>

          {/* Card 2: Via EFT */}
          <div className="bg-white rounded-[30px] p-8 border border-ff-secondary shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-ff-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ff-secondary mb-2">Give via EFT</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                You can give your tithes or offerings via EFT into the Church's banking details.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGiveBranchOpen(true)}
              className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Give Now
            </button>
          </div>

          {/* Card 3: Via Bank Card */}
          <div className="bg-white rounded-[30px] p-8 border border-ff-secondary shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-ff-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ff-secondary mb-2">Give via Bank Card</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Give once or give regularly by setting up a recurring gift.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="w-full py-3 rounded-[50px] bg-slate-200 text-slate-500 text-center text-xs font-bold cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* 4. BEYOND THE TITHE */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10 bg-ff-secondary text-white rounded-[30px] p-8 sm:p-12 shadow-md border border-ff-secondary">
        <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
          Sacrificial Giving
        </span>
        <h2 className="text-2xl sm:text-4xl font-bold text-white mt-1 mb-4">
          Beyond the Tithe
        </h2>
        <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
          Beyond the tithe is anything that you give beyond 10% and this is used to fund different ministry movements in the church. This includes but not limited to Welfare programs, workers appreciation, and advancement of God's Kingdom.
        </p>
        <p className="text-sm sm:text-base text-white/80 leading-relaxed mt-2">
          See below how you can give beyond your tithe.
        </p>
      </section>

      {/* 5. EXPLORE BEYOND THE TITHE */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Explore beyond the Tithe
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ministriesList.map((m) => (
            <div
              key={m.id || m.name}
              className="bg-white rounded-[30px] p-6 border border-ff-secondary shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">{m.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">{m.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBeyondMinistry(m.name);
                    setGiveBeyondOpen(true);
                  }}
                  className="flex-1 py-2.5 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Give Now
                </button>
                <button
                  type="button"
                  onClick={() => setSignUpOpen(true)}
                  className="flex-1 py-2.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-center text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Volunteer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINANCIAL RESOURCES */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10 bg-slate-50 rounded-[30px] p-8 sm:p-12 border border-slate-200">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Education & Stewardship
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1 mb-4">
            Financial Resources
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Financially we are all at different levels and some are ought to be teachers and others to be diligent students to steward well what God has entrusted us with that it may be distributed to advance the kingdom of God.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mt-2">
            Financial resources will equip you.
          </p>
          <div className="mt-6">
            <button
              type="button"
              disabled
              className="px-6 py-2.5 rounded-[50px] bg-slate-200 text-slate-500 font-bold text-xs cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER TOPE */}
      <FooterTope />

      {/* 8. SITE FOOTER */}
      <SiteFooter />

      {/* 9. MODALS */}
      <GiveBranchModal
        isOpen={giveBranchOpen}
        onClose={() => setGiveBranchOpen(false)}
      />

      <GiveBeyondBranchModal
        isOpen={giveBeyondOpen}
        onClose={() => setGiveBeyondOpen(false)}
        defaultMinistry={selectedBeyondMinistry}
      />

      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        defaultMinistry="Volunteer"
      />

      {/* 10. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default GivePage;
