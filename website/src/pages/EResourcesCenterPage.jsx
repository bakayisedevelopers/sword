import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * EResourcesCenterPage matching FlutterFlow:
 * flutter-website/lib/resources/e_resources_center/e_resources_center_widget.dart
 */
export function EResourcesCenterPage() {
  const { toggleDrawer } = useAppState();
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    document.title = 'e-Resource Center | Sword of the Spirit Ministries';
  }, []);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const offersList = [
    'Apprenticeship',
    'Bursary',
    'Business',
    'Careers',
    'Conferences and Seminars',
    'Education And Training',
    'Employment',
    'Government Programs',
    'Graduate Program',
    'Internships',
    'Learnerships',
    'Library',
    'Market Place',
    'Market Place Shared Resource',
    'Mentorship',
    'Scholarship',
    'School Sponsorship',
    'Skills Development',
    'Sponsorship and Grants',
    'Word Of God (Discipleship)',
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      {/* 1. HERO SECTION */}
      {/* Desktop Hero */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/e-Resource_(2).png"
          alt="e-Resource Center Banner"
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
          src="/assets/images/e-Resource.png"
          alt="e-Resource Center Banner"
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
            e-Resource Center
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed whitespace-pre-line">
            Our e-Resources Center will provide access to information in relations to, but not limited to, Apprenticeship, Bursary, Careers, Employment, Internships, Learnerships, etc.
            {'\n\n'}
            See below for details.
          </p>
        </div>
      </section>

      {/* 3. OBJECTIVES, BENEFITS, AND OFFERINGS */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 space-y-8">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-12 shadow-sm space-y-8 text-slate-700">
          {/* Objectives */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary mb-3">
              THE RESOURCE CENTRE'S OBJECTIVES ARE (BUT NOT LIMITED TO):
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base pl-2">
              <li>Access of Information</li>
              <li>Personal administration</li>
              <li>Career Guidance to find the right path</li>
              <li>Personal Development to archive highest level of productivity and success</li>
              <li>Skills Transfer and giving work experience through appointment of mentors</li>
              <li>Getting employment or being active in the economy</li>
              <li>Running an Enlight Resource Center as a Center Manager</li>
              <li>Mastering the art of employment</li>
            </ul>
          </div>

          {/* Benefits */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary mb-3">
              BENEFITS:
            </h2>
            <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base pl-2">
              <li>Free services to user</li>
              <li>Free administration</li>
              <li>Work Experience</li>
              <li>Employment opportunity</li>
              <li>Business Opportunity</li>
              <li>Career Guidance</li>
              <li>Personal Development</li>
            </ul>
          </div>

          {/* Offerings Pill Grid */}
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary mb-4">
              ENLIGHT RESOURCE CENTRE OFFERS THE FOLLOWING:
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {offersList.map((item, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-ff-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="border-t border-slate-200 pt-6">
            <div className="p-4 sm:p-6 bg-slate-50 rounded-[20px] border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              <strong>Disclaimer:</strong> This is not a platform to give people employment or busary, it's only for informational purposes, it's only for access to resources and information to help you. For example a platform that provides access to laptops/computers that are used by the community to apply for jobs. It's only a platform.
            </div>
          </div>

          {/* For More Information Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsContactOpen(true)}
              className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span>For More Information</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* REQUEST MODAL */}
      {isContactOpen && (
        <RequestModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          requestType="e-Resource Center Inquiry"
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

export default EResourcesCenterPage;
