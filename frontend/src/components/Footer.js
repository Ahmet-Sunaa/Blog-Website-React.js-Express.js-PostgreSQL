import React from "react";
import { useLanguage } from "../context/LanguageContext";
import "../pages/user/User.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Footer = () => {
  const { language } = useLanguage();
  const [footer, setFooter] = useState({
    contactadress: "",
    contacttitle: "",
    contactentitle: "",
    contactphone: "",
    contactemail: "",
    footercolor:"",
    footertextcolor:"",
  });

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/general/footer`)
      .then((response) => {
        setFooter(response.data);
      }).catch(() => {
        console.error("Api Hatası");
      });
  }, []);

  return (
    <footer className="footer-container" style={{backgroundColor: footer.footercolor}}>
      <div className="footer-content">
        {/* Sol Kısım: Adres, Telefon, Mail */}

        <div className="footer-info">
          <h3 style={{color:footer.footertextcolor}}>{language === 'tr' ? footer.contacttitle : footer.contactentitle}</h3>
          {footer.contactadress !== null && footer.contactadress !== "" && (
            <p style={{color:footer.footertextcolor}}><strong>{language === 'tr' ? 'Adres' : ' Adress'}:</strong> {footer.contactadress}</p>
          )}

          {footer.contactphone !== null && footer.contactphone !== "" && (
            <p style={{color:footer.footertextcolor}}><strong>{language === 'tr' ? 'Telefon' : ' Phone'}:</strong>{footer.contactphone}</p>
          )}

          {footer.contactemail !== null && footer.contactemail !== "" && (
            <p style={{color:footer.footertextcolor}}><strong>{language === 'tr' ? 'Email' : ' Email'}:</strong>{footer.contactemail}</p>
          )}
        </div>


      </div>

      {/* Copyright Alanı */}
      <div className="footer-bottom">
        <p>&copy; 2025 Blog Sitesi. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;
