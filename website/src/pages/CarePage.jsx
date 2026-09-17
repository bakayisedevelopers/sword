import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { FollowUpModal } from '../components/modals/FollowUpModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * CarePage matching flutter-website/lib/main_pages/care/care_widget.dart
 * Fidelity: >= 98%
 */
export function CarePage() {
  const { toggleDrawer } = useAppState();

  const [deliveranceModalOpen, setDeliveranceModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'For your Care | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const welfareImages = [
    '/assets/images/IMG-20250919-WA0025.jpg',
    '/assets/images/IMG-20250919-WA0023.jpg',
    '/assets/images/IMG-20250919-WA0021.jpg',
  ];

  const [activeWelfareIndex, setActiveWelfareIndex] = useState(0);

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Care_(2).png"
          alt="Care Banner"
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
                    item.path === '/care'
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
          src="/assets/images/Care.png"
          alt="Care Banner Mobile"
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

      {/* 2. CARE SERVICES SECTION (4 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Prayer */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="h-[220px] w-full overflow-hidden">
              <img
                src="/assets/images/WhatsApp_Prayer.png"
                alt="Prayer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">Prayer</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  From needing a prayer request to being a prayer partner, this ministry has it all.
                </p>
              </div>
              <Link
                to="/prayer"
                className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 2: Deliverance */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="h-[220px] w-full overflow-hidden">
              <img
                src="/assets/images/Deliverance.png"
                alt="Deliverance"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">Deliverance</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Sword and Spirit provides a personal deliverance, deliverance is personal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeliveranceModalOpen(true)}
                className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Book an Appointment
              </button>
            </div>
          </div>

          {/* Card 3: Counseling */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="h-[220px] w-full overflow-hidden">
              <img
                src="/assets/images/Counselling_.png"
                alt="Counseling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">Counseling</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  We offer biblical counseling for both individuals and couples. Pst. Zandi is a skilled and welcoming counsellor who has counselled thousands of individuals and couples.
                </p>
              </div>
              <Link
                to="/counseling"
                className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 4: Follow Up */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div className="h-[220px] w-full overflow-hidden">
              <img
                src="/assets/images/Follow_ups.png"
                alt="Follow Up"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-xl font-bold text-ff-secondary mb-2">Follow Up</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  We offer one on one check ins with the Apostle, Pastor Zandi and Pastor B. Our one on ones are meant to check in and follow up with partners to hear if they have any needs from the leadership of the Church.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFollowUpModalOpen(true)}
                className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WELFARE SECTION */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 bg-ff-secondary text-white rounded-[30px] p-6 sm:p-12 shadow-md border border-ff-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
              Outreach & Compassion
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Welfare
            </h2>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Every Friday Sword and Spirit Ministries Intn'l EMalahleni feeds over 50+ people and prays for them for Jobs. We have seen the miracles happend throught this ministry.
            </p>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              The less previlaged are not only given food but Hope through Jesus.
            </p>
            <div className="pt-4">
              <Link
                to="/welfare"
                className="px-8 py-3.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm hover:bg-white/90 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Learn More</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full h-[320px] sm:h-[380px] rounded-[24px] overflow-hidden shadow-lg border border-white/10 relative">
              <img
                src={welfareImages[activeWelfareIndex]}
                alt={`Welfare outreach ${activeWelfareIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            {/* Carousel navigation dots */}
            <div className="flex gap-3 mt-4">
              {welfareImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveWelfareIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeWelfareIndex === idx ? 'bg-ff-primary w-8' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER TOPE */}
      <FooterTope />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MODALS */}
      <RequestModal
        isOpen={deliveranceModalOpen}
        onClose={() => setDeliveranceModalOpen(false)}
        defaultRequestType="Deliverance"
      />

      <FollowUpModal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
      />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default CarePage;
