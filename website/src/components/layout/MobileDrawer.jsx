import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../app/providers.jsx';

export function MobileDrawer() {
  const { isDrawerOpen, closeDrawer } = useAppState();

  // Prevent background body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const sections = [
    {
      title: 'GET CARE',
      badge: 'Immediate help',
      links: [
        { label: 'Our Locations', path: '/locations' },
        { label: 'Counseling', path: '/counseling' },
        { label: 'Welfare Support', path: '/welfare' },
        { label: 'Prayer Request', path: '/prayer' },
        { label: 'Contact Us', path: '/contact-us' },
      ],
    },
    {
      title: 'MINISTRIES',
      badge: 'Explore',
      links: [
        { label: 'All Ministries', path: '/ministries' },
        { label: 'School of Ministry', path: '/school-of-ministry' },
        { label: 'Super Kids', path: '/super-kids' },
        { label: 'Youth', path: '/youth' },
        { label: 'Young Adults', path: '/young-adults' },
        { label: 'Couples', path: '/couples' },
        { label: 'Men of Honor', path: '/for-men' },
        { label: 'Women of Grace', path: '/for-women' },
        { label: 'Singles', path: '/singles' },
      ],
    },
    {
      title: 'RESOURCES',
      badge: 'Grow',
      links: [
        { label: 'Watch Sermons', path: '/watch' },
        { label: 'Podcasts', path: '/podcasts' },
        { label: 'E-Resources Center', path: '/e-resources-center' },
        { label: 'Follow Jesus', path: '/follow-jesus' },
        { label: 'Baptism', path: '/baptism' },
        { label: 'Events', path: '/events' },
      ],
    },
    {
      title: 'GIVING & PARTNERSHIP',
      badge: null,
      links: [
        { label: 'Give Online', path: '/give' },
        { label: 'Our Partners', path: '/partner' },
        { label: 'Become a Partner', path: '/be-a-partner' },
      ],
    },
    {
      title: 'ABOUT',
      badge: null,
      links: [
        { label: 'About Sword of the Spirit', path: '/about-us' },
        { label: 'Privacy Policy', path: '/privacy-policy' },
        { label: 'Social Media', path: '/socials' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={closeDrawer} />

      {/* Drawer Body matching Flutter showModalBottomSheet */}
      <div className="w-full max-h-[90vh] bg-ff-secondary text-white rounded-t-[30px] p-6 overflow-y-auto shadow-2xl flex flex-col">
        {/* Header with Logo and Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                src="/assets/images/SSMI_Logo_(No_background).png"
                alt="SSMI Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg tracking-wide">Menu</span>
          </div>

          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Categorized Navigation Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {sections.map((sec) => (
            <div key={sec.title} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-bold tracking-widest text-ff-alternate uppercase">
                  {sec.title}
                </h2>
                {sec.badge && (
                  <span className="text-[10px] uppercase font-bold bg-white text-ff-primary-text px-2 py-0.5 rounded">
                    {sec.badge}
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {sec.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={closeDrawer}
                      className="text-sm text-white/90 hover:text-white hover:underline transition-colors block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Actions inside Drawer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Sword of the Spirit Ministries International</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" onClick={closeDrawer} className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/contact-us" onClick={closeDrawer} className="hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileDrawer;
