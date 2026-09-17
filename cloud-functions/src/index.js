import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

initializeApp();

const region = 'africa-south1';
const adminRoles = new Set([
  'super_admin',
  'global_editor',
  'branch_editor',
  'ministry_editor',
  'care_team',
  'reports_viewer',
]);

function requiredString(value, field, maximum = 5000) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maximum) {
    throw new HttpsError('invalid-argument', `${field} must be a non-empty string no longer than ${maximum} characters.`);
  }
  return value.trim();
}

function optionalString(value, field, maximum = 5000) {
  if (value === undefined || value === null || value === '') return '';
  return requiredString(value, field, maximum);
}

function requireSuperAdmin(request) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in is required.');
  const roles = request.auth.token.roles;
  if (!Array.isArray(roles) || !roles.includes('super_admin')) {
    throw new HttpsError('permission-denied', 'Only a super administrator can manage admin access.');
  }
}

function sanitizedRoles(roles) {
  if (!Array.isArray(roles) || roles.length === 0) {
    throw new HttpsError('invalid-argument', 'At least one approved admin role is required.');
  }
  const normalized = [...new Set(roles.map((role) => String(role)))];
  if (normalized.some((role) => !adminRoles.has(role))) {
    throw new HttpsError('invalid-argument', 'An unrecognized admin role was supplied.');
  }
  return normalized;
}

function sanitizedScope(values, field) {
  if (values === undefined) return [];
  if (!Array.isArray(values) || values.length > 100) {
    throw new HttpsError('invalid-argument', `${field} must be a list of no more than 100 IDs.`);
  }
  return [...new Set(values.map((value) => requiredString(value, field, 120)))];
}

async function writeAudit({ actorUid, action, subjectUid, details = {} }) {
  await getFirestore().collection('auditLogs').add({
    actorUid,
    action,
    subjectUid,
    details,
    createdAt: FieldValue.serverTimestamp(),
  });
}

export const setAdminAccess = onCall({ region }, async (request) => {
  requireSuperAdmin(request);

  const uid = requiredString(request.data?.uid, 'uid', 128);
  const roles = sanitizedRoles(request.data?.roles);
  const branchIds = sanitizedScope(request.data?.branchIds, 'branchIds');
  const ministryIds = sanitizedScope(request.data?.ministryIds, 'ministryIds');
  const target = await getAuth().getUser(uid);
  const nextClaims = { ...(target.customClaims || {}), roles, branchIds, ministryIds };

  await getAuth().setCustomUserClaims(uid, nextClaims);
  await writeAudit({
    actorUid: request.auth.uid,
    action: 'admin_access_updated',
    subjectUid: uid,
    details: { roles, branchIds, ministryIds },
  });

  return { uid, roles, branchIds, ministryIds };
});

// Ready for the public Flutter forms to adopt in their next change. Until
// then, the legacy Firestore creates are restricted by Firestore rules.
export const submitPublicRequest = onCall({ region }, async (request) => {
  const data = request.data || {};
  const kind = requiredString(data.kind, 'kind', 40);
  if (!['contact', 'prayer', 'counselling', 'follow_up'].includes(kind)) {
    throw new HttpsError('invalid-argument', 'Unsupported request type.');
  }

  const requestData = {
    name: requiredString(data.name, 'name', 120),
    surname: optionalString(data.surname, 'surname', 120),
    cell: requiredString(data.cell, 'cell', 40),
    message: requiredString(data.message, 'message', 5000),
    type: kind,
    branch: optionalString(data.branch, 'branch', 160),
    date: FieldValue.serverTimestamp(),
    source: 'callable_function',
  };

  const reference = await getFirestore().collection('requests').add(requestData);
  await writeAudit({
    actorUid: request.auth?.uid || 'anonymous',
    action: 'public_request_created',
    subjectUid: reference.id,
    details: { kind, source: 'callable_function' },
  });
  return { id: reference.id };
});

export const auditIncomingRequest = onDocumentCreated({ region, document: 'requests/{requestId}' }, async (event) => {
  const requestData = event.data?.data() || {};
  await writeAudit({
    actorUid: 'public_website',
    action: 'public_request_received',
    subjectUid: event.params.requestId,
    details: { type: requestData.type || 'unspecified', source: requestData.source || 'legacy_firestore' },
  });
  logger.info('Public request received', { requestId: event.params.requestId, type: requestData.type || 'unspecified' });
});
