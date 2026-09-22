import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS, createRecord } from '../lib/firestore.js';
import { Input } from '../components/ui/Input.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Dialog } from '../components/ui/Dialog.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * CounselingPage matching FlutterFlow:
 * flutter-website/lib/ministries/counseling/counseling_widget.dart
 */
export function CounselingPage() {
  const { toggleDrawer } = useAppState();
  const { data: branches } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  const [activeModalType, setActiveModalType] = useState(null);
  const [name, setName] = useState('');
  const [cell, setCell] = useState('');
  const [branch, setBranch] = useState('');
  const [topic, setTopic] = useState('Individual Counseling');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    document.title = 'Counseling | Sword of the Spirit Ministries';
  }, []);

  const branchOptions = branches.map((b) => ({
    label: b.name || 'Branch',
    value: b.name || b.id,
  }));

  const topicOptions = [
    { label: 'Individual Counseling', value: 'Individual Counseling' },
    { label: 'Pre-Marital Counseling', value: 'Pre-Marital Counseling' },
    { label: 'Marriage Counseling', value: 'Marriage Counseling' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !cell.trim() || !message.trim()) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: name.trim(),
        cell: cell.trim(),
        branch: branch || 'General',
        topic,
        message: message.trim(),
        type: 'Counseling',
        date: new Date(),
      });
      setName('');
      setCell('');
      setMessage('');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error booking counseling:', err);
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
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      {/* 1. HERO SECTION */}
      {/* Desktop Hero */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Counselling_(2).png"
          alt="Counseling Banner"
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
              onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >Discipleship</button>
          </div>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Counselling.png"
          alt="Counseling Banner"
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

      {/* 2. HEADER INTRO */}
      <section className="w-[90%] max-w-[1440px] mx-auto mt-12 mb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-5xl font-bold text-ff-secondary">
            Counseling
          </h1>
          <p className="text-base sm:text-lg text-slate-700 mt-3 leading-relaxed">
            Sword and Spirit provides couseling for 3 different types of counselings, these counseling will be able to meet every counseling need you need for your relationships and even individual bases.
          </p>
        </div>
      </section>

      {/* 3. THREE COUNSELING CARDS (Matching exact images and copy) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Pre Marital Counseling */}
        <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-[240px] w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/Premarital.png"
                alt="Pre Marital Counseling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-ff-secondary">Pre Marital Counseling</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Are you planning on getting marriade soon, premarital counseling is your next step. In this counseling you will dive deep into what makes a christian marriage successful and you will be equiped with all the tools you need for a successful marriage.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <button
              type="button"
              onClick={() => setActiveModalType('Pre-Marital Counseling')}
              className="w-full py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
            >
              <span>Book Counseling</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Marriage Counseling */}
        <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-[240px] w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/Marriage_Counselling.png"
                alt="Marriage Counseling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-ff-secondary">Marriage Counseling</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Are you facing any form of struggles in your marriage, book an appointment with Pst. Zandi, in can be online or in person.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <button
              type="button"
              onClick={() => setActiveModalType('Marriage Counseling')}
              className="w-full py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
            >
              <span>Book Counseling</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 3: Individual Counseling */}
        <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="h-[240px] w-full overflow-hidden bg-slate-100">
              <img
                src="/assets/images/Counselling_Individual.png"
                alt="Individual Counseling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 space-y-3">
              <h3 className="text-2xl font-bold text-ff-secondary">Individual Counseling</h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                Are you facing any personal struggles in your life and need help?
                {'\n'}
                Book a couseling for yourself and get the help you need.
                {'\n\n'}
                This can also be online or in person.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <button
              type="button"
              onClick={() => setActiveModalType('Individual Counseling')}
              className="w-full py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center justify-center gap-1.5"
            >
              <span>Book Counseling</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOOKING FORM SECTION */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="bg-white rounded-[30px] border border-ff-secondary p-6 sm:p-12 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
              Book a Confidential Session
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Complete the form below and our pastoral care coordinator will contact you promptly.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Contact Number (WhatsApp enabled) *"
              placeholder="+27 82 123 4567"
              value={cell}
              onChange={(e) => setCell(e.target.value)}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="SSMI Branch"
                options={[{ label: 'Nearest Branch (General)', value: 'General' }, ...branchOptions]}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
              <Select
                label="Counseling Category"
                options={topicOptions}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ff-secondary mb-1">
                Brief Description of Need *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share any context that will help our pastoral team prepare..."
                required
                className="w-full p-4 rounded-[12px] border border-ff-secondary bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-ff-secondary"
              />
            </div>
            <div className="pt-2">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-[30px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-sm"
              >
                {submitting ? 'Submitting Request...' : 'Submit Counseling Request'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* REQUEST MODAL */}
      {activeModalType && (
        <RequestModal
          isOpen={Boolean(activeModalType)}
          onClose={() => setActiveModalType(null)}
          requestType={activeModalType}
        />
      )}

      {/* SUCCESS DIALOG */}
      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Counseling Request Received"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Thank you, <strong className="text-ff-secondary">{name}</strong>. Your counseling appointment request has been submitted to the pastoral care team. We will reach out via WhatsApp or phone call.
          </p>
          <div className="flex justify-end pt-2">
            <Button onClick={() => setShowSuccessDialog(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Dialog>

      {/* 5. FOOTER TOPE */}
      <FooterTope />

      {/* 6. SITE FOOTER */}
      <SiteFooter />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default CounselingPage;
