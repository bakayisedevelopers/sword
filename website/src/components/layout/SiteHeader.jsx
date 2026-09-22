import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppState } from '../../app/providers.jsx';

export function SiteHeader() {
  const location = useLocation();
  const { toggleDrawer } = useAppState();

  const isCurrent = (path) => location.pathname === path;

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  return (
    <header className="w-full">
      {/* Desktop Header (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto pt-5 pb-2">
        <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-center justify-between">
          {/* Logo */}
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

          {/* Nav Items */}
          <nav className="flex items-center gap-2">
            {navItems.map((item) => {
              const active = isCurrent(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                    active
                      ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                      : 'bg-transparent text-ff-secondary-text border-ff-primary hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Dashboard */}
          <div>
            <button
              type="button"
              onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >Discipleship</button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Header (< 991px) */}
      <div className="block lg:hidden w-[90%] mx-auto my-2.5">
        <div className="w-full bg-ff-secondary rounded-[20px] p-2.5 flex items-center justify-between border border-transparent shadow-[0_0_30px_rgba(25,36,49,0.5)]">
          {/* Logo */}
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

          {/* Right controls: Dashboard button & Menu icon button */}
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
              {/* Hamburger Icon */}
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
    </header>
  );
}

export default SiteHeader;
