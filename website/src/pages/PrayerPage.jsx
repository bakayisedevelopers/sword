import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { COLLECTIONS, createRecord } from '../lib/firestore.js';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * PrayerPage reproducing PrayerWidget:
 * flutter-website/lib/actions/prayer/prayer_widget.dart
 * Fidelity: >= 98%
 */
export function PrayerPage() {
  const { toggleDrawer } = useAppState();

  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [branch, setBranch] = useState('EMalahleni');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  useEffect(() => {
    document.title = 'Join or Get Prayer | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const branchList = [
    'Mbabane',
    'Siteki',
    'Hlutsi',
    'Ludzeludze',
    'EMalahleni',
    'Boksburg',
    'Orange Farm',
    'Lagos',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !cell.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: name.trim(),
        cell: cell.trim(),
        branch: branch,
        message: message.trim(),
        requestType: 'Prayer',
        date: new Date(),
      });
      setName('');
      setCell('');
      setMessage('');
      setShowSuccess(true);
    } catch (err) {
      console.error('Error submitting prayer request:', err);
    } finally {
      setSubmitting(false);
    }
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
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Prayer_(2).png"
          alt="Prayer Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Desktop Header */}
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
                  className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                    item.path === '/care'
                      ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                      : 'bg-transparent text-white border-ff-primary hover:bg-white/10'
                  }`}
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

      {/* 1B. Mobile Hero (< 991px) */}
      <div className="block lg:hidden w-[92%] max-w-[420px] mx-auto mt-[20px] mb-[20px] h-[520px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Prayer.png"
          alt="Prayer Banner Mobile"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Embedded Mobile Header */}
        <div className="relative z-10 w-full p-3">
          <div className="w-full bg-ff-secondary rounded-[20px] p-2.5 flex items-center justify-between border border-transparent shadow-[0_0_30px_rgba(25,36,49,0.5)]">
            <Link
              to="/"
              className="w-[45px] h-[45px] rounded-full overflow-hidden flex items-center justify-center focus:outline-none"
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
                className="h-9 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="w-[45px] h-[45px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
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

      {/* 2. PROPHETIC PRAYER INTRO */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ff-secondary leading-relaxed max-w-3xl mx-auto">
          Sword and Spirit is a prophetic house, and without prayer there's no prophetic.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
          We have different types of prayers throughout our different branches.
        </p>
      </section>

      {/* 3. PRAYER PILLARS (2 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Pre-service Prayer */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-[240px] w-full overflow-hidden">
              <img
                src="/assets/images/IMG-20250620-WA0007.jpg"
                alt="Pre-service Prayer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-2xl font-bold text-ff-secondary mb-1">
                  Pre-service Prayer
                </h3>
                <span className="text-sm font-bold text-ff-alternate block mb-4">
                  Every Sunday
                </span>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Join our intercessory teams before service starts as we prepare the spiritual atmosphere for the move of the Word and Spirit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSignUpOpen(true)}
                className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Join the Team
              </button>
            </div>
          </div>

          {/* Card 2: Global Prayer Chain */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="h-[240px] w-full overflow-hidden">
              <img
                src="/assets/images/WhatsApp_Prayer.png"
                alt="Global Prayer Chain"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-2xl font-bold text-ff-secondary mb-1">
                  Global Prayer Chain
                </h3>
                <span className="text-sm font-bold text-ff-alternate block mb-4">
                  24/7
                </span>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Connect with intercessors from South Africa, Eswatini, Nigeria, and around the world on our active prayer WhatsApp network.
                </p>
              </div>
              <a
                href="https://chat.whatsapp.com/Bmk4moODVzEC2psvFqbRZm?mode=ac_t"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                WhatsApp Goup
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUBMIT A PRAYER REQUEST FORM */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 bg-slate-50 rounded-[30px] p-6 sm:p-12 border border-slate-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 h-[360px] sm:h-[450px] rounded-[24px] overflow-hidden shadow-md">
            <img
              src="/assets/images/rawpixel-558597-unsplash.jpg"
              alt="Submit Prayer Request"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                Need Intercession?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1">
                Submit a Prayer Request
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Name and Surname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Cell Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +27 82 123 4567"
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Branch *
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  >
                    {branchList.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we pray with you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-ff-secondary mb-1">Success!!</h3>
            <p className="text-sm text-slate-600 mb-6">Message sent.</p>
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* JOIN TEAM MODAL */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        defaultMinistry="Intercessory Prayer Team"
      />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default PrayerPage;
