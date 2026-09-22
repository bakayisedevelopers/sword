import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * PrivacyPolicyPage matching FlutterFlow:
 * flutter-website/lib/policies/privacy_policy/privacy_policy_widget.dart
 */
export function PrivacyPolicyPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'Privacy Policy | Sword of the Spirit Ministries';
  }, []);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const policySections = [
    {
      title: '1. Who we are',
      body: [
        'Sword and Spirit Ministries International operates this website to share church information, branch details, events, sermons, podcasts, ministry opportunities, giving information, care resources, and ways for people to contact or connect with the ministry.',
        'For this website, “personal information” means information that can identify you directly or indirectly, including your name, contact details, branch, ministry interest, registration details, prayer/care request information, and related form submissions.',
      ],
    },
    {
      title: '2. POPIA commitment',
      body: [
        'We aim to process personal information in line with South Africa’s Protection of Personal Information Act, 4 of 2013 (POPIA). POPIA requires responsible parties to process personal information lawfully, fairly, and transparently, and to use appropriate safeguards.',
        'Migration note: this policy describes the React website and Firebase-backed forms currently used on this site. It should be reviewed by the ministry’s legal or compliance representative before being treated as formal legal advice.',
      ],
    },
    {
      title: '3. Information we collect',
      body: [
        'When you submit forms on this website, we may collect the details you provide, such as name, surname, email address, phone/cell number, branch, ministry selection, message content, prayer or counselling request, event registration details, attendee details, partner or child information where applicable, and the date/time of submission.',
        'When you browse the website, we may process basic technical information necessary to serve the website. If you accept analytics cookies, Firebase/Google Analytics may collect usage information such as page views, device/browser information, approximate location, and interaction events.',
      ],
    },
    {
      title: '4. Why we use personal information',
      body: [
        'We use submitted information to respond to enquiries, manage prayer/care/follow-up requests, process event registrations, manage ministry or volunteer signups, record partner submissions, show branch-specific resources, maintain church administration records, and improve the website.',
        'We use analytics information only if you consent, and only to understand website usage and improve ministry communication and content.',
      ],
    },
    {
      title: '5. Legal basis and consent',
      body: [
        'Depending on the context, we process information because you gave consent by submitting a form, because it is necessary to respond to your request or registration, because it supports legitimate church administration, or because we are required or permitted by law.',
        'Analytics cookies are optional. The website asks for consent before Firebase Analytics is initialized. You may reject analytics cookies and still use the website.',
      ],
    },
    {
      title: '6. Firebase and service providers',
      body: [
        'This website uses Firebase services, including Firestore, to store website content and form submissions. Firebase is provided by Google. We may also use Firebase Hosting and Firebase Analytics where analytics consent has been granted.',
        'We do not sell personal information. We may share information with authorised ministry staff, branch leaders, administrators, service providers, or legal/regulatory authorities where necessary for the purposes described in this policy.',
      ],
    },
    {
      title: '7. Cookies and analytics',
      body: [
        'Essential storage may be used to remember your cookie choice and support website functionality. Optional analytics cookies are used only after you select “Accept analytics” in the cookie banner.',
        'Your cookie choice is stored in your browser local storage. To change your choice later, clear this site’s local storage/cookies in your browser and reload the website.',
      ],
    },
    {
      title: '8. Branch contact details',
      body: [
        'Branch contact details displayed on the website come from branch records saved in Firestore. These may include branch email, phone number, WhatsApp, Facebook, Instagram, YouTube, website, location, service times, banking details, and related branch information.',
        'If a branch field is not saved, the website should hide that field instead of showing invented or placeholder contact details.',
      ],
    },
    {
      title: '9. Security and retention',
      body: [
        'We use reasonable technical and organisational safeguards to protect personal information against unauthorised access, loss, misuse, or alteration. Access to administrative systems should be limited to authorised users.',
        'We keep personal information only for as long as reasonably necessary for the purpose it was collected, church administration, follow-up, legal compliance, dispute handling, or operational record keeping.',
      ],
    },
    {
      title: '10. Your rights',
      body: [
        'Subject to POPIA and applicable law, you may request access to your personal information, correction or deletion of inaccurate information, objection to certain processing, withdrawal of consent where processing is based on consent, or details about how your information has been used.',
        'You may also lodge a complaint with the Information Regulator (South Africa) if you believe your personal information has been processed unlawfully.',
      ],
    },
    {
      title: '11. Children and family information',
      body: [
        'Some forms, such as partner or family-related forms, may collect information about children where provided by a parent, guardian, or authorised adult. Such information should be processed with additional care and only for the purpose for which it was submitted.',
      ],
    },
    {
      title: '12. Contact',
      body: [
        'For privacy-related requests, please contact the ministry through the Contact Us page and select the relevant branch, or use the official contact details published by the ministry.',
        'This policy may be updated as the website, Firebase configuration, forms, or ministry operations change.',
      ],
    },
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

      <main className="w-[90%] max-w-[1440px] mx-auto my-4 flex-1">
        <div className="overflow-hidden rounded-[30px] border border-ff-secondary bg-white shadow-sm">
          <section className="bg-ff-secondary p-6 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-ff-alternate">Privacy and POPIA</p>
            <h1 className="mt-3 text-3xl font-black sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
              Last updated: 21 September 2026. This policy explains how Sword and Spirit Ministries International processes personal information through this website.
            </p>
          </section>

          <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
            <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-ff-secondary">Quick Summary</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                <li>We collect information you submit through forms and registrations.</li>
                <li>Firestore stores website content and form submissions.</li>
                <li>Firebase Analytics starts only after analytics consent.</li>
                <li>Branch details should come from saved Firestore branch records.</li>
                <li>You may request access, correction, deletion, or withdrawal of consent where applicable.</li>
              </ul>
              <div className="mt-5 rounded-[18px] border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                This policy is operational guidance for the website and should be reviewed by the ministry’s legal/compliance representative.
              </div>
            </aside>

            <div className="space-y-5">
              {policySections.map((section) => (
                <section key={section.title} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-bold text-ff-secondary">{section.title}</h2>
                  <div className="mt-3 space-y-3">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-sm leading-7 text-slate-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter />

      {/* MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default PrivacyPolicyPage;
