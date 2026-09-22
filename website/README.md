# SSMI Website

The `website/` app is the production public website for Sword & Spirit Ministries.

It is a React + Vite + Tailwind app deployed to Firebase Hosting target `website`.

The previous Flutter migration source has been removed from this repository. This React app is now the active source of truth for the public site.

## Commands

```bash
npm install
npm run dev
npm run build
```

Deploy only the website from the repository root:

```bash
npx firebase-tools deploy --only hosting:website
```

## Important Areas

- `src/app/routes.jsx` - Public route table.
- `src/app/App.jsx` - App-level shell/providers.
- `src/components/layout/` - Header, footer, mobile drawer.
- `src/components/common/` - Shared website sections such as action buttons and album release card.
- `src/components/modals/` - Form and sign-up modals.
- `src/lib/firebase.js` - Firebase app setup.
- `src/lib/firestore.js` - Firestore helpers and collection constants.
- `src/pages/` - Public pages and route-level page components.
- `src/styles/index.css` - Global styles and scrollbar hiding.

Additional developer notes: `docs/DEVELOPER_GUIDE.md`.

## Dynamic Content

Most content is read from Firestore and managed by the admin app:

- Branch pages and giving data.
- Contact details and social links.
- Events and registrations.
- Ministry content and sign-ups.
- Homepage latest sermon/year theme/album links.
- Requests created by contact/prayer/care forms.

Avoid adding hard-coded branch-specific data when a Firestore field exists.
