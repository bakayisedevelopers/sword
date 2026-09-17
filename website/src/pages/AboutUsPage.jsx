import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { FooterTope } from '../components/common/FooterTope.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * AboutUsPage matching flutter-website/lib/main_pages/about_us/about_us_widget.dart
 * Fidelity: >= 98%
 */
export function AboutUsPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'About Us | Sword of the Spirit Ministries';
    window.scrollTo(0, 0);
  }, []);

  // Accordion state
  const [globalLeadershipOpen, setGlobalLeadershipOpen] = useState(true);
  const [branchesLeadershipOpen, setBranchesLeadershipOpen] = useState(false);
  const [openBeliefIndex, setOpenBeliefIndex] = useState(null);

  const toggleBelief = (idx) => {
    setOpenBeliefIndex((prev) => (prev === idx ? null : idx));
  };

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const branchLeaders = [
    {
      name: 'Apostle Bheki & Pst. Zandi Thwala',
      branch: 'EMalahleni Branch',
      image: '/assets/images/B&Z_no_background_1.png',
      route: '/branch-give?branch=EMalahleni',
    },
    {
      name: 'Pst. Tony',
      branch: 'Lagos Branch',
      image: '/assets/images/sword_logo.png',
      route: '/branch-give?branch=Lagos',
    },
    {
      name: 'Pst. Nonhlanhla',
      branch: 'Orange Farm Branch',
      image: '/assets/images/Pst._Nonhlanda_Orange_Farm_no_background.png',
      route: '/branch-give?branch=Orange%20Farm',
    },
    {
      name: 'Pst. John & Thabi Ndaba',
      branch: 'Hlutsi Branch',
      image: '/assets/images/Pst._Ndaba_and_Thabi_no_backgroung.png',
      route: '/branch-give?branch=Hlutsi',
    },
    {
      name: 'Pst. Mlondie & Khetsiwe',
      branch: 'Ludzeludze Branch',
      image: '/assets/images/Pst._Mlondi_and_wife_no_background.png',
      route: '/branch-give?branch=Ludzeludze',
    },
    {
      name: 'Pst. Scelo & Pam',
      branch: 'Siteki Branch',
      image: '/assets/images/Pst._Scelo_&_Wife.png',
      route: '/branch-give?branch=Siteki',
    },
    {
      name: 'Pst. Pumuza & Nonhlanhla',
      branch: 'Boksburg Branch',
      image: '/assets/images/Pst._Pumuza_and_wife-no_background.png',
      route: '/branch-give?branch=Boksburg',
    },
    {
      name: 'Pst. Andrew & Mandile',
      branch: 'Mbabane Branch',
      image: '/assets/images/Pst._Andre_and_Mandile.png',
      route: '/branch-give?branch=Mbabane',
    },
  ];

  const beliefs = [
    {
      title: 'The Father',
      desc: 'We believe in God the Father Almighty, the Creator of heaven and earth. He is eternal, holy, all-powerful, and all-knowing — yet deeply personal, full of love, mercy, and justice. God desires an intimate relationship with His children and is actively involved in the lives of those who seek Him. He reigns sovereign over all creation and works all things according to His perfect will.\n📖 Genesis 1:1; Isaiah 64:8; Matthew 6:9; Psalm 103:19; Romans 8:15',
    },
    {
      title: 'Jesus',
      desc: 'We believe that Jesus Christ is the eternal Son of God, fully divine and fully human. Born of a virgin, He lived a sinless life, performed miracles, died on the cross as a perfect sacrifice for our sins, and rose again in power on the third day. He ascended into heaven and now reigns at the right hand of the Father. Jesus is the only mediator between God and man, and salvation is found in Him alone.\n📖 John 1:1–14; Luke 1:35; Hebrews 4:15; 1 Corinthians 15:3–4; John 14:6; Acts 1:9–11',
    },
    {
      title: 'Holy Spirit',
      desc: 'We believe in the person and power of the Holy Spirit, who proceeds from the Father and the Son. He dwells within every believer, empowering them to live a holy life, guiding them into all truth, convicting the world of sin, and equipping the Church with spiritual gifts. He is the Comforter, Advocate, and active presence of God in the world today. Through Him, believers are transformed into Christ’s likeness.\n📖 John 14:16–17, 26; Romans 8:14–16; Galatians 5:22–23; Acts 1:8; 1 Corinthians 12:4–11',
    },
    {
      title: 'Bible',
      desc: 'We believe the Bible is the inspired, infallible, and authoritative Word of God, written by human authors under the guidance of the Holy Spirit. It is the final authority for all doctrine, correction, instruction, and living. The Bible reveals God’s character, His redemptive plan through Christ, and provides wisdom for daily life. We believe both the Old and New Testaments are equally God-breathed and useful.\n📖 2 Timothy 3:16–17; 2 Peter 1:20–21; Hebrews 4:12; Psalm 119:105; Joshua 1:8',
    },
    {
      title: 'Trinity',
      desc: 'We believe in the one true God who exists eternally in three distinct persons — Father, Son, and Holy Spirit. These three are co-equal, co-eternal, and completely unified in essence and purpose. The Trinity is not three gods, but one God revealed in three Persons, each fully divine. This mystery reflects the richness of God’s nature and His desire to relate personally with His creation.\n📖 Matthew 28:19; 2 Corinthians 13:14; Deuteronomy 6:4; John 14:16–17',
    },
    {
      title: 'Salvation',
      desc: 'We believe salvation is a free gift from God, received by grace through faith in Jesus Christ alone. It is not earned by human works or merit, but secured through the finished work of Christ on the cross. True salvation involves repentance, a turning away from sin, and trusting in Jesus as Lord and Savior. Through salvation, we are justified, adopted into God’s family, and given eternal life.\n📖 Ephesians 2:8–9; Romans 10:9–10; Titus 3:5; Acts 4:12; 2 Corinthians 5:21',
    },
    {
      title: 'Eternity',
      desc: 'We believe in the reality of eternity — that every person will spend forever either in the presence of God or separated from Him. Heaven is the eternal dwelling place of those who are redeemed, while hell is a place of separation for those who reject Christ. Eternity begins the moment we die, and our earthly decisions shape our eternal destination. Christ offers eternal life to all who believe.\n📖 John 3:16; Matthew 25:46; Revelation 21:1–4; Revelation 20:11–15; 2 Thessalonians 1:8–9',
    },
    {
      title: 'Eternal Security',
      desc: 'We believe that true believers are eternally secure in Christ. Once saved, we are sealed with the Holy Spirit and kept by the power of God. While salvation must be genuine and not merely a profession, we trust in God\'s promise to finish the good work He begins in us. Our security rests not in our ability, but in God’s unchanging grace and faithfulness.\n📖 John 10:28–29; Romans 8:38–39; Ephesians 1:13–14; Philippians 1:6; 1 Peter 1:5',
    },
    {
      title: 'New Creation',
      desc: 'We believe that in Christ, every believer becomes a new creation — old things pass away and all things become new. This transformation is not just external but starts in the heart, resulting in a renewed mind, desires, and purpose. As new creations, we are called to walk in righteousness and reflect Christ in every area of life.\n📖 2 Corinthians 5:17; Ezekiel 36:26–27; Romans 12:2; Galatians 2:20; Ephesians 4:24',
    },
    {
      title: 'Marriage',
      desc: 'We believe that marriage is a sacred covenant instituted by God, designed to be a lifelong union between one man and one woman. It reflects the relationship between Christ and the Church, and it is a holy platform for love, unity, fruitfulness, and family. We uphold God’s design for marriage as foundational for a strong and godly society.\n📖 Genesis 2:24; Matthew 19:4–6; Ephesians 5:25–33; Hebrews 13:4; 1 Corinthians 7:2',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO BANNER WITH EMBEDDED HEADER */}
      {/* Desktop (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/About_Us_(2).png"
          alt="About Us Banner"
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
                  className={`h-10 px-4 rounded-[50px] text-base font-bold flex items-center justify-center transition-colors border ${
                    item.path === '/about-us'
                      ? 'bg-ff-primary text-ff-primary-text border-ff-primary'
                      : 'bg-transparent text-white border-ff-primary hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                to="/watch"
                className="h-10 px-5 rounded-[50px] bg-ff-secondary text-white text-sm font-bold border border-white/40 hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                Watch our Sermons
              </Link>
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
      </div>

      {/* Mobile (< 991px) */}
      <div className="block lg:hidden w-[92%] max-w-[420px] mx-auto mt-[20px] mb-[20px] h-[520px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/About_Us.png"
          alt="About Us Banner Mobile"
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

      {/* 2. THE VISION MOTTO */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-ff-secondary leading-relaxed max-w-3xl mx-auto">
          A Church that has God's heart and has You at heart.
        </p>
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          We are raising a people of Dominion and Influence through revelation knowledge and by the Spirit.
        </p>
      </section>

      {/* 3. ABOUT THE FOUNDERS */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-8 bg-ff-secondary text-white rounded-[30px] p-6 sm:p-12 shadow-md border border-ff-secondary">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 h-[380px] sm:h-[420px] rounded-[24px] overflow-hidden bg-white/5 flex items-center justify-center p-4">
            <img
              src="/assets/images/B&Z_no_background_1.png"
              alt="Apostle Bheki and Pastor Zandi Thwala"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
              Senior Pastors
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white">
              About the Founders
            </h2>
            <h3 className="text-lg sm:text-xl font-medium text-white/90">
              Apostle Bheki and Pst. Zandi Thwala
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed pt-2">
              Apostle Bheki and Pastor Zandi Thwala are powerful ministers of the Word and full of the Spirit of God, they passionately, with compassion and love, lead and pastor the EMalahleni branch. They have 4 kids and many other spiritual sons and daughters globally and have been married for over 32 years. They lead the Apostle Bheki Thwala and Pastor Zandi Thwala Ministries.
            </p>
            <div className="pt-4 flex flex-wrap gap-4 items-center">
              <a
                href="mailto:emalahleni@swordandspirit.org"
                className="px-6 py-3 rounded-[30px] bg-ff-primary text-ff-primary-text font-bold text-sm hover:bg-white/90 transition-colors flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                emalahleni@swordandspirit.org
              </a>
              <Link
                to="/locations"
                className="px-6 py-3 rounded-[30px] border border-white text-white font-bold text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Campuses</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SWORD & SPIRIT MINISTRIES & 8 BRANCHES IN 3 COUNTRIES */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 h-[400px] rounded-[30px] overflow-hidden shadow-md border border-slate-200">
          <img
            src="/assets/images/IMG-20250610-WA0009.jpg"
            alt="About Sword & Spirit Ministries"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            SERVICES
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-ff-secondary">
            About Sword & Spirit
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Sword and Spirit Ministries International was birthed in prayer in 1994 in the region of Swaziland. The visionary and founder is Apostle Bheki Thwala together with Ps Zandi Thwala. The ministry was founded to prepare God's people for the move of the Word and Spirit. The Vision is "To Raise People of Dominion and Influence Through Revelation Knowledge and by the Spirit".
          </p>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            "The Word" is referred to as "Revelation Knowledge". Sword and Spirit Ministries International exists to "Teach To Do". Teach – based on the Word and Spirit, and Do – Influence and Dominate. SSMI has local branches in Swaziland, Nigeria, and South Africa.
          </p>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-ff-secondary mb-3">
              8 Branches in 3 Countries
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-[20px] border border-slate-200">
                <img
                  src="/assets/images/swaziland_flag.png"
                  alt="Eswatini / Swaziland"
                  className="w-8 h-6 object-cover rounded shadow-sm"
                />
                <span className="text-xs font-bold text-ff-secondary">Eswatini</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-[20px] border border-slate-200">
                <img
                  src="/assets/images/RSA_flag.png"
                  alt="South Africa"
                  className="w-8 h-6 object-cover rounded shadow-sm"
                />
                <span className="text-xs font-bold text-ff-secondary">South Africa</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-[20px] border border-slate-200">
                <img
                  src="/assets/images/nigarian_flag.png"
                  alt="Nigeria"
                  className="w-8 h-6 object-cover rounded shadow-sm"
                />
                <span className="text-xs font-bold text-ff-secondary">Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOR YOUR FAMILY (4 CARDS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Ministries
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
            For your Family
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Kids & Youth */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[240px] w-full overflow-hidden">
              <img
                src="/assets/images/IMG-20250919-WA0005.jpg"
                alt="For Kids and Youth"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-bold text-ff-secondary mb-4">
                For Kids and Youth
              </h3>
              <div className="flex gap-2">
                <Link
                  to="/super-kids"
                  className="flex-1 py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
                >
                  For Kids
                </Link>
                <Link
                  to="/youth"
                  className="flex-1 py-2.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-xs font-bold text-center hover:bg-slate-100 transition-colors"
                >
                  For Youth
                </Link>
              </div>
            </div>
          </div>

          {/* Card 2: Couples */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[240px] w-full overflow-hidden">
              <img
                src="/assets/images/IMG-20250719-WA0016.jpg"
                alt="For Couples"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-bold text-ff-secondary mb-4">
                For Couples
              </h3>
              <Link
                to="/couples"
                className="w-full py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 3: For Women */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[240px] w-full overflow-hidden">
              <img
                src="/assets/images/IMG-20250919-WA0018.jpg"
                alt="For Women"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-bold text-ff-secondary mb-4">
                For Women
              </h3>
              <Link
                to="/for-women"
                className="w-full py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Card 4: For Men */}
          <div className="bg-white rounded-[30px] border border-ff-secondary overflow-hidden shadow-sm flex flex-col">
            <div className="h-[240px] w-full overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src="/assets/images/Men_of_Dominion.png"
                alt="For Men"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 flex flex-col flex-grow justify-between">
              <h3 className="text-xl font-bold text-ff-secondary mb-4">
                For Men
              </h3>
              <Link
                to="/for-men"
                className="w-full py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. LEADERSHIP (EXPANDABLE ACCORDIONS) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            SSMI Structure
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
            Leadership
          </h2>
        </div>

        <div className="space-y-6">
          {/* Accordion 1: Global Leadership */}
          <div className="border border-ff-secondary rounded-[30px] overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setGlobalLeadershipOpen(!globalLeadershipOpen)}
              className="w-full p-6 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary">
                Global Leadership
              </h3>
              <span className="text-2xl text-ff-secondary font-bold">
                {globalLeadershipOpen ? '−' : '+'}
              </span>
            </button>

            {globalLeadershipOpen && (
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200">
                {/* Apostle Bheki */}
                <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden shrink-0 border-2 border-ff-secondary shadow-md">
                    <img
                      src="/assets/images/Apostle.JPG"
                      alt="Apostle Bheki"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-ff-secondary">Apostle Bheki Thwala</h4>
                    <p className="text-xs text-ff-alternate font-bold uppercase mb-2">Founder & Senior Pastor</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      SSMI Founder & Leader of the Global Apostle Bheki Thwala Ministries.
                    </p>
                  </div>
                </div>

                {/* Pst. Zandi */}
                <div className="flex flex-col sm:flex-row gap-5 items-center bg-slate-50 p-6 rounded-[24px] border border-slate-200">
                  <div className="w-[120px] h-[120px] rounded-full overflow-hidden shrink-0 border-2 border-ff-secondary shadow-md">
                    <img
                      src="/assets/images/LMP_0088.JPG"
                      alt="Pst. Zandi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-ff-secondary">Pst. Zandi Thwala</h4>
                    <p className="text-xs text-ff-alternate font-bold uppercase mb-2">Founder & Senior Pastor</p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      SSMI Founder & Leader of the Global Pst. Zandi Thwala Ministries.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Branches Senior Pastors */}
          <div className="border border-ff-secondary rounded-[30px] overflow-hidden bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setBranchesLeadershipOpen(!branchesLeadershipOpen)}
              className="w-full p-6 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-ff-secondary">
                Branches Senior Pastors
              </h3>
              <span className="text-2xl text-ff-secondary font-bold">
                {branchesLeadershipOpen ? '−' : '+'}
              </span>
            </button>

            {branchesLeadershipOpen && (
              <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-200">
                {branchLeaders.map((pastor) => (
                  <div
                    key={pastor.branch}
                    className="bg-slate-50 rounded-[24px] p-5 border border-slate-200 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-[110px] h-[110px] rounded-full overflow-hidden bg-white shadow-inner mb-4 flex items-center justify-center border border-slate-300">
                      <img
                        src={pastor.image}
                        alt={pastor.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <h4 className="text-base font-bold text-ff-secondary">{pastor.name}</h4>
                    <span className="text-xs font-medium text-ff-alternate mt-1 mb-3">
                      {pastor.branch}
                    </span>
                    <Link
                      to={pastor.route}
                      className="mt-auto px-4 py-1.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-xs font-bold hover:bg-ff-secondary hover:text-white transition-colors"
                    >
                      Give to Branch
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. OUR BELIEFS (STATEMENTS OF FAITH) */}
      <section className="w-[90%] max-w-[1440px] mx-auto my-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
            Doctrine
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ff-secondary mt-1">
            Our Beliefs
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2">
            The foundational truths upon which Sword and Spirit Ministries International is established.
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {beliefs.map((belief, idx) => {
            const isOpen = openBeliefIndex === idx;
            return (
              <div
                key={belief.title}
                className="border border-ff-secondary rounded-[20px] overflow-hidden bg-white shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleBelief(idx)}
                  className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="text-lg font-bold text-ff-secondary">
                    {idx + 1}. {belief.title}
                  </span>
                  <span className="text-xl font-bold text-ff-secondary ml-4">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100">
                    {belief.desc}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FOOTER TOPE (WORSHIP ALBUM & MESSAGE) */}
      <FooterTope />

      {/* 9. SITE FOOTER */}
      <SiteFooter />

      {/* 10. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default AboutUsPage;
