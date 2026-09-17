import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '../lib/firebase';

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

function personName(record) {
  return `${record?.name || ''} ${record?.surname || ''}`.trim() || record?.displayName || record?.email || 'Unnamed';
}

const sources = [
  {
    key: 'requests',
    collectionName: 'requests',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.status !== 'closed',
    notification: (record) => ({
      id: `requests-${record.id}`,
      key: 'requests',
      title: record.type || 'New request',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/requests/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'registrations',
    collectionName: 'registrations',
    branchField: 'branch',
    filter: (record) => record.reviewed !== true && record.acknowledged !== true,
    notification: (record) => ({
      id: `registrations-${record.id}`,
      key: 'registrations',
      title: 'New event registration',
      subtitle: `${record.eventName || 'No event'} · ${personName(record)}`,
      path: `/workspace/registrations/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'partners',
    collectionName: 'partners',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.isPartner !== false,
    notification: (record) => ({
      id: `partners-${record.id}`,
      key: 'partners',
      title: 'New partner request',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/partners/${record.id}`,
      createdAt: record.createdAt || record.date,
    }),
  },
  {
    key: 'sign-ups',
    collectionName: 'signUps',
    branchField: 'branch',
    filter: (record) => record.acknowledged !== true && record.status !== 'closed',
    notification: (record) => ({
      id: `sign-ups-${record.id}`,
      key: 'sign-ups',
      title: 'New ministry signup',
      subtitle: `${record.branch || 'No branch'} · ${personName(record)}`,
      path: `/workspace/sign-ups/${record.id}`,
      createdAt: record.date || record.createdAt,
    }),
  },
  {
    key: 'users',
    collectionName: 'accessRequests',
    branchField: 'requestedBranch',
    filter: (record) => !record.status || record.status === 'pending',
    notification: (record) => ({
      id: `users-${record.id}`,
      key: 'users',
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
  const canReviewAll = roles.includes('super_admin') || roles.includes('global_editor') || roles.includes('care_team');
  const canReviewBranch = canReviewAll || roles.includes('branch_editor');

  useEffect(() => {
    const unsubscribers = [];
    setRecordsByKey({});

    if (!canReviewBranch) return () => {};

    sources.forEach((source) => {
      const sourceQueries = canReviewAll
        ? [query(collection(firestore, source.collectionName))]
        : scopedBranches.map((branch) => query(collection(firestore, source.collectionName), where(source.branchField, '==', branch)));

      if (!sourceQueries.length) {
        setRecordsByKey((current) => ({ ...current, [source.key]: [] }));
        return;
      }

      const queryRecords = new Map();
      sourceQueries.forEach((sourceQuery, index) => {
        const unsubscribe = onSnapshot(sourceQuery, (snapshot) => {
          queryRecords.set(index, snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })));
          const nextRecords = [...queryRecords.values()]
            .flat()
            .filter((record, recordIndex, allRecords) => allRecords.findIndex((entry) => entry.id === record.id) === recordIndex)
            .filter(source.filter);
          setRecordsByKey((current) => ({ ...current, [source.key]: nextRecords }));
        }, () => {
          queryRecords.set(index, []);
          const nextRecords = [...queryRecords.values()].flat().filter(source.filter);
          setRecordsByKey((current) => ({ ...current, [source.key]: nextRecords }));
        });
        unsubscribers.push(unsubscribe);
      });
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [canReviewAll, canReviewBranch, scopedBranches]);

  const badges = useMemo(() => Object.fromEntries(sources.map((source) => [
    source.key,
    (recordsByKey[source.key] || []).length,
  ])), [recordsByKey]);

  const notifications = useMemo(() => sources
    .flatMap((source) => (recordsByKey[source.key] || []).map(source.notification))
    .sort((left, right) => {
      const leftDate = toDate(left.createdAt)?.getTime() || 0;
      const rightDate = toDate(right.createdAt)?.getTime() || 0;
      return rightDate - leftDate;
    }), [recordsByKey]);

  return {
    badges,
    notifications,
    total: notifications.length,
  };
}
