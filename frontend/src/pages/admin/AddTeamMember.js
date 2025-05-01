import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css"
const AddTeamMember = () => {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
    const [preview, setPreview] = useState(null);

    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [enJobTitle, setEnJobTitle] = useState("");
    const [jobTitleType, setJobTitleType] = useState("");
    const [enJobTitleType, setEnJobTitleType] = useState("");
    const [image, setImage] = useState(null);
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
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

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // role kontrolü
    useEffect(() => {
        if (token) {
            checkAuthorization();

        } else {
            setIsAuthorized(false);
            navigate("/login");
        }
    }, [token]);



    const checkAuthorization = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "admin") {
            setIsAuthorized(true);
            setIsLoading(false);
        } else {
            setIsAuthorized(false);
            navigate("/login");
        }
    };

    // Dosya seçildiğinde çalışacak
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file)); // Önizleme için
        }
        else {
            setImage(null);
        }
    };

    // kaydetme işlemi
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Post'u ekle
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/teams/`, // API'yi doğru URL'ye yönlendiriyoruz
                { name, priority, jobTitle, jobTitleType, enJobTitle, enJobTitleType, image, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl }, // Verileri gönder
                { headers: { Authorization: `Bearer ${token}` } } // Headers'ı ekliyoruz
            );

            const formData = new FormData(); // resim için
            formData.append("userId", response.data.data.id); // Kullanıcı ID’sini ekle

            if (image) {
                formData.append("image", image);
            }

            await fetch(`${process.env.REACT_APP_API_URL}/teams/image`, {
                method: "PUT",
                body: formData,
                headers: { Authorization: `Bearer ${token}` }
            });

            alert(response.data.message);
            navigate("/admin/teams-list");

        } catch (error) {
            setError("Post eklenirken hata oluştu!");
            localStorage.removeItem('token');

        } finally {
            setIsLoading(false);
        }
    };




    if (!isAuthorized) {
        return;
    }
    if (isLoading) {
        return <p>Yükleniyor...</p>; // Sayfa yüklenirken göster
    }

    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="add-post-container">
                <h2 style={{ marginLeft: '25%', marginRight: '25%' }}>Yeni Proje Ekle</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className="add-post-form" onSubmit={handleSubmit}>

                    <h4>İsim:</h4>
                    <input
                        type="text"
                        placeholder="İsim"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                    <h4>Ünvan:</h4>
                    <input
                        type="text"
                        placeholder="Ünvan"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        required
                    />
                    <h4>English Job Title:</h4>
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={enJobTitle}
                        onChange={(e) => setEnJobTitle(e.target.value)}
                        required
                    />

                    <h4>Ünvan Türü:</h4>
                    <input
                        type="text"
                        placeholder="Ünvan Türü"
                        value={jobTitleType}
                        onChange={(e) => setJobTitleType(e.target.value)}
                        required
                    />
                    <h4>English Job Title Type:</h4>
                    <input
                        type="text"
                        placeholder="Job Title Type"
                        value={enJobTitleType}
                        onChange={(e) => setEnJobTitleType(e.target.value)}
                        required
                    />
                    <input
                        type="text" // "number" yerine "text" kullanıyoruz çünkü "number" ile bazı tarayıcılarda eksi ve nokta girilebilir.
                        placeholder="Ünvan türü öncelik numarası"
                        value={priority}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, ""); // Sadece rakamları alır, harfleri siler
                            setPriority(value);
                        }}
                        inputMode="numeric" // Mobilde sadece rakam klavyesini açar
                        pattern="[0-9]*" // Tarayıcıya sadece rakam kabul etmesini söyler
                        required
                    />

                    <h4>Resim:</h4>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Önizleme" width="100" />}

                    <h4>Mail:</h4>
                    <input
                        type="text"
                        placeholder="E Mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <h4>Telefon:</h4>
                    <input
                        type="text"
                        placeholder="Telefon"
                        value={tel}
                        onChange={(e) => setTel(e.target.value)}
                    />

                    <h4>Facebook:</h4>
                    <input
                        type="text"
                        placeholder="Facebook Linki"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                    />

                    <h4>Instagram:</h4>
                    <input
                        type="text"
                        placeholder="Instagram Linki"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                    />

                    <h4>X (Twitter):</h4>
                    <input
                        type="text"
                        placeholder="X Linki"
                        value={xUrl}
                        onChange={(e) => setXUrl(e.target.value)}
                    />

                    <h4>Youtube:</h4>
                    <input
                        type="text"
                        placeholder="Youtube Linki"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                    />

                    <h4>Google:</h4>
                    <input
                        type="text"
                        placeholder="Google Linki"
                        value={googleUrl}
                        onChange={(e) => setGoogleUrl(e.target.value)}
                    />

                    <h4>Behance:</h4>
                    <input
                        type="text"
                        placeholder="Behance Linki"
                        value={behanceUrl}
                        onChange={(e) => setBehanceUrl(e.target.value)}
                    />

                    <h4>Github:</h4>
                    <input
                        type="text"
                        placeholder="Github Linki"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                    />

                    <h4>Pinterest:</h4>
                    <input
                        type="text"
                        placeholder="Pinterest Linki"
                        value={pinterestUrl}
                        onChange={(e) => setPinterestUrl(e.target.value)}
                    />

                    <h4>Linkedin:</h4>
                    <input
                        type="text"
                        placeholder="Linkedin Linki"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                    />

                    <h4>Research Gate:</h4>
                    <input
                        type="text"
                        placeholder="Research Gate Linki"
                        value={researchGateUrl}
                        onChange={(e) => setResearchGateUrl(e.target.value)}
                    />

                    <h4>Google Scholar:</h4>
                    <input
                        type="text"
                        placeholder="Google Scholar Linki"
                        value={googleScholarUrl}
                        onChange={(e) => setGoogleScholarUrl(e.target.value)}
                    />


                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Yükleniyor..." : "Blog Yazısını Ekle"}
                    </button>
                </form>
            </div>



        </div>

    );
};

export default AddTeamMember;
