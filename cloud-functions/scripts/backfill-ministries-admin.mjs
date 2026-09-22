import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  credential: applicationDefault(),
  projectId: 'ssmi-database',
});

const db = getFirestore();

// Canonical slug mappings for existing documents in Firestore
const existingSlugMap = {
  'Worship Services': 'worship-services',
  'Apostle Bheki Thwala Ministries': 'apostle-bheki-thwala-ministries',
  'Appreciations': 'appreciations',
  'Welfare': 'welfare',
  'Couples': 'for-couples',
  'Youth': 'youth',
  'Superkids': 'super-kids',
  'Pastor Zandi Thwala Ministries': 'pastor-zandi-thwala-ministries',
  'Projection': 'projection',
  'Evangelism': 'evangelism',
  'School of Prophets': 'school-of-prophets',
  'Media': 'media',
  'Bible Study': 'bible-study',
  'Testing Ministry': 'testing-ministry',
  'Superman Conference': 'superman-conference',
  'School of Ministry': 'school-of-ministry',
};

// Complete seed target ministries
const targetSeedMinistries = [
  {
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
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Lagos', 'Global'],
    global: true,
    meetingDetails: 'Annual conference held at designated SSMI regional centers. Specific schedules published prior to gathering.',
    servingDetails: 'Join our host team, prayer intercessors, security, media, sound engineering, or hospitality crew.',
    contactName: 'Fire Conference Committee',
    contactEmail: 'fireconf@swordandspirit.org',
    contactWhatsApp: '+26876000000',
    status: 'active',
  },
  {
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
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online', 'Global'],
    global: true,
    meetingDetails: 'Held annually across major SSMI campuses, featuring workshops, keynote sessions, and brotherhood fellowship.',
    servingDetails: 'Serve in logistics, ushering, sound engineering, media, or hospitality for the Men’s Conference.',
    contactName: 'Men’s Ministry Leadership',
    contactEmail: 'superman@swordandspirit.org',
    contactWhatsApp: '+26876000001',
    status: 'active',
  },
  {
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
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Global'],
    global: true,
    meetingDetails: 'Annual youth camp held during school holidays at selected retreat centers.',
    servingDetails: 'Counselors, team leaders, games coordinators, logistics assistants, and medical personnel needed.',
    contactName: 'Youth Pastor & Camp Directors',
    contactEmail: 'yolo@swordandspirit.org',
    contactWhatsApp: '+26876000002',
    status: 'active',
  },
  {
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
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Meets every Friday at 17:00 across SSMI branches for passionate worship, the Word, and fellowship.',
    servingDetails: 'Youth worship team, media, small group leaders, ushering, and event setup team.',
    contactName: 'Youth Coordinator',
    contactEmail: 'youth@swordandspirit.org',
    contactWhatsApp: '+26876000003',
    status: 'active',
  },
  {
    name: 'For Men',
    ministryName: 'Men of Dominion',
    slug: 'for-men',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Fostering authentic brotherhood, spiritual maturity, leadership development, and prayer among men of all ages.',
    tagline: 'Strong Men, Strong Families, Strong Kingdom',
    picture: '/assets/images/Ladies.png',
    heroDesktopImage: '/assets/images/Ladies.png',
    heroMobileImage: '/assets/images/Ladies.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Lagos'],
    meetingDetails: 'Monthly Saturday morning breakfast meetings and bi-weekly prayer calls across campuses.',
    servingDetails: 'Mentorship, event logistics, ushering, men’s choir, and community outreach.',
    contactName: 'Men’s Ministry Leader',
    contactEmail: 'men@swordandspirit.org',
    contactWhatsApp: '+26876000004',
    status: 'active',
  },
  {
    name: 'For Women',
    ministryName: 'Women of Virtue & Power',
    slug: 'for-women',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Uniting women in prayer, Bible study, holistic empowerment, mentorship, and impactful community service.',
    tagline: 'Virtue, Grace & Spiritual Authority',
    picture: '/assets/images/Ladies.png',
    heroDesktopImage: '/assets/images/Ladies.png',
    heroMobileImage: '/assets/images/Ladies.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Monthly women’s gatherings and bi-weekly prayer circles across campuses.',
    servingDetails: 'Prayer team, hospitality, event coordination, welfare support, and mentorship.',
    contactName: 'Women’s Ministry Leader',
    contactEmail: 'women@swordandspirit.org',
    contactWhatsApp: '+26876000005',
    status: 'active',
  },
  {
    name: 'For Couples',
    ministryName: 'Couples Ministry',
    slug: 'for-couples',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Strengthening marital bonds, fostering Biblical relationship principles, and building healthy, lasting Christian families.',
    tagline: 'Covenant Love & Kingdom Marriages',
    picture: '/assets/images/Couples_(2).png',
    heroDesktopImage: '/assets/images/Couples_(2).png',
    heroMobileImage: '/assets/images/Couples.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg'],
    meetingDetails: 'Quarterly couples dinners, marriage enrichment seminars, and annual relationship retreats.',
    servingDetails: 'Event planning, couples counseling support, seminar hospitality, and host team.',
    contactName: 'Marriage Directors',
    contactEmail: 'couples@swordandspirit.org',
    contactWhatsApp: '+26876000006',
    status: 'active',
  },
  {
    name: 'Singles Ministry',
    ministryName: 'Singles Ministry',
    slug: 'singles',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Empowering unmarried adults to live purposefully, grow in Christ, and navigate career, relationships, and calling.',
    tagline: 'Whole, Purposeful & Undivided in Christ',
    picture: '/assets/images/Felloship_(2).png',
    heroDesktopImage: '/assets/images/Felloship_(2).png',
    heroMobileImage: '/assets/images/Felloship.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Monthly social gatherings, interactive workshops, and career & relationship seminars.',
    servingDetails: 'Event hosts, discussion facilitators, sound & media, and community outreach.',
    contactName: 'Singles Coordinator',
    contactEmail: 'singles@swordandspirit.org',
    contactWhatsApp: '+26876000007',
    status: 'active',
  },
  {
    name: 'Young Adults',
    ministryName: 'Young Adults Ministry',
    slug: 'young-adults',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Connecting university students and young professionals (ages 18–35) in passionate worship, discipleship, and kingdom impact.',
    tagline: 'Passionate, Connected & Purpose-Driven',
    picture: '/assets/images/Youth.png',
    heroDesktopImage: '/assets/images/Youth.png',
    heroMobileImage: '/assets/images/Youth.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Bi-weekly Friday evening fellowship and monthly campus worship nights.',
    servingDetails: 'Worship team, small group leaders, media, ushering, and campus outreach.',
    contactName: 'Young Adults Leader',
    contactEmail: 'youngadults@swordandspirit.org',
    contactWhatsApp: '+26876000008',
    status: 'active',
  },
  {
    name: 'Super Kids',
    ministryName: 'Children’s Church (Super Kids)',
    slug: 'super-kids',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Nurturing children (ages 2–12) in God’s Word through fun, creative lessons, worship, crafts, and interactive prayer.',
    tagline: 'Raising Mighty Champions for Jesus',
    picture: '/assets/images/SuperKids.png',
    heroDesktopImage: '/assets/images/SuperKids.png',
    heroMobileImage: '/assets/images/SuperKids.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Runs parallel to Sunday adult services at 09:00 AM across all SSMI branches.',
    servingDetails: 'Sunday school teachers, classroom helpers, child check-in registration crew, and praise team.',
    contactName: 'SuperKids Coordinator',
    contactEmail: 'kids@swordandspirit.org',
    contactWhatsApp: '+26876000009',
    status: 'active',
  },
  {
    name: 'Welfare Ministry',
    ministryName: 'Welfare & Benevolence',
    slug: 'welfare',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Demonstrating Christ’s love by providing food, clothing, emergency financial assistance, and compassionate care to families in need.',
    tagline: 'Hands of Mercy, Hearts of Compassion',
    picture: '/assets/images/Care_(2).png',
    heroDesktopImage: '/assets/images/Care_(2).png',
    heroMobileImage: '/assets/images/Care.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Weekly food hamper distribution and emergency care support coordination across local branches.',
    servingDetails: 'Food drive collection, hamper packing, home visitation team, and community distribution.',
    contactName: 'Welfare Department Head',
    contactEmail: 'welfare@swordandspirit.org',
    contactWhatsApp: '+26876000010',
    status: 'active',
  },
  {
    name: 'Counseling Ministry',
    ministryName: 'Pastoral Counseling',
    slug: 'counseling',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Providing confidential, Scripture-based guidance, emotional support, and spiritual healing for individuals, couples, and families.',
    tagline: 'Healing Hearts & Restoring Hope Through God’s Word',
    picture: '/assets/images/Counselling_(2).png',
    heroDesktopImage: '/assets/images/Counselling_(2).png',
    heroMobileImage: '/assets/images/Counselling.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Available by appointment during weekday office hours and post-service on Sundays.',
    servingDetails: 'Trained lay counselors, prayer partners, and appointment receptionists.',
    contactName: 'Head Counselor',
    contactEmail: 'counseling@swordandspirit.org',
    contactWhatsApp: '+26876000011',
    status: 'active',
  },
  {
    name: 'Fellowship Ministry',
    ministryName: 'Fellowship & Cell Groups',
    slug: 'fellowship',
    type: 'normal',
    FEWDS: 'Fellowship',
    description: 'Connecting believers in small group home cell fellowships for Bible study, mutual encouragement, prayer, and community life.',
    tagline: 'Connected in Faith, Growing in Community',
    picture: '/assets/images/Felloship_(2).png',
    heroDesktopImage: '/assets/images/Felloship_(2).png',
    heroMobileImage: '/assets/images/Felloship.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Weekly home cell meetings every Wednesday evening from 18:00 to 19:30 in neighborhoods.',
    servingDetails: 'Home cell hosts, discussion facilitators, neighborhood coordinators, and hospitality teams.',
    contactName: 'Cell Group Overseer',
    contactEmail: 'fellowship@swordandspirit.org',
    contactWhatsApp: '+26876000012',
    status: 'active',
  },
  {
    name: 'School of Ministry',
    ministryName: 'SSMI School of Ministry',
    slug: 'school-of-ministry',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Comprehensive theological training, leadership certification, and practical ministry preparation for aspiring leaders and ministers.',
    tagline: 'Equipping Leaders to Impact Nations for Christ',
    picture: '/assets/images/Minstries_(2).png',
    heroDesktopImage: '/assets/images/Minstries_(2).png',
    heroMobileImage: '/assets/images/Minstries.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Saturday intensive modules and weekday evening online lectures via the student portal.',
    servingDetails: 'Academic admin, registrar support, library management, and online lecture facilitators.',
    contactName: 'Dean of Academics',
    contactEmail: 'som@swordandspirit.org',
    contactWhatsApp: '+26876000013',
    status: 'active',
  },
  {
    name: 'Baptism Ministry',
    ministryName: 'Water Baptism',
    slug: 'baptism',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Guiding new believers through water baptism classes and celebrating their public confession of faith in Jesus Christ.',
    tagline: 'Buried With Christ, Raised in Newness of Life',
    picture: '/assets/images/Baptis_(2).png',
    heroDesktopImage: '/assets/images/Baptis_(2).png',
    heroMobileImage: '/assets/images/Baptis.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Monthly baptism classes followed by baptism celebration services at designated campus baptistries.',
    servingDetails: 'Baptism preparation crew, towel/gown hospitality team, and registration assistants.',
    contactName: 'Baptism Coordinator',
    contactEmail: 'baptism@swordandspirit.org',
    contactWhatsApp: '+26876000014',
    status: 'active',
  },
  {
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
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos', 'Online', 'Global'],
    global: true,
    meetingDetails: 'Pre-service Sunday intercessory prayer at 08:30 AM and Thursday evening prayer service 18:30-19:30.',
    servingDetails: 'Intercessors, altar prayer ministers, and online prayer chain team.',
    contactName: 'Prayer Director',
    contactEmail: 'prayer@swordandspirit.org',
    contactWhatsApp: '+26876000015',
    status: 'active',
  },
];

function normalizeSlug(val = '') {
  return val
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  console.log('Fetching all existing ministries from Firestore...');
  const snapshot = await db.collection('ministries').get();
  console.log(`Found ${snapshot.docs.length} existing documents in ministries collection.`);

  let updatedCount = 0;
  let createdCount = 0;

  // 1. Backfill all existing documents with a unique slug and enhanced details
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const currentName = data.name || data.ministryName || 'Untitled';
    const fallbackSlug = normalizeSlug(currentName);
    const assignedSlug = existingSlugMap[currentName] || (data.slug ? normalizeSlug(data.slug) : fallbackSlug);

    // Look for matching seed if available to populate complete rich details
    const seedMatch = targetSeedMinistries.find(
      (s) =>
        s.slug === assignedSlug ||
        s.name.toLowerCase() === currentName.toLowerCase() ||
        s.ministryName.toLowerCase() === currentName.toLowerCase()
    );

    const updatePayload = {
      slug: assignedSlug,
      name: data.name || seedMatch?.name || currentName,
      ministryName: data.ministryName || seedMatch?.ministryName || currentName,
      type: data.type || seedMatch?.type || 'normal',
      global: Boolean(data.global || seedMatch?.global || (data.branches && data.branches.includes('Global'))),
      updatedAt: new Date(),
    };

    if (seedMatch) {
      if (!data.tagline && seedMatch.tagline) updatePayload.tagline = seedMatch.tagline;
      if (!data.description && seedMatch.description) updatePayload.description = seedMatch.description;
      if (!data.picture && seedMatch.picture) updatePayload.picture = seedMatch.picture;
      if (!data.heroDesktopImage && seedMatch.heroDesktopImage) updatePayload.heroDesktopImage = seedMatch.heroDesktopImage;
      if (!data.heroMobileImage && seedMatch.heroMobileImage) updatePayload.heroMobileImage = seedMatch.heroMobileImage;
      if (!data.meetingDetails && seedMatch.meetingDetails) updatePayload.meetingDetails = seedMatch.meetingDetails;
      if (!data.servingDetails && seedMatch.servingDetails) updatePayload.servingDetails = seedMatch.servingDetails;
      if (!data.contactEmail && seedMatch.contactEmail) updatePayload.contactEmail = seedMatch.contactEmail;
      if (!data.contactWhatsApp && seedMatch.contactWhatsApp) updatePayload.contactWhatsApp = seedMatch.contactWhatsApp;
      if (!data.branches || !data.branches.length) updatePayload.branches = seedMatch.branches;
    }

    await docSnap.ref.set(updatePayload, { merge: true });
    console.log(`Updated doc [${docSnap.id}]: "${currentName}" -> slug: "${assignedSlug}"`);
    updatedCount++;
  }

  // 2. Ensure all 16 target ministries exist in the collection
  const reSnapshot = await db.collection('ministries').get();
  const refreshedDocs = reSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  for (const seed of targetSeedMinistries) {
    const found = refreshedDocs.find(
      (d) =>
        d.slug === seed.slug ||
        normalizeSlug(d.name || '') === seed.slug ||
        normalizeSlug(d.ministryName || '') === seed.slug
    );

    if (!found) {
      const newRef = db.collection('ministries').doc();
      await newRef.set({
        ...seed,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created missing target seed ministry: "${seed.name}" -> slug: "${seed.slug}" (ID: ${newRef.id})`);
      createdCount++;
    }
  }

  console.log(`\n🎉 SUCCESS! Backfilled ${updatedCount} existing ministries and created ${createdCount} missing seed ministries.`);
}

run().catch((err) => {
  console.error('Backfill error:', err);
  process.exit(1);
});
