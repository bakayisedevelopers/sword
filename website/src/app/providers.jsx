import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * App state context translating FFAppState from:
 * flutter-website/lib/app_state.dart
 */
const AppStateContext = createContext(null);

export function AppProviders({ children }) {
  // Confirmed FFAppState fields
  const [selectedLocation, setSelectedLocation] = useState('Online');
  const [signUpMinistry, setSignUpMinistry] = useState('');
  const [requestType, setRequestType] = useState('');
  const [FEWDS, setFEWDS] = useState('');
  const [signUpBranch, setSignUpBranch] = useState('');
  const [addKids, setAddKids] = useState(false);
  const [requestBranch, setRequestBranch] = useState('');
  const [contactBranch, setContactBranch] = useState('');
  const [hideSocials, setHideSocials] = useState(false);
  const [registerBranch, setRegisterBranch] = useState('');

  // Mobile navigation drawer state (disabled overlay; autoscrolls to footer per user request)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const scrollToFooter = useCallback(() => {
    setIsDrawerOpen(false);
    const footer = document.getElementById('site-footer') || document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  const openDrawer = useCallback(() => scrollToFooter(), [scrollToFooter]);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => scrollToFooter(), [scrollToFooter]);

  const value = {
    // App State
    selectedLocation,
    setSelectedLocation,
    signUpMinistry,
    setSignUpMinistry,
    requestType,
    setRequestType,
    FEWDS,
    setFEWDS,
    signUpBranch,
    setSignUpBranch,
    addKids,
    setAddKids,
    requestBranch,
    setRequestBranch,
    contactBranch,
    setContactBranch,
    hideSocials,
    setHideSocials,
    registerBranch,
    setRegisterBranch,

    // UI Drawer state
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProviders');
  }
  return context;
}

export default AppProviders;
