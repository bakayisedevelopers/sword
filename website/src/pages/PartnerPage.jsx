import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

/**
 * PartnerPage reproducing PartnerWidget:
 * flutter-website/lib/actions/partner/partner_widget.dart
 * Fidelity: >= 98%
 */
export function PartnerPage() {
  const { toggleDrawer } = useAppState();

  useEffect(() => {
    document.title = 'Partner | Sword of the Spirit Ministries';
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
          src="/assets/images/Partner_(2).png"
          alt="Partner Banner"
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
          src="/assets/images/Partner.png"
          alt="Partner Banner Mobile"
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

      {/* 2. TITLE & INTRO */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-4">
          Be a Partner
        </h1>
        <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-3xl mx-auto">
          Firstly we would like to thank you for your willingness to partner with us in raising a people of dominion and influence.
        </p>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto mt-2">
          We don't take it lightly that you have chosen, among thousands of Churches in the world. We know that you and your family will grow to become people of dominion and influence in the church and market place. We will, with God's help, steward well yours and your family's growth.
        </p>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl mx-auto mt-2">
          We can't wait to see you, as a new creation, influence, as God intended, those God has entrusted you with.
        </p>
        <p className="text-xs font-bold text-ff-alternate uppercase tracking-wider mt-6">
          Read below information before signing up.
        </p>
      </section>

      {/* 3. PARTNERSHIP DETAILS & AGREEMENT */}
      <section className="w-[90%] max-w-[1100px] mx-auto my-6 space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
        <div className="bg-slate-50 rounded-[24px] p-6 sm:p-8 border border-slate-200">
          <p>
            Partnership is an outward and formalized sign of the commitment in an individual’s heart. As partners, we join together for God’s glory and our mutual benefit. Partnership is a commitment between the congregation’s partners, one with another and between the congregation’s leaders and partners. Partnership is recommended.
          </p>
        </div>

        {/* Section A */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-ff-secondary shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary">
            Section A: Partnership Requirements
          </h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Have a personal relationship with Jesus Christ (born again) — Ephesians 2:4-10</li>
            <li>Be baptised in water following salvation — Matthew 28:19; Colossians 2:12</li>
            <li>Attend our partnership class.</li>
            <li>Attend our online Bible study and Thursday services.</li>
            <li>Be actively involved in a ministry and continue pursuing it when partnership requirements are finished.</li>
            <li>
              Carefully read and pray about the membership commitment. If you feel led to make this commitment, complete the membership application online or on paper, and be sure to send a photo of yourself to <a href="mailto:info@swordandspirit.org" className="text-ff-alternate font-bold underline">info@swordandspirit.org</a>. If your application is approved, you will be invited to a partnership class and subsequently be welcomed as a partner.
            </li>
          </ol>
        </div>

        {/* Section B */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-ff-secondary shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary">
            Section B: About Sword and Spirit Ministries International
          </h2>
          <p>
            The Bible uses many pictures to describe Christians as a community: a household (Eph. 2:19), a human body (1 Cor. 12:12-31) and a temple made up of “living stones” (1 Pet. 2:4-5, Eph. 2:21). All of these illustrate and mandate our interconnectedness and our need for each other. When a believer joins a particular congregation, he or she is bearing witness to a union that has already happened in the heart.
          </p>
          <p>
            You don’t need to become a partner to thrive and be actively involved at Sword and Spirit Ministries International Church. In fact, many of the Sword and Spirit Ministries International family are not partners. But for those who do choose to become partners, we believe that there are many joys and benefits in making this commitment.
          </p>
          <p>
            Our church vision; is to raise a people of dominion and influence through revelation, knowledge, and by the spirit. We are a church with God’s heart, and we have people at heart. The church is founded upon Jer. 1:10. Our Mission is fellowship, evangelism, worship, discipleship, and service, simply known as <strong>FEWDS</strong>.
          </p>
          <p>
            Our covenant with God and our commitment to one another work to shape our culture and our community. Partnership is an outward, formalized sign of the inward, mutual commitment we have made with each other and the Lord. This commitment helps to define not only our role, but also the intention of our heart; it affects our decisions and influences our perspective. This commitment is costly, but the payoff is immense.
          </p>
          <p>
            As partners, we join together for God’s glory and our mutual benefit; we share the responsibilities and rewards of all that God will accomplish through us. In addition, as outlined in our bylaws, partnership is an important component in our relationship with the U.S. government and the proper stewardship of the resources God has entrusted to our congregation over the years.
          </p>
          <p>
            When you become a partner, you are joining the church of Sword and Spirit Ministries International Emalahleni regardless of which campus you attend. The partnership process and commitments are the same for all campuses.
          </p>
        </div>

        {/* Section b2 */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-ff-secondary shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary">
            Section b2: Our Commitment To You
          </h2>
          <p>
            As your leaders, we will foster a trustworthy leadership team that submits to the authority of the Word of God (1 Tim. 3:1-13 & Titus 1:6-9, 1 Peter 5:1-7). We commit to prepare you “for works of service so that the body of Christ may be built up until we all reach unity in the faith and the knowledge of the Son of God and become mature attaining to the whole measure of the fullness of Christ” (Eph. 4:12-13). We will seek to set an example in speech, life, love, faith and purity (1 Tim. 4:12) and accurately teach the Word of Truth (2 Tim. 2:15). We are willing shepherds of “God’s flock” (1 Peter 5:2) holding one another to the expectations written below. We will be approachable and teachable and create a church family full of faith, hope, love and joy!
          </p>
        </div>

        {/* Section b3 */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-ff-secondary shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-ff-secondary">
            Section b3: Your Commitment
          </h2>
          <p className="font-semibold text-ff-secondary">
            By signing this commitment, you acknowledge your need to cooperate with God’s love and power as He establishes righteousness in all of us, which we cannot create on our own. I affirm the following:
          </p>
          <ul className="space-y-2 pl-4">
            <li>• I have been saved by grace through faith in Jesus Christ and boast in Him, not myself (Eph. 2:4-10).</li>
            <li>• I have been baptized in water at some point in my life, signifying my conversion and new life in God (Matt. 28:19; Col. 2:12).</li>
            <li>• I will take responsibility as a disciple of Jesus to continue to nurture my own close, obedient, loving friendship with the Lord (John 15:1-17).</li>
            <li>• My life evidences a genuine experience of regeneration - the new birth (John 1:12-13, 3:3-8; I Peter 1:18-25) and a commitment to holiness, wholeness and our church family (Romans 6:4, 8:1-4, 13:13-14; Eph. 4:17-32, 5:1-2, 15; I John 1:6-7). Specifically, I affirm the sacredness of sexuality and marriage. In marriage, I will be completely faithful to my spouse (Heb. 13:4). I believe Scripture teaches that sex is a blessing to be rightly experienced only within heterosexual marriage. Therefore, I will avoid sex outside of marriage, pornography, living as husband and wife when not married and/or homosexuality (Matt. 15:19, Rom. 13:13, 1 Cor. 6:9-20). As well, I will follow the wisdom of the Lord by refraining from intoxication with alcohol and/or drugs (Rom. 13:13, Gal. 5:19-21). Should I stumble in any of these areas, I will get up again with the help of the Holy Spirit and my church family!</li>
            <li>• I have read and am in agreement with Sword and Spirit Ministries International constitution Policy, Statement on Biblical Authority, and POPIA Policy.</li>
            <li>• I will contribute regularly to the support of the congregation in the form of tithes, offerings, time and attendance.</li>
            <li>• I agree to be governed by the congregation’s constitution policy as they pertain to church life.</li>
            <li>• If offended, I would not abandon this commitment but would speak the truth in love (Eph. 4:25) and work through conflict with gentleness, grace and forgiveness (Eph.4:1-3).</li>
            <li>• I will be thankful (Col. 3:15) and live humbly and honourably in all my relationships with both Christians (Eph. 4:1-6) and non-Christians so as to be a faithful ambassador of Christ’s kingdom (2 Cor. 5:20).</li>
            <li>• I will be accountable to keep these commitments and welcome correction in my life and doctrine if need be.</li>
            <li>• If the Lord seems to be transitioning me to a different church, I will not simply leave but consider this transition with the community and redefine this commitment with Sword and Spirit Ministries International Church. SSMI-Emalahleni will transfer partnership to other congregations when requested to do so.</li>
          </ul>
        </div>

        <div className="text-center pt-4 space-y-4">
          <p className="text-sm text-slate-500">
            You can always download a hard copy of this form if you prefer a hardcopy and email it to <a href="mailto:info@swordandspirit.org" className="underline font-bold">info@swordandspirit.org</a> or drop it at your branch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/assets/files/Partnership_Form.pdf"
              download
              className="px-8 py-3.5 rounded-[50px] border border-ff-secondary text-ff-secondary text-sm font-bold hover:bg-slate-50 transition-colors"
            >
              Download Here
            </a>

            <Link
              to="/be-a-partner"
              className="px-10 py-3.5 rounded-[50px] bg-ff-secondary text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg inline-flex items-center gap-1.5"
            >
              <span>Fill Form</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default PartnerPage;
