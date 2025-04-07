import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../pages/user/User.css";
import axios from "axios";

const LanguageSwitcher = ({ color: initialColor }) => {
    const { language, setLanguage } = useLanguage();
    const [color, setColor] = useState(initialColor);
    const [isLoading, setIsLoading] = useState(!initialColor);

    useEffect(() => {
        if (!initialColor) {
            fetchColor();
        }
    }, [initialColor]); // `initialColor` değişirse tekrar çalışsın


    //renk bilgisini ve yazı bilgisini bakcendden alma işlemi
    const fetchColor = async () => {
        try {
            const response = await axios.get("http://localhost:5000/general/language-switcher");
            setColor(response.data);  // ✅ color state'ini güncelle
        } catch (e) {
            console.error("Hata meydana geldi", e);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <h2>Yükleniyor...</h2>;

    return (
        <button
            className="btn btn-light"
            style={{
                backgroundColor: language === 'tr' ? color?.headercolor7 : color?.headercolor8,
                border: "none"
            }}
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
        >
            {language === 'tr' ? color?.headerlanguagebuttonentext : color?.headerlanguagebuttontext}
        </button>
    );
};

export default LanguageSwitcher;
