import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css";

const EditTeamMember = () => {
    const { id } = useParams(); // URL’den ID al
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [error, setError] = useState("");
    const [preview, setPreview] = useState(null);

    const [name, setName] = useState("");
    const [priority, setPriority] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [enJobTitle, setEnJobTitle] = useState("");
    const [jobTitleType, setJobTitleType] = useState("");
    const [enJobTitleType, setEnJobTitleType] = useState("");    const [image, setImage] = useState(null);
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
            const response = await axios.get(`http://localhost:5000/teams/admin/${id}`,{
                headers: { Authorization: `Bearer ${token}` }

            });
            const data = response.data;
            setName(data.name);
            setPriority(data.priority);
            setJobTitle(data.jobtitle);
            setJobTitleType(data.jobtitletype);
            setEnJobTitle(data.enjobtitle);
            setEnJobTitleType(data.enjobtitletype);
            setEmail(data.email);
            setTel(data.tel);
            setFacebookUrl(data.facebook);
            setInstagramUrl(data.instagram);
            setXUrl(data.x);
            setYoutubeUrl(data.youtube);
            setGoogleUrl(data.google);
            setBehanceUrl(data.behance);
            setGithubUrl(data.github);
            setPinterestUrl(data.pinterest);
            setLinkedinUrl(data.linkedin);
            setResearchGateUrl(data.researchgate);
            setGoogleScholarUrl(data.googlescholar);
            setPreview(`http://localhost:5000/teams/image/${id}`,{headers: { Authorization: `Bearer ${token}` }});
            setIsLoading(false);
        } catch (error) {
            setError("Veri alınırken hata oluştu.");
            localStorage.removeItem('token');
            setIsLoading(false);
        }
    };

    // Dosya değişimi
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Güncelleme işlemi
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // 1. Kullanıcı bilgilerini güncelle
            await axios.put(
                `http://localhost:5000/teams/update-team-member`,
                { id,priority, name, jobTitle, jobTitleType,enJobTitle,enJobTitleType, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. Resmi güncelle (eğer seçildiyse)
            if (image) {
                const formData = new FormData();
                formData.append("image", image);
                formData.append("userId", id); // Kullanıcı ID’sini ekle

                await fetch(`http://localhost:5000/teams/image`, {
                    method: "PUT",
                    body: formData,
                    headers: { Authorization: `Bearer ${token}` },
                });
            }

            alert("Üye başarıyla güncellendi!");
            navigate("/admin/teams-list");
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
                <h2>Ekibi Güncelle</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form className="add-post-form" onSubmit={handleUpdate}>
                    <h4>İsim:</h4>
                    <input type="text" placeholder="İsim" value={name} onChange={(e) => setName(e.target.value)} required />
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
                    <h4>Resim</h4>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {preview && <img src={preview} alt="Önizleme" width="100" />}
                    
                    <h4>Email:</h4>
                    <input type="text" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
                    
                    <h4>Telefon:</h4>
                    <input type="text" placeholder="Telefon" value={tel} onChange={(e) => setTel(e.target.value)} />

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

export default EditTeamMember;
