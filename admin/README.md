# SSMI Admin

This folder is the Vite + React admin app for the church site.

## What it contains

- `src/app/adminBlueprint.js`: the shared admin-facing view of the church content model.
- `src/routes/adminRoutes.js`: the dashboard and section route registry.
- `src/components/layout`: the admin header and sidebar.
- `src/pages`: the dashboard, section editor, and 404 page.

## Purpose

The FlutterFlow build has a lot of content that needs a proper editing surface. This admin app
is the place to manage pages, branches, ministries, events, and shared settings separately from
the public website.

## Validation

- `npm run build` passes for the current scaffold.
- The section list is driven by the same shared blueprint as the public website.
