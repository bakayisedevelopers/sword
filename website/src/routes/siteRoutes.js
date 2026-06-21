import { publicRoutes } from '../app/churchBlueprint';

export const siteRouteEntries = publicRoutes.map((route) => ({
  ...route,
  path: route.slug,
}));

export const routeLookup = siteRouteEntries.reduce((acc, route) => {
  acc[route.path] = route;
  return acc;
}, {});

export function getSiteRoute(pathname) {
  return routeLookup[pathname];
}
