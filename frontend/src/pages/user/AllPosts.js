import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCarousel from "../../components/PostCarousel";
import "./User.css";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from 'react-router-dom';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [color, setColor] = useState([]);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const filters = params.get('filter');
  const [page, setPage] = useState(null);
  const slug = location.pathname.split("/").pop();

  useEffect(() => {
    if (filters !== null) {
      setSelectedDate(filters.match(/\d+/g) === null ? "" : filters.match(/\d+/g)[0]);
      setSearch(filters.match(/[a-zA-Z]+/g) === null ? "" : filters.match(/[a-zA-Z]+/g).map(filter => filter).join(" "));
    }
    setLoading(true); 
    const pathSlug = location.pathname.split("/").pop() || "home";

    Promise.all([
      axios.get("http://localhost:5000/posts"),
      axios.get(`http://localhost:5000/menu-pages/user/${pathSlug}`)
    ])
    .then(([postRes, colorRes]) => {
      if (language === 'tr')
        setPosts(postRes.data);
      else {
        setPosts(postRes.data.filter((post) => post.entitle !== null && post.entitle!==''));
      }
      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setLoading(false));
  }, [language, location.pathname]);
  

  const uniqueYears = [...new Set(posts.map(pub => pub.date.split("-")[0]))];

  const filteredPosts = posts.filter(
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


  if (loading) return <p>Yükleniyor...</p>;
  if (!page) return <h2>Sayfa bulunamadı</h2>;
  if (page.status === false) return <h2>Sayfa bulunamadı</h2>;

  return posts ? (
    <div className="blogs-container" style={{padding:"20px", backgroundColor: color[0]}}>
      <div className="filter-section" style={{height:"200px", width:"100%", backgroundColor: color[1]}}>
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
      
      <div className="posts-container">
        
        {filteredPosts.length > 0 ? (
          <PostCarousel posts={filteredPosts} style={{backgroundColor: color[2]}}/>
        ) : (<p className="no-results" style={{color:"red"}}>{language === 'tr' ? 'Sonuç bulunamadı' : 'No Result'}.</p>)}
      </div>
    </div>
  ) : <h2> 404 Not Found</h2>
};

export default AllPosts;
