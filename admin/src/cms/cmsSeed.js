import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { firestore } from '../lib/firebase';
import { createGlobalSettings, createStructuredPage, structuredPages } from './phaseTwoBlueprint';

export async function seedPhaseTwoCms() {
  const batch = writeBatch(firestore);
  batch.set(doc(firestore, 'siteSettings', 'global'), {
    ...createGlobalSettings(),
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  }, { merge: true });

  structuredPages.forEach((page) => {
    batch.set(doc(firestore, 'pages', page.slug), {
      ...createStructuredPage(page),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    }, { merge: true });
  });

  await batch.commit();
}
