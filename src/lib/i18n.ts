import en from '@/locales/en-US.json';
import fr from '@/locales/fr-FR.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
  lng: localStorage.getItem('hermes-lang') ?? 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  pluralSeparator: '_',
  returnNull: false,
  // Permet d'utiliser _zero même pour les langues sans catégorie "zero"
  compatibilityJSON: 'v4',
});

i18n.on('languageChanged', lng => {
  localStorage.setItem('hermes-lang', lng);
  window.location.reload();
});

export default i18n;
