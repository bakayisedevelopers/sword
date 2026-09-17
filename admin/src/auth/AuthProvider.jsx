import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { firebaseAuth, firestore } from '../lib/firebase';
import { adminRoles, canAccessAdmin, isDeveloperAdmin, rolesFromClaims, rolesFromProfile } from './roles';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, user: null, profile: null, roles: [], error: null });

  useEffect(() => {
    let unsubscribeProfile = null;

    async function syncUserDocument(user) {
      const providerIds = user.providerData.map((provider) => provider?.providerId).filter(Boolean);
      const accountPayload = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        authAccount: true,
        authStatus: 'linked',
        authProviderIds: providerIds,
        lastLoginAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const matches = user.email
        ? await getDocs(query(collection(firestore, 'users'), where('email', '==', user.email)))
        : null;

      if (matches && !matches.empty) {
        const canonicalMatch = matches.docs.find((userDoc) => userDoc.id === user.uid);
        if (canonicalMatch) {
          await setDoc(canonicalMatch.ref, accountPayload, { merge: true });
          return;
        }

        const sourceDoc = matches.docs[0];
        const sourceData = sourceDoc.data() || {};
        const canonicalRef = doc(firestore, 'users', user.uid);
        await setDoc(canonicalRef, {
          ...sourceData,
          ...accountPayload,
          uid: user.uid,
          authLinkedAt: serverTimestamp(),
          migratedFromUserDoc: sourceDoc.id,
          activeProfile: true,
        }, { merge: true });
        await Promise.all(matches.docs.map((userDoc) => setDoc(userDoc.ref, {
          authStatus: 'migrated',
          authAccount: true,
          migratedToUserDoc: user.uid,
          mergedIntoAuthUser: true,
          activeProfile: false,
          updatedAt: serverTimestamp(),
        }, { merge: true })));
        return;
      }

      await setDoc(doc(firestore, 'users', user.uid), {
        ...accountPayload,
        authLinkedAt: serverTimestamp(),
      }, { merge: true });
    }

    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, async (user) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (!user) {
        setState({ loading: false, user: null, profile: null, roles: [], error: null });
        return;
      }

      try {
        const developerLogin = isDeveloperAdmin(user.email);
        if (developerLogin) {
          await setDoc(doc(firestore, 'users', user.uid), {
            email: user.email || '',
            displayName: user.displayName || '',
            roles: adminRoles,
            authAccount: true,
            authStatus: 'linked',
            lastLoginAt: serverTimestamp(),
            adminProvisioning: 'developer_login',
            adminProvisionedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }, { merge: true });
        }

        await syncUserDocument(user);

        const token = await user.getIdTokenResult();
        const tokenRoles = rolesFromClaims(token.claims);
        const resolvedRoles = developerLogin ? adminRoles : tokenRoles;

        // Keep loading true while fetching Firestore profile if claims roles are empty
        if (resolvedRoles.length > 0) {
          setState((current) => ({
            ...current,
            loading: false,
            user,
            roles: resolvedRoles,
            error: null,
          }));
        }

        unsubscribeProfile = onSnapshot(doc(firestore, 'users', user.uid), (snapshot) => {
          const profileData = snapshot.exists() ? snapshot.data() : {};
          const profileRoles = developerLogin ? adminRoles : rolesFromProfile(profileData);
          const nextRoles = profileRoles.length ? profileRoles : resolvedRoles;

          setState((current) => ({
            ...current,
            loading: false,
            user,
            profile: snapshot.exists() ? { uid: user.uid, ...snapshot.data() } : { uid: user.uid },
            roles: nextRoles,
            error: null,
          }));
        }, (profileError) => {
          setState((current) => ({
            ...current,
            loading: false,
            user,
            profile: { uid: user.uid },
            roles: resolvedRoles,
            error: profileError,
          }));
        });
      } catch (error) {
        setState({ loading: false, user, profile: null, roles: [], error });
      }
    });

    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
      unsubscribeAuth();
    };
  }, []);

  const value = useMemo(() => ({
    ...state,
    isAuthorized: canAccessAdmin(state.roles),
    signIn: (email, password) => signInWithEmailAndPassword(firebaseAuth, email, password),
    signUp: async (name, email, password) => {
      const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() });
      return credential;
    },
    signInWithGoogle: () => signInWithPopup(firebaseAuth, googleProvider),
    resetPassword: (email) => sendPasswordResetEmail(firebaseAuth, email),
    signOut: () => signOut(firebaseAuth),
  }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
