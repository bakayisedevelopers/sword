import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FollowUpModal } from '../modals/FollowUpModal.jsx';
import { useFirestoreQuery } from '../../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../../lib/firestore.js';

function getMinistryPath(ministry) {
  if (ministry.slug) return `/${ministry.slug}`;
  const name = ministry.name || ministry.ministryName || '';
  const slug = name.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return slug ? `/${slug}` : `/ministry?id=${ministry.id}`;
}

/**
 * SiteFooter component reproducing FooterWidget, FooterDesktopWidget, and FooterMobileWidget:
 * flutter-website/lib/bottom_sheets/footer/footer_widget.dart
 * flutter-website/lib/bottom_sheets/footer_desktop/footer_desktop_widget.dart
 * flutter-website/lib/bottom_sheets/footer_mobile/footer_mobile_widget.dart
 */
export function SiteFooter() {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const { data: dbMinistries } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const currentYear = new Date().getFullYear();

  const conferencesList = useMemo(() => {
    const defaultConfs = [
      { name: 'Fire Conference', path: '/fire-conference' },
      { name: 'Superman Conference', path: '/superman-conference' },
      { name: 'Camp Yolo', path: '/camp-yolo' },
    ];
    if (!dbMinistries || !dbMinistries.length) return defaultConfs;

    const dbConfs = dbMinistries
      .filter((m) => m.type === 'conference')
      .map((m) => ({ name: m.name || m.ministryName, path: getMinistryPath(m) }));

    const merged = [...dbConfs];
    for (const def of defaultConfs) {
      if (!merged.some((m) => m.name.toLowerCase() === def.name.toLowerCase())) {
        merged.push(def);
      }
    }
    return merged;
  }, [dbMinistries]);

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <footer id="site-footer" className="w-full py-8">
      {/* Footer Container */}
      <div className="w-[90%] max-w-[1440px] mx-auto bg-ff-secondary text-white rounded-[30px] p-6 sm:p-10 border border-transparent shadow-[0_4px_30px_rgba(0,0,0,0.15)]">
        {/* DESKTOP LAYOUT (>= 991px) */}
        <div className="hidden lg:block w-full">
          <div className="grid grid-cols-4 gap-8 pb-10">
            {/* Column 1: Core Navigation */}
            <div className="flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => {
                  window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer');
                  handleLinkClick();
                }}
                className="w-[150px] h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm border border-ff-secondary hover:bg-white/90 transition-colors shadow-sm"
              >Discipleship</button>

              <div className="flex flex-col gap-2 pt-2">
                <Link to="/locations" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Locations
                </Link>
                <Link to="/watch" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Watch
                </Link>
                <Link to="/about-us" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  About
                </Link>
                <Link to="/care" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Care
                </Link>
                <Link to="/events" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Events
                </Link>
                <Link to="/give" onClick={handleLinkClick} className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Give
                </Link>
              </div>
            </div>

            {/* Column 2: Partner With Us */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                PARTNER WITH US
              </h3>

              {/* Adults Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Adults
                </span>
                <Link to="/be-a-partner" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Be a Partner
                </Link>
                <Link to="/ministries" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Ministries
                </Link>
                <Link to="/school-of-ministry" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  School of Ministry
                </Link>
              </div>

              {/* For Your Family Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  For Your Family
                </span>
                <Link to="/super-kids" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  SuperKids
                </Link>
                <Link to="/youth" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Youth
                </Link>
                <Link to="/for-couples" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Couples
                </Link>
                <Link to="/for-men" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  For Men
                </Link>
                <Link to="/for-women" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  For Women
                </Link>
              </div>
            </div>

            {/* Column 3: Get Care & Resources */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                GET CARE
              </h3>

              {/* Immediate Help Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Immediate help
                </span>
                <Link to="/prayer" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Prayer
                </Link>
                <Link to="/counseling" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Counseling
                </Link>
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(true)}
                  className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1 text-left"
                >
                  Check Ins
                </button>
              </div>

              {/* Resources Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Resources
                </span>
                <Link to="/e-resources-center" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  e-Resource Centre
                </Link>
                <Link to="/watch" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Sermons
                </Link>
                <Link to="/podcasts" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Podcasts
                </Link>
              </div>
            </div>

            {/* Column 4: More & Conferences */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                MORE
              </h3>

              {/* Conferences Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Conferences
                </span>
                {conferencesList.map((conf) => (
                  <Link
                    key={conf.name}
                    to={conf.path}
                    onClick={handleLinkClick}
                    className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1"
                  >
                    {conf.name}
                  </Link>
                ))}
              </div>

              {/* Others Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Others
                </span>
                <Link to="/contact-us" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Contact Us
                </Link>
                <Link to="/privacy-policy" onClick={handleLinkClick} className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Footer Bottom Bar */}
          <div className="pt-6 border-t border-white/20 flex items-center justify-between">
            <Link
              to="/socials"
              onClick={handleLinkClick}
              className="px-6 py-2.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm hover:bg-white/90 transition-colors shadow-sm"
            >
              Social Links
            </Link>
            <p className="text-sm font-semibold text-white/90">
              &copy; {currentYear} Sword & Spirit. All rights reserved.
            </p>
          </div>
        </div>

        {/* MOBILE / TABLET LAYOUT (< 991px) */}
        <div className="block lg:hidden w-full space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Mobile Column 1: Core Navigation */}
            <div className="flex flex-col items-start gap-4">
              <button
                type="button"
                onClick={() => {
                  window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer');
                  handleLinkClick();
                }}
                className="w-[140px] h-9 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs border border-ff-secondary hover:bg-white/90 transition-colors shadow-sm mb-1"
              >Discipleship</button>

              <div className="flex flex-col gap-2 pt-1">
                <Link to="/locations" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  Locations
                </Link>
                <Link to="/watch" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  Watch
                </Link>
                <Link to="/about-us" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  About
                </Link>
                <Link to="/care" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  Care
                </Link>
                <Link to="/events" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  Events
                </Link>
                <Link to="/give" onClick={handleLinkClick} className="text-base font-bold text-white hover:text-white/80 transition-colors">
                  Give
                </Link>
              </div>
            </div>

            {/* Mobile Column 2: PARTNER WITH US */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                PARTNER WITH US
              </h3>

              {/* Adults Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Adults
                </span>
                <Link to="/be-a-partner" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Be a Partner
                </Link>
                <Link to="/ministries" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Ministries
                </Link>
                <Link to="/school-of-ministry" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  School of Ministry
                </Link>
              </div>

              {/* For Your Family Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  For Your Family
                </span>
                <Link to="/super-kids" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  SuperKids
                </Link>
                <Link to="/youth" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Youth
                </Link>
                <Link to="/for-couples" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Couples
                </Link>
                <Link to="/for-men" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  For Men
                </Link>
                <Link to="/for-women" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  For Women
                </Link>
              </div>
            </div>

            {/* Mobile Column 3: GET CARE */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                GET CARE
              </h3>

              {/* Immediate Help Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Immediate help
                </span>
                <Link to="/prayer" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Prayer
                </Link>
                <Link to="/counseling" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Counseling
                </Link>
                <button
                  type="button"
                  onClick={() => setShowFollowUpModal(true)}
                  className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1 text-left"
                >
                  Check Ins
                </button>
              </div>

              {/* Resources Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Resources
                </span>
                <Link to="/e-resources-center" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  e-Resource Centre
                </Link>
                <Link to="/watch" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Sermons
                </Link>
                <Link to="/podcasts" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Podcasts
                </Link>
              </div>
            </div>

            {/* Mobile Column 4: MORE */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-base font-bold text-white tracking-wide uppercase">
                MORE
              </h3>

              {/* Conferences Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Conferences
                </span>
                {conferencesList.map((conf) => (
                  <Link
                    key={conf.name}
                    to={conf.path}
                    onClick={handleLinkClick}
                    className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1"
                  >
                    {conf.name}
                  </Link>
                ))}
              </div>

              {/* Others Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-white text-ff-secondary font-bold text-xs px-3.5 py-1 rounded-r-xl shadow-sm inline-block">
                  Others
                </span>
                <Link to="/contact-us" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Contact Us
                </Link>
                <Link to="/privacy-policy" onClick={handleLinkClick} className="text-sm font-bold text-white/90 hover:text-white transition-colors pl-1">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Footer Bottom Bar */}
          <div className="pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/socials"
              onClick={handleLinkClick}
              className="px-6 py-2.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs hover:bg-white/90 transition-colors shadow-sm"
            >
              Social Links
            </Link>
            <p className="text-xs font-semibold text-white/90 text-center">
              &copy; {currentYear} Sword & Spirit. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Shared Follow Up Modal */}
      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
      />
    </footer>
  );
}

export default SiteFooter;
