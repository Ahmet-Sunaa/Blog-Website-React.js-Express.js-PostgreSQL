import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css";
import { useLanguage } from "../../context/LanguageContext";

const EditPublication = () => {
  const { id } = useParams(); // URL'den proje ID'sini al
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Form için state'ler
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState([]);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  const { language } = useLanguage();
  const [enTitle, setEnTitle] = useState("");
  const [enKeywords, setEnKeywords] = useState([]);

  // Yetkilendirme kontrolü
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
      setIsAuthorized(true)
      getItems();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  };

  // yayınları çekme
  const getItems = async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/publications/publications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const publications = res.data[0];
        setTitle(publications.title);
        setDate(publications.date.split("T")[0]); // Tarihi doğru formatta göster
        setKeywords(publications.keywords);
        setLink(publications.link);
        setEnTitle(publications.entitle);
        setEnKeywords(publications.enkeywords);
        setLoading(false);
      })
      .catch(() => {
        setError("Proje bulunamadı!");
        setLoading(false);
        localStorage.removeItem('token');
      });
  }

  //yayın güncelleme
  const handleUpdatepublications = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/publications/update-publications`,
        { id, title, date, keywords, link, enTitle, enKeywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Proje başarıyla güncellendi!");
      navigate("/admin/publications-list"); // Projeler listesine yönlendir
    } catch (err) {
      setError("Güncelleme hatası!");
      localStorage.removeItem('token');
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!isAuthorized) {
    return;
  }
  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="edit-project-container">

        <h3>Projeyi Düzenle</h3>
        <form onSubmit={handleUpdatepublications} className="edit-project-form">

          <label>İçerik:</label>
          <textarea value={title || ""} onChange={(e) => setTitle(e.target.value)} required></textarea>

          <label>Tarih:</label>
          <input type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} required />


          <label>Anahtar Kelimeler:</label>
          <input type="text" value={keywords || ""} onChange={(e) => setKeywords(e.target.value)} required />

          <label>Link:</label>
          <input type="text" value={link || ""} onChange={(e) => setLink(e.target.value)} required />

          {language === 'en' && (
            <>
              <label>Content:</label>
              <textarea value={enTitle || ""} onChange={(e) => setEnTitle(e.target.value)} required></textarea>


              <label>Keywords:</label>
              <input type="text" value={enKeywords || ""} onChange={(e) => setEnKeywords(e.target.value)} required />

            </>
          )}

          <button type="submit">Güncelle</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/publications-list")}>
            İptal
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditPublication;
