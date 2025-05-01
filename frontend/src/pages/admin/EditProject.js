import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css";
import { useLanguage } from "../../context/LanguageContext";
const EditProject = () => {
  const { id } = useParams(); // URL'den proje ID'sini al
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Form için state'ler
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [projectOwner, setProjectOwner] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  const { language } = useLanguage();
  const [enTitle, setEnTitle] = useState("");
  const [enContent, setEnContent] = useState("");
  const [enKeywords, setEnKeywords] = useState("");

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

  //verileri çekme
  const getItems = async () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/projects/proje/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const project = res.data[0];
        setTitle(project.title);
        setContent(project.content);
        setDate(project.date.split("T")[0]); // Tarihi doğru formatta göster
        setProjectOwner(project.projectowner);
        setKeywords(project.keywords);
        setEnTitle(project.entitle);
        setEnContent(project.encontent);
        setEnKeywords(project.enkeywords);

        setLoading(false);
      })
      .catch(() => {
        setError("Proje bulunamadı!");
        setLoading(false);
        localStorage.removeItem('token');
      });
  }

  // projeyi güncelleme
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/projects/update-project`,
        { id, title, content, date, projectOwner, keywords, enTitle, enContent, enKeywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Proje başarıyla güncellendi!");
      navigate("/admin/project-list"); // Projeler listesine yönlendir
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
        {language === 'tr' && (
          <>
            <h3>Projeyi Düzenle</h3>
            <form onSubmit={handleUpdateProject} className="edit-project-form">
              <label>Başlık:</label>
              <input type="text" value={title || ""} onChange={(e) => setTitle(e.target.value)} required />

              <label>İçerik:</label>
              <textarea value={content || ""} onChange={(e) => setContent(e.target.value)} required></textarea>

              <label>Tarih:</label>
              <input type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} required />

              <label>Proje Sahibi:</label>
              <input type="text" value={projectOwner || ""} onChange={(e) => setProjectOwner(e.target.value)} required />

              <label>Anahtar Kelimeler:</label>
              <input type="text" value={keywords || ""} onChange={(e) => setKeywords(e.target.value)} required />

              <button type="submit">Güncelle</button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/admin/project-list")}>
                İptal
              </button>
            </form>
          </>
        )}
        {language === 'en' && (
          <>
            <h3>Edit Project</h3>
            <form onSubmit={handleUpdateProject} className="edit-project-form">
              <label>Turkish Title:</label>
              <input type="text" value={title || ""} onChange={(e) => setTitle(e.target.value)} required />

              <label>Turkish Content:</label>
              <textarea value={content || ""} onChange={(e) => setContent(e.target.value)} required></textarea>

              <label>Date:</label>
              <input type="date" value={date || ""} onChange={(e) => setDate(e.target.value)} required />

              <label>Project Owner:</label>
              <input type="text" value={projectOwner || ""} onChange={(e) => setProjectOwner(e.target.value)} required />

              <label>Turkish Keywords:</label>
              <input type="text" value={keywords || ""} onChange={(e) => setKeywords(e.target.value)} required />

              <label>Title:</label>
              <input type="text" value={enTitle || ""} onChange={(e) => setEnTitle(e.target.value)} />

              <label>Content:</label>
              <textarea value={enContent || ""} onChange={(e) => setEnContent(e.target.value)} ></textarea>

              <label>Keywords:</label>
              <input type="text" value={enKeywords || ""} onChange={(e) => setEnKeywords(e.target.value)} />

              <button type="submit">Edit</button>
              <button type="button" className="cancel-btn" onClick={() => navigate("/admin/project-list")}>
                Cancel
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditProject;
