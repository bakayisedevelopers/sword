import { useState, useEffect } from 'react';
import { subscribeToDocument } from '../lib/firestore.js';

/**
 * Custom hook equivalent to Flutter's StreamBuilder<T> for a single document.
 *
 * @param {string} collectionName - Firestore collection name
 * @param {string} docId - Firestore document ID
 * @returns {{ data: Object | null, loading: boolean, error: Error | null }}
 */
export function useFirestoreDoc(collectionName, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionName || !docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDocument(
      collectionName,
      docId,
      (record) => {
        setData(record);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  return { data, loading, error };
}

export default useFirestoreDoc;
