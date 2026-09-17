import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * PrivacyPolicyPage matching FlutterFlow:
 * flutter-website/lib/policies/privacy_policy/privacy_policy_widget.dart
 */
export function PrivacyPolicyPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'Privacy Policy | Sword of the Spirit Ministries';
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
      {/* Desktop Header */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-6 mb-4">
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

      {/* Mobile Header */}
      <div className="block lg:hidden w-[90%] mx-auto mt-6 mb-4">
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

      {/* Back button */}
      <div className="w-[90%] max-w-[1440px] mx-auto py-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ff-secondary hover:text-ff-alternate transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back</span>
        </Link>
      </div>

      {/* Main Container with Policy Content & WebView iframe matching FlutterFlow */}
      <main className="w-[90%] max-w-[1440px] mx-auto my-4 flex-1">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: 2025. Sword of the Spirit Ministries International is committed to safeguarding the personal information and privacy of our global congregation and visitors.
          </p>

          <div className="w-full h-[700px] sm:h-[900px] rounded-[20px] overflow-hidden border border-slate-200 shadow-inner">
            <iframe
              src="https://www.privacypolicies.com/live/73cfaaa2-007f-4bd9-bbf8-dd9481f9465b"
              title="SSMI Privacy Policy"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter />

      {/* MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default PrivacyPolicyPage;
