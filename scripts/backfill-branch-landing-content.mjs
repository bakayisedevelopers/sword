import { execSync } from 'node:child_process';

const projectId = 'ssmi-database';
const databaseId = '(default)';
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents`;

const apply = process.argv.includes('--apply');

const branches = [
  {
    slug: 'boksburg',
    name: 'Boksburg',
    website: '/boksburg',
    Image: 'assets/images/Boksburg.png',
    location: '32 Lancaster Strt, Parkrand, Boksurg',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Boksburg.png',
      heroMobileImage: 'assets/images/Boksburg.png',
      heroImage: 'assets/images/Boksburg.png',
      pastorImage: 'assets/images/Pst._Pumuza_and_wife-no_background.png',
      pastorBio: 'Pastor Phumuza and Nonhlanhla werite out.',
      serviceTimes: [
        { category: 'Prayer', title: 'Every Sunday', time: '09:00-09:30 AM', repeat: 'Every Sunday' },
        { category: 'Adults', title: 'Sunday Service', time: '09:30-12:00', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'emalahleni',
    name: 'EMalahleni',
    website: '/emalahleni',
    Image: 'assets/images/EMalahleni.png',
    location: '6 Clarendon Ave, eMalahleni, 1035',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/EMalahleni.png',
      heroMobileImage: 'assets/images/EMalahleni.png',
      heroImage: 'assets/images/EMalahleni.png',
      pastorImage: 'assets/images/B&Z_no_background_1.png',
      pastorBio:
        'Apostle Bheki and Pastor Zandi Thwala are powerful ministers of the Word and full of the Spirit of God, they passionately, with compassion and love, lead and pastor the EMalahleni branch. They have 4 kids and many other spiritual sons and daughters globally and have been married for over 32 years. They lead the Apostle Bheki Thwala and Pastor Zandi Thwala Ministries.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: '09:00', repeat: 'Every Sunday' },
        { category: 'Adults', title: 'Bible Study', time: 'Tuesday: 18:30 - 19:30', repeat: 'Every Tuesday' },
        {
          category: 'Adults',
          title: 'Prophetic & Deliverance Service',
          time: 'Thursday: 18:30 - 19:30',
          repeat: 'Every Thursday',
        },
        { category: 'Youth', title: 'Youth', time: 'From 17:00', repeat: 'Every Friday' },
        { category: 'Kids', title: 'Kids', time: 'From 09:00 AM', repeat: 'Every Sunday' },
        { category: 'Online', title: 'Online Service', time: 'From 09:00 AM', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'hlutsi',
    name: 'Hlutsi',
    website: '/hlutsi',
    Image: 'assets/images/Hlutsi.png',
    location: 'Above Masiphula High School, Next to Ngcebase Grocery & Sibiya homesteads.',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Hlutsi.png',
      heroMobileImage: 'assets/images/Hlutsi.png',
      heroImage: 'assets/images/Hlutsi.png',
      pastorImage: 'assets/images/Pst._Ndaba_and_Thabi_no_backgroung.png',
      pastorBio: 'Pastor John and Thabi write out.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: '09:00', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'lagos',
    name: 'Lagos',
    website: '/lagos',
    Image: 'assets/images/Lagos.png',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Lagos.png',
      heroMobileImage: 'assets/images/Lagos.png',
      heroImage: 'assets/images/Lagos.png',
      pastorImage: 'assets/images/B&Z_no_background_1.png',
      pastorBio: 'Pastor Tony write out.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: 'Contact Branch', repeat: 'Every Sunday' },
        { category: 'Youth', title: 'Youth', time: 'Contact Branch', repeat: 'Every Friday' },
        { category: 'Kids', title: 'Kids', time: 'Contact Branch', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'ludzeludze',
    name: 'Ludzeludze',
    website: '/ludzeludze',
    Image: 'assets/images/Ludzeludze.png',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Ludzeludze.png',
      heroMobileImage: 'assets/images/Ludzeludze.png',
      heroImage: 'assets/images/Ludzeludze.png',
      pastorImage: 'assets/images/Pst._Mlondi_and_wife_no_background.png',
      pastorBio: 'Pastor Mlondie and Khetsiwe write out.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: '', repeat: 'Every Sunday' },
        { category: 'Adults', title: 'Bible Study', time: '10:00-10:45', repeat: 'Bible Study' },
      ],
    },
  },
  {
    slug: 'mbabane',
    name: 'Mbabane',
    website: '/mbabane',
    Image: 'assets/images/Mbabane.png',
    location: 'Plot 91 Mshini Road, Sidwashini Industrial site, Mbabane',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Mbabane.png',
      heroMobileImage: 'assets/images/Mbabane.png',
      heroImage: 'assets/images/Mbabane.png',
      pastorImage: 'assets/images/Pst._Andre_and_Mandile.png',
      pastorBio: 'Pastor Andrew and Mandile write out.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: '09:00-12:00', repeat: 'Every Sunday' },
        { category: 'Adults', title: 'Wednesday Prayer', time: '18:00-19:30', repeat: 'Every Wednesday' },
        { category: 'Youth', title: 'Youth', time: '16:30-19:00', repeat: 'Every Friday' },
        { category: 'Kids', title: 'Kids', time: '09:00-12:00', repeat: 'Every Sunday' },
        { category: 'Online', title: 'Facebook Live', time: 'Sunday: 09:00-12:00', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'online',
    name: 'Online',
    website: '/online',
    Image: 'assets/images/Online.png',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Online.png',
      heroMobileImage: 'assets/images/Online.png',
      heroImage: 'assets/images/Online.png',
      pastorImage: 'assets/images/B&Z_no_background_1.png',
      pastorBio:
        'Apostle Bheki and Pastor Zandi Thwala are powerful ministers of the Word and full of the Spirit of God, they passionately, with compassion and love, lead and pastor the Online church family.',
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: '09:00', repeat: 'Every Sunday' },
        { category: 'Adults', title: 'Bible Study', time: 'Tuesday: 18:30 - 19:30', repeat: 'Every Tuesday' },
        {
          category: 'Adults',
          title: 'Prophetic & Deliverance Service',
          time: 'Thursday: 18:30 - 19:30',
          repeat: 'Every Thursday',
        },
        { category: 'Prayer Chain', title: 'Prayer Chain', time: 'From 17:00', repeat: 'Every Friday' },
      ],
    },
  },
  {
    slug: 'orange-farm',
    name: 'Orange Farm',
    website: '/orange-farm',
    Image: 'assets/images/Orange_Farm.png',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Orange_Farm.png',
      heroMobileImage: 'assets/images/Orange_Farm.png',
      heroImage: 'assets/images/Orange_Farm.png',
      pastorImage: 'assets/images/Pst._Nonhlanda_Orange_Farm_no_background.png',
      pastorBio: "Pastor Nonhlanhla's write out.",
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: 'Contact Branch', repeat: 'Every Sunday' },
        { category: 'Youth', title: 'Youth', time: 'Contact Branch', repeat: 'Every Friday' },
        { category: 'Kids', title: 'Kids', time: 'Contact Branch', repeat: 'Every Sunday' },
      ],
    },
  },
  {
    slug: 'siteki',
    name: 'Siteki',
    website: '/siteki',
    Image: 'assets/images/Siteki.png',
    landingPage: {
      heroMediaType: 'image',
      heroDesktopImage: 'assets/images/Siteki.png',
      heroMobileImage: 'assets/images/Siteki.png',
      heroImage: 'assets/images/Siteki.png',
      pastorImage: 'assets/images/Pst._Scelo_&_Wife.png',
      pastorBio: "Pastors' about write out.",
      serviceTimes: [
        { category: 'Adults', title: 'Sunday Service', time: 'Contact Branch', repeat: 'Every Sunday' },
        { category: 'Youth', title: 'Youth', time: 'Contact Branch', repeat: 'Every Friday' },
        { category: 'Kids', title: 'Kids', time: 'Contact Branch', repeat: 'Every Sunday' },
        { category: 'Online', title: 'Online Service', time: 'Contact Branch', repeat: 'Every Sunday' },
      ],
    },
  },
];

function getToken() {
  const command = 'gcloud auth print-access-token';
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === 'object') {
    return {
      mapValue: {
        fields: Object.fromEntries(Object.entries(value).map(([key, val]) => [key, toFirestoreValue(val)])),
      },
    };
  }
  return { stringValue: String(value) };
}

function fromFirestoreValue(value) {
  if (!value || typeof value !== 'object') return undefined;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return value.doubleValue;
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
  if ('mapValue' in value) {
    return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([key, val]) => [key, fromFirestoreValue(val)]));
  }
  if ('referenceValue' in value) return value.referenceValue;
  if ('geoPointValue' in value) return value.geoPointValue;
  return undefined;
}

function fromDocument(doc) {
  return Object.fromEntries(Object.entries(doc.fields || {}).map(([key, value]) => [key, fromFirestoreValue(value)]));
}

async function request(token, url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
  return body;
}

async function loadBranches(token) {
  const body = await request(token, `${baseUrl}/branches?pageSize=100`);
  return (body.documents || []).map((doc) => ({
    name: doc.name,
    id: doc.name.split('/').pop(),
    data: fromDocument(doc),
  }));
}

function findDocument(existingBranches, branch) {
  const normalizedName = branch.name.toLowerCase();
  return existingBranches.find((doc) => `${doc.data.slug || ''}` === branch.slug) ||
    existingBranches.find((doc) => `${doc.data.name || ''}`.trim().toLowerCase() === normalizedName) ||
    null;
}

function mergeBranch(existing, branch) {
  const existingData = existing?.data || {};
  const existingLandingPage = existingData.landingPage || {};
  const next = {
    name: existingData.name || branch.name,
    slug: existingData.slug || branch.slug,
    website: existingData.website || branch.website,
    Image: existingData.Image || branch.Image,
    landingPage: {
      ...existingLandingPage,
      ...branch.landingPage,
      socialLinks: existingLandingPage.socialLinks || {
        instagram: existingData.instagram || '',
        facebook: existingData.facebook || '',
        youtube: existingData.youtube || '',
        whatsapp: existingData.whatsapp || '',
      },
      backfilledFrom: 'hardcoded_flutter_branch_pages',
      backfilledAt: new Date().toISOString(),
    },
  };

  if (!existingData.location && branch.location) {
    next.location = branch.location;
  }

  return next;
}

function updateMaskFields(payload) {
  const fields = ['name', 'slug', 'website', 'Image', 'landingPage'];
  if ('location' in payload) fields.push('location');
  return fields.map((field) => `updateMask.fieldPaths=${encodeURIComponent(field)}`).join('&');
}

async function main() {
  const token = getToken();
  const existingBranches = await loadBranches(token);
  const summary = [];

  for (const branch of branches) {
    const existing = findDocument(existingBranches, branch);
    const payload = mergeBranch(existing, branch);
    const documentId = existing?.id || branch.slug;
    const documentUrl = `${baseUrl}/branches/${encodeURIComponent(documentId)}?${updateMaskFields(payload)}`;

    summary.push({
      mode: apply ? 'apply' : 'dry-run',
      branch: branch.name,
      slug: branch.slug,
      documentId,
      matchedExistingDocument: Boolean(existing),
      writesLocationOnlyIfMissing: Boolean(payload.location),
      serviceTimes: branch.landingPage.serviceTimes.length,
      pastorImage: branch.landingPage.pastorImage,
    });

    if (apply) {
      await request(token, documentUrl, {
        method: 'PATCH',
        body: JSON.stringify({
          fields: Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, toFirestoreValue(value)])),
        }),
      });
    }
  }

  console.table(summary);
  console.log(apply ? 'Backfill complete.' : 'Dry run complete. Re-run with --apply to write Firestore.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
