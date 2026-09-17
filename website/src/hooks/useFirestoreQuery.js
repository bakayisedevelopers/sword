import { useState, useEffect } from 'react';
import { where, orderBy, limit } from 'firebase/firestore';
import { subscribeToCollection } from '../lib/firestore.js';

/**
 * Converts a plain query descriptor object into an array of Firebase QueryConstraint instances.
 *
 * Accepts either:
 *   - An array of real QueryConstraint objects (pass-through, already correct).
 *   - A plain descriptor object with optional keys:
 *       { where: [{ field, operator, value }, ...], orderBy: { field, direction }, limit: n }
 *
 * This is the single conversion point (BUG-02 fix). All callers may continue to use
 * either form; firestore.js::subscribeToCollection receives only real QueryConstraints.
 */
function resolveConstraints(queryConstraints) {
  // Already an array — either empty or real QueryConstraint instances.
  if (Array.isArray(queryConstraints)) return queryConstraints;

  // Plain descriptor object — convert each key to real Firebase constraints.
  const constraints = [];

  if (queryConstraints && typeof queryConstraints === 'object') {
    const { where: whereClause, orderBy: orderByClause, limit: limitClause } = queryConstraints;

    if (whereClause) {
      const clauses = Array.isArray(whereClause) ? whereClause : [whereClause];
      for (const { field, operator, value } of clauses) {
        constraints.push(where(field, operator, value));
      }
    }

    if (orderByClause) {
      const { field, direction = 'asc' } = orderByClause;
      constraints.push(orderBy(field, direction));
    }

    if (limitClause != null) {
      constraints.push(limit(limitClause));
    }
  }

  return constraints;
}

/**
 * Custom hook equivalent to Flutter's StreamBuilder<List<T>> using queryCollection.
 *
 * @param {string} collectionName - Firestore collection name
 * @param {Array|Object} queryConstraints - Either an array of real Firebase QueryConstraint
 *   instances, or a plain descriptor object: { where, orderBy, limit } (BUG-02 fix).
 * @param {Array} deps - Dependency array to trigger re-subscription
 * @returns {{ data: Array, loading: boolean, error: Error | null }}
 */
export function useFirestoreQuery(collectionName, queryConstraints = [], deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const resolved = resolveConstraints(queryConstraints);

    const unsubscribe = subscribeToCollection(
      collectionName,
      resolved,
      (records) => {
        setData(records);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, ...deps]);

  return { data, loading, error };
}

export default useFirestoreQuery;
