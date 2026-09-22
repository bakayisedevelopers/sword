import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  runTransaction,
} from 'firebase/firestore';
import { db } from './firebase.js';

export const COLLECTIONS = {
  BRANCHES: 'branches',
  EVENTS: 'events',
  MINISTRIES: 'ministries',
  SERMONS: 'sermons',
  PODCAST: 'podcast',
  REQUESTS: 'requests',
  SIGN_UPS: 'signUps',
  REGISTRATIONS: 'registrations',
  PARTNERS: 'partners',
  USERS: 'users',
  WEBSITE_CONTENT: 'websiteContent',
};

/**
 * Transforms a Firestore DocumentSnapshot into a record matching FlutterFlow schema record shapes.
 */
export function recordFromSnapshot(docSnap) {
  if (!docSnap || !docSnap.exists()) return null;
  const data = docSnap.data() || {};
  return {
    id: docSnap.id,
    reference: docSnap.ref,
    path: docSnap.ref.path,
    snapshotData: data,
    ...data,
  };
}

/**
 * Returns a CollectionReference for a collection name.
 */
export function getCollectionRef(collectionName) {
  return collection(db, collectionName);
}

/**
 * Returns a DocumentReference given collection and doc ID.
 */
export function getDocRef(collectionName, docId) {
  return doc(db, collectionName, docId);
}

/**
 * Resolves a DocumentReference from a path string (e.g. 'ministries/abc123' or serialized param).
 */
export function docRefFromPath(path) {
  if (!path) return null;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const parts = cleanPath.split('/');
  if (parts.length < 2) return null;
  return doc(db, cleanPath);
}

/**
 * Fetches an entire collection with optional query constraints once.
 */
export async function fetchCollection(collectionName, queryConstraints = []) {
  const collRef = getCollectionRef(collectionName);
  const q = queryConstraints.length > 0 ? query(collRef, ...queryConstraints) : collRef;
  const querySnap = await getDocs(q);
  return querySnap.docs.map(recordFromSnapshot);
}

/**
 * Fetches a single document once.
 */
export async function fetchDocument(collectionName, docId) {
  const docRef = getDocRef(collectionName, docId);
  const snap = await getDoc(docRef);
  return recordFromSnapshot(snap);
}

/**
 * Subscribes to a Firestore collection (equivalent to Flutter's queryCollection StreamBuilder).
 */
export function subscribeToCollection(collectionName, queryConstraints = [], onNext, onError) {
  const collRef = getCollectionRef(collectionName);
  const q = queryConstraints.length > 0 ? query(collRef, ...queryConstraints) : collRef;

  return onSnapshot(
    q,
    (querySnap) => {
      const records = querySnap.docs.map(recordFromSnapshot);
      onNext(records);
    },
    (err) => {
      console.error(`Error querying collection ${collectionName}:`, err);
      if (onError) onError(err);
    }
  );
}

/**
 * Subscribes to a single document.
 */
export function subscribeToDocument(collectionName, docId, onNext, onError) {
  const docRef = getDocRef(collectionName, docId);
  return onSnapshot(
    docRef,
    (docSnap) => {
      onNext(recordFromSnapshot(docSnap));
    },
    (err) => {
      console.error(`Error subscribing to doc ${collectionName}/${docId}:`, err);
      if (onError) onError(err);
    }
  );
}

/**
 * Creates a record in a collection.
 *
 * Do not add implicit fields here. FlutterFlow create*RecordData helpers only
 * write fields supplied by the caller; public form records generally use
 * `date`, while `users` uses `created_time`.
 */
export async function createRecord(collectionName, data = {}) {
  const collRef = getCollectionRef(collectionName);
  return await addDoc(collRef, data);
}

/**
 * Updates a record in a collection.
 */
export async function updateRecord(collectionName, docId, data = {}) {
  const docRef = getDocRef(collectionName, docId);
  return await updateDoc(docRef, data);
}

/**
 * Creates event registration records and decrements the event's available ticket count atomically.
 *
 * Existing admin/content code stores ticket availability in `ticketLimit`. When the
 * first successful website registration decrements it, `originalTicketLimit` is
 * preserved so the frontend can distinguish a sold-out event from an unlimited event.
 */
export async function createEventRegistrationsAndReduceTickets(eventId, quantity, registrations = []) {
  const requestedQuantity = Number(quantity || registrations.length || 1);
  if (!eventId || requestedQuantity <= 0) {
    return await Promise.all(registrations.map((payload) => createRecord(COLLECTIONS.REGISTRATIONS, payload)));
  }

  const eventRef = getDocRef(COLLECTIONS.EVENTS, eventId);

  return await runTransaction(db, async (transaction) => {
    const eventSnap = await transaction.get(eventRef);
    if (!eventSnap.exists()) {
      throw new Error('Event could not be found.');
    }

    const eventData = eventSnap.data() || {};
    const currentTicketLimit = Number(eventData.ticketLimit || 0);
    const originalTicketLimit = Number(eventData.originalTicketLimit || 0);
    const usesLimitedTickets = originalTicketLimit > 0 || currentTicketLimit > 0;

    if (usesLimitedTickets) {
      if (currentTicketLimit < requestedQuantity) {
        throw new Error(`Sorry, only ${Math.max(0, currentTicketLimit)} seat(s) remain available for this event.`);
      }

      const nextTicketLimit = Math.max(0, currentTicketLimit - requestedQuantity);
      transaction.update(eventRef, {
        ticketLimit: nextTicketLimit,
        originalTicketLimit: originalTicketLimit > 0 ? originalTicketLimit : currentTicketLimit,
        updatedAt: new Date(),
      });
    }

    const registrationRefs = registrations.map(() => doc(getCollectionRef(COLLECTIONS.REGISTRATIONS)));
    registrationRefs.forEach((registrationRef, index) => {
      transaction.set(registrationRef, registrations[index]);
    });

    return registrationRefs;
  });
}

export default {
  COLLECTIONS,
  recordFromSnapshot,
  getCollectionRef,
  getDocRef,
  docRefFromPath,
  fetchCollection,
  fetchDocument,
  subscribeToCollection,
  subscribeToDocument,
  createRecord,
  updateRecord,
  createEventRegistrationsAndReduceTickets,
};
