import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  projectId: 'ssmi-database',
  apiKey: 'AIzaSyDPRznvHNhICZlG_a_1F8a1s5GPS1ss3Yk'
});

const db = getFirestore(app);
const testCollections = [
  'events', 'registrations', 'requests', 'signUps', 'partners', 'users',
  'websiteContent', 'eventCounts', 'ticketCounts', 'publicCounters'
];

for (const c of testCollections) {
  try {
    const s = await getDoc(doc(db, c, 'test'));
    console.log(c, 'can read (doc exists:', s.exists(), ')');
  } catch (e) {
    console.log(c, 'read error:', e.code);
  }
}
process.exit(0);
