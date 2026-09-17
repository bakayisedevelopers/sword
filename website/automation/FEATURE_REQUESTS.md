# Feature Requests Inbox & Lifecycle Register: SSMI

This document is the dedicated **feature-request inbox** for Sword of the Spirit Ministries (SSMI). It captures and tracks feature requests, capability enhancements, and scope adjustments extracted from messages or notes actually provided by the user / repository owner.

---

## 1. Operating Rules & Governance

1. **Source Extraction Protocol:**
   - Feature-editing chats extract individual requests strictly from messages, prompts, or notes **actually provided by the user** in the current conversation.
   - Agents must never claim access to other chats or infer private user communications outside the provided context.
2. **Strict Scope Gating (No Silent Scope Expansion):**
   - **An inbox entry alone does NOT silently expand launch scope.**
   - Agent-suggested ideas must never become approved features automatically. Suggestions belong under status `needs clarification` or in "Later Ideas" in `FEATURES.md` unless the user explicitly approves them.
   - Only requests with status `approved for implementation` or `planned` are eligible to be scheduled for execution.
3. **Bugs vs. Features Separation:**
   - Functional, visual, or schema discrepancies between React and Flutter, broken routes, or failed queries are **bugs** and belong in `BUGS.md`.
   - When a bug fix requires a significant architectural redesign or new capability, log the bug in `BUGS.md` and cross-reference the corresponding `FR-*` request here.
4. **Duplicate Prevention:**
   - Before adding an entry, inspect existing `FR-*` entries below and existing `FEATURES.md` items (`[PUB-*]`, `[CMS-*]`, `[INT-*]`). If a request matches an existing item, refine the existing entry rather than creating a duplicate.
5. **Decisions & Human Actions:**
   - If a feature request requires a user decision or scope choice, record the decision in `USER_ACTIONS.md` and link it to the `FR-*` entry.
6. **Zero Secrets Invariant:**
   - **Never** place passwords, API keys, service account credentials, personal donor/member phone numbers, or confidential data in this register.

---

## 2. Request Lifecycle Status Definitions

Every request must have exactly one of the following statuses:

| Status | Meaning |
| :--- | :--- |
| `new request` | Captured from user prompt or note; pending review and categorization. |
| `needs clarification` | Requirements or design underspecified; awaiting user clarification. |
| `approved for planning` | User authorized architectural design and specification, but not implementation. |
| `approved for implementation` | User explicitly approved feature behavior, scope, and implementation. |
| `planned` | Mapped to `FEATURES.md` and scheduled as an actionable task in `MASTER_PLAN.md`. |
| `implemented` | Code implemented, non-production checks passed, documented in `RUN_REPORTS.md`. |
| `rejected/deferred` | Declined, parked for post-launch, or rejected by user. |

---

## 3. Feature Request Register

### FR-001: Public Navigation "My Dashboard" Button Destination
- **Request ID:** `FR-001`
- **Original Request / Source:** User prompt during initial audit and master-plan review regarding public navbar button behavior.
- **Plain-English Behavior:** Determine what happens when a visitor or church member clicks the "My Dashboard" / "Dashboard" button in the public desktop header, mobile drawer, and footer. Options include redirecting staff to Admin CMS (`/admin`), linking to an external member portal, or removing the button from public view.
- **Affected Surface:** Public React Website (`website/`)
- **Proposed Launch Timing:** Unscheduled / User Decision
- **Status:** `needs clarification`
- **Dependencies:** `DEC-01` in `USER_ACTIONS.md`
- **Acceptance Criteria:** Public button either links to confirmed destination or is hidden; core navigation remains unblocked.
- **Linked Records:** Feature `PUB-01` (`FEATURES.md`), Task `PUB-01-T2` (`MASTER_PLAN.md`), Decision `DEC-01` (`USER_ACTIONS.md`).

---

### FR-002: YouTube Sermons Automated Sync via Cloud Function
- **Request ID:** `FR-002`
- **Original Request / Source:** User discussion during architecture discovery regarding sermon publishing workflow.
- **Plain-English Behavior:** Automatically fetch and ingest latest YouTube playlist sermons into the Firestore `sermons` collection via a scheduled Cloud Function with YouTube Data API v3, versus maintaining manual sermon entry in the Admin CMS.
- **Affected Surface:** Admin CMS (`admin/`), Cloud Functions (`cloud-functions/`)
- **Proposed Launch Timing:** Post-Launch / User Decision
- **Status:** `needs clarification`
- **Dependencies:** `DEC-02` in `USER_ACTIONS.md`, YouTube Data API credentials (user-provided)
- **Acceptance Criteria:** If approved, Cloud Function runs on schedule and syncs new YouTube videos without manual CMS entry; manual entry remains operational.
- **Linked Records:** Feature `CMS-08` (`FEATURES.md`), Task `CMS-08-T2` (`MASTER_PLAN.md`), Decision `DEC-02` (`USER_ACTIONS.md`).

---

### FR-003: Admin User Access Approval & Firebase Auth Custom Claims Assignment
- **Request ID:** `FR-003`
- **Original Request / Source:** User directive regarding staff authorization: staff profile viewing may proceed, but writes granting roles, claims, or branch access must await authorization path verification.
- **Plain-English Behavior:** When a super admin approves a staff access request in the Admin CMS (`/workspace/users`), assign roles either by invoking the `setAdminAccess` callable Cloud Function (setting Auth custom claims) or by writing directly to the `users` Firestore document (evaluated by `firestore.rules`).
- **Affected Surface:** Admin CMS (`admin/`), Cloud Functions (`cloud-functions/`), Shared Security Rules (`firestore.rules`)
- **Proposed Launch Timing:** Launch Required (pending path confirmation)
- **Status:** `needs clarification`
- **Dependencies:** `DEC-03` in `USER_ACTIONS.md`
- **Acceptance Criteria:** Staff role assignment works reliably without privilege escalation; read-only profile viewing proceeds independently.
- **Linked Records:** Feature `CMS-11` (`FEATURES.md`), Tasks `CMS-11-T1b`, `CMS-11-T2` (`MASTER_PLAN.md`), Decision `DEC-03` (`USER_ACTIONS.md`).

---

### FR-004: Public Form Ingestion Architecture (Direct Firestore vs Callable Cloud Function)
- **Request ID:** `FR-004`
- **Original Request / Source:** User directive regarding form intake: preserve existing live behavior; form UI and schema inspection may proceed, but no new or changed direct-to-Firestore submission behavior may be treated as approved while direct writes vs callable function remains undecided.
- **Plain-English Behavior:** Determine whether public form submissions (`/register`, `/be-a-partner`, `SignUpModal`, `RequestModal`, `FollowUpModal`) write directly to Firestore collections guarded by `firestore.rules`, or submit through the callable Cloud Function `submitPublicRequest` for centralized audit logging.
- **Affected Surface:** Public React Website (`website/`), Shared Integration Contracts (`functions/`, `cloud-functions/`, `firestore.rules`)
- **Proposed Launch Timing:** Launch Required (pending path confirmation)
- **Status:** `needs clarification`
- **Dependencies:** `DEC-04` in `USER_ACTIONS.md`
- **Acceptance Criteria:** Ingestion preserves data integrity across public forms and CMS rosters; live submission behavior is preserved until path confirmed.
- **Linked Records:** Feature `INT-04` (`FEATURES.md`), Tasks `INT-04-T1b`, `INT-04-T2` (`MASTER_PLAN.md`), Decision `DEC-04` (`USER_ACTIONS.md`).

---

### FR-005: Legacy Branch URLs Handling (Rendered Templates vs 301 Redirects)
- **Request ID:** `FR-005`
- **Original Request / Source:** Audit discovery regarding 9 legacy branch routes (`/legacy/*`) in `App.jsx`.
- **Plain-English Behavior:** Decide whether legacy branch URLs (`/legacy/mbabane`, `/legacy/siteki`, etc.) render standalone templates or issue HTTP 301 permanent redirects to the primary dynamic branch engine (`/branch/:slug`).
- **Affected Surface:** Public React Website (`website/`), Hosting Config (`firebase.json`)
- **Proposed Launch Timing:** Launch Required / User Decision
- **Status:** `needs clarification`
- **Dependencies:** `DEC-05` in `USER_ACTIONS.md`
- **Acceptance Criteria:** Legacy URLs either render expected branch content or redirect cleanly with zero 404s.
- **Linked Records:** Feature `PUB-04` (`FEATURES.md`), Task `PUB-04-T3` (`MASTER_PLAN.md`), Decision `DEC-05` (`USER_ACTIONS.md`).

---

### FR-006: CSV / Excel Data Export for Registrations & Partner Rosters
- **Request ID:** `FR-006`
- **Original Request / Source:** User directive: "CSV export ('DEC-06') must be marked pending my scope decision, not required for launch unless I approve it."
- **Plain-English Behavior:** Provide one-click CSV export buttons in `RegistrationsWorkspacePage.jsx` and `PartnersWorkspacePage.jsx` allowing church staff to download filtered attendee and partner lists for offline reporting.
- **Affected Surface:** Admin CMS (`admin/`)
- **Proposed Launch Timing:** Post-Launch / Pending User Scope Decision
- **Status:** `rejected/deferred`
- **Dependencies:** `DEC-06` in `USER_ACTIONS.md` (deferred unless approved by user)
- **Acceptance Criteria:** If approved by user, clicking "Export CSV" generates valid `.csv` matching current table filters; core workspace rosters operate independently without it.
- **Linked Records:** Feature `CMS-05` (`FEATURES.md`), Task `CMS-05-T1` (`MASTER_PLAN.md`), Decision `DEC-06` (`USER_ACTIONS.md`).

---

## 4. Submission Template for New Requests

When capturing a new user request in a feature-editing chat, append a new entry using this format:

```markdown
### FR-XXX: [Concise Feature Title]
- **Request ID:** `FR-XXX`
- **Original Request / Source:** [Verbatim quote or clear citation from user prompt/note]
- **Plain-English Behavior:** [What the feature does from user or admin perspective]
- **Affected Surface:** [Public React Website (`website/`) | Admin CMS (`admin/`) | Shared Integration | Preserved Flutter Reference]
- **Proposed Launch Timing:** [Launch Required | Post-Launch | Unscheduled / Later Idea]
- **Status:** [new request | needs clarification | approved for planning | approved for implementation | planned | implemented | rejected/deferred]
- **Dependencies:** [Prerequisite decisions (DEC-*), schemas, or tasks]
- **Acceptance Criteria:** [Concrete condition(s) of satisfaction]
- **Linked Records:** Feature `[ID]` (`FEATURES.md`), Task `[ID]` (`MASTER_PLAN.md`), Decision `[ID]` (`USER_ACTIONS.md` if user input needed)
```
