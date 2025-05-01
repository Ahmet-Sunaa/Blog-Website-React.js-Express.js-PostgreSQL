import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // 🔹 Yükleme durumu
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
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

    // resim çekme işlemi
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/images`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setImages(response.data);
    } catch (error) {
      setError("Resimler yüklenirken hata oluştu!");
      localStorage.removeItem('token');
    }
  };

  // yüklenen resimleri kaydetme
  const handleUpload = async () => {
    if (newImages.length === 0) {console.log("shit");return;} // Eğer hiç dosya seçilmediyse işlem yapma.
    const formData = new FormData();
    
    // `newImages` array'inde bulunan tüm dosyaları formData'ya ekleyin.
    newImages.forEach(file => formData.append("images", file));
  
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      fetchImages(); // Yükleme başarılı olduğunda resimleri tekrar al
    } catch (error) {
      setError("Resim yüklenirken hata oluştu!");
      localStorage.removeItem('token');
    }
  };
  
  
  const handleNewImageUpload = (e) => {
    // Yeni seçilen dosyaları mevcut dosyalara ekleyin.

    setNewImages([...e.target.files]); // Çoklu dosya seçimini destekle
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchImages();
    } catch (error) {
      setError("Resim silinirken hata oluştu!");
      localStorage.removeItem('token');
    }
  };
  const checkAuthorization = async () => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin" || user.role === "administrator"){ 
      setIsAuthorized(true)
      fetchImages();
      setIsLoading(false);
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }   
  };

  if (!isAuthorized) {
    return;
  }

  // 🔹 Yetkilendirme tamamlanana kadar ekrana hiçbir şey bastırma
  if (isLoading) {
    return null; // Hiçbir şey gösterme (Sayfa tamamen boş kalır)
  }

  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="image-manage-container">
        <h2>Resim Yönetimi</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <input type="file" accept="image/*" multiple onChange={handleNewImageUpload} />
          <button className="" onClick={handleUpload}>Resim Yükle</button>
        </div>

        <h3>Mevcut Resimler</h3>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {images.length > 0 ? (
            images.map((img) => (
              <div key={img.id} style={{ margin: "10px", textAlign: "center" }}>
                <img
                  src={img.image}
                  alt={`Resim ${img.id}`}
                  width="150"
                  style={{ cursor: "pointer", marginBottom:"10px" }}
                  onClick={() => setSelectedImage(img.image)} // Tıklanabilir resim
                />
                <br />
                <button className="btn btn-dark" onClick={() => handleDelete(img.id)}>Sil</button>
              </div>
            ))
          ) : (
            <p>Henüz resim eklenmedi.</p>
          )}
        </div>

        {/* Modal for image enlargement */}
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
            onClick={() => setSelectedImage(null)} // Close modal on click
          >
            <img
              src={selectedImage}
              alt="Büyütülmüş Resim"
              style={{ maxWidth: "90%", maxHeight: "90%" }} // Resmi büyütme
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
