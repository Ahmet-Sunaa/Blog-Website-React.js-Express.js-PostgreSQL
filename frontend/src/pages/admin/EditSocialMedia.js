import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css";

const EditSocialMedia = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState("");

    const [facebookUrl, setFacebookUrl] = useState("");
    const [instagramUrl, setInstagramUrl] = useState("");
    const [xUrl, setXUrl] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [googleUrl, setGoogleUrl] = useState("");
    const [behanceUrl, setBehanceUrl] = useState("");
    const [githubUrl, setGithubUrl] = useState("");
    const [pinterestUrl, setPinterestUrl] = useState("");
    const [linkedinUrl, setLinkedinUrl] = useState("");
    const [researchGateUrl, setResearchGateUrl] = useState("");
    const [googleScholarUrl, setGoogleScholarUrl] = useState("");

    useEffect(() => {
        if (token) {
            checkAuthorization();
        } else {
            setIsAuthorized(false);
            navigate("/login");
        }
    }, [token]);

    // Yetki kontrolü
    const checkAuthorization = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "admin") {
            setIsAuthorized(true);
            fetchTeamMember();

        } else {
            setIsAuthorized(false);
            navigate("/login");
        }
    };

    // Mevcut verileri getir
    const fetchTeamMember = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/social-media`,{
                headers: { Authorization: `Bearer ${token}` }

            });
            const data = response.data;
            setFacebookUrl(data.facebook !== null ? data.facebook : '');
            setInstagramUrl(data.instagram !== null ? data.instagram : '');
            setXUrl(data.x !== null ? data.x : '');
            setYoutubeUrl(data.youtube !== null ? data.youtube : '');
            setGoogleUrl(data.google !== null ? data.google : '');
            setBehanceUrl(data.behance !== null ? data.behance : '');
            setGithubUrl(data.github !== null ? data.github : '');
            setPinterestUrl(data.pinterest !== null ? data.pinterest : '');
            setLinkedinUrl(data.linkedin !== null ? data.linkedin : '');
            setResearchGateUrl(data.researchgate !== null ? data.researchgate : '');
            setGoogleScholarUrl(data.googlescholar !== null ? data.googlescholar : '');
            setIsLoading(false);
        } catch (error) {
            setError("Veri alınırken hata oluştu.");
            localStorage.removeItem('token');
            setIsLoading(false);
        }
    };



    // Güncelleme işlemi
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Kullanıcı bilgilerini güncelle
            await axios.put(
                `http://localhost:5000/social-media/`,
                {facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            ).catch(() => {
                setError("Proje bulunamadı!");
                localStorage.removeItem('token');
              });


            alert("Sosyal medya bilgileri başarıyla güncellendi!");
            navigate("/admin/social-media");
        } catch (error) {
            setError("Güncelleme sırasında hata oluştu!");
            localStorage.removeItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthorized) {
        return;
    }
    if (isLoading) {
        return <p>Yükleniyor...</p>;
    }

    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="add-post-container">
                <h2>Ana Ekran Linkleri</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className="add-post-form" onSubmit={handleUpdate}>

                    <h4>Facebook:</h4>
                    <input type="text" placeholder="Facebook Linki" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
                    
                    <h4>Instagram:</h4>
                    <input type="text" placeholder="Instagram Linki" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} />
                    
                    <h4>X(Twitter):</h4>
                    <input type="text" placeholder="X Linki" value={xUrl} onChange={(e) => setXUrl(e.target.value)} />
                    
                    <h4>Youtube:</h4>
                    <input type="text" placeholder="Youtube Linki" value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} />
                    
                    <h4>Google:</h4>
                    <input type="text" placeholder="Google Linki" value={googleUrl} onChange={(e) => setGoogleUrl(e.target.value)} />
                    
                    <h4>Behance:</h4>
                    <input type="text" placeholder="Behance Linki" value={behanceUrl} onChange={(e) => setBehanceUrl(e.target.value)} />
                    
                    <h4>Github:</h4>
                    <input type="text" placeholder="Github Linki" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                    
                    <h4>Pinterest:</h4>
                    <input type="text" placeholder="Pinterest Linki" value={pinterestUrl} onChange={(e) => setPinterestUrl(e.target.value)} />
                    
                    <h4>Linkedin:</h4>
                    <input type="text" placeholder="Linkedin Linki" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} />
                    
                    <h4>Research Gate:</h4>
                    <input type="text" placeholder="Research Gate Linki" value={researchGateUrl} onChange={(e) => setResearchGateUrl(e.target.value)} />
                    
                    <h4>Google Scholar:</h4>
                    <input type="text" placeholder="Google Scholar Linki" value={googleScholarUrl} onChange={(e) => setGoogleScholarUrl(e.target.value)} />

                    <button type="submit" disabled={isLoading}>{isLoading ? "Güncelleniyor..." : "Güncelle"}</button>
                </form>
            </div>
        </div>
    );
};

export default EditSocialMedia;
