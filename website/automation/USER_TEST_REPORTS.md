# User Acceptance Testing & Visual Sign-Off Reports

This document provides a structured framework for the client and reviewer to record manual testing results, evaluate visual fidelity against the Flutter website, and grant formal sign-off for milestones and production cutover.

> [!IMPORTANT]
> The target of ~98% visual fidelity is an acceptance standard that can only be approved by human review. AI agents are prohibited from unilaterally claiming visual fidelity sign-off based solely on code inspection.

---

## How to Conduct & Record User Testing

1. **Start Local Previews:**
   - Run the React development server: `npm run dev:raw` inside `website/` (serves at `http://localhost:5173/`).
   - Run or view the Flutter web build (serves at `http://localhost:8080/` or via preview router at `http://localhost:3000/`).
   - Open Admin CMS: `npm run dev:raw` inside `admin/` (serves at `http://localhost:5174/`).
2. **Inspect at Designated Breakpoints:**
   - Test each page at the 8 required viewport widths: `375px`, `478px`, `479px`, `767px`, `990px`, `991px`, `1280px`, `1440px`.
3. **Verify Data Intake:**
   - Submit forms on `/register`, `/be-a-partner`, and modal dialogues. Verify that submissions appear in the corresponding workspace inside Admin CMS (`/admin`).
4. **Record Findings:**
   - Fill in the test session template below, check off passing routes, describe any visual discrepancies, and update the Approval Status.

---

## Active Review Session: Milestone GM-07 (Multi-Viewport Visual Parity)

### Session Metadata
- **Date Submitted for Review:** `2026-09-15`
- **Reviewer:** `[Pending Human User / Project Lead Review]`
- **Milestone Under Review:** `GM-07: Authentic Multi-Viewport Visual Parity & Responsive Alignment`
- **Baseline Manifest:** [`website/docs/verification/AUTHENTIC_BASELINE.md`](../docs/verification/AUTHENTIC_BASELINE.md)
- **Genuine Checksum Status:** `16 / 16 Unique SHA256 Hashes Verified (100% genuine rendering)`

---

### Viewport & Responsive Evaluation (8 Designated Viewports)

| Viewport ID | Width | Name | Flutter Reference Build | React Conversion Preview | Layout Parity (~98% Target) | Breakpoint Transition Smooth? | Notes / Anomalies Observed |
| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |
| **VP-01** | `375px` | Mobile Narrow | [`375-flutter.png`](../docs/verification/screenshots/375-flutter.png)<br>`SHA256: 4f057cc6...` | [`375-react.png`](../docs/verification/screenshots/375-react.png)<br>`SHA256: c2a38268...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Single column hero, compact header, auto-scroll mobile menu |
| **VP-02** | `478px` | Mobile Breakpoint End | [`478-flutter.png`](../docs/verification/screenshots/478-flutter.png)<br>`SHA256: b1a15ae4...` | [`478-react.png`](../docs/verification/screenshots/478-react.png)<br>`SHA256: 24facc96...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Max mobile boundary, no horizontal scroll clipping |
| **VP-03** | `479px` | Mobile Breakpoint Start | [`479-flutter.png`](../docs/verification/screenshots/479-flutter.png)<br>`SHA256: efa9723e...` | [`479-react.png`](../docs/verification/screenshots/479-react.png)<br>`SHA256: 2faf0d19...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Small tablet / phablet layout threshold |
| **VP-04** | `767px` | Tablet Portrait | [`767-flutter.png`](../docs/verification/screenshots/767-flutter.png)<br>`SHA256: 82b3cd62...` | [`767-react.png`](../docs/verification/screenshots/767-react.png)<br>`SHA256: cb339d6e...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Tablet portrait grid transition |
| **VP-05** | `990px` | Tablet Landscape End | [`990-flutter.png`](../docs/verification/screenshots/990-flutter.png)<br>`SHA256: f61a5b13...` | [`990-react.png`](../docs/verification/screenshots/990-react.png)<br>`SHA256: bd230e98...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Max tablet landscape, responsive spacing intact |
| **VP-06** | `991px` | Desktop Breakpoint Start | [`991-flutter.png`](../docs/verification/screenshots/991-flutter.png)<br>`SHA256: 77dca042...` | [`991-react.png`](../docs/verification/screenshots/991-react.png)<br>`SHA256: 6d4c632f...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Full desktop navbar pill with logo and links |
| **VP-07** | `1280px` | Desktop Standard | [`1280-flutter.png`](../docs/verification/screenshots/1280-flutter.png)<br>`SHA256: b37a7a69...` | [`1280-react.png`](../docs/verification/screenshots/1280-react.png)<br>`SHA256: 230085f1...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Standard HD desktop grid & 30px card radii |
| **VP-08** | `1440px` | Desktop Large | [`1440-flutter.png`](../docs/verification/screenshots/1440-flutter.png)<br>`SHA256: 15cda52d...` | [`1440-react.png`](../docs/verification/screenshots/1440-react.png)<br>`SHA256: 9a74dde2...` | [ ] Pass [ ] Fail | [ ] Pass [ ] Fail | Max container bounds with centered layout |

---

### Visual Token Alignment Summary (Applied in RUN-028)
1. **Brand Colors:** Deep Navy (`#192431`), Accent Gold (`#C97303`), Off-White Canvas (`#FBFBFB`), White (`#FFFFFF`).
2. **Card Radii Scale:** Cards & Modals (`30px`), Containers (`24px`), Inner Modals (`20px`), Pill Buttons (`50px`), Small Badges (`16px`).
3. **Chevron Vectors:** Replaced all shafted arrows with SVG `ChevronRight` and `ChevronLeft` icons matching Flutter design language.
4. **Mobile Navigation:** Top-right hamburger triggers smooth scroll to footer navigation with automatic top-scroll on route change.

---

### Page Family Sign-Off Checklist

#### 1. Core & Navigation Pages
- [ ] Home (`/`) — Hero banner, quick links, announcements, video preview
- [ ] About Us (`/about`) — Leadership, history, statement of faith
- [ ] Plan a Visit (`/visit`) — Campus finder, service schedules, greeting modal
- [ ] Connect (`/connect`) — Connect card, next steps
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 2. Media & Sermons
- [ ] Watch (`/watch`) — Video player, sermon playlist, latest message feed
- [ ] Podcasts (`/podcasts`) — Audio episodes stream, player controls, platform links
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 3. Giving & Partnership
- [ ] Give (`/give`) — Banking details, tithe/offering breakdown, copy-to-clipboard
- [ ] Branch Give (`/branch-give`) — Localized branch accounts
- [ ] Be a Partner (`/be-a-partner`) — Multi-step intake form, child record entry
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 4. Branches & Campuses
- [ ] Branches Index (`/branches`) — Campus cards grid, map links
- [ ] Dynamic Branch Template (`/branch/:slug`) — Branch hero, pastor photo, service times
- [ ] Legacy Routes (`/legacy/*` - 9 branches) — Exact parity with Flutter branch pages
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 5. Ministries & Life Stages
- [ ] Ministries Directory (`/ministries`) — FEWDS category filter chips
- [ ] Ministry Detail (`/ministry`) — Dynamic branch selector, volunteer CTA
- [ ] Life Stages (`/super-kids`, `/youth`, `/young-adults`, etc.) — 8 demographic pages
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 6. Annual Conferences
- [ ] Camp YOLO (`/camp-yolo`) — Youth camp registration, dates, theme
- [ ] Fire Conference (`/fire-conference`) — Conference schedule, speakers, registration
- [ ] Superman Conference (`/superman-conference`) — Men's conference details, registration
- **Visual Fidelity Rating:** `[ ___ / 100% ]`
- **Comments:**

#### 7. Intake Forms & Cross-Surface Data Integration
- [ ] Event Registration (`/register`) -> Received in `admin/` Registrations Workspace (`INT-01`)
- [ ] Partner Application (`/be-a-partner`) -> Received in `admin/` Partners Workspace (`INT-02`)
- [ ] Ministry Sign-Up Modal -> Received in `admin/` Ministry Sign-Ups Workspace (`INT-03`)
- [ ] Prayer / Testimony Modal -> Received in `admin/` Requests Workspace (`INT-04`)
- **Data Integrity Pass:** [ ] YES [ ] NO
- **Comments:**

#### 8. Admin CMS Operations & Staff Features
- [ ] Operational Dashboard (`/`) — Live metric counters, branch scoping
- [ ] Registrations Workspace (`/workspace/registrations`) — Payment toggle, multi-session check-in
- [ ] Partners Workspace (`/workspace/partners`) — Minor child linking, user account linking
- [ ] Website Content Workspace (`/workspace/website-content`) — Homepage sermon & theme sync
- [ ] Branches Workspace (`/workspace/branches`) — Service times, pastor bio, media uploads
- [ ] Events Workspace (`/workspace/events`) — Recurrence schedules, session editor
- [ ] Users & Access Requests (`/workspace/users`) — Staff approval, role assignments
- **CMS Operational Pass:** [ ] YES [ ] NO
- **Comments:**

---

### Formal Approval Decision
- [ ] **APPROVED WITHOUT RESERVATIONS:** The tested milestone meets functional requirements and matches visual design to client satisfaction (~98% fidelity).
- [ ] **APPROVED WITH MINOR ADJUSTMENTS:** Approved to proceed to next milestone; log non-blocking tweaks in `BUGS.md`.
- [ ] **REJECTED / REVISION REQUIRED:** Do not proceed. Address blocking items listed in comments below.

**Reviewer Signature / Date:** `___________________________________`

---

## Historical Test Reports Log

*(New completed test reports will be archived below as milestones are reviewed).*
