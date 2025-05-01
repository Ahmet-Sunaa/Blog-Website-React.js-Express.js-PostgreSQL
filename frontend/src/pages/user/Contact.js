import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from "react-router-dom";
import "./User.css";

const Contact = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [title, setTitle] = useState("");
    const [senderName, setSenderName] = useState(user ? user.name : "");
    const [senderEmail, setSenderEmail] = useState(user ? user.email : "");
    const [content, setContent] = useState("");
    const { language } = useLanguage();
    const [page, setPage] = useState(null);

    const location = useLocation();
    const slug = location.pathname.split("/").pop();
    const [adress, setAdress] = useState("");
    
      useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/message/map-adress`)
          .then((response) => {
            setAdress(encodeURIComponent(response.data.contactadress)); // adreste bulunan , . gibi karakterleri ve boşluk karakterlerini linke uygun hale getir.
          }).catch((e) => {
            console.error("Api Hatası");
            console.error(e);
          });
      }, []);

    useEffect(() => {
        if (user) {
            setSenderName(user.name);
            setSenderEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/message`, {
                title,
                sender_name: senderName,
                sender_email: senderEmail,
                content,
                id: user ? user.id : null,
            });

            alert("Mesaj başarıyla gönderildi!");
            setTitle("");
            setContent("");
        } catch (error) {
            console.error(error);
            alert("Mesaj gönderilirken hata oluştu.");
        }
    };

    //Renk Bilgileri için
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/menu-pages/user/${slug}`)
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

    if (!page) return <h2>Sayfa bulunamadı</h2>;
    if (page.status === false) return <h2>Sayfa bulunamadı</h2>;

    return (
        <div style={{display:"flex", justifyContent: "center", backgroundColor: page.color[0], minHeight:"70vh"}}>
            <div className="message-form" style={{backgroundColor: page.color[1]}}>
                {/* Sağ Kısım: Google Maps */}
                <div className="footer-map">
                    <iframe
                        title="Google Maps"
                        width="400"
                        height="400"
                        style={{ border: "0" }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDTccoYJilB6zZEhn4XvevNTcXT8jA2Z1I&q=${adress}`}
                    ></iframe>
                </div>
                <form onSubmit={handleSubmit}>
                    <h2>{language === 'tr' ? 'İletişim' : 'Contact Us'} </h2>

                    <label>{language === 'tr' ? 'Başlık' : 'Title'}:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <label>{language === 'tr' ? 'Ad Soyad' : 'Name Surname'}:</label>
                    <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        disabled={!!user} // Giriş yapmışsa değiştiremez
                    />

                    <label>{language === 'tr' ? 'Mail Adresi' : 'E Mail Adress'}:</label>
                    <input
                        type="email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        required
                        disabled={!!user} // Giriş yapmışsa değiştiremez
                    />

                    <label>{language === 'tr' ? 'İçerik' : 'Content'}:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>

                    <button type="submit">{language === 'tr' ? 'Gönder' : 'Submit'}</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
