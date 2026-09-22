import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { formatBranchSlug } from '../lib/format.js';
import { launchUrl } from '../lib/urls.js';
import { ChevronRight } from '../components/common/Icons.jsx';

function textValue(value = '') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value.path === 'string') return value.path.split('/').pop() || value.path;
  if (typeof value.id === 'string') return value.id;
  if (typeof value.name === 'string') return value.name;
  return '';
}

/**
 * LocationsPage migrating LocationsWidget:
 * flutter-website/lib/main_pages/locations/locations_widget.dart
 *
 * Reproduces:
 * - Desktop Hero with Locations_(2).png and embedded desktop header.
 * - Mobile Hero with Locations.png and embedded mobile header.
 * - "Our Branches" full-width dark section.
 * - Dynamic branch listing from Firestore 'branches' sorted alphabetically.
 * - Responsive 3/2/1 column card grid with 20px gap.
 * - Global SiteFooter.
 */
export function LocationsPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'Our Locations | Sword of the Spirit Ministries';
  }, []);

  // Fetch branches from Firestore in real-time
  const { data: rawBranches, loading, error } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  // Alphabetical sort matching Flutter line 102:
  // left.name.toLowerCase().compareTo(right.name.toLowerCase())
  const branches = [...(rawBranches || [])].sort((a, b) =>
    textValue(a.name).toLowerCase().localeCompare(textValue(b.name).toLowerCase())
  );

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
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero Banner (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        {/* Hero Background Image */}
        <img
          src="/assets/images/Locations_(2).png"
          alt="Locations Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Desktop Header at Top of Hero */}
        <div className="relative z-10 w-full p-5">
          <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-center justify-between shadow-md">
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
                const active = item.path === '/locations';
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                      active
                        ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                        : 'bg-transparent text-white border-ff-primary hover:bg-white/10'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Dashboard button */}
            <div>
              <button
                type="button"
                onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >Discipleship</button>
            </div>
          </div>
        </div>
      </div>

      {/* 1B. Mobile Hero Banner (< 991px) */}
      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        {/* Mobile Hero Background Image */}
        <img
          src="/assets/images/Locations.png"
          alt="Locations Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded tablet-landscape header at top of mobile hero (767px-990px) */}
        <div className="relative z-10 hidden md:block lg:hidden w-screen p-5">
          <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-start justify-between shadow-[0_0_300px_10px_#192431]">
            <Link
              to="/"
              className="flex shrink-0 items-center justify-center w-[70px] h-[70px] p-[5px] rounded-[8px] overflow-hidden focus:outline-none"
              aria-label="Sword of the Spirit Ministries Home"
            >
              <img
                src="/assets/images/sword_logo.png"
                alt="Sword Logo"
                className="w-full h-full object-fill"
              />
            </Link>

            <nav className="flex items-start justify-end gap-[3px] pt-[15px]">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center bg-transparent text-white border border-ff-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary transition-colors"
              >Discipleship</button>
            </nav>
          </div>
        </div>

        {/* Embedded phone/tablet header at top of mobile hero (<767px) */}
        <div className="relative z-10 block md:hidden w-full p-2.5">
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

            {/* Dashboard button & Menu Button */}
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

      {/* 2. "OUR BRANCHES" TITLE SECTION */}
      {/* Flutter lines 1864-2001: Expanded -> Padding top 50 -> Container secondary color */}
      <section className="w-full bg-ff-secondary mt-[50px] p-[10px]">
        <div className="w-full max-w-[1100px] mx-auto py-[20px] px-[10px] text-center flex flex-col items-center justify-center">
          <h2 className="text-white font-bold text-[20px] sm:text-[30px] leading-tight">
            Our Branches
          </h2>
          <p className="text-white text-[20px] pt-[10px] leading-relaxed">
            Explore our branches and online church family.
          </p>
        </div>
      </section>

      {/* 3. DYNAMIC BRANCHES LIST SECTION */}
      {/* Flutter lines 70-137: _dynamicBranchesSection */}
      <section className="w-full py-[20px]">
        <div className="w-[90%] max-w-[900px] mx-auto rounded-[24px] bg-white border border-slate-200 overflow-hidden shadow-sm">
          {/* Loading State */}
          {loading && (
            <div className="p-[40px] flex items-center justify-center">
              <LoadingSpinner size={40} color="#192431" />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 text-center text-slate-600 font-medium">
              <p>Branches could not be loaded right now.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && branches.length === 0 && (
            <div className="p-8 text-center text-slate-600 font-medium">
              <p>No branches are available yet.</p>
            </div>
          )}

          {!loading && !error && branches.length > 0 && (
            <div className="divide-y divide-slate-200">
              {branches.map((branch) => {
                const slug = formatBranchSlug(branch);
                const branchName = textValue(branch.name).trim();
                const branchLocation = textValue(branch.location).trim();
                const isOnline = branchName.toLowerCase() === 'online';
                const hasDirections =
                  !isOnline && (Boolean(branch.locationPIN) || Boolean(branchLocation));

                const openDirections = (event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const pin = branch.locationPIN;
                  if (pin && (pin.latitude != null || pin._latitude != null)) {
                    const lat = pin.latitude ?? pin._latitude;
                    const lng = pin.longitude ?? pin._longitude;
                    launchUrl(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
                    return;
                  }
                  if (branchLocation) {
                    launchUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchLocation)}`);
                  }
                };

                return (
                  <Link
                    key={branch.id || branch.name}
                    to={slug ? `/${slug}` : '/locations'}
                    className="flex items-center justify-between gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-lg font-bold text-ff-secondary">
                        {branchName || 'Branch'}
                      </span>
                      {(branch.country || branchLocation) && (
                        <span className="mt-0.5 block truncate text-sm text-slate-500">
                          {[textValue(branch.country), branchLocation].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {hasDirections && (
                        <button
                          type="button"
                          onClick={openDirections}
                          className="hidden rounded-full border border-ff-secondary px-4 py-2 text-xs font-bold text-ff-secondary transition-colors hover:bg-ff-secondary hover:text-white sm:inline-flex"
                        >
                          Directions
                        </button>
                      )}
                      <ChevronRight className="h-5 w-5 text-ff-secondary" strokeWidth={2.5} />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default LocationsPage;
