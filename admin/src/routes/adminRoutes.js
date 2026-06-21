import { adminSections } from '../app/adminBlueprint';

export const adminRouteEntries = adminSections.map((section) => ({
  ...section,
  path: section.path,
}));

export const adminNavEntries = [
  { title: 'Dashboard', path: '/', summary: 'Overview and system status.' },
  ...adminRouteEntries.map((section) => ({
    title: section.title,
    path: section.path,
    summary: section.summary,
  })),
];
