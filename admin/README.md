# SSMI Admin

The `admin/` app is the React + Vite + Tailwind administration workspace for Sword & Spirit Ministries.

It manages the Firestore records that power the public website and internal operational workflows.

## Main Responsibilities

- Branch details, branch landing-page content, service times, giving details, and location/map data.
- Website homepage content such as latest sermon, year theme, and album release links.
- Events, event locations, ticket limits, registrations, and attendance/check-in records.
- Ministries, ministry details, and ministry sign-ups.
- Requests from public forms such as contact, prayer, counselling, baptism, and follow-up.
- Partners and partner follow-up records.
- Sermons/media records.
- User access, roles, branch scope, profile details, and notifications.
- Help documentation and first-time section tours.

## Commands

```bash
npm install
npm run dev
npm run build
```

Deploy only admin from the repository root:

```bash
npx firebase-tools deploy --only hosting:admin
```

## Important Files

- `src/App.jsx` - Admin shell and route registration.
- `src/auth/` - Firebase Auth, role parsing, route protection.
- `src/components/layout/` - Header, sidebar, notification UI.
- `src/help/helpContent.js` - Help topics and tour definitions.
- `src/pages/HelpPage.jsx` - Admin guide with live embedded section previews.
- `src/pages/BranchWorkspacePage.jsx` - Branch profile/content editor.
- `src/pages/WebsiteContentPage.jsx` - Homepage-level website content editor.
- `src/tour/` - Frontend guided-tour implementation.
- `src/services/` - Frontend service helpers.

Additional developer notes: `docs/DEVELOPER_GUIDE.md`.
