# Sword & Spirit Ministries Web Platform

This repository contains the production React web platform for Sword & Spirit Ministries International.

## Applications

- `website/` - Public React + Vite + Tailwind website deployed to Firebase Hosting target `website` (`ssmi-web`).
- `admin/` - React + Vite + Tailwind administration app deployed to Firebase Hosting target `admin` (`ssmi-admin`).
- `cloud-functions/` - Firebase Functions codebase used for security/support automation.
- `firebase/` - Firestore and Storage rules/indexes used by `firebase.json`.
- `scripts/` - One-off maintenance/backfill scripts.

The previous Flutter website source has been removed from this repository. The React website is now the active source for public website behavior and presentation.

## Common Commands

Run from each app folder:

```bash
npm install
npm run dev
npm run build
```

Deploy both Firebase Hosting apps from the repository root:

```bash
npx firebase-tools deploy --only hosting:admin,hosting:website
```

Deploy only one target:

```bash
npx firebase-tools deploy --only hosting:admin
npx firebase-tools deploy --only hosting:website
```

## Firebase Project

Default Firebase project: `ssmi-database`

Hosting targets:

- `admin` -> `ssmi-admin`
- `website` -> `ssmi-web`

Rules and indexes are configured in:

- `firebase/firestore.rules`
- `firebase/firestore.indexes.json`
- `firebase/storage.rules`

## Developer Documentation

Start here before changing code:

- `docs/PROJECT_HANDOFF.md`
- `admin/README.md`
- `admin/docs/DEVELOPER_GUIDE.md`
- `website/README.md`
- `website/docs/DEVELOPER_GUIDE.md`

## Current Architecture Notes

- The public website reads most dynamic content from Firestore.
- The admin app writes branch, event, ministry, request, registration, sermon, website-content, and user-access data to Firestore.
- Content updates generally do not require a website deployment because the public website reads Firestore live data.
- Code, styling, routing, Firebase configuration, and security rule changes still require build/deploy work.

## Handoff Rules

- Keep `website/` and `admin/` independently buildable.
- Run production builds before deploying.
- Preserve Firestore collection names and field semantics unless a migration plan is created.
- Do not add backend dependencies where frontend-only logic is enough.
- Do not commit secrets or local `.env` files.
