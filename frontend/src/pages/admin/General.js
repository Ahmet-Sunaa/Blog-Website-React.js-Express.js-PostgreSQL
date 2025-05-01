import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import AdminLeftBar from '../../components/adminComponent/AdminLeftBar';
import { Button } from 'react-bootstrap';

const General = () => {
  const [general, setGeneral] = useState({
    id: "",
    hometitle: "",
    homeentitle: "",
    homecontent: "",
    homeencontent: "",
    homeblogstitle: "",
    homeenblogstitle: "",
    footercolor: "",
    footertextcolor: "",
    contactadress: "",
    contacttitle: "",
    contactentitle: "",
    contactphone: "",
    contactemail: "",
    topbarcolor1: "",
    topbarcolor2: "",
    topbarcolor3: "",
    headertitle: "",
    headertitlecolor: "",
    headercolor1: "",
    headercolor2: "",
    headercolor3: "",
    headercolor4: "",
    headercolor5: "",
    headercolor6: "",
    headercolor7: "",
    headercolor8: "",
    headerlanguagebuttontext: "",
    headerlanguagebuttonentext: "",
    images: [],
    img_id: [],
  })
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // Selected image for zoom
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (token) {
      checkAuthorization();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }, [token]);

  // kaydetme
  const handleSave = (e) => {

    e.preventDefault();
    axios.put(`${process.env.REACT_APP_API_URL}/general`, general, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setMessage('Başarıyla güncellendi!'))
      .catch(() => {
        setMessage('Hata oluştu!')
        localStorage.removeItem('token');
      });
  };

  // resim silme
  const handleDelete = (imageId) => {
    axios.delete(`${process.env.REACT_APP_API_URL}/general/images`,
      {
        data: { imageId },
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(() => setImages(images.filter(img => img.id !== imageId)))
      .catch(() => localStorage.removeItem('token'))
  };

  // resim yükleme
  const handleUpload = () => {
    console.log(general);
    console.log(images);
    const formData = new FormData();
    newImages.forEach(file => formData.append('images', file));
    formData.append("id", general.id);

    axios.post(`${process.env.REACT_APP_API_URL}/general/images`, formData, {
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

  // resimleri yükleme sonrası değişkende tutma
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

  // verileri çekme
  const getItems = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/general/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data)
      setGeneral(res.data);
      setImages(res.data.images.map((img, index) => ({
        id: res.data.img_id[index],
        src: `data:image/png;base64,${img}`
      })));



    } catch (err) {
      console.error("API Error:", err);
      localStorage.removeItem('token');
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  // resimleri varsayılana sıfırlama
  const defaultColor = (name) => {
    if (name === "topbar") {
      setGeneral({ ...general, topbarcolor1: "", topbarcolor2: "", topbarcolor3: "" })
    }
    else if (name === "header") {
      setGeneral({
        ...general,
        headertitlecolor: "",
        headercolor1: "",
        headercolor2: "",
        headercolor3: "",
        headercolor4: "",
        headercolor5: "",
        headercolor6: "",
        headercolor7: "",
        headercolor8: "",
      })
    }
    else if (name === "footer") {
      setGeneral({
        ...general,
        footercolor: "",
        footertextcolor: "",
      })
    } else {
      console.log("Hata Renk sıfırlanamadı!!");
    }
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
        <h2>Genel Sayfa Ayarları</h2>
        <form onSubmit={handleSave} className="edit-form">
          <h2 style={{ marginTop: "20px" }}>Ana Sayfa</h2>
          <label>Resim üzerindeki Başlık:</label>
          <input type="text" value={general.hometitle} onChange={(e) => setGeneral({ ...general, hometitle: e.target.value })} required />

          <label>Resim üzerindeki Başlık(İngilizce):</label>
          <input type="text" value={general.homeentitle} onChange={(e) => setGeneral({ ...general, homeentitle: e.target.value })} required />

          <label>Resim içerisindeki Yazı:</label>
          <input type="text" value={general.homecontent} onChange={(e) => setGeneral({ ...general, homecontent: e.target.value })} required />

          <label>Resim içerisindeki Yazı(İngilizce):</label>
          <input type="text" value={general.homeencontent} onChange={(e) => setGeneral({ ...general, homeencontent: e.target.value })} required />

          <label>Blogların üzerindeki Yazı:</label>
          <input type="text" value={general.homeblogstitle} onChange={(e) => setGeneral({ ...general, homeblogstitle: e.target.value })} required />

          <label>Blogların üzerindeki Yazı(İngilizce):</label>
          <input type="text" value={general.homeenblogstitle} onChange={(e) => setGeneral({ ...general, homeenblogstitle: e.target.value })} required />

          <h2 style={{ marginTop: "20px" }}>Footer (En alt bar)</h2>
          <label>Footerda bulunan üst başlık:</label>
          <input type="text" value={general.contacttitle} onChange={(e) => setGeneral({ ...general, contacttitle: e.target.value })} required />

          <label>Footerda bulunan üst başlık(İngilizce):</label>
          <input type="text" value={general.contactentitle} onChange={(e) => setGeneral({ ...general, contactentitle: e.target.value })} required />

          <label>Telefon:</label>
          <input type="text" value={general.contactphone} onChange={(e) => setGeneral({ ...general, contactphone: e.target.value })} required />

          <label>Adres:</label>
          <input type="text" value={general.contactadress} onChange={(e) => setGeneral({ ...general, contactadress: e.target.value })} required />

          <label>email:</label>
          <input type="text" value={general.contactemail} onChange={(e) => setGeneral({ ...general, contactemail: e.target.value })} required />
          <span>Arkaplan rengi:</span>
          <input
            id="12"
            type="color"
            value={general.footercolor}
            onChange={(e) => setGeneral({ ...general, footercolor: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Yazı rengi:</span>
          <input
            id="14"
            type="color"
            value={general.footertextcolor}
            onChange={(e) => setGeneral({ ...general, footertextcolor: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <Button variant="danger" size="sm" onClick={() => defaultColor("footer")}>
            Footer Renklerini Sıfırla
          </Button>

          <h2 style={{ marginTop: "20px" }}>Top Bar</h2>
          <span>Arkaplan rengi:</span>
          <input
            id="1"
            type="color"
            value={general.topbarcolor1}
            onChange={(e) => setGeneral({ ...general, topbarcolor1: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>İcon Rengi:</span>
          <input
            id="2"
            type="color"
            value={general.topbarcolor2}
            onChange={(e) => setGeneral({ ...general, topbarcolor2: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>İcon Hower Rengi:</span>
          <input
            id="3"
            type="color"
            value={general.topbarcolor3}
            onChange={(e) => setGeneral({ ...general, topbarcolor3: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <Button variant="danger" size="sm" onClick={() => defaultColor("topbar")}>
            Topbar Renklerini Sıfırla
          </Button>


          <h2 style={{ marginTop: "20px" }}>Header Bar</h2>

          <label>Başlık Adı:</label>
          <input type="text" value={general.headertitle} onChange={(e) => setGeneral({ ...general, headertitle: e.target.value })} required />

          <label>Dil Değiştirme Butonu Adı:</label>
          <input type="text" value={general.headerlanguagebuttontext} onChange={(e) => setGeneral({ ...general, headerlanguagebuttontext: e.target.value })} required />

          <label>Dil Değiştirme Butonu Adı(İngilizce):</label>
          <input type="text" value={general.headerlanguagebuttonentext} onChange={(e) => setGeneral({ ...general, headerlanguagebuttonentext: e.target.value })} required />

          <span>Başlık rengi:</span>
          <input
            id="4"
            type="color"
            value={general.headertitlecolor}
            onChange={(e) => setGeneral({ ...general, headertitlecolor: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Dil Butonu Arkaplan Rengi:</span>
          <input
            id="11"
            type="color"
            value={general.headercolor7}
            onChange={(e) => setGeneral({ ...general, headercolor7: e.target.value })}
            title="Metin Rengi"
          />
          <br />
          <span>Dil Butonu Arkaplan Rengi (İngilizce):</span>
          <input
            id="13"
            type="color"
            value={general.headercolor8}
            onChange={(e) => setGeneral({ ...general, headercolor8: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Arkaplan rengi:</span>
          <input
            id="5"
            type="color"
            value={general.headercolor1}
            onChange={(e) => setGeneral({ ...general, headercolor1: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Yazı rengi:</span>
          <input
            id="6"
            type="color"
            value={general.headercolor2}
            onChange={(e) => setGeneral({ ...general, headercolor2: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Yazı Hower rengi:</span>
          <input
            id="7"
            type="color"
            value={general.headercolor3}
            onChange={(e) => setGeneral({ ...general, headercolor3: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Alt Başlık Yazı Rengi:</span>
          <input
            id="8"
            type="color"
            value={general.headercolor4}
            onChange={(e) => setGeneral({ ...general, headercolor4: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Alt Başlık Arka Plan Rengi:</span>
          <input
            id="9"
            type="color"
            value={general.headercolor5}
            onChange={(e) => setGeneral({ ...general, headercolor5: e.target.value })}
            title="Metin Rengi"
          />
          <br />

          <span>Hamburger Menü Rengi:</span>
          <input
            id="10"
            type="color"
            value={general.headercolor6}
            onChange={(e) => setGeneral({ ...general, headercolor6: e.target.value })}
            title="Metin Rengi"
          />
          <br />
          <Button variant="danger" size="sm" onClick={() => defaultColor("header")}>
            Header Renklerini Sıfırla
          </Button>
          <br />




          <button type="submit">Kaydet</button>
          {message && <p>{message}</p>}

          <h3>Mevcut Resimler (Ana Sayfa)</h3>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {images.length > 0 ? (
              images.map((img) => (
                <div key={img.id} style={{ margin: "10px", textAlign: "center" }}>
                  <img
                    src={img.src} //{`data:image/png;base64,${general.images}`}
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

export default General;
