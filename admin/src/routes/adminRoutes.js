import { adminSections } from '../app/adminBlueprint';
import { workspaceCollections } from '../workspace/workspaceSpec';

export const adminRouteEntries = [
  ...workspaceCollections.map((section) => ({
    kind: 'workspace',
    title: section.title,
    path: section.path,
    section,
  })),
  ...adminSections.map((section) => ({
    kind: 'public',
    title: section.title,
    path: section.path,
    section,
  })),
];

export const adminNavEntries = [
  { title: 'Dashboard', path: '/' },
  ...workspaceCollections.map((section) => ({
    title: section.title,
    path: section.path,
  })),
  ...adminSections.map((section) => ({
    title: section.title,
    path: section.path,
  })),
];
