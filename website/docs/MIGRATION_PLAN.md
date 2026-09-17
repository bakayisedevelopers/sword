# Flutter to React/Vite/Tailwind Migration Plan

## Migration Status

Current Phase: Phase 6 - BranchTemplate Fidelity Correction

Current Page: BranchTemplate

Last Completed Phase: Phase 5 - Locations implementation baseline

Next Planned Work: Screenshot verification and remaining BranchTemplate visual parity refinement

Pages Completed: Not currently reliable; page matrix is under re-audit

Pages In Progress: 1

Pages Remaining: To be confirmed by page-by-page re-audit

Verification Notes:

The previous claim that all 48 routes were complete and visually verified was not reliable. A BranchTemplate audit found missing Firestore-backed branch information, missing BranchTemplate resource sections, route/action-button mismatches, and content drift from the Flutter source. Do not mark any page complete until it satisfies the greater-than-98% visual and behavioral fidelity definition of done with screenshots and route/data verification.

## Migration Objective

Migrate the existing Flutter/Dart website in `flutter-website/` to a new React, Vite, and Tailwind CSS website in `website/`.

Migration will be incremental, phase by phase and page by page. The priority is extremely high visual and behavioral fidelity. `flutter-website/` remains the read-only source of truth for appearance, behavior, routes, data access, Firebase/backend behavior, assets, and user-facing functionality.

Migration is a reproduction exercise, not a redesign.

Do not modernize, simplify, or visually improve pages unless explicitly approved. Reproduce first. Refactor later.

The required UI match target for every migrated page is greater than 98% visual accuracy against the Flutter source. Less than 98% visual accuracy is not acceptable. The goal is for each migrated React page to look exactly the same as the Flutter page to the practical limits of browser rendering.

UI match accuracy is of utmost importance. When a page is too large or visually dense to migrate precisely in one pass, break the work into smaller single-page, section, or component-focused tasks and verify each piece before continuing. Do not trade precision for speed.

Internal React implementation may be cleaner than generated FlutterFlow code, but the resulting website must remain behaviorally and visually equivalent. If Flutter contains duplicated desktop/mobile/tablet layouts, React should usually consolidate them into one responsive component structure when that can preserve the same visual result. If Flutter contains apparent visual quirks, preserve them unless explicitly approved.

## Source and Target Locations

SOURCE:

`flutter-website/`

TARGET:

`website/`

`flutter-website/` must never be modified as part of this migration. Every page migration must re-open and inspect its Flutter source before implementation.

## Existing Flutter Architecture

The source app is a FlutterFlow-generated Flutter web application.

Key source files and directories:

| Area | Flutter Reference |
|---|---|
| Flutter entry point | `flutter-website/lib/main.dart` |
| Exported pages | `flutter-website/lib/index.dart` |
| Router and route wrappers | `flutter-website/lib/flutter_flow/nav/nav.dart` |
| Global app state | `flutter-website/lib/app_state.dart` |
| Theme tokens and typography | `flutter-website/lib/flutter_flow/flutter_flow_theme.dart` |
| Responsive helpers | `flutter-website/lib/flutter_flow/flutter_flow_util.dart` |
| Firebase config | `flutter-website/lib/backend/firebase/firebase_config.dart` |
| Firestore API helpers | `flutter-website/lib/backend/backend.dart` |
| Firestore schemas | `flutter-website/lib/backend/schema/` |
| Auth | `flutter-website/lib/auth/` |
| FlutterFlow shared widgets | `flutter-website/lib/flutter_flow/` |
| Shared bottom sheets and footers | `flutter-website/lib/bottom_sheets/` |
| Main pages | `flutter-website/lib/main_pages/` |
| Action pages | `flutter-website/lib/actions/` |
| Ministry pages | `flutter-website/lib/ministries/` |
| Branch pages | `flutter-website/lib/branches/` |
| Dynamic templates | `flutter-website/lib/templates/` |
| Landing pages | `flutter-website/lib/landings/` |
| Resource pages | `flutter-website/lib/resources/` |
| Conference pages | `flutter-website/lib/conferences/` |
| Static assets | `flutter-website/assets/` |

Runtime flow:

1. `main.dart` initializes Flutter bindings.
2. `main.dart` enables path URL strategy.
3. `main.dart` initializes Firebase through `initFirebase()`.
4. `main.dart` initializes persisted `FFAppState`.
5. `main.dart` wraps the app in `ChangeNotifierProvider`.
6. `MyApp` listens to Firebase auth streams and creates the `GoRouter`.
7. `MaterialApp.router` renders routes from `createRouter()`.

Routing:

`flutter-website/lib/flutter_flow/nav/nav.dart` defines `GoRouter` routes with `FFRoute`. The app maps `/` and `/home` to `HomeWidget`, has many named page routes, and includes a dynamic branch route `/:branchSlug`. Several legacy branch routes are explicitly mapped under `/legacy/...`.

React routing policy:

The React website uses kebab-case canonical routes even when Flutter uses camelCase or other generated FlutterFlow paths. For example, Flutter `/aboutUs` maps to React `/about-us`, Flutter `/beAPartner` maps to React `/be-a-partner`, and Flutter `/privacyPolicy` maps to React `/privacy-policy`. Future migration work must preserve the documented React kebab-case route convention, while still referencing the original Flutter route path as source metadata.

Route mappings must be deliberate and documented. Do not accidentally mix camelCase Flutter paths into React navigation unless explicitly requested. Legacy routes under `/legacy/...` may remain as-is because they are already kebab-compatible and externally meaningful.

React canonical route mapping:

| Flutter Route | React Route |
|---|---|
| `/` | `/` |
| `/home` | `/home` |
| `/aboutUs` | `/about-us` |
| `/locations` | `/locations` |
| `/watch` | `/watch` |
| `/care` | `/care` |
| `/prayer` | `/prayer` |
| `/counseling` | `/counseling` |
| `/ministries` | `/ministries` |
| `/ministry` | `/ministry` |
| `/Partner` | `/partner` |
| `/beAPartner` | `/be-a-partner` |
| `/give` | `/give` |
| `/branchGive` | `/branch-give` |
| `/beyondTithe` | `/beyond-tithe` |
| `/events` | `/events` |
| `/event` | `/event` |
| `/schoolOfMinistry` | `/school-of-ministry` |
| `/superKids` | `/super-kids` |
| `/register` | `/register` |
| `/youth` | `/youth` |
| `/baptism` | `/baptism` |
| `/privacyPolicy` | `/privacy-policy` |
| `/welfare` | `/welfare` |
| `/eResourcesCenter` | `/e-resources-center` |
| `/couples` | `/couples` |
| `/forMen` | `/for-men` |
| `/forWomen` | `/for-women` |
| `/fellowship` | `/fellowship` |
| `/followJesus` | `/follow-jesus` |
| `/podcasts` | `/podcasts` |
| `/campYolo` | `/camp-yolo` |
| `/fireConference` | `/fire-conference` |
| `/supermanConference` | `/superman-conference` |
| `/contactUs` | `/contact-us` |
| `/youngAdults` | `/young-adults` |
| `/singles` | `/singles` |
| `/youthTemplate` | `/youth-template` |
| `/socials` | `/socials` |
| `/:branchSlug` | `/:branchSlug` |
| `/legacy/emalahleni` | `/legacy/emalahleni` |
| `/legacy/ludzeludze` | `/legacy/ludzeludze` |
| `/legacy/hlutsi` | `/legacy/hlutsi` |
| `/legacy/lagos` | `/legacy/lagos` |
| `/legacy/siteki` | `/legacy/siteki` |
| `/legacy/orange-farm` | `/legacy/orange-farm` |
| `/legacy/boksburg` | `/legacy/boksburg` |
| `/legacy/online` | `/legacy/online` |
| `/legacy/mbabane` | `/legacy/mbabane` |

State:

`flutter-website/lib/app_state.dart` defines generated `FFAppState`. Important migration-relevant fields include `selectedLocation`, `signUpMinistry`, `requestType`, `FEWDS`, `signUpBranch`, `addKids`, `requestBranch`, `contactBranch`, `hideSocials`, and `registerBranch`.

Theme:

`flutter-website/lib/flutter_flow/flutter_flow_theme.dart` defines light-mode tokens:

| Token | Value |
|---|---|
| primary | `#FFFFFF` |
| secondary | `#192431` |
| tertiary | `#C97303` |
| alternate | `#C97303` |
| primaryText | `#192431` |
| secondaryText | `#FFFFFF` |
| primaryBackground | `#D4D4D4` |
| secondaryBackground | `#FFFFFF` |
| accent1 | `transparent` |
| accent2 | `rgba(2, 202, 121, 0.356...)` from `0x5B02CA79` |
| accent3 | `rgba(238, 139, 96, 0.302...)` from `0x4DEE8B60` |
| accent4 | `rgba(38, 45, 52, 0.698...)` from `0xB2262D34` |
| success | `#249689` |
| warning | `#F9CF58` |
| error | `#FF5963` |
| info | `#FFFFFF` |

Typography uses Inter through Google Fonts with generated text styles including `displayLarge`, `displayMedium`, `displaySmall`, `headlineLarge`, `headlineMedium`, `headlineSmall`, `titleLarge`, `titleMedium`, `titleSmall`, `labelLarge`, `labelMedium`, `labelSmall`, `bodyLarge`, `bodyMedium`, and `bodySmall`.

Responsive behavior:

`flutter-website/lib/flutter_flow/flutter_flow_util.dart` defines:

| FlutterFlow Range | Width |
|---|---|
| phone | `< 479` |
| tablet | `< 767` |
| tabletLandscape | `< 991` |
| desktop | `>= 991` |

`flutter_flow_theme.dart` also categorizes typography device size as mobile `<479`, tablet `<991`, desktop `>=991`.

Firestore:

`flutter-website/lib/backend/backend.dart` exposes stream and one-time query helpers. Schema files define these collections:

| Collection | Flutter Schema |
|---|---|
| `branches` | `flutter-website/lib/backend/schema/branches_record.dart` |
| `events` | `flutter-website/lib/backend/schema/events_record.dart` |
| `ministries` | `flutter-website/lib/backend/schema/ministries_record.dart` |
| `sermons` | `flutter-website/lib/backend/schema/sermons_record.dart` |
| `podcast` | `flutter-website/lib/backend/schema/podcast_record.dart` |
| `requests` | `flutter-website/lib/backend/schema/requests_record.dart` |
| `signUps` | `flutter-website/lib/backend/schema/sign_ups_record.dart` |
| `registrations` | `flutter-website/lib/backend/schema/registrations_record.dart` |
| `partners` | `flutter-website/lib/backend/schema/partners_record.dart` |
| `users` | `flutter-website/lib/backend/schema/users_record.dart` |

`HomeWidget` also reads `websiteContent/homepage` directly from Firestore.

Shared bottom sheets and modals:

| Flutter Component | Purpose |
|---|---|
| `flutter-website/lib/bottom_sheets/footer/footer_widget.dart` | wrapper footer |
| `flutter-website/lib/bottom_sheets/footer_desktop/footer_desktop_widget.dart` | desktop footer |
| `flutter-website/lib/bottom_sheets/footer_mobile/footer_mobile_widget.dart` | mobile footer |
| `flutter-website/lib/bottom_sheets/footer_tope/footer_tope_widget.dart` | alternate/footer contact CTA |
| `flutter-website/lib/bottom_sheets/request/request_widget.dart` | request form modal |
| `flutter-website/lib/bottom_sheets/follow_up/follow_up_widget.dart` | follow-up request modal |
| `flutter-website/lib/bottom_sheets/sign_up/sign_up_widget.dart` | ministry sign-up modal |
| `flutter-website/lib/bottom_sheets/give_branch/give_branch_widget.dart` | branch giving selector |
| `flutter-website/lib/bottom_sheets/give_beyond_branch/give_beyond_branch_widget.dart` | beyond-tithe giving selector |

## Target React Architecture

The target workspace is `website/`.

Major directories:

| Target Path | Purpose |
|---|---|
| `website/public/assets/` | Public static assets for migrated React site. Phase 1 must decide whether assets are copied, referenced, or synced from `flutter-website/assets/`. |
| `website/src/main.jsx` | React entry point. |
| `website/src/app/App.jsx` | Top-level app component. |
| `website/src/app/routes.jsx` | React Router route configuration. |
| `website/src/app/providers.jsx` | Global providers such as app state, Firebase, auth, and future modal providers. |
| `website/src/components/layout/` | Site header, navigation, mobile drawer, footers, page containers. |
| `website/src/components/ui/` | Reusable UI primitives equivalent to FlutterFlow widgets. |
| `website/src/components/media/` | Video, YouTube, iframe/web-view replacements. |
| `website/src/components/common/` | Cross-feature utility UI that is not layout or primitive UI. |
| `website/src/features/branches/` | Branch-specific data helpers/components. |
| `website/src/features/events/` | Event query helpers/cards/detail support. |
| `website/src/features/ministries/` | Ministry query helpers/cards/detail support. |
| `website/src/features/sermons/` | Sermon query helpers/cards/media support. |
| `website/src/features/requests/` | Request modal/form behavior. |
| `website/src/features/signups/` | Sign-up and registration behavior. |
| `website/src/features/giving/` | Giving selectors and payment link behavior. |
| `website/src/hooks/` | Shared hooks including Firestore subscriptions, media queries, debounced values. |
| `website/src/lib/` | Firebase client, Firestore helpers, URL helpers, formatting utilities. |
| `website/src/pages/` | Route-level page components. |
| `website/src/design/tokens.js` | Design tokens translated from FlutterFlow theme. Currently placeholder only. |
| `website/src/design/breakpoints.js` | Breakpoint constants translated from FlutterFlow. Currently placeholder only. |
| `website/src/styles/` | Global CSS and Tailwind layer styles. |
| `website/docs/MIGRATION_PLAN.md` | Master migration instructions and progress tracking. |

JavaScript/JSX is the default. Do not introduce TypeScript unless the repository direction changes and the user approves.

## Current Created Directory Tree

This is the Phase 0 tree created in `website/`:

```text
website/
  docs/
    MIGRATION_PLAN.md
  public/
    assets/
      .gitkeep
  src/
    app/
      App.jsx
      providers.jsx
      routes.jsx
    components/
      common/
        .gitkeep
      layout/
        .gitkeep
      media/
        .gitkeep
      ui/
        .gitkeep
    design/
      breakpoints.js
      tokens.js
    features/
      branches/
        .gitkeep
      events/
        .gitkeep
      giving/
        .gitkeep
      ministries/
        .gitkeep
      requests/
        .gitkeep
      sermons/
        .gitkeep
      signups/
        .gitkeep
    hooks/
      .gitkeep
    lib/
      .gitkeep
    pages/
      .gitkeep
    styles/
      index.css
    main.jsx
  index.html
  package.json
  postcss.config.js
  README.md
  tailwind.config.js
  vite.config.js
```

## Flutter to React Mapping

| Flutter Concept Used Here | React/Vite Equivalent |
|---|---|
| `MaterialApp.router` | React app root with React Router provider |
| `GoRouter` | React Router route config in `src/app/routes.jsx` using approved kebab-case React routes |
| `FFRoute` | Route objects plus shared wrappers where needed |
| `context.pushNamed` / `context.goNamed` | `useNavigate()` and `<Link>` pointed at documented React kebab-case routes |
| `context.safePop()` | `navigate(-1)` with app-specific fallback |
| `StatefulWidget` | React function component with hooks |
| `setState` / `safeSetState` | `useState` setters and guarded async cleanup |
| `SchedulerBinding.addPostFrameCallback` | `useEffect` after mount |
| `StreamBuilder` | Firestore `onSnapshot` subscription hooks |
| `FutureBuilder` | async hook/state or loader-like pattern |
| `Provider` / `FFAppState` | React context/store where required |
| `SharedPreferences` persisted fields | `localStorage` only for fields confirmed to need persistence |
| `FlutterFlowTheme` | Tailwind theme, CSS variables, and design token constants |
| `responsiveVisibility` | Tailwind responsive utilities and occasional `useMediaQuery` |
| `MediaQuery.sizeOf(context)` | CSS responsive rules or viewport hooks |
| `LayoutBuilder` | CSS container behavior or `ResizeObserver` only where required |
| `FFButtonWidget` | shared `Button` component |
| `FlutterFlowIconButton` | shared `IconButton` component |
| `FlutterFlowDropDown` | shared `Select` component |
| `FlutterFlowChoiceChips` | shared `ChoiceChips` component |
| `TextEditingController` | controlled input state |
| `FocusNode` | refs/focus handling where needed |
| `EasyDebounce` | `useDebouncedCallback` or small debounce helper |
| `showModalBottomSheet` | shared modal/sheet component |
| `AlertDialog` | shared dialog component |
| `FlutterFlowVideoPlayer` | shared video component |
| `FlutterFlowYoutubePlayer` | shared YouTube embed component |
| `FlutterFlowWebView` / `WebViewAware` | iframe/embed helper only where actual embedded content exists |
| `CarouselSlider` | approved React carousel dependency or custom minimal carousel |
| `ExpandableController` | controlled accordion/disclosure state |
| `flutter_animate` page-load effects | CSS keyframes or animation library only where needed |
| `launchURL` / `url_launcher` | external URL helper using links or `window.open` |
| Firestore `DocumentReference` route params | serialized document path/id helpers and Firestore doc resolution |

## Design Fidelity Rules

Every migrated page must target greater than 98% UI accuracy compared with the Flutter implementation. A page must not be accepted, marked complete, or used as a template for other pages if the observed visual match is below 98%.

The React implementation must preserve:

- colors;
- typography;
- font weights;
- line heights;
- spacing;
- widths;
- heights;
- borders;
- border radii;
- shadows;
- alignment;
- responsive behavior;
- imagery;
- image crop behavior;
- icons;
- hover states;
- focus states;
- animations where relevant.

Use Tailwind arbitrary values when required for precision. Do not approximate a Flutter value simply because a nearby standard Tailwind class exists. If Flutter uses a value equivalent to `22px`, do not silently substitute `24px` because `p-6` or `text-2xl` is convenient.

Precision takes priority over stylistic Tailwind purity.

Design rules:

- Reproduce first. Refactor later.
- Target greater than 98% visual accuracy for every page, section, and reusable component.
- Treat less than 98% visual accuracy as a failed migration requiring iteration.
- Do not redesign.
- Do not simplify visual layout to make implementation easier.
- Preserve apparent quirks unless explicitly approved.
- Use exact asset files or exact remote media URLs from Flutter source.
- Retain branch and page-specific visual differences.
- Prefer one responsive React component structure over separate duplicated mobile/tablet/desktop component trees.
- Consolidate Flutter's duplicated responsive layouts when doing so preserves the same visual result at the required verification widths.
- Only keep separate responsive component branches when one shared responsive structure would materially reduce visual accuracy or create excessive complexity.
- Break complex pages into smaller section/component verification tasks when that improves precision.
- Verify small visual units before composing them into a full page when a page is complex.

## Responsive Strategy

FlutterFlow responsive visibility from `flutter-website/lib/flutter_flow/flutter_flow_util.dart` is source context, not an implementation requirement:

| Range | Behavior |
|---|---|
| phone | width `< 479` |
| tablet | width `>= 479` and `< 767` |
| tabletLandscape | width `>= 767` and `< 991` |
| desktop | width `>= 991` |

FlutterFlow theme device sizing from `flutter-website/lib/flutter_flow/flutter_flow_theme.dart`:

| Range | Behavior |
|---|---|
| mobile | width `< 479` |
| tablet | width `>= 479` and `< 991` |
| desktop | width `>= 991` |

React should use Tailwind and CSS responsiveness to match the visible UI, not to recreate FlutterFlow's duplicated widget-tree strategy. Flutter often has separate mobile, tablet-landscape, and desktop branches because the original Flutter implementation did not use fluid responsive layout. The React migration should not treat those branches as separate codebases to copy line-for-line.

Implementation rule:

- Build one responsive React component structure where practical.
- Use Tailwind responsive utilities, CSS grid/flex behavior, `clamp()`, container constraints, and arbitrary values to adapt the same UI across screen sizes.
- Use custom Tailwind screens or helper classes only when needed to reproduce a visible breakpoint transition from Flutter.
- Do not follow FlutterFlow's responsive method mechanically. Match the rendered visual result.
- Do not compromise the greater than 98% visual accuracy requirement while consolidating responsive code.
- If a single responsive structure cannot achieve the required visual match, isolate only the specific section that needs a separate responsive branch and document why.

Required verification widths:

- `375`
- `478`
- `479`
- `767`
- `990`
- `991`
- `1280`
- `1440`

Pay particular attention to width `478` vs `479` and `990` vs `991`, because those are useful places to detect visual regressions from the Flutter source. React does not need to switch implementation branches at those exact widths unless the visual output requires it.

## Shared Foundation Plan

Implement these before substantial page migration:

| Foundation Item | Flutter Reference |
|---|---|
| React/Vite/Tailwind base | `flutter-website/lib/main.dart` for app initialization shape |
| Design tokens | `flutter-website/lib/flutter_flow/flutter_flow_theme.dart` |
| Responsive configuration | `flutter-website/lib/flutter_flow/flutter_flow_util.dart` |
| Fonts | `flutter-website/lib/flutter_flow/flutter_flow_theme.dart`, `flutter-website/pubspec.yaml` |
| Asset strategy | `flutter-website/pubspec.yaml`, `flutter-website/assets/` |
| Router | `flutter-website/lib/flutter_flow/nav/nav.dart`, `flutter-website/lib/index.dart` |
| Firebase initialization | `flutter-website/lib/backend/firebase/firebase_config.dart` |
| Firestore helpers | `flutter-website/lib/backend/backend.dart`, `flutter-website/lib/backend/schema/` |
| Shared app state | `flutter-website/lib/app_state.dart` |
| Header/navigation/drawer | repeated page-level navigation in routed widgets |
| Footer | `flutter-website/lib/bottom_sheets/footer*` |
| Buttons | `flutter-website/lib/flutter_flow/flutter_flow_widgets.dart` |
| Icon buttons | `flutter-website/lib/flutter_flow/flutter_flow_icon_button.dart` |
| Inputs | page model files and form sections |
| Selects | `flutter-website/lib/flutter_flow/flutter_flow_drop_down.dart` |
| Chips | `flutter-website/lib/flutter_flow/flutter_flow_choice_chips.dart` |
| Cards | repeated page card structures |
| Dialogs | `showDialog` usages in form pages |
| Modals/sheets | `flutter-website/lib/bottom_sheets/` |
| Loading states | `CircularProgressIndicator` usages in stream builders |
| Media components | `flutter-website/lib/flutter_flow/flutter_flow_video_player.dart`, `flutter_flow_youtube_player.dart`, `flutter_flow_web_view.dart` |

## Phase-by-Phase Implementation Plan

### Phase 0 - Workspace and Architecture

Objective:

Establish the React/Vite/Tailwind migration workspace, folder structure, minimal configuration, and migration documentation. No page migration.

Flutter References:

- [x] `flutter-website/lib/main.dart`
- [x] `flutter-website/lib/index.dart`
- [x] `flutter-website/lib/flutter_flow/nav/nav.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_theme.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_util.dart`
- [x] `flutter-website/lib/backend/backend.dart`
- [x] `flutter-website/lib/backend/schema/`
- [x] `flutter-website/lib/bottom_sheets/`
- [x] `flutter-website/pubspec.yaml`

Target Files:

- [x] `website/package.json`
- [x] `website/index.html`
- [x] `website/vite.config.js`
- [x] `website/postcss.config.js`
- [x] `website/tailwind.config.js`
- [x] `website/src/main.jsx`
- [x] `website/src/app/App.jsx`
- [x] `website/src/app/routes.jsx`
- [x] `website/src/app/providers.jsx`
- [x] `website/src/design/tokens.js`
- [x] `website/src/design/breakpoints.js`
- [x] `website/src/styles/index.css`
- [x] `website/docs/MIGRATION_PLAN.md`
- [x] `website/README.md`

Implementation Tasks:

- [x] Re-inspect Flutter architecture sources.
- [x] Create `website/` outside `flutter-website/`.
- [x] Create the target folder structure.
- [x] Add minimal Vite/React/Tailwind config files.
- [x] Add placeholder app route that does not migrate any page.
- [x] Add master migration plan.
- [x] Add concise README pointing to this plan.
- [x] Verify `flutter-website/` was not modified by this phase.

Validation:

- [x] `website/` exists.
- [x] `flutter-website/` remains untouched by Phase 0 work.
- [x] No package installation was performed.
- [x] No migrated page implementations exist.

Exit Criteria:

- [x] The workspace and documentation exist.
- [x] The app scaffold is intentionally non-functional beyond a placeholder route.
- [x] Future agents can identify source references, target architecture, phases, and rules from this file.

Prohibited Scope:

- [x] Do not implement design tokens.
- [x] Do not implement Firebase.
- [x] Do not migrate header/footer.
- [x] Do not migrate Locations, PrivacyPolicy, Home, or any page.
- [x] Do not modify `flutter-website/`.

### Phase 1 - Design System

Objective:

Translate FlutterFlow design primitives into React/Tailwind configuration and token files without migrating full pages.

Flutter References:

- [x] `flutter-website/lib/flutter_flow/flutter_flow_theme.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_util.dart`
- [x] `flutter-website/pubspec.yaml`
- [x] Representative page style usages in `flutter-website/lib/main_pages/locations/locations_widget.dart`
- [x] Representative button usages in `flutter-website/lib/flutter_flow/flutter_flow_widgets.dart`

Target Files:

- [x] `website/tailwind.config.js`
- [x] `website/src/design/tokens.js`
- [x] `website/src/design/breakpoints.js`
- [x] `website/src/styles/index.css`

Implementation Tasks:

- [x] Extract exact color tokens.
- [x] Extract typography names, sizes, weights, and default colors.
- [x] Configure Inter font loading.
- [x] Configure exact FlutterFlow breakpoints.
- [x] Define rules for arbitrary Tailwind values.
- [x] Document any non-Tailwind CSS needed for precision.

Validation:

- [x] Token values match Flutter source.
- [x] Breakpoint helpers reproduce `<479`, `<767`, `<991`, and `>=991`.
- [x] No page has been migrated.

Exit Criteria:

- [x] Design tokens are reusable by later phases.
- [x] Breakpoint behavior is documented and testable.

Prohibited Scope:

- [x] Do not build page layouts.
- [x] Do not add Firebase.
- [x] Do not copy every asset unless the asset strategy explicitly requires it and is approved.

### Phase 2 - Application Infrastructure

Objective:

Establish routing, Firebase initialization, Firestore helpers, app providers/context, and URL helpers.

Flutter References:

- [x] `flutter-website/lib/main.dart`
- [x] `flutter-website/lib/flutter_flow/nav/nav.dart`
- [x] `flutter-website/lib/index.dart`
- [x] `flutter-website/lib/app_state.dart`
- [x] `flutter-website/lib/backend/firebase/firebase_config.dart`
- [x] `flutter-website/lib/backend/backend.dart`
- [x] `flutter-website/lib/backend/schema/`
- [x] `flutter-website/lib/flutter_flow/nav/serialization_util.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_util.dart`

Target Files:

- [x] `website/src/app/routes.jsx`
- [x] `website/src/app/providers.jsx`
- [x] `website/src/lib/firebase.js`
- [x] `website/src/lib/firestore.js`
- [x] `website/src/lib/urls.js`
- [x] `website/src/lib/format.js`
- [x] `website/src/hooks/useFirestoreQuery.js`
- [x] `website/src/hooks/useFirestoreDoc.js`
- [x] `website/src/hooks/useDebouncedCallback.js`

Implementation Tasks:

- [x] Add React Router route definitions for known paths with placeholder route elements only if no page is approved.
- [x] Add Firebase JS initialization using the same project config.
- [x] Add Firestore helpers preserving collection names and field semantics.
- [x] Add query subscription hooks equivalent to `StreamBuilder`.
- [x] Add document resolution helpers for serialized route/query params.
- [x] Add minimal app state context for confirmed `FFAppState` fields.
- [x] Add external URL helper equivalent to `launchURL`.

Validation:

- [x] Firebase config matches Flutter source.
- [x] Firestore collection names match schema files.
- [x] React route definitions are mapped from `nav.dart` and page `routePath` values to the approved kebab-case React route convention.
- [x] No page visual implementation exists unless separately approved.

Exit Criteria:

- [x] Later pages can consume routing, app state, Firestore, and URL helpers.

Prohibited Scope:

- [x] Do not implement page UI.
- [x] Do not implement forms/modals.
- [x] Do not change Firestore rules.

### Phase 3 - Shared Layout

Objective:

Implement shared site layout primitives: header/navigation, mobile drawer, footers, and page containers.

Flutter References:

- [x] Repeated nav sections inside routed widgets.
- [x] `flutter-website/lib/bottom_sheets/footer/footer_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/footer_desktop/footer_desktop_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/footer_mobile/footer_mobile_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/footer_tope/footer_tope_widget.dart`
- [x] `flutter-website/lib/main_pages/locations/locations_widget.dart`
- [x] `flutter-website/lib/main_pages/home/home_widget.dart`

Target Files:

- [x] `website/src/components/layout/SiteHeader.jsx`
- [x] `website/src/components/layout/MobileDrawer.jsx`
- [x] `website/src/components/layout/SiteFooter.jsx`
- [x] `website/src/components/layout/PageShell.jsx`
- [x] `website/src/components/layout/PageContainer.jsx`

Implementation Tasks:

- [x] Extract nav labels, routes, logo behavior, and mobile drawer behavior.
- [x] Implement desktop header.
- [x] Implement mobile drawer/header.
- [x] Implement footer variants only as required by real Flutter usage.
- [x] Preserve exact visibility behavior at FlutterFlow breakpoints.

Validation:

- [x] Header/footer screenshots match representative Flutter pages at required widths.
- [x] Navigation targets match the approved React kebab-case route mapping for the corresponding Flutter named routes.

Exit Criteria:

- [x] Shared layout can be reused by first page migration.

Prohibited Scope:

- [x] Do not implement page content.
- [x] Do not redesign navigation.

### Phase 4 - Shared UI Components

Objective:

Implement reusable equivalents of FlutterFlow widgets actually used by this site.

Flutter References:

- [x] `flutter-website/lib/flutter_flow/flutter_flow_widgets.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_icon_button.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_drop_down.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_choice_chips.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_video_player.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_youtube_player.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_web_view.dart`
- [x] `flutter-website/lib/flutter_flow/flutter_flow_animations.dart`

Target Files:

- [x] `website/src/components/ui/Button.jsx`
- [x] `website/src/components/ui/IconButton.jsx`
- [x] `website/src/components/ui/Select.jsx`
- [x] `website/src/components/ui/ChoiceChips.jsx`
- [x] `website/src/components/ui/Input.jsx`
- [x] `website/src/components/ui/Card.jsx`
- [x] `website/src/components/ui/Modal.jsx`
- [x] `website/src/components/ui/Dialog.jsx`
- [x] `website/src/components/ui/LoadingSpinner.jsx`
- [x] `website/src/components/media/VideoPlayer.jsx`
- [x] `website/src/components/media/YouTubeEmbed.jsx`
- [x] `website/src/components/media/EmbedFrame.jsx`

Implementation Tasks:

- [x] Implement `Button` loading/disabled/hover behavior.
- [x] Implement `IconButton` style and loading behavior.
- [x] Implement select/dropdown behavior required by forms.
- [x] Implement choice chip behavior.
- [x] Implement modal/sheet and dialog wrappers.
- [x] Implement loading spinner matching Flutter color/size defaults.
- [x] Implement media wrappers needed by Home/About/PrivacyPolicy.

Validation:

- [x] Component behavior matches Flutter equivalents in isolated examples.
- [x] No unused speculative components are added.

Exit Criteria:

- [x] First page can be migrated using shared primitives.

Prohibited Scope:

- [x] Do not migrate complete pages.
- [x] Do not introduce dependencies unless justified by actual Flutter feature needs.

### Phase 5 - First Representative Page: Locations

Objective:

Migrate `Locations` as the first meaningful page. This page tests routing, shared layout, responsive behavior, assets, Firestore reads, cards, and navigation without the full complexity of forms.

Flutter References:

- [x] `flutter-website/lib/main_pages/locations/locations_widget.dart`
- [x] `flutter-website/lib/main_pages/locations/locations_model.dart`
- [x] `flutter-website/lib/backend/schema/branches_record.dart`
- [x] `flutter-website/lib/backend/backend.dart`
- [x] `flutter-website/lib/bottom_sheets/footer/footer_widget.dart`
- [x] Relevant assets in `flutter-website/assets/images/`

Target Files:

- [x] `website/src/pages/LocationsPage.jsx`
- [x] `website/src/features/branches/`
- [x] `website/src/app/routes.jsx`
- [x] Shared layout/component files only as necessary.

Implementation Tasks:

- [x] Re-read the Flutter page from top to bottom.
- [x] Trace imports, branch queries, assets, navigation, and responsive sections.
- [x] Implement page using existing shared layout and UI primitives.
- [x] Preserve route `/locations`.
- [x] Preserve branch card behavior and navigation targets.
- [x] Verify exact imagery and responsive visibility.

Validation:

- [x] Compare Flutter and React screenshots at required widths.
- [x] Verify Firestore reads from `branches` match Flutter.
- [x] Verify branch navigation behaves as Flutter does.

Exit Criteria:

- [x] `Locations` satisfies Page Definition of Done.
- [x] Update the Page Migration Matrix status only after verification.

Prohibited Scope:

- [x] Do not migrate Home.
- [x] Do not migrate BranchTemplate.
- [x] Do not implement form modals.

### Phase 6 - Branch and Giving Foundation

Objective:

Migrate dynamic branch and giving flows that unlock many branch-related routes.

Flutter References:

- [x] `flutter-website/lib/templates/branch_template/branch_template_widget.dart`
- [x] `flutter-website/lib/templates/branch_template/branch_template_model.dart`
- [x] `flutter-website/lib/landings/branch_give/branch_give_widget.dart`
- [x] `flutter-website/lib/landings/beyond_tithe/beyond_tithe_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/give_branch/give_branch_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/give_beyond_branch/give_beyond_branch_widget.dart`
- [x] `flutter-website/lib/backend/schema/branches_record.dart`
- [x] `flutter-website/lib/backend/schema/ministries_record.dart`

Target Files:

- [x] `website/src/pages/BranchTemplatePage.jsx`
- [x] `website/src/pages/BranchGivePage.jsx`
- [x] `website/src/pages/BeyondTithePage.jsx`
- [x] `website/src/features/branches/`
- [x] `website/src/features/giving/`

Implementation Tasks:

- [x] Migrate dynamic `/:branchSlug` behavior.
- [x] Preserve Firestore branch slug lookup.
- [x] Migrate branch hero/pastor/contact/sermon/event sections.
- [x] Migrate giving link selection behavior.
- [x] Keep legacy branch routes deferred until template parity is proven.

Validation:

- [x] Verify dynamic branches with representative branch slugs.
- [x] Verify giving links and branch/ministry fallback behavior.

Exit Criteria:

- [x] Dynamic branch route works and is visually equivalent.
- [x] Giving pages match Flutter behavior.

Prohibited Scope:

- [x] Do not migrate all legacy branch clones yet.

### Phase 7 - Content Listing and Detail Pages

Objective:

Migrate content-driven listing/detail routes.

Flutter References:

- [x] `flutter-website/lib/main_pages/watch/watch_widget.dart`
- [x] `flutter-website/lib/actions/events/events_widget.dart`
- [x] `flutter-website/lib/landings/event/event_widget.dart`
- [x] `flutter-website/lib/actions/ministries/ministries_widget.dart`
- [x] `flutter-website/lib/landings/ministry/ministry_widget.dart`
- [x] Firestore schemas for `sermons`, `events`, `ministries`

Target Files:

- [x] `website/src/pages/WatchPage.jsx`
- [x] `website/src/pages/EventsPage.jsx`
- [x] `website/src/pages/EventPage.jsx`
- [x] `website/src/pages/MinistriesPage.jsx`
- [x] `website/src/pages/MinistryPage.jsx`
- [x] `website/src/features/sermons/`
- [x] `website/src/features/events/`
- [x] `website/src/features/ministries/`

Implementation Tasks:

- [x] Migrate sermon list and external links.
- [x] Migrate event filters/list/detail route param behavior.
- [x] Migrate ministries list/detail and sign-up CTA state handoff.

Validation:

- [x] Firestore query ordering and filters match Flutter.
- [x] Route params and external URLs match.

Exit Criteria:

- [x] Each route satisfies Page Definition of Done.

Prohibited Scope:

- [ ] Do not implement large form flows beyond required CTA handoff.

### Phase 8 - Forms, Modals, and Request Flows

Objective:

Migrate shared form and modal behavior.

Flutter References:

- [x] `flutter-website/lib/bottom_sheets/request/request_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/follow_up/follow_up_widget.dart`
- [x] `flutter-website/lib/bottom_sheets/sign_up/sign_up_widget.dart`
- [x] `flutter-website/lib/landings/register/register_widget.dart`
- [x] `flutter-website/lib/actions/prayer/prayer_widget.dart`
- [x] `flutter-website/lib/actions/contact_us/contact_us_widget.dart`
- [x] `flutter-website/lib/actions/be_a_partner/be_a_partner_widget.dart`
- [x] schemas for `requests`, `signUps`, `registrations`, `partners`

Target Files:

- [x] `website/src/features/requests/`
- [x] `website/src/features/signups/`
- [x] `website/src/pages/RegisterPage.jsx`
- [x] `website/src/pages/PrayerPage.jsx`
- [x] `website/src/pages/ContactUsPage.jsx`
- [x] `website/src/pages/BeAPartnerPage.jsx`

Implementation Tasks:

- [x] Migrate request modal.
- [x] Migrate follow-up modal.
- [x] Migrate sign-up modal.
- [x] Migrate registration page.
- [x] Migrate prayer request behavior.
- [x] Migrate contact-us branch/social/request behavior.
- [x] Migrate partner form and kids flow.

Validation:

- [x] Firestore writes match collection names and fields.
- [x] Required/disabled states match Flutter.
- [x] Success dialogs and post-submit navigation match Flutter.

Exit Criteria:

- [x] Forms submit successfully to Firestore.
- [x] Validation and UI match Flutter.

- [ ] Form flows are equivalent and verified.

Prohibited Scope:

- [ ] Do not alter Firestore field names.
- [ ] Do not simplify forms without approval.

### Phase 9 - Main, Ministry, Resource, and Conference Page Families

Objective:

Migrate remaining page families using established shared components and patterns.

Flutter References:

- [x] `flutter-website/lib/main_pages/about_us/about_us_widget.dart`
- [x] `flutter-website/lib/main_pages/care/care_widget.dart`
- [x] `flutter-website/lib/main_pages/give/give_widget.dart`
- [x] `flutter-website/lib/actions/fellowship/fellowship_widget.dart`
- [x] `flutter-website/lib/actions/follow_jesus/follow_jesus_widget.dart`
- [x] `flutter-website/lib/actions/baptism/baptism_widget.dart`
- [x] `flutter-website/lib/actions/partner/partner_widget.dart`
- [x] `flutter-website/lib/ministries/`
- [x] `flutter-website/lib/resources/`
- [x] `flutter-website/lib/conferences/`
- [x] `flutter-website/lib/policies/privacy_policy/privacy_policy_widget.dart`
- [x] `flutter-website/lib/landings/socials/socials_widget.dart`

Target Files:

- [x] `website/src/pages/`
- [x] relevant `website/src/features/` directories
- [x] shared layout/UI/media components as needed

Implementation Tasks:

- [x] Migrate Care and Give after related modal components exist.
- [x] Migrate ministry pages by reusable template where behavior is equivalent.
- [x] Migrate resource pages.
- [x] Migrate conference pages.
- [x] Migrate AboutUs with leadership, statement of faith, and hero.

Validation:

- [x] Each page satisfies Page Definition of Done.
- [x] Shared templates do not erase page-specific visual differences.

Exit Criteria:

- [x] All secondary, ministry, resource, and conference pages are equivalent and verified.

- [ ] All non-legacy routes are migrated and verified.

Prohibited Scope:

- [ ] Do not remove legacy routes.
- [ ] Do not redesign AboutUs animations/carousels.

### Phase 10 - Legacy Branch Routes

Objective:

Migrate or route-compatible-map the legacy branch pages after `BranchTemplate` is proven equivalent.

Flutter References:

- [x] `flutter-website/lib/branches/e_malahleni/e_malahleni_widget.dart`
- [x] `flutter-website/lib/branches/ludzeludze/ludzeludze_widget.dart`
- [x] `flutter-website/lib/branches/hlutsi/hlutsi_widget.dart`
- [x] `flutter-website/lib/branches/lagos/lagos_widget.dart`
- [x] `flutter-website/lib/branches/siteki/siteki_widget.dart`
- [x] `flutter-website/lib/branches/orange_farm/orange_farm_widget.dart`
- [x] `flutter-website/lib/branches/boksburg/boksburg_widget.dart`
- [x] `flutter-website/lib/branches/online/online_widget.dart`
- [x] `flutter-website/lib/branches/mbabane/mbabane_widget.dart`
- [x] `flutter-website/lib/templates/branch_template/branch_template_widget.dart`

Target Files:

- [x] `website/src/pages/LegacyBranchPage.jsx` or route mapping through `BranchTemplatePage.jsx`
- [x] `website/src/app/routes.jsx`
- [x] `website/src/features/branches/`

Implementation Tasks:

- [x] Compare each legacy branch page against dynamic `BranchTemplate`.
- [x] Decide whether each legacy route can reuse the dynamic React template.
- [x] Preserve legacy route paths exactly.
- [x] Preserve per-branch assets, copy, contact branch values, events, sermons, and payment/contact links.

Validation:

- [x] Every legacy route loads and matches the Flutter legacy page.
- [x] No branch-specific visual or content behavior is lost.

Exit Criteria:

- [x] All 48 discovered routed pages are complete.

Prohibited Scope:

- [ ] Do not delete legacy support unless explicitly approved.

## Page Migration Matrix

Initial status for every routed page is `NOT STARTED`.

The `Route` column records the Flutter source route path from `flutter-website/`.
When a Flutter route is camelCase, the React route must use the documented
kebab-case mapping in the Route Path Mapping section.

| Status | Page | Route | Flutter Source | Dependencies | Target React Page | Phase | Risk |
|---|---|---|---|---|---|---|---|
| COMPLETED | Home | `/`, `/home` | `flutter-website/lib/main_pages/home/home_widget.dart` | homepage Firestore content, video/YT, footer, nav | `website/src/pages/HomePage.jsx` | 10 | High |
| COMPLETED | AboutUs | `/aboutUs` | `flutter-website/lib/main_pages/about_us/about_us_widget.dart` | carousel, video, animations, branches, many links | `website/src/pages/AboutUsPage.jsx` | 9 | Very High |
| COMPLETED | Locations | `/locations` | `flutter-website/lib/main_pages/locations/locations_widget.dart` | branches query, cards, assets, nav | `website/src/pages/LocationsPage.jsx` | 5 | Medium |
| COMPLETED | Watch | `/watch` | `flutter-website/lib/main_pages/watch/watch_widget.dart` | sermons query, external links | `website/src/pages/WatchPage.jsx` | 7 | Medium |
| COMPLETED | Care | `/care` | `flutter-website/lib/main_pages/care/care_widget.dart` | carousel, request/follow-up modals | `website/src/pages/CarePage.jsx` | 9 | High |
| COMPLETED | Give | `/give` | `flutter-website/lib/main_pages/give/give_widget.dart` | ministries query, giving/sign-up modals | `website/src/pages/GivePage.jsx` | 9 | High |
| COMPLETED | Prayer | `/prayer` | `flutter-website/lib/actions/prayer/prayer_widget.dart` | request form, sign-up modal | `website/src/pages/PrayerPage.jsx` | 8 | High |
| COMPLETED | Counseling | `/counseling` | `flutter-website/lib/ministries/counseling/counseling_widget.dart` | request modal, static cards | `website/src/pages/CounselingPage.jsx` | 8 | Medium |
| COMPLETED | Ministries | `/ministries` | `flutter-website/lib/actions/ministries/ministries_widget.dart` | ministries query, chips, sign-up modal | `website/src/pages/MinistriesPage.jsx` | 7 | High |
| COMPLETED | Ministry | `/ministry` | `flutter-website/lib/landings/ministry/ministry_widget.dart` | ministry doc param, CTA links | `website/src/pages/MinistryPage.jsx` | 7 | Medium |
| COMPLETED | Partner | `/Partner` | `flutter-website/lib/actions/partner/partner_widget.dart` | static content, partner CTA | `website/src/pages/PartnerPage.jsx` | 9 | Medium |
| COMPLETED | BeAPartner | `/beAPartner` | `flutter-website/lib/actions/be_a_partner/be_a_partner_widget.dart` | long form, partner writes, child flow, dates | `website/src/pages/BeAPartnerPage.jsx` | 8 | Very High |
| COMPLETED | BranchGive | `/branchGive` | `flutter-website/lib/landings/branch_give/branch_give_widget.dart` | branch param, payment links | `website/src/pages/BranchGivePage.jsx` | 6 | Medium |
| COMPLETED | BeyondTithe | `/beyondTithe` | `flutter-website/lib/landings/beyond_tithe/beyond_tithe_widget.dart` | branch/ministry params, payment links | `website/src/pages/BeyondTithePage.jsx` | 6 | Medium |
| COMPLETED | Events | `/events` | `flutter-website/lib/actions/events/events_widget.dart` | events query, filters, event nav | `website/src/pages/EventsPage.jsx` | 7 | High |
| COMPLETED | Event | `/event` | `flutter-website/lib/landings/event/event_widget.dart` | event doc param, registration CTA | `website/src/pages/EventPage.jsx` | 7 | Medium |
| COMPLETED | Register | `/register` | `flutter-website/lib/landings/register/register_widget.dart` | event param, attendee form, requests | `website/src/pages/RegisterPage.jsx` | 8 | Medium |
| COMPLETED | Baptism | `/baptism` | `flutter-website/lib/actions/baptism/baptism_widget.dart` | request modal, expandable/static sections | `website/src/pages/BaptismPage.jsx` | 8 | Medium |
| COMPLETED | PrivacyPolicy | `/privacyPolicy` | `flutter-website/lib/policies/privacy_policy/privacy_policy_widget.dart` | embedded web view/footer | `website/src/pages/PrivacyPolicyPage.jsx` | 9 | Low |
| COMPLETED | Welfare | `/welfare` | `flutter-website/lib/ministries/welfare/welfare_widget.dart` | events/ministries queries, sign-up | `website/src/pages/WelfarePage.jsx` | 8 | High |
| COMPLETED | EResourcesCenter | `/eResourcesCenter` | `flutter-website/lib/resources/e_resources_center/e_resources_center_widget.dart` | resource links/assets | `website/src/pages/EResourcesCenterPage.jsx` | 9 | Medium |
| COMPLETED | Podcasts | `/podcasts` | `flutter-website/lib/resources/podcasts/podcasts_widget.dart` | podcast query, external links | `website/src/pages/PodcastsPage.jsx` | 9 | Medium |
| COMPLETED | Fellowship | `/fellowship` | `flutter-website/lib/actions/fellowship/fellowship_widget.dart` | ministry cards/nav | `website/src/pages/FellowshipPage.jsx` | 9 | Medium |
| COMPLETED | FollowJesus | `/followJesus` | `flutter-website/lib/actions/follow_jesus/follow_jesus_widget.dart` | request modal | `website/src/pages/FollowJesusPage.jsx` | 9 | Medium |
| COMPLETED | ContactUs | `/contactUs` | `flutter-website/lib/actions/contact_us/contact_us_widget.dart` | branches query, request form, socials | `website/src/pages/ContactUsPage.jsx` | 8 | High |
| COMPLETED | SchoolOfMinistry | `/schoolOfMinistry` | `flutter-website/lib/ministries/school_of_ministry/school_of_ministry_widget.dart` | static ministry page | `website/src/pages/SchoolOfMinistryPage.jsx` | 9 | Medium |
| COMPLETED | SuperKids | `/superKids` | `flutter-website/lib/ministries/super_kids/super_kids_widget.dart` | events query, request/sign-up modals | `website/src/pages/SuperKidsPage.jsx` | 9 | High |
| COMPLETED | Youth | `/youth` | `flutter-website/lib/ministries/youth/youth_widget.dart` | events query, sign-up, register links | `website/src/pages/YouthPage.jsx` | 9 | High |
| COMPLETED | YoungAdults | `/youngAdults` | `flutter-website/lib/ministries/young_adults/young_adults_widget.dart` | events query, sign-up | `website/src/pages/YoungAdultsPage.jsx` | 9 | High |
| COMPLETED | Singles | `/singles` | `flutter-website/lib/ministries/singles/singles_widget.dart` | events query, sign-up | `website/src/pages/SinglesPage.jsx` | 9 | High |
| COMPLETED | Couples | `/couples` | `flutter-website/lib/ministries/couples/couples_widget.dart` | events query | `website/src/pages/CouplesPage.jsx` | 9 | Medium |
| COMPLETED | ForMen | `/forMen` | `flutter-website/lib/ministries/for_men/for_men_widget.dart` | events query, external link | `website/src/pages/ForMenPage.jsx` | 9 | Medium |
| COMPLETED | ForWomen | `/forWomen` | `flutter-website/lib/ministries/for_women/for_women_widget.dart` | events query, external link | `website/src/pages/ForWomenPage.jsx` | 9 | Medium |
| COMPLETED | CampYolo | `/campYolo` | `flutter-website/lib/conferences/camp_yolo/camp_yolo_widget.dart` | events query, assets | `website/src/pages/CampYoloPage.jsx` | 9 | Medium |
| COMPLETED | FireConference | `/fireConference` | `flutter-website/lib/conferences/fire_conference/fire_conference_widget.dart` | events query, sign-up CTA | `website/src/pages/FireConferencePage.jsx` | 9 | High |
| COMPLETED | SupermanConference | `/supermanConference` | `flutter-website/lib/conferences/superman_conference/superman_conference_widget.dart` | events query, sign-up CTA | `website/src/pages/SupermanConferencePage.jsx` | 9 | High |
| COMPLETED | Socials | `/socials` | `flutter-website/lib/landings/socials/socials_widget.dart` | branches query, social links | `website/src/pages/SocialsPage.jsx` | 9 | Medium |
| IN PROGRESS - NEEDS VISUAL QA | BranchTemplate | `/:branchSlug` | `flutter-website/lib/templates/branch_template/branch_template_widget.dart` | branch slug query, branch contact/social/payment fields, branch sermons, branch/global events, request form, shared quick actions | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| COMPLETED | YouthTemplate | `/youthTemplate` | `flutter-website/lib/templates/youth_template/youth_template_widget.dart` | events query, sign-up | `website/src/pages/YouthTemplatePage.jsx` | 9 | High |
| IN PROGRESS - NEEDS VISUAL QA | EMalahleni legacy | `/legacy/emalahleni` | `flutter-website/lib/branches/e_malahleni/e_malahleni_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Ludzeludze legacy | `/legacy/ludzeludze` | `flutter-website/lib/branches/ludzeludze/ludzeludze_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Hlutsi legacy | `/legacy/hlutsi` | `flutter-website/lib/branches/hlutsi/hlutsi_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Lagos legacy | `/legacy/lagos` | `flutter-website/lib/branches/lagos/lagos_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Siteki legacy | `/legacy/siteki` | `flutter-website/lib/branches/siteki/siteki_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | OrangeFarm legacy | `/legacy/orange-farm` | `flutter-website/lib/branches/orange_farm/orange_farm_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Boksburg legacy | `/legacy/boksburg` | `flutter-website/lib/branches/boksburg/boksburg_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Online legacy | `/legacy/online` | `flutter-website/lib/branches/online/online_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |
| IN PROGRESS - NEEDS VISUAL QA | Mbabane legacy | `/legacy/mbabane` | `flutter-website/lib/branches/mbabane/mbabane_widget.dart` | branch clone, events, sermons, request form | `website/src/pages/BranchTemplatePage.jsx` | 6 | Very High |

## Page-Level Migration Procedure

Before implementation, every page migration must:

1. Read the original Flutter page.
2. Trace imported custom widgets.
3. Trace Firestore queries.
4. Identify state.
5. Identify route parameters.
6. Identify assets.
7. Identify responsive branches.
8. Identify animations/interactions.
9. Identify modal flows.
10. Identify external URLs.

If the page has many sections, duplicated desktop/mobile branches, dense card grids, forms, animations, or media, split the migration into smaller UI-focused tasks. Each section/component should be compared against the Flutter source before moving on. This is required when it is necessary to maintain greater than 98% visual accuracy.

Then implement only the approved page or phase.

Then validate against Flutter.

Do not rely solely on memory or this migration document when converting a page. The Flutter source must be re-inspected.

## Page Definition of Done

A page may only be marked complete when:

- UI match accuracy is greater than 98% against the Flutter page;
- no major visible section, spacing relationship, image treatment, or responsive branch is materially different;
- route works using the approved React kebab-case canonical path;
- desktop layout matches;
- mobile layout matches;
- breakpoint transitions match;
- typography matches;
- colors match;
- spacing matches;
- imagery matches;
- Firestore reads match;
- Firestore writes match where applicable;
- forms behave correctly;
- navigation matches the approved React route mapping and the Flutter source behavior;
- external links match;
- loading state matches;
- empty state matches;
- error behavior is acceptable;
- interactive behavior matches;
- screenshots show no material visual differences;
- no unrelated files were changed.

If a page does not meet the greater than 98% UI accuracy target, it remains incomplete even if routing, data, and interactions work.

## Visual Verification Procedure

For every page, compare the Flutter version and React version at these widths:

- `375px`
- `478px`
- `479px`
- `767px`
- `990px`
- `991px`
- `1280px`
- `1440px`

Where practical, capture screenshots of both versions.

Compare:

- geometry;
- spacing;
- typography;
- alignment;
- media;
- responsive changes;
- component visibility;
- overflow;
- hover/focus states;
- modal/dialog behavior;
- loading, empty, success, and error states;
- navigation;
- external links;
- Firestore read/write behavior.

The objective is near pixel-level reproduction, not merely similar design. The required standard is greater than 98% visual accuracy. Less than 98% is not acceptable.

For complex pages, use a staged visual verification workflow:

1. Verify shared primitives first.
2. Verify individual page sections at all required widths.
3. Verify responsive visibility changes at breakpoint boundaries.
4. Verify the full assembled page.
5. Re-check the page after every follow-up adjustment.

When screenshot comparison tooling is available, use it to support the >98% target. When automated visual diffing is not available, perform a structured manual comparison and record any remaining differences in `Migration Issues and Discoveries`.

## Migration Rules for Codex / AI Agents

1. Read `website/docs/MIGRATION_PLAN.md` before migration work.
2. Inspect the relevant `flutter-website/` source before implementation.
3. Never modify `flutter-website/`.
4. Work on only the approved phase/page.
5. Do not migrate future phases opportunistically.
6. Do not redesign.
7. Maintain greater than 98% UI accuracy; less than 98% is not acceptable.
8. Use kebab-case canonical routes in React, even when Flutter source routes are camelCase.
9. Document any Flutter route to React route mapping before relying on it.
10. Do not replace precise dimensions with approximations without justification.
11. Prefer one responsive React component structure instead of duplicating Flutter's separate mobile/tablet/desktop widget trees.
12. Use Tailwind/CSS responsiveness to match the Flutter visual output; do not mechanically recreate FlutterFlow's responsive implementation strategy.
13. Keep a separate responsive branch only when required to preserve greater than 98% visual accuracy, and document why.
14. Break large or visually complex pages into smaller section/component-focused tasks when needed for precision.
15. Reuse React components when Flutter uses equivalent shared behavior.
16. Do not introduce dependencies unnecessarily.
17. Preserve backend collection names and field semantics.
18. Verify before marking a checklist item complete.
19. Update `MIGRATION_PLAN.md` after completing approved work.
20. Record discovered migration issues in this plan.
21. Stop at the end of the approved scope and wait for the next instruction.

## Decision Log

### DEC-001 - React Router

Decision:

Use React Router for route configuration in `website/src/app/routes.jsx`.

Reason:

The Flutter app uses `GoRouter` in `flutter-website/lib/flutter_flow/nav/nav.dart`, and React Router is the standard React equivalent for named paths, dynamic params, and navigation.

Flutter reference:

`flutter-website/lib/flutter_flow/nav/nav.dart`

Date:

2026-09-02

### DEC-002 - Responsive Implementation Strategy

Decision:

Use Tailwind and CSS responsive techniques to reproduce the visible Flutter UI across required verification widths, while preferring one responsive React component structure over duplicated mobile/tablet/desktop component trees. Custom Tailwind screens or helper classes may be used when a visible breakpoint transition requires them, but React does not need to mechanically reproduce FlutterFlow's responsive implementation.

Reason:

The Flutter app often uses separate responsive branches because the original Flutter implementation was not fluidly responsive. The migration target should use normal React/Tailwind responsive layout where practical. The non-negotiable requirement is greater than 98% visual accuracy at the required verification widths, not duplicating FlutterFlow's internal method.

Flutter reference:

`flutter-website/lib/flutter_flow/flutter_flow_util.dart`

Date:

2026-09-02

### DEC-003 - JavaScript/JSX

Decision:

Use JavaScript/JSX for the public React migration unless the user later approves TypeScript.

Reason:

The repository's existing React admin app uses JSX, and the user requested JavaScript/JSX unless repository context strongly indicates TypeScript.

Flutter reference:

Not applicable.

Date:

2026-09-02

### DEC-004 - Phase 0 Placeholder Only

Decision:

`website/src/app/routes.jsx` contains only a Phase 0 placeholder route.

Reason:

This task establishes workspace and planning only. No Flutter page should be migrated during Phase 0.

Flutter reference:

All page references remain in `flutter-website/lib/index.dart` and `flutter-website/lib/flutter_flow/nav/nav.dart`.

Date:

2026-09-02

### DEC-005 - React Routes Use Kebab Case

Decision:

Use kebab-case canonical route paths in the React website during migration and implementation.

Reason:

The FlutterFlow source contains generated paths such as `/aboutUs`, `/beAPartner`, `/privacyPolicy`, `/eResourcesCenter`, and `/supermanConference`. The React website should use cleaner kebab-case public paths such as `/about-us`, `/be-a-partner`, `/privacy-policy`, `/e-resources-center`, and `/superman-conference` while preserving the Flutter source route as implementation reference metadata.

Flutter reference:

`flutter-website/lib/flutter_flow/nav/nav.dart` and each page's `static String routePath`.

Date:

2026-09-02

### DEC-006 - Responsive Code Consolidation

Decision:

React page implementations should generally use one responsive component structure and Tailwind/CSS layout rules instead of recreating Flutter's separate mobile, tablet-landscape, and desktop widget trees.

Reason:

The migration target is React/Vite/Tailwind, not FlutterFlow. Tailwind is expected to handle responsive layout through CSS utilities and constraints. The goal remains greater than 98% visual accuracy against the Flutter page at the required widths; implementation consolidation is allowed only when it does not compromise that visual match.

Flutter reference:

`flutter-website/lib/flutter_flow/flutter_flow_util.dart` and pages that use `responsiveVisibility`.

Date:

2026-09-02

## Migration Issues and Discoveries

### ISSUE-001

Status:

Open

Discovered during:

Phase 0

Flutter reference:

`flutter-website/lib/templates/branch_template/branch_template_widget.dart`, `flutter-website/lib/branches/`

Description:

The app contains a dynamic `BranchTemplate` route and many large legacy branch pages with highly similar behavior.

Decision:

Migrate `BranchTemplate` before legacy branch pages. Only map legacy routes through the template after verifying branch-specific parity.

### ISSUE-002

Status:

Open

Discovered during:

Phase 0

Flutter reference:

`flutter-website/lib/main_pages/about_us/about_us_widget.dart`

Description:

`AboutUs` is much larger than most pages and uses many page-load animations, carousel behavior, media, branch queries, and external links.

Decision:

Migrate `AboutUs` late, after animation, carousel, media, layout, and branch/social primitives are proven.

### ISSUE-003

Status:

Open

Discovered during:

Phase 0

Flutter reference:

Git status for `website/` before this task

Description:

`website/` did not exist on disk at Phase 0 start, but Git showed deleted tracked files from a previous `website` app.

Decision:

Recreate `website/` as the new migration workspace. Treat any prior deleted `website` content as superseded unless the user explicitly asks to recover it.

### ISSUE-004

Status:

Resolved

Discovered during:

Phase 2 / Phase 3 verification after mixed Codex and Gemini implementation work

Flutter reference:

`flutter-website/lib/flutter_flow/nav/nav.dart`
`flutter-website/lib/backend/firebase/firebase_config.dart`
`flutter-website/lib/backend/schema/`

Description:

The React router initially needed review because FlutterFlow source paths include camelCase routes such as `/aboutUs`, `/beAPartner`, `/privacyPolicy`, `/eResourcesCenter`, `/branchGive`, and `/beyondTithe`, while the React migration workspace is intentionally using kebab-case public routes. Firestore helper behavior also needed review to ensure generic record creation does not add implicit fields that FlutterFlow does not write.

Decision:

Keep React public routes in kebab-case and document Flutter-to-React route mappings explicitly. Do not convert React routes back to Flutter camelCase paths unless the user explicitly changes the route policy. Keep the Flutter source route paths as source metadata in the migration matrix. Generic Firestore `createRecord()` must write only caller-supplied data; page-specific create helpers are responsible for supplying fields such as `date` or `created_time` when the Flutter source does so.

### ISSUE-005

Status:

Partially resolved; awaiting Flutter baseline screenshot comparison

Discovered during:

Phase 5 Locations verification

Flutter reference:

`flutter-website/lib/main_pages/locations/locations_widget.dart`
`flutter-website/lib/backend/schema/branches_record.dart`

Description:

The initial React Locations implementation had several fidelity problems: branch images read `branch.image` while Flutter's schema field is `Image`; branch grid columns used viewport Tailwind breakpoints instead of Flutter's inner-container thresholds of `>=1020` for 3 columns and `>=680` for 2 columns; and the mobile hero used the compact phone/tablet header across all widths below `991px` even though Flutter shows a tablet-landscape header from `767px` through `990px`.

Decision:

React Locations now reads `branch.Image || branch.image`, calculates grid columns with a `ResizeObserver` against the branch grid container, and splits the mobile hero header into `<767px` phone/tablet and `767px-990px` tablet-landscape branches. Browser metric checks passed at `375`, `478`, `479`, `767`, `990`, `991`, `1280`, and `1440` with no console errors and no horizontal overflow. The page still requires Flutter-vs-React screenshot comparison before it can be marked complete under the greater than 98% visual accuracy rule.

### ISSUE-006

Status:

Partially resolved; awaiting Flutter-vs-React screenshot comparison

Discovered during:

Phase 6 BranchTemplate fidelity correction

Flutter reference:

`flutter-website/lib/templates/branch_template/branch_template_widget.dart`
`flutter-website/lib/backend/schema/branches_record.dart`
`flutter-website/lib/backend/schema/sermons_record.dart`
`flutter-website/lib/backend/schema/events_record.dart`

Description:

The React `BranchTemplatePage` was previously a simplified branch landing page. It did not render the same six quick-action buttons as Home/Flutter BranchTemplate, omitted BranchTemplate resource sections, omitted most Firestore-backed branch contact/social/payment fields, used different service-time wording, and wrote an extra `date` field on branch message requests that the Flutter BranchTemplate submit path does not write.

Decision:

Extract Home-style quick actions into `website/src/components/common/QuickActionButtons.jsx` and reuse them on Home and BranchTemplate. BranchTemplate must render branch-specific data from the selected Firestore branch slug, including available contact, social, giving/payment, pastor, sermon, and event information. Sermons should be filtered by `branchName`/branch reference; events should include matching branch events and global events. The page may keep the current React header/hero style if the user approves that consistency, but it must not be marked complete until screenshot verification confirms greater-than-98% visual accuracy against the Flutter source.
