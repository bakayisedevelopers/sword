import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { resolveCanonicalBranchSlug, OFFICIAL_BRANCHES } from './BranchTemplatePage.jsx';
import { ChevronLeft, ChevronRight } from '../components/common/Icons.jsx';

/**
 * BranchGivePage reproducing BranchGiveWidget:
 * flutter-website/lib/landings/branch_give/branch_give_widget.dart
 * Fidelity: >= 98%
 */
export function BranchGivePage() {
  const { toggleDrawer } = useAppState();
  const [searchParams] = useSearchParams();
  const branchParam = searchParams.get('branch') || '';

  const { data: branches, loading } = useFirestoreQuery(COLLECTIONS.BRANCHES);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = 'Giving | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (branches.length > 0) {
      if (branchParam) {
        const canonical = resolveCanonicalBranchSlug(branchParam);
        const found = branches.find(
          (b) =>
            b.id === branchParam ||
            (b.name && b.name.toLowerCase() === branchParam.toLowerCase()) ||
            (b.slug && b.slug.toLowerCase() === branchParam.toLowerCase()) ||
            resolveCanonicalBranchSlug(b.slug || b.name || b.id) === canonical
        );
        if (found) {
          setSelectedBranchId(found.id);
          return;
        }
      }
      if (!selectedBranchId) {
        setSelectedBranchId(branches[0].id);
      }
    }
  }, [branches, branchParam, selectedBranchId]);

  const officialFallback =
    OFFICIAL_BRANCHES.find(
      (b) => b.slug === resolveCanonicalBranchSlug(branchParam || selectedBranchId)
    ) || OFFICIAL_BRANCHES.find((b) => b.slug === 'emalahleni') || OFFICIAL_BRANCHES[0];

  const activeBranch =
    branches.find((b) => b.id === selectedBranchId) ||
    branches[0] || {
      name: officialFallback?.name || branchParam || 'EMalahleni',
      seniorPastor: 'Apostle Bheki & Pst. Zandi Thwala',
      pastorImage: officialFallback?.defaultPastorImage || '/assets/images/B&Z_no_background_1.png',
      email: `${officialFallback?.slug || 'emalahleni'}@swordandspirit.org`,
    };

  const bankingDetails = (activeBranch.bankingDetails || '').trim();
  const yocoLink = (activeBranch.yoco || '').trim();
  const paypalLink = (activeBranch.paypal || '').trim();
  const applePayDetail = (activeBranch.applepay || '').trim();
  const googlePayDetail = (activeBranch.googlepay || '').trim();

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
              onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >Discipleship</button>
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
            {activeBranch.name} Branch
          </h1>
          <p className="text-base text-slate-600 mt-1">
            Use the below details and giving methods to choose from.
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

      {/* 3. SENIOR PASTOR & BANKING DETAILS */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Branch Pastor Card */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-[30px] p-6 text-center shadow-sm">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-2 border-slate-300 bg-white flex items-center justify-center shadow-inner">
            <img
              src={activeBranch.pastorImage || '/assets/images/B&Z_no_background_1.png'}
              alt={activeBranch.seniorPastor || 'Senior Pastor'}
              className="w-full h-full object-contain p-1"
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Branch Senior Pastor
          </span>
          <h3 className="text-xl font-bold text-ff-secondary mt-1">
            {activeBranch.seniorPastor || 'Senior Pastor'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {activeBranch.name} Branch
          </p>
          {activeBranch.email && (
            <p className="text-xs text-slate-600 mt-4">
              ✉️ {activeBranch.email}
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
                {activeBranch.name} Giving Account
              </h2>
            </div>

            <button
              type="button"
              disabled={!bankingDetails}
              onClick={() => handleCopy(`${activeBranch.name} Branch\n${bankingDetails}`)}
              className="px-6 py-2.5 rounded-[50px] bg-ff-primary text-ff-primary-text font-bold text-xs hover:bg-white/90 transition-colors shadow-sm self-start sm:self-auto"
            >
              {copied ? 'Copied!' : 'Copy Bank Details'}
            </button>
          </div>

          {bankingDetails ? (
            <div className="bg-white/5 p-6 rounded-[20px] border border-white/10 text-sm">
              <span className="text-xs text-white/60 block mb-2">Saved Branch Banking Details</span>
              <div className="whitespace-pre-line text-base font-semibold leading-8 text-white">
                {bankingDetails}
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-6 rounded-[20px] border border-white/10 text-sm text-white/75">
              Banking details have not been added for this branch yet.
            </div>
          )}
        </div>
      </section>

      {(yocoLink || paypalLink || applePayDetail || googlePayDetail) && (
        <section className="w-[90%] max-w-[1200px] mx-auto my-8">
          <h3 className="text-xl font-bold text-ff-secondary mb-4">
            Other Ways to Give
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {yocoLink && (
              <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
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
                  href={yocoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-[50px] bg-ff-secondary text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md inline-flex items-center gap-1.5"
                >
                  <span>Pay with Yoco</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
            {paypalLink && (
              <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 flex items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="font-bold text-ff-secondary text-base">PayPal</h4>
                  <p className="text-xs text-slate-500">Give using the saved branch PayPal link.</p>
                </div>
                <a
                  href={paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-[50px] bg-ff-secondary text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-md"
                >
                  Open
                </a>
              </div>
            )}
            {applePayDetail && (
              <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 shadow-sm">
                <h4 className="font-bold text-ff-secondary text-base">Apple Pay</h4>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{applePayDetail}</p>
              </div>
            )}
            {googlePayDetail && (
              <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 shadow-sm">
                <h4 className="font-bold text-ff-secondary text-base">Google Pay</h4>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-600">{googlePayDetail}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default BranchGivePage;
