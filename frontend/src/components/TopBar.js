import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaBook ,
  FaGithub, FaBehance, FaGoogle, FaPinterest, FaResearchgate, FaGraduationCap
} from "react-icons/fa";

import "../pages/user/User.css";

const Topbar = () => {
  const [socialLinks, setSocialLinks] = useState({});
  const [color, setColor] = useState({});
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const socialRes = await axios.get(`${process.env.REACT_APP_API_URL}/social-media/public`);
        const colorRes = await axios.get(`${process.env.REACT_APP_API_URL}/general/topbar`);
        
        setSocialLinks(socialRes.data);
        setColor(colorRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return;

  const socialMedia = [
    { name: "facebook", url: socialLinks.facebook, icon: <FaFacebook /> },
    { name: "instagram", url: socialLinks.instagram, icon: <FaInstagram /> },
    { name: "twitter", url: socialLinks.x, icon: <FaTwitter /> },
    { name: "youtube", url: socialLinks.youtube, icon: <FaYoutube /> },
    { name: "linkedin", url: socialLinks.linkedin, icon: <FaLinkedin /> },
    { name: "github", url: socialLinks.github, icon: <FaGithub /> },
    { name: "behance", url: socialLinks.behance, icon: <FaBehance /> },
    { name: "google", url: socialLinks.google, icon: <FaGoogle /> },
    { name: "pinterest", url: socialLinks.pinterest, icon: <FaPinterest /> },
    { name: "researchgate", url: socialLinks.researchgate, icon: <FaResearchgate /> },
    { name: "googleScholar", url: socialLinks.googlescholar, icon: <FaBook /> }
  ];

  return (
    <div className="topbar" style={{ backgroundColor: color.topbarcolor1 }}>
      <div className="topbar-container">
        <div className="social-icons">
          {socialMedia.map(({ name, url, icon }) =>
            url ? (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: hoveredIcon === name ? color.topbarcolor3 : color.topbarcolor2,
                  transition: "color 0.3s ease-in-out"
                }}
                onMouseEnter={() => setHoveredIcon(name)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {icon}
              </a>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
