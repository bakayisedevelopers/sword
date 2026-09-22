# Website Developer Guide

## Stack

- React 19
- Vite 7
- Tailwind CSS
- Firebase
- Firestore
- Firebase Hosting target `website`

## Routing

Routes live in `src/app/routes.jsx`.

The project uses kebab-case public paths for React routes. Preserve existing deployed paths when adding or changing routes.

Common routes include:

- `/`
- `/locations`
- `/events`
- `/contact-us`
- `/watch`
- `/give`
- `/:branchSlug` or branch/ministry-specific route handling where configured

## Firebase and Firestore

Firebase setup lives in `src/lib/firebase.js`.

Firestore helpers and collection names live in `src/lib/firestore.js`.

The website reads dynamic content from Firestore. Admin writes should be reflected on the website without redeploying when the relevant components subscribe/read those records.

## Branch Pages

`src/pages/BranchTemplatePage.jsx` renders branch landing pages from Firestore branch documents.

Important branch fields include:

- `name`
- `slug`
- `location`
- `locationLink`
- `locationPIN`
- `email`
- `phone_number`
- `whatsapp`
- `facebook`
- `instagram`
- `youtube`
- `website`
- `bankingDetails`
- `googlepay`
- `applepay`
- `paypal`
- `yoco`
- `landingPage.heroMediaType`
- `landingPage.heroDesktopImage`
- `landingPage.heroMobileImage`
- `landingPage.heroVideoUrl`
- `landingPage.serviceTimes`
- `landingPage.pastorImage`
- `landingPage.pastorBio`
- `landingPage.givingNote`

Hero media supports:

- Image mode using desktop/mobile image URLs.
- Video mode using YouTube URLs or direct video URLs.

## Forms and Records

Public forms create Firestore records for requests, registrations, partners, sign-ups, and related workflows. Date/time fields should be written on submissions where operational follow-up depends on timestamps.

## Shared Components

Use existing shared components where possible:

- `src/components/common/QuickActionButtons.jsx`
- `src/components/common/AlbumReleaseCard.jsx`
- `src/components/common/FooterTope.jsx`
- `src/components/layout/SiteHeader.jsx`
- `src/components/layout/SiteFooter.jsx`
- `src/components/layout/MobileDrawer.jsx`
- `src/components/modals/SignUpModal.jsx`

## Styling Rules

- Preserve the established SSMI visual language.
- Keep action buttons consistent across Home, branch pages, and Contact.
- Hide visual scrollbars while preserving scroll behavior where the app already follows that pattern.
- Do not replace precise layout values with rough Tailwind approximations if a page requires visual parity.

## Build and Deploy

```bash
npm run build
```

From repo root:

```bash
npx firebase-tools deploy --only hosting:website
```

## Development Notes

- Avoid hard-coded branch contact/payment values.
- Hide unavailable social/payment/album links instead of showing placeholders.
- When adding Firestore fields used by the website, update the admin editor and this guide.
- Run `npm run build` before handing over or deploying.
