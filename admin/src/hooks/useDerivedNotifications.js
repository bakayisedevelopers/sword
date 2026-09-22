import { useEffect, useMemo, useRef, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { getLocalPreferences, showBrowserNotification } from '../services/notificationService';

function branchScopes(profile) {
  return [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean);
}

function toDate(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
function isRecent(record) {
  const ts = toDate(record.updatedAt || record.createdAt || record.date)?.getTime() || 0;
  return ts > 0 && Date.now() - ts < THIRTY_DAYS_MS;
}

function personName(record) {
  return `${record?.name || ''} ${record?.surname || ''}`.trim() || record?.displayName || record?.email || 'Unnamed';
}

const sources = [
  {
    key: 'requests',
    prefKey: 'requests',
    collectionName: 'requests',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.status !== 'closed',
    notification: (record) => ({
      id: `requests-${record.id}`,
      key: 'requests',
      prefKey: 'requests',
      title: record.type || 'New request',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/requests/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'registrations',
    prefKey: 'registrations',
    collectionName: 'registrations',
    branchField: 'branch',
    filter: (record) => record.reviewed !== true && record.acknowledged !== true,
    notification: (record) => ({
      id: `registrations-${record.id}`,
      key: 'registrations',
      prefKey: 'registrations',
      title: 'New event registration',
      subtitle: `${record.eventName || 'No event'} · ${personName(record)}`,
      path: `/workspace/registrations/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'events',
    prefKey: 'events',
    collectionName: 'events',
    branchField: null,
    scopeFilter: (record, scopes) => {
      if (record.global) return true;
      const bName = `${record.branch_name || ''}`.trim();
      const bList = Array.isArray(record.branches) ? record.branches.map((b) => `${b}`.trim()) : [];
      return scopes.includes(bName) || bList.some((b) => scopes.includes(b));
    },
    filter: (record) => record.acknowledged !== true && isRecent(record),
    notification: (record) => ({
      id: `events-${record.id}`,
      key: 'events',
      prefKey: 'events',
      title: 'Event update',
      subtitle: `${record.title || 'Untitled event'} · ${record.branch_name || (record.global ? 'Global' : 'Event')}`,
      path: `/workspace/events/${record.id}`,
      createdAt: record.updatedAt || record.createdAt || record.date,
    }),
  },
  {
    key: 'branches',
    prefKey: 'branches',
    collectionName: 'branches',
    branchField: null,
    scopeFilter: (record, scopes) => scopes.includes(`${record.name || record.id}`.trim()),
    filter: (record) => record.acknowledged !== true && isRecent(record),
    notification: (record) => ({
      id: `branches-${record.id}`,
      key: 'branches',
      prefKey: 'branches',
      title: 'Branch update',
      subtitle: `${record.name || record.id} campus`,
      path: `/workspace/branches`,
      createdAt: record.updatedAt || record.createdAt || record.date,
    }),
  },
  {
    key: 'ministries',
    prefKey: 'ministries',
    collectionName: 'ministries',
    branchField: null,
    scopeFilter: (record, scopes) => {
      if (record.global) return true;
      const bList = Array.isArray(record.branches) ? record.branches.map((b) => `${b}`.trim()) : [];
      return bList.some((b) => scopes.includes(b));
    },
    filter: (record) => record.acknowledged !== true && isRecent(record),
    notification: (record) => ({
      id: `ministries-${record.id}`,
      key: 'ministries',
      prefKey: 'ministries',
      title: 'Ministry update',
      subtitle: `${record.name || record.ministryName || 'Ministry'} · ${record.slug || 'Department'}`,
      path: `/workspace/ministries/${record.id}`,
      createdAt: record.updatedAt || record.createdAt,
    }),
  },
  {
    key: 'partners',
    prefKey: 'partners',
    collectionName: 'partners',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.isPartner !== false,
    notification: (record) => ({
      id: `partners-${record.id}`,
      key: 'partners',
      prefKey: 'partners',
      title: 'New partner request',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/partners/${record.id}`,
      createdAt: record.createdAt || record.date,
    }),
  },
  {
    key: 'sign-ups',
    prefKey: 'signUps',
    collectionName: 'signUps',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.status !== 'closed',
    notification: (record) => ({
      id: `sign-ups-${record.id}`,
      key: 'sign-ups',
      prefKey: 'signUps',
      title: 'New ministry signup',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/sign-ups/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'users',
    prefKey: 'users',
    collectionName: 'accessRequests',
    branchField: 'requestedBranch',
    filter: (record) => !record.status || record.status === 'pending',
    notification: (record) => ({
      id: `users-${record.id}`,
      key: 'users',
      prefKey: 'users',
      title: 'New access request',
      subtitle: `${record.requestedBranch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/users/requests/${record.id}`,
      createdAt: record.createdAt,
    }),
  },
];

export default function useDerivedNotifications({ profile, roles }) {
  const [recordsByKey, setRecordsByKey] = useState({});
  const scopedBranches = useMemo(() => branchScopes(profile), [profile]);
  const canReviewAll = roles?.includes('super_admin') || roles?.includes('global_editor') || roles?.includes('care_team');
  const canReviewBranch = canReviewAll || roles?.includes('branch_editor');

  const preferences = useMemo(() => {
    const local = getLocalPreferences(profile?.uid);
    return { ...local, ...(profile?.notificationPreferences || {}) };
  }, [profile?.uid, profile?.notificationPreferences]);

  const knownIdsRef = useRef(new Set());
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    const unsubscribers = [];
    setRecordsByKey({});

    if (!canReviewBranch) return () => {};

    sources.forEach((source) => {
      let sourceQueries = [];
      if (canReviewAll || !source.branchField) {
        sourceQueries = [query(collection(firestore, source.collectionName))];
      } else {
        sourceQueries = scopedBranches.map((branch) =>
          query(collection(firestore, source.collectionName), where(source.branchField, '==', branch))
        );
      }

      if (!sourceQueries.length) {
        setRecordsByKey((current) => ({ ...current, [source.key]: [] }));
        return;
      }

      const queryRecords = new Map();
      sourceQueries.forEach((sourceQuery, index) => {
        const unsubscribe = onSnapshot(
          sourceQuery,
          (snapshot) => {
            queryRecords.set(index, snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })));
            let nextRecords = [...queryRecords.values()]
              .flat()
              .filter((record, recordIndex, allRecords) => allRecords.findIndex((entry) => entry.id === record.id) === recordIndex);

            if (!canReviewAll && typeof source.scopeFilter === 'function') {
              nextRecords = nextRecords.filter((record) => source.scopeFilter(record, scopedBranches));
            }

            nextRecords = nextRecords.filter(source.filter);

            // Check for newly arriving notifications for browser push
            if (hasInitializedRef.current && preferences.browserNotifications) {
              const prefAllowed = preferences[source.prefKey] !== false;
              if (prefAllowed) {
                nextRecords.forEach((record) => {
                  const notif = source.notification(record);
                  if (!knownIdsRef.current.has(notif.id)) {
                    knownIdsRef.current.add(notif.id);
                    showBrowserNotification(notif.title, {
                      body: notif.subtitle,
                      path: notif.path,
                    });
                  }
                });
              }
            } else {
              // Populate known IDs on initial snapshot
              nextRecords.forEach((record) => {
                const notif = source.notification(record);
                knownIdsRef.current.add(notif.id);
              });
            }

            setRecordsByKey((current) => ({ ...current, [source.key]: nextRecords }));
          },
          () => {
            queryRecords.set(index, []);
            let nextRecords = [...queryRecords.values()].flat();
            if (!canReviewAll && typeof source.scopeFilter === 'function') {
              nextRecords = nextRecords.filter((record) => source.scopeFilter(record, scopedBranches));
            }
            nextRecords = nextRecords.filter(source.filter);
            setRecordsByKey((current) => ({ ...current, [source.key]: nextRecords }));
          }
        );
        unsubscribers.push(unsubscribe);
      });
    });

    // Mark initialized after a small delay to avoid firing alerts on first mount
    const timer = setTimeout(() => {
      hasInitializedRef.current = true;
    }, 1500);

    return () => {
      clearTimeout(timer);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [canReviewAll, canReviewBranch, scopedBranches, preferences.browserNotifications]);

  // Compute badges taking user category preferences into account
  const badges = useMemo(() => {
    return Object.fromEntries(
      sources.map((source) => {
        const isEnabled = preferences[source.prefKey] !== false;
        return [
          source.key,
          isEnabled ? (recordsByKey[source.key] || []).length : 0,
        ];
      })
    );
  }, [recordsByKey, preferences]);

  // Compute active notifications list filtered by active preferences
  const notifications = useMemo(() => {
    return sources
      .filter((source) => preferences[source.prefKey] !== false)
      .flatMap((source) => (recordsByKey[source.key] || []).map(source.notification))
      .sort((left, right) => {
        const leftDate = toDate(left.createdAt)?.getTime() || 0;
        const rightDate = toDate(right.createdAt)?.getTime() || 0;
        return rightDate - leftDate;
      });
  }, [recordsByKey, preferences]);

  return {
    badges,
    notifications,
    total: notifications.length,
    preferences,
  };
}
