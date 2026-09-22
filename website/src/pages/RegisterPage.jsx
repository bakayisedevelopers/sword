import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { COLLECTIONS, createEventRegistrationsAndReduceTickets } from '../lib/firestore.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronLeft } from '../components/common/Icons.jsx';

import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';

/**
 * RegisterPage reproducing RegisterWidget with Multi-Person Registration Support:
 * flutter-website/lib/landings/register/register_widget.dart
 * Fidelity: >= 98%
 */
export function RegisterPage() {
  const { toggleDrawer } = useAppState();
  const [searchParams] = useSearchParams();
  const eventTitleParam = searchParams.get('event') || 'Event';
  const eventIdParam = searchParams.get('eventId') || '';
  const navigate = useNavigate();

  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const { data: allRegistrations } = useFirestoreQuery(COLLECTIONS.REGISTRATIONS);

  const matchedEvent = (events || []).find((e) => (
    (eventIdParam && e.id === eventIdParam) ||
    (e.title && e.title.toLowerCase() === eventTitleParam.toLowerCase())
  ));

  const eventRegistrations = (allRegistrations || []).filter((r) => {
    const matchName = r.eventName && r.eventName.toLowerCase() === eventTitleParam.toLowerCase();
    const matchId = (eventIdParam && r.eventId === eventIdParam) || (matchedEvent?.id && r.eventId === matchedEvent.id);
    return matchName || matchId;
  });

  const totalBooked = eventRegistrations.reduce((sum, r) => {
    const q = Number(r.quantity || (Array.isArray(r.attendees) ? r.attendees.length : 1)) || 1;
    return sum + q;
  }, 0);

  const originalTicketLimit = Number(matchedEvent?.originalTicketLimit || 0);
  const currentTicketLimit = Number(matchedEvent?.ticketLimit || 0);
  const usesReducedTicketLimit = originalTicketLimit > 0;
  const ticketCapacity = usesReducedTicketLimit ? originalTicketLimit : currentTicketLimit;
  const remainingSeats = ticketCapacity > 0
    ? (usesReducedTicketLimit
      ? Math.max(0, currentTicketLimit)
      : Math.max(0, ticketCapacity - totalBooked))
    : 999;

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [cell, setCell] = useState('');
  const [branch, setBranch] = useState('');
  const [additionalAttendees, setAdditionalAttendees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = 'Registration | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);

    if (matchedEvent?.id) {
      navigate(`/event?id=${matchedEvent.id}#event-registration`, { replace: true });
    }
  }, [matchedEvent, navigate]);

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

  const handleQuantityChange = (newQty) => {
    const qty = Math.max(1, Math.min(10, Math.min(remainingSeats, newQty)));
    setQuantity(qty);
    setAdditionalAttendees((prev) => {
      const extraNeeded = qty - 1;
      if (extraNeeded <= 0) return [];
      const updated = [...prev];
      while (updated.length < extraNeeded) {
        updated.push({ name: '', surname: '', email: '', cell: '', branch: '' });
      }
      return updated.slice(0, extraNeeded);
    });
  };

  const handleAdditionalAttendeeChange = (index, field, value) => {
    setAdditionalAttendees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !surname.trim() || !email.trim() || !cell.trim() || !branch) {
      alert('Please fill in Primary Attendee Name, Surname, Email Address, Cell Number, and select a Branch.');
      return;
    }

    for (let i = 0; i < additionalAttendees.length; i++) {
      const att = additionalAttendees[i];
      if (!att.name.trim() || !att.surname.trim() || !att.email.trim() || !att.branch) {
        alert(`Please fill in Name, Surname, Email Address, and Branch for Attendee #${i + 2}.`);
        return;
      }
    }

    if (ticketCapacity > 0 && quantity > remainingSeats) {
      alert(`Sorry, only ${remainingSeats} seat(s) remain available for this event.`);
      return;
    }

    setSubmitting(true);
    try {
      const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const eventId = matchedEvent?.id || eventIdParam || '';
      const primaryDescription = [
        `${name.trim()} ${surname.trim()} registered for ${eventTitleParam}.`,
        `Attendee: #1`,
        `Email: ${email.trim()}`,
        `Booking Ref: ${bookingRef}`,
        `Tickets in booking: ${quantity}`,
        additionalAttendees.length > 0 ? `Primary contact for group booking (${additionalAttendees.length + 1} attendees total)` : '',
      ].filter(Boolean).join('\n\n');

      const registrationPayloads = [{
        name: name.trim(),
        surname: surname.trim(),
        cell: cell.trim(),
        branch: branch.trim(),
        eventId,
        eventName: eventTitleParam,
        message: primaryDescription,
        description: primaryDescription,
        date: new Date(),
      }];

      additionalAttendees.forEach((att, idx) => {
        const attendeeDescription = [
          `${att.name.trim()} ${att.surname.trim()} registered for ${eventTitleParam}.`,
          `Attendee: #${idx + 2}`,
          `Email: ${att.email.trim()}`,
          `Booking Ref: ${bookingRef}`,
          `Registered By: ${name.trim()} ${surname.trim()} (${email.trim()})`,
        ].filter(Boolean).join('\n\n');

        registrationPayloads.push({
          name: att.name.trim(),
          surname: att.surname.trim(),
          cell: (att.cell || cell).trim(),
          branch: att.branch.trim(),
          eventId,
          eventName: eventTitleParam,
          message: attendeeDescription,
          description: attendeeDescription,
          date: new Date(),
        });
      });

      await createEventRegistrationsAndReduceTickets(eventId, quantity, registrationPayloads);

      setShowSuccess(true);
    } catch (err) {
      console.error('Error submitting event registration:', err);
      alert('Error submitting registration. Please try again.');
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

      {/* 2. BREADCRUMB / BACK */}
      <section className="w-[90%] max-w-[800px] mx-auto my-6 flex items-center justify-between">
        <Link
          to="/events"
          className="text-sm font-bold text-ff-secondary hover:text-ff-alternate transition-colors inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </Link>
      </section>

      {/* 3. REGISTRATION FORM */}
      <section className="w-[90%] max-w-[800px] mx-auto mb-16 bg-white border border-ff-secondary rounded-[30px] p-6 sm:p-12 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary">
            Registration
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            Please provide the details for the <strong>{eventTitleParam}</strong> Registration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Number of Attendees / Quantity */}
          <div className="bg-slate-50 p-4 rounded-[16px] border border-slate-200 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Number of Attendees (Tickets)
                </label>
                <p className="text-xs text-slate-500 mt-0.5">
                  {ticketCapacity > 0 ? `${remainingSeats} seat(s) available` : 'Registering for yourself or a group/family'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-full border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-slate-900 text-base">{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10 || (ticketCapacity > 0 && quantity >= remainingSeats)}
                  className="w-9 h-9 rounded-full border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {quantity > 1 && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-ff-alternate mb-2">
              Attendee #1 (Primary Contact)
            </h3>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
              />
            </div>

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

          {/* Additional Attendees */}
          {additionalAttendees.map((att, idx) => (
            <div key={idx} className="mt-6 pt-6 border-t border-slate-200 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                Attendee #{idx + 2} Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={att.name}
                    onChange={(e) => handleAdditionalAttendeeChange(idx, 'name', e.target.value)}
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
                    value={att.surname}
                    onChange={(e) => handleAdditionalAttendeeChange(idx, 'surname', e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. attendee@example.com"
                    value={att.email || ''}
                    onChange={(e) => handleAdditionalAttendeeChange(idx, 'email', e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Cell Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Cell number"
                    value={att.cell}
                    onChange={(e) => handleAdditionalAttendeeChange(idx, 'cell', e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Branch *
                </label>
                <select
                  required
                  value={att.branch || ''}
                  onChange={(e) => handleAdditionalAttendeeChange(idx, 'branch', e.target.value)}
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
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-[50px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 mt-4"
          >
            {submitting ? 'Submitting...' : 'Submit'}
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
            <h3 className="text-xl font-bold text-ff-secondary mb-1">Success!!</h3>
            <p className="text-sm text-slate-600 mb-6">Message sent.</p>
            <button
              type="button"
              onClick={() => {
                setShowSuccess(false);
                navigate('/events');
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

export default RegisterPage;
