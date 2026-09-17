export const globalContentModules = [
  { id: 'header', title: 'Header & navigation', description: 'Logo, primary navigation, calls to action, and mobile menu.', fields: ['brand', 'navigation', 'primaryCta'] },
  { id: 'footer', title: 'Footer', description: 'Footer navigation, ministry links, legal links, and copyright.', fields: ['columns', 'legalLinks', 'copyright'] },
  { id: 'contact-social', title: 'Contact & social', description: 'Central phone, email, WhatsApp, address, and social destinations.', fields: ['contact', 'socials'] },
  { id: 'giving', title: 'Giving links', description: 'Global giving channels, campaigns, bank details, and branch hand-offs.', fields: ['channels', 'campaigns', 'defaultCta'] },
  { id: 'home', title: 'Homepage', description: 'Hero banners, livestream panel, featured calls to action, and highlights.', fields: ['heroBanners', 'livestream', 'featuredContent'] },
  { id: 'statistics', title: 'Key statistics', description: 'Approved impact numbers and supporting labels used across the site.', fields: ['statistics'] },
  { id: 'policies', title: 'Policy URLs', description: 'Privacy, terms, safeguarding, and other policy destinations.', fields: ['policyLinks'] },
];

export const reusableTemplates = [
  { id: 'branch', title: 'Branch page', collection: 'branches', description: 'One slug-driven layout for every campus: hero, services, location, leadership, contact, giving, and social links.' },
  { id: 'ministry', title: 'Ministry page', collection: 'ministries', description: 'One slug-driven layout for every ministry: hero, purpose, meeting details, serving, contact, and calls to action.' },
  { id: 'structured', title: 'Structured page', collection: 'pages', description: 'Composable ordered sections for institutional, care, conference, and resource pages.' },
];

export const structuredPages = [
  { slug: 'about-us', title: 'About Us', type: 'about', sections: ['hero', 'story', 'values', 'leadership', 'callToAction'] },
  { slug: 'locations', title: 'Locations', type: 'locations', sections: ['hero', 'locationDirectory', 'map', 'callToAction'] },
  { slug: 'care', title: 'Care', type: 'care', sections: ['hero', 'carePathways', 'contactOptions', 'callToAction'] },
  { slug: 'conferences', title: 'Conferences', type: 'conferences', sections: ['hero', 'featuredConference', 'conferenceGrid', 'callToAction'] },
  { slug: 'resources', title: 'Resources', type: 'resources', sections: ['hero', 'resourceCategories', 'featuredResources', 'callToAction'] },
];

export const dashboardStages = [
  { title: 'Global content', detail: 'Central settings for the shared visitor experience.', count: globalContentModules.length, state: 'Ready to seed', tone: 'lime' },
  { title: 'Reusable templates', detail: 'Branch and ministry records become slug-driven pages.', count: reusableTemplates.length, state: 'Model defined', tone: 'blue' },
  { title: 'Structured pages', detail: 'About, locations, care, conferences, and resources.', count: structuredPages.length, state: 'Ready to compose', tone: 'violet' },
];

export function createGlobalSettings() {
  return {
    schemaVersion: 2,
    header: { brand: 'Sword & Spirit Ministries', navigation: [], primaryCta: { label: 'Give', url: '/give' } },
    footer: { columns: [], legalLinks: [], copyright: '© Sword & Spirit Ministries' },
    contact: { email: '', phone: '', whatsapp: '', address: '' },
    socials: { facebook: '', instagram: '', youtube: '', tiktok: '' },
    giving: { channels: [], campaigns: [], defaultCta: { label: 'Give', url: '/give' } },
    home: { heroBanners: [], livestream: { enabled: false, title: '', url: '' }, featuredContent: [] },
    statistics: [],
    policyLinks: [],
  };
}

export function createStructuredPage(page) {
  return {
    slug: page.slug,
    title: page.title,
    type: page.type,
    status: 'draft',
    seo: { title: page.title, description: '' },
    sections: page.sections.map((type, index) => ({ id: `${page.slug}-${type}`, type, order: index + 1, content: {} })),
  };
}
