/**
 * FlutterFlow responsive breakpoint definitions and helpers.
 * Source references:
 * - flutter-website/lib/flutter_flow/flutter_flow_util.dart
 * - flutter-website/lib/flutter_flow/flutter_flow_theme.dart
 */

export const BREAKPOINT_SMALL = 479;
export const BREAKPOINT_MEDIUM = 767;
export const BREAKPOINT_LARGE = 991;

export const DeviceSize = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
};

export const DeviceRange = {
  PHONE: 'phone',
  TABLET: 'tablet',
  TABLET_LANDSCAPE: 'tabletLandscape',
  DESKTOP: 'desktop',
};

export const breakpoints = {
  small: BREAKPOINT_SMALL,
  medium: BREAKPOINT_MEDIUM,
  large: BREAKPOINT_LARGE,
  screens: {
    phone: { max: `${BREAKPOINT_SMALL - 1}px` }, // <= 478px
    tablet: { min: `${BREAKPOINT_SMALL}px`, max: `${BREAKPOINT_MEDIUM - 1}px` }, // 479px - 766px
    tabletLandscape: { min: `${BREAKPOINT_MEDIUM}px`, max: `${BREAKPOINT_LARGE - 1}px` }, // 767px - 990px
    desktop: { min: `${BREAKPOINT_LARGE}px` }, // >= 991px
  },
};

/**
 * Returns true if the given width is in the phone/mobile range (< 479px).
 */
export function isMobileWidth(width = typeof window !== 'undefined' ? window.innerWidth : 1200) {
  return width < BREAKPOINT_SMALL;
}

/**
 * Returns the FlutterFlow theme device size: 'mobile' (< 479), 'tablet' (479 - 990), or 'desktop' (>= 991).
 */
export function getDeviceSize(width = typeof window !== 'undefined' ? window.innerWidth : 1200) {
  if (width < BREAKPOINT_SMALL) {
    return DeviceSize.MOBILE;
  } else if (width < BREAKPOINT_LARGE) {
    return DeviceSize.TABLET;
  } else {
    return DeviceSize.DESKTOP;
  }
}

/**
 * Returns the FlutterFlow 4-range classification: 'phone', 'tablet', 'tabletLandscape', or 'desktop'.
 */
export function getDeviceRange(width = typeof window !== 'undefined' ? window.innerWidth : 1200) {
  if (width < BREAKPOINT_SMALL) {
    return DeviceRange.PHONE;
  } else if (width < BREAKPOINT_MEDIUM) {
    return DeviceRange.TABLET;
  } else if (width < BREAKPOINT_LARGE) {
    return DeviceRange.TABLET_LANDSCAPE;
  } else {
    return DeviceRange.DESKTOP;
  }
}

/**
 * Evaluates visibility according to FlutterFlow's responsiveVisibility parameters:
 * phone: < 479
 * tablet: 479 - 766
 * tabletLandscape: 767 - 990
 * desktop: >= 991
 */
export function responsiveVisibility(
  width = typeof window !== 'undefined' ? window.innerWidth : 1200,
  { phone = true, tablet = true, tabletLandscape = true, desktop = true } = {}
) {
  if (width < BREAKPOINT_SMALL) {
    return phone;
  } else if (width < BREAKPOINT_MEDIUM) {
    return tablet;
  } else if (width < BREAKPOINT_LARGE) {
    return tabletLandscape;
  } else {
    return desktop;
  }
}

export default breakpoints;
