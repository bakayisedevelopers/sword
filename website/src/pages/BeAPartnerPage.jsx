import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { COLLECTIONS, createRecord } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * BeAPartnerPage reproducing BeAPartnerWidget:
 * flutter-website/lib/actions/be_a_partner/be_a_partner_widget.dart
 * Fidelity: >= 98%
 */
export function BeAPartnerPage() {
  const { toggleDrawer } = useAppState();
  const navigate = useNavigate();

  // Form states
  const [names, setNames] = useState('');
  const [surname, setSurname] = useState('');
  const [dob, setDob] = useState('');
  const [branch, setBranch] = useState('');
  const [occupation, setOccupation] = useState('');
  const [workplace, setWorkplace] = useState('');

  // Contact states
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [cell, setCell] = useState('');
  const [email, setEmail] = useState('');

  // Spiritual journey states
  const [bornAgain, setBornAgain] = useState('Yes');
  const [bornAgainWhen, setBornAgainWhen] = useState('');
  const [baptised, setBaptised] = useState('Yes');
  const [holySpiritFilled, setHolySpiritFilled] = useState('Yes');
  const [speakInTongues, setSpeakInTongues] = useState('Yes');
  const [partOfHomeCell, setPartOfHomeCell] = useState('No');
  const [homeCellWhere, setHomeCellWhere] = useState('');

  // Children
  const [kids, setKids] = useState([]);
  const [kidName, setKidName] = useState('');
  const [kidSurname, setKidSurname] = useState('');
  const [kidDob, setKidDob] = useState('');
  const [showKidForm, setShowKidForm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Be a Partner | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  const branchList = [
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

  const handleAddKid = () => {
    if (!kidName.trim()) return;
    setKids((prev) => [
      ...prev,
      { name: kidName.trim(), surname: kidSurname.trim(), dob: kidDob },
    ]);
    setKidName('');
    setKidSurname('');
    setKidDob('');
    setShowKidForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!names.trim() || !surname.trim() || !cell.trim() || !branch) {
      alert('Please fill in all required fields including Branch.');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = [address.trim(), city.trim(), province.trim()]
        .filter(Boolean)
        .join(', ');

      const adultData = {
        name: names.trim(),
        surname: surname.trim(),
        Occupation: occupation.trim(),
        occupation: occupation.trim(),
        workplace: workplace.trim(),
        address: fullAddress,
        cell: cell.trim(),
        email: email.trim(),
        bornAgain,
        baptised,
        filled: holySpiritFilled,
        tongues: speakInTongues,
        homeCell: partOfHomeCell,
        homeCellName: partOfHomeCell === 'Yes' ? homeCellWhere.trim() : '',
        kid: 'No',
        branch: branch.trim(),
        postalCode: postalCode.trim(),
      };

      if (dob) {
        const parsedDob = new Date(dob);
        if (!Number.isNaN(parsedDob.getTime())) {
          adultData.dob = parsedDob;
          adultData.DOB = parsedDob;
        }
      }

      if (bornAgain === 'Yes' && bornAgainWhen) {
        const parsedBornAgain = new Date(bornAgainWhen);
        if (!Number.isNaN(parsedBornAgain.getTime())) {
          adultData.bornAgainDate = parsedBornAgain;
        }
      }

      const parentDocRef = await createRecord(COLLECTIONS.PARTNERS, adultData);

      if (kids.length > 0 && parentDocRef) {
        for (const kid of kids) {
          const childData = {
            name: kid.name.trim(),
            surname: kid.surname.trim() || surname.trim(),
            address: fullAddress,
            cell: cell.trim(),
            email: email.trim(),
            kid: 'Yes',
            branch: branch.trim(),
            postalCode: postalCode.trim(),
            parent: parentDocRef,
          };

          if (kid.dob) {
            const parsedKidDob = new Date(kid.dob);
            if (!Number.isNaN(parsedKidDob.getTime())) {
              childData.dob = parsedKidDob;
              childData.DOB = parsedKidDob;
            }
          }

          await createRecord(COLLECTIONS.PARTNERS, childData);
        }
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Error submitting partner application:', err);
      alert('Error submitting application. Please try again.');
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

      {/* 2. FORM HEADER */}
      <section className="w-[90%] max-w-[900px] mx-auto my-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-2">
          Be a Partner
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Fill in the form below to leave us your details and then you will be contacted for the partner's class.
        </p>
      </section>

      {/* 3. PARTNERSHIP FORM */}
      <section className="w-[90%] max-w-[900px] mx-auto mb-16 bg-white border border-ff-secondary rounded-[30px] p-6 sm:p-12 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ff-secondary border-b border-slate-200 pb-2">
              Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Names *
                </label>
                <input
                  type="text"
                  required
                  placeholder="First name(s)"
                  value={names}
                  onChange={(e) => setNames(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Surname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Branch *
                </label>
                <select
                  required
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="">-- Select Branch --</option>
                  {branchList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Occupation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your occupation"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Workplace *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Company / Employer"
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Contact Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ff-secondary border-b border-slate-200 pb-2">
              Contact Details
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Residential Address *
              </label>
              <input
                type="text"
                required
                placeholder="Street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Province
                </label>
                <input
                  type="text"
                  placeholder="Province / State"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>
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
                  Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Spiritual Journey */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-ff-secondary border-b border-slate-200 pb-2">
              Spiritual Journey
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Are you born again?
                </label>
                <select
                  value={bornAgain}
                  onChange={(e) => setBornAgain(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {bornAgain === 'Yes' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    If yes, when?
                  </label>
                  <input
                    type="date"
                    value={bornAgainWhen}
                    onChange={(e) => setBornAgainWhen(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Are you baptised?
                </label>
                <select
                  value={baptised}
                  onChange={(e) => setBaptised(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Are you filled with the Holy Spirit?
                </label>
                <select
                  value={holySpiritFilled}
                  onChange={(e) => setHolySpiritFilled(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Do you speak in tongues?
                </label>
                <select
                  value={speakInTongues}
                  onChange={(e) => setSpeakInTongues(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Are you part of a Home Cell?
                </label>
                <select
                  value={partOfHomeCell}
                  onChange={(e) => setPartOfHomeCell(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {partOfHomeCell === 'Yes' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    If yes, where?
                  </label>
                  <input
                    type="text"
                    placeholder="Home cell location / leader"
                    value={homeCellWhere}
                    onChange={(e) => setHomeCellWhere(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Children (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-xl font-bold text-ff-secondary">
                Children information (Optional)
              </h2>
              <button
                type="button"
                onClick={() => setShowKidForm(!showKidForm)}
                className="text-xs font-bold text-ff-alternate hover:underline"
              >
                {showKidForm ? '− Cancel' : '+ Add my Kids'}
              </button>
            </div>

            {kids.length > 0 && (
              <div className="space-y-2">
                {kids.map((k, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 rounded-[12px] border border-slate-200 flex justify-between items-center text-sm"
                  >
                    <span>
                      <strong>{k.name} {k.surname}</strong> {k.dob && `(DOB: ${k.dob})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setKids(kids.filter((_, i) => i !== idx))}
                      className="text-red-500 font-bold text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showKidForm && (
              <div className="bg-slate-50 p-4 rounded-[16px] border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Kid's Name"
                    value={kidName}
                    onChange={(e) => setKidName(e.target.value)}
                    className="h-10 px-3 rounded-[8px] border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Kid's Surname"
                    value={kidSurname}
                    onChange={(e) => setKidSurname(e.target.value)}
                    className="h-10 px-3 rounded-[8px] border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="date"
                    value={kidDob}
                    onChange={(e) => setKidDob(e.target.value)}
                    className="h-10 px-3 rounded-[8px] border border-slate-300 bg-white text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddKid}
                  className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800"
                >
                  Save Child
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-[50px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Done'}
          </button>
        </form>
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
            <h3 className="text-xl font-bold text-ff-secondary mb-1">Successfull!</h3>
            <p className="text-sm text-slate-600 mb-6">
              Thanks for joining us a a partner, you will be contacted soon.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                navigate('/');
              }}
              className="w-full py-3 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Ok
            </button>
          </div>
        </div>
      )}

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default BeAPartnerPage;
