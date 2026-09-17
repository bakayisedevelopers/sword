# SSMI Scheduled Implementation Run

Work in the existing Sword checkout at `c:\Users\Jabu Babb\Documents\Code\Sword`.

## 1. Entry Checks (Always First)

1. Read `website/automation/STATE.json`.
   - If `projectStatus` is `"paused"`, `"blocked"`, `"completed"`, or `"awaiting_user_review"`, exit **read-only**: report current state, open decisions, and stop.
   - If `activeWorker` is not null, another Sword implementation run is active — exit **without overlapping it**.
   - If `reviewState` contains `awaiting_user_review`, exit read-only and report what needs the user's attention.

2. Read `website/automation/USER_ACTIONS.md`.
   - Identify all open decisions (DEC-01 through DEC-06).
   - Each decision blocks **only its named dependent tasks** as specified in the `openDecisions` registry in `STATE.json`. No decision halts unrelated global milestones.
   - In particular:
     - **DEC-03** blocks only `CMS-11-T1b` and `CMS-11-T2`. Do not change effective staff permissions, role grants, branch access, custom claims, or security rules.
     - **DEC-04** blocks only `INT-04-T1b` and `INT-04-T2`. Do not change public form submission writes. Preserve existing live Flutter and React submission behavior unmodified.

3. Read `website/automation/ENTRY.md` — follow all operating rules for this session.

## 2. Set Active Worker Lock

Before starting implementation:
- Write `"activeWorker": "scheduled-run-<ISO-timestamp>"` to `STATE.json`.
- Always clear `activeWorker` back to `null` at the end of the run (success or error).

## 3. Task Selection

Read `website/automation/MASTER_PLAN.md` and identify the next **single, eligible, independently testable task**:

- Eligible means: its milestone prerequisites are satisfied, no open DEC-* blocks it, and it has not already been marked `implemented` or `automated_tests_passed`.
- Prefer the lowest-numbered unstarted task in the lowest-numbered eligible global milestone.
- Do NOT select an entire milestone at once — select **one bounded task**.
- If a task is labeled `(Status: PROPOSED)` in the plan, verify whether its described feature is actually present in the inspected source files before implementing it. If the feature is genuinely proposed and not confirmed by code, record it in `USER_ACTIONS.md` as a decision item instead of implementing it.

## 4. Load Relevant Context Only

Load **only** the specific files relevant to the selected task:
- Its master-plan section
- Its referenced feature spec from `FEATURES.md` (the relevant `[PUB-*]`, `[CMS-*]`, `[DATA-*]`, or `[INT-*]` entry)
- The existing live source files it touches (read before editing — always)
- The Flutter reference file, if visual or schema parity is required (read-only, never edit)
- Its existing test coverage, if any

Do NOT load or process the entire repository on every run.

## 5. Implementation Constraints

- **Never** edit `flutter-website/` — it is a read-only reference.
- **Never** disturb the PreviewRouter process on port 3000.
- **Never** use production Firebase data for experiments, tests, or scaffolding.
- **Never** deploy, publish Firestore rules, or publish Cloud Functions.
- **Never** include secrets, service account keys, or credentials in any report or committed file.
- **Never** claim visual fidelity or user acceptance without the user's explicit review via `USER_TEST_REPORTS.md`.
- Preserve all pre-existing uncommitted modifications in the worktree. Do not stage or commit unrelated files.

## 6. Non-Production Checks

After implementation, run only the relevant subset of these checks:
- **Website build**: `cd "c:\Users\Jabu Babb\Documents\Code\Sword\website"; npm run build`
- **Admin CMS build**: `cd "c:\Users\Jabu Babb\Documents\Code\Sword\admin"; npm run build`
- **Cloud Functions lint**: `cd "c:\Users\Jabu Babb\Documents\Code\Sword\cloud-functions"; npm run lint`

Report exit code, stdout, and any errors in `RUN_REPORTS.md`.

## 7. Handoff

Update `website/automation/RUN_REPORTS.md` with:
- Run ID and timestamp
- Task selected and its milestone
- Files read and files changed (with line-level summaries)
- Check results (build/lint exit codes, error output if any)
- Any blockers encountered
- Next eligible task for the following run

Update `website/automation/STATE.json`:
- Set task status to `implemented` (if code changes made) or `automated_tests_passed` (if verified by passing build)
- Advance milestone status only when ALL its required tasks and gates are satisfied
- Clear `activeWorker` to `null`
- Update `updatedAt` timestamp

If the approved workflow calls for a git checkpoint, commit **only the verified files changed by this run** with a descriptive message — never commit unrelated staged or unstaged files.

## 8. Nothing Eligible

If no eligible, unblocked task remains:
- Write a brief summary to `RUN_REPORTS.md` explaining what is waiting (decisions, user review, prerequisites)
- Do not repeat a full repository audit
- Clear `activeWorker` to `null` and exit
