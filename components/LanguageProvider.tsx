"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "es" | "ca";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem("novaweb_lang") as Language;
    if (savedLang && (savedLang === "es" || savedLang === "ca")) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("novaweb_lang", lang);
  };

  // Prevent hydration mismatch by rendering children only after mount, 
  // or just render with default 'es' and let it update.
  // Actually, to avoid hydration mismatch, we can just render children.
  // The text might flash from ES to CA if CA is saved, but that's okay for a simple implementation.
  // Or we can hide until mounted if we want to be strict.
  // Let's just render it.

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
