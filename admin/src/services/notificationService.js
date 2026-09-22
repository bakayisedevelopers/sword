/**
 * Notification service handling admin notification preferences and browser push alerts.
 */

export const DEFAULT_NOTIFICATION_PREFERENCES = {
  browserNotifications: false,
  registrations: true,
  events: true,
  branches: true,
  ministries: true,
  requests: true,
  signUps: true,
  partners: true,
  users: true,
};

export const NOTIFICATION_CATEGORIES = [
  {
    key: 'registrations',
    label: 'Event registrations',
    description: 'Notifications when someone registers for an event or conference',
  },
  {
    key: 'events',
    label: 'Events & Conferences',
    description: 'Notifications when an event is published or modified',
  },
  {
    key: 'branches',
    label: 'Branch creations & edits',
    description: 'Notifications when a church branch campus is created or edited',
  },
  {
    key: 'ministries',
    label: 'Ministry creations & edits',
    description: 'Notifications when a ministry or department is created or edited',
  },
  {
    key: 'requests',
    label: 'Prayer & care requests',
    description: 'Incoming pastoral care, prayer requests, and counseling submissions',
  },
  {
    key: 'signUps',
    label: 'Ministry volunteer sign-ups',
    description: 'Submissions from members signing up to serve in church ministries',
  },
  {
    key: 'partners',
    label: 'Partner requests',
    description: 'Applications from individuals requesting to be kingdom partners',
  },
  {
    key: 'users',
    label: 'Staff access requests',
    description: 'Requests from team members for branch or administrative permissions',
  },
];

const PREF_STORAGE_KEY_PREFIX = 'ssmi_admin_notification_prefs_';

export function getLocalPreferences(uid) {
  if (!uid || typeof window === 'undefined') return { ...DEFAULT_NOTIFICATION_PREFERENCES };
  try {
    const raw = localStorage.getItem(`${PREF_STORAGE_KEY_PREFIX}${uid}`);
    if (raw) {
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return { ...DEFAULT_NOTIFICATION_PREFERENCES };
}

export function setLocalPreferences(uid, prefs) {
  if (!uid || typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PREF_STORAGE_KEY_PREFIX}${uid}`, JSON.stringify(prefs));
  } catch {
    // ignore
  }
}

export function isBrowserNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getBrowserNotificationPermission() {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return window.Notification.permission;
}

export async function requestBrowserNotificationPermission() {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  try {
    const permission = await window.Notification.requestPermission();
    return permission;
  } catch {
    return window.Notification.permission;
  }
}

export function showBrowserNotification(title, options = {}) {
  if (!isBrowserNotificationSupported()) return null;
  if (window.Notification.permission !== 'granted') return null;

  try {
    const notification = new window.Notification(title, {
      icon: '/sword_logo.png',
      badge: '/sword_logo.png',
      ...options,
    });

    if (options.path) {
      notification.onclick = () => {
        window.focus();
        if (typeof window.location !== 'undefined') {
          window.location.hash = '';
          window.location.pathname = options.path;
        }
        notification.close();
      };
    }

    return notification;
  } catch (err) {
    console.warn('Browser notification error:', err);
    return null;
  }
}
