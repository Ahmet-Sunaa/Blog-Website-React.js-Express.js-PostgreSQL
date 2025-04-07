import React, { useEffect, useState } from "react";
import TeamSection from "../../components/TeamSection";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import "./User.css";

const Teams = () => {

  const [teams, setTeams] = useState([]);

  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [color, setColor] = useState([]);
  const slug = location.pathname.split("/").pop();



  useEffect(() => {

    setLoading(true); 

    Promise.all([
      axios.get(`http://localhost:5000/teams`),
      axios.get(`http://localhost:5000/menu-pages/user/${slug}`)
    ])
    .then(([teamsRes, colorRes]) => {
      setTeams(teamsRes.data);

      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setLoading(false));
  }, [language]);


  const jobTitleTypes = [...new Set(teams.map(person => person.jobtitletype))];
  const enjobTitleTypes = [...new Set(teams.map(person => person.enjobtitletype))];

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
  if (loading) return <p>Yükleniyor...</p>;
  if (!page) return <h2>Sayfa bulunamadı</h2>;
  if (page.status === false) return <h2>Sayfa bulunamadı</h2>;


  return (
    <div style={{display: "flex", justifyContent:"center",backgroundColor:color[0]}}>
      <div className="team-page"style={{backgroundColor:color[1]}}>
        {jobTitleTypes.map((title, index) => (
          <TeamSection
            key={title}
            title={language === 'tr' ? title : enjobTitleTypes[index]}
            members={teams.filter((person) => person.jobtitletype === title)}
            style={{backgroundColor:color[2]}}
          />
        ))}
      </div>
    </div>
  );
};

export default Teams;
