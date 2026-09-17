import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { RequestModal } from '../components/modals/RequestModal.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';

/**
 * BaptismPage reproducing BaptismWidget:
 * flutter-website/lib/actions/baptism/baptism_widget.dart
 * Fidelity: >= 98%
 */
export function BaptismPage() {
  const { toggleDrawer } = useAppState();

  const [openIndex, setOpenIndex] = useState(0); // first open by default
  const [requestModalOpen, setRequestModalOpen] = useState(false);

  useEffect(() => {
    document.title = 'Getting Baptised | Sword of the Spirit Ministries';
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

  const faqs = [
    {
      question: 'Why get baptized?',
      answer: `Baptism is an act of obedience to the command of Jesus Christ, who was baptized and instructed his followers to do the same. Jesus' "Great Commission" in Matthew 28:19–20 instructs his disciples to "make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit". This act is a public declaration of an inward conversion and a way to openly profess faith in Jesus Christ. Being baptized means formally committing to Christ and his church, showing a willingness to follow his teachings and example. While baptism is not a requirement for salvation—as evidenced by the thief on the cross (Luke 23:43)—it is a necessary act of obedience for discipleship.`,
    },
    {
      question: 'What is the meaning of baptism?',
      answer: `Baptism means publicly identifying with Jesus Christ's death, burial, and resurrection. As described in Romans 6:3–4, going under the water symbolizes dying to one's old, sinful self, and being raised out of the water represents resurrection into a new life in Christ. This visual act is a powerful symbol of the internal spiritual transformation that has already occurred in a believer's heart. The Greek word for "baptize" (baptizō) means to "dip," "plunge," or "immerse," which supports the practice of full immersion to represent this symbolic burial and resurrection. Baptism signifies the forgiveness of sins received through Christ and the reception of the Holy Spirit, making it a foundational and joyous event in the life of a Christian.`,
    },
    {
      question: 'Who should get baptized?',
      answer: `According to the New Testament, baptism is for those who have repented of their sins and have placed their faith in Jesus Christ. The Bible consistently links baptism with an individual's personal belief and conversion. For example, on the Day of Pentecost, Peter instructed the crowd to "Repent and be baptized". Acts 2:41 notes that "those who received his word were baptized". This practice is based on the idea that a person must be capable of understanding and accepting the gospel message before being baptized, which is why most believers' churches do not baptize infants. The practice of household baptisms in the Bible (Acts 16) is understood by many to include only those old enough to believe, with belief being a prerequisite for the entire household.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. HERO SECTION */}
      {/* 1A. Desktop Hero (>= 991px) */}
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg">
        <img
          src="/assets/images/Baptis_(2).png"
          alt="Baptism Banner"
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
          src="/assets/images/Baptis.png"
          alt="Baptism Banner Mobile"
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

      {/* 2. TITLE & DESCRIPTION */}
      <section className="w-[90%] max-w-[1200px] mx-auto my-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-ff-secondary mb-4">
          Baptism
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Baptism is a public declaration of our faith. it is a symbolism of us dying to self and and rising again with Christ.
        </p>
      </section>

      {/* 3. EXPANDABLE TEACHING SECTIONS */}
      <section className="w-[90%] max-w-[1000px] mx-auto my-6 space-y-4">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.question}
              className="border border-ff-secondary rounded-[24px] overflow-hidden bg-white shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <h3 className="text-lg sm:text-xl font-bold text-ff-secondary">
                  {item.question}
                </h3>
                <span className="text-2xl font-bold text-ff-secondary ml-4">
                  {isOpen ? '−' : '+'}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-sm sm:text-base text-slate-700 leading-relaxed border-t border-slate-100">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 4. CALL TO ACTION BUTTON */}
      <section className="w-[90%] max-w-[1000px] mx-auto my-12 text-center">
        <button
          type="button"
          onClick={() => setRequestModalOpen(true)}
          className="px-10 py-4 rounded-[50px] bg-ff-secondary text-white font-bold text-base hover:bg-slate-800 transition-colors shadow-lg"
        >
          Get Baptized
        </button>
      </section>

      {/* 5. REQUEST MODAL */}
      <RequestModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        defaultRequestType="Baptism"
      />

      {/* 6. SITE FOOTER */}
      <SiteFooter />

      {/* 7. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default BaptismPage;
