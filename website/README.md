# SSMI Website React Migration

This directory is the destination workspace for migrating the existing Flutter website in `../flutter-website/` to React, Vite, and Tailwind CSS.

`../flutter-website/` is the read-only source of truth for visual appearance, behavior, assets, routes, Firebase access, Firestore collection names, and page functionality. Do not modify it during migration work.

The master migration plan is:

`docs/MIGRATION_PLAN.md`

Start every migration task by reading that document, then re-inspect the relevant Flutter source files before implementing the approved phase or page. This workspace is currently Phase 0 scaffold only; no Flutter page has been migrated.
