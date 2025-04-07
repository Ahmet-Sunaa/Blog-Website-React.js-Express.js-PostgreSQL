import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLanguage } from "../../context/LanguageContext";
import "./User.css";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { useLocation } from "react-router-dom";

const AboutUs = () => {
  const [about, setAbout] = useState(null);
  const [color, setColor] = useState([]);
  const { language } = useLanguage();
  const [editor] = useState(() => withReact(createEditor()));
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true); 
    const pathSlug = location.pathname.split("/").pop() || "home";

    Promise.all([
      axios.get("http://localhost:5000/about-us"),
      axios.get(`http://localhost:5000/menu-pages/user/${pathSlug}`)
    ])
    .then(([aboutRes, colorRes]) => {
      const page = aboutRes.data;
        console.log(aboutRes.data);
        const formattedPages = {
          ...page,
          content: typeof page.content === "string" ? JSON.parse(page.content) : page.content || [],
          encontent: typeof page.encontent === "string" ? JSON.parse(page.encontent) : page.encontent || [],
        };
        setAbout(formattedPages); // Direkt olarak API'den gelen veriyi set ediyoruz

      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setIsLoading(false));
  }, [language, location.pathname]);

  useEffect(() => {
    if (about) {
      const newContent = language === "tr" ? about.content : about.encontent;
      editor.children = Array.isArray(newContent) ? newContent : [newContent];
      editor.onChange(); // Slate'e güncellendiğini bildir
    }
  }, [about, language]);

  
  const settingsInner = {
    dots: true,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  const renderLeaf = ({ attributes, children, leaf }) => {
    return (
      <span
        {...attributes}
        style={{
          fontWeight: leaf.bold ? "bold" : "normal",
          fontStyle: leaf.italic ? "italic" : "normal",
          textDecoration: leaf.underline ? "underline" : "none",
          color: leaf.color || "black", // **Metin Rengi**
          backgroundColor: leaf.backgroundColor || "transparent", // **Arka Plan Rengi**
          fontFamily: leaf.fontFamily || "inherit", // **Yazı Tipi**
          fontSize: leaf.fontSize || "inherit", // **Yazı Boyutu**
        }}
      >
        {children}
      </span>
    );
  };

  // **RenderElement: Blokları Uygula**
  const renderElement = ({ attributes, children, element }) => {
    const style = {
      textAlign: element.align || "left",
      color: element.color || "inherit",
      backgroundColor: element.backgroundColor || "transparent",
      fontSize: element.fontSize || "inherit",
      fontFamily: element.fontFamily || "inherit",
    };

    switch (element.type) {
      case "link":
        return (
          <a
            {...attributes}
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            {children}
          </a>
        );
      case "heading-one":
        return <h1 {...attributes} style={style}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes} style={style}>{children}</h2>;
      case "heading-three":
        return <h3 {...attributes} style={style}>{children}</h3>;
      case "blockquote":
        return (
          <blockquote {...attributes} style={{ ...style, borderLeft: "4px solid gray", paddingLeft: "10px" }}>
            {children}
          </blockquote>
        );
      case "bulleted-list":
        return (
          <ul {...attributes} style={{ ...style, listStyleType: "disc", paddingLeft: "20px" }}>
            {children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ul>
        );
      case "numbered-list":
        return (
          <ol {...attributes}>
            {children.map((child, index) => (
              <li key={index}>{child}</li>
            ))}
          </ol>
        );
      case "code":
        return (
          <pre {...attributes} style={{
            ...style,
            background: "#2e2e2e",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "5px",
            fontFamily: "monospace"
          }}>
            {children}
          </pre>
        );
      case "image":
        return (
          <div {...attributes} contentEditable={false} style={{ textAlign: "center" }}>
            <img
              src={element.url}
              alt="User Uploaded"
              style={{ maxWidth: "99%", height: "auto", borderRadius: "5px" }}
            />
          </div>
        );
      default:
        return <p {...attributes} style={style}>{children}</p>;
    }
  };
  if (isLoading || !about){
    return <h2>Yükleniyor ...</h2>
  }
  return about ? (
    <div style={{backgroundColor: color[0]}}>
    <div className="about-container" style={{backgroundColor: color[1]}}>
      {language === 'tr' && (
        <>
          {/* Resim Carousel */}
          {about.images.length > 1 && (
            <Slider style={{ posisiton: 'static !important' }} {...settingsInner}>
              {about.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={`Post ${about.id} - Image ${index + 1}`}
                    className="post-image-detail"
                  />
                </div>
              ))}
            </Slider>
          )}
          {about.images.length === 1 && about.images[0] !== null && (
            <div>
              <img
                src={`data:image/png;base64,${about.images[0]}`}
                alt={about.title}
                className="post-image"
              />
            </div>
          )}
          <h1 className="about-title" >{about.title}</h1>
          
            <div key={`tr-1`} className="content-item" style={{backgroundColor: color[2]}}>
              {/* Metin */}
              <div>
                <Slate editor={editor} initialValue={Array.isArray(about.content) ? about.content : [about.content]} >
                  <Editable
                    readOnly
                    placeholder=""
                    renderLeaf={renderLeaf} // **renderLeaf fonksiyonunu burada belirt**
                    renderElement={renderElement}
                  />
                </Slate>

              </div>
            </div>
          
          <div className="author">
            <Link to="/" className="back-link">← Geri Dön</Link>
          </div>
        </>
      )}
      {language === 'en' && about.entitle !== '' && about.encontent !== '[]' && about.entitle !== null && about.encontent !== null && (
        <>
          {/* Resim Carousel */}
          {about.images.length > 1 && (
            <Slider style={{ posisiton: 'static !important' }} {...settingsInner}>
              {about.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={`Post ${about.id} - Image ${index + 1}`}
                    className="post-image-detail"
                  />
                </div>
              ))}
            </Slider>
          )}
          {about.images.length === 1 && about.images[0] !== null && (
            <div>
              <img
                src={`data:image/png;base64,${about.images[0]}`}
                alt={about.title}
                className="post-image"
              />
            </div>
          )}
          <h1 className="about-title">{about.entitle}</h1>
            <div key={`en-1`} className="content-item" style={{backgroundColor: color[2]}}>
              {/* Metin */}
              <div>
                <Slate editor={editor} initialValue={Array.isArray(about.encontent) ? about.encontent : [about.encontent]} >
                  <Editable
                    readOnly
                    placeholder=""
                    renderLeaf={renderLeaf} // **renderLeaf fonksiyonunu burada belirt**
                    renderElement={renderElement}
                  />
                </Slate>

              </div>
            </div>
          <div className="author">
            <Link to="/" className="back-link">← Back</Link>
          </div>
        </>
      )}

    </div>
    </div>
  ) : <h2>Post not found!</h2>;
}


export default AboutUs;