'use client';

import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const getInitialLocale = () => {
  if (typeof window === 'undefined') return 'ko';
  try {
    const saved = localStorage.getItem('preferredLocale');
    if (saved && ['en', 'ko'].includes(saved)) return saved;
    const browser = navigator.language?.slice(0, 2);
    return ['en', 'ko'].includes(browser) ? browser : 'ko';
  } catch {
    return 'ko';
  }
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(getInitialLocale);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'ko' : 'en';
    setLocale(newLocale);
    localStorage.setItem('preferredLocale', newLocale);
  };

  const setLanguage = (newLocale) => {
    if (['en', 'ko'].includes(newLocale)) {
      setLocale(newLocale);
      localStorage.setItem('preferredLocale', newLocale);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
