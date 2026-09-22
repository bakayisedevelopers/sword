# Admin Developer Guide

## Stack

- React 18
- Vite 5
- Tailwind CSS
- Firebase Auth
- Firestore
- Firebase Hosting target `admin`

## Routing

Routes are registered in `src/App.jsx` and most workspace routes are sourced from `src/routes/adminRoutes`.

Important direct routes:

- `/` - Dashboard
- `/help` - Admin guide and tour progress
- `/profile` - Current admin profile
- `/workspace/branches` - Branch workspace
- `/workspace/events` - Events workspace
- `/workspace/website-content` - Website content workspace
- `/workspace/users` - User access workspace

## Authentication and Roles

`src/auth/AuthProvider.jsx` manages Firebase Auth state, user profile sync, Google sign-in, email/password sign-in, and role resolution.

Role helpers live in `src/auth/roles.js`.

The app checks both Firebase token claims and Firestore user profile roles. A user must have an allowed admin role before entering protected routes.

## Branch Content Editing

`src/pages/BranchWorkspacePage.jsx` manages branch details and branch landing-page content.

Branch media fields are URL-based:

- `landingPage.heroDesktopImage`
- `landingPage.heroMobileImage`
- `landingPage.heroVideoUrl`
- `landingPage.heroVideoLink`
- `landingPage.heroMediaType`

The admin app does not upload these hero media files. Users paste hosted URLs. Recommended sizes are shown beside the fields:

- Desktop hero image: `1920 x 1080`
- Mobile hero image: `1080 x 1350`
- Video: minimum `1280 x 720`

## Location Helpers

Branch and event location editors can derive latitude, longitude, and a map URL from a typed address. This is frontend-only and should remain free/no paid map SDK unless explicitly approved.

## Help and Tours

Help topics are defined in `src/help/helpContent.js`.

`src/pages/HelpPage.jsx` renders:

- Topic selector/navigation.
- Step-by-step text documentation.
- Important fields list.
- A live embedded preview of the related admin route inside a constrained 16:10 laptop-style frame.
- Tour progress controls.

Guided tours are implemented in `src/tour/TourProvider.jsx`. They are section-based and trigger when a user opens a section without completed progress for that tour. Embedded previews suppress tour overlays so Help does not recursively trigger tours inside the preview.

## Notifications

Notification derivation is frontend-side in `src/hooks/useDerivedNotifications.js` and related services under `src/services/`.

## Build and Deploy

```bash
npm run build
```

From repo root:

```bash
npx firebase-tools deploy --only hosting:admin
```

## Development Notes

- Keep admin logic frontend-only unless backend behavior is explicitly required.
- Preserve Firestore field names used by the public website.
- If adding a new section, update `adminRoutes`, `helpContent`, permissions, and this guide.
- Run `npm run build` before handing over or deploying.
