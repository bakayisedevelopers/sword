# Repository Feature Catalog & Surface Ownership: SSMI

This catalog provides an evidence-based feature inventory across all applications and infrastructure in the SSMI repository (`c:\Users\Jabu Babb\Documents\Code\Sword`).

Feature ownership is explicitly categorized by surface:
- **Public React Website (`[PUB-*]` / `[SITE-*]`)**
- **Admin CMS (`[CMS-*]`)**
- **Shared Data & Integration Contracts (`[INT-*]`)**
- **Legacy Flutter Reference (`[FLUTTER-*]`)**

For every feature family, three tiers of implementation state are distinguished:
1. **Confirmed Existing Behavior:** Verified directly in codebase files.
2. **Work Required for Intended Release:** Actionable scope required for launch readiness.
3. **Later or Unconfirmed Ideas:** Proposals or options requiring human decision (captured in `FEATURE_REQUESTS.md` and linked to `USER_ACTIONS.md`).

---

## 1. Public React Website (`website/`) — `[PUB-*]`

### PUB-01 (SITE-01): Global Navigation & Site Shell
- **Confirmed Existing Behavior:** Header renders desktop navbar (>= 991px) and mobile hamburger pill (< 991px) triggering slide-in drawer (`SiteHeader.jsx`, `MobileDrawer.jsx`). Footer renders 4 pillars and "Follow Up" modal CTA (`SiteFooter.jsx`).
- **Work Required for Release:**
  - Align mobile drawer menu items to full FlutterFlow menu items.
  - Fix responsive transitions at 478px/479px and 990px/991px.
  - Verify header height and container padding across all 8 viewports.
- **Later Ideas / User Decision:**
  - Public "My Dashboard" button destination pending user decision (`DEC-01`, `FR-001`; non-blocking for core navigation).
- **Tracing:** GM-01, GM-07; `TESTING.md` VP-01 to VP-08.

### PUB-02 (SITE-02): Homepage & Annual Theme Experience
- **Confirmed Existing Behavior:** Real-time Firestore subscription to `websiteContent/homepage` (`HomePage.jsx`). Displays dynamic year theme image and latest sermon URL (YouTube/MP4). Quick Action buttons link to church milestones.
- **Work Required for Release:**
  - Verify video player autoplay/mute controls without layout clipping.
  - Verify responsive hero banner heights and text scaling across 8 viewports.
- **Later Ideas:** Dynamic background video loop for desktop hero.
- **Tracing:** GM-04, GM-07; `HomePage.jsx`, `WebsiteContentPage.jsx`.

### PUB-03 (SITE-03): Locations & Campus Directory
- **Confirmed Existing Behavior:** Subscribes to `branches` collection sorted alphabetically. Displays 9 branch cards with pastor names, physical address, country, and visit buttons (`LocationsPage.jsx`, `BranchCard.jsx`).
- **Work Required for Release:**
  - Re-run authentic visual comparison against live Flutter build to replace invalid duplicate screenshot hashes (`BUG-09`).
  - Verify map link resolution and card hover states.
- **Tracing:** GM-03, GM-07; `BUG-09`.

### PUB-04 (SITE-04): Dynamic Branch Engine & Legacy Routes
- **Confirmed Existing Behavior:** Dynamic route `/:branchSlug` and 9 legacy paths `/legacy/*` mapped to `BranchTemplatePage.jsx`. Renders service times, leadership bio, banking, and branch social links.
- **Work Required for Release:**
  - Standardize slug and name resolution across all 9 branches (`Online`, `Mbabane`, `Siteki`, `Hlutsi`, `Ludzeludze`, `EMalahleni`, `Boksburg`, `Orange Farm`, `Lagos`).
  - Replace dummy city fallbacks in `MinistryPage.jsx` and `SocialsPage.jsx` (`BUG-07`).
  - Decide whether legacy routes remain rendered templates or 301 redirects (`DEC-05`).
- **Tracing:** GM-03; `BUG-07`, `DEC-05`.

### PUB-05 (SITE-05): Watch & Media Center
- **Confirmed Existing Behavior:** Sermons feed with video embed and playlist (`WatchPage.jsx`).
- **Work Required for Release:**
  - Fix `useFirestoreQuery` constraint handling so `orderBy('date', 'desc')` executes at the Firestore query level (`BUG-02`).
  - Add fallback title check (`sermon.Title || sermon.title`).
- **Tracing:** GM-01; `BUG-02`.

### PUB-06 (SITE-06): Podcasts Stream
- **Confirmed Existing Behavior:** Static platform badges (Apple, Spotify, YouTube) in `PodcastsPage.jsx`.
- **Work Required for Release:**
  - Connect to `COLLECTIONS.PODCAST` (`podcast` collection) ordered by `date` desc to display audio/video episodes matching `podcasts_widget.dart` (`BUG-06`).
- **Tracing:** GM-04; `BUG-06`.

### PUB-07 (SITE-07): Event Registration Pipeline
- **Confirmed Existing Behavior:** Registration form with name, cell, branch, and event fields (`RegisterPage.jsx`).
- **Work Required for Release:**
  - **Fix Destination Collection (`BUG-01`):** Write to `COLLECTIONS.REGISTRATIONS` (`registrations`), NOT `requests`.
  - Pass schema: `name`, `surname`, `cell`, `branch`, `eventName`, `message`, `date`.
  - Verify compatibility with `firestore.rules` (`validRegistration`).
- **Tracing:** GM-02; `BUG-01`, `INT-01`, `CMS-03`.

### PUB-08 (SITE-08): Ministries Directory & Filtering
- **Confirmed Existing Behavior:** Displays ministry cards (`MinistriesPage.jsx`, `WelfarePage.jsx`).
- **Work Required for Release:**
  - Fix department case mismatch: access `m.FEWDS || m.fewds` so filter chips work (`BUG-04`).
- **Tracing:** GM-01; `BUG-04`.

### PUB-09 (SITE-09): Single Event Detail View
- **Confirmed Existing Behavior:** Event detail presentation with date, time, location, and booking CTAs (`EventPage.jsx`).
- **Work Required for Release:**
  - Accept both `?id=` and legacy `?event=` query parameters (`BUG-08`).
- **Tracing:** GM-04; `BUG-08`.

### PUB-10 (SITE-10): Stewardship & Partner Intake
- **Confirmed Existing Behavior:** Multi-step partner pledge form (`BeAPartnerPage.jsx`).
- **Work Required for Release:**
  - Fix partner document schema (`DOB`, `Occupation`, string flags `'Yes'`/`'No'`) (`BUG-05`).
  - Create separate individual child partner records with `kid: 'Yes'` and `parent: parentRef` instead of embedded array (`BUG-05`).
- **Tracing:** GM-02; `BUG-05`, `INT-02`, `CMS-02`.

### PUB-11 through PUB-20: Other Public Pages & Conference Landings
- **PUB-11 (SITE-11):** Single Ministry Detail & Volunteer intake.
- **PUB-12 (SITE-12):** Giving & Branch Accounts (`GivePage.jsx`, `BranchGivePage.jsx`).
- **PUB-13 (SITE-13):** Events Directory (`EventsPage.jsx`).
- **PUB-14 (SITE-14):** Inquiries, Care & Follow-Up Modals (`RequestModal.jsx`, `FollowUpModal.jsx`).
- **PUB-15 (SITE-15):** Life Stages & Demographic Family (`SuperKidsPage`, `YouthPage`, etc. — 8 routes). Fix `mininstryName` event query (`BUG-03`).
- **PUB-16 (SITE-16):** Annual Conferences (`CampYoloPage`, `FireConferencePage`, `SupermanConferencePage`). Fix conference event filtering (`BUG-03`).
- **PUB-17 (SITE-17):** Spiritual Foundations (`FollowJesusPage`, `BaptismPage`, `CarePage`, `ConnectPage`).
- **PUB-18 (SITE-18):** Social Channels & Community Directory (`SocialsPage.jsx`).
- **PUB-19 (SITE-19):** Corporate Identity (`AboutUsPage`, `VisitPage`, `BeyondTithePage`, `WelfarePage`).
- **PUB-20 (SITE-20):** Generic Ministry Sign-Up Modal (`SignUpModal.jsx` -> `signUps`).

---

## 2. Admin CMS (`admin/`) — `[CMS-*]`

### CMS-01: Admin Authentication, Profile Sync & Role-Based Access (RBAC)
- **Confirmed Existing Behavior:** Google Sign-in and email/password auth (`SignInPage.jsx`, `AuthProvider.jsx`). Profile synced to `users` collection. Custom claims and role priority (`super_admin`, `global_editor`, `branch_editor`, `ministry_editor`, `care_team`, `reports_viewer`). Developer allowlist.
- **Work Required for Release:**
  - Verify access boundary redirects (`/access-denied`).
  - Test session recovery and token refresh.
- **Later Ideas:** Multi-factor authentication (MFA) for super admins.
- **Tracing:** GM-06; `admin/src/auth/roles.js`.

### CMS-02: Operational Dashboard & Metrics Engine
- **Confirmed Existing Behavior:** Real-time counters for branches, partners, upcoming events, new requests, and new registrations (`DashboardPage.jsx`). Branch-scoped filtering for branch editors.
- **Work Required for Release:**
  - Verify metric calculations handle null dates and unacknowledged records accurately.
- **Later Ideas:** Activity timeline / recent changes feed.
- **Tracing:** GM-06; `DashboardPage.jsx`.

### CMS-03: Event Registrations Queue & Attendance Engine
- **Confirmed Existing Behavior:** Lists registrations with "New" vs "All" tabs, event filtering, search (`RegistrationsWorkspacePage.jsx`). Detail view has reviewed toggle, payment status toggle ('paid' vs 'pending'), and multi-session check-in/check-out (`RegistrationDetailPage.jsx`).
- **Work Required for Release:**
  - Connect with public `/register` submissions once `RegisterPage.jsx` routes to `registrations` (`BUG-01`).
  - Verify attendance check-in, check-out, and payment status toggles save to Firestore.
- **Later Ideas / User Decision:**
  - CSV/Excel export (`DEC-06`) is pending user scope decision; **NOT required for launch unless user explicitly approves it**.
  - QR code check-in scanner via mobile camera.
- **Tracing:** GM-02, GM-06; `BUG-01`, `DEC-06`, `INT-01`.

### CMS-04: Partner Directory & Family Association
- **Confirmed Existing Behavior:** Lists partners by branch with "Partners" vs "New requests" tabs (`PartnersWorkspacePage.jsx`). Detail view supports editing profile, status toggles, user account linking (`linkedUserId`), and family relations (`familyLinks`) (`PartnerDetailPage.jsx`).
- **Work Required for Release:**
  - Verify rendering and editing of child partner records created by public `/be-a-partner` form (`kid: 'Yes'`, `parent: ref`) (`BUG-05`).
  - Verify branch filter pills and acknowledged vs new request tabs.
- **Later Ideas / User Decision:**
  - CSV/Excel export (`DEC-06`) is pending user scope decision; **NOT required for launch unless user explicitly approves it**.
  - Bulk email / SMS notification integration.
- **Tracing:** GM-02, GM-06; `BUG-05`, `DEC-06`, `INT-02`.

### CMS-05: Requests & Care Follow-Up Queue
- **Confirmed Existing Behavior:** Inbound queue for prayer, counselling, contact, and follow-up requests (`RequestsWorkspacePage.jsx`). Branch-scoped review, acknowledge action, and detail view (`RequestDetailPage.jsx`).
- **Work Required for Release:**
  - Verify real-time receipt of public submissions from `RequestModal.jsx` and `FollowUpModal.jsx`.
- **Later Ideas:** Automated email notifications to branch care team upon new request creation.
- **Tracing:** GM-02; `INT-04`.

### CMS-06: Ministry Sign-Ups Queue
- **Confirmed Existing Behavior:** Inbound queue for volunteer and small intake forms (`MinistrySignUpsWorkspacePage.jsx`, `MinistrySignUpDetailPage.jsx`).
- **Work Required for Release:**
  - Verify intake from `SignUpModal.jsx` across all public ministry pages.
- **Tracing:** GM-02; `INT-03`.

### CMS-07: Events Publishing & Recurrence Engine
- **Confirmed Existing Behavior:** Create/edit church events with session lists, recurrence schedules, booking toggles, branch tags, and `mininstryName` assignment (`EventsWorkspacePage.jsx`, `EventDetailPage.jsx`).
- **Work Required for Release:**
  - Ensure all created events write both `mininstryName` (legacy schema) and `ministryName` for complete forward/backward compatibility (`BUG-03`).
- **Tracing:** GM-04; `BUG-03`.

### CMS-08: Sermons & Multi-Platform Media Manager
- **Confirmed Existing Behavior:** Media workspace supporting YouTube (`sermons`), Podcasts (`podcast`), and Facebook videos (`sermons`) (`SermonsWorkspacePage.jsx`, `SermonDetailPage.jsx`).
- **Work Required for Release:**
  - Test manual media creation and verify updates display on public `/watch` and `/podcasts` pages.
- **Later Ideas:** Scheduled Cloud Function pulling YouTube Data API automatically (`DEC-02`).
- **Tracing:** GM-04; `DEC-02`.

### CMS-09: Homepage Website Content Publisher
- **Confirmed Existing Behavior:** Manages `websiteContent/homepage` in Firestore: latest sermon URL, published date, theme of the year title, subtitle, desktop/mobile theme images (`WebsiteContentPage.jsx`).
- **Work Required for Release:**
  - Verify live sync to public `HomePage.jsx`.
- **Tracing:** GM-04; `INT-05`.

### CMS-10: Branch Profiles & Landing Page Content Editor
- **Confirmed Existing Behavior:** Manages branch contact info, location PIN (GeoPoint), banking details, service times array, pastor bio, and hero image/video uploads to Firebase Storage (`BranchWorkspacePage.jsx`).
- **Work Required for Release:**
  - Verify image/video uploads comply with `storage.rules`.
  - Verify branch service times sync cleanly to public `BranchTemplatePage.jsx`.
- **Tracing:** GM-03; `INT-06`.

### CMS-11: User Access Management & Staff Onboarding
- **Confirmed Existing Behavior:** Lists staff profiles in `users`, manages pending `userAccessRequests`, assigns roles and branch/ministry scopes (`UsersAccessPage.jsx`, `UsersDetailPage.jsx`, `UserAccessRequestDetailPage.jsx`).
- **Work Required for Release:**
  - Determine whether approval calls `setAdminAccess` Cloud Function or writes directly to `users` doc (`DEC-03`).
- **Later Ideas:** Automated invitation email sent to newly approved staff members.
- **Tracing:** GM-06; `DEC-03`.

---

## 3. Shared Integration & Backend Contracts — `[INT-*]`

- **INT-01:** Event Registration Ingestion (`/register` -> `registrations` collection -> `RegistrationsWorkspacePage.jsx`).
- **INT-02:** Partner Application Ingestion (`/be-a-partner` -> `partners` collection -> `PartnersWorkspacePage.jsx`).
- **INT-03:** Ministry Volunteer Ingestion (`SignUpModal` -> `signUps` collection -> `MinistrySignUpsWorkspacePage.jsx`).
- **INT-04:** Care & Prayer Request Ingestion (`RequestModal` / `/care` -> `requests` collection -> `RequestsWorkspacePage.jsx`).
- **INT-05:** Homepage Content Synchronization (`WebsiteContentPage.jsx` -> `websiteContent/homepage` -> `HomePage.jsx`).
- **INT-06:** Branch Profile Synchronization (`BranchWorkspacePage.jsx` -> `branches` collection -> `BranchTemplatePage.jsx`).

---

## 4. Legacy Flutter Reference — `[FLUTTER-*]`

- **FLUTTER-01:** FlutterFlow Page Layout Reference (`flutter-website/lib/`). Strict read-only reference for typography, colors, padding, and UI hierarchy.
- **FLUTTER-02:** Backend Schema Definitions (`flutter-website/lib/backend/schema/`). Authoritative definitions for Firestore records (`events_record.dart`, `ministries_record.dart`, `registrations_record.dart`, etc.).
- **FLUTTER-03:** Security & Deployment Rules (`flutter-website/firebase/firestore.rules`, `storage.rules`). Active security rules shared across all apps.
- **FLUTTER-04:** Production Web Build Baseline (`flutter-website/build/web`). Static build used for visual comparisons and current production hosting target (`flutter-dev`).
