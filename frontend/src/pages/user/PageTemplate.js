import React, { useEffect, useState, useRef } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "react-bootstrap";


const PageTemplate = () => {
  const location = useLocation();
  const slug = location.pathname.split("/").pop();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState([]);
  const [editors, setEditors] = useState([]); // 🔹 useState ile editors oluştur
  const { language } = useLanguage();
  const [search, setSearch] = useState("");
  const params = new URLSearchParams(location.search);
  const filters = params.get('filter');

  // **📌 API'den İçeriği Çekme**

  useEffect(() => {

    axios.get(`${process.env.REACT_APP_API_URL}/menu-pages/user/${slug}`)
      .then((res) => {
        // verilerde bulunan slate editör verilerini parse etme        
        const formattedPage = {
          ...res.data,
          content_data: res.data.content_data ? JSON.parse(res.data.content_data) : [], // JSON parse işlemi yap
          english_content_data: res.data.english_content_data ? JSON.parse(res.data.english_content_data) : []

        };

        setPage(formattedPage);
        formattedPage.content_data.length>=formattedPage.english_content_data.length ? 
          setEditors(formattedPage.content_data.map(() => withHistory(withReact(createEditor())))) : 
          setEditors(formattedPage.english_content_data.map(() => withHistory(withReact(createEditor()))))

        if (formattedPage.filter !== null && filters !== null) {
          setSearch(formattedPage.filter.find(f => f.includes(filters)));
          filter();
        }

      })
      .catch((e) => {
        console.error(e);
        setPage(null)
      }).finally(() => setIsLoading(false));


  }, [slug, language]);

  const highlightRef = useRef(null); // 🎯 İlk bulunan öğeyi takip et

  const filter = () => {
    setTimeout(() => {
      if (highlightRef.current) {
        highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100); // 10ms gecikme ile DOM'un güncellenmesini bekliyoruz
  };

  // **RenderLeaf: Metin Stilini Uygula**
  const renderLeaf = ({ attributes, children, leaf }) => {
    const searchLower = search.toLowerCase(); // Küçük harfe çevir
    let text = children.props.text.text || ""; // Mevcut metni al

    if (search && text.toLowerCase().includes(searchLower)) {
      const parts = text.split(new RegExp(`(${search})`, "gi")); // Arama kelimesine göre böl
      return (
        <span {...attributes}>
          {parts.map((part, i) =>
            part.toLowerCase() === searchLower ? (
              <span key={part + i}
                ref={i === 1 ? highlightRef : null} // 🎯 İlk bulunan kelimeye referans ata
                {...attributes}
                style={{
                  fontWeight: leaf.bold ? "bold" : "normal",
                  fontStyle: leaf.italic ? "italic" : "normal",
                  textDecoration: leaf.underline ? "underline" : "none",
                  color: leaf.color || "black",
                  backgroundColor: "yellow" || "transparent",
                  fontFamily: leaf.fontFamily || "inherit",
                  fontSize: leaf.fontSize || "inherit",
                }}
              >
                {part}
              </span>

            ) : (
              <span key={i}
                {...attributes}
                style={{
                  fontWeight: leaf.bold ? "bold" : "normal",
                  fontStyle: leaf.italic ? "italic" : "normal",
                  textDecoration: leaf.underline ? "underline" : "none",
                  color: leaf.color || "black",
                  backgroundColor: leaf.backgroundColor || "transparent",
                  fontFamily: leaf.fontFamily || "inherit",
                  fontSize: leaf.fontSize || "inherit",
                }}
              >
                {part}
              </span>
            )
          )}
        </span>
      );
    }

    return (
      <span
        {...attributes}
        style={{
          fontWeight: leaf.bold ? "bold" : "normal",
          fontStyle: leaf.italic ? "italic" : "normal",
          textDecoration: leaf.underline ? "underline" : "none",
          color: leaf.color || "black",
          backgroundColor: leaf.backgroundColor || "transparent",
          fontFamily: leaf.fontFamily || "inherit",
          fontSize: leaf.fontSize || "inherit",
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




  if (isLoading) return <h2>Yükleniyor...</h2>;
  if(!page) return <h1>404 Not Found</h1>

  return (
    <div className="page-template" style={{ backgroundColor: page.color[0] }}>
      {page.isfilter === true && (
        <div className="filter-section" style={{ backgroundColor: page.color[1] }} >
          <h3>{language === 'tr' ? 'Filtrele' : 'Filter'}</h3>
          <input
            type="text"
            placeholder={language === 'tr' ? 'Anahtar Kelime Giriniz...' : 'Enter Keyword...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline-secondary" onClick={() => filter()}>
            Ara
          </Button>{" "}

        </div>
      )}

      <div className="page-container" style={{ backgroundColor: page.color[2] }}>
        <div className="mb-2" style={{padding:"0 15%"}}>
          {language === 'tr' ? (
            <>
              {page.content_data.map((item, index) => (
                <div key={`en-${index}`} className="content-item" style={{ backgroundColor: page.color[index + 3] }}>
                  
                  <div key={index}>
                    {/* 🔹 Her içerik için farklı bir editor kullan */}
                    <Slate editor={editors[index]} key={`${language}-${index}-${JSON.stringify(item)}`} initialValue={item}>
                      <Editable
                        readOnly
                        placeholder="Bu sayfada içerik bulunmuyor."
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}

                      />
                    </Slate>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {page.english_content_data.map((item, index) => (
                <div key={`en-${index}`} className="content-item" style={{ backgroundColor: page.color[index + 3] }}>
                  <div key={index}>
                    {/* 🔹 Her içerik için farklı bir editor kullan */}
                    <Slate editor={editors[index]}  initialValue={item}>
                      <Editable
                        readOnly
                        placeholder="Bu sayfada içerik bulunmuyor."
                        renderLeaf={renderLeaf}
                        renderElement={renderElement}

                      />
                    </Slate>
                  </div>
                </div>
              ))}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default PageTemplate;


