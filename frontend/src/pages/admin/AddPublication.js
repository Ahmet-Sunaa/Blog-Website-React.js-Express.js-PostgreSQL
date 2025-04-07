import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css"
import { useLanguage } from "../../context/LanguageContext";

const AddPublication = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // YYYY-MM-DD formatında tarih
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [keywords, setKeywords] = useState([]);
  const [link, setLink] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  const { language } = useLanguage();
  const [enTitle, setEnTitle] = useState("");
  const [enKeywords, setEnKeywords] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // role kontrolü
  useEffect(() => {
    if (token) {
      checkAuthorization();

    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }, [token]);



  const checkAuthorization = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin") {
      setIsAuthorized(true);
      setIsLoading(false);
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  };

  // kaydetme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Yayını ekle
      const response = await axios.post(
        "http://localhost:5000/publications/", // API'yi doğru URL'ye yönlendiriyoruz
        { title, date, keywords, link, enTitle, enKeywords }, // Verileri gönder
        { headers: { Authorization: `Bearer ${token}` } } // Headers'ı ekliyoruz
      );

      alert(response.data.message);
      navigate("/admin/publications-list");

    } catch (error) {
      setError("Post eklenirken hata oluştu!");
      localStorage.removeItem('token');

    } finally {
      setIsLoading(false);
    }
  };




  if (!isAuthorized) {
    return;
  }
  if (isLoading) {
    return <p>Yükleniyor...</p>; // Sayfa yüklenirken göster
  }

  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="add-post-container">
        <h2 style={{ marginLeft: '25%', marginRight: '25%' }}>Yeni Proje Ekle</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form className="add-post-form" onSubmit={handleSubmit}>
          <label>İçerik:</label>

          <textarea
            placeholder="İçerik"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          ></textarea>
          <label>Tarih:</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <label>Anahtar Kelimeler:</label>
          <input
            type="text"
            placeholder="Anahtar kelime"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />
          <label>Link:</label>
          <input
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
          {language === 'en' && (
            <>
              <label>Content:</label>
              <textarea
                placeholder="Content"
                value={enTitle}
                onChange={(e) => setEnTitle(e.target.value)}
              ></textarea>

              <label>Keywords:</label>

              <input
                type="text"
                placeholder="Keywords"
                value={enKeywords}
                onChange={(e) => setEnKeywords(e.target.value)}
              />
            </>
          )}

          <button type="submit" disabled={isLoading}>
            {language === 'tr' ? "Ekle" : "Upload"}
          </button>
        </form>
      </div>



    </div>

  );
};

export default AddPublication;
