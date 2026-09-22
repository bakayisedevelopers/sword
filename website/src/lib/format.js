/**
 * Formatting utilities translated from FlutterFlow helpers:
 * flutter-website/lib/flutter_flow/flutter_flow_util.dart
 */

/**
 * Returns defaultValue if value is null, undefined, or an empty string.
 */
export function valueOrDefault(value, defaultValue) {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    return defaultValue;
  }
  return value;
}

/**
 * Converts a branch record or name into its standard URL slug.
 * Source: flutter-website/lib/main_pages/locations/locations_widget.dart line 45
 */
export function formatBranchSlug(branch) {
  if (!branch) return '';
  const toText = (value = '') => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value.path === 'string') return value.path.split('/').pop() || value.path;
    if (typeof value.id === 'string') return value.id;
    if (typeof value.name === 'string') return value.name;
    return '';
  };

  const storedSlug = toText(branch.snapshotData?.slug || branch.slug).trim();
  const source = storedSlug.length > 0 ? storedSlug : toText(branch.name);
  return source
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats a Date, Firestore Timestamp, or ISO string.
 */
export function formatDateTime(dateVal, options = {}) {
  if (!dateVal) return '';
  let d;
  if (typeof dateVal?.toDate === 'function') {
    d = dateVal.toDate();
  } else if (dateVal instanceof Date) {
    d = dateVal;
  } else {
    d = new Date(dateVal);
  }

  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Returns true if an event occurs today or in the future, or is an active recurring event.
 */
export function isFutureEvent(event) {
  if (!event) return false;

  const status = `${event.status || ''}`.toLowerCase();
  if (status === 'past' || status === 'cancelled' || event.isPast === true) {
    return false;
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const parseTime = (val) => {
    if (!val) return null;
    if (typeof val?.toDate === 'function') {
      try { return val.toDate().getTime(); } catch { return null; }
    }
    if (val instanceof Date) return val.getTime();
    if (typeof val === 'number') return val;
    const parsed = new Date(val);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  };

  const endTime = parseTime(event.endAt || event.endDate || event.recurrenceEnd);
  if (endTime !== null) {
    return endTime >= todayStart;
  }

  const eventTime = parseTime(event.date || event.startAt || event.startDate || event.createdAt);
  if (eventTime !== null) {
    return eventTime >= todayStart;
  }

  const dateStr = `${event.date_details || event.dateDetails || event.recurrenceDays || ''}`.toLowerCase();
  if (dateStr.includes('every') || dateStr.includes('weekly') || dateStr.includes('ongoing') || dateStr.includes('daily')) {
    return true;
  }

  return true;
}

export default {
  valueOrDefault,
  formatBranchSlug,
  formatDateTime,
  isFutureEvent,
};
