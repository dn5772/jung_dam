'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      onClick={toggleLocale}
      className="btn-language-toggle"
      aria-label={`Switch to ${locale === 'en' ? '한국어' : 'English'}`}
      title={`Switch to ${locale === 'en' ? '한국어' : 'English'}`}
    >
      <i className="bi bi-translate"></i>
      <span className="language-text">{locale === 'en' ? 'KO' : 'EN'}</span>
    </button>
  );
}
