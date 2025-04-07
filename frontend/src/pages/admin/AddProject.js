import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css"
import { useLanguage } from "../../context/LanguageContext";

const AddProject = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // YYYY-MM-DD formatında tarih
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [projectOwner, setProjectOwner] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  const { language } = useLanguage();
  const [enTitle, setEnTitle] = useState("");
  const [enContent, setEnContent] = useState("");
  const [enKeywords, setEnKeywords] = useState([]);

  // yetki kontrol işlemi
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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

  // yeni proje ekleme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Post'u ekle
      const response = await axios.post(
        "http://localhost:5000/projects/", // API'yi doğru URL'ye yönlendiriyoruz
        { title, content, date, projectOwner, keywords }, // Verileri gönder
        { headers: { Authorization: `Bearer ${token}` } } // Headers'ı ekliyoruz
      );

      alert(response.data.message);
      navigate("/admin/project-list");

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

          <label>{language==='tr'? 'Başlık':'Turkish Title'}:</label>
          <input
            type="text"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>{language==='tr'? 'İçerik':'Turkish Content'}:</label>
          <textarea
            placeholder="İçerik"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>

          <label>{language==='tr'? 'Tarih Seç':'Choose Date'}:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <label>{language==='tr'? 'Proje Sahibi':'Project Owner'}:</label>
          <input
            type="text"
            placeholder="Proje Sahibi"
            value={projectOwner}
            onChange={(e) => setProjectOwner(e.target.value)}
            required
          />

          <label>{language==='tr'? 'Anahtar Kelime':'Turkish Keyword'}:</label>
          <input
            type="text"
            placeholder="Anahtar kelime"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            required
          />

          {language === 'en' && (
            <>

              <label>Title:</label>
              <input
                type="text"
                placeholder="Title"
                value={enTitle}
                onChange={(e) => setEnTitle(e.target.value)}
              />

              <label>Content:</label>
              <textarea
                placeholder="Content"
                value={enContent}
                onChange={(e) => setEnContent(e.target.value)}
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
            {language==='tr'? 'Ekle':'Add Project'}
          </button>
        </form>
      </div>



    </div>

  );
};

export default AddProject;
