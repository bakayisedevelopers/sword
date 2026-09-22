import React, { useEffect, useState } from 'react';
import { initializeAnalyticsWithConsent } from '../../lib/firebase.js';

const CONSENT_KEY = 'ssmi_cookie_consent_v1';

function readConsent() {
  try {
    return JSON.parse(window.localStorage.getItem(CONSENT_KEY) || 'null');
  } catch {
    return null;
  }
}

function saveConsent(value) {
  window.localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({
      analytics: value,
      decidedAt: new Date().toISOString(),
      version: 1,
    })
  );
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = readConsent();
    if (!consent) {
      setVisible(true);
      return;
    }
    if (consent.analytics === true) {
      initializeAnalyticsWithConsent();
    }
  }, []);

  const acceptAnalytics = () => {
    saveConsent(true);
    initializeAnalyticsWithConsent();
    setVisible(false);
  };

  const rejectAnalytics = () => {
    saveConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-[980px] rounded-[24px] border border-white/20 bg-ff-secondary p-5 text-white shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold">Cookie consent</h2>
            <p className="mt-1 text-sm leading-6 text-white/80">
              We use essential storage for site functionality. With your consent, we may use Firebase
              Analytics cookies to understand website usage and improve ministry content. You can reject
              analytics cookies and still use the website.
            </p>
            <a href="/privacy-policy" className="mt-2 inline-block text-sm font-bold text-brand-gold hover:underline">
              Read our Privacy Policy
            </a>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={rejectAnalytics}
              className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Reject analytics
            </button>
            <button
              type="button"
              onClick={acceptAnalytics}
              className="rounded-full bg-ff-primary px-5 py-2.5 text-sm font-bold text-ff-primary-text transition hover:bg-white/90"
            >
              Accept analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CookieConsent;
