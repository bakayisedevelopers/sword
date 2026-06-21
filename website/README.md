# SSMI Website Redesign (Vite + React + Tailwind)

## What was analyzed from the current Flutter codebase

- **Navigation and IA**: `lib/index.dart` exports a broad set of pages (home, branches, ministries, care actions, resources, conferences), which suggests a content-heavy church portal rather than a simple landing page.
- **Design tokens**: `lib/flutter_flow/flutter_flow_theme.dart` defines a light scheme with key brand colors:
  - `secondary` / `primaryText`: `#192431` (deep navy)
  - `tertiary` / `alternate`: `#C97303` (gold accent)
  - `primary` / `secondaryBackground`: `#FFFFFF`
- **Homepage direction**: `lib/main_pages/home/home_widget.dart` uses a hero card, ministry/event pathways, and responsive desktop/mobile blocks.

## Redesign approach implemented

This folder contains a fresh **Vite + React + Tailwind** front-end concept that:

1. Preserves the original content model (home, ministries, branches, giving/watch calls-to-action).
2. Applies a modern card/grid pattern with stronger visual hierarchy.
3. Uses the same core brand colors from Flutter in `tailwind.config.js`.
4. Is ready for incremental migration (you can split sections into route-based pages next).
5. Avoids binary assets in the redesign package to keep PR tooling compatible.

## Run locally

```bash
cd web-redesign
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Next migration steps

- Add `react-router-dom` and break sections into routes that mirror current Flutter pages.
- Move shared data (ministries, branches, events) into JSON/API layer.
- Rebuild forms (Prayer, Partnership, Contact) as controlled React form components.
- Connect Firebase client SDK if parity with current backend is required.
- Add an image/content pipeline (CDN or CMS) after PR system constraints are addressed.
