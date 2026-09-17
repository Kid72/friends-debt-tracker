import React, { createContext, useContext, useState, useEffect } from 'react';
import az from './az';
import ru from './ru';
import en from './en';

const translations = { az, ru, en };

const I18nContext = createContext();

export function I18nProvider({ children }) {
  // Default language is Azerbaijani (az) as per PRD requirement
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('friends_debt_lang') || 'az';
  });

  useEffect(() => {
    localStorage.setItem('friends_debt_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, params = {}) => {
    const dict = translations[lang] || translations.az;
    let text = dict[key] || translations.az[key] || translations.en[key] || key;
    
    Object.keys(params).forEach((p) => {
      text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
    });
    return text;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
