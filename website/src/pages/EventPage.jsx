import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS, fetchDocument } from '../lib/firestore.js';
import { formatDateTime } from '../lib/format.js';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronLeft } from '../components/common/Icons.jsx';

/**
 * EventPage reproducing EventWidget:
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
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [contactUser, setContactUser] = useState(null);

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

  useEffect(() => {
    const titleText = activeEvent?.title || activeEvent?.Title || 'Event Details';
    document.title = `${titleText} | Sword of the Spirit Ministries`;
    window.scrollTo(0, 0);
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
      <section className="w-[90%] max-w-[1200px] mx-auto my-6 flex items-center justify-between">
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
        <section className="w-[90%] max-w-[1200px] mx-auto mb-12">
          <div className="bg-white border border-ff-secondary rounded-[30px] overflow-hidden shadow-sm">
            <div className="h-[200px] sm:h-[400px] w-full bg-slate-900 overflow-hidden relative">
              <img
                src={activeEvent.picture || activeEvent.image || activeEvent.poster || '/assets/images/events.png'}
                alt={activeEvent.title || 'Event'}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-12 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                    {activeEvent.branchName || activeEvent.branch_name || 'SSMI Event'}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
                    {activeEvent.title || activeEvent.Title || 'Event Details'}
                  </h1>
                </div>

                <div className="flex gap-3">
                  <Link
                    to={`/register?event=${encodeURIComponent(activeEvent.title || '')}`}
                    className="px-8 py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
                  >
                    Register
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSignUpOpen(true)}
                    className="px-6 py-3.5 rounded-[50px] border border-ff-secondary text-ff-secondary font-bold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Sign Up to Serve
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-[24px] border border-slate-200 text-sm">
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
              </div>

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
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-slate-300 p-1 flex items-center justify-center flex-shrink-0">
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

      {/* SIGN UP TO SERVE MODAL */}
      <SignUpModal
        isOpen={signUpOpen}
        onClose={() => setSignUpOpen(false)}
        defaultMinistry={`Event Volunteer - ${activeEvent?.title || 'Event'}`}
      />

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default EventPage;
