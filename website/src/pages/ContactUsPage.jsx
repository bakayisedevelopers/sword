import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { COLLECTIONS, createRecord } from '../lib/firestore.js';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { QuickActionButtons } from '../components/common/QuickActionButtons.jsx';

/**
 * ContactUsPage reproducing ContactUsWidget:
 * flutter-website/lib/actions/contact_us/contact_us_widget.dart
 * Fidelity: >= 98%
 */
export function ContactUsPage() {
  const { toggleDrawer } = useAppState();

  const [selectedBranch, setSelectedBranch] = useState('Online');
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [message, setMessage] = useState('');
  const [formBranch, setFormBranch] = useState('Online');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { data: rawBranches = [] } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  useEffect(() => {
    document.title = 'Contact Us | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const branches = [...rawBranches]
    .filter((branch) => branch.name)
    .sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()));

  useEffect(() => {
    if (branches.length === 0) return;
    if (!branches.some((branch) => branch.name === selectedBranch)) {
      setSelectedBranch(branches[0].name);
      setFormBranch(branches[0].name);
    }
  }, [branches, selectedBranch]);

  const activeBranch = branches.find((branch) => branch.name === selectedBranch) || branches[0] || null;
  const activeContact = {
    email: (activeBranch?.email || '').trim(),
    phone: (activeBranch?.phone_number || activeBranch?.phoneNumber || activeBranch?.phone || '').trim(),
    whatsapp: (activeBranch?.whatsapp || '').trim(),
    facebook: (activeBranch?.facebook || '').trim(),
    instagram: (activeBranch?.instagram || '').trim(),
    youtube: (activeBranch?.youtube || '').trim(),
    website: (activeBranch?.website || '').trim(),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !cell.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: name.trim(),
        cell: cell.trim(),
        branch: formBranch,
        message: message.trim(),
        requestType: 'Contact',
        date: new Date(),
      });
      setName('');
      setCell('');
      setMessage('');
      setShowSuccess(true);
    } catch (err) {
      console.error('Error submitting contact message:', err);
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
          src="/assets/images/ContactUs_(2).png"
          alt="Contact Us Banner"
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
      </div>

      {/* 1B. Mobile Hero (< 991px) */}
      <div className="block lg:hidden w-[92%] max-w-[420px] mx-auto mt-[20px] mb-[20px] h-[520px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/ContactUs.png"
          alt="Contact Us Banner Mobile"
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
                onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
                className="h-9 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >Discipleship</button>
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

      {/* 2. CHOOSE BRANCH TO VIEW SOCIAL & CONTACT LINKS */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Contact {selectedBranch}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Choose a branch to see the contact and social links saved for that branch.
          </p>
        </div>

        {/* Branch Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {branches.map((b) => (
            <button
              key={b.id || b.name}
              type="button"
              onClick={() => {
                setSelectedBranch(b.name);
                setFormBranch(b.name);
              }}
              className={`px-5 py-2.5 rounded-[50px] text-xs sm:text-sm font-bold transition-colors ${
                selectedBranch === b.name
                  ? 'bg-ff-secondary text-white shadow-md'
                  : 'bg-slate-100 text-ff-secondary hover:bg-slate-200'
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Active Branch Contact Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-[24px] p-6 sm:p-8 max-w-2xl mx-auto text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-ff-secondary">
            {selectedBranch} Contact / Social Links
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            {activeContact.email && (
              <a
                href={`mailto:${activeContact.email}`}
                className="flex items-center gap-2 text-ff-secondary font-medium hover:underline"
              >
                Email: {activeContact.email}
              </a>
            )}
            {activeContact.email && activeContact.phone && <span className="hidden sm:inline text-slate-300">•</span>}
            {activeContact.phone && (
              <a
                href={`tel:${activeContact.phone}`}
                className="flex items-center gap-2 text-ff-secondary font-medium hover:underline"
              >
                Phone: {activeContact.phone}
              </a>
            )}
          </div>

          <div className="pt-2 flex max-w-full flex-wrap items-center justify-center gap-3 overflow-hidden">
            {activeContact.whatsapp && (
              <a href={activeContact.whatsapp} target="_blank" rel="noopener noreferrer" className="max-w-full px-4 py-2 rounded-[50px] bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors">WhatsApp</a>
            )}
            {activeContact.facebook && (
              <a href={activeContact.facebook} target="_blank" rel="noopener noreferrer" className="max-w-full px-4 py-2 rounded-[50px] bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">Facebook</a>
            )}
            {activeContact.instagram && (
              <a href={activeContact.instagram} target="_blank" rel="noopener noreferrer" className="max-w-full px-4 py-2 rounded-[50px] bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors">Instagram</a>
            )}
            {activeContact.youtube && (
              <a href={activeContact.youtube} target="_blank" rel="noopener noreferrer" className="max-w-full px-4 py-2 rounded-[50px] bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors">YouTube</a>
            )}
            {activeContact.website && (
              <a href={activeContact.website} target="_blank" rel="noopener noreferrer" className="max-w-full px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors">Website</a>
            )}
          </div>

          {!activeContact.email && !activeContact.phone && !activeContact.whatsapp && !activeContact.facebook && !activeContact.instagram && !activeContact.youtube && !activeContact.website && (
            <p className="pt-2 border-t border-slate-200 text-xs text-slate-500">
              Contact details have not been added for this branch yet.
            </p>
          )}
        </div>
      </section>

      {/* 3. REACH OUT / LEAVE A MESSAGE SECTION */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 bg-white border border-ff-secondary rounded-[30px] p-6 sm:p-12 shadow-sm">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Reach Out
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1">
            Leave a Message
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 h-[340px] sm:h-[400px] rounded-[24px] overflow-hidden bg-slate-100 flex items-center justify-center">
            <img
              src="/assets/images/Contact_Us.png"
              alt="Leave a Message"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-7">
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
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  >
                    {branches.map((b) => (
                      <option key={b.id || b.name} value={b.name}>
                        {b.name}
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
                  placeholder="How can we assist you?"
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

      {/* 4. NEXT STEPS / ACTION CARDS (6 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Take Your Next Step
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mt-1">
            Where Are You on Your Journey?
          </h2>
        </div>

        <div className="mx-auto w-full max-w-[560px]">
          <QuickActionButtons />
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

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default ContactUsPage;
