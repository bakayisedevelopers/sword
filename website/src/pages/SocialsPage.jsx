import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * SocialsPage matching FlutterFlow:
 * flutter-website/lib/landings/socials/socials_widget.dart
 */
export function SocialsPage() {
  const { toggleDrawer } = useAppState();
  const { data: branches } = useFirestoreQuery(COLLECTIONS.BRANCHES);

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

  const [selectedBranchName, setSelectedBranchName] = useState('Online');

  useEffect(() => {
    document.title = 'Socials | Sword of the Spirit Ministries';
  }, []);

  const branchOptions = branches && branches.length > 0
    ? Array.from(new Set(branches.map((b) => b.name || b.id).filter(Boolean)))
    : defaultOfficialBranches;

  const branch =
    (branches && branches.length > 0
      ? branches.find(
          (b) => (b.name && b.name.toLowerCase() === selectedBranchName.toLowerCase()) ||
                 (b.slug && b.slug.toLowerCase() === selectedBranchName.toLowerCase()) ||
                 (b.id && b.id.toLowerCase() === selectedBranchName.toLowerCase())
        ) || branches[0]
      : null) || {
        name: selectedBranchName || 'Online',
        email: 'info@swordandspirit.org',
        whatsapp: '+26876000000',
        instagram: 'https://instagram.com/ssmi',
        facebook: 'https://facebook.com/ssmi',
        youtube: 'https://youtube.com/ssmi',
      };

  const branchName = branch?.name || selectedBranchName;

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
            onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
            className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
          >Discipleship</button>
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

      {/* Main Container */}
      <main className="w-[90%] max-w-[1440px] mx-auto my-4 flex-1 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
              Socials
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Connect directly with our leadership, campus broadcasts, and local branch ministries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-ff-secondary">Select Branch:</span>
            <select
              value={selectedBranchName}
              onChange={(e) => setSelectedBranchName(e.target.value)}
              className="h-10 px-4 rounded-[12px] border border-ff-secondary bg-white text-ff-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ff-secondary cursor-pointer"
            >
              {branchOptions.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Branch Card */}
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            {branchName} Contact/Social Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Email */}
            {branch?.email && (
              <a
                href={`mailto:${branch.email}`}
                className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Email</div>
                  <div className="font-semibold text-sm sm:text-base text-ff-secondary break-all">{branch.email}</div>
                </div>
              </a>
            )}

            {/* WhatsApp */}
            {branch?.whatsapp && (
              <a
                href={`https://wa.me/${branch.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">WhatsApp</div>
                  <div className="font-semibold text-sm sm:text-base text-ff-secondary">{branch.whatsapp}</div>
                </div>
              </a>
            )}

            {/* Instagram */}
            {branch?.instagram && (
              <a
                href={branch.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Instagram</div>
                  <div className="font-semibold text-sm sm:text-base text-ff-secondary">Follow @SSMI</div>
                </div>
              </a>
            )}

            {/* Facebook */}
            {branch?.facebook && (
              <a
                href={branch.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Facebook</div>
                  <div className="font-semibold text-sm sm:text-base text-ff-secondary">Visit Page</div>
                </div>
              </a>
            )}

            {/* YouTube */}
            {branch?.youtube && (
              <a
                href={branch.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-[20px] bg-slate-50 border border-slate-200 flex items-center gap-4 hover:bg-slate-100 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">YouTube</div>
                  <div className="font-semibold text-sm sm:text-base text-ff-secondary">Subscribe</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Global Mail Card */}
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-ff-secondary">Global Mail</h2>
            <p className="text-sm sm:text-base text-slate-600">
              For general inquiries, apostolic correspondence, or partnership requests:
            </p>
          </div>
          <a
            href="mailto:global@swordandspirit.org"
            className="px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm shrink-0"
          >
            Email: global@swordandspirit.org
          </a>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter />

      {/* MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default SocialsPage;
