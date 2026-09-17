import React from 'react';
import { SiteHeader } from './SiteHeader.jsx';
import { SiteFooter } from './SiteFooter.jsx';
import { MobileDrawer } from './MobileDrawer.jsx';

/**
 * Standard page shell wrapping site header, page content, site footer, and mobile drawer.
 */
export function PageShell({ children, className = '' }) {
  return (
    <div className="min-h-screen flex flex-col bg-ff-secondary-bg text-ff-primary-text">
      {/* Global Header */}
      <SiteHeader />

      {/* Main Content Area */}
      <main className={`flex-1 w-full ${className}`}>
        {children}
      </main>

      {/* Global Footer */}
      <SiteFooter />

      {/* Global Mobile Drawer Overlay */}
      <MobileDrawer />
    </div>
  );
}

export default PageShell;
