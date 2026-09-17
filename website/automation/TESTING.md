# Repository Testing & Quality Assurance Protocol: SSMI

This document specifies the verification, testing, and inspection procedures required to ensure functional parity, data integrity, and visual fidelity across all applications in the SSMI repository (`c:\Users\Jabu Babb\Documents\Code\Sword`).

---

## 1. Automated Build & Static Verification

Every milestone and code change must satisfy these baseline automated checks before requesting human review:

### A. React Public Website Build
```powershell
cd "c:\Users\Jabu Babb\Documents\Code\Sword\website"; npm run build
```
- **Pass Criteria:** Exits with code `0`. Vite outputs bundle into `website/dist/`. Zero JSX, Tailwind, or bundling errors.

### B. Admin CMS Build
```powershell
cd "c:\Users\Jabu Babb\Documents\Code\Sword\admin"; npm run build
```
- **Pass Criteria:** Exits with code `0`. Vite outputs bundle into `admin/dist/`. Confirms shared schemas and admin routes compile cleanly.

### C. Cloud Functions Syntax & Lint Check
```powershell
cd "c:\Users\Jabu Babb\Documents\Code\Sword\cloud-functions"; npm run lint
```
- **Pass Criteria:** Node `--check` passes on `src/index.js` and `scripts/bootstrap-admin.mjs`.

### D. Shared Blueprint Verification
```powershell
node --check "c:\Users\Jabu Babb\Documents\Code\Sword\functions\src\index.js"
```
- **Pass Criteria:** Common helpers and route taxonomy parse without syntax errors.

---

## 2. Safe Preview & Server Testing Protocol

The repository preview infrastructure is configured in `preview.json`. Running processes must be handled safely to avoid collisions:

### Active Process Safeguard (Port 3000)
A Commander PreviewRouter or proxy service may be listening on port `3000`.
- **DO NOT terminate, restart, or kill the process listening on port 3000.**
- Check active listening ports safely with PowerShell before attempting to bind new servers:
  ```powershell
  Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 3000, 5173, 5174, 8080 } | Format-Table -Property LocalAddress, LocalPort, OwningProcess
  ```

### Safe Manual Inspection Options:
1. **Option A: Via Running Preview Router (Port 3000)**
   - Public Website: `http://localhost:3000/`
   - Admin CMS: `http://localhost:3000/admin`
2. **Option B: Direct Ad-Hoc Dev Servers (Raw Mode)**
   - If port 5173 / 5174 are free, run raw dev servers without wrapping:
     ```powershell
     cd "c:\Users\Jabu Babb\Documents\Code\Sword\website"; npm run dev:raw   # Port 5173
     cd "c:\Users\Jabu Babb\Documents\Code\Sword\admin"; npm run dev:raw     # Port 5174
     ```
3. **Option C: Static Flutter Web Reference**
   - The Flutter build artifact already exists at `flutter-website/build/web`.
   - If needed, serve headlessly on port `8080`:
     ```powershell
     python -m http.server 8080 --directory "c:\Users\Jabu Babb\Documents\Code\Sword\flutter-website\build\web"
     ```

---

## 3. The 8 Required Responsive Viewport Widths

Visual and responsive testing must be verified at the **8 designated viewport widths**. These breakpoints represent key thresholds derived from FlutterFlow layout definitions and Tailwind CSS responsive boundaries:

| Viewport ID | Width | Category | Breakpoint Tested |
| :--- | :--- | :--- | :--- |
| **VP-01** | `375px` | Compact Mobile | Standard mobile (iPhone SE / compact smartphone), single-column stacks |
| **VP-02** | `478px` | Maximum Mobile XS | Upper bound before FlutterFlow XS layout shift |
| **VP-03** | `479px` | Minimum Mobile SM | Entry breakpoint for FlutterFlow SM layouts |
| **VP-04** | `767px` | Maximum Mobile MD | Upper bound before Tailwind `md` and tablet transitions |
| **VP-05** | `990px` | Maximum Tablet LG | Upper bound before desktop navbar, multi-column grid transition |
| **VP-06** | `991px` | Minimum Desktop LG | Entry breakpoint for desktop header, flyout menus, and sidebars |
| **VP-07** | `1280px` | Standard Desktop XL | Full desktop layout with standard max-width container bounds |
| **VP-08** | `1440px` | Wide Desktop 2XL | High-resolution wide desktop; checks letterboxing and max-width |

---

## 4. Visual Parity Verification Protocol & Baseline Redo

### Acceptance Target: ~98% Visual Fidelity (Human-Approved)
- **Strict Invariant:** The ~98% target is an acceptance goal subject to human review in `USER_TEST_REPORTS.md`. AI agents must never declare visual fidelity achieved based on code inspection alone.
- **Deprecating Duplicate Baselines (`BUG-09`):** Prior documentation in `website/docs/verification/phase5-locations/` contained identical SHA256 checksums (`FECD3218...`) across 16 screenshots. Authentic side-by-side screenshots must be captured between the live Flutter build and the React preview during Milestone GM-07.

### Side-by-Side Review Steps:
1. Capture screenshots at each of the 8 viewports for both Flutter and React.
2. Verify visual attributes:
   - **Colors:** Deep Navy (`#192431`), Accent Gold (`#C97303`), Background (`#FBFBFB`), Secondary Navy (`#263342`), Muted Slate (`#7B8A9E`).
   - **Border Radii:** Card corners (`20px` to `30px`), button pills (`9999px` or `12px`).
   - **Typography:** Outfit / Inter, heading weights, line heights, text colors.
   - **Spacing:** Vertical section padding (48px–96px), container gutters (16px–32px).
   - **Transitions:** Inspect edge behavior at 478px/479px and 990px/991px without layout clipping.
3. Submit comparative artifacts to user for formal acceptance sign-off.

---

## 5. End-to-End Cross-Surface Integration Tests

Cross-surface journeys connect the Public React Website to the Admin CMS via shared Firebase collections. Every journey requires two-sided acceptance verification:

### Test Journey 1: Event Registration (`INT-01` / `BUG-01`)
1. **Public Site Action:** Navigate to `/register`. Fill form with: Name: "Test", Surname: "User", Cell: "0712345678", Branch: "Boksburg", Event: "Fire Conference 2026", Message: "Testing registration". Submit form.
2. **Firestore Check:** Verify document is created in `registrations` collection (NOT `requests`). Verify fields pass `validRegistration` rule in `firestore.rules`.
3. **Admin CMS Action:** Open `/workspace/registrations`. Verify record appears in "New registrations". Open detail view (`/workspace/registrations/{id}`): verify event name links to event, mark reviewed, toggle payment status, and execute session check-in.

### Test Journey 2: Partner Intake & Linked Child (`INT-02` / `BUG-05`)
1. **Public Site Action:** Navigate to `/be-a-partner`. Complete multi-step intake for adult applicant. Add 1 child with name and DOB. Submit form.
2. **Firestore Check:**
   - Adult document created in `partners` with string flags (`bornAgain: 'Yes'`, `filled: 'Yes'`).
   - Child document created in `partners` with `kid: 'Yes'` and `parent: <adultDocRef>`.
   - Verify neither document contains illegal keys that fail `validPartner` rule.
3. **Admin CMS Action:** Open `/workspace/partners`. Select the applicant's branch. Under "New requests", verify adult record appears. Open detail view (`/workspace/partners/{id}`): verify linked child appears under Family Links with "Minor" badge.

### Test Journey 3: Ministry Volunteer Sign-Up (`INT-03`)
1. **Public Site Action:** Open `SignUpModal` from `/ministries` or demographic page. Submit volunteer interest.
2. **Firestore Check:** Document created in `signUps` collection with `name`, `cell`, `branch`, `type`.
3. **Admin CMS Action:** Open `/workspace/sign-ups`. Verify record appears under the specified branch. Open detail view and acknowledge sign-up.

### Test Journey 4: Prayer & Care Requests (`INT-04`)
1. **Public Site Action:** Open `RequestModal` from `/care` or site footer. Submit prayer request.
2. **Firestore Check:** Document created in `requests` collection with `type: 'prayer'`.
3. **Admin CMS Action:** Open `/workspace/requests`. Verify record appears under "New requests". Open detail view, add admin follow-up notes, and mark acknowledged.

### Test Journey 5: Homepage Content Publishing (`INT-05`)
1. **Admin CMS Action:** In `/workspace/website-content`, update the latest sermon URL and theme of the year title. Click "Save all".
2. **Firestore Check:** Document `websiteContent/homepage` updated with `latestSermonVideoUrl` and `yearThemeTitle`.
3. **Public Site Action:** Open `/` in a browser. Confirm video player and theme title update in real time via Firestore `onSnapshot`.

### Test Journey 6: Branch Landing Page Synchronization (`INT-06`)
1. **Admin CMS Action:** In `/workspace/branches`, update service times or pastor bio for a branch (e.g. `Boksburg`). Save.
2. **Firestore Check:** Document `branches/{branchId}` updated with `landingPage.serviceTimes`.
3. **Public Site Action:** Open `/branch/boksburg`. Confirm updated service times and bio render without caching lag.

---

## 6. Pre-Cutover Verification & Deployment Gates

Before any production cutover or hosting target modifications (GM-09):

1. **Build Gate:** `npm run build` succeeds cleanly for both `website/` and `admin/`; `npm run lint` passes in `cloud-functions/`.
2. **Functional Parity Gate:** All 20 public feature items in `FEATURES.md` and 48 routes in `PARITY_MATRIX.md` verified.
3. **CMS Operational Gate:** All 10 workspaces in `admin/` verified with active intake queues.
4. **Defect Gate:** Bugs `BUG-01` through `BUG-09` marked `Resolved` in `BUGS.md` with zero unresolved regressions.
5. **Visual Gate:** User explicitly signs off on visual fidelity reports in `USER_TEST_REPORTS.md`.
6. **Security Gate:** Firestore rules and Storage rules validated on staging; service account credentials confirmed private.
7. **Cutover Gate:** Explicit written approval from the human user in `USER_ACTIONS.md` before executing `firebase deploy --only hosting`.
