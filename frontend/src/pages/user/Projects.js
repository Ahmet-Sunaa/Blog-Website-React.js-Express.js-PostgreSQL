import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from 'react-router-dom';
import "./User.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [color, setColor] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filters = params.get('filter');
  const slug = location.pathname.split("/").pop(); 
  const [page, setPage] = useState(null);

  useEffect(() => {
    if (filters !== null) {
      setSelectedDate(filters.match(/\d+/g) === null ? "" : filters.match(/\d+/g)[0]);
      setSearch(filters.match(/[a-zA-Z]+/g) === null ? "" : filters.match(/[a-zA-Z]+/g).map(filter => filter).join(" "));
    }
    setLoading(true); 
    const pathSlug = location.pathname.split("/").pop() || "home";

    Promise.all([
      axios.get("http://localhost:5000/projects"),
      axios.get(`http://localhost:5000/menu-pages/user/${pathSlug}`)
    ])
    .then(([projectsRes, colorRes]) => {
      if (projectsRes.data.length === 0) {
        setError("Proje yok.");
      } else {
        setProjects(projectsRes.data);
      }
      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setLoading(false));
  }, [language, location.pathname, filters]);
  

  const uniqueYears = [...new Set(projects.map(pub => pub.date.split("-")[0]))];

  const filteredProject = projects.filter(
    (pub) =>
      (selectedDate === "" || pub.date.split("-")[0] === selectedDate) &&
      (search === "" || language === 'tr' ? pub.keywords.toLowerCase().includes(search.toLowerCase()) : pub.enkeywords !== null ? pub.enkeywords.toLowerCase().includes(search.toLowerCase()) : '')


  );

  useEffect(() => {
    axios.get(`http://localhost:5000/menu-pages/user/${slug}`)
        .then((res) => {
            const formattedPage = {
                ...res.data,
                content_data: res.data.content_data ? JSON.parse(res.data.content_data) : [] // JSON parse işlemi yap
            };
            setPage(formattedPage)
            
        })
        .catch(() => {
            setPage(null)
        });
}, [slug]);

  if (!page) return <h2>Sayfa bulunamadı</h2>;
  if (page.status === false) return <h2>Sayfa bulunamadı</h2>;
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <h2 className="error">{error}</h2>;

  return (
    <div style={{display: "flex"}}>
      <div style={{padding:"20px", width:"20%",backgroundColor: color[1]}}>
      <div className="filter-section" style={{width: "100%", backgroundColor: color[0]}}>
        <h3>{language === 'tr' ? 'Filtrele' : 'Filter'}</h3>
        <input
          type="text"
          placeholder={language === 'tr' ? 'Anahtar Kelime Giriniz...' : 'Enter Keyword...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select key='select-box' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option key='default' value="">{language === 'tr' ? 'Tarih Seç' : 'Choose a Date'}</option>
          {uniqueYears.map((year, index) => (
            <option key={`year-${index}`} value={year}>{year}</option>
          ))}
        </select>

      </div>
      </div>
      
    <div className="projects-container" style={{backgroundColor: color[1]}}>
      
      {filteredProject.length > 0 ? (
        <>
          {language === 'tr' && (

              <div className="projects-grid">
                {filteredProject.map((project) => (
                  <div
                    className="project-card"
                    key={project.id}
                    onClick={() => navigate(`/projects/project-detail/${project.id}`, { state: { project } })} // ✅ Seçilen projeyi state içinde gönderiyoruz.
                    style={{ cursor: "pointer", backgroundColor: color[2]}}
                  >
                    <h3>{project.title}</h3>
                    <p className="date">{new Date(project.date).toLocaleDateString()}</p>
                    <p className="content">{project.content.substring(0, 100)}...</p>
                    <p className="owner">Sahibi: {project.projectowner}</p>
                    <p className="keywords"># {project.keywords}</p>
                  </div>
                ))}
              </div>
          )}
          {language === 'en' && (

              <div className="projects-grid">
                {filteredProject.map((project) => (
                  <>
                    {project.encontent !== null && project.entitle !== null && project.enkeywords !== null && project.encontent !== "" && project.entitle !== "" && project.enkeywords !== "" && (
                      <>
                        <div
                          className="project-card"
                          key={project.id}
                          onClick={() => navigate(`/projects/project-detail/${project.id}`, { state: { project } })} // ✅ Seçilen projeyi state içinde gönderiyoruz.
                          style={{ cursor: "pointer" }}
                        >
                          <h3>{project.entitle}</h3>
                          <p className="date">{new Date(project.date).toLocaleDateString()}</p>
                          <p className="content">{project.encontent.substring(0, 100)}...</p>
                          <p className="owner">Owner: {project.projectowner}</p>
                          <p className="keywords"># {project.enkeywords}</p>
                        </div>
                      </>
                    )}

                  </>))}
              </div>

          )}

        </>
      ) : (<p className="no-results">{language === 'tr' ? 'Sonuç bulunamadı' : 'No Result'}.</p>)}
</div>
    </div>
  );
};

export default Projects;
