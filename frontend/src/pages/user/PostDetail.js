import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import axios from "axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLanguage } from "../../context/LanguageContext";
import "./User.css";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
const PostDetail = () => {
  const [editor] = useState(() => withReact(createEditor()));

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [color, setColor] = useState([]);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      await axios.get(`http://localhost:5000/posts/user/${id}`)
        .then((response) => {
          const page = response.data[0];
          const formattedPages = {
            ...page,
            turkish_content_data: page.turkish_content_data ? JSON.parse(page.turkish_content_data) : [], // JSON parse işlemi yap
            english_content_data: page.english_content_data ? JSON.parse(page.english_content_data) : [], // JSON parse işlemi yap
          }
          setPost(formattedPages);
          
        })
        .catch(() => localStorage.removeItem("token"))
        .finally(setIsLoading(false));
    }
    fetchData();

  }, [id]);

  useEffect(() => {

    setIsLoading(true); 

    Promise.all([
      axios.get(`http://localhost:5000/posts/user/${id}`),
      axios.get("http://localhost:5000/menu-pages/user/blogs")
    ])
    .then(([postRes, colorRes]) => {
      const page = postRes.data[0];
      const formattedPages = {
        ...page,
        turkish_content_data: page.turkish_content_data ? JSON.parse(page.turkish_content_data) : [], // JSON parse işlemi yap
        english_content_data: page.english_content_data ? JSON.parse(page.english_content_data) : [], // JSON parse işlemi yap
      }
      setPost(formattedPages);

      setColor(colorRes.data.color);
    })
    .catch(err => console.error("Error fetching data:", err))
    .finally(() => setIsLoading(false));
  }, [language, id]);

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
  if (isLoading){
    return <h2>Yükleniyor ...</h2>
  }
  return post ? (
    <div style={{backgroundColor: color[3]}}>
    <div className="post-detail-container" style={{backgroundColor: color[4]}}>
      {language === 'en' && (post.enkeywords === null || post.encontent === null || post.entitle === null || post.enkeywords === "" || post.encontent === "" || post.entitle === "") ? (
        <h2>No Project For This Language</h2>
      ) : (
        <div>
          {/* Resim Carousel */}
          {post.img_data.length > 1 && (
            <Slider  {...settingsInner}>
              {post.img_data.map((image, index) => (
                <div key={index}>
                  <img
                    src={`data:image/png;base64,${image}`}
                    alt={`Post ${post.id} - Image ${index + 1}`}
                    className="post-image-detail"
                  />
                </div>
              ))}
            </Slider>
          )}
          {post.img_data.length === 1 && post.img_data[0] !== null && (
            <div>
              <img
                src={`data:image/png;base64,${post.img_data[0]}`}
                alt={post.title}
                className="post-image"
              />
            </div>
          )}
          <div className="post-detail-under-card">
            {/* Post Bilgileri */}
            <Link to={`/post/${post.id}`} className="post-title">
              {language === "tr" ? post.title : post.entitle}
            </Link>
            <p className="post-content">
              {language === "tr" ? post.detail : post.endetail}
            </p>
            {language === "tr" ? (
              <React.Fragment>
                {post.turkish_content_data.map((item, index) => (

                  <div className="content-container" key={`tr-${index}`} style={{backgroundColor: color[5]}}>
                    <div key={index} className="content-item">
                      {/* Metin */}
                      <div>
                        <Slate editor={editor} initialValue={item} >
                          <Editable
                            readOnly
                            placeholder="Bu sayfada içerik bulunmuyor."
                            renderLeaf={renderLeaf} // **renderLeaf fonksiyonunu burada belirt**
                            renderElement={renderElement}
                          />
                        </Slate>

                      </div>
                    </div>
                  </div>
                ))}

              </React.Fragment>
            ) : (
              <React.Fragment>

                {post.english_content_data.map((item, index) => (
                  <div className="content-container" key={`en-${index}`} style={{backgroundColor: color[5]}}>

                    <div key={index} className="content-item">
                      {/* Metin */}
                      <div>
                        <Slate editor={editor} initialValue={item} >
                          <Editable
                            readOnly
                            placeholder="Bu sayfada içerik bulunmuyor."
                            renderLeaf={renderLeaf} // **renderLeaf fonksiyonunu burada belirt**
                            renderElement={renderElement}
                          />
                        </Slate>

                      </div>
                    </div>

                  </div>
                ))}
              </React.Fragment>
            )}




            <div className="author">
              <Link to="/" className="back-link">← Geri Dön</Link>
              <h6 >{post.authorname}</h6>
            </div>
          </div>
        </div>
      )}

</div>
    </div>
  ) : <h2>Post not found!</h2>;
};

export default PostDetail;
