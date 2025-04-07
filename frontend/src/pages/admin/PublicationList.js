import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "../admin/Admin.css";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";

const PublicationsList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  const { language } = useLanguage();

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
      fetchpublications();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }

  // verileri çekme işlemi
  const fetchpublications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/publications/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublications(response.data);
      setLoading(false);
    } catch (err) {
      setError("Projeler yüklenirken hata oluştu.");
      localStorage.removeItem('token');
      navigate("/login");
      setLoading(false);
    }
  };

  // yayın silme işlemi
  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm("Bu yayını silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/publications/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPublications(publications.filter((publication) => publication.id !== id));
      alert("Proje başarıyla silindi!");
    } catch (err) {
      setError("Silme işlemi başarısız oldu!");
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
      <div className="blog-container">
        {language === 'tr' && (
          <>
            <h3>Yayınlar</h3>
            <button className="add-btn" onClick={() => navigate("/admin/add-publication")}>
              + Yeni Yayın Ekle
            </button>

            {publications.length === 0 ? (
              <p>Henüz eklenmiş bir proje yok.</p>
            ) : (
              <table >
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Tarih</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.map((publication) => (
                    <tr key={publication.id}>
                      <td>{publication.title}</td>
                      <td>{publication.date}</td>
                      <td>
                        <Link to={`/admin/publications-list/edit-publication/${publication.id}`}>Detay</Link>

                        <button className="delete-btn" onClick={() => handleDeleteProject(publication.id)}>Sil</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {language === 'en' && (
          <>
          <h3>Publications</h3>
          <button className="add-btn" onClick={() => navigate("/admin/add-publication")}>
            + Add New Publication
          </button>

          {publications.length === 0 ? (
            <p>No Added Publication Yet.</p>
          ) : (
            <table className="">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {publications.map((publication) => (
                  <tr key={publication.id}>
                    <td>{publication.entitle}</td>
                    <td>{publication.date}</td>
                    <td>
                      <Link to={`/admin/publications-list/edit-publication/${publication.id}`}>Detay</Link>
                      <button className="delete-btn" onClick={() => handleDeleteProject(publication.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
        )}

      </div>
    </div>
  );
};

export default PublicationsList;
