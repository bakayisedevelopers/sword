# Authentic Visual Verification Baseline (GM-07)

This directory houses genuine visual comparison baselines between the Flutter reference application (`flutter-website/`) and the React conversion (`website/`).

---

## 1. Deprecation Record (BUG-09 Resolution)
- **Discovered In:** Milestone 0 Audit (2026-09-13)
- **Defect Reference:** BUG-09 (Fabricated visual verification checksums in legacy baseline)
- **Remediation (Task QA-01-T1 / RUN-026):**
  The legacy `phase5-locations/` directory containing 17 identical placeholder files with duplicate SHA256 checksums (`fecd3218...`) has been formally deprecated and permanently removed.

---

## 2. Authentic Capture Criteria (Task QA-01-T2)
Authentic visual verification in Milestone GM-07 requires genuine rendering captures across all **8 designated viewports**:

| Viewport ID | Viewport Category | Viewport Width | Typical Device Profile | Target File Prefix |
| :--- | :--- | :--- | :--- | :--- |
| **VP-01** | Mobile Narrow | 375px | iPhone SE / Compact Mobile | `375-` |
| **VP-02** | Mobile Breakpoint End | 478px | Maximum Mobile Compact | `478-` |
| **VP-03** | Mobile Breakpoint Start | 479px | Minimum Mobile Wide / Phablet | `479-` |
| **VP-04** | Tablet Portrait | 767px | iPad Portrait Boundary | `767-` |
| **VP-05** | Tablet Landscape End | 990px | Maximum Tablet Landscape | `990-` |
| **VP-06** | Desktop Breakpoint Start | 991px | Minimum Desktop Standard | `991-` |
| **VP-07** | Desktop Standard | 1280px | HD Desktop / Standard Laptop | `1280-` |
| **VP-08** | Desktop Large | 1440px | Full HD / Large Desktop Monitor | `1440-` |

---

## 3. Verification Standards
1. **Unique Checksums:** Every captured image must produce a genuine, distinct SHA256 hash reflecting actual rendered pixels.
2. **Human Review Gate:** Human visual sign-off (~98% fidelity) must be logged in `USER_TEST_REPORTS.md` and `USER_ACTIONS.md` prior to staging and production cutover (GM-08 / GM-09).
