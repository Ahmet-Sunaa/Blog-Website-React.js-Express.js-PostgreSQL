import HomePost from "../../components/HomePost"
import Entries from "../../components/Entries";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import "./User.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

const Home = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [color, setColor] = useState([]);
  const [title, setTitle] = useState({
    homeblogstitle: "",
    homeenblogstitle:""
  });
  
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    setIsLoading(true); 
    const pathSlug = location.pathname.split("/").pop() || "home";

    Promise.all([
      axios.get(`${process.env.REACT_APP_API_URL}/posts`),
      axios.get(`${process.env.REACT_APP_API_URL}/menu-pages/user/${pathSlug}`),
      axios.get(`${process.env.REACT_APP_API_URL}/general/home`)

    ])
    .then(([postsRes, colorRes, homeRes]) => {
      if (language === 'tr') setPosts(postsRes.data.slice(0, 6));
      else setPosts(postsRes.data.filter(post => post.entitle).slice(0, 6));
      
      setTitle(homeRes.data);
      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setIsLoading(false));
  }, [language, location.pathname]);

  if (isLoading) return <h1>Yükleniyor...</h1>;

  if (!posts || posts.length === 0) return <h1>Data Yok</h1>;

  return (
    <div className="main-container">
      <Entries color={color[0]}/>
      <h1 className="main-title" style={{backgroundColor: color[1], marginBottom: "0"}}>
        {language==='tr' ? title.homeblogstitle : title.homeenblogstitle}
      </h1>
      <HomePost posts={posts} color={color}/>
    </div>
  );
};

export default Home;
