import { titleCase } from '../utils/titleCase.js';

export const churchBrand = {
  name: 'SSMI',
  fullName: 'SSMI Church',
  tagline: 'A church blueprint for the Vite/React rebuild.',
  primary: '#192431',
  accent: '#C97303',
  light: '#F7F8FA',
};

export const primaryNavigation = [
  { title: 'Home', slug: '/', description: 'Main landing page and launch point.' },
  { title: 'About Us', slug: '/about-us', description: 'Church story, leadership, and values.' },
  { title: 'Locations', slug: '/locations', description: 'Branch and campus directory.' },
  { title: 'Watch', slug: '/watch', description: 'Sermons, livestreams, and media.' },
  { title: 'Give', slug: '/give', description: 'Tithes, offerings, and campaigns.' },
  { title: 'Contact Us', slug: '/contact-us', description: 'Prayer, support, and follow up.' },
];

const publicGroups = [
  {
    key: 'core',
    title: 'Core visitor pages',
    summary: 'The public experience that replaces the FlutterFlow home journey.',
    kind: 'core',
    accent: 'bg-brand-navy',
    items: [
      {
        title: 'Home',
        slug: '/',
        note: 'Landing page and key church highlights.',
        kind: 'core',
        action: 'See route map',
      },
      {
        title: 'About Us',
        slug: '/about-us',
        note: 'Mission, leadership, and history.',
        kind: 'core',
        action: 'Read church story',
      },
      {
        title: 'Locations',
        slug: '/locations',
        note: 'Branches, campuses, and map access.',
        kind: 'core',
        action: 'Find a branch',
      },
      {
        title: 'Watch',
        slug: '/watch',
        note: 'Sermons, livestreams, and media.',
        kind: 'core',
        action: 'Open media hub',
      },
      {
        title: 'Care',
        slug: '/care',
        note: 'Pastoral care and support routes.',
        kind: 'core',
        action: 'Request care',
      },
      {
        title: 'Give',
        slug: '/give',
        note: 'Giving pathways and generosity info.',
        kind: 'core',
        action: 'See giving flow',
      },
      {
        title: 'Contact Us',
        slug: '/contact-us',
        note: 'Forms, prayer, and follow-up.',
        kind: 'core',
        action: 'Reach the church',
      },
      {
        title: 'Privacy Policy',
        slug: '/privacy-policy',
        note: 'Legal and data handling details.',
        kind: 'core',
        action: 'Review policy',
      },
    ],
  },
  {
    key: 'people',
    title: 'People and discipleship',
    summary: 'Ministry pages that mirror the FlutterFlow actions and ministries folders.',
    kind: 'people',
    accent: 'bg-brand-gold',
    items: [
      { title: 'Prayer', slug: '/prayer', note: 'Prayer requests and intercession.', kind: 'people', action: 'Submit prayer' },
      { title: 'Counseling', slug: '/ministries/counseling', note: 'Support and pastoral counseling.', kind: 'people', action: 'Open counseling' },
      { title: 'Ministries', slug: '/ministries', note: 'Central ministry hub.', kind: 'people', action: 'Browse ministries' },
      { title: 'Partner', slug: '/partner', note: 'Partnership and service pathways.', kind: 'people', action: 'See partnership' },
      { title: 'Be a Partner', slug: '/be-a-partner', note: 'Invite people to join the mission.', kind: 'people', action: 'Invite partner' },
      { title: 'Baptism', slug: '/baptism', note: 'Baptism information and registration.', kind: 'people', action: 'Register baptism' },
      { title: 'Fellowship', slug: '/fellowship', note: 'Connection and community groups.', kind: 'people', action: 'Find fellowship' },
      { title: 'Follow Jesus', slug: '/follow-jesus', note: 'Discipleship next steps.', kind: 'people', action: 'Start discipleship' },
      { title: 'Youth', slug: '/ministries/youth', note: 'Youth ministry content.', kind: 'people', action: 'Open youth page' },
      { title: 'Welfare', slug: '/ministries/welfare', note: 'Care and support ministry.', kind: 'people', action: 'See welfare' },
      { title: 'Couples', slug: '/ministries/couples', note: 'Marriage and couples ministry.', kind: 'people', action: 'View couples ministry' },
      { title: 'For Men', slug: '/ministries/for-men', note: 'Men ministry content.', kind: 'people', action: 'Open men page' },
      { title: 'For Women', slug: '/ministries/for-women', note: 'Women ministry content.', kind: 'people', action: 'Open women page' },
      { title: 'Young Adults', slug: '/ministries/young-adults', note: 'Young adults ministry.', kind: 'people', action: 'Open young adults' },
      { title: 'Singles', slug: '/ministries/singles', note: 'Singles ministry.', kind: 'people', action: 'Open singles' },
      { title: 'School of Ministry', slug: '/ministries/school-of-ministry', note: 'Teaching and training.', kind: 'people', action: 'Open training' },
      { title: 'Super Kids', slug: '/ministries/super-kids', note: 'Children and family ministry.', kind: 'people', action: 'Open kids ministry' },
    ],
  },
  {
    key: 'branches',
    title: 'Branches and campuses',
    summary: 'A location matrix that becomes the basis for route and content management.',
    kind: 'branch',
    accent: 'bg-brand-navy',
    items: [
      { title: 'Boksburg', slug: '/branches/boksburg', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'E Malahleni', slug: '/branches/e-malahleni', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Hlutsi', slug: '/branches/hlutsi', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Lagos', slug: '/branches/lagos', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Ludzeludze', slug: '/branches/ludzeludze', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Mbabane', slug: '/branches/mbabane', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Online', slug: '/branches/online', note: 'Online church experience.', kind: 'branch', action: 'View branch' },
      { title: 'Orange Farm', slug: '/branches/orange-farm', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
      { title: 'Siteki', slug: '/branches/siteki', note: 'Branch landing page.', kind: 'branch', action: 'View branch' },
    ],
  },
  {
    key: 'events',
    title: 'Events and campaigns',
    summary: 'Conference, registration, and seasonal content from the FlutterFlow build.',
    kind: 'event',
    accent: 'bg-brand-gold',
    items: [
      { title: 'Events', slug: '/events', note: 'Calendar and event detail pages.', kind: 'event', action: 'Open calendar' },
      { title: 'Register', slug: '/register', note: 'Sign-up and registration.', kind: 'event', action: 'Open registration' },
      { title: 'Camp Yolo', slug: '/camp-yolo', note: 'Conference and retreat content.', kind: 'event', action: 'Open camp page' },
      { title: 'Fire Conference', slug: '/fire-conference', note: 'Conference landing page.', kind: 'event', action: 'Open conference' },
      { title: 'Superman Conference', slug: '/superman-conference', note: 'Conference landing page.', kind: 'event', action: 'Open conference' },
      { title: 'Branch Template', slug: '/templates/branch', note: 'Reusable branch page template.', kind: 'event', action: 'Reuse template' },
      { title: 'Youth Template', slug: '/templates/youth', note: 'Reusable youth page template.', kind: 'event', action: 'Reuse template' },
      { title: 'Socials', slug: '/socials', note: 'Social links and community touchpoints.', kind: 'event', action: 'Open socials' },
    ],
  },
  {
    key: 'resources',
    title: 'Resources and giving',
    summary: 'Content surfaces that support media, learning, and generosity.',
    kind: 'resource',
    accent: 'bg-brand-navy',
    items: [
      { title: 'E Resources Center', slug: '/resources/e-resources-center', note: 'Downloads and study material.', kind: 'resource', action: 'Open resources' },
      { title: 'Podcasts', slug: '/resources/podcasts', note: 'Audio series and sermon feeds.', kind: 'resource', action: 'Open podcasts' },
      { title: 'Branch Give', slug: '/branch-give', note: 'Location-specific giving flow.', kind: 'resource', action: 'Open branch giving' },
      { title: 'Beyond Tithe', slug: '/beyond-tithe', note: 'Generosity and campaign page.', kind: 'resource', action: 'Open campaign' },
    ],
  },
];

export const publicContentGroups = publicGroups;
export const churchBlueprint = publicGroups;

export const heroStats = [
  { value: '5', label: 'content groups' },
  { value: '34', label: 'FlutterFlow routes' },
  { value: '1', label: 'shared blueprint' },
];

const routeHighlightsByKind = {
  core: ['Hero story', 'Service times', 'Call-to-action blocks'],
  people: ['Care pathway', 'Next steps', 'Community entry points'],
  branch: ['Branch info', 'Service schedule', 'Location details'],
  event: ['Event details', 'Registration links', 'Seasonal banners'],
  resource: ['Downloads', 'Media embeds', 'Giving links'],
};

export const publicRoutes = publicGroups.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupKey: group.key,
    groupTitle: group.title,
    groupSummary: group.summary,
    groupAccent: group.accent,
  })),
);

export const adminSections = publicGroups.map((group) => ({
  key: group.key,
  title: group.title,
  summary: group.summary,
  path:
    group.key === 'core'
      ? '/content'
      : group.key === 'people'
        ? '/ministries'
        : group.key === 'branches'
          ? '/branches'
          : group.key === 'events'
            ? '/events'
            : '/media',
  accent: group.accent,
  items: group.items,
}));

adminSections.push({
  key: 'settings',
  title: 'System settings',
  summary: 'User access, environment settings, and shared integrations.',
  path: '/settings',
  accent: 'bg-slate-700',
  items: [
    { title: 'Users', slug: '/settings/users', note: 'Manage editors and permissions.', kind: 'settings', action: 'Open users' },
    { title: 'Roles', slug: '/settings/roles', note: 'Assign staff and admin roles.', kind: 'settings', action: 'Open roles' },
    { title: 'Firebase config', slug: '/settings/firebase', note: 'Environment and backend wiring.', kind: 'settings', action: 'Open config' },
    { title: 'Global navigation', slug: '/settings/navigation', note: 'Public and admin nav order.', kind: 'settings', action: 'Open navigation' },
  ],
});

export const adminMetrics = [
  { value: publicRoutes.length.toString(), label: 'site routes' },
  { value: '9', label: 'branch profiles' },
  { value: '17', label: 'ministry pages' },
  { value: '4', label: 'content types' },
];

export function buildChurchBlueprint() {
  return publicGroups;
}

export function buildPublicRoutes() {
  return publicRoutes;
}

export function buildAdminSections() {
  return adminSections;
}

export function findRouteBySlug(slug, routes = publicRoutes) {
  return routes.find((route) => route.slug === slug || route.slug === `/${slug.replace(/^\/+/, '')}`);
}

export function getRoutesForGroup(groupKey, routes = publicRoutes) {
  return routes.filter((route) => route.groupKey === groupKey);
}

export function getRelatedRoutes(routeOrSlug, limit = 4, routes = publicRoutes) {
  const route =
    typeof routeOrSlug === 'string'
      ? findRouteBySlug(routeOrSlug, routes)
      : routeOrSlug;

  if (!route) {
    return routes.slice(0, limit);
  }

  return routes.filter((candidate) => candidate.slug !== route.slug && candidate.groupKey === route.groupKey).slice(0, limit);
}

export function buildRouteHighlights(routeOrSlug) {
  const route = typeof routeOrSlug === 'string' ? findRouteBySlug(routeOrSlug) : routeOrSlug;
  const kind = route?.kind || 'core';
  return routeHighlightsByKind[kind] || routeHighlightsByKind.core;
}

export function buildRouteChecklist(routeOrSlug) {
  const route = typeof routeOrSlug === 'string' ? findRouteBySlug(routeOrSlug) : routeOrSlug;
  const itemTitle = route?.title || 'this route';
  return [
    `Write the page copy for ${itemTitle}.`,
    `Add route-specific media and links for ${itemTitle}.`,
    `Connect ${itemTitle} to the admin editor workflow.`,
  ];
}

export function buildRouteSubtitle(routeOrSlug) {
  const route = typeof routeOrSlug === 'string' ? findRouteBySlug(routeOrSlug) : routeOrSlug;
  return route ? `${route.groupTitle} - ${titleCase(route.kind || route.groupKey || 'page')}` : 'Church route';
}

export function createRouteLookup(routes = publicRoutes) {
  return routes.reduce((acc, route) => {
    acc[route.slug] = route;
    return acc;
  }, {});
}

export function toSiteRoute(route) {
  return {
    ...route,
    path: route.slug === '/' ? '/' : route.slug.replace(/^\//, ''),
  };
}
