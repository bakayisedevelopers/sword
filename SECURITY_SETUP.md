# SSMI admin foundation and security setup

This repository targets `ssmi-database`. The React admin and Flutter website
share that Firebase project; no second data store is introduced.

## Before deployment

1. In Firebase Authentication, enable Email/Password and Google. Add the
   deployed admin domain to Authentication's Authorized domains list. Google
   sign-in creates a Firebase account automatically on first use, but it does
   not grant admin access by itself.
2. Grant the account the `super_admin` custom claim with a service account:

   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\secure\ssmi-database-service-account.json'
   npm --prefix cloud-functions run grant:admin -- <FIREBASE_UID> super_admin
   ```

   The service account must never be committed. The administrator must sign out
   and sign in again after their claims change.
3. Set `publicProfile: true` for every leadership account used as an event
   contact or branch pastor. Public profile reads are otherwise denied so that
   ordinary user records remain private.
4. Install and authenticate the Firebase CLI for `ssmi-database`.

## Deploy in this order

```powershell
npm --prefix admin run build
npm --prefix cloud-functions run lint
firebase deploy --only firestore:rules,firestore:indexes,storage --project ssmi-database
firebase deploy --only functions:security --project ssmi-database
```

The Hosting site is intentionally unbound. Once its site ID is known, bind and
deploy the admin explicitly:

```powershell
firebase target:apply hosting admin <HOSTING_SITE_ID> --project ssmi-database
firebase deploy --only hosting:admin --project ssmi-database
```

## Roles

- `super_admin`: manages all protected data and other admin accounts.
- `global_editor`: manages global content, events, branches, ministries, media,
  and settings.
- `branch_editor` / `ministry_editor`: reserved for scoped editing in the next
  CMS milestone.
- `care_team`: manages public requests, registrations, partner applications,
  and sign-ups.
- `reports_viewer`: reads audit and reporting data once reports are added.

Firebase custom claims grant access for ordinary staff roles. The allowlisted
`developer.obie@gmail.com` account is additionally recognized directly by the
admin application and Firestore rules. On login, the app mirrors all approved
roles to that account's `/users/{uid}` document for administration and
reporting.
