import { createContext, useState, useEffect, useContext } from "react";

// 1️⃣ Context oluştur
const LanguageContext = createContext();
// dil değiştirme butonu için gerekli işlevler
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'tr');

    useEffect(() => {
        localStorage.setItem('language', language); // Dil değiştikçe localStorage güncellenir
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

// 2️⃣ Hook oluştur (Kolay kullanım için)
export const useLanguage = () => useContext(LanguageContext);
