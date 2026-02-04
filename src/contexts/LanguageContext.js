'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState('ko'); // 기본값 한국어

  useEffect(() => {
    // 로컬 스토리지에서 저장된 언어 설정 불러오기
    const savedLocale = localStorage.getItem('preferredLocale');
    if (savedLocale && ['en', 'ko'].includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      // 저장된 설정이 없으면 브라우저 언어 감지
      const browserLocale = typeof navigator !== 'undefined' && navigator.language
        ? navigator.language.slice(0, 2)
        : 'ko';
      const safeLocale = ['en', 'ko'].includes(browserLocale) ? browserLocale : 'ko';
      setLocale(safeLocale);
    }
  }, []);

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
