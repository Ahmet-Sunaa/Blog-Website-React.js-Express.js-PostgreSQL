import React, { useEffect, useState } from "react";
import "../pages/user/User.css";
import { useLanguage } from "../context/LanguageContext";
import axios from "axios";
import Slider from "react-slick";

// Entries bileşeni, belirli bir arkaplan rengini alarak içerik gösterir.
const Entries = (color) => {
    const { language } = useLanguage(); // Dil bilgisini almak için Context kullanılıyor.
    const [home, setHome] = useState({
        hometitle: "",
        homeentitle: "",
        homecontent: "",
        homeencontent: "",
        images: [],
    });

    // API'den giriş verilerini almak için useEffect kullanılıyor.
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/general/entries`)
            .then((response) => {
                setHome(response.data); // Gelen veriyi state'e kaydediyoruz.
            }).catch(() => {
                console.error("Api Hatası");
            });
    }, []);

    // Slider ayarları
    const settingsInner = {
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };
    
    return (
        <div className="entry-container" style={{ backgroundColor: color.color }}>
            <div className="img-container" style={{ width: "100%", height: "100%", minWidth: "1000px", minHeight: "500px", maxHeight: "750px", maxWidth: "1250px" }}>

                {/* Birden fazla resim varsa Slider ile göster */}
                {home.images.length > 1 && (
                    <Slider style={{ position: 'static !important' }} {...settingsInner}>
                        {home.images.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={`data:image/png;base64,${image}`}
                                    alt={`Post ${home.hometitle} - Image ${index + 1}`}
                                    className="post-image-detail"
                                />
                            </div>
                        ))}
                    </Slider>
                )}
                
                {/* Tek bir resim varsa doğrudan göster */}
                {home.images.length === 1 && home.images[0] !== null && (
                    <div>
                        <img
                            src={`data:image/png;base64,${home.images[0]}`}
                            alt={home.hometitle}
                            className="post-image"
                        />
                    </div>
                )}
                
                {/* Türkçe içerik gösterimi */}
                {language === 'tr' && home.hometitle !== null && home.hometitle !== "" && home.homecontent !== null && home.homecontent !== "" && (
                    <div className="img-text">
                        <h1>{home.hometitle}</h1>
                        <p>{home.homecontent}</p>
                    </div>
                )}
                
                {/* İngilizce içerik gösterimi */}
                {language === 'en' && home.homeentitle !== null && home.homeentitle !== "" && home.homeencontent !== null && home.homeencontent !== "" && (
                    <div className="img-text">
                        <h1>{home.homeentitle}</h1>
                        <p>{home.homeencontent}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Entries;
