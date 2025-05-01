import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminLeftBar from '../../components/adminComponent/AdminLeftBar';
import { useLanguage } from "../../context/LanguageContext";
import TextEditor from '../../components/adminComponent/TextEditor';

const AboutEdit = () => {
  const [aboutId, setAboutId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [enTitle, setEnTitle] = useState('');
  const [enContent, setEnContent] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Selected image for zoom
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [newImages, setNewImages] = useState([]);
  const { language } = useLanguage();

  // yetkilendirme kontrolü
  useEffect(() => {
    if (token) {
      checkAuthorization();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }, [token]);

  // Verileri kaydetme fonksiyonu
  const handleSave = (e) => {
    const jsonContent = JSON.stringify(content);
    const jsonEnContent = JSON.stringify(enContent);
    console.log(jsonContent)
    console.log(jsonEnContent)
    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/about-us`,
      { title, jsonContent, enTitle, jsonEnContent },
      {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setMessage('Başarıyla güncellendi!'))
      .catch(() => {
        setMessage('Hata oluştu!')
        localStorage.removeItem('token');
      });
  };

  //silme fonksiyonu
  const handleDelete = (imageId) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/about-us/images`,
      {
        data: { imageId },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setImages(images.filter(img => img.id !== imageId)))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => navigate("/admin/about-edit"));
  };

  // güncelleme fonksiyonu
  const handleUpload = () => {
    const formData = new FormData(); //resim için formdata türünde veri oluşturma
    newImages.forEach(file => formData.append('images', file));
    formData.append("aboutId", aboutId);

    axios.post(`${process.env.REACT_APP_API_URL}/about-us/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        setMessage('Resimler başarıyla yüklendi!');
        getItems();
      })
      .catch(() => {
        setMessage('Resim yükleme hatası!')
        localStorage.removeItem('token');
      });
  };

  const handleNewImageUpload = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const checkAuthorization = async () => {

    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin" || user.role === "administrator") {
      setIsAuthorized(true)
      getItems();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }


  };

  // verileri backendden çekme
  const getItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/about-us/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setAboutId(res.data.id);
      setTitle(res.data.title);
      setEnTitle(res.data.entitle);
      setImages(res.data.images.map((img, index) => ({
        id: res.data.img_id[index],
        src: `data:image/png;base64,${img}`
      })));
  
      let parsedContent=[], enParsedContent=[];
  
      // Eğer content bir string ise JSON.parse et, değilse direkt ata
      if (typeof res.data.content === "string") {
            try {
                parsedContent = JSON.parse(res.data.content);

                // Eğer parse edilen veri bir array değilse, array içine al
                if (!Array.isArray(parsedContent)) {
                    parsedContent = [parsedContent];
                }
            } catch (error) {
                console.error("JSON parse hatası:", error);
                parsedContent = []; // Hata olursa boş bir array döndür
            }
        }
        // Eğer content_data zaten bir array ise direkt ata
        else if (Array.isArray(res.data.content)) {
            parsedContent = res.data.content;
        }
        // Eğer content_data bir obje ise array içine al
        else if (typeof res.data.content === "object") {
            parsedContent = [res.data.content];
        }

        if (typeof res.data.encontent === "string") {
            try {
                enParsedContent = JSON.parse(res.data.encontent);

                // Eğer parse edilen veri bir array değilse, array içine al
                if (!Array.isArray(enParsedContent)) {
                    enParsedContent = [enParsedContent];
                }
            } catch (error) {
                console.error("JSON parse hatası:", error);
                enParsedContent = []; // Hata olursa boş bir array döndür
            }
        }
        // Eğer content_data zaten bir array ise direkt ata
        else if (Array.isArray(res.data.encontent)) {
            enParsedContent = res.data.encontent;
        }
        // Eğer content_data bir obje ise array içine al
        else if (typeof res.data.encontent === "object") {
            enParsedContent = [res.data.encontent];
        }

      console.log(parsedContent)
      console.log(enParsedContent)
      
      setContent(parsedContent);
      setEnContent(enParsedContent);
      
    } catch (err) {
      console.error("API Error:", err);
      localStorage.removeItem('token');
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };
  
  // editör içerik kaydetme
  const editorContentSaveTr = async (editorContent) => {
    if (!editorContent || editorContent.length === 0) return;
    setContent(editorContent); // Direkt set et
    console.log(editorContent);
  };

  const editorContentSaveEn = async (editorContent) => {
    if (!editorContent || editorContent.length === 0) return;
    setEnContent(editorContent);
  };

  if (!isAuthorized) {
    navigate("/login");
    return;
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="about-container">
        {language === 'tr' && (
          <>
            <h2>Hakkında Sayfasını Düzenle</h2>
            <form onSubmit={handleSave} className="edit-form">
              <label>Başlık:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

              <label>İçerik:</label>
              {/* <textarea value={content} onChange={(e) => setContent(e.target.value)} rows="10" /> */}
              
                <TextEditor
                value={Array.isArray(content) ? content : [{ type: "paragraph", children: [{ text: "" }] }]}
                onSave={editorContentSaveTr}
              />
              
              
              <button type="submit">Kaydet</button>
              {message && <p>{message}</p>}

              <h3>Mevcut Resimler</h3>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {images.length > 0 ? (
                  images.map((img) => (
                    <div key={img.id} style={{ margin: "10px", textAlign: "center" }}>
                      <img
                        src={img.src}
                        alt={`Resim ${img.id}`}
                        width="150"
                        style={{ cursor: "pointer", marginBottom: "10px" }}
                        onClick={() => setSelectedImage(img.src)} // Set selected image on click
                      />
                      <br />
                      <button onClick={() => handleDelete(img.id)}>Sil</button>
                    </div>
                  ))
                ) : (
                  <p>Henüz resim eklenmedi.</p>
                )}
              </div>

              <h3>Yeni Resim Yükle</h3>
              <div>
                <input type="file" accept="image/*" multiple onChange={handleNewImageUpload} />
                <button style={{ marginLeft: "10px" }} onClick={handleUpload}>Resim Yükle</button>
              </div>
            </form>


          </>
        )}
        {language === 'en' && (
          <>
            <h2>edit About Us</h2>
            <form onSubmit={handleSave} className="edit-form">
              <label>Turkish Title:</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

              <label>Turkish Content:</label>

              <label>Title:</label>
              <input type="text" value={enTitle} onChange={(e) => setEnTitle(e.target.value)} />

              <label>Content:</label>
              {/* <textarea value={enContent} onChange={(e) => setEnContent(e.target.value)} rows="10" /> */}
              <TextEditor
                value={Array.isArray(enContent) ? enContent : [{ type: "paragraph", children: [{ text: "" }] }]}
                onSave={editorContentSaveEn}
              />
              <button type="submit">Submit</button>
              {message && <p>{message}</p>}

              <h3>Available Images</h3>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {images.length > 0 ? (
                  images.map((img) => (
                    <div key={img.id} style={{ margin: "10px", textAlign: "center" }}>
                      <img
                        src={img.src}
                        alt={`Resim ${img.id}`}
                        width="150"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedImage(img.src)} // Set selected image on click
                      />
                      <br />
                      <button onClick={() => handleDelete(img.id)}>Sil</button>
                    </div>
                  ))
                ) : (
                  <p>No Available Images Yet.</p>
                )}
              </div>

              <h3>Add New Images</h3>
              <div>
                <input type="file" accept="image/*" multiple onChange={handleNewImageUpload} />
                <button onClick={handleUpload}>Upload Images</button>
              </div>
            </form>


          </>
        )}
        {/* Modal for image zoom */}
        {selectedImage && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
            onClick={() => setSelectedImage(null)} // Close modal on click outside image
          >
            <img
              src={selectedImage}
              alt="Büyütülmüş Resim"
              style={{ maxWidth: "90%", maxHeight: "90%" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutEdit;
