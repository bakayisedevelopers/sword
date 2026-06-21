# Shared Functions

This folder holds the common helpers and content blueprint used by the website and admin app.

## Current exports

- `slugify`
- `titleCase`
- `churchBrand`
- `primaryNavigation`
- `publicContentGroups`
- `publicRoutes`
- `adminSections`
- `adminMetrics`
- `buildRouteHighlights`
- `buildRouteChecklist`
- `buildRouteSubtitle`
- `findRouteBySlug`
- `getRelatedRoutes`

## Why it exists

The public website and the admin dashboard should not drift apart. Keeping the route/content
blueprint in one place makes it easier to keep the FlutterFlow migration organized and consistent.
