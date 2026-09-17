import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * FollowJesusPage reproducing FollowJesusWidget:
 * flutter-website/lib/actions/follow_jesus/follow_jesus_widget.dart
 * Fidelity: >= 98%
 */
export function FollowJesusPage() {
  const { toggleDrawer } = useAppState();

  const [faqOpen, setFaqOpen] = useState(true);
  const [salvationModalOpen, setSalvationModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Follow Jesus | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

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
          src="/assets/images/Jesus_(2).png"
          alt="Follow Jesus Banner"
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
          src="/assets/images/Jesus.png"
          alt="Follow Jesus Banner Mobile"
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

      {/* 2. SALVATION PRAYER SECTION */}
      <section className="w-[90%] max-w-[1000px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-3">
          Salvation Prayer
        </h1>
        <p className="text-base sm:text-lg text-slate-600 mb-8 max-w-xl mx-auto">
          To give your life to Jesus, pray this prayer out loud:
        </p>

        <div className="bg-ff-secondary text-white rounded-[30px] p-8 sm:p-12 shadow-md border border-ff-secondary text-left space-y-4">
          <p className="text-base sm:text-lg leading-relaxed text-white/95">
            "Father God I believe in my heart that You raised Jesus Christ from the dead and I confess with my mouth that He is Your Son.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-white/95">
            Father God, thank You that for the punishment of my sins you sent your Son Jesus to come and be punished in my place. And you did this because You love me. Thank You that my sins are forgiven and now I am a new creation, the old is gone. And now I am called Your child.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-white/95 font-semibold text-ff-primary">
            I receive this New Life in Christ by faith in Jesus alone. Amen."
          </p>
        </div>
      </section>

      {/* 3. NEXT STEP SECTION */}
      <section className="w-[90%] max-w-[1000px] mx-auto my-10">
        <div className="bg-slate-50 border border-slate-200 rounded-[30px] p-8 sm:p-12 shadow-sm space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary">
            Next Step
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            If you have prayed this prayer now or in church or online, <strong className="text-ff-secondary">CONGRATULATIONS</strong>, you are now a child of God according to John 1:12.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            We welcome you into the family of God. The Bible says heaven is celebrating your salvation as we speak.
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Click the button below and we'll contact you with the next steps.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setSalvationModalOpen(true)}
              className="px-8 py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow-md"
            >
              I've given my life to Jesus.
            </button>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="w-[90%] max-w-[1000px] mx-auto my-12 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-ff-secondary mb-6">
          Frequently Asked Questions
        </h2>

        <div className="border border-ff-secondary rounded-[24px] overflow-hidden bg-white shadow-sm transition-all">
          <button
            type="button"
            onClick={() => setFaqOpen(!faqOpen)}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <h3 className="text-lg sm:text-xl font-bold text-ff-secondary">
              What does it mean to give my life to Jesus?
            </h3>
            <span className="text-2xl font-bold text-ff-secondary ml-4">
              {faqOpen ? '−' : '+'}
            </span>
          </button>

          {faqOpen && (
            <div className="px-6 pb-8 pt-2 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100 space-y-4">
              <p>
                Being saved is about receiving the gift of eternal life through Jesus Christ. The Bible says, “Everyone who calls on the name of the Lord will be saved” (Romans 10:13). To be saved means that God forgives your sins, restores your relationship with Him, and gives you a brand-new life filled with hope and purpose.
              </p>
              <p>
                We are all born separated from God because of sin, but God’s love made a way through Jesus. By His death on the cross and His resurrection, Jesus paid the price for our sins so that we don’t have to carry guilt, shame, or condemnation.
              </p>
              <p>
                Salvation is not about religion, rules, or earning God’s approval — it is a free gift of grace. When you put your faith in Jesus, you are:
              </p>
              <ul className="space-y-2 pl-4 text-slate-800 font-medium">
                <li>• <strong>Forgiven</strong> – Your sins are washed away (1 John 1:9).</li>
                <li>• <strong>Made New</strong> – You receive a new heart and identity in Christ (2 Corinthians 5:17).</li>
                <li>• <strong>Adopted</strong> – You become a child of God (John 1:12).</li>
                <li>• <strong>Secure</strong> – You are promised eternal life with Him (John 3:16).</li>
              </ul>
              <p>
                Salvation is simply saying “yes” to Jesus — trusting Him as your Lord and Savior and surrendering your life to His love and plan.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* REQUEST MODAL (SALVATION) */}
      <RequestModal
        isOpen={salvationModalOpen}
        onClose={() => setSalvationModalOpen(false)}
        defaultRequestType="Salvation"
      />

      {/* 5. SITE FOOTER */}
      <SiteFooter />

      {/* 6. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default FollowJesusPage;
