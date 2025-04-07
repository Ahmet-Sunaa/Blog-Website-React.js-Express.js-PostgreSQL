import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "../admin/Admin.css";
import { useLanguage } from "../../context/LanguageContext";
import { Link } from "react-router-dom";

const ProjectList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [projects, setProjects] = useState([]);
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
      fetchProjects();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }

  //verileri çekme işlemi
  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/projects/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      setError("Projeler yüklenirken hata oluştu.");
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // projeyi silme
  const handleDeleteProject = async (id) => {
    const confirmDelete = window.confirm("Bu projeyi silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/projects/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(projects.filter((project) => project.id !== id));
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
            <h3>Projeler</h3>

            <button className="add-btn" onClick={() => navigate("/admin/add-project")}>
              + Yeni Proje Ekle
            </button>

            {projects.length === 0 ? (
              <p>Henüz eklenmiş bir proje yok.</p>
            ) : (
              <table >
                <thead>
                  <tr>
                    <th>Başlık</th>
                    <th>Tarih</th>
                    <th>Sahibi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.title}</td>
                      <td>{project.date}</td>
                      <td>{project.projectowner}</td>
                      <td>
                      <Link to={`/admin/project-list/edit-project/${project.id}`}>Detay</Link>
                      <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>Sil</button>
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
            <h3>Projects</h3>

            <button className="add-btn" onClick={() => navigate("/admin/add-project")}>
              + Add New Project
            </button>

            {projects.length === 0 ? (
              <p>No Added Project Yet.</p>
            ) : (
              <table >
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.entitle}</td>
                      <td>{project.date}</td>
                      <td>{project.projectowner}</td>
                      <td>
                        <Link to={`/admin/project-list/edit-project/${project.id}`}>Detay</Link>

                        <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>Sil</button>
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

export default ProjectList;
