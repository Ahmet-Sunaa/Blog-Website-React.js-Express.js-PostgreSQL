import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./User.css";
import { useLanguage } from "../../context/LanguageContext";

const ProjectDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project;
  const { language } = useLanguage();

  if (!project) return <h2 className="error">Proje bulunamadı.</h2>;
  if (language==='en' && (project.enkeywords === null || project.encontent === null || project.entitle === null || project.enkeywords === "" || project.encontent === "" || project.entitle === "")) return <h2>No Project For This Language</h2>
  return ( 
    <div className="project-detail-container">
      {language === 'tr' && (
        <div className="project-card">
        <h1 className="project-title">{project.title}</h1>
        <p className="project-date">📅 {new Date(project.date).toLocaleDateString()}</p>
        <p className="project-content">{project.content}</p>
        <p className="project-owner">👤 Sahibi: <strong>{project.projectowner}</strong></p>
        <p className="project-keywords">🔑 Anahtar Kelimeler: <em>{project.keywords}</em></p>
        <button onClick={() => navigate(-1)} className="back-button">🔙 Geri Dön</button>
      </div>
      )}
      {language === 'en' && (
        <div className="project-card">
        <h1 className="project-title">{project.entitle}</h1>
        <p className="project-date">📅 {new Date(project.date).toLocaleDateString()}</p>
        <p className="project-content">{project.encontent}</p>
        <p className="project-owner">👤 Owner: <strong>{project.projectowner}</strong></p>
        <p className="project-keywords">🔑 Keywords: <em>{project.enkeywords}</em></p>
        <button onClick={() => navigate(-1)} className="back-button">🔙 Back</button>
      </div>
      )}
    </div>
  );
};

export default ProjectDetail;
