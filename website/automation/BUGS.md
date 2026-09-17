# Bug Register: SSMI Defects & Cross-Surface Implications

This register tracks confirmed functional, structural, and integration defects identified during the codebase audit. Each defect documents its root cause, affected files across all surfaces, cross-surface implications for both Public Site and Admin CMS, and resolution verification plans.

---

## Summary of Open Defects

| Bug ID | Title | Severity | Primary Surface | Cross-Surface Impact | Target Milestone | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | `RegisterPage.jsx` Routes Event Registrations to `requests` Instead of `registrations` | Critical | Public Website | Breaks CMS Event Registration Roster | GM-02 | Resolved |
| **BUG-02** | `useFirestoreQuery` Drops Filters Due to Constraint Object vs Array Mismatch | Critical | Public Website | Data Layer / Query Failures | GM-01 | Resolved |
| **BUG-03** | Missing Events Due to Legacy Field Typo `'mininstryName'` | High | Shared Schema | Drops Events on Public Pages | GM-01 | Resolved |
| **BUG-04** | Case Mismatch for Ministry FEWDS Framework (`m.FEWDS` vs `m.fewds`) | Medium | Public Website | Breaks Department Filter Chips | GM-01 | Resolved |
| **BUG-05** | `BeAPartnerPage.jsx` Schema Discrepancies and Unindexed Child Array | High | Public Website | Breaks CMS Child Linking; Violates Firestore Rules | GM-02 | Resolved |
| **BUG-06** | `PodcastsPage.jsx` Lacks Firestore Integration (Static Mock Only) | Medium | Public Website | Disconnects CMS Podcast Publishing | GM-04 | Resolved |
| **BUG-07** | Dummy South African Cities Used Instead of Official SSMI Branches | Medium | Public Website | Misroutes Congregants to Fake Locations | GM-03 | Resolved |
| **BUG-08** | Query Parameter Incompatibility on `EventPage.jsx` (`?id=` vs `?event=`) | Medium | Public Website | Breaks Shared & Cross-App Event Links | GM-04 | Resolved |
| **BUG-09** | Fabricated Visual Verification Checksums in Existing Verification Baseline | High | QA / Testing | Invalidates Previous Visual Baseline | GM-07 | Resolved |

---

## Detailed Bug Records & Cross-Surface Implications

### BUG-01: `RegisterPage.jsx` Routes Event Registrations to `requests` Instead of `registrations`
- **Severity:** Critical
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task INT-01-T1, RUN-006, Verified by Build)
- **Affected Files:**
  - `website/src/pages/RegisterPage.jsx` (Public Form)
  - `admin/src/pages/RegistrationsWorkspacePage.jsx` (CMS Intake Queue)
  - `admin/src/pages/RegistrationDetailPage.jsx` (CMS Attendance / Check-In)
  - `flutter-website/lib/pages/register/register_widget.dart` (Reference)
  - `flutter-website/firebase/firestore.rules` (`validRegistration` rule)
- **Cross-Surface Implications:**
  - **Public Site:** When congregants register for an event (e.g. Fire Conference, Easter Summit), the form submits to `requests` with a combined string and `requestType: 'Registration'`.
  - **Admin CMS:** The church event coordinator uses `RegistrationsWorkspacePage.jsx`, which queries only the `registrations` collection. Because records are routed to `requests`, **zero registrations appear in the event roster**, rendering attendance tracking, payment verification, and multi-session check-ins completely non-functional.
  - **Security Rules:** `firestore.rules` enforces `validRegistration(data)` on `registrations/` and `validRequest(data)` on `requests/`. Submitting registration fields to `requests/` risks rejection if keys do not match `validRequestKeys`.
- **Cross-Surface Acceptance Case:**
  1. Submit registration on `/register` for event "Fire Conference 2026".
  2. Document MUST be written to `registrations` collection with: `name`, `surname`, `cell`, `branch`, `eventName`, `message`, `date`.
  3. Open `admin/` at `/workspace/registrations`:
     - The registration MUST appear under "New registrations".
     - Event filter by "Fire Conference 2026" MUST include the record.
     - Opening `/workspace/registrations/{id}` MUST allow staff to mark reviewed, toggle payment status, and execute session check-ins.

---

### BUG-02: `useFirestoreQuery` Drops Filters Due to Constraint Object vs Array Mismatch
- **Severity:** Critical
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task DATA-01-T1, RUN-002, Verified by Build)
- **Affected Files:**
  - `website/src/hooks/useFirestoreQuery.js`
  - `website/src/lib/firestore.js`
  - `website/src/pages/WatchPage.jsx`
  - `website/src/pages/GivePage.jsx`
  - `website/src/pages/FireConferencePage.jsx`
  - `website/src/pages/SupermanConferencePage.jsx`
- **Cross-Surface Implications:**
  - **Public Site:** Pages passing `{ where: [...], orderBy: ... }` cause the Firebase SDK `query()` to throw or silently drop filters, defaulting to unconstrained collections or empty arrays. Sermons fail to sort by date descending; conference event lists fail to filter by conference name.
  - **Admin CMS:** While Admin CMS writes data correctly, public users cannot view filtered subsets of that data.
- **Resolution Plan (GM-01):**
  Refactor `useFirestoreQuery.js` and `firestore.js` to parse constraint definitions and instantiate genuine Firebase `QueryConstraint` instances (`where()`, `orderBy()`, `limit()`).

---

### BUG-03: Missing Events Due to Legacy Field Typo `'mininstryName'`
- **Severity:** High
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task DATA-02-T2, RUN-004, Verified by Build)
- **Affected Files:**
  - `website/src/pages/MinistriesPage.jsx`
  - `website/src/pages/CampYoloPage.jsx`
  - `website/src/pages/FireConferencePage.jsx`
  - `website/src/pages/SupermanConferencePage.jsx`
  - `admin/src/pages/EventsWorkspacePage.jsx` (Writes `mininstryName`)
  - `flutter-website/lib/backend/schema/events_record.dart` (Schema definition)
- **Cross-Surface Implications:**
  - **CMS Publishing:** `admin/src/pages/EventsWorkspacePage.jsx` specifically saves event ministry associations under the field `mininstryName: ''` (matching Flutter schema).
  - **Public Site:** React pages attempt to query `'ministryName'` (without the extra 'n') or filter on non-existent `e.department`. Consequently, real events published via CMS or FlutterFlow never match on the public conference and ministry pages.
- **Resolution Plan (GM-01 & GM-05):**
  Support both fields: query or check `e.mininstryName || e.ministryName` across all event components. When CMS publishes events, write both fields for forward/backward compatibility.

---

### BUG-04: Case Mismatch for Ministry FEWDS Framework (`m.FEWDS` vs `m.fewds`)
- **Severity:** Medium
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task DATA-02-T1, RUN-003, Verified by Build)
- **Affected Files:**
  - `website/src/pages/MinistriesPage.jsx`
  - `website/src/pages/WelfarePage.jsx`
  - `admin/src/pages/MinistriesWorkspacePage.jsx` (CMS editor)
  - `flutter-website/lib/backend/schema/ministries_record.dart` (Reference)
- **Cross-Surface Implications:**
  - **CMS:** `MinistriesWorkspacePage.jsx` writes the department to uppercase `FEWDS: 'Fellowship'`.
  - **Public Site:** `MinistriesPage.jsx` checks lowercase `m.fewds`, evaluating to `undefined` and breaking department category filtering for congregants.
- **Resolution Plan (GM-01):**
  Normalize access to `m.FEWDS || m.fewds || ''` across public ministry pages.

---

### BUG-05: `BeAPartnerPage.jsx` Schema Discrepancies and Unindexed Child Array
- **Severity:** High
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task INT-02-T1, RUN-007, Verified by Build)
- **Affected Files:**
  - `website/src/pages/BeAPartnerPage.jsx` (Public Form)
  - `admin/src/pages/PartnersWorkspacePage.jsx` (CMS Partner List)
  - `admin/src/pages/PartnerDetailPage.jsx` (CMS Partner Detail & Family Links)
  - `flutter-website/lib/pages/be_a_partner/be_a_partner_widget.dart` (Reference)
  - `flutter-website/firebase/firestore.rules` (`validPartner` rule)
- **Cross-Surface Implications:**
  - **Public Site:** `BeAPartnerPage.jsx` saves boolean flags (`holySpiritFilled`, `speakInTongues`) and embeds children in an array `kids: [...]`.
  - **Admin CMS:** `PartnersWorkspacePage.jsx` filters partners using string flags (`isMinor: partner.kid === 'Yes'`). It expects each child to be a distinct partner document with `parent: parentRef`. An embedded `kids: [...]` array is invisible to CMS staff and cannot be acknowledged or linked to user accounts.
  - **Firestore Security Rules:** `firestore.rules` enforces `validPartner(data)`. The rule specifies `data.keys().hasOnly(['name', 'surname', 'dob', 'DOB', ... 'kid', 'parent'])`. Submitting `kids: [...]` or `holySpiritFilled` causes write permission denial under production security rules!
- **Cross-Surface Acceptance Case:**
  1. Submit partner form on `/be-a-partner` with 1 adult and 1 added child.
  2. Adult record created in `partners` with exact fields: `name`, `surname`, `DOB`, `Occupation`, `workplace`, `address`, `cell`, `email`, string flags `'Yes'`/`'No'` for `bornAgain`, `baptised`, `filled`, `tongues`, `homeCell`.
  3. Child record created in `partners` with: `name`, `surname`, `DOB`, `kid: 'Yes'`, `parent: <adultDocRef>`, `postalCode`.
  4. In `admin/` at `/workspace/partners`:
     - Both adult and child appear under their designated branch.
     - Opening the adult in `/workspace/partners/{id}` lists the linked child under Family Links.
     - Child record displays with "Minor" badge and "Has parent link".

---

### BUG-06: `PodcastsPage.jsx` Lacks Firestore Integration (Static Mock Only)
- **Severity:** Medium
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task PUB-06-T1, RUN-018, Verified by Build)
- **Affected Files:**
  - `website/src/pages/PodcastsPage.jsx`
  - `admin/src/pages/SermonsWorkspacePage.jsx` (CMS Media Manager)
  - `flutter-website/lib/pages/podcasts/podcasts_widget.dart` (Reference)
- **Cross-Surface Implications:**
  - CMS staff publish podcasts to the `podcast` Firestore collection via `SermonsWorkspacePage.jsx`.
  - The public React website completely ignores Firestore on `/podcasts`, displaying only static links to third-party apps.
- **Resolution Plan (GM-04):**
  Subscribe `PodcastsPage.jsx` to `COLLECTIONS.PODCAST` ordered by `date` desc, rendering episode cards matching Flutter layout while keeping external links.

---

### BUG-07: Dummy South African Cities Used Instead of Official SSMI Branches
- **Severity:** Medium
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task PUB-04-T2, RUN-015, Verified by Build)
- **Affected Files:**
  - `website/src/pages/MinistryPage.jsx`
  - `website/src/pages/SocialsPage.jsx`
  - `admin/src/pages/BranchWorkspacePage.jsx` (CMS Branch Profiles)
- **Cross-Surface Implications:**
  - CMS manages SSMI's 9 actual branches (`Online`, `Mbabane`, `Siteki`, `Hlutsi`, `Ludzeludze`, `EMalahleni`, `Boksburg`, `Orange Farm`, `Lagos`).
  - Public `/socials` and `/ministry` display dummy South African cities (`Pretoria`, `Centurion`, `Midrand`, etc.), breaking branch routing for congregants.
- **Resolution Plan (GM-03):**
  Replace dummy cities with the official 9 branches matching CMS and `scripts/backfill-branch-landing-content.mjs`. (Resolved in RUN-015: Replaced dummy city lists in `MinistryPage.jsx` and `SocialsPage.jsx` with official 9 SSMI campuses, defaulted socials selection to 'Online', and integrated dynamic Firestore branch querying.)

---

### BUG-08: Query Parameter Incompatibility on `EventPage.jsx` (`?id=` vs `?event=`)
- **Severity:** Medium
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task PUB-09-T1, RUN-019, Verified by Build)
- **Affected Files:**
  - `website/src/pages/EventPage.jsx`
  - `flutter-website/lib/pages/event/event_widget.dart`
- **Cross-Surface Implications:**
  - Flutter links pass `?event=<eventRef>`. React expects `?id=<eventDocId>`.
  - External links, bookmarks, or social media links using `?event=` fail with "Event not found".
- **Resolution Plan (GM-04):**
  Update `EventPage.jsx` to check `searchParams.get('id') || searchParams.get('event')`.

---

### BUG-09: Fabricated Visual Verification Checksums in Existing Verification Baseline
- **Severity:** High
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Status:** Resolved (Task QA-01-T1, RUN-026, Fabricated Baseline Removed)
- **Affected Files:**
  - `website/docs/verification/phase5-locations/` (Deprecated & Removed)
  - `website/docs/verification/README.md` (Authentic Baseline Specification Created)
- **Cross-Surface Implications:**
  - Prior documentation claimed visual verification based on 16 screenshot files having identical SHA256 checksums (`FECD3218...`).
  - True visual parity will be captured against authentic live Flutter build artifacts across all 8 viewports.
- **Resolution Verification (GM-07):**
  Fabricated `phase5-locations/` directory containing the duplicate checksum screenshots has been permanently removed. Authentic capture standard established in `website/docs/verification/README.md`. Genuine multi-viewport comparison sheets to be captured under Task QA-01-T2.
