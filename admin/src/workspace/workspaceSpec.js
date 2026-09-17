export const roleDefinitions = [
  {
    role: 'super_admin',
    title: 'Super admin',
    summary: 'Full access across every collection, role assignment, and branch/ministry scope.',
  },
  {
    role: 'global_editor',
    title: 'Global editor',
    summary: 'Can edit global content, all branches, all ministries, and shared operational records.',
  },
  {
    role: 'branch_editor',
    title: 'Branch editor',
    summary: 'Can manage only the branch or branches assigned to that account.',
  },
  {
    role: 'ministry_editor',
    title: 'Ministry editor',
    summary: 'Can manage only the ministry or ministries assigned to that account.',
  },
  {
    role: 'care_team',
    title: 'Care team',
    summary: 'Can process requests, follow-up items, and care-related inboxes.',
  },
  {
    role: 'reports_viewer',
    title: 'Reports viewer',
    summary: 'Read-only access for review, oversight, and export workflows.',
  },
];

export const workspaceCollections = [
  {
    key: 'requests',
    title: 'Requests',
    collection: 'requests',
    path: '/workspace/requests',
    area: 'Inbox',
    summary: 'General contact, prayer, counselling, and follow-up requests from the public site.',
    scope: 'Branch-aware review with global visibility for approved roles.',
    editorRoles: ['care_team', 'branch_editor', 'global_editor', 'super_admin'],
    fields: ['name', 'surname', 'cell', 'message', 'type', 'date', 'branch'],
    actions: ['Review request', 'Assign branch', 'Close the loop'],
    notes: 'Created by public forms and callable request flows.',
  },
  {
    key: 'registrations',
    title: 'Event registrations',
    collection: 'registrations',
    path: '/workspace/registrations',
    area: 'Inbox',
    summary: 'Registrations submitted from event pages and conference pages.',
    scope: 'Branch and event aware, usually processed by the event owner or branch editor.',
    editorRoles: ['branch_editor', 'global_editor', 'super_admin'],
    fields: ['name', 'surname', 'cell', 'message', 'eventName', 'branch', 'date'],
    actions: ['Approve attendance', 'Export list', 'Link to event'],
    notes: 'Supports event check-in and registration follow-up.',
  },
  {
    key: 'sign-ups',
    title: 'Ministry SignUps',
    collection: 'signUps',
    path: '/workspace/sign-ups',
    area: 'Access',
    summary: 'Generic sign-up entries used by the public site for smaller intake flows.',
    scope: 'Branch-scoped review when a sign-up is tied to a local branch.',
    editorRoles: ['branch_editor', 'global_editor', 'care_team', 'super_admin'],
    fields: ['name', 'surname', 'cell', 'branch', 'message', 'type', 'date'],
    actions: ['Review submission', 'Tag by type', 'Route to branch'],
    notes: 'Works well for smaller forms that do not need a dedicated collection.',
  },
  {
    key: 'partners',
    title: 'Partners',
    collection: 'partners',
    path: '/workspace/partners',
    area: 'Access',
    summary: 'Partner and member intake information, including home cell and branch details.',
    scope: 'Branch-owned with ministry oversight when needed.',
    editorRoles: ['branch_editor', 'global_editor', 'super_admin'],
    fields: ['name', 'surname', 'DOB', 'Occupation', 'workplace', 'address', 'cell', 'email', 'bornAgain', 'bornAgainDate', 'baptised', 'filled', 'tongues', 'homeCell', 'homeCellName', 'kid', 'parent', 'branch', 'postalCode'],
    actions: ['Review partner', 'Update branch', 'Link to follow-up'],
    notes: 'Feeds the partner journey and branch care workflow.',
  },
  {
    key: 'events',
    title: 'Events',
    collection: 'events',
    path: '/workspace/events',
    area: 'Publishing',
    summary: 'Church events, conferences, recurring services, and registration-aware listings.',
    scope: 'Global, branch, or ministry owned depending on the event.',
    editorRoles: ['branch_editor', 'ministry_editor', 'global_editor', 'super_admin'],
    fields: ['title', 'description', 'date', 'booking', 'picture', 'global', 'branch', 'location', 'location_link', 'price', 'recurring', 'day', 'time', 'branch_name', 'repeat', 'date_details', 'time_details', 'contactPerson', 'mininstryName', 'ministry', 'branches'],
    actions: ['Create event', 'Toggle registration', 'Scope by branch'],
    notes: 'This is the main source for the public events pages.',
  },
  {
    key: 'sermons',
    title: 'Sermons',
    collection: 'sermons',
    path: '/workspace/sermons',
    area: 'Publishing',
    summary: 'Combined branch media workspace for YouTube sermons, podcast episodes, and Facebook videos.',
    scope: 'Branch-aware media library with global oversight.',
    editorRoles: ['branch_editor', 'global_editor', 'super_admin'],
    fields: ['Title', 'date', 'description', 'videoLink', 'link', 'preacher', 'branchName', 'branch', 'video'],
    actions: ['Review imported media', 'Configure source pullers', 'Open media details'],
    notes: 'Reads and writes the native sermons and podcast collections used by the public website.',
  },
  {
    key: 'website-content',
    title: 'Website content',
    collection: 'websiteContent',
    path: '/workspace/website-content',
    area: 'Publishing',
    summary: 'Homepage-level public content such as the latest sermon display and theme-of-the-year artwork.',
    scope: 'Global public website content managed by super admins and global editors.',
    editorRoles: ['global_editor', 'super_admin'],
    fields: ['latestSermonTitle', 'latestSermonVideoUrl', 'latestSermonSource', 'latestSermonPublishedAt', 'yearThemeTitle', 'yearThemeSubtitle', 'yearThemeDesktopImageUrl', 'yearThemeMobileImageUrl'],
    actions: ['Update homepage sermon', 'Fetch latest YouTube video', 'Update year theme image links'],
    notes: 'Public website reads websiteContent/homepage. YouTube API settings are stored privately in siteSettings/homepageYouTube.',
  },
  {
    key: 'branches',
    title: 'Branches',
    collection: 'branches',
    path: '/workspace/branches',
    area: 'Structure',
    summary: 'Branch profile data, contact details, location pins, and giving details.',
    scope: 'Branch-specific access for branch editors, global access for overseers.',
    editorRoles: ['branch_editor', 'global_editor', 'super_admin'],
    fields: ['name', 'slug', 'website', 'Image', 'location', 'country', 'date', 'locationPIN', 'bankingDetails', 'pastor', 'email', 'whatsapp', 'instagram', 'facebook', 'youtube', 'phone_number', 'googlepay', 'applepay', 'paypal', 'yoco', 'landingPage.heroTitle', 'landingPage.heroSubtitle', 'landingPage.heroMediaType', 'landingPage.heroDesktopImage', 'landingPage.heroMobileImage', 'landingPage.heroVideoUrl', 'landingPage.heroImage', 'landingPage.heroVideoLink', 'landingPage.serviceTimes[]', 'landingPage.pastorBio', 'landingPage.landingHighlights', 'landingPage.givingNote', 'landingPage.givingLink'],
    actions: ['Edit branch profile', 'Update banking', 'Manage contact links', 'Edit landing-page content'],
    notes: 'This drives branch pages, branch giving flows, and the future branch landing page.',
  },
  {
    key: 'ministries',
    title: 'Ministries',
    collection: 'ministries',
    path: '/workspace/ministries',
    area: 'Structure',
    summary: 'Ministry pages, contact details, serving details, and branch coverage.',
    scope: 'Ministry-specific access for ministry editors and global oversight.',
    editorRoles: ['ministry_editor', 'global_editor', 'super_admin'],
    fields: ['name', 'description', 'picture', 'FEWDS', 'branches', 'meetingDetails', 'servingDetails', 'contactName', 'contactEmail', 'contactWhatsApp', 'donations', 'volunteers', 'bankingDetails', 'ministryName', 'forServing'],
    actions: ['Edit ministry page', 'Link branches', 'Update contacts'],
    notes: 'This drives ministry pages and ministry-specific flows.',
  },
  {
    key: 'users',
    title: 'Users',
    collection: 'users',
    path: '/workspace/users',
    area: 'Access',
    summary: 'Staff profiles, branch assignment, and leadership flags used by the admin auth model.',
    scope: 'Super admin and global editor only for approval workflows.',
    editorRoles: ['super_admin', 'global_editor'],
    fields: ['email', 'display_name', 'photo_url', 'uid', 'created_time', 'lastLoginAt', 'authAccount', 'authStatus', 'phone_number', 'name', 'surname', 'bio', 'branch', 'other_branches', 'staff_positions', 'office', 'roles', 'whatspp', 'facebook', 'youtube', 'global_leader', 'global_position', 'HOD', 'Director', 'SeniorPastor', 'AssociatePastor', 'DirectorListing'],
    actions: ['Approve access', 'Assign roles', 'Set branch scope'],
    notes: 'Backs the custom-claims workflow for admin access.',
  },
];

export const workspaceNavGroups = [
  {
    title: 'Inbox',
    items: workspaceCollections.filter((section) => section.area === 'Inbox').map((section) => ({
      key: section.key,
      title: section.title,
      path: section.path,
      summary: section.summary,
    })),
  },
  {
    title: 'Publishing',
    items: workspaceCollections.filter((section) => section.area === 'Publishing').sort((left, right) => {
      if (left.key === 'website-content') return -1;
      if (right.key === 'website-content') return 1;
      return 0;
    }).map((section) => ({
      key: section.key,
      title: section.title,
      path: section.path,
      summary: section.summary,
    })),
  },
  {
    title: 'Structure',
    items: workspaceCollections.filter((section) => section.area === 'Structure').map((section) => ({
      key: section.key,
      title: section.title,
      path: section.path,
      summary: section.summary,
    })),
  },
  {
    title: 'Partners',
    items: workspaceCollections.filter((section) => section.area === 'Access').map((section) => ({
      key: section.key,
      title: section.title,
      path: section.path,
      summary: section.summary,
    })),
  },
];

export const workspaceCollectionMap = Object.fromEntries(workspaceCollections.map((section) => [section.key, section]));

export const workspacePriorityOrder = ['requests', 'registrations', 'events', 'branches', 'ministries', 'sermons', 'users'];

export const workspaceSummaryCards = [
  { label: 'collections in scope', value: workspaceCollections.length },
  { label: 'role profiles', value: roleDefinitions.length },
];
