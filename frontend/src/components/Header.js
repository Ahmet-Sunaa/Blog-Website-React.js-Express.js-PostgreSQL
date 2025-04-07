import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";

import "../pages/user/User.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [pages, setPages] = useState([]);
  const [header, setHeader] = useState({});
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const menuRef = useRef(null); // ✅ Menüye erişmek için ref
  const { language } = useLanguage();
  const menuRef2 = useRef(null); // ✅ Menüye erişmek için ref

  const navigate = useNavigate();

  //backennden verileri çekme işlemi
  useEffect(() => {
    getMenu();
    fetchUser();
    const handleStorageChange = async () => {
      await fetchUser();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };

  }, []);

  // Sayfanın dışına tıklanınca menüyü kapatma işlemi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && menuRef2.current && !menuRef2.current.contains(event.target)) {
        setMenuOpen(false); // Menü açıkken dışarı tıklanınca kapanır
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

    // Menü verilerini çekme fonksiyonu
  const getMenu = async () => {
    await axios.get("http://localhost:5000/menu-pages")
      .then(res => {
        setPages(res.data);
      }).catch("Hata oluştu");
  }

    // Kullanıcı bilgilerini ve başlık verilerini çekme fonksiyonu
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(JSON.parse(localStorage.getItem("user")));

    } else {
      setUser(null);
    }
    const res = await axios.get("http://localhost:5000/general/header");
    setHeader(res.data);
  };

    // Kullanıcı çıkış yapma fonksiyonu
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };



  return (
    <header className="header" style={{ backgroundColor: header.headercolor1 }}>
      <div className="header-container">
        <h1 className="header-title" >
          <Link to="/" style={{ color: header.headertitlecolor }}>{header.headertitle}</Link>
        </h1>

        {/* Hamburger Menü */}
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)} ref={menuRef2}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menü */}
        <nav key="nav" ref={menuRef} className={`header-nav ${menuOpen ? "open" : ""}`} style={menuOpen ? { backgroundColor: header.headercolor6 } : {}}>
          <ul key="ul" className="nav-list">


            {pages.map((page, indexPages) => (
              <React.Fragment key={page.id}>
                {page.status === true && page.headerstatus===true && (
                  <li key={page.id} className="relative">
                    <a href={page.slug}
                      className="nav-link"
                      key={language === "tr" ? page.title : page.entitle}
                      style={{
                        color: hoveredIcon === (language === "tr" ? page.title : page.entitle) ? header.headercolor3 : header.headercolor2,
                        transition: "color 0.3s ease-in-out"
                      }}
                      onMouseEnter={() => setHoveredIcon(language === "tr" ? page.title : page.entitle)}
                      onMouseLeave={() => setHoveredIcon(null)}>
                      {language === "tr" ? page.title : page.entitle}
                    </a>

                    {/* Eğer alt başlık varsa göster */}
                    {page.filter !== null && (
                      <React.Fragment key={`page-${page.id}`}>
                        {page.filter.length > 0 && page.filter[0] && (

                          <ul style={{ backgroundColor: header.headercolor5 }}>
                            {page.utitle.map((subPage, index) => (
                              <>
                                {page.uactive[index] === true && page.ulanguage[index] === language && (
                                  <li key={page.uid[index]}>
                                    <a href={`${page.slug}?filter=${page.filter[index]}`}
                                      className="block px-4 py-2"
                                      key={subPage}
                                      style={{
                                        color: hoveredIcon === subPage ? header.headercolor3 : header.headercolor4,
                                        transition: "color 0.3s ease-in-out",

                                      }}
                                      onMouseEnter={() => setHoveredIcon(subPage)}
                                      onMouseLeave={() => setHoveredIcon(null)}
                                    >
                                      {subPage}
                                    </a>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>

                        )}
                      </React.Fragment>
                    )}

                  </li>
                )}

              </React.Fragment>

            ))}



            {header && Object.keys(header).length > 0 && (
              <LanguageSwitcher color={header} />
            )}
            {/* Kullanıcı giriş yapmışsa */}
            {user ? (
              <Dropdown >
                <Dropdown.Toggle variant="dark" id="dropdown-basic">
                  {user.name}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/admin")}>Admin Panel</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Çıkış yap</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

            ) : (
              <></>

            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
