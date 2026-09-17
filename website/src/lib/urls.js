/**
 * URL and link helpers reproducing Flutter's url_launcher behaviors:
 * flutter-website/lib/flutter_flow/flutter_flow_util.dart
 */

/**
 * Opens an external or internal URL.
 * Equivalent to Flutter's launchURL(url).
 */
export function launchUrl(url, target = '_blank') {
  if (!url) return;
  const trimmed = url.trim();
  if (!trimmed) return;

  if (target === '_blank') {
    window.open(trimmed, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = trimmed;
  }
}

/**
 * Builds Google Maps URL from coordinates or address string matching Flutter's locations logic.
 */
export function getMapDirectionsUrl({ lat, lng, address } = {}) {
  if (lat != null && lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  if (address && address.trim()) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.trim())}`;
  }
  return null;
}

export default {
  launchUrl,
  getMapDirectionsUrl,
};
