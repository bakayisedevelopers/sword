export const adminRoles = [
  'super_admin',
  'global_editor',
  'branch_editor',
  'ministry_editor',
  'care_team',
  'reports_viewer',
];

export const roleDisplayNames = {
  super_admin: 'Super Admin',
  global_editor: 'Global Editor',
  branch_editor: 'Branch Editor',
  ministry_editor: 'Ministry Editor',
  care_team: 'Care Team',
  reports_viewer: 'Reports Viewer',
};

export function roleLabel(role) {
  if (!role) {
    return '';
  }

  return roleDisplayNames[role] || role.replace(/_/g, ' ');
}

export const developerAdminEmails = ['developer.obie@gmail.com', 'bakayise.developers@gmail.com'];

export function isDeveloperAdmin(email) {
  const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';
  return developerAdminEmails.includes(normalized);
}

export function rolesFromClaims(claims = {}) {
  return Array.isArray(claims.roles)
    ? claims.roles.filter((role) => adminRoles.includes(role))
    : [];
}

export function rolesFromProfile(profile = {}) {
  if (Array.isArray(profile.roles)) {
    const roles = profile.roles.filter((role) => adminRoles.includes(role));
    if (roles.length > 0) return roles;
  }

  if (Array.isArray(profile.approvedRoles)) {
    const roles = profile.approvedRoles.filter((role) => adminRoles.includes(role));
    if (roles.length > 0) return roles;
  }

  if (Array.isArray(profile.approved_roles)) {
    const roles = profile.approved_roles.filter((role) => adminRoles.includes(role));
    if (roles.length > 0) return roles;
  }

  if (Array.isArray(profile.userRoles)) {
    const roles = profile.userRoles.filter((role) => adminRoles.includes(role));
    if (roles.length > 0) return roles;
  }

  if (typeof profile.role === 'string' && adminRoles.includes(profile.role)) {
    return [profile.role];
  }

  if (typeof profile.approvedRole === 'string' && adminRoles.includes(profile.approvedRole)) {
    return [profile.approvedRole];
  }

  return [];
}

export function canAccessAdmin(roles) {
  return roles.length > 0;
}

export function hasRole(roles, role) {
  return roles.includes('super_admin') || roles.includes(role);
}

export const rolePriority = [
  'super_admin',
  'global_editor',
  'branch_editor',
  'ministry_editor',
  'care_team',
  'reports_viewer',
];

export function highestRole(roles = []) {
  return rolePriority.find((role) => roles.includes(role)) || '';
}

export const ministryRoleOptions = [
  { id: 'pastor', label: 'Pastor' },
  { id: 'associate_pastor', label: 'Associate Pastor' },
  { id: 'minister', label: 'Minister' },
  { id: 'worship_leader', label: 'Worship Leader' },
  { id: 'worship_team', label: 'Worship Team' },
  { id: 'bass_player', label: 'Bass Player' },
  { id: 'drummer', label: 'Drummer' },
  { id: 'vocalist', label: 'Vocalist' },
  { id: 'media_team', label: 'Media Team' },
  { id: 'usher', label: 'Usher' },
  { id: 'kids_ministry', label: 'Kids Ministry' },
  { id: 'youth_ministry', label: 'Youth Ministry' },
  { id: 'prayer_team', label: 'Prayer Team' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'counsellor', label: 'Counsellor' },
  { id: 'finance_team', label: 'Finance Team' },
  { id: 'events_team', label: 'Events Team' },
  { id: 'follow_up', label: 'Follow-up Team' },
  { id: 'communications', label: 'Communications' },
  { id: 'admin_support', label: 'Admin Support' },
];

export function ministryRoleLabel(role) {
  return ministryRoleOptions.find((option) => option.id === role)?.label || roleLabel(role);
}
