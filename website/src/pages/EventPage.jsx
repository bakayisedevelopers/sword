import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS, fetchDocument, createEventRegistrationsAndReduceTickets } from '../lib/firestore.js';
import { formatDateTime } from '../lib/format.js';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronLeft } from '../components/common/Icons.jsx';

/**
 * EventPage reproducing EventWidget with embedded inline registration:
 * flutter-website/lib/landings/event/event_widget.dart
 * Fidelity: >= 98%
 */
export function EventPage() {
  const { toggleDrawer } = useAppState();
  const [searchParams] = useSearchParams();

  // Support ?id=, legacy FlutterFlow ?event= (which can be a doc ID or path like 'events/xyz'), ?eventId=, and ?title=
  const rawParam =
    searchParams.get('id') ||
    searchParams.get('event') ||
    searchParams.get('eventId') ||
    searchParams.get('name') ||
    searchParams.get('title') ||
    '';

  const cleanIdOrTitle = rawParam.includes('/')
    ? decodeURIComponent(rawParam).split('/').filter(Boolean).pop()
    : decodeURIComponent(rawParam).trim();

  const { data: events, loading } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const { data: allRegistrations } = useFirestoreQuery(COLLECTIONS.REGISTRATIONS);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [contactUser, setContactUser] = useState(null);

  // Embedded registration form state
  const [regQuantity, setRegQuantity] = useState(1);
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCell, setRegCell] = useState('');
  const [regBranch, setRegBranch] = useState('');
  const [regAdditionalAttendees, setRegAdditionalAttendees] = useState([]);
  const [regMessage, setRegMessage] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  const branchList = [
    'Online',
    'EMalahleni',
    'Mbabane',
    'Siteki',
    'Hlutsi',
    'Ludzeludze',
    'Boksburg',
    'Orange Farm',
    'Lagos',
  ];

  const fallbackEvent = {
    title: 'Sunday Victory & Healing Service',
    branchName: 'EMalahleni',
    branch_name: 'EMalahleni',
    dateDetails: 'Every Sunday',
    timeDetails: '09:00 AM & 11:30 AM',
    isGlobal: 'Yes',
    image: '/assets/images/events.png',
    description:
      'Join us for a dynamic, Spirit-filled atmosphere with powerful worship, life-transforming revelation from the Word, and demonstration of the Holy Ghost.',
    contactName: 'Church Office',
    contactRole: 'Event Coordinator',
    contactEmail: 'events@swordandspirit.org',
    contactImage: '/assets/images/sword_logo.png',
  };

  const matchedEvent = useMemo(() => {
    if (!events || events.length === 0) return null;
    if (!cleanIdOrTitle) return events[0] || null;

    // 1. Exact document ID match
    const byId = events.find((e) => e.id === cleanIdOrTitle);
    if (byId) return byId;

    // 2. Case-insensitive document ID match
    const byIdCase = events.find((e) => e.id && e.id.toLowerCase() === cleanIdOrTitle.toLowerCase());
    if (byIdCase) return byIdCase;

    // 3. Exact title or name match
    const byTitle = events.find(
      (e) => (e.title || e.Title || e.name || '').toLowerCase() === cleanIdOrTitle.toLowerCase()
    );
    if (byTitle) return byTitle;

    // 4. Slug / normalized title match
    const cleanSlug = cleanIdOrTitle.toLowerCase().replace(/[-_]/g, ' ');
    const bySlug = events.find((e) => {
      const t = (e.title || e.Title || e.name || '').toLowerCase();
      return t === cleanSlug || t.includes(cleanSlug) || cleanSlug.includes(t);
    });
    if (bySlug) return bySlug;

    return null;
  }, [events, cleanIdOrTitle]);

  const activeEvent = matchedEvent || (!cleanIdOrTitle && !loading ? fallbackEvent : null);

  const eventRegistrations = useMemo(() => {
    if (!allRegistrations || !activeEvent) return [];
    return allRegistrations.filter((r) => {
      const matchName = r.eventName && activeEvent.title && r.eventName.toLowerCase() === activeEvent.title.toLowerCase();
      const matchId = (r.eventId && r.eventId === activeEvent.id) || (r.event_id && r.event_id === activeEvent.id);
      return matchName || matchId;
    });
  }, [allRegistrations, activeEvent]);

  const totalBooked = useMemo(() => {
    return eventRegistrations.reduce((sum, r) => {
      let count = 1;
      if (r.quantity && Number(r.quantity) > 0) {
        count = Number(r.quantity);
      } else if (Array.isArray(r.attendees) && r.attendees.length > 0) {
        count = r.attendees.length;
      } else if (typeof r.message === 'string') {
        const match = r.message.match(/Tickets:\s*(\d+)/i);
        if (match && match[1]) {
          count = parseInt(match[1], 10) || 1;
        }
      }
      return sum + count;
    }, 0);
  }, [eventRegistrations]);

  const originalTicketLimit = Number(activeEvent?.originalTicketLimit || 0);
  const currentTicketLimit = Number(activeEvent?.ticketLimit || 0);
  const usesReducedTicketLimit = originalTicketLimit > 0;
  const ticketCapacity = usesReducedTicketLimit ? originalTicketLimit : currentTicketLimit;
  const bookedDisplayCount = usesReducedTicketLimit
    ? Math.max(0, ticketCapacity - currentTicketLimit)
    : totalBooked;
  const seatsRemaining = ticketCapacity > 0
    ? (usesReducedTicketLimit
      ? Math.max(0, currentTicketLimit)
      : Math.max(0, ticketCapacity - totalBooked))
    : null;
  const isSoldOut = ticketCapacity > 0 && seatsRemaining === 0;

  useEffect(() => {
    const titleText = activeEvent?.title || activeEvent?.Title || 'Event Details';
    document.title = `${titleText} | Sword of the Spirit Ministries`;

    if (window.location.hash === '#event-registration') {
      setTimeout(() => {
        document.getElementById('event-registration')?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    } else {
      window.scrollTo(0, 0);
    }

    if (activeEvent?.title) {
      setRegMessage(`Hi SSMI, I would like to register for ${activeEvent.title}.`);
      if (activeEvent.branchName || activeEvent.branch_name) {
        setRegBranch(activeEvent.branchName || activeEvent.branch_name);
      }
    }
  }, [activeEvent]);

  // Resolve contact person user record from Firestore if contactPerson is a reference or ID
  useEffect(() => {
    let isMounted = true;
    async function loadContactUser() {
      if (!activeEvent?.contactPerson) {
        setContactUser(null);
        return;
      }
      try {
        let userDocId = '';
        if (typeof activeEvent.contactPerson === 'string') {
          userDocId = activeEvent.contactPerson.includes('/')
            ? activeEvent.contactPerson.split('/').filter(Boolean).pop()
            : activeEvent.contactPerson;
        } else if (activeEvent.contactPerson?.id) {
          userDocId = activeEvent.contactPerson.id;
        }

        if (userDocId) {
          const u = await fetchDocument(COLLECTIONS.USERS, userDocId);
          if (isMounted && u) {
            setContactUser(u);
          }
        }
      } catch (err) {
        console.warn('Could not fetch contact person user record:', err);
      }
    }
    loadContactUser();
    return () => {
      isMounted = false;
    };
  }, [activeEvent?.contactPerson]);

  const contactName =
    contactUser?.displayName ||
    contactUser?.name ||
    activeEvent?.contactName ||
    'Church Office';
  const contactRole =
    contactUser?.role ||
    activeEvent?.contactRole ||
    'Event Coordinator';
  const contactEmail =
    contactUser?.email ||
    activeEvent?.contactEmail ||
    'events@swordandspirit.org';
  const contactPhone =
    contactUser?.phoneNumber ||
    contactUser?.phone ||
    activeEvent?.contactPhone ||
    '';
  const contactImage =
    contactUser?.photoUrl ||
    contactUser?.photo_url ||
    activeEvent?.contactImage ||
    '/assets/images/sword_logo.png';

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const scrollToRegistration = () => {
    const el = document.getElementById('event-registration');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuantityChange = (newQty) => {
    const maxAllowed = ticketCapacity > 0 ? Math.min(10, seatsRemaining) : 10;
    const qty = Math.max(1, Math.min(maxAllowed, newQty));
    setRegQuantity(qty);
    setRegAdditionalAttendees((prev) => {
      const extraNeeded = qty - 1;
      if (extraNeeded <= 0) return [];
      const updated = [...prev];
      while (updated.length < extraNeeded) {
        updated.push({ name: '', surname: '', email: '', cell: '' });
      }
      return updated.slice(0, extraNeeded);
    });
  };

  const handleAdditionalAttendeeChange = (index, field, value) => {
    setRegAdditionalAttendees((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regSurname.trim() || !regEmail.trim() || !regCell.trim() || !regBranch) {
      setRegError('Please fill in your Name, Surname, Email Address, Cell Number, and select a Branch.');
      return;
    }

    for (let i = 0; i < regAdditionalAttendees.length; i++) {
      const att = regAdditionalAttendees[i];
      if (!att.name.trim() || !att.surname.trim() || !att.email.trim()) {
        setRegError(`Please fill in Name, Surname, and Email Address for Attendee #${i + 2}.`);
        return;
      }
    }

    if (ticketCapacity > 0 && regQuantity > seatsRemaining) {
      setRegError(`Sorry, only ${seatsRemaining} seat(s) remain available for this event.`);
      return;
    }

    setRegSubmitting(true);
    try {
      const bookingRef = `BK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      const eventId = activeEvent?.id || cleanIdOrTitle || '';

      const registrationPayloads = [{
        name: regName.trim(),
        surname: regSurname.trim(),
        cell: regCell.trim(),
        branch: regBranch.trim(),
        eventId,
        eventName: activeEvent?.title || 'Event',
        message: [
          `Email: ${regEmail.trim()}`,
          `Booking Ref: ${bookingRef}`,
          `Tickets: ${regQuantity}`,
          regAdditionalAttendees.length > 0 ? `Group Booking (${regAdditionalAttendees.length + 1} attendees total)` : '',
          regMessage.trim() ? `Notes: ${regMessage.trim()}` : '',
        ].filter(Boolean).join('\n\n'),
        date: new Date(),
      }];

      regAdditionalAttendees.forEach((att, idx) => {
        registrationPayloads.push({
          name: att.name.trim(),
          surname: att.surname.trim(),
          cell: (att.cell || regCell).trim(),
          branch: regBranch.trim(),
          eventId,
          eventName: activeEvent?.title || 'Event',
          message: [
            `Email: ${att.email.trim()}`,
            `Booking Ref: ${bookingRef}`,
            `Attendee: #${idx + 2}`,
            `Registered By: ${regName.trim()} ${regSurname.trim()} (${regEmail.trim()})`,
            regMessage.trim() ? `Notes: ${regMessage.trim()}` : '',
          ].filter(Boolean).join('\n\n'),
          date: new Date(),
        });
      });

      await createEventRegistrationsAndReduceTickets(eventId, regQuantity, registrationPayloads);

      setRegSuccess(true);
      setRegName('');
      setRegSurname('');
      setRegEmail('');
      setRegCell('');
      setRegAdditionalAttendees([]);
      setRegQuantity(1);
    } catch (err) {
      console.error('Error submitting event registration:', err);
      setRegError('Error submitting registration. Please check your network and try again.');
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
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
              aria-label="Open Mobile Drawer"
              className="lg:hidden w-[45px] h-[45px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. BREADCRUMB / BACK LINK */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-4 flex items-center justify-between">
        <Link
          to="/events"
          className="text-sm font-bold text-ff-secondary hover:text-ff-alternate transition-colors inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to {activeEvent?.branchName || activeEvent?.branch_name || 'Events'}</span>
        </Link>
      </section>

      {/* 3. EVENT DETAILS BODY */}
      {loading ? (
        <section className="w-[90%] max-w-[1200px] mx-auto my-24 flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-ff-secondary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-medium text-sm">Loading event details...</p>
        </section>
      ) : !activeEvent ? (
        <section className="w-[90%] max-w-[1200px] mx-auto my-20 flex flex-col items-center justify-center text-center p-8 bg-slate-50 border border-slate-200 rounded-[30px]">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">Event Not Found</h2>
          <p className="text-slate-600 mt-2 max-w-md">
            We couldn't find the event you requested ({cleanIdOrTitle}). It may have concluded or the link may be outdated.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/events"
              className="px-6 py-3 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
            >
              Browse All Events
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-[50px] border border-ff-secondary text-ff-secondary font-bold text-sm hover:bg-white transition-colors"
            >
              Back Home
            </Link>
          </div>
        </section>
      ) : (
        <section className="w-[90%] max-w-[1200px] mx-auto mb-10">
          <div className="bg-white border border-ff-secondary rounded-[32px] overflow-hidden shadow-sm">
            {/* Hero Image with Our Events Fallback */}
            <div className="h-[240px] sm:h-[440px] w-full bg-slate-900 overflow-hidden relative">
              <picture className="w-full h-full">
                <source
                  media="(min-width: 991px)"
                  srcSet={activeEvent.picture || activeEvent.image || activeEvent.poster || '/assets/images/events_(2).png'}
                />
                <img
                  src={activeEvent.picture || activeEvent.image || activeEvent.poster || '/assets/images/events.png'}
                  alt={activeEvent.title || 'Event'}
                  className="w-full h-full object-cover object-center filter brightness-95"
                />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {isSoldOut && (
                <div className="absolute top-6 right-6 z-10">
                  <span className="px-5 py-2 rounded-full bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
                    Sold Out / Full Capacity
                  </span>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-12 space-y-8">
              {/* Header Title & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-200 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                    {activeEvent.branchName || activeEvent.branch_name || 'SSMI Event'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
                    {activeEvent.title || activeEvent.Title || 'Event Details'}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-3">
                  {isSoldOut ? (
                    <button
                      type="button"
                      disabled
                      className="px-8 py-3.5 rounded-[50px] bg-red-100 text-red-600 border border-red-200 font-bold text-sm cursor-not-allowed shadow-none"
                    >
                      Sold Out
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={scrollToRegistration}
                      className="px-8 py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
                    >
                      Register Now
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSignUpOpen(true)}
                    className="px-6 py-3.5 rounded-[50px] border border-ff-secondary text-ff-secondary font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Sign Up to Serve
                  </button>
                </div>
              </div>

              {/* Event Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 bg-slate-50 p-6 rounded-[24px] border border-slate-200 text-sm">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">
                    Date & Time
                  </span>
                  <span className="font-bold text-ff-secondary text-base">
                    {activeEvent.dateDetails ||
                      activeEvent.date_details ||
                      (activeEvent.date ? formatDateTime(activeEvent.date) : 'Upcoming')}{' '}
                    {activeEvent.timeDetails || activeEvent.time_details
                      ? `| ${activeEvent.timeDetails || activeEvent.time_details}`
                      : ''}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">
                    Location / Campus
                  </span>
                  <span className="font-bold text-ff-secondary text-base">
                    {activeEvent.location ||
                      activeEvent.branchName ||
                      activeEvent.branch_name ||
                      'All SSMI Campuses'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">
                    Global Event
                  </span>
                  <span className="font-bold text-ff-secondary text-base">
                    {activeEvent.global === true ||
                    activeEvent.isGlobal === 'Yes' ||
                    activeEvent.isGlobal === true ||
                    activeEvent.global === 'Yes'
                      ? 'Yes'
                      : 'No'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">
                    Admission
                  </span>
                  <span className="font-bold text-ff-secondary text-base">
                    {activeEvent.price && Number(activeEvent.price) > 0
                      ? `R${activeEvent.price}`
                      : activeEvent.booking
                      ? 'Registration Required'
                      : 'Free Entry'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-bold block">
                    Capacity & Seats
                  </span>
                  <span className="font-bold text-ff-secondary text-base">
                    {ticketCapacity > 0 ? (
                      isSoldOut ? (
                        <span className="text-red-600 font-extrabold">Full ({bookedDisplayCount}/{ticketCapacity})</span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{seatsRemaining} left ({bookedDisplayCount}/{ticketCapacity})</span>
                      )
                    ) : (
                      'Unlimited Seats'
                    )}
                  </span>
                </div>
              </div>

              {/* Event Description */}
              {activeEvent.description && (
                <div className="space-y-2 pt-2">
                  <h2 className="text-xl font-bold text-ff-secondary">About this Event</h2>
                  <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {activeEvent.description}
                  </p>
                </div>
              )}

              {/* Contact Person Card */}
              <div className="pt-6 border-t border-slate-200">
                <h3 className="text-lg font-bold text-ff-secondary mb-4">Contact Person</h3>
                <div className="flex items-center gap-4 bg-slate-50 p-5 rounded-[20px] border border-slate-200 max-w-md">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-slate-300 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={contactImage}
                      alt={contactName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-ff-secondary text-base truncate">
                      {contactName}
                    </h4>
                    <p className="text-xs text-ff-alternate font-bold">
                      {contactRole}
                    </p>
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-xs text-slate-600 hover:underline mt-1 block truncate"
                      >
                        {contactEmail}
                      </a>
                    )}
                    {contactPhone && (
                      <a
                        href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-600 hover:underline mt-0.5 block truncate font-medium"
                      >
                        WhatsApp: {contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. EMBEDDED INLINE REGISTRATION SECTION (BEFORE FOOTER) */}
      {activeEvent && (
        <section
          id="event-registration"
          className="w-[90%] max-w-[1200px] mx-auto mb-16 bg-white border border-ff-secondary rounded-[32px] p-6 sm:p-12 shadow-sm"
        >
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-ff-alternate">
              Reserve Your Spot
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-ff-secondary mt-1">
              Event Registration
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Please enter your details below to confirm attendance for{' '}
              <strong className="text-ff-secondary">{activeEvent.title}</strong>.
            </p>

            {ticketCapacity > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">
                <span>Total Booked: {bookedDisplayCount} / {ticketCapacity}</span>
                <span>•</span>
                <span className={isSoldOut ? 'text-red-600' : 'text-emerald-700'}>
                  {isSoldOut ? 'Event Full' : `${seatsRemaining} Seats Remaining`}
                </span>
              </div>
            )}
          </div>

          {isSoldOut ? (
            <div className="p-8 rounded-[24px] bg-red-50 border border-red-200 text-center max-w-xl mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-black">
                ✕
              </div>
              <h3 className="text-xl font-bold text-red-900">Registrations are Closed</h3>
              <p className="text-sm text-red-700 leading-relaxed">
                This event has reached maximum capacity. You can browse our other upcoming events or reach out to the church office for waitlist inquiries.
              </p>
              <div className="pt-2">
                <Link
                  to="/events"
                  className="px-6 py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-block"
                >
                  Browse Other Events
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegistrationSubmit} className="max-w-2xl mx-auto space-y-5">
              {regError && (
                <div className="p-4 rounded-[16px] bg-red-50 border border-red-200 text-sm text-red-700 font-semibold">
                  {regError}
                </div>
              )}

              {/* Quantity / Attendee Counter */}
              <div className="bg-slate-50 p-5 rounded-[20px] border border-slate-200">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      Number of Attendees (Tickets)
                    </label>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {ticketCapacity > 0
                        ? `${seatsRemaining} seat(s) currently available`
                        : 'Registering for yourself or a group/family'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(regQuantity - 1)}
                      disabled={regQuantity <= 1}
                      className="w-10 h-10 rounded-full border border-slate-300 bg-white font-bold text-slate-700 text-lg disabled:opacity-30 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-black text-slate-900 text-lg">
                      {regQuantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(regQuantity + 1)}
                      disabled={regQuantity >= 10 || (ticketCapacity > 0 && regQuantity >= seatsRemaining)}
                      className="w-10 h-10 rounded-full border border-slate-300 bg-white font-bold text-slate-700 text-lg disabled:opacity-30 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {regQuantity > 1 && (
                <h3 className="text-xs font-bold uppercase tracking-wider text-ff-alternate pt-2">
                  Attendee #1 (Primary Contact)
                </h3>
              )}

              {/* Primary Attendee Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="First name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                    value={regCell}
                    onChange={(e) => setRegCell(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Branch *
                </label>
                <select
                  required
                  value={regBranch}
                  onChange={(e) => setRegBranch(e.target.value)}
                  className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm cursor-pointer"
                >
                  <option value="">-- Select Branch --</option>
                  {branchList.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Additional Attendees */}
              {regAdditionalAttendees.map((att, idx) => (
                <div key={idx} className="pt-4 border-t border-slate-200 space-y-4">
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
                        className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                        className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                        className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
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
                        className="w-full h-12 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Special Notes or Message (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Additional notes for our team..."
                  value={regMessage}
                  onChange={(e) => setRegMessage(e.target.value)}
                  className="w-full p-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm focus:outline-none focus:border-ff-secondary shadow-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="w-full py-4 rounded-[50px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {regSubmitting
                    ? 'Submitting Registration…'
                    : `Complete Registration (${regQuantity} ${regQuantity === 1 ? 'Attendee' : 'Attendees'})`}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* REGISTRATION SUCCESS MODAL */}
      {regSuccess && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] max-w-sm w-full p-8 text-center shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
              <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-ff-secondary mb-2">Registration Confirmed!</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We look forward to hosting you for <strong>{activeEvent?.title}</strong>. A confirmation has been recorded.
            </p>
            <button
              type="button"
              onClick={() => setRegSuccess(false)}
              className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* SIGN UP TO SERVE MODAL */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        defaultMinistry={`Event Volunteer - ${activeEvent?.title || 'Event'}`}
      />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default EventPage;
