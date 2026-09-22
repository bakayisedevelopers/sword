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
import { ChevronRight } from '../components/common/Icons.jsx';

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

function textValue(value = '') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value.path === 'string') return value.path.split('/').pop() || value.path;
  if (typeof value.id === 'string') return value.id;
  if (typeof value.name === 'string') return value.name;
  return '';
}

function normalizeSlug(value = '') {
  return textValue(value)
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
  const clean = textValue(value).trim();
  return clean || '';
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

function getHeroVideoUrl(landing) {
  return getImageValue(landing?.heroVideoUrl || landing?.heroVideoLink || landing?.heroVideo);
}

function getYouTubeEmbedUrl(url) {
  const cleanUrl = getImageValue(url);
  if (!cleanUrl) return '';
  const match = cleanUrl.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  if (!match) return '';
  return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&controls=0&rel=0&playlist=${match[1]}`;
}

function HeroVideo({ url, title }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    );
  }

  return (
    <video
      src={url}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
    />
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
  const cleanValue = textValue(value);
  const cleanTarget = textValue(targetBranchNameOrSlug);
  if (!cleanValue || !cleanTarget) return false;
  const canonicalValue = resolveCanonicalBranchSlug(cleanValue);
  const canonicalTarget = resolveCanonicalBranchSlug(cleanTarget);
  if (canonicalValue && canonicalTarget && canonicalValue === canonicalTarget) {
    return true;
  }
  return normalizeSlug(cleanValue).replace(/-/g, '') === normalizeSlug(cleanTarget).replace(/-/g, '');
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

function SocialOrWebButton({ label, href }) {
  if (!href) return null;

  let btnText = 'Open Link';
  const l = label.toLowerCase();
  if (l.includes('website')) btnText = 'Visit Website';
  else if (l.includes('facebook')) btnText = 'Visit Facebook Page';
  else if (l.includes('instagram')) btnText = 'Follow on Instagram';
  else if (l.includes('youtube')) btnText = 'Watch on YouTube';
  else if (l.includes('whatsapp')) btnText = 'Chat on WhatsApp';
  else if (l.includes('phone')) btnText = 'Call Office';
  else if (l.includes('email')) btnText = 'Send Email';
  else if (l.includes('map') || l.includes('address')) btnText = 'View Location Map';

  return (
    <button
      type="button"
      onClick={() => launchUrl(href)}
      className="mt-1.5 px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold shadow-sm hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
    >
      <span>{btnText}</span>
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}

function InfoLine({ label, value, href }) {
  if (!value) return null;

  const isUrl = String(value).startsWith('http://') || String(value).startsWith('https://');
  const targetHref = href || (isUrl ? value : '');
  const isSocialOrWeb = isUrl || (targetHref && !label.toLowerCase().includes('phone') && !label.toLowerCase().includes('email'));

  return (
    <div className="pb-3 border-b border-slate-100 last:border-b-0">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      {isSocialOrWeb ? (
        <SocialOrWebButton label={label} href={targetHref} />
      ) : targetHref ? (
        <div className="flex items-center justify-between gap-2 mt-1 flex-wrap">
          <span className="text-sm font-semibold text-ff-primary-text">{value}</span>
          <SocialOrWebButton label={label} href={targetHref} />
        </div>
      ) : (
        <p className="text-sm font-medium text-ff-primary-text mt-0.5">{value}</p>
      )}
    </div>
  );
}

function ServiceTimesPanel({ serviceTimes, selected, onSelect }) {
  const entries = serviceTimes[selected] || [];

  return (
    <div className="rounded-[24px] border border-ff-secondary bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-ff-secondary mb-3 border-b border-slate-200 pb-2">Service Times</h2>
      <ChoiceChips
        options={Object.keys(serviceTimes)}
        selected={selected}
        onChanged={(val) => onSelect(val || 'Adults')}
        className="mt-2"
      />
      <div className="mt-4 space-y-3">
        {entries.map(([title, time], index) => (
          <div key={`${title}-${time}-${index}`} className="pb-2 border-b border-slate-100 last:border-b-0">
            {title && <p className="text-sm font-bold text-ff-secondary">{title}</p>}
            {time && <p className="text-xs text-slate-600 font-medium mt-0.5">{time}</p>}
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
    <div className="rounded-[24px] border border-ff-secondary bg-white p-5 shadow-sm">
      <h2 className="text-xl font-bold text-ff-secondary mb-4 border-b border-slate-200 pb-2">
        Branch Information
      </h2>
      <div className="space-y-3">
        {branchAddress && (
          <div className="pb-3 border-b border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Church Address</p>
            <p className="text-sm font-medium text-ff-primary-text mt-0.5 mb-2">{branchAddress}</p>
            {mapUrl && (
              <button
                type="button"
                onClick={() => launchUrl(mapUrl)}
                className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>View Location Map</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
        <InfoLine label="Country" value={branch?.country} />
        <InfoLine label="Phone" value={branch?.phone_number || branch?.phoneNumber} href={branch?.phone_number ? `tel:${branch.phone_number}` : ''} />
        <InfoLine label="Email" value={branch?.email} href={branch?.email ? `mailto:${branch.email}` : ''} />
        <InfoLine label="Website" value={branch?.website} href={branch?.website} />
        <InfoLine label="WhatsApp" value={branch?.whatsapp} href={branch?.whatsapp} />
        <InfoLine label="Instagram" value={branch?.instagram} href={branch?.instagram} />
        <InfoLine label="Facebook" value={branch?.facebook} href={branch?.facebook} />
        <InfoLine label="YouTube" value={branch?.youtube} href={branch?.youtube} />
      </div>
    </div>
  );
}

function GivingPanel({ branch }) {
  if (!String(branch?.bankingDetails || '').trim()) return null;

  const paymentRows = [
    ['Banking Details', branch?.bankingDetails],
    ['Google Pay', branch?.googlepay],
    ['Apple Pay', branch?.applepay],
    ['PayPal', branch?.paypal],
    ['Yoco', branch?.yoco],
  ].filter(([, value]) => value);

  if (paymentRows.length === 0) return null;

  return (
    <div className="rounded-[30px] border border-ff-secondary bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-ff-alternate">Branch Giving</span>
        <h2 className="mt-1 text-2xl font-bold text-ff-secondary">
          Giving Details
        </h2>
      </div>
      <div className="space-y-3">
        {paymentRows.map(([label, value]) => {
          const isUrl = String(value).startsWith('http://') || String(value).startsWith('https://');
          return (
            <div key={label} className="pb-3 border-b border-slate-100 last:border-b-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
              {isUrl ? (
                <button
                  type="button"
                  onClick={() => launchUrl(value)}
                  className="mt-1.5 px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 shadow-sm"
                >
                  <span>Pay via {label}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <p className="text-sm font-medium text-ff-primary-text mt-0.5 whitespace-pre-line">{value}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PastorSection({ pastorImage, pastorBio }) {
  return (
    <div className="rounded-[24px] border border-ff-secondary bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-ff-secondary mb-4 border-b border-slate-200 pb-3">
        Pastoral Leadership
      </h2>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-full md:w-64 h-72 rounded-[20px] overflow-hidden border border-slate-200 bg-slate-100 shrink-0 shadow-sm">
          <img
            src={pastorImage}
            alt="Branch pastoral leadership"
            className="w-full h-full object-cover object-top"
          />
        </div>
        {pastorBio && (
          <div className="flex-1 text-sm sm:text-base leading-relaxed text-slate-700 bg-slate-50 p-5 rounded-[20px] border border-slate-100">
            {pastorBio}
          </div>
        )}
      </div>
    </div>
  );
}

function EventsPanel({ branchName, branchEvents, displayEvents, eventsFilter, setEventsFilter }) {
  if (branchEvents.length === 0) return null;

  return (
    <div className="min-h-[320px] flex-1 overflow-hidden rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px] shadow-sm flex flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <h3 className="text-[18px] font-bold text-ff-primary-text">{branchName} Events</h3>
        <div className="flex items-center gap-1 rounded-full border border-ff-secondary/30 bg-white/80 p-1 text-xs shadow-sm">
          <button
            type="button"
            onClick={() => setEventsFilter('all')}
            className={`rounded-full px-2.5 py-0.5 font-bold transition ${
              eventsFilter === 'all' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            All ({branchEvents.length})
          </button>
          <button
            type="button"
            onClick={() => setEventsFilter('global')}
            className={`rounded-full px-2.5 py-0.5 font-bold transition ${
              eventsFilter === 'global' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            Global
          </button>
          <button
            type="button"
            onClick={() => setEventsFilter('branch')}
            className={`rounded-full px-2.5 py-0.5 font-bold transition ${
              eventsFilter === 'branch' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
            }`}
          >
            Campus
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-[10px] overflow-y-auto pr-1">
        {displayEvents.map((event) => (
          <EventCard key={event.id} event={event} isGlobal={isEventGlobal(event)} />
        ))}
        {displayEvents.length === 0 && (
          <p className="py-6 text-center text-xs text-slate-500">No events match the selected filter.</p>
        )}
      </div>
    </div>
  );
}

function SermonCard({ sermon }) {
  const url = getSermonUrl(sermon);

  return (
    <div
      className="w-full rounded-[20px] border border-ff-secondary/20 bg-white p-4 text-left shadow-sm hover:border-ff-secondary hover:shadow-md transition-all flex flex-col justify-between gap-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-ff-secondary">{getSermonTitle(sermon)}</h4>
          {sermon.preacher && <p className="text-xs text-ff-alternate font-semibold mt-0.5">{sermon.preacher}</p>}
        </div>
        {url && (
          <button
            type="button"
            onClick={() => launchUrl(url)}
            className="rounded-[50px] bg-ff-secondary px-3.5 py-1 text-xs font-bold text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <span>Watch</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {sermon.description && <p className="text-xs text-slate-600 line-clamp-2 mt-1">{sermon.description}</p>}
      {sermon.date && <p className="text-[11px] font-semibold text-slate-400 mt-1">{formatDateTime(sermon.date)}</p>}
    </div>
  );
}

function isEventGlobal(event) {
  return (
    event?.global === true ||
    `${event?.branch_name || event?.branchName || ''}`.trim().toLowerCase() === 'global' ||
    (Array.isArray(event?.branches) && event.branches.some((b) => `${b}`.trim().toLowerCase() === 'global'))
  );
}

function isMinistryGlobal(ministry) {
  return (
    ministry?.global === true ||
    (Array.isArray(ministry?.branches) && ministry.branches.some((b) => `${b}`.trim().toLowerCase() === 'global'))
  );
}

function EventCard({ event, isGlobal }) {
  const eventUrl = event.location_link || event.locationLink;

  return (
    <div className="rounded-[20px] border border-ff-secondary/30 bg-white p-4 transition-all hover:border-ff-secondary hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className={`rounded-[50px] px-2.5 py-0.5 text-[11px] font-bold ${
              isGlobal ? 'bg-brand-gold text-slate-950' : 'bg-ff-secondary text-white'
            }`}
          >
            {isGlobal ? '🌐 Global' : 'Campus Specific'}
          </span>
          <span className="rounded-[50px] bg-slate-100 text-ff-primary-text px-2.5 py-0.5 text-[11px] font-bold">
            {Number(event.price) > 0 ? `R${event.price}` : 'Free'}
          </span>
          {(event.date_details || event.dateDetails || event.date) && (
            <span className="text-xs font-bold text-ff-alternate">
              {event.date_details || event.dateDetails || formatDateTime(event.date)}
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-ff-secondary truncate">{event.title}</h4>
        {event.location && (
          <p className="text-xs text-slate-500 truncate mt-0.5">{event.location}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          to={`/event?id=${event.id}`}
          className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
        >
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
        {eventUrl && (
          <button
            type="button"
            onClick={() => launchUrl(eventUrl)}
            className="px-3 py-2 rounded-[50px] border border-ff-secondary text-ff-secondary text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Location
          </button>
        )}
      </div>
    </div>
  );
}

function MinistryCard({ ministry, isGlobal }) {
  const slug = ministry.slug || normalizeSlug(ministry.name || ministry.ministryName);
  return (
    <div className="rounded-[20px] border border-ff-secondary/30 bg-white p-4 transition-all hover:border-ff-secondary hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span
            className={`rounded-[50px] px-2.5 py-0.5 text-[11px] font-bold ${
              isGlobal ? 'bg-brand-gold text-slate-950' : 'bg-ff-secondary text-white'
            }`}
          >
            {isGlobal ? '🌐 Global' : 'Campus Specific'}
          </span>
          {ministry.FEWDS && (
            <span className="text-xs font-semibold text-slate-500">
              {ministry.FEWDS}
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-ff-secondary truncate">
          {ministry.name || ministry.ministryName}
        </h4>
        {ministry.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
            {ministry.description}
          </p>
        )}
      </div>

      <div className="shrink-0">
        <Link
          to={slug ? `/${slug}` : `/ministries`}
          className="px-4 py-2 rounded-[50px] bg-ff-secondary text-white text-xs font-bold hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
        >
          <span>Explore</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

function PodcastCard({ podcast }) {
  const url = podcast.videoLink || podcast.link || podcast.url;
  return (
    <div className="rounded-[20px] border border-ff-secondary/20 bg-white p-4 text-left shadow-sm hover:border-ff-secondary hover:shadow-md transition-all flex flex-col justify-between gap-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-bold text-ff-secondary line-clamp-1">{podcast.Title || podcast.title || 'Podcast Episode'}</h4>
          {podcast.preacher && <p className="text-xs text-ff-alternate font-semibold mt-0.5">{podcast.preacher}</p>}
        </div>
        {url && (
          <button
            type="button"
            onClick={() => launchUrl(url)}
            className="rounded-[50px] bg-ff-secondary px-3.5 py-1 text-xs font-bold text-white hover:bg-slate-800 transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <span>Listen</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
      {podcast.description && <p className="text-xs text-slate-600 line-clamp-2 mt-1">{podcast.description}</p>}
      {podcast.date && <p className="text-[11px] font-semibold text-slate-400 mt-1">{formatDateTime(podcast.date)}</p>}
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
  const { data: sermons = [], loading: sermonsLoading } = useFirestoreQuery(COLLECTIONS.SERMONS);
  const { data: events = [], loading: eventsLoading } = useFirestoreQuery(COLLECTIONS.EVENTS);
  const { data: ministries = [], loading: ministriesLoading } = useFirestoreQuery(COLLECTIONS.MINISTRIES);
  const { data: podcasts = [], loading: podcastsLoading } = useFirestoreQuery(COLLECTIONS.PODCAST);

  const [eventsFilter, setEventsFilter] = useState('all'); // 'all' | 'global' | 'branch'
  const [ministriesFilter, setMinistriesFilter] = useState('all'); // 'all' | 'global' | 'branch'

  const branch = useMemo(() => {
    if (!canonicalSlug) return null;
    const targetNoHyphen = canonicalSlug.replace(/-/g, '');

    const matched = branches.find((item) => {
      const candidates = [
        item.slug,
        item.snapshotData?.slug,
        item.id,
        item.name,
        textValue(item.website).replace(/^\/+/, ''),
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
      name: textValue(matched.name || officialFallback?.name || matched.id).trim(),
      slug: textValue(matched.slug || officialFallback?.slug || matched.id).trim(),
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
  const branchName = textValue(branch?.name).trim();
  const branchAddress = textValue(branch?.location).trim();
  const heroDesktopImg = branch ? getBranchImage(branch, landing) : '';
  const heroMobileImg = getImageValue(landing.heroMobileImage || landing.heroImage) || heroDesktopImg;
  const heroVideoUrl = getHeroVideoUrl(landing);
  const showHeroVideo = textValue(landing.heroMediaType).toLowerCase() === 'video' && heroVideoUrl;
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
        .filter((sermon) => {
          if (canonicalSlug === 'online') {
            return (
              branchMatchesName(sermon.branchName, 'Online') ||
              branchMatchesName(sermon.branchName, 'EMalahleni') ||
              sameBranchReference(sermon.branch, branch)
            );
          }
          return (
            branchMatchesName(sermon.branchName, branchName) ||
            sameBranchReference(sermon.branch, branch)
          );
        })
        .sort((a, b) => (normalizeDate(b.date)?.getTime() || 0) - (normalizeDate(a.date)?.getTime() || 0)),
    [sermons, branchName, branch, canonicalSlug]
  );

  const branchPodcasts = useMemo(
    () =>
      podcasts
        .filter((podcast) => {
          const bName = podcast.branchName || podcast.branch_name || '';
          if (canonicalSlug === 'online') {
            return (
              branchMatchesName(bName, 'Online') ||
              branchMatchesName(bName, 'EMalahleni') ||
              sameBranchReference(podcast.branch, branch)
            );
          }
          return (
            branchMatchesName(bName, branchName) ||
            sameBranchReference(podcast.branch, branch)
          );
        })
        .sort((a, b) => (normalizeDate(b.date)?.getTime() || 0) - (normalizeDate(a.date)?.getTime() || 0)),
    [podcasts, branchName, branch, canonicalSlug]
  );

  const branchEvents = useMemo(
    () =>
      events
        .filter(isFutureEvent)
        .filter((event) => {
          if (isEventGlobal(event)) return true;
          const eventBranches = Array.isArray(event.branches) ? event.branches : [];
          return (
            branchMatchesName(event.branch_name || event.branchName, branchName) ||
            sameBranchReference(event.branch, branch) ||
            eventBranches.some((item) => branchMatchesName(item, branchName) || resolveCanonicalBranchSlug(item) === canonicalSlug)
          );
        })
        .sort((a, b) => (normalizeDate(a.date)?.getTime() || 0) - (normalizeDate(b.date)?.getTime() || 0)),
    [events, branchName, branch, canonicalSlug]
  );

  const displayEvents = useMemo(() => {
    if (eventsFilter === 'global') return branchEvents.filter(isEventGlobal);
    if (eventsFilter === 'branch') return branchEvents.filter((e) => !isEventGlobal(e));
    return branchEvents;
  }, [branchEvents, eventsFilter]);

  const branchMinistries = useMemo(() => {
    return ministries.filter((ministry) => {
      if (isMinistryGlobal(ministry)) return true;
      const mBranches = Array.isArray(ministry.branches) ? ministry.branches : [];
      return mBranches.some(
        (b) => branchMatchesName(b, branchName) || resolveCanonicalBranchSlug(b) === canonicalSlug
      );
    });
  }, [ministries, branchName, canonicalSlug]);

  const displayMinistries = useMemo(() => {
    if (ministriesFilter === 'global') return branchMinistries.filter(isMinistryGlobal);
    if (ministriesFilter === 'branch') return branchMinistries.filter((m) => !isMinistryGlobal(m));
    return branchMinistries;
  }, [branchMinistries, ministriesFilter]);

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
        date: new Date(),
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
        {showHeroVideo ? (
          <HeroVideo url={heroVideoUrl} title={`${branchName} hero video`} />
        ) : heroDesktopImg ? (
          <img
            src={heroDesktopImg}
            alt={`${branchName} Banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

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
              onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
              className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-base font-bold border border-ff-primary hover:bg-white/90 transition-colors"
            >Discipleship</button>
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

      <div className="block lg:hidden w-[92%] max-w-[500px] mx-auto mt-[20px] mb-[20px] h-[520px] sm:h-[600px] rounded-[30px] border border-ff-secondary relative overflow-hidden shadow-lg bg-ff-primary">
        {showHeroVideo ? (
          <HeroVideo url={heroVideoUrl} title={`${branchName} hero video`} />
        ) : heroMobileImg ? (
          <img
            src={heroMobileImg}
            alt={`${branchName} Banner`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

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
                onClick={() => window.open('https://disciple.swordandspirit.org', '_blank', 'noopener,noreferrer')}
                className="h-10 px-4 rounded-[50px] bg-ff-primary text-ff-primary-text text-sm font-bold border border-ff-primary hover:bg-white/90 transition-colors"
              >Discipleship</button>
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

      <section className="mx-auto my-10 flex w-[90%] max-w-[1100px] flex-col gap-5 lg:flex-row lg:items-stretch">
        <div className="flex w-full flex-col gap-5 lg:w-[380px]">
          <ServiceTimesPanel serviceTimes={serviceTimes} selected={selectedServiceType} onSelect={setSelectedServiceType} />
          <BranchInfoPanel branch={branch} branchAddress={branchAddress} />
        </div>
        <div className="flex w-full flex-col gap-5 lg:flex-1">
          <PastorSection pastorImage={pastorImg} pastorBio={pastorBio} />
          <EventsPanel
            branchName={branchName}
            branchEvents={branchEvents}
            displayEvents={displayEvents}
            eventsFilter={eventsFilter}
            setEventsFilter={setEventsFilter}
          />
        </div>
      </section>

      <section className="mx-auto my-8 grid w-[90%] max-w-[1100px] grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,420px)]">
        <div className="flex h-full flex-col justify-between rounded-[20px] border border-ff-secondary bg-white p-5 shadow-sm sm:p-6 lg:min-h-[427px]">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-ff-secondary">Connect with {branchName}</h2>
            <p className="mb-4 text-sm text-slate-600">
              Leave a message, prayer request, or inquiry for our pastoral team.
            </p>
          </div>

          <form onSubmit={handleSubmitMessage} className="flex flex-1 flex-col space-y-3">
            <Input required placeholder="Your Full Name *" value={formName} onChange={setFormName} />
            <Input required placeholder="Cell Number *" value={formCell} onChange={setFormCell} />
            <Input
              required
              multiline
              rows={2}
              placeholder="How can we support or pray with you? *"
              value={formMessage}
              onChange={setFormMessage}
            />
            <div className="mt-auto flex justify-center pt-2">
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

        <QuickActionButtons className="h-full justify-between lg:min-h-[427px]" itemClassName="lg:min-h-[67px]" />
      </section>

      {/* Dynamic Branch Resources Section: sermons and podcasts only */}
      {(branchSermons.length > 0 || branchPodcasts.length > 0) && (
        <section className="mx-auto my-8 w-[90%] max-w-[1100px] space-y-6">
          <h2 className="text-center text-[25px] font-semibold text-ff-primary-text">{branchName} Resources</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {branchSermons.length > 0 && (
              <div className="h-[460px] w-full max-w-[537px] overflow-hidden rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px] flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[18px] font-bold text-ff-primary-text">{branchName} Sermons</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ff-secondary text-white">
                    {branchSermons.length}
                  </span>
                </div>
                <div className="space-y-[10px] overflow-y-auto flex-1 pr-1">
                  {branchSermons.map((sermon) => (
                    <SermonCard key={sermon.id} sermon={sermon} />
                  ))}
                </div>
              </div>
            )}

            {branchPodcasts.length > 0 && (
              <div className="h-[460px] w-full max-w-[537px] overflow-hidden rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px] flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-[18px] font-bold text-ff-primary-text">{branchName} Podcasts</h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-ff-secondary text-white">
                    {branchPodcasts.length}
                  </span>
                </div>
                <div className="space-y-[10px] overflow-y-auto flex-1 pr-1">
                  {branchPodcasts.map((podcast) => (
                    <PodcastCard key={podcast.id} podcast={podcast} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {branchMinistries.length > 0 && (
        <section className="mx-auto my-8 w-[90%] max-w-[1100px] space-y-6">
          <h2 className="text-center text-[25px] font-semibold text-ff-primary-text">{branchName} Ministries</h2>
          <div className="mx-auto h-[460px] w-full overflow-hidden rounded-[30px] border border-ff-secondary bg-ff-primary p-[15px] flex flex-col shadow-sm">
                <div className="mb-3 flex justify-center px-1">
                  <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-ff-secondary/30 text-xs shadow-sm">
                    <button
                      type="button"
                      onClick={() => setMinistriesFilter('all')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition ${
                        ministriesFilter === 'all' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      All ({branchMinistries.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMinistriesFilter('global')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition ${
                        ministriesFilter === 'global' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      🌐 Global
                    </button>
                    <button
                      type="button"
                      onClick={() => setMinistriesFilter('branch')}
                      className={`px-2.5 py-0.5 rounded-full font-bold transition ${
                        ministriesFilter === 'branch' ? 'bg-ff-secondary text-white' : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      Campus
                    </button>
                  </div>
                </div>
                <div className="space-y-[10px] overflow-y-auto flex-1 pr-1">
                  {displayMinistries.map((ministry) => (
                    <MinistryCard key={ministry.id} ministry={ministry} isGlobal={isMinistryGlobal(ministry)} />
                  ))}
                  {displayMinistries.length === 0 && (
                    <p className="text-center text-xs text-slate-500 py-6">No ministries match the selected filter.</p>
                  )}
                </div>
          </div>
        </section>
      )}

      <section className="mx-auto my-8 w-[90%] max-w-[1100px]">
        <GivingPanel branch={branch} />
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
