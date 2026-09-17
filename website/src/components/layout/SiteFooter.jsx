import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FollowUpModal } from '../modals/FollowUpModal.jsx';

/**
 * SiteFooter component reproducing FooterWidget, FooterDesktopWidget, and FooterMobileWidget:
 * flutter-website/lib/bottom_sheets/footer/footer_widget.dart
 * flutter-website/lib/bottom_sheets/footer_desktop/footer_desktop_widget.dart
 * flutter-website/lib/bottom_sheets/footer_mobile/footer_mobile_widget.dart
 */
export function SiteFooter() {
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

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
                onClick={() => console.log('My Dashboard clicked')}
                className="w-[150px] h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm border border-ff-secondary hover:bg-white/90 transition-colors"
              >
                My Dashboard
              </button>

              <div className="flex flex-col gap-2 pt-2">
                <Link to="/locations" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Locations
                </Link>
                <Link to="/watch" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Watch
                </Link>
                <Link to="/about-us" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  About
                </Link>
                <Link to="/care" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Care
                </Link>
                <Link to="/give" className="text-xl font-bold text-white hover:text-white/80 transition-colors">
                  Give
                </Link>
              </div>
            </div>

            {/* Column 2: Partner With Us & Family */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide">
                PARTNER WITH US
              </h3>

              {/* Adults Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  Adults
                </span>
                <Link to="/be-a-partner" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Be a Partner
                </Link>
                <Link to="/ministries" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Ministries
                </Link>
                <Link to="/school-of-ministry" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  School of Ministry
                </Link>
              </div>

              {/* For Your Family Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  For Your Family
                </span>
                <Link to="/super-kids" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  SuperKids
                </Link>
                <Link to="/youth" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Youth
                </Link>
                <Link to="/couples" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Couples
                </Link>
                <Link to="/for-men" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  For Men
                </Link>
                <Link to="/for-women" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  For Women
                </Link>
              </div>
            </div>

            {/* Column 3: Get Care & Resources */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide">
                GET CARE
              </h3>

              {/* Immediate Help Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  Immediate help
                </span>
                <Link to="/prayer" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Prayer
                </Link>
                <Link to="/counseling" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
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
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  Resources
                </span>
                <Link to="/e-resources-center" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  e-Resource Centre
                </Link>
                <Link to="/watch" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Sermons
                </Link>
                <Link to="/podcasts" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Podcasts
                </Link>
                <Link to="/events" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Events
                </Link>
              </div>
            </div>

            {/* Column 4: More & Conferences */}
            <div className="flex flex-col items-start gap-4">
              <h3 className="text-xl font-bold text-white tracking-wide">
                MORE
              </h3>

              {/* Conferences Sub-section */}
              <div className="flex flex-col items-start gap-2">
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  Conferences
                </span>
                <Link to="/fire-conference" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Fire Conference
                </Link>
                <Link to="/superman-conference" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Superman Conference
                </Link>
                <Link to="/camp-yolo" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Camp Yolo
                </Link>
              </div>

              {/* Others Sub-section */}
              <div className="flex flex-col items-start gap-2 pt-2">
                <span className="bg-ff-primary text-ff-primary-text font-semibold text-sm px-3 py-1 rounded-r-lg">
                  Others
                </span>
                <Link to="/contact-us" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Contact Us
                </Link>
                <Link to="/privacy-policy" className="text-lg font-bold text-white hover:text-white/80 transition-colors pl-1">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Footer Bottom Bar */}
          <div className="pt-6 border-t border-white/20 flex items-center justify-between">
            <Link
              to="/socials"
              className="px-6 py-2.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-sm hover:bg-white/90 transition-colors"
            >
              Social Links
            </Link>
            <p className="text-sm font-semibold text-white/90">
              &copy; 2025 Sword & Spirit. All rights reserved.
            </p>
          </div>
        </div>

        {/* MOBILE / TABLET LAYOUT (< 991px) */}
        <div className="block lg:hidden w-full space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mobile Column 1: Core Links */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => console.log('My Dashboard clicked')}
                className="w-[140px] h-9 px-3 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs border border-ff-secondary mb-2"
              >
                My Dashboard
              </button>
              <Link to="/locations" className="text-base font-bold text-white">Locations</Link>
              <Link to="/watch" className="text-base font-bold text-white">Watch</Link>
              <Link to="/about-us" className="text-base font-bold text-white">About</Link>
              <Link to="/care" className="text-base font-bold text-white">Care</Link>
              <Link to="/events" className="text-base font-bold text-white">Events</Link>
              <Link to="/give" className="text-base font-bold text-white">Give</Link>
            </div>

            {/* Mobile Column 2: Partner */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-white tracking-wide">PARTNER WITH US</span>
              <Link to="/be-a-partner" className="text-sm font-bold text-white/90">Be a Partner</Link>
              <Link to="/ministries" className="text-sm font-bold text-white/90">Ministries</Link>
              <Link to="/school-of-ministry" className="text-sm font-bold text-white/90">School of Ministry</Link>
              <Link to="/super-kids" className="text-sm font-bold text-white/90">SuperKids</Link>
              <Link to="/youth" className="text-sm font-bold text-white/90">Youth</Link>
            </div>

            {/* Mobile Column 3: Care */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-white tracking-wide">GET CARE</span>
              <Link to="/prayer" className="text-sm font-bold text-white/90">Prayer</Link>
              <Link to="/counseling" className="text-sm font-bold text-white/90">Counseling</Link>
              <button
                type="button"
                onClick={() => setShowFollowUpModal(true)}
                className="text-sm font-bold text-white/90 text-left"
              >
                Check Ins
              </button>
              <Link to="/e-resources-center" className="text-sm font-bold text-white/90">e-Resource Centre</Link>
              <Link to="/events" className="text-sm font-bold text-white/90">Events</Link>
            </div>

            {/* Mobile Column 4: Conferences & Others */}
            <div className="flex flex-col gap-2">
              <span className="text-base font-bold text-white tracking-wide">CONFERENCES & MORE</span>
              <Link to="/fire-conference" className="text-sm font-bold text-white/90">Fire Conference</Link>
              <Link to="/superman-conference" className="text-sm font-bold text-white/90">Superman Conference</Link>
              <Link to="/camp-yolo" className="text-sm font-bold text-white/90">Camp Yolo</Link>
              <Link to="/contact-us" className="text-sm font-bold text-white/90">Contact Us</Link>
              <Link to="/privacy-policy" className="text-sm font-bold text-white/90">Privacy Policy</Link>
            </div>
          </div>

          {/* Mobile Footer Bottom Bar */}
          <div className="pt-4 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/socials"
              className="px-5 py-2 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs"
            >
              Social Links
            </Link>
            <p className="text-xs font-semibold text-white/90 text-center">
              &copy; 2025 Sword & Spirit. All rights reserved.
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
