import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useFirestoreQuery } from '../hooks/useFirestoreQuery.js';
import { COLLECTIONS } from '../lib/firestore.js';
import { BranchTemplatePage, OFFICIAL_BRANCHES, resolveCanonicalBranchSlug } from './BranchTemplatePage.jsx';
import { MinistryPage } from './MinistryPage.jsx';

function textValue(value = '') {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value.path === 'string') return value.path.split('/').pop() || value.path;
  if (typeof value.id === 'string') return value.id;
  if (typeof value.name === 'string') return value.name;
  return '';
}

function normalize(val = '') {
  return textValue(val)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Smart dispatcher that routes /:slug to either:
 * - BranchTemplatePage if the slug matches a known church branch/campus
 * - MinistryPage if the slug corresponds to a ministry, conference, or department
 */
export function BranchOrMinistryPage() {
  const { slug, branchSlug } = useParams();
  const location = useLocation();

  const rawSlug = slug || branchSlug || location.pathname.split('/').filter(Boolean).pop() || '';
  const canonicalBranch = resolveCanonicalBranchSlug(rawSlug);
  const normalizedSlug = normalize(rawSlug);

  const { data: branches = [] } = useFirestoreQuery(COLLECTIONS.BRANCHES);

  // 1. Check if slug matches an official branch or alias
  const isOfficialBranch = OFFICIAL_BRANCHES.some(
    (b) =>
      b.slug === canonicalBranch ||
      b.aliases.some((a) => normalize(a) === normalizedSlug || normalize(a).replace(/-/g, '') === normalizedSlug.replace(/-/g, ''))
  );

  // 2. Check if slug matches a database branch document
  const isDbBranch = branches.some((b) => {
    const bSlug = resolveCanonicalBranchSlug(textValue(b.slug || b.name || b.id));
    return (
      bSlug === canonicalBranch ||
      normalize(b.slug || '') === normalizedSlug ||
      normalize(b.name || '') === normalizedSlug
    );
  });

  if (isOfficialBranch || isDbBranch) {
    return <BranchTemplatePage />;
  }

  // 3. Otherwise, resolve as Ministry page
  return <MinistryPage />;
}

export default BranchOrMinistryPage;
