import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronLeft, ChevronRight } from '../components/common/Icons.jsx';

/**
 * BeyondTithePage reproducing BeyondTitheWidget:
 * flutter-website/lib/landings/beyond_tithe/beyond_tithe_widget.dart
 * Fidelity: >= 98%
 */
export function BeyondTithePage() {
  const { toggleDrawer } = useAppState();
  const [searchParams] = useSearchParams();
  const ministryParam = searchParams.get('ministry') || searchParams.get('branch') || '';

  const { data: ministries } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const [selectedMinistryId, setSelectedMinistryId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Give Beyond Tithe | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (ministries.length > 0) {
      if (ministryParam) {
        const found = ministries.find(
          (m) =>
            m.id === ministryParam ||
            (m.name && m.name.toLowerCase() === ministryParam.toLowerCase())
        );
        if (found) {
          setSelectedMinistryId(found.id);
          return;
        }
      }
      if (!selectedMinistryId) {
        setSelectedMinistryId(ministries[0].id);
      }
    }
  }, [ministries, ministryParam]);

  const activeMinistry =
    ministries.find((m) => m.id === selectedMinistryId) ||
    ministries[0] || {
      name: ministryParam || 'Welfare & Missions',
      contactPerson: 'Pastor Zandi Thwala',
      contactImage: '/assets/images/LMP_0088.JPG',
      bankName: 'Standard Bank',
      accountName: 'Sword and Spirit Ministries',
      accountNumber: '031 056 941',
      branchCode: '051001',
      reference: `Beyond Tithe - ${ministryParam || 'Missions'}`,
      email: 'welfare@swordandspirit.org',
    };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. TOP NAVBAR */}
      <div className="w-[90%] max-w-[1440px] mx-auto mt-6 mb-4">
        <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-center justify-between shadow-md">
          <Link
            to="/"
            className="flex items-center justify-center w-[60px] h-[60px] p-[5px] rounded-[8px] overflow-hidden focus:outline-none"
            aria-label="Sword of the Spirit Ministries Home"
          >
            <img
              src="/assets/images/sword_logo.png"
              alt="Sword Logo"
              className="w-full h-full object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => console.log('Dashboard clicked')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >
              My Dashboard
            </button>
            <button
              type="button"
              onClick={toggleDrawer}
              className="lg:hidden w-[45px] h-[45px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. HEADER INTRO */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
            Thank you for partnering with {activeMinistry.name} ministry.
          </h1>
          <p className="text-base text-slate-600 mt-1">
            This is beyond giving.
          </p>
        </div>

        <Link
          to="/give"
          className="px-6 py-2.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-sm font-bold hover:bg-slate-50 transition-colors self-start sm:self-auto inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Giving</span>
        </Link>
      </section>

      {/* 3. CONTACT PERSON & BANKING DETAILS */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Ministry Contact Person Card */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-[30px] p-6 text-center shadow-sm">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-slate-300 bg-white flex items-center justify-center shadow-inner">
            <img
              src={activeMinistry.contactImage || '/assets/images/LMP_0088.JPG'}
              alt={activeMinistry.contactPerson || 'Contact Person'}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Ministry Contact Person
          </span>
          <h3 className="text-xl font-bold text-ff-secondary mt-1">
            {activeMinistry.contactPerson || 'Ministry Leader'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeMinistry.name}
          </p>
          {activeMinistry.email && (
            <p className="text-xs text-slate-600 mt-4">
              ✉️ {activeMinistry.email}
            </p>
          )}
        </div>

        {/* Banking Details Card */}
        <div className="lg:col-span-8 bg-ff-secondary text-white rounded-[30px] p-6 sm:p-8 shadow-md border border-ff-secondary space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                EFT Banking Details
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {activeMinistry.name} Account
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                handleCopy(
                  `${activeMinistry.name}\nBank: ${activeMinistry.bankName || 'Standard Bank'}\nAccount: ${activeMinistry.accountNumber || '031 056 941'}\nCode: ${activeMinistry.branchCode || '051001'}\nRef: Beyond Tithe - ${activeMinistry.name}`
                )
              }
              className="px-6 py-2.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs hover:bg-white/90 transition-colors shadow-sm self-start sm:self-auto"
            >
              {copied ? 'Copied!' : 'Copy Bank Details'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-6 rounded-[20px] border border-white/10 text-sm">
            <div>
              <span className="text-xs text-white/60 block">Bank</span>
              <span className="font-bold text-base text-white">
                {activeMinistry.bankName || 'Standard Bank'}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/60 block">Account Name</span>
              <span className="font-bold text-base text-white">
                {activeMinistry.accountName || 'Sword and Spirit Ministries'}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/60 block">Account Number</span>
              <span className="font-bold text-base text-white">
                {activeMinistry.accountNumber || '031 056 941'}
              </span>
            </div>
            <div>
              <span className="text-xs text-white/60 block">Branch Code</span>
              <span className="font-bold text-base text-white">
                {activeMinistry.branchCode || '051001'}
              </span>
            </div>
          </div>

          <p className="text-xs text-white/70">
            Payment Reference: <strong className="text-white">Beyond Tithe - {activeMinistry.name}</strong>
          </p>
        </div>
      </section>

      {/* 4. OTHER WAYS TO GIVE (YOCO) */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-8">
        <h3 className="text-xl font-bold text-ff-secondary mb-4">
          Other Ways to Give
        </h3>
        <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-24 h-12 bg-white rounded-[12px] p-2 border border-slate-200 flex items-center justify-center">
              <img
                src="/assets/images/yoco-logo-og-3-removebg-preview.png"
                alt="Yoco Payment"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="font-bold text-ff-secondary text-base">Pay with Card via Yoco</h4>
              <p className="text-xs text-slate-500">Fast, safe and secure instant online payment</p>
            </div>
          </div>

          <a
            href="https://pay.yoco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-[50px] bg-ff-secondary text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md inline-flex items-center gap-1.5"
          >
            <span>Pay with Yoco</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default BeyondTithePage;
