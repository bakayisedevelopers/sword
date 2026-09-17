# Authentic Visual Verification Baseline Manifest (QA-01-T2 / GM-07)

Generated: **2026-09-15T13:39:06.168Z**  
Task: **QA-01-T2 (Capture Authentic Screenshots)**  
Global Milestone: **GM-07: Authentic Multi-Viewport Visual Parity & Responsive Alignment**  
Unique Checksum Verification: **PASS (16/16 Genuine Unique Hashes)**

This baseline establishes the authentic side-by-side visual capture between the production Flutter reference build (`flutter-website/build/web`) and the React conversion preview (`website/`) across all 8 designated responsive viewports.

## Visual Comparison Matrix Across 8 Viewports

| Viewport ID | Width | Name | Flutter Reference Capture | React Conversion Capture |
| :--- | :--- | :--- | :--- | :--- |
| **VP-01** | `375px` | Mobile Narrow | [`375-flutter.png`](screenshots/375-flutter.png)<br>(`100 707 bytes`) | [`375-react.png`](screenshots/375-react.png)<br>(`176 330 bytes`) |
| **VP-02** | `478px` | Mobile Breakpoint End | [`478-flutter.png`](screenshots/478-flutter.png)<br>(`103 945 bytes`) | [`478-react.png`](screenshots/478-react.png)<br>(`213 978 bytes`) |
| **VP-03** | `479px` | Mobile Breakpoint Start | [`479-flutter.png`](screenshots/479-flutter.png)<br>(`103 481 bytes`) | [`479-react.png`](screenshots/479-react.png)<br>(`213 092 bytes`) |
| **VP-04** | `767px` | Tablet Portrait | [`767-flutter.png`](screenshots/767-flutter.png)<br>(`161 752 bytes`) | [`767-react.png`](screenshots/767-react.png)<br>(`428 158 bytes`) |
| **VP-05** | `990px` | Tablet Landscape End | [`990-flutter.png`](screenshots/990-flutter.png)<br>(`205 768 bytes`) | [`990-react.png`](screenshots/990-react.png)<br>(`313 608 bytes`) |
| **VP-06** | `991px` | Desktop Breakpoint Start | [`991-flutter.png`](screenshots/991-flutter.png)<br>(`204 110 bytes`) | [`991-react.png`](screenshots/991-react.png)<br>(`361 949 bytes`) |
| **VP-07** | `1280px` | Desktop Standard | [`1280-flutter.png`](screenshots/1280-flutter.png)<br>(`223 615 bytes`) | [`1280-react.png`](screenshots/1280-react.png)<br>(`385 596 bytes`) |
| **VP-08** | `1440px` | Desktop Large | [`1440-flutter.png`](screenshots/1440-flutter.png)<br>(`251 617 bytes`) | [`1440-react.png`](screenshots/1440-react.png)<br>(`411 723 bytes`) |

---

## Detailed Screenshot Inventory & SHA256 Hashes

| Filename | Surface | Viewport | Dimensions | File Size | SHA256 Checksum |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `375-flutter.png` | Flutter Reference | **VP-01** | `375x812` | `100 707 B` | `4f057cc6b4f62f0b74d8665c19419bf268c9da46bc1c5549280771f7b95c78d2` |
| `375-react.png` | React Conversion | **VP-01** | `375x812` | `176 330 B` | `c2a38268e89ccad33294ed2bc3ea4369fc6c4b57f498e83fa344ba38e1f24599` |
| `478-flutter.png` | Flutter Reference | **VP-02** | `478x844` | `103 945 B` | `b1a15ae4b096d30c356f2998ed242a99b03ecfd3fa47cfd2e2a3f36032e6e58d` |
| `478-react.png` | React Conversion | **VP-02** | `478x844` | `213 978 B` | `24facc9648704e506049b99122f0662abbeb78c942b87b7b0a6f2c2e9439a1f8` |
| `479-flutter.png` | Flutter Reference | **VP-03** | `479x844` | `103 481 B` | `efa9723efe2eca8bfa59f4466846ebf5866fbb3f24b267062289e84677c79e0b` |
| `479-react.png` | React Conversion | **VP-03** | `479x844` | `213 092 B` | `2faf0d1999bb800a9548d53f6821a0717208d279c0a877b4b04148bdd40d9b10` |
| `767-flutter.png` | Flutter Reference | **VP-04** | `767x1024` | `161 752 B` | `82b3cd62ace30fa9bb0f9ab2cd9a9aa5d5e2d779fe02fd0141d245398d51735c` |
| `767-react.png` | React Conversion | **VP-04** | `767x1024` | `428 158 B` | `cb339d6e8316f5167a3d947bdcb49c3c7e54ff748520306de56cb43a25e7ef7a` |
| `990-flutter.png` | Flutter Reference | **VP-05** | `990x900` | `205 768 B` | `f61a5b13e3a5e7113a5b407da5125e6ec1086a51f3dbef4635692d8581cdee61` |
| `990-react.png` | React Conversion | **VP-05** | `990x900` | `313 608 B` | `bd230e98d5ef73101273aa749ff6e59ed5abb8e32b459311315f59d1b9b73f56` |
| `991-flutter.png` | Flutter Reference | **VP-06** | `991x900` | `204 110 B` | `77dca042add7cef8ca5366dd4c4a56acf2d1a06031c2b9370f97acd234338339` |
| `991-react.png` | React Conversion | **VP-06** | `991x900` | `361 949 B` | `6d4c632fe59c6189523a2e4605adadea4a18224325bc4de0f7397e918997e079` |
| `1280-flutter.png` | Flutter Reference | **VP-07** | `1280x900` | `223 615 B` | `b37a7a6926647a30e0ba18cd33ee0fa397d69d664c05473d8eb1e2fdf1bfc5ff` |
| `1280-react.png` | React Conversion | **VP-07** | `1280x900` | `385 596 B` | `230085f1ff739f0328f5b39c036aa96464c4c731a0fd6a19aededffc539ffc05` |
| `1440-flutter.png` | Flutter Reference | **VP-08** | `1440x900` | `251 617 B` | `15cda52d7d9ebd4b5d4623b79282169fb16a7eb58278924c403fe6f5b5bcc8dd` |
| `1440-react.png` | React Conversion | **VP-08** | `1440x900` | `411 723 B` | `9a74dde2a82f57f124b2b7d28a88982311630fd96c73d0b1c4977336f4aeb882` |

---

## Observations for Task QA-01-T3 (Visual Token Alignment)

1. **Mobile Header & Drawer Navigation (375px, 478px, 479px, 767px):**
   - React displays the compact mobile navbar with hamburger icon and church crest.
   - Hero title and pastoral photo stack vertically to preserve readability without side overflow.
2. **Desktop Navigation & Layout (991px, 1280px, 1440px):**
   - Desktop pill header renders with pill buttons ("Locations", "Watch", "About Us", "Care", "Give") and "My Dashboard".
   - Hero section renders authentic side-by-side grid with pastoral couple image and dark organic brand curve.
3. **Visual Token Alignment Targets for QA-01-T3:**
   - Card border radius: Flutter uses 24px-30px curved corners on major hero and card blocks.
   - Brand color tokens: Deep Navy (`#192431`), Accent Gold (`#C97303`), Off-white Background (`#FBFBFB`).
   - Breakpoint transitions: 478px/479px (XS to SM) and 990px/991px (Tablet LG to Desktop LG) maintain seamless layout transitions without clipping.
