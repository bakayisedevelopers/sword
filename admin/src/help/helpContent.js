export const helpTopics = [
  {
    id: 'overview',
    title: 'Admin overview',
    route: '/',
    summary: 'Use the admin app to manage content and operational records that power the public website.',
    steps: [
      'Start on the Dashboard to see your branch, highest role, and records that need attention.',
      'Use the left navigation to open inboxes, publishing tools, structure records, and access tools.',
      'Open Help whenever you need a reminder of what a section does before making changes.',
    ],
    fields: ['Dashboard metrics', 'Navigation groups', 'Role badge', 'Notifications'],
  },
  {
    id: 'website-admin',
    title: 'How admin and website work together',
    route: '/workspace/website-content',
    summary: 'The admin app writes Firestore records. The public React website reads those records and displays them to visitors.',
    steps: [
      'Website content, branches, ministries, events, sermons, giving details, and album links are saved in Firestore.',
      'Most content updates appear on the public website without rebuilding because the website reads Firestore live data.',
      'Code/design changes still require a build and deploy, but ordinary content updates should be managed here.',
    ],
    fields: ['websiteContent/homepage', 'branches', 'events', 'ministries', 'sermons', 'requests', 'registrations'],
  },
  {
    id: 'roles',
    title: 'Roles and permissions',
    route: '/workspace/users',
    summary: 'Roles decide which sections a user can open and which branch or ministry records they can manage.',
    steps: [
      'Super admins and global editors manage global content and user access.',
      'Branch editors work with assigned branch records and branch-owned workflows.',
      'Ministry editors work with assigned ministry records. Care team users process requests and follow-up items.',
    ],
    fields: ['roles', 'branch', 'other_branches', 'staff_positions', 'accessRequests'],
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    route: '/',
    summary: 'The Dashboard is the operational starting point for each admin user.',
    steps: [
      'Confirm your branch and role at the top.',
      'Use the metric cards to jump to records needing attention.',
      'Open Help or restart section tours from the training card.',
    ],
    fields: ['Branch label', 'Highest role', 'Metrics', 'Quick links'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    route: '/',
    summary: 'Notifications surface records that need review, follow-up, or approval.',
    steps: [
      'Use the bell in the header to open notifications.',
      'Select a notification to navigate to the related record.',
      'Notification counts are derived from requests, registrations, sign-ups, access requests, and other active records.',
    ],
    fields: ['Requests', 'Registrations', 'Sign-ups', 'Access requests', 'Browser notifications'],
  },
  {
    id: 'profile',
    title: 'Profile',
    route: '/profile',
    summary: 'Profile stores your personal details, branch scope, ministry roles, and notification preferences.',
    steps: [
      'Update your display information and branch details where your role allows it.',
      'Request access changes if you need more permissions.',
      'Manage notification preferences so you only receive relevant alerts.',
    ],
    fields: ['Profile details', 'Branch', 'Ministry roles', 'Notification preferences'],
  },
  {
    id: 'requests',
    title: 'Requests',
    route: '/workspace/requests',
    summary: 'Requests are created from public website forms such as contact, prayer, counselling, baptism, and follow-up forms.',
    steps: [
      'Open a request to review its message and contact details.',
      'Assign or confirm the branch when required.',
      'Update status after follow-up so the record no longer appears as new.',
    ],
    fields: ['name', 'surname', 'cell', 'message', 'type', 'date', 'branch', 'status'],
  },
  {
    id: 'registrations',
    title: 'Event registrations',
    route: '/workspace/registrations',
    summary: 'Registrations are submitted from public event pages and can be checked in during an event.',
    steps: [
      'Filter by branch or event to find the registration.',
      'Open the registration to see attendee details.',
      'Use check-in/check-out tools when the linked event supports attendance tracking.',
    ],
    fields: ['eventName', 'branch', 'date', 'checkedIn', 'checkedOut', 'checkIns'],
  },
  {
    id: 'sign-ups',
    title: 'Ministry sign-ups',
    route: '/workspace/sign-ups',
    summary: 'Sign-ups capture serving, ministry, and other smaller intake flows from the website.',
    steps: [
      'Review each submission and confirm the requested branch or ministry.',
      'Use status fields to track follow-up progress.',
      'Contact the person using the saved phone or email information.',
    ],
    fields: ['name', 'surname', 'cell', 'branch', 'message', 'type', 'date'],
  },
  {
    id: 'partners',
    title: 'Partners',
    route: '/workspace/partners',
    summary: 'Partners store membership and partner intake details for branch follow-up.',
    steps: [
      'Open a partner record to review personal, faith, family, and branch information.',
      'Update the record after follow-up or branch assignment changes.',
      'Use the details page to inspect linked family records where available.',
    ],
    fields: ['name', 'surname', 'cell', 'email', 'branch', 'homeCell', 'bornAgain', 'baptised'],
  },
  {
    id: 'events',
    title: 'Events',
    route: '/workspace/events',
    summary: 'Events power the public events pages and event registration flows.',
    steps: [
      'Create or open an event profile.',
      'Set branch scope, date/time, location, registration, ticket limit, and check-in options.',
      'Use the location helper to generate map links from an address when needed.',
    ],
    fields: ['title', 'description', 'date', 'booking', 'location', 'location_link', 'ticketLimit', 'branches'],
  },
  {
    id: 'sermons',
    title: 'Sermons and media',
    route: '/workspace/sermons',
    summary: 'Sermons manage media sources used by watch, sermon, podcast, and branch media areas.',
    steps: [
      'Select the branch and media source type.',
      'Add or review media source URLs such as YouTube, podcast RSS, Spotify, or Facebook.',
      'Open media records to verify title, preacher, branch, description, and external link fields.',
    ],
    fields: ['Title', 'date', 'description', 'videoLink', 'preacher', 'branchName', 'sourceType'],
  },
  {
    id: 'website-content',
    title: 'Website content',
    route: '/workspace/website-content',
    summary: 'Website content controls homepage-level public content such as latest sermon, year theme, and album release links.',
    steps: [
      'Update latest sermon and year theme information for the public homepage.',
      'Add Spotify, YouTube, and Apple Music album links only when the links should appear publicly.',
      'Save each content group and verify the public website displays the updated content.',
    ],
    fields: ['latestSermonTitle', 'latestSermonVideoUrl', 'yearThemeDesktopImageUrl', 'albumReleaseSpotifyUrl'],
  },
  {
    id: 'branches',
    title: 'Branches',
    route: '/workspace/branches',
    summary: 'Branches control branch pages, branch contact details, locations, service times, and branch giving details.',
    steps: [
      'Edit branch details for contact, location, social links, and banking information.',
      'Use branch content to update landing-page hero image/video URLs, service times, pastor image, bio, and giving notes.',
      'Use the location helper to generate coordinates and map URLs from a branch address.',
    ],
    fields: ['name', 'slug', 'location', 'locationPIN', 'bankingDetails', 'landingPage', 'socialLinks'],
  },
  {
    id: 'ministries',
    title: 'Ministries',
    route: '/workspace/ministries',
    summary: 'Ministries control public ministry pages, serving details, branch coverage, and ministry sign-up context.',
    steps: [
      'Create or open a ministry profile.',
      'Set branch coverage and public page details.',
      'Keep contact and serving information up to date so the website displays the right branch-specific information.',
    ],
    fields: ['name', 'description', 'picture', 'branches', 'meetingDetails', 'contactName', 'contactEmail'],
  },
  {
    id: 'users',
    title: 'Users and access',
    route: '/workspace/users',
    summary: 'Users and access requests control admin roles, branch scopes, and who can enter the admin app.',
    steps: [
      'Review pending access requests.',
      'Open user records to assign roles and branch scopes.',
      'Only grant the minimum role needed for the user’s real responsibility.',
    ],
    fields: ['email', 'roles', 'branch', 'other_branches', 'accessRequests', 'authStatus'],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    route: '/help',
    summary: 'Use these checks when something does not appear or save as expected.',
    steps: [
      'If save fails, confirm your role has write permission for that section.',
      'If website content is missing, confirm the Firestore record has the expected field filled in.',
      'If branch data appears wrong, confirm the branch name, slug, and branch scope match the website route.',
      'If an event does not appear, confirm date, branch scope, global flag, and registration settings.',
      'If ticket counts do not reduce, confirm registration is enabled and ticketLimit is saved on the event.',
    ],
    fields: ['Permissions', 'Firestore data', 'Branch scope', 'Website route', 'Registration settings'],
  },
];

export const helpTopicMap = Object.fromEntries(helpTopics.map((topic) => [topic.id, topic]));

export const tourDefinitions = {
  dashboard: {
    title: 'Dashboard tour',
    route: '/',
    steps: [
      { target: 'dashboard-hero', title: 'Your current admin context', body: 'This area shows your profile name, assigned branch, and highest admin role.' },
      { target: 'dashboard-training', title: 'Help and guided tours', body: 'Use this panel to open Help or restart tours when you need a refresher.' },
      { target: 'dashboard-metrics', title: 'Operational shortcuts', body: 'These cards show records that need attention and link directly to the relevant workspace.' },
      { target: 'admin-sidebar', title: 'Main navigation', body: 'The sidebar groups records into inboxes, publishing, structure, and access areas.' },
    ],
  },
  notifications: {
    title: 'Notifications tour',
    route: '/',
    steps: [
      { target: 'notifications-button', title: 'Notification bell', body: 'Open this to see records that need review or follow-up.' },
      { target: 'notifications-panel', title: 'Notification list', body: 'Each item links to the related request, registration, sign-up, access request, or other record.' },
    ],
  },
  profile: {
    title: 'Profile tour',
    route: '/profile',
    steps: [
      { target: 'profile-details', title: 'Profile details', body: 'Keep your name, branch, office, and ministry role information current.' },
      { target: 'profile-access-request', title: 'Access requests', body: 'Ask for branch reassignment or additional admin roles here. These requests are reviewed by approved leaders.' },
      { target: 'profile-notification-preferences', title: 'Notification preferences', body: 'Choose which record types notify you and whether browser alerts are enabled.' },
    ],
  },
};

const genericTourBodies = {
  requests: 'Requests are public form submissions. Open records, review contact details, update branch/status, and follow up.',
  registrations: 'Registrations come from event pages. Use filters, open attendee records, and manage event check-ins where enabled.',
  'sign-ups': 'Ministry sign-ups collect serving and ministry interest. Review the person, branch, type, and follow-up status.',
  partners: 'Partners contain membership and partner intake information for branch follow-up.',
  events: 'Events control public event listings, registration, ticket limits, map links, and check-in settings.',
  sermons: 'Sermons and media configure branch media sources and records displayed on the public website.',
  'website-content': 'Website content controls homepage-level public content, year theme artwork, latest sermon, and album links.',
  branches: 'Branches control branch pages, contact details, locations, service times, giving details, and landing content.',
  ministries: 'Ministries control public ministry pages, branch coverage, contacts, serving details, and sign-up context.',
  users: 'Users and access controls admin account approvals, roles, and branch scopes.',
};

Object.entries(genericTourBodies).forEach(([key, body]) => {
  const targetsByKey = {
    requests: ['requests-tabs', 'requests-filters', 'requests-list'],
    registrations: ['registrations-tabs', 'registrations-filters', 'registrations-list'],
    events: ['events-tabs', 'events-create-form', 'events-registration-settings'],
    branches: ['branches-tabs', 'branches-details-form', 'branches-content-form'],
    'website-content': ['website-content-sermon', 'website-content-theme', 'website-content-album'],
  };
  const targets = targetsByKey[key] || ['admin-main', 'admin-sidebar', 'admin-help-link'];

  tourDefinitions[key] = {
    title: `${helpTopicMap[key]?.title || key} tour`,
    route: helpTopicMap[key]?.route || '/workspace',
    steps: targets.map((target, index) => ({
      target,
      title: index === 0 ? (helpTopicMap[key]?.title || 'Workspace section') : index === 1 ? 'Main tools' : 'Help stays available',
      body: index === 0 ? body : index === 1 ? 'Use the controls in this area to filter, create, edit, or save records for this section.' : 'Open Help any time to review documentation, workflows, and troubleshooting.',
    })),
  };
});

export function sectionKeyFromPath(pathname) {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/profile')) return 'profile';
  const match = pathname.match(/^\/workspace\/([^/]+)/);
  if (match?.[1]) return match[1];
  return '';
}
