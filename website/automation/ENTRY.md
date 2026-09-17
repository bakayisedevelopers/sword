# Repository Automation Entry Protocol: Sword of the Spirit Ministries (SSMI)

This document is the **single operational entry point** for all autonomous, assisted, and pair-programming sessions in the SSMI repository (`c:\Users\Jabu Babb\Documents\Code\Sword`).

It governs all applications, tools, and surfaces in this codebase:
- **Public React Website** (`website/`)
- **Admin CMS** (`admin/`)
- **Flutter Web Reference** (`flutter-website/`) — *Strict read-only reference*
- **Cloud Functions & Security** (`cloud-functions/`)
- **Shared Functions & Blueprint** (`functions/`)
- **Firebase Infrastructure** (`firestore.rules`, `storage.rules`, `firebase.json`)

---

## 1. Operating Rules for Every Session

Future agents and workflows must strictly follow these rules:

### A. Check Project State First (`STATE.json`)
- Read `website/automation/STATE.json`.
- If `projectStatus` is `"paused"`, `"blocked"`, `"completed"`, or `"awaiting_user_review"`, **make no code changes**. Report current state, open decisions, and wait for human instruction.

### B. Dependency-Driven Task Selection (`MASTER_PLAN.md`)
- Review `website/automation/MASTER_PLAN.md`.
- Choose the next **eligible, unblocked, bounded task** across workstreams based on explicit prerequisites rather than blindly executing every conversion task before CMS work.
- Task status categories are strictly distinguished:
  1. `implemented` — Code written and checked locally.
  2. `automated_tests_passed` — Verified by clean build and lint checks.
  3. `awaiting_user_review` — Changes staged and documented in `RUN_REPORTS.md` / `USER_TEST_REPORTS.md`.
  4. `user_verified` — Explicitly signed off by the human user.

### C. Non-Blocking Independence
- If a task is blocked on a human decision (`USER_ACTIONS.md`) or an external dependency, **let the blocked task wait**.
- Unresolved decisions (`DEC-01` through `DEC-06`) block only their specifically mapped dependent tasks (e.g., `DEC-06` blocks only CSV export, not registration intake). All independent eligible work across surfaces proceeds immediately once the overall plan is approved.
- Proceed with independent, unblocked tasks in other workstreams (e.g., CMS publishing improvements can proceed while public visual fidelity is awaiting screenshot review).

### D. Read Source on Disk Before Editing
- Always read the live target and reference files using file read tools before proposing edits.
- Never rely on memory or prior conversation transcripts.
- Treat `flutter-website/` as an immutable source of truth for legacy behavior, data schemas, and copy. **Never edit files in `flutter-website/`.**

### E. Never Claim Visual Fidelity or Approval on the User's Behalf
- The target of ~98% visual fidelity is a human acceptance criterion, not an automated score.
- Agents must never claim "98% visual match" based on code inspection.
- Authentic side-by-side screenshots at the 8 required viewports (`375px`, `478px`, `479px`, `767px`, `990px`, `991px`, `1280px`, `1440px`) must be captured and submitted for user sign-off in `USER_TEST_REPORTS.md`.

### F. Zero Secret Storage & Worktree Hygiene
- **Never** store API keys, service account JSON files, passwords, or personal client data in automation files, markdown, or Git.
- Preserve any pre-existing uncommitted modifications in the worktree. Do not stage or commit git changes without explicit instructions.

---

## 2. Dedicated Feature-Editing Chat Protocol

When a user initiates a conversation specifically to edit, add, or refine features:

1. **Check for Concurrent Implementation Runs First:**
   - Read `website/automation/STATE.json`.
   - Ensure `activeWorker` is `null`. If an implementation run is currently active, **do not write shared planning files**; stop and report the conflict immediately.
2. **Record in Feature Requests Inbox (`FEATURE_REQUESTS.md`):**
   - Extract the request strictly from messages or notes actually provided by the user in this session. Do not claim access to other chats.
   - Assign a stable identifier (e.g. `FR-007`).
   - Fill in all required fields: original request/source, plain-English behavior, affected surface (`website/`, `admin/`, shared integration, or preserved Flutter reference), proposed launch timing, initial status (`new request` or `needs clarification`), dependencies, and acceptance criteria.
   - Check for duplicates against existing `FR-*` entries and existing `FEATURES.md` records.
   - Separate bugs from new features: defects belong in `BUGS.md` (cross-referenced in `FEATURE_REQUESTS.md` if an architectural change is needed).
3. **Scope Gating & Human Authorization:**
   - **An inbox entry alone must NOT silently expand launch scope.**
   - Agent-suggested ideas must not become approved features automatically. Unapproved proposals remain under `needs clarification` in `FEATURE_REQUESTS.md` or "Later Ideas" in `FEATURES.md`.
   - Only when the user explicitly authorizes planning or implementation does status advance to `approved for planning` or `approved for implementation`.
4. **Link Chaining Across Three Records:**
   - Once sufficiently specified and authorized, update:
     1. `FEATURE_REQUESTS.md` (record the assigned feature ID and master-plan task ID).
     2. `FEATURES.md` (place under Confirmed Existing, Work Required for Release, or Later Ideas with the `[PUB-*]`, `[CMS-*]`, or `[INT-*]` ID).
     3. `MASTER_PLAN.md` (add or update the actionable milestone task, e.g. `Task CMS-12-T1`, with prerequisites and verification steps).
   - Link all three records together explicitly.
5. **Route Human Decisions to `USER_ACTIONS.md`:**
   - Put any decision or choice the user needs to make in `USER_ACTIONS.md` (e.g. `DEC-*` table) with a direct markdown link back to the `FR-*` entry in `FEATURE_REQUESTS.md`.
6. **Scheduled Implementation Agent Protocol:**
   - The scheduled implementation agent reads approved requests (`FEATURE_REQUESTS.md` status `approved for implementation` or `planned`) and current plans (`MASTER_PLAN.md`) before selecting work.
   - Unapproved inbox entries are ignored during task selection.
7. **Zero Secrets Invariant:**
   - Never place API keys, passwords, credentials, or private donor/member data in `FEATURE_REQUESTS.md` or `USER_ACTIONS.md`.


---

## 3. Safe Testing & Preview Environment Protocol

A multi-app preview architecture is defined in `preview.json`. Running processes must be handled safely:

### Running Preview Router (Port 3000)
- A Commander PreviewRouter or proxy process may be actively listening on port `3000`.
- **Do NOT terminate, restart, or kill the process listening on port 3000.**

### Running Safe Verification Builds
You can run automated checks without starting background servers:
- **Public Website Build Check:**
  ```powershell
  cd "c:\Users\Jabu Babb\Documents\Code\Sword\website"; npm run build
  ```
- **Admin CMS Build Check:**
  ```powershell
  cd "c:\Users\Jabu Babb\Documents\Code\Sword\admin"; npm run build
  ```
- **Cloud Functions Lint Check:**
  ```powershell
  cd "c:\Users\Jabu Babb\Documents\Code\Sword\cloud-functions"; npm run lint
  ```

### Safe Interactive Preview Execution
When manual browser inspection is requested:
- Inspect `preview.json` to identify target ports (`5173` for `website`, `5174` for `admin`, `8080` for `flutter-website`).
- If port 3000 is running, use its configured routes (e.g. `http://localhost:3000/` for public site, `http://localhost:3000/admin` for CMS).
- Never bind multiple dev servers to the same port. Always check listening ports with PowerShell before starting ad-hoc servers.

---

## 4. Workstream Index

| Workstream | Directory | Core Technology | Primary Focus |
| :--- | :--- | :--- | :--- |
| **Public Website** | `website/` | React 19, Vite, Tailwind, React Router v7 | Public congregant, visitor, and donor web experience |
| **Flutter Conversion** | `website/` vs `flutter-website/` | FlutterFlow Dart -> React 19 | 9-milestone fidelity and data parity roadmap |
| **Admin CMS** | `admin/` | React 18, Vite, Tailwind, Firebase SDK | Staff dashboard, intake queues, publishing, RBAC |
| **Shared Data / Integration** | `functions/`, Firebase | Firestore Rules, Storage Rules, Schemas | Ingestion pipelines, collection schemas, cross-app contracts |
| **Cloud Functions** | `cloud-functions/` | Firebase Functions v2 (Node 20), Auth | Admin claim assignment, request intake auditing |

---

## 5. Standard Handoff Checklist
At the conclusion of any run:
1. Automated build checks run and passing (`npm run build`).
2. `STATE.json` updated with accurate milestone and task statuses.
3. `RUN_REPORTS.md` appended with execution details, evidence, and next actions.
4. If user input or decisions are needed, documented in `USER_ACTIONS.md`.
5. No extraneous files, staged changes, or uncommitted secrets left behind.
