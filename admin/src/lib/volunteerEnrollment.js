import { addDoc, arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';

/**
 * Enrolls a ministry sign-up into volunteers.
 * 1. Checks if a user with sign-up email exists in Firestore 'users'.
 * 2. If exists: updates volunteerMinistries array and sets isVolunteer: true.
 * 3. If not exists: creates a new user document in 'users' collection.
 * 4. Syncs the volunteer entry into the corresponding 'ministries' collection document.
 * 5. Returns the user ID and details.
 */
export async function processMinistryVolunteerEnrollment(firestore, signUp, adminUser) {
  const email = `${signUp?.email || signUp?.userEmail || ''}`.trim().toLowerCase();
  const ministryType = Array.isArray(signUp?.type)
    ? signUp.type.find(Boolean) || 'General'
    : `${signUp?.type || 'General'}`.trim();
  const name = `${signUp?.name || ''}`.trim();
  const surname = `${signUp?.surname || ''}`.trim();
  const fullName = `${name} ${surname}`.trim() || signUp?.cell || 'Volunteer';
  const branch = `${signUp?.branch || ''}`.trim();
  const cell = `${signUp?.cell || ''}`.trim();
  const nowIso = new Date().toISOString();

  let targetUserId = null;

  if (email) {
    try {
      const usersSnap = await getDocs(query(collection(firestore, 'users'), where('email', '==', email)));
      if (!usersSnap.empty) {
        const existingDoc = usersSnap.docs[0];
        targetUserId = existingDoc.id;
        const existingData = existingDoc.data();
        const existingMinistries = Array.isArray(existingData.volunteerMinistries) ? existingData.volunteerMinistries : [];
        const updatedMinistries = Array.from(new Set([...existingMinistries, ministryType]));

        await setDoc(
          doc(firestore, 'users', targetUserId),
          {
            volunteerMinistries: updatedMinistries,
            isVolunteer: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } else {
        const newUserPayload = {
          email: email,
          displayName: fullName,
          name: name,
          surname: surname,
          cell: cell,
          branch: branch,
          volunteerMinistries: [ministryType],
          isVolunteer: true,
          roles: ['volunteer'],
          authAccount: false,
          authStatus: 'pending_auth',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        const createdRef = await addDoc(collection(firestore, 'users'), newUserPayload);
        targetUserId = createdRef.id;
      }
    } catch (err) {
      console.error('Error matching/creating user for volunteer:', err);
    }
  }

  if (ministryType) {
    try {
      const ministriesSnap = await getDocs(collection(firestore, 'ministries'));
      const matchingMinistryDoc = ministriesSnap.docs.find((mDoc) => {
        const mData = mDoc.data();
        const mName = `${mData.name || mData.ministryName || mDoc.id}`.trim().toLowerCase();
        return mName === ministryType.toLowerCase() || mDoc.id.toLowerCase() === ministryType.toLowerCase();
      });

      if (matchingMinistryDoc) {
        const volunteerEntry = {
          userId: targetUserId || '',
          name: fullName,
          email: email,
          cell: cell,
          branch: branch,
          addedAt: nowIso,
        };
        await setDoc(
          doc(firestore, 'ministries', matchingMinistryDoc.id),
          {
            volunteersList: arrayUnion(volunteerEntry),
            volunteers: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('Could not sync to ministry volunteersList:', err);
    }
  }

  return { targetUserId, email, ministryType };
}
