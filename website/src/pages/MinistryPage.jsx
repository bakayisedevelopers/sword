import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, useParams, Link } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { isFutureEvent, formatDateTime } from '../lib/format.js';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { SignUpModal } from '../components/modals/SignUpModal.jsx';
import { LoadingSpinner } from '../components/ui/LoadingSpinner.jsx';
import { ChevronRight } from '../components/common/Icons.jsx';

function normalizeSlug(value = '') {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Built-in authentic details for all 16 target ministries and conferences
const seedMinistriesBySlug = {
  'fire-conference': {
    name: 'Fire Conference',
    ministryName: 'Fire Conference',
    slug: 'fire-conference',
    type: 'conference',
    FEWDS: 'Evangelism',
    description: 'An explosive annual gathering focused on spiritual revival, prophetic impartation, and Kingdom power.',
    tagline: 'Igniting Hearts & Empowering Believers Across Nations',
    picture: '/assets/images/FireConf_(2).png',
    heroDesktopImage: '/assets/images/FireConf_(2).png',
    heroMobileImage: '/assets/images/FireConf.png',
    meetingDetails: 'Annual conference held at designated SSMI regional centers. Specific schedules and keynote sessions are published prior to the gathering.',
    meetingFrequency: 'Annual Gathering',
    servingDetails: 'Join our host team, prayer intercessors, security, media, sound engineering, or hospitality crew.',
    contactName: 'Fire Conference Committee',
    contactEmail: 'fireconf@swordandspirit.org',
    contactWhatsApp: '+26876000000',
    scriptureQuote: '“But you will receive power when the Holy Spirit comes on you; and you will be my witnesses in Jerusalem, and in all Judea and Samaria, and to the ends of the earth.”',
    scriptureRef: '— Acts 1:8',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Lagos'],
  },
  'superman-conference': {
    name: 'Superman Conference',
    ministryName: 'Superman Conference',
    slug: 'superman-conference',
    type: 'conference',
    FEWDS: 'Discipleship',
    description: 'Empowering men to rise into spiritual leadership, strength, integrity, and godly authority in home, church, and society.',
    tagline: 'Building Men of Honor & Dominion',
    picture: '/assets/images/SuperKids.png',
    heroDesktopImage: '/assets/images/SuperKids.png',
    heroMobileImage: '/assets/images/SuperKids.png',
    meetingDetails: 'Held annually across major SSMI campuses, featuring workshops, keynote sessions, and brotherhood fellowship.',
    meetingFrequency: 'Annual Conference',
    servingDetails: 'Serve in logistics, ushering, sound engineering, media, or hospitality for the Men’s Conference.',
    contactName: 'Men’s Ministry Leadership',
    contactEmail: 'superman@swordandspirit.org',
    contactWhatsApp: '+26876000001',
    scriptureQuote: '“Be on your guard; stand firm in the faith; be courageous; be strong. Do everything in love.”',
    scriptureRef: '— 1 Corinthians 16:13–14',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
  },
  'camp-yolo': {
    name: 'Camp YOLO',
    ministryName: 'Camp YOLO',
    slug: 'camp-yolo',
    type: 'conference',
    FEWDS: 'Fellowship',
    description: 'Youth Living Out Loud! An immersive retreat packed with worship, Bible teaching, outdoor activities, and youth connection.',
    tagline: 'Youth Living Out Loud for Jesus',
    picture: '/assets/images/CampYolo.png',
    heroDesktopImage: '/assets/images/CampYolo.png',
    heroMobileImage: '/assets/images/CampYolo.png',
    meetingDetails: 'Annual youth camp held during school holidays at selected retreat centers.',
    meetingFrequency: 'Annual Camp & Retreat',
    servingDetails: 'Counselors, team leaders, games coordinators, logistics assistants, and medical personnel needed.',
    contactName: 'Youth Pastor & Camp Directors',
    contactEmail: 'yolo@swordandspirit.org',
    contactWhatsApp: '+26876000002',
    scriptureQuote: '“Don’t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.”',
    scriptureRef: '— 1 Timothy 4:12',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg'],
  },
  'youth': {
    name: 'Youth Ministry',
    ministryName: 'Youth Ministry',
    slug: 'youth',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Equipping teenagers and young believers to stand uncompromised in their faith, cultivate spiritual gifts, and impact their schools.',
    tagline: 'Empowering the Next Generation',
    picture: '/assets/images/Youth.png',
    heroDesktopImage: '/assets/images/Youth.png',
    heroMobileImage: '/assets/images/Youth.png',
    meetingDetails: 'Meets every Friday at 17:00 across SSMI branches for passionate worship, the Word, and fellowship.',
    meetingFrequency: 'Every Friday at 17:00',
    servingDetails: 'Youth worship team, media, small group leaders, ushering, and event setup team.',
    contactName: 'Youth Coordinator',
    contactEmail: 'youth@swordandspirit.org',
    contactWhatsApp: '+26876000003',
    scriptureQuote: '“Don’t let anyone look down on you because you are young, but set an example for the believers in speech, in conduct, in love, in faith and in purity.”',
    scriptureRef: '— 1 Timothy 4:12',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
  },
  'for-men': {
    name: 'For Men',
    ministryName: 'Men of Dominion',
    slug: 'for-men',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Fostering authentic brotherhood, spiritual maturity, leadership development, and prayer among men of all ages.',
    tagline: 'Men Standing in Dominion & Integrity',
    picture: '/assets/images/Ladies.png',
    heroDesktopImage: '/assets/images/Ladies.png',
    heroMobileImage: '/assets/images/Ladies.png',
    meetingDetails: 'Monthly Saturday morning breakfast meetings and bi-weekly prayer calls across campuses.',
    meetingFrequency: 'Monthly Saturday Breakfast & Bi-weekly Prayer',
    servingDetails: 'Mentorship, event logistics, ushering, men’s choir, and community outreach.',
    contactName: 'Men’s Ministry Leader',
    contactEmail: 'men@swordandspirit.org',
    contactWhatsApp: '+26876000004',
    scriptureQuote: '“As iron sharpens iron, so one person sharpens another.”',
    scriptureRef: '— Proverbs 27:17',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Lagos'],
  },
  'for-women': {
    name: 'For Women',
    ministryName: 'Women of Virtue & Power',
    slug: 'for-women',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Uniting women in prayer, Bible study, holistic empowerment, mentorship, and impactful community service.',
    tagline: 'Women Flourishing in Faith & Grace',
    picture: '/assets/images/Ladies.png',
    heroDesktopImage: '/assets/images/Ladies.png',
    heroMobileImage: '/assets/images/Ladies.png',
    meetingDetails: 'Monthly women’s gatherings and bi-weekly prayer circles across campuses.',
    meetingFrequency: 'Monthly Gatherings & Bi-weekly Prayer Circles',
    servingDetails: 'Prayer team, hospitality, event coordination, welfare support, and mentorship.',
    contactName: 'Women’s Ministry Leader',
    contactEmail: 'women@swordandspirit.org',
    contactWhatsApp: '+26876000005',
    scriptureQuote: '“She is clothed with strength and dignity; she can laugh at the days to come.”',
    scriptureRef: '— Proverbs 31:25',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
  },
  'for-couples': {
    name: 'For Couples',
    ministryName: 'Couples Ministry',
    slug: 'for-couples',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Strengthening marital bonds, fostering Biblical relationship principles, and building healthy, lasting Christian families.',
    tagline: 'Building Strong, Christ-Centered Marriages',
    picture: '/assets/images/Couples_(2).png',
    heroDesktopImage: '/assets/images/Couples_(2).png',
    heroMobileImage: '/assets/images/Couples.png',
    meetingDetails: 'Quarterly couples dinners, marriage enrichment seminars, and annual relationship retreats.',
    meetingFrequency: 'Quarterly Dinners & Annual Retreats',
    servingDetails: 'Event planning, couples counseling support, seminar hospitality, and host team.',
    contactName: 'Marriage Directors',
    contactEmail: 'couples@swordandspirit.org',
    contactWhatsApp: '+26876000006',
    scriptureQuote: '“Therefore what God has joined together, let no one separate.”',
    scriptureRef: '— Mark 10:9',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg'],
  },
  'couples': {
    name: 'For Couples',
    ministryName: 'Couples Ministry',
    slug: 'for-couples',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Strengthening marital bonds, fostering Biblical relationship principles, and building healthy, lasting Christian families.',
    tagline: 'Building Strong, Christ-Centered Marriages',
    picture: '/assets/images/Couples_(2).png',
    heroDesktopImage: '/assets/images/Couples_(2).png',
    heroMobileImage: '/assets/images/Couples.png',
    meetingDetails: 'Quarterly couples dinners, marriage enrichment seminars, and annual relationship retreats.',
    meetingFrequency: 'Quarterly Dinners & Annual Retreats',
    servingDetails: 'Event planning, couples counseling support, seminar hospitality, and host team.',
    contactName: 'Marriage Directors',
    contactEmail: 'couples@swordandspirit.org',
    contactWhatsApp: '+26876000006',
    scriptureQuote: '“Therefore what God has joined together, let no one separate.”',
    scriptureRef: '— Mark 10:9',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg'],
  },
  'singles': {
    name: 'Singles Ministry',
    ministryName: 'Singles Ministry',
    slug: 'singles',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Empowering unmarried adults to live purposefully, grow in Christ, and navigate career, relationships, and calling.',
    tagline: 'Purposeful Living in Christ',
    picture: '/assets/images/Felloship_(2).png',
    heroDesktopImage: '/assets/images/Felloship_(2).png',
    heroMobileImage: '/assets/images/Felloship.png',
    meetingDetails: 'Monthly social gatherings, interactive workshops, and career & relationship seminars.',
    meetingFrequency: 'Monthly Socials & Interactive Workshops',
    servingDetails: 'Event hosts, discussion facilitators, sound & media, and community outreach.',
    contactName: 'Singles Coordinator',
    contactEmail: 'singles@swordandspirit.org',
    contactWhatsApp: '+26876000007',
    scriptureQuote: '“I have come that they may have life, and have it to the full.”',
    scriptureRef: '— John 10:10',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
  },
  'young-adults': {
    name: 'Young Adults',
    ministryName: 'Young Adults Ministry',
    slug: 'young-adults',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Connecting university students and young professionals (ages 18–35) in passionate worship, discipleship, and kingdom impact.',
    tagline: 'Passion, Purpose & Leadership',
    picture: '/assets/images/Youth.png',
    heroDesktopImage: '/assets/images/Youth.png',
    heroMobileImage: '/assets/images/Youth.png',
    meetingDetails: 'Bi-weekly Friday evening fellowship and monthly campus worship nights.',
    meetingFrequency: 'Bi-weekly Fridays & Monthly Worship Nights',
    servingDetails: 'Worship team, small group leaders, media, ushering, and campus outreach.',
    contactName: 'Young Adults Leader',
    contactEmail: 'youngadults@swordandspirit.org',
    contactWhatsApp: '+26876000008',
    scriptureQuote: '“Let your light shine before others, that they may see your good deeds and glorify your Father in heaven.”',
    scriptureRef: '— Matthew 5:16',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
  },
  'super-kids': {
    name: 'Super Kids',
    ministryName: 'Children’s Church (Super Kids)',
    slug: 'super-kids',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Nurturing children (ages 2–12) in God’s Word through fun, creative lessons, worship, crafts, and interactive prayer.',
    tagline: 'Laying Solid Foundations in Little Hearts',
    picture: '/assets/images/SuperKids.png',
    heroDesktopImage: '/assets/images/SuperKids.png',
    heroMobileImage: '/assets/images/SuperKids.png',
    meetingDetails: 'Runs parallel to Sunday adult services at 09:00 AM across all SSMI branches.',
    meetingFrequency: 'Every Sunday at 09:00 AM',
    servingDetails: 'Sunday school teachers, classroom helpers, child check-in registration crew, and praise team.',
    contactName: 'SuperKids Coordinator',
    contactEmail: 'kids@swordandspirit.org',
    contactWhatsApp: '+26876000009',
    scriptureQuote: '“Start children off on the way they should go, and even when they are old they will not turn from it.”',
    scriptureRef: '— Proverbs 22:6',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
  },
  'welfare': {
    name: 'Welfare Ministry',
    ministryName: 'Welfare & Benevolence',
    slug: 'welfare',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Demonstrating Christ’s love by providing food, clothing, emergency financial assistance, and compassionate care to families in need.',
    tagline: 'Hands & Feet of Jesus in Our Communities',
    picture: '/assets/images/Care_(2).png',
    heroDesktopImage: '/assets/images/Care_(2).png',
    heroMobileImage: '/assets/images/Care.png',
    meetingDetails: 'Weekly food hamper distribution and emergency care support coordination across local branches.',
    meetingFrequency: 'Weekly Care Support & Monthly Distribution',
    servingDetails: 'Food drive collection, hamper packing, home visitation team, and community distribution.',
    contactName: 'Welfare Department Head',
    contactEmail: 'welfare@swordandspirit.org',
    contactWhatsApp: '+26876000010',
    scriptureQuote: '“Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress.”',
    scriptureRef: '— James 1:27',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
  },
  'counseling': {
    name: 'Counseling Ministry',
    ministryName: 'Pastoral Counseling',
    slug: 'counseling',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Providing confidential, Scripture-based guidance, emotional support, and spiritual healing for individuals, couples, and families.',
    tagline: 'Confidential Spiritual & Pastoral Guidance',
    picture: '/assets/images/Counselling_(2).png',
    heroDesktopImage: '/assets/images/Counselling_(2).png',
    heroMobileImage: '/assets/images/Counselling.png',
    meetingDetails: 'Available by appointment during weekday office hours and post-service on Sundays.',
    meetingFrequency: 'By Appointment & Post-Service Sundays',
    servingDetails: 'Trained lay counselors, prayer partners, and appointment receptionists.',
    contactName: 'Head Counselor',
    contactEmail: 'counseling@swordandspirit.org',
    contactWhatsApp: '+26876000011',
    scriptureQuote: '“Carry each other’s burdens, and in this way you will fulfill the law of Christ.”',
    scriptureRef: '— Galatians 6:2',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
  },
  'fellowship': {
    name: 'Fellowship Ministry',
    ministryName: 'Fellowship & Cell Groups',
    slug: 'fellowship',
    type: 'normal',
    FEWDS: 'Fellowship',
    description: 'Connecting believers in small group home cell fellowships for Bible study, mutual encouragement, prayer, and community life.',
    tagline: 'Growing Together in Home & Life Groups',
    picture: '/assets/images/Felloship_(2).png',
    heroDesktopImage: '/assets/images/Felloship_(2).png',
    heroMobileImage: '/assets/images/Felloship.png',
    meetingDetails: 'Weekly home cell meetings every Wednesday evening from 18:00 to 19:30 in neighborhoods.',
    meetingFrequency: 'Every Wednesday Evening from 18:00 to 19:30',
    servingDetails: 'Home cell hosts, discussion facilitators, neighborhood coordinators, and hospitality teams.',
    contactName: 'Cell Group Overseer',
    contactEmail: 'fellowship@swordandspirit.org',
    contactWhatsApp: '+26876000012',
    scriptureQuote: '“They devoted themselves to the apostles’ teaching and to fellowship, to the breaking of bread and to prayer.”',
    scriptureRef: '— Acts 2:42',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
  },
  'school-of-ministry': {
    name: 'School of Ministry',
    ministryName: 'SSMI School of Ministry',
    slug: 'school-of-ministry',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Comprehensive theological training, leadership certification, and practical ministry preparation for aspiring leaders and ministers.',
    tagline: 'Equipping Leaders for Kingdom Impact',
    picture: '/assets/images/Minstries_(2).png',
    heroDesktopImage: '/assets/images/Minstries_(2).png',
    heroMobileImage: '/assets/images/Minstries.png',
    meetingDetails: 'Saturday intensive modules and weekday evening online lectures via the student portal.',
    meetingFrequency: 'Saturday Intensives & Weekday Online Lectures',
    servingDetails: 'Academic admin, registrar support, library management, and online lecture facilitators.',
    contactName: 'Dean of Academics',
    contactEmail: 'som@swordandspirit.org',
    contactWhatsApp: '+26876000013',
    scriptureQuote: '“And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others.”',
    scriptureRef: '— 2 Timothy 2:2',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
  },
  'baptism': {
    name: 'Baptism Ministry',
    ministryName: 'Water Baptism',
    slug: 'baptism',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Guiding new believers through water baptism classes and celebrating their public confession of faith in Jesus Christ.',
    tagline: 'Buried with Him in Baptism, Raised to Walk in Newness of Life',
    picture: '/assets/images/Baptis_(2).png',
    heroDesktopImage: '/assets/images/Baptis_(2).png',
    heroMobileImage: '/assets/images/Baptis.png',
    meetingDetails: 'Monthly baptism classes followed by baptism celebration services at designated campus baptistries.',
    meetingFrequency: 'Monthly Classes & Baptism Services',
    servingDetails: 'Baptism preparation crew, towel/gown hospitality team, and registration assistants.',
    contactName: 'Baptism Coordinator',
    contactEmail: 'baptism@swordandspirit.org',
    contactWhatsApp: '+26876000014',
    scriptureQuote: '“We were therefore buried with him through baptism into death in order that, just as Christ was raised from the dead through the glory of the Father, we too may live a new life.”',
    scriptureRef: '— Romans 6:4',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
  },
  'prayer': {
    name: 'Prayer Ministry',
    ministryName: 'Intercessory Prayer',
    slug: 'prayer',
    type: 'normal',
    FEWDS: 'Worship',
    description: 'Standing in the gap for the church, leaders, nations, and individual prayer requests through continuous intercessory prayer.',
    tagline: 'The House of Prayer for All Nations',
    picture: '/assets/images/Care_(2).png',
    heroDesktopImage: '/assets/images/Care_(2).png',
    heroMobileImage: '/assets/images/Care.png',
    meetingDetails: 'Pre-service Sunday intercessory prayer at 08:30 AM and Thursday evening churchwide prayer from 18:30 to 19:30.',
    meetingFrequency: 'Sundays at 08:30 AM & Thursdays at 18:30',
    servingDetails: 'Intercessors, altar prayer ministers, and online prayer chain team.',
    contactName: 'Prayer Director',
    contactEmail: 'prayer@swordandspirit.org',
    contactWhatsApp: '+26876000015',
    scriptureQuote: '“Rejoice always, pray continually, give thanks in all circumstances; for this is God’s will for you in Christ Jesus.”',
    scriptureRef: '— 1 Thessalonians 5:16–18',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos', 'Online'],
  },
};

/**
 * Revamped MinistryPage serving as an inspiring dynamic landing page for Ministries & Conferences.
 */
export function MinistryPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = useParams();
  const queryParam = searchParams.get('id') || searchParams.get('name') || '';
  const pathSlug = params.slug || params.branchSlug || location.pathname.split('/').filter(Boolean).pop() || '';

  const { toggleDrawer } = useAppState();
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const { data: firestoreMinistries, loading: loadingMinistries } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const { data: dbBranches } = useFirestoreQuery(COLLECTIONS.BRANCHES);
  const { data: events } = useFirestoreQuery(COLLECTIONS.EVENTS);

  const ministry = useMemo(() => {
    const targetSlug = normalizeSlug(queryParam || pathSlug);

    // Look for matching document from live Firestore
    let matchedDoc = null;
    if (firestoreMinistries && firestoreMinistries.length > 0) {
      matchedDoc = firestoreMinistries.find((m) => {
        if (m.id === queryParam || m.id === pathSlug) return true;
        if (m.slug && normalizeSlug(m.slug) === targetSlug) return true;
        const nameSlug = normalizeSlug(m.name || m.ministryName || '');
        return nameSlug === targetSlug;
      });

      if (!matchedDoc && queryParam) {
        matchedDoc = firestoreMinistries.find(
          (m) =>
            m.id === queryParam ||
            (m.name && m.name.toLowerCase() === queryParam.toLowerCase())
        );
      }
    }

    const specificSeed = seedMinistriesBySlug[targetSlug];

    // If live Firestore document exists, use its actual dynamic content
    if (matchedDoc) {
      const fallbackName = matchedDoc.name || matchedDoc.ministryName || 'Ministry';
      const dynamicDefaults = {
        name: fallbackName,
        ministryName: fallbackName,
        slug: matchedDoc.slug || targetSlug,
        type: matchedDoc.type || 'normal',
        branch: matchedDoc.branch || 'Global',
        FEWDS: matchedDoc.FEWDS || matchedDoc.fewds || 'Ministry',
        tagline: matchedDoc.tagline || `Dedicated to Purpose, Discipleship & Service in ${fallbackName}`,
        description: matchedDoc.description || `Welcome to ${fallbackName} at Sword of the Spirit Ministries International. We are committed to building disciples and serving our community with excellence.`,
        meetingDetails: matchedDoc.meetingDetails || 'Regular services and departmental gatherings at your local campus.',
        meetingFrequency: matchedDoc.meetingFrequency || 'Weekly / Scheduled Sessions',
        servingDetails: matchedDoc.servingDetails || 'Get involved by volunteering your gifts and talents in this ministry.',
        contactName: matchedDoc.contactName || `${fallbackName} Team`,
        contactEmail: matchedDoc.contactEmail || 'info@swordofthespirit.org.za',
        contactWhatsApp: matchedDoc.contactWhatsApp || '+27 13 656 2000',
        howToJoin: matchedDoc.howToJoin || 'Click the Sign Up button above or visit the Information Desk at any Sunday service.',
      };

      return {
        ...dynamicDefaults,
        ...(specificSeed || {}),
        ...matchedDoc,
      };
    }

    return specificSeed || seedMinistriesBySlug['youth'];
  }, [firestoreMinistries, queryParam, pathSlug]);

  const ministryName = ministry?.name || ministry?.ministryName || 'Ministry';
  const customHeroImage = ministry?.picture || ministry?.heroDesktopImage || ministry?.image || '';
  const isConference = ministry?.type === 'conference';

  // Fallback to Our Ministries images (or Our Events for conferences) when no custom hero image is provided
  const desktopHeroSrc = customHeroImage || (isConference ? '/assets/images/events_(2).png' : '/assets/images/Minstries_(2).png');
  const mobileHeroSrc = customHeroImage || (isConference ? '/assets/images/events.png' : '/assets/images/Minstries.png');

  useEffect(() => {
    document.title = `${ministryName} | Sword of the Spirit Ministries`;
    window.scrollTo(0, 0);
  }, [ministryName]);

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const defaultOfficialBranches = [
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

  const branchesList = useMemo(() => {
    if (ministry?.branches && Array.isArray(ministry.branches) && ministry.branches.length > 0) {
      return ministry.branches;
    }
    if (dbBranches && dbBranches.length > 0) {
      const names = dbBranches.map((b) => b.name || b.id).filter(Boolean);
      return Array.from(new Set(names));
    }
    return defaultOfficialBranches;
  }, [ministry?.branches, dbBranches]);

  // Filter future events linked to this ministry
  const ministryEvents = useMemo(() => {
    if (!events || !events.length) return [];
    const targetName = ministryName.toLowerCase();
    const targetId = ministry?.id;

    return events
      .filter(isFutureEvent)
      .filter((ev) => {
        if (targetId && (ev.ministryId === targetId || ev.ministry_id === targetId)) return true;
        const evMinistry = `${ev.ministryName || ev.ministry || ''}`.toLowerCase();
        if (evMinistry && evMinistry === targetName) return true;
        const evTitle = `${ev.title || ''}`.toLowerCase();
        return evTitle.includes(targetName) || (targetName.includes('conference') && evTitle.includes('conference'));
      })
      .sort((a, b) => {
        const dateA = a.date ? (typeof a.date.toDate === 'function' ? a.date.toDate() : new Date(a.date)) : new Date(0);
        const dateB = b.date ? (typeof b.date.toDate === 'function' ? b.date.toDate() : new Date(b.date)) : new Date(0);
        return dateA - dateB;
      });
  }, [events, ministryName, ministry?.id]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text font-sans">
      {/* 1. TOP NAVBAR */}
      <header className="w-[90%] max-w-[1440px] mx-auto mt-6 mb-4">
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
      </header>

      {/* Back Breadcrumb */}
      <div className="w-[90%] max-w-[1440px] mx-auto py-2 flex items-center justify-between">
        <Link
          to="/ministries"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ff-secondary hover:text-ff-alternate transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>All Ministries & Conferences</span>
        </Link>
      </div>

      {/* 2. INSPIRING HERO SECTION */}
      {/* Desktop Hero Banner (>= 991px) */}
      <section className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-2 mb-10 h-[480px] rounded-[32px] border border-ff-secondary/40 relative overflow-hidden shadow-xl bg-slate-100">
        <img
          src={desktopHeroSrc}
          alt={`${ministryName} Banner`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="absolute inset-0 p-8 sm:p-12 flex flex-col justify-end z-10 pointer-events-none">
          <div className="max-w-3xl space-y-4 p-6 sm:p-8 rounded-[24px] bg-white/95 backdrop-blur-md border border-slate-200/80 pointer-events-auto shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 rounded-full bg-brand-gold text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-sm">
                {isConference ? 'Annual Conference' : 'SSMI Ministry'}
              </span>
              {ministry?.FEWDS && (
                <span className="px-4 py-1.5 rounded-full bg-slate-100 text-ff-secondary border border-slate-200 font-bold text-xs uppercase tracking-wider">
                  Pillar: {ministry.FEWDS}
                </span>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-ff-secondary tracking-tight leading-tight">
              {ministryName}
            </h1>

            <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed line-clamp-3">
              {ministry?.description ||
                'Equipping, connecting, and empowering believers to grow spiritually and fulfill God’s purpose with boldness, dominion, and excellence.'}
            </p>
          </div>
        </div>
      </section>

      {/* Mobile Hero Banner (< 991px) */}
      <section className="block lg:hidden w-[90%] mx-auto mt-2 mb-8 rounded-[28px] border border-ff-secondary/40 relative overflow-hidden shadow-lg bg-slate-100 min-h-[360px] flex flex-col justify-end p-4 sm:p-6">
        <img
          src={mobileHeroSrc}
          alt={`${ministryName} Mobile Banner`}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        <div className="relative z-10 space-y-3 p-5 rounded-[20px] bg-white/95 backdrop-blur-md border border-slate-200/80 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-brand-gold text-slate-950 font-extrabold text-[11px] uppercase tracking-wider">
              {isConference ? 'Conference' : 'Ministry'}
            </span>
            {ministry?.FEWDS && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-ff-secondary font-bold text-[11px]">
                {ministry.FEWDS}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ff-secondary leading-tight">
            {ministryName}
          </h1>

          <p className="text-sm text-slate-700 line-clamp-2">
            {ministry?.description || 'Equipping and empowering believers to grow and fulfill God’s mandate.'}
          </p>
        </div>
      </section>

      {/* 3. MAIN CONTENT BODY */}
      <main className="w-[90%] max-w-[1440px] mx-auto flex-1 space-y-12 mb-16">
        {loadingMinistries && !ministry ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size={40} color="#192431" />
          </div>
        ) : (
          <>
            {/* 3A. MISSION & ABOUT SECTION */}
            <section className="bg-white rounded-[30px] border border-ff-secondary/20 p-8 sm:p-12 shadow-sm">
              <div className="max-w-4xl space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-ff-alternate">
                  About {ministryName}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-ff-secondary leading-tight">
                  {ministry?.tagline || 'Walking in Purpose, Fellowship & Spiritual Victory'}
                </h2>
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {ministry?.description ||
                    'Sword of the Spirit Ministries is committed to nurturing an environment where every member discovers their calling, builds life-transforming relationships, and walks in kingdom authority.'}
                </p>

                {/* Inspirational Scripture Quote */}
                {ministry?.scriptureQuote && (
                  <div className="p-5 rounded-[20px] bg-amber-50/70 border border-amber-200/60 border-l-4 border-l-brand-gold">
                    <p className="text-sm font-semibold italic text-slate-800">
                      {ministry.scriptureQuote}
                    </p>
                    <p className="text-xs font-bold text-ff-alternate mt-2">
                      {ministry.scriptureRef || '— The Holy Bible'}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* 3B. BRANCH MEETING TIMES & SCHEDULES SECTION */}
            <section id="schedules" className="bg-white rounded-[30px] border border-ff-secondary/20 p-8 sm:p-12 shadow-sm space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ff-alternate">
                    Campus Schedule
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-ff-secondary mt-1">
                    Meeting Times & Gatherings
                  </h2>
                </div>

                {/* Branch Selection Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 hidden sm:inline">
                    Branch:
                  </span>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="h-11 px-4 rounded-[12px] border border-slate-300 bg-white text-ff-secondary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ff-secondary cursor-pointer shadow-sm"
                  >
                    <option value="All">All SSMI Campuses</option>
                    {branchesList.map((branch, idx) => (
                      <option key={idx} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Meeting Details Column */}
                <div className="md:col-span-7 p-6 rounded-[24px] bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-ff-secondary">
                      Gathering Details ({selectedBranch === 'All' ? 'All Locations' : selectedBranch})
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-ff-secondary text-white text-xs font-bold">
                      Active
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                    {ministry?.meetingDetails ||
                      `Regular gatherings and events for ${ministryName} are hosted across all participating SSMI branches. Check our events calendar below for special conferences and weekend sessions.`}
                  </p>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-800 block">Schedule / Frequency:</span>
                      <span>{ministry?.meetingFrequency || (isConference ? 'Annual Gathering' : 'Regular Campus Meetings')}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Active Campus:</span>
                      <span>{selectedBranch === 'All' ? 'All Active SSMI Branches' : selectedBranch}</span>
                    </div>
                  </div>
                </div>

                {/* Serving & Volunteering Column */}
                <div className="md:col-span-5 p-6 rounded-[24px] bg-slate-50 border border-slate-200 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-ff-secondary">Serve in {ministryName}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {ministry?.servingDetails ||
                        'Volunteers form the heartbeat of this ministry. Step into your God-given purpose, grow your gifts, and build lifelong kingdom friendships.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSignUpOpen(true)}
                    className="w-full py-3.5 rounded-[50px] bg-ff-secondary text-white font-bold text-sm hover:bg-slate-800 transition-colors shadow cursor-pointer"
                  >
                    Sign Up to Serve
                  </button>
                </div>
              </div>
            </section>

            {/* 3C. LEADERSHIP SPOTLIGHT */}
            <section className="bg-white rounded-[30px] border border-ff-secondary/20 p-8 sm:p-12 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-ff-alternate">
                  Ministry Leadership
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-ff-secondary mt-1">
                  Connect with the Team
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-[24px] bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 max-w-3xl">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-brand-gold p-1 shrink-0 shadow-md">
                  {ministry?.leaderImage ? (
                    <img
                      src={ministry.leaderImage}
                      alt={ministry?.contactName || 'Leader'}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-ff-secondary text-brand-gold flex items-center justify-center font-bold text-3xl">
                      {(ministry?.contactName || ministry?.leaderName || ministryName)[0]}
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-ff-secondary">
                    {ministry?.contactName || ministry?.leaderName || `${ministryName} Coordinator`}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-ff-alternate">
                    {ministry?.leaderRole || ministry?.role || 'Ministry Lead & Coordinator'}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Have questions about joining, attending meetings, or volunteering? Reach out directly to our leadership team.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    {ministry?.contactEmail && (
                      <a
                        href={`mailto:${ministry.contactEmail}`}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{ministry.contactEmail}</span>
                      </a>
                    )}

                    {ministry?.contactWhatsApp && (
                      <a
                        href={`https://wa.me/${ministry.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs hover:bg-emerald-200 transition-colors inline-flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                        </svg>
                        <span>WhatsApp Chat</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3D. UPCOMING CONFERENCES & EVENTS SECTION */}
            {ministryEvents.length > 0 && (
              <section id="events" className="bg-white rounded-[30px] border border-ff-secondary/20 p-8 sm:p-12 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-ff-alternate">
                    Conferences & Gatherings
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-ff-secondary mt-1">
                    Upcoming Events for {ministryName}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ministryEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-slate-50 border border-slate-200 hover:border-ff-secondary/50 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="px-3 py-1 rounded-full bg-brand-gold text-slate-950 font-extrabold text-xs">
                            {Number(ev.price) > 0 ? `R${ev.price}` : 'Free Entry'}
                          </span>
                          <span className="text-xs font-bold text-ff-alternate uppercase tracking-wider">
                            {ev.dateDetails || (ev.date ? formatDateTime(ev.date) : 'Upcoming')}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-ff-secondary group-hover:text-ff-alternate transition-colors">
                          {ev.title}
                        </h3>

                        {ev.location && (
                          <p className="text-xs text-slate-500 font-medium">
                            Venue: {ev.location}
                          </p>
                        )}

                        {ev.description && (
                          <p className="text-sm text-slate-600 line-clamp-2">
                            {ev.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                        <Link
                          to={`/event?id=${ev.id}`}
                          className="px-6 py-2.5 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow"
                        >
                          <span>Event Details & Register</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3E. GET INVOLVED CALL-TO-ACTION */}
            <section className="bg-gradient-to-r from-ff-secondary via-[#243447] to-ff-secondary rounded-[32px] p-8 sm:p-14 text-white text-center shadow-xl space-y-6 relative overflow-hidden">
              <img
                src="/assets/images/SSMI_Logo_(No_background).png"
                alt="SSMI Watermark"
                className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10 object-contain pointer-events-none"
              />

              <div className="max-w-2xl mx-auto space-y-3 relative z-10">
                <span className="px-4 py-1.5 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold font-bold text-xs uppercase tracking-widest inline-block">
                  Get Involved
                </span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                  Ready to Serve in {ministryName}?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  Your unique gifts, talent, and passion are needed to build God's house and touch lives. Step forward and join our dynamic team today.
                </p>

                <div className="pt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsSignUpOpen(true)}
                    className="px-8 py-4 rounded-[50px] bg-brand-gold text-slate-950 font-bold text-base hover:brightness-110 transition-all shadow-lg cursor-pointer"
                  >
                    Sign Up to Serve Today
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* SignUpModal */}
      {isSignUpOpen && (
        <SignUpModal
          isOpen={isSignUpOpen}
          onClose={() => setIsSignUpOpen(false)}
          defaultMinistry={ministryName}
          initialMinistry={ministryName}
          defaultDepartment={ministry?.FEWDS || ministry?.fewds || ''}
          defaultBranch={selectedBranch !== 'All' ? selectedBranch : ''}
        />
      )}

      {/* 4. SITE FOOTER */}
      <SiteFooter />

      {/* 5. MOBILE DRAWER */}
      <MobileDrawer />
    </div>
  );
}

export default MinistryPage;
