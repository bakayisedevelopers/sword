import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx';

/**
 * MinistryPage matching FlutterFlow:
 * flutter-website/lib/landings/ministry/ministry_widget.dart
 */
export function MinistryPage() {
  const [searchParams] = useSearchParams();
  const ministryId = searchParams.get('id') || searchParams.get('name') || '';
  const { toggleDrawer } = useAppState();

  const [selectedBranch, setSelectedBranch] = useState('-- Select Branch --');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: ministries, loading } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const ministry =
    ministries.find(
      (m) =>
        m.id === ministryId ||
        (m.name && m.name.toLowerCase() === ministryId.toLowerCase())
    ) || ministries[0] || null;

  const ministryName = ministry?.name || 'Ministry';

  useEffect(() => {
    document.title = `${ministryName} | Sword of the Spirit Ministries`;
  }, [ministryName]);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const defaultOfficialBranches = [
    'Online',
    'Mbabane',
    'Siteki',
    'Hlutsi',
    'Ludzeludze',
    'EMalahleni',
    'Boksburg',
    'Orange Farm',
    'Lagos',
  ];

  const { data: dbBranches } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  const branchesList = React.useMemo(() => {
    if (ministry?.branches && Array.isArray(ministry.branches) && ministry.branches.length > 0) {
      return ministry.branches;
    }
    if (dbBranches && dbBranches.length > 0) {
      const names = dbBranches.map((b) => b.name || b.id).filter(Boolean);
      return Array.from(new Set(names));
    }
    return defaultOfficialBranches;
  }, [ministry?.branches, dbBranches]);

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      {/* Back to Ministries navigation header */}
      <div className="w-[90%] max-w-[1440px] mx-auto pt-6 pb-2 flex items-center justify-between">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 text-sm md:text-base font-semibold text-ff-secondary hover:text-ff-alternate transition-colors"
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
          <span className="hidden sm:inline">Back to Ministries</span>
          <span className="sm:hidden">Back</span>
        </Link>
      </div>

      {/* 1. HERO BANNER */}
      {/* Desktop Hero */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-2 mb-6 h-[450px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src={ministry?.image || '/assets/images/Minstries_(2).png'}
          alt={`${ministryName} Banner`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

        <div className="absolute bottom-8 left-10 z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">
            FEWDS Ministry
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-2 drop-shadow-md">
            {ministryName}
          </h1>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="block lg:hidden w-[90%] mx-auto mt-2 mb-6 h-[380px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src={ministry?.image || '/assets/images/Minstries.png'}
          alt={`${ministryName} Banner`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

        <div className="absolute bottom-6 left-6 right-6 z-10">
          <h1 className="text-2xl font-bold text-white">
            {ministryName}
          </h1>
        </div>
      </div>

      {/* 2. MAIN CONTENT CARD */}
      <main className="w-[90%] max-w-[1440px] mx-auto my-6 flex-1">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner size={36} color="#192431" />
          </div>
        ) : (
          <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-8">
            {/* Top row: Ministry Name and Branch selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
                {ministryName}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="h-10 px-4 rounded-[10px] border border-ff-secondary bg-white text-ff-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ff-secondary cursor-pointer"
                >
                  <option value="-- Select Branch --">-- Select Branch --</option>
                  {branchesList.map((branch, idx) => (
                    <option key={idx} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle row: Contact Person & Meeting Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Contact Person column */}
              <div className="md:col-span-5 bg-slate-50/70 p-6 rounded-[20px] border border-slate-200 space-y-4">
                <h3 className="text-xl font-bold text-ff-secondary">Contact Person</h3>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-ff-secondary text-white flex items-center justify-center shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-ff-secondary text-base">
                      {ministry?.contactName || ministry?.leaderName || 'Ministry Coordinator'}
                    </div>
                    {ministry?.contactEmail && (
                      <div>
                        <a
                          href={`mailto:${ministry.contactEmail}`}
                          className="text-sm text-blue-600 hover:underline break-all"
                        >
                          {ministry.contactEmail}
                        </a>
                      </div>
                    )}
                    {ministry?.contactWhatsApp && (
                      <div>
                        <a
                          href={`https://wa.me/${ministry.contactWhatsApp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-emerald-700 hover:underline flex items-center gap-1 mt-1"
                        >
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                          </svg>
                          WhatsApp: {ministry.contactWhatsApp}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Meeting Details column */}
              <div className="md:col-span-7 bg-slate-50/70 p-6 rounded-[20px] border border-slate-200 space-y-2">
                <h3 className="text-xl font-bold text-ff-secondary">Meeting Details</h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  {ministry?.meetingDetails ||
                    ministry?.meetingTimes ||
                    'Gatherings and rehearsal schedules are coordinated bi-weekly and monthly across all participating SSMI branches.'}
                </p>
              </div>
            </div>

            {/* Serving Details section */}
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h3 className="text-xl font-bold text-ff-secondary">Serving Details</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {ministry?.servingDetails ||
                  ministry?.description ||
                  'Serving in this ministry offers an enriching opportunity to cultivate your spiritual gifts, build lifelong fellowship, and contribute to the dominion of Jesus Christ.'}
              </p>
            </div>

            {/* Sign Up to Serve Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSignUpOpen(true)}
                className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
              >
                Sign Up to Serve
              </button>
            </div>
          </div>
        )}
      </main>

      {/* SignUpModal */}
      {isSignUpOpen && (
        <SignUpModal
          onClose={() => setIsSignUpOpen(false)}
          defaultMinistry={ministryName}
          defaultDepartment={ministry?.FEWDS || ministry?.fewds || ''}
          defaultBranch={selectedBranch !== '-- Select Branch --' ? selectedBranch : ''}
        />
      )}

      {/* 3. SITE FOOTER */}
      <SiteFooter />

      {/* 4. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default MinistryPage;
