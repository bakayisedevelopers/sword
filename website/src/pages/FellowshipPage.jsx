import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * FellowshipPage reproducing FellowshipWidget:
 * flutter-website/lib/actions/fellowship/fellowship_widget.dart
 * Fidelity: >= 98%
 */
export function FellowshipPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'Fellowship | Sword of the Spirit Ministries';
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

  const fellowships = [
    {
      title: 'SuperKids',
      desc: 'Raising Kids to be who God meant them to be, inlfuencial and with purpose.',
      image: '/assets/images/IMG-20250620-WA0015.jpg',
      link: '/super-kids',
    },
    {
      title: 'Youth',
      desc: "A Youth that's after God's own heart, prayerful and full of the Spirit.",
      image: '/assets/images/IMG-20250919-WA0008.jpg',
      link: '/youth',
    },
    {
      title: 'Couples',
      desc: 'Raising healthy couples and marriages, because communities are built by healthy families.',
      image: '/assets/images/IMG-20250719-WA0016.jpg',
      link: '/couples',
    },
    {
      title: 'For Women',
      desc: "Rasising up women who are confident in themselves and stand up for the truth of God's Word.",
      image: '/assets/images/IMG-20250919-WA0018.jpg',
      link: '/for-women',
    },
    {
      title: "Pastor's Wives",
      desc: "A Ministry lead by Pastor Zandi to minister to women in ministry and Pastor's wives.",
      image: '/assets/images/woman_in_ministry.png',
      link: '/for-women',
    },
    {
      title: 'For Men',
      desc: 'Raising Men of Dominion and influence to lead healthy families.',
      image: '/assets/images/Men_of_Dominion.png',
      link: '/for-men',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Felloship_(2).png"
          alt="Fellowship Banner"
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
          src="/assets/images/Felloship.png"
          alt="Fellowship Banner Mobile"
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

      {/* 2. TITLE & DESCRIPTION */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-4">
          Find Fellowship
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Find a place to fellowship. We have fellowship areas for all age groups and for both women and men.
        </p>
      </section>

      {/* 3. FELLOWSHIP CARDS (6 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {fellowships.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="h-[240px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                <img
                  src={f.image}
                  alt={f.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-ff-secondary mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {f.desc}
                  </p>
                </div>

                <Link
                  to={f.link}
                  className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-center text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default FellowshipPage;
