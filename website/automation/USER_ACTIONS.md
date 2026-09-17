# User Actions, Decisions & Human-Only Tasks

This document records decisions, approvals, environment credentials, and testing tasks reserved exclusively for the human user / project lead. Automated agents must not choose an answer or make assumptions regarding items in this document.

---

## 1. Audit of Open Product & Scope Decisions (DEC-01 through DEC-06)

Each unresolved decision is mapped below to its exact dependent task and milestone. Where a decision remains pending, only its specific dependent task waits; all independent eligible work across surfaces proceeds immediately once the overall plan is approved.

| Decision ID | Area / Scope | Question Requiring User Decision | Exact Dependent Task & Milestone | Status | Independent Eligible Work Permitted to Proceed |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-01**<br>([FR-001](FEATURE_REQUESTS.md#fr-001-public-navigation-my-dashboard-button-destination)) | Public Nav | What should the "My Dashboard" button in the public header and footer do? Options:<br>A: Redirect staff to Admin CMS (`/admin`).<br>B: Link to external member portal.<br>C: Remove/hide from public navigation. | **Task PUB-01-T2**<br>(Scheduled in GM-01 / GM-07) | `Pending User Decision`<br>*(Do not choose on user's behalf)* | All core navigation links ("Locations", "Watch", "About Us", "Care", "Give"), responsive navbar layouts, mobile drawer links, and footer pillars proceed independently. |
| **DEC-02**<br>([FR-002](FEATURE_REQUESTS.md#fr-002-youtube-sermons-automated-sync-via-cloud-function)) | Media | Should YouTube sermons sync automatically or remain manual in CMS? Options:<br>A: Manual entry for launch (paste YouTube URL in CMS).<br>B: Build scheduled Cloud Function with YouTube Data API v3. | **Task CMS-08-T2**<br>(Scheduled in GM-04 / GM-06) | `Pending User Decision`<br>*(Do not choose on user's behalf)* | Manual sermon creation in CMS, Firestore document updates, and public playback on `/watch` and `HomePage.jsx` proceed independently. |
| **DEC-03**<br>([FR-003](FEATURE_REQUESTS.md#fr-003-admin-user-access-approval--firebase-auth-custom-claims-assignment)) | Auth / Claims | Should Admin user access approval trigger Firebase Auth custom claims directly? Options:<br>A: Invoke callable Cloud Function `setAdminAccess` on approval.<br>B: Rely on Firestore `users` doc role mirror (handled by Firestore rules). | **Tasks CMS-11-T1b and CMS-11-T2**<br>(Scheduled in GM-06) | `Pending User Decision`<br>*(Do not choose on user's behalf)* | **Read-only staff profile viewing and non-privileged UI only** (reading role labels, rendering access request list, viewing current scope). **BLOCKED until DEC-03 is resolved:** any write that grants or changes effective staff roles, branch access, custom claims, or security rules — including `CMS-11-T1b` (role/scope writes in `UserAccessRequestDetailPage`) and `CMS-11-T2` (callable `setAdminAccess` invocation). |
| **DEC-04**<br>([FR-004](FEATURE_REQUESTS.md#fr-004-public-form-ingestion-architecture-direct-firestore-vs-callable-cloud-function)) | Form Ingestion | Should public forms write directly to Firestore or call `submitPublicRequest` Cloud Function? Options:<br>A: Direct Firestore writes guarded by `firestore.rules`.<br>B: Migrate forms to callable Cloud Function for audit trail. | **Tasks INT-04-T1 and INT-04-T2**<br>(Scheduled in GM-02 / GM-08) | `Pending User Decision`<br>*(Do not choose on user's behalf)* | **Form UI work and schema inspection only** (rendering form fields, validation UI, reading existing `firestore.rules` structure, and non-production schema tests). **BLOCKED until DEC-04 is resolved:** any new or changed direct-to-Firestore submission code and any callable migration code. **Existing live behavior in the Flutter website and existing React code must be preserved without modification until the selected path and compatibility requirements are confirmed.** |
| **DEC-05**<br>([FR-005](FEATURE_REQUESTS.md#fr-005-legacy-branch-urls-handling-rendered-templates-vs-301-redirects)) | Legacy Routes | Should legacy branch URLs (`/legacy/*`) be maintained as rendered templates or 301 redirects? Options:<br>A: Keep rendered templates at `/legacy/*`.<br>B: Configure HTTP 301 redirects to `/branch/:slug`. | **Task PUB-04-T3**<br>(Scheduled in GM-03) | `Pending User Decision`<br>*(Do not choose on user's behalf)* | Dynamic branch engine at `/branch/:slug` and all 9 branch landing pages proceed independently. |
| **DEC-06**<br>([FR-006](FEATURE_REQUESTS.md#fr-006-csv--excel-data-export-for-registrations--partner-rosters)) | Data Export | Is CSV/Excel export required for Event Registrations and Partner Rosters in launch scope? Options:<br>A: Required for launch.<br>B: Deferred as post-launch enhancement. | **Task CMS-05-T1**<br>(Scheduled in GM-06) | `Pending User Scope Decision`<br>**NOT required for launch unless user approves it.** | Event registration queue review, payment status toggles, session check-ins, partner roster viewing, and child linking proceed independently. |

---

## 2. Human-Only Environment & Security Setup

These tasks cannot be performed by autonomous agents and must be executed by the repository owner:

1. **Service Account Key Provisioning:**
   - Place service account key at a secure local path (e.g. `C:\secure\ssmi-database-service-account.json`) when deploying Cloud Functions or running bootstrap scripts.
   - **Never** commit service account JSON files or credentials to Git.
2. **Firebase Auth Google Sign-In Domain Allowlist:**
   - In Firebase Console -> Authentication -> Settings -> Authorized Domains, add the deployed Admin CMS domain and custom domain.
3. **Leadership Public Profiles:**
   - Set `publicProfile: true` on leadership accounts in `users` collection whose contact info appears on event detail or branch pastor cards (enforced by `firestore.rules`).
4. **Production Cutover Authorization:**
   - Explicit written sign-off required in `USER_TEST_REPORTS.md` before changing Firebase hosting targets.

---

## 3. Human Visual Acceptance Log

| Review Date | Target Surface | Viewport Checked | Visual Fidelity Approved? (~98% Target) | Signature / Notes |
| :--- | :--- | :--- | :---: | :--- |
| *Pending* | Public Website (`website/`) | All 8 Viewports | [ ] Yes [ ] No | Awaiting Milestone GM-07 visual pass |
| *Pending* | Admin CMS (`admin/`) | Desktop / Tablet | [ ] Yes [ ] No | Awaiting Milestone GM-04 & GM-06 passes |
