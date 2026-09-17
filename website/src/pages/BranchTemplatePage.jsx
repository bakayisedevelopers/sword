import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppState } from '../app/providers.jsx';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS, createRecord } from '../lib/firestore.js';
import { formatDateTime, isFutureEvent } from '../lib/format.js';
import { launchUrl } from '../lib/urls.js';
import { ChoiceChips } from '../components/ui/ChoiceChips.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Dialog } from '../components/ui/Dialog.jsx';
import { SiteFooter } from '../components/layout/SiteFooter.jsx';
import { MobileDrawer } from '../components/layout/MobileDrawer.jsx';
import { QuickActionButtons } from '../components/common/QuickActionButtons.jsx';

const PASTOR_IMAGE_FALLBACK = '/assets/images/B&Z_no_background_1.png';

export const OFFICIAL_BRANCHES = [
  {
    slug: 'online',
    name: 'Online',
    aliases: ['online', 'virtual', 'live'],
    country: 'Global',
    defaultLocation: 'SSMI Online Campus',
    defaultImage: '/assets/images/Online.png',
    defaultPastorImage: '/assets/images/B&Z_no_background_1.png',
    defaultPastorBio:
      'Apostle Bheki and Pastor Zandi Thwala are powerful ministers of the Word and full of the Spirit of God, they passionately, with compassion and love, lead and pastor the Online church family.',
    defaultServiceTimes: {
      Adults: [
        ['Sunday Service', '09:00'],
        ['Bible Study', 'Tuesday: 18:30 - 19:30'],
        ['Prophetic & Deliverance Service', 'Thursday: 18:30 - 19:30'],
      ],
      'Prayer Chain': [['Prayer Chain', 'From 17:00']],
      Online: [['Online Service', 'From 09:00 AM']],
    },
  },
  {
    slug: 'mbabane',
    name: 'Mbabane',
    aliases: ['mbabane'],
    country: 'Eswatini',
    defaultLocation: 'Plot 91 Mshini Road, Sidwashini Industrial site, Mbabane',
    defaultImage: '/assets/images/Mbabane.png',
    defaultPastorImage: '/assets/images/Pst._Andre_and_Mandile.png',
    defaultPastorBio:
      'Pastor Andrew and Mandile shepherd the Mbabane campus with a commitment to prayer, family ministry, and the uncompromised Word of God.',
    defaultServiceTimes: {
      Adults: [
        ['Sunday Service', '09:00-12:00'],
        ['Wednesday Prayer', '18:00-19:30'],
      ],
      Youth: [['Youth', '16:30-19:00']],
      Kids: [['Kids', '09:00-12:00']],
      Online: [['Facebook Live', 'Sunday: 09:00-12:00']],
    },
  },
  {
    slug: 'siteki',
    name: 'Siteki',
    aliases: ['siteki'],
    country: 'Eswatini',
    defaultLocation: 'Siteki, Eswatini',
    defaultImage: '/assets/images/Siteki.png',
    defaultPastorImage: '/assets/images/Pst._Scelo_&_Wife.png',
    defaultPastorBio:
      'Pastor Scelo and his wife lead the Siteki campus with a heart for pastoral care, prayer, and evangelism across the Lubombo region.',
    defaultServiceTimes: {
      Adults: [['Sunday Service', 'Contact Branch']],
      Youth: [['Youth', 'Contact Branch']],
      Kids: [['Kids', 'Contact Branch']],
      Online: [['Online Service', 'Contact Branch']],
    },
  },
  {
    slug: 'hlutsi',
    name: 'Hlutsi',
    aliases: ['hlutsi'],
    country: 'Eswatini',
    defaultLocation: 'Above Masiphula High School, Next to Ngcebase Grocery & Sibiya homesteads.',
    defaultImage: '/assets/images/Hlutsi.png',
    defaultPastorImage: '/assets/images/Pst._Ndaba_and_Thabi_no_backgroung.png',
    defaultPastorBio:
      'Pastor John and Thabi lead the Hlutsi campus with dedication to reaching families, community outreach, and raising believers grounded in faith.',
    defaultServiceTimes: {
      Adults: [['Sunday Service', '09:00']],
    },
  },
  {
    slug: 'ludzeludze',
    name: 'Ludzeludze',
    aliases: ['ludzeludze'],
    country: 'Eswatini',
    defaultLocation: 'Ludzeludze, Eswatini',
    defaultImage: '/assets/images/Ludzeludze.png',
    defaultPastorImage: '/assets/images/Pst._Mlondi_and_wife_no_background.png',
    defaultPastorBio:
      'Pastor Mlondie and Khetsiwe lead the Ludzeludze campus, passionately discipling believers, fostering prayer, and serving the local community.',
    defaultServiceTimes: {
      Adults: [
        ['Sunday Service', 'Contact Branch'],
        ['Bible Study', '10:00-10:45'],
      ],
    },
  },
  {
    slug: 'emalahleni',
    name: 'EMalahleni',
    aliases: ['emalahleni', 'e-malahleni', 'witbank', 'e_malahleni'],
    country: 'South Africa',
    defaultLocation: '6 Clarendon Ave, eMalahleni, 1035',
    defaultImage: '/assets/images/EMalahleni.png',
    defaultPastorImage: '/assets/images/B&Z_no_background_1.png',
    defaultPastorBio:
      'Apostle Bheki and Pastor Zandi Thwala are powerful ministers of the Word and full of the Spirit of God, they passionately, with compassion and love, lead and pastor the EMalahleni branch. They have 4 kids and many other spiritual sons and daughters globally and have been married for over 32 years. They lead the Apostle Bheki Thwala and Pastor Zandi Thwala Ministries.',
    defaultServiceTimes: {
      Adults: [
        ['Sunday Service', '09:00'],
        ['Bible Study', 'Tuesday: 18:30 - 19:30'],
        ['Prophetic & Deliverance Service', 'Thursday: 18:30 - 19:30'],
      ],
      Youth: [['Youth', 'From 17:00']],
      Kids: [['Kids', 'From 09:00 AM']],
      Online: [['Online Service', 'From 09:00 AM']],
    },
  },
  {
    slug: 'boksburg',
    name: 'Boksburg',
    aliases: ['boksburg'],
    country: 'South Africa',
    defaultLocation: '32 Lancaster Strt, Parkrand, Boksburg',
    defaultImage: '/assets/images/Boksburg.png',
    defaultPastorImage: '/assets/images/Pst._Pumuza_and_wife-no_background.png',
    defaultPastorBio:
      'Pastor Phumuza and Nonhlanhla lead the Boksburg campus with a passion for worship, discipleship, and building strong families in Christ.',
    defaultServiceTimes: {
      Prayer: [['Pre-Service Prayer', '09:00-09:30 AM']],
      Adults: [['Sunday Service', '09:30-12:00']],
    },
  },
  {
    slug: 'orange-farm',
    name: 'Orange Farm',
    aliases: ['orange-farm', 'orangefarm', 'orange_farm'],
    country: 'South Africa',
    defaultLocation: 'Orange Farm, Gauteng',
    defaultImage: '/assets/images/Orange_Farm.png',
    defaultPastorImage: '/assets/images/Pst._Nonhlanda_Orange_Farm_no_background.png',
    defaultPastorBio:
      'Pastor Nonhlanhla shepherds the Orange Farm campus, bringing hope, spiritual transformation, and compassionate community care to Gauteng.',
    defaultServiceTimes: {
      Adults: [['Sunday Service', 'Contact Branch']],
      Youth: [['Youth', 'Contact Branch']],
      Kids: [['Kids', 'Contact Branch']],
    },
  },
  {
    slug: 'lagos',
    name: 'Lagos',
    aliases: ['lagos', 'nigeria'],
    country: 'Nigeria',
    defaultLocation: 'Lagos, Nigeria',
    defaultImage: '/assets/images/Lagos.png',
    defaultPastorImage: '/assets/images/B&Z_no_background_1.png',
    defaultPastorBio:
      'Pastor Tony leads the Lagos campus with passion, preaching the uncompromised Word and expanding the Kingdom in Nigeria with boldness and love.',
    defaultServiceTimes: {
      Adults: [['Sunday Service', 'Contact Branch']],
      Youth: [['Youth', 'Contact Branch']],
      Kids: [['Kids', 'Contact Branch']],
    },
  },
];

function normalizeSlug(value = '') {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function resolveCanonicalBranchSlug(input = '') {
  const clean = normalizeSlug(input);
  if (!clean) return '';

  const withoutHyphens = clean.replace(/-/g, '');

  for (const b of OFFICIAL_BRANCHES) {
    if (b.slug === clean) return b.slug;
    if (b.aliases.some((alias) => normalizeSlug(alias) === clean || normalizeSlug(alias).replace(/-/g, '') === withoutHyphens)) {
      return b.slug;
    }
    if (normalizeSlug(b.name) === clean || normalizeSlug(b.name).replace(/-/g, '') === withoutHyphens) {
      return b.slug;
    }
  }
  return clean;
}

const DEFAULT_SERVICE_TIMES = {
  Adults: [
    ['Sunday Service', '09:00'],
    ['Bible Study', 'Tuesday: 18:30 - 19:30'],
    ['Prophetic & Deliverance Service', 'Thursday: 18:30 - 19:30'],
  ],
  Youth: [['Every Friday', 'From 17:00']],
  Kids: [['Every Sunday', 'From 09:00 AM']],
  Online: [['Every Sunday', 'From 09:00 AM']],
};

function getImageValue(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : '';
}

function getBranchImage(branch, landing) {
  return getImageValue(
    landing.heroDesktopImage ||
      landing.heroMobileImage ||
      landing.heroImage ||
      branch?.Image ||
      branch?.image
  );
}

function getPastorImage(landing, fallback) {
  return getImageValue(landing?.pastorImageUrl || landing?.pastorImage) || fallback?.defaultPastorImage || PASTOR_IMAGE_FALLBACK;
}

function getPastorBio(landing, fallback) {
  return getImageValue(landing?.pastorBio || landing?.shortPastorBio) || fallback?.defaultPastorBio || '';
}

function normalizeDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (value instanceof Date) return value;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatTime(value) {
  const date = normalizeDate(value);
  if (!date) return '';
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function normalizeServiceTimes(raw, fallback = DEFAULT_SERVICE_TIMES) {
  if (!raw) return fallback;
  if (Array.isArray(raw)) {
    const parsed = raw.reduce((acc, item) => {
      const group = item?.category || item?.group || item?.type || 'Adults';
      const title = item?.title || item?.name || item?.label || item?.repeat;
      const time = item?.time || item?.value || item?.details;
      if (title || time) acc[group] = [...(acc[group] || []), [title || '', time || '']];
      return acc;
    }, {});
    return Object.keys(parsed).length > 0 ? parsed : fallback;
  }
  if (typeof raw === 'object') {
    const parsed = Object.entries(raw).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        acc[key] = value.map((item) => {
          if (Array.isArray(item)) return [item[0] || '', item[1] || ''];
          return [item?.title || item?.name || item?.label || '', item?.time || item?.value || item?.details || ''];
        });
      } else if (typeof value === 'string') {
        acc[key] = [[key, value]];
      }
      return acc;
    }, {});
    return Object.keys(parsed).length > 0 ? parsed : fallback;
  }
  return fallback;
}

function sameBranchReference(recordRef, branch) {
  if (!recordRef || !branch) return false;
  const recordPath = typeof recordRef === 'string' ? recordRef : recordRef.path;
  return recordPath === branch.path || recordPath === branch.reference?.path;
}

function branchMatchesName(value, targetBranchNameOrSlug) {
  if (!value || !targetBranchNameOrSlug) return false;
  const canonicalValue = resolveCanonicalBranchSlug(value);
  const canonicalTarget = resolveCanonicalBranchSlug(targetBranchNameOrSlug);
  if (canonicalValue && canonicalTarget && canonicalValue === canonicalTarget) {
    return true;
  }
  return normalizeSlug(value).replace(/-/g, '') === normalizeSlug(targetBranchNameOrSlug).replace(/-/g, '');
}

function getEventImage(event) {
  return getImageValue(event.picture || event.image || event.Image);
}

function getSermonTitle(sermon) {
  return sermon.Title || sermon.title || 'Sermon';
}

function getSermonUrl(sermon) {
  return getImageValue(sermon.videoLink || sermon.video || sermon.link || sermon.videoUrl);
}

function InfoLine({ label, value, href }) {
  if (!value) return null;
  const content = href ? (
    <button
      type="button"
      onClick={() => launchUrl(href)}
      className="text-left text-[18px] leading-snug text-ff-primary-text underline-offset-4 hover:underline"
    >
      {value}
    </button>
  ) : (
    <p className="text-[18px] leading-snug text-ff-primary-text">{value}</p>
  );

  return (
    <div className="pb-[10px]">
      <p className="text-[20px] font-bold leading-snug text-ff-primary-text">{label}</p>
      {content}
    </div>
  );
}

function ServiceTimesPanel({ serviceTimes, selected, onSelect }) {
  const entries = serviceTimes[selected] || [];

  return (
    <div className="rounded-[20px] border border-ff-secondary bg-white px-[15px] py-[10px]">
      <h2 className="text-[25px] font-bold leading-[1.5] text-ff-primary-text">Service Times</h2>
      <ChoiceChips
        options={Object.keys(serviceTimes)}
        selected={selected}
        onChanged={(val) => onSelect(val || 'Adults')}
        className="mt-[10px]"
      />
      <div className="mt-5">
        {entries.map(([title, time], index) => (
          <div key={`${title}-${time}-${index}`} className="pb-[10px]">
            {title && <p className="text-[20px] font-bold text-ff-primary-text">{title}</p>}
            {time && <p className="text-[18px] text-ff-primary-text">{time}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function BranchInfoPanel({ branch, branchAddress }) {
  const mapUrl =
    getImageValue(branch?.locationLink || branch?.location_link) ||
    (branchAddress ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branchAddress)}` : '');

  return (
    <div className="rounded-[20px] border border-ff-secondary bg-white px-[15px] py-[10px]">
      <h2 className="text-[25px] font-bold leading-[1.5] text-ff-primary-text">Branch Information</h2>
      <div className="mt-5">
        <InfoLine label="Church Address" value={branchAddress} />
        <InfoLine label="Church Office" value={branchAddress} />
        <InfoLine label="Country" value={branch?.country} />
        <InfoLine label="Phone" value={branch?.phone_number || branch?.phoneNumber} href={branch?.phone_number ? `tel:${branch.phone_number}` : ''} />
        <InfoLine label="Email" value={branch?.email} href={branch?.email ? `mailto:${branch.email}` : ''} />
        <InfoLine label="Website" value={branch?.website} href={branch?.website} />
        <InfoLine label="WhatsApp" value={branch?.whatsapp} href={branch?.whatsapp} />
        <InfoLine label="Instagram" value={branch?.instagram} href={branch?.instagram} />
        <InfoLine label="Facebook" value={branch?.facebook} href={branch?.facebook} />
        <InfoLine label="YouTube" value={branch?.youtube} href={branch?.youtube} />
      </div>
      {mapUrl && (
        <button
          type="button"
          onClick={() => launchUrl(mapUrl)}
          className="mt-2 h-[55px] w-[230px] rounded-[30px] bg-ff-secondary px-4 text-base font-bold text-white"
        >
          Visit
        </button>
      )}
    </div>
  );
}

function GivingPanel({ branch }) {
  const paymentRows = [
    ['Banking Details', branch?.bankingDetails],
    ['Google Pay', branch?.googlepay],
    ['Apple Pay', branch?.applepay],
    ['PayPal', branch?.paypal],
    ['Yoco', branch?.yoco],
  ].filter(([, value]) => value);

  if (paymentRows.length === 0) return null;

  return (
    <div className="rounded-[20px] border border-ff-secondary bg-white px-[15px] py-[10px]">
      <h2 className="text-[25px] font-bold leading-[1.5] text-ff-primary-text">Giving Details</h2>
      <div className="mt-5 space-y-[10px]">
        {paymentRows.map(([label, value]) => (
          <InfoLine key={label} label={label} value={value} href={String(value).startsWith('http') ? value : ''} />
        ))}
      </div>
    </div>
  );
}

function PastorSection({ pastorImage, pastorBio }) {
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-start">
      <div className="min-h-[388px] flex-1 overflow-hidden rounded-[20px] border border-ff-secondary bg-gradient-to-b from-white to-ff-secondary shadow-[0_2px_4px_rgba(25,36,49,0.5)]">
        <img
          src={pastorImage}
          alt="Branch pastoral leadership"
          className="h-full min-h-[388px] w-full object-cover"
        />
      </div>
      {pastorBio && (
        <div className="flex-1 rounded-[20px] border border-ff-secondary bg-white/80 p-5 text-[15px] leading-relaxed text-ff-primary-text">
          {pastorBio}
        </div>
      )}
    </div>
  );
}

function SermonCard({ sermon }) {
  const url = getSermonUrl(sermon);

  return (
    <button
      type="button"
      onClick={() => url && launchUrl(url)}
      className="w-full rounded-[30px] border border-ff-secondary bg-white p-[15px] text-left shadow-[2px_2px_10px_rgba(25,36,49,0.35)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-[18px] font-bold leading-tight text-ff-primary-text">{getSermonTitle(sermon)}</h4>
          {sermon.preacher && <p className="mt-1 text-[15px] text-ff-primary-text">{sermon.preacher}</p>}
        </div>
        <span className="rounded-[15px] bg-ff-secondary px-3 py-2 text-sm font-bold text-ff-alternate">Watch</span>
      </div>
      {sermon.description && <p className="mt-3 text-[15px] leading-snug text-ff-primary-text">{sermon.description}</p>}
      {sermon.date && <p className="mt-3 text-sm text-ff-primary-text">{formatDateTime(sermon.date)}</p>}
    </button>
  );
}

function EventCard({ event }) {
  const image = getEventImage(event);
  const eventUrl = event.location_link || event.locationLink;

  return (
    <div className="overflow-hidden rounded-[30px] border border-ff-secondary bg-white shadow-sm">
      {image && (
        <img
          src={image}
          alt={event.title || 'Branch event'}
          className="h-[190px] w-full object-cover"
        />
      )}
      <div className="p-[15px]">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-[18px] font-bold leading-tight text-ff-primary-text">{event.title}</h4>
          <span className="rounded-[15px] bg-ff-secondary px-3 py-2 text-sm font-bold text-ff-alternate">
            {Number(event.price) > 0 ? `R${event.price}` : 'Free'}
          </span>
        </div>
        {event.description && <p className="mt-2 text-[15px] leading-snug text-ff-primary-text">{event.description}</p>}
        <div className="mt-3 space-y-1 text-[15px] text-ff-primary-text">
          {(event.date_details || event.dateDetails || event.date) && (
            <p>{event.date_details || event.dateDetails || formatDateTime(event.date)}</p>
          )}
          {(event.time_details || event.timeDetails || event.time) && (
            <p>{event.time_details || event.timeDetails || formatTime(event.time)}</p>
          )}
          {event.location && <p>{event.location}</p>}
        </div>
        {eventUrl && (
          <button
            type="button"
            onClick={() => launchUrl(eventUrl)}
            className="mt-4 h-10 rounded-[30px] border border-ff-secondary px-4 text-sm font-bold text-ff-secondary"
          >
            View Location
          </button>
        )}
      </div>
    </div>
  );
}

export function BranchTemplatePage() {
  const { branchSlug: paramSlug } = useParams();
  const { toggleDrawer, setContactBranch } = useAppState();

  const rawSlug = paramSlug || window.location.pathname.split('/').filter(Boolean).pop() || '';
  const canonicalSlug = resolveCanonicalBranchSlug(rawSlug);
  const slug = canonicalSlug;

  const { data: branches, loading: branchesLoading } = useFirestoreQuery(COLLECTIONS.BRANCHES);
  const { data: sermons, loading: sermonsLoading } = useFirestoreQuery(COLLECTIONS.SERMONS);
  const { data: events, loading: eventsLoading } = useFirestoreQuery(COLLECTIONS.EVENTS);

  const branch = useMemo(() => {
    if (!canonicalSlug) return null;
    const targetNoHyphen = canonicalSlug.replace(/-/g, '');

    const matched = branches.find((item) => {
      const candidates = [
        item.slug,
        item.snapshotData?.slug,
        item.id,
        item.name,
        item.website ? item.website.replace(/^\/+/, '') : '',
      ].filter(Boolean);

      return candidates.some((candidate) => {
        const itemCanonical = resolveCanonicalBranchSlug(candidate);
        if (itemCanonical === canonicalSlug) return true;
        return itemCanonical.replace(/-/g, '') === targetNoHyphen;
      });
    });

    const officialFallback = OFFICIAL_BRANCHES.find((b) => b.slug === canonicalSlug);

    if (!matched && !officialFallback) {
      return null;
    }

    if (!matched) {
      return {
        id: officialFallback.slug,
        slug: officialFallback.slug,
        name: officialFallback.name,
        country: officialFallback.country,
        location: officialFallback.defaultLocation,
        Image: officialFallback.defaultImage,
        landingPage: {
          heroDesktopImage: officialFallback.defaultImage,
          heroMobileImage: officialFallback.defaultImage,
          pastorImage: officialFallback.defaultPastorImage,
          pastorBio: officialFallback.defaultPastorBio,
          serviceTimes: officialFallback.defaultServiceTimes,
        },
      };
    }

    return {
      ...matched,
      name: (matched.name || officialFallback?.name || matched.id || '').trim(),
      slug: (matched.slug || officialFallback?.slug || matched.id || '').trim(),
      country: matched.country || officialFallback?.country || '',
      location: matched.location || officialFallback?.defaultLocation || '',
      Image: matched.Image || matched.image || officialFallback?.defaultImage || '',
      landingPage: {
        ...(officialFallback?.defaultServiceTimes ? { serviceTimes: officialFallback.defaultServiceTimes } : {}),
        ...(officialFallback?.defaultPastorBio ? { pastorBio: officialFallback.defaultPastorBio } : {}),
        ...(officialFallback?.defaultPastorImage ? { pastorImage: officialFallback.defaultPastorImage } : {}),
        ...(matched.landingPage || matched.snapshotData?.landingPage || {}),
      },
    };
  }, [branches, canonicalSlug]);

  const officialFallback = useMemo(
    () => OFFICIAL_BRANCHES.find((b) => b.slug === canonicalSlug) || OFFICIAL_BRANCHES[0],
    [canonicalSlug]
  );

  const landing = branch?.landingPage || branch?.snapshotData?.landingPage || {};
  const branchName = branch?.name?.trim() || '';
  const branchAddress = branch?.location?.trim() || '';
  const heroDesktopImg = branch ? getBranchImage(branch, landing) : '';
  const heroMobileImg = getImageValue(landing.heroMobileImage || landing.heroImage) || heroDesktopImg;
  const pastorImg = getPastorImage(landing, officialFallback);
  const pastorBio = getPastorBio(landing, officialFallback);
  const serviceTimes = normalizeServiceTimes(
    landing.serviceTimes || branch?.serviceTimes,
    officialFallback?.defaultServiceTimes || DEFAULT_SERVICE_TIMES
  );

  const [selectedServiceType, setSelectedServiceType] = useState('Adults');
  const [formName, setFormName] = useState('');
  const [formCell, setFormCell] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    if (branchName) document.title = branchName;
  }, [branchName]);

  useEffect(() => {
    if (!serviceTimes[selectedServiceType]) {
      setSelectedServiceType(Object.keys(serviceTimes)[0] || 'Adults');
    }
  }, [selectedServiceType, serviceTimes]);

  const branchSermons = useMemo(
    () =>
      sermons
        .filter((sermon) => branchMatchesName(sermon.branchName, branchName) || sameBranchReference(sermon.branch, branch))
        .sort((a, b) => (normalizeDate(b.date)?.getTime() || 0) - (normalizeDate(a.date)?.getTime() || 0)),
    [sermons, branchName, branch]
  );

  const branchEvents = useMemo(
    () =>
      events
        .filter(isFutureEvent)
        .filter((event) => {
          const eventBranches = Array.isArray(event.branches) ? event.branches : [];
          return (
            event.global === true ||
            branchMatchesName(event.branch_name || event.branchName, branchName) ||
            sameBranchReference(event.branch, branch) ||
            eventBranches.some((item) => branchMatchesName(item, branchName) || resolveCanonicalBranchSlug(item) === canonicalSlug)
          );
        })
        .sort((a, b) => (normalizeDate(a.date)?.getTime() || 0) - (normalizeDate(b.date)?.getTime() || 0)),
    [events, branchName, branch, canonicalSlug]
  );

  const navItems = [
    { name: 'Locations', path: '/locations' },
    { name: 'Watch', path: '/watch' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Care', path: '/care' },
    { name: 'Events', path: '/events' },
    { name: 'Give', path: '/give' },
  ];

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formCell.trim() || !formMessage.trim() || !branchName) return;

    setSubmitting(true);
    try {
      await createRecord(COLLECTIONS.REQUESTS, {
        name: formName.trim(),
        cell: formCell.trim(),
        branch: branchName,
        type: 'Message',
        message: formMessage.trim(),
      });
      setFormName('');
      setFormCell('');
      setFormMessage('');
      setShowSuccessDialog(true);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (branchesLoading) {
    return (
      <div className="min-h-screen bg-white text-ff-primary-text">
        <div className="mx-auto flex min-h-screen w-[90%] items-center justify-center text-[25px] font-bold">
          Loading
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen bg-white text-ff-primary-text">
        <div className="mx-auto flex min-h-screen w-[90%] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-[32px] font-bold text-ff-secondary">Branch not found</h1>
          <Link to="/locations" className="h-[55px] rounded-[30px] bg-ff-secondary px-6 py-4 font-bold text-white">
            View Locations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-ff-primary-text flex flex-col selection:bg-ff-primary selection:text-ff-primary-text">
      <div className="hidden lg:block w-[90%] max-w-[1440px] mx-auto mt-[30px] mb-[20px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg bg-ff-primary">
        {heroDesktopImg && (
          <img
            src={heroDesktopImg}
            alt={`${branchName} Banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="relative z-10 w-full p-5">
          <div className="w-full bg-ff-secondary rounded-[30px] border border-ff-secondary p-3 flex items-center justify-between shadow-md">
            <Link
              to="/"
              className="flex items-center justify-center w-[70px] h-[70px] p-[5px] rounded-[8px] overflow-hidden focus:outline-none"
              aria-label="Sword of the Spirit Ministries Home"
            >
              <img src="/assets/images/sword_logo.png" alt="Sword Logo" className="w-full h-full object-contain" />
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
              onClick={() => console.log('My Dashboard clicked')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >
              My Dashboard
            </button>
          </div>
        </div>

        <div className="absolute bottom-[25px] left-0 z-10 flex w-full justify-center">
          <button
            type="button"
            onClick={() => {
              setContactBranch(branchName);
              window.location.href = '/contact-us';
            }}
            className="h-[65px] rounded-[40px] border border-ff-secondary bg-ff-primary px-8 text-xl font-bold text-ff-primary-text shadow-lg"
          >
            Contact {branchName}
          </button>
        </div>
      </div>

      <div className="block lg:hidden w-[380px] max-w-[90%] mx-auto mt-[30px] h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg bg-ff-primary">
        {heroMobileImg && (
          <img
            src={heroMobileImg}
            alt={`${branchName} Banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        <div className="relative z-10 w-full p-2.5">
          <div className="w-full bg-ff-secondary rounded-[20px] p-2.5 flex items-center justify-between border border-transparent shadow-[0_0_30px_rgba(25,36,49,0.5)]">
            <Link
              to="/"
              className="w-[50px] h-[50px] rounded-full overflow-hidden flex items-center justify-center focus:outline-none"
              aria-label="Sword of the Spirit Ministries Home"
            >
              <img src="/assets/images/SSMI_Logo_(No_background).png" alt="SSMI Logo" className="w-full h-full object-contain" />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => console.log('Dashboard clicked')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={toggleDrawer}
                aria-label="Open Navigation Menu"
                className="w-[50px] h-[50px] rounded-full border border-ff-primary text-ff-primary flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 z-10 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setContactBranch(branchName);
              window.location.href = '/contact-us';
            }}
            className="h-[55px] rounded-[40px] border border-ff-secondary bg-ff-primary px-6 text-base font-bold text-ff-primary-text shadow-lg"
          >
            Contact {branchName}
          </button>
        </div>
      </div>

      <section className="mx-auto my-10 flex w-[90%] max-w-[1100px] flex-col gap-5 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-5 lg:w-[380px]">
          <ServiceTimesPanel serviceTimes={serviceTimes} selected={selectedServiceType} onSelect={setSelectedServiceType} />
          <BranchInfoPanel branch={branch} branchAddress={branchAddress} />
          <GivingPanel branch={branch} />
        </div>
        <div className="w-full lg:flex-1">
          <PastorSection pastorImage={pastorImg} pastorBio={pastorBio} />
        </div>
      </section>

      <section className="mx-auto my-8 grid w-[90%] max-w-[1100px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
        <div className="rounded-[20px] border border-ff-secondary bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-2 text-2xl font-bold text-ff-secondary">Connect with {branchName}</h2>
          <p className="mb-6 text-sm text-slate-600">
            Leave a message, prayer request, or inquiry. Our pastoral team will get back to you promptly.
          </p>

          <form onSubmit={handleSubmitMessage} className="space-y-4">
            <Input label="Your Full Name" required placeholder="e.g. John Doe" value={formName} onChange={setFormName} />
            <Input label="Cell Number" required placeholder="e.g. 082 123 4567" value={formCell} onChange={setFormCell} />
            <Input
              label="Message"
              required
              multiline
              rows={3}
              placeholder="How can we support or pray with you?"
              value={formMessage}
              onChange={setFormMessage}
            />
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                text="Submit"
                color="transparent"
                textColor="#101828"
                borderColor="#192431"
                borderRadius={10}
                loading={submitting}
                disabled={!formName.trim() || !formCell.trim() || !formMessage.trim()}
              />
            </div>
          </form>
        </div>

        <QuickActionButtons className="justify-center lg:py-5" />
      </section>

      <section className="mx-auto my-8 w-[90%] max-w-[1100px]">
        <h2 className="mb-5 text-center text-[25px] font-semibold text-ff-primary-text">{branchName} Resources</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div className="h-[450px] overflow-y-auto rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px]">
            <h3 className="mb-4 text-center text-[18px] text-ff-primary-text">{branchName} Sermons</h3>
            {sermonsLoading ? (
              <p className="text-center text-ff-primary-text">Loading</p>
            ) : branchSermons.length > 0 ? (
              <div className="space-y-[10px]">
                {branchSermons.map((sermon) => (
                  <SermonCard key={sermon.id} sermon={sermon} />
                ))}
              </div>
            ) : (
              <p className="text-center text-ff-primary-text">No sermons available for {branchName}.</p>
            )}
          </div>

          <div className="h-[450px] overflow-y-auto rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px]">
            <h3 className="mb-4 text-center text-[18px] text-ff-primary-text">{branchName} Events</h3>
            {eventsLoading ? (
              <p className="text-center text-ff-primary-text">Loading</p>
            ) : branchEvents.length > 0 ? (
              <div className="space-y-[10px]">
                {branchEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-center text-ff-primary-text">No events available for {branchName}.</p>
            )}
          </div>
        </div>
      </section>

      <Dialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        title="Success!!"
        message="Message sent."
        confirmText="OK"
      />

      <SiteFooter />
      <MobileDrawer />
    </div>
  );
}

export default BranchTemplatePage;
