import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const [uid, ...roles] = process.argv.slice(2);
if (!uid || roles.length === 0) {
  console.error('Usage: npm run grant:admin -- <firebase-uid> <role> [role...]');
  process.exit(1);
}

const allowedRoles = new Set(['super_admin', 'global_editor', 'branch_editor', 'ministry_editor', 'care_team', 'reports_viewer']);
if (roles.some((role) => !allowedRoles.has(role))) {
  console.error(`Roles must be one of: ${[...allowedRoles].join(', ')}`);
  process.exit(1);
}

const credential = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  ? cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  : applicationDefault();

initializeApp({ credential, projectId: 'ssmi-database' });
const auth = getAuth();
const user = await auth.getUser(uid);
await auth.setCustomUserClaims(uid, { ...(user.customClaims || {}), roles: [...new Set(roles)], branchIds: [], ministryIds: [] });
console.log(`Granted ${roles.join(', ')} to ${user.email || uid}. They must sign out and sign in again.`);
