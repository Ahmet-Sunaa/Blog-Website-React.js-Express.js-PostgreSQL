import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, } from "react-bootstrap";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import TextEditor from "../../components/adminComponent/TextEditor";

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [images, setImages] = useState([]); // DB'deki tüm resimler
    const [selectedImages, setSelectedImages] = useState([]);
    const [error, setError] = useState([]);
    const { language } = useLanguage();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const [currentBlogs, setCurrentBlogs] = useState({
        title: "",
        entitle: "",
        detail: "",
        endetail: "",
        date: null,
        authorname: "",
        keywords: "",
        enkeywords: "",
        turkish_content_data: [],
        english_content_data: [],
        position: "",
        status: false
    });
    useEffect(() => {
        fetchBlogs();
    }, []);

    // blogları çekme işlemi
    const fetchBlogs = async () => {
        try {
            await axios.get("http://localhost:5000/posts/admin-get", {
                headers: { Authorization: `Bearer ${token}` },
            }).then((response) => {
                const formattedPages = response.data.map(page => ({
                    ...page,
                    turkish_content_data: page.turkish_content_data ? JSON.parse(page.turkish_content_data) : [], // JSON parse işlemi yap
                    english_content_data: page.english_content_data ? JSON.parse(page.english_content_data) : [], // JSON parse işlemi yap

                }));
                setBlogs(formattedPages);
            }).catch((err) => {
                setError("Projeler yüklenirken hata oluştu.");
                localStorage.removeItem('token');
                navigate("/login");
            });


            axios
                .get("http://localhost:5000/images", {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((response) => {
                    setImages(response.data); // API'den gelen resimleri state'e kaydet

                }).catch(() => {
                    localStorage.removeItem('token');
                })

        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    };

    // sayfa silme işlemi
    const handleDelete = async (id) => {
        if (window.confirm("Bu sayfayı silmek istediğinizden emin misiniz?")) {
            try {
                await axios.delete(`http://localhost:5000/posts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },

                }).catch(() => localStorage.removeItem("token"));
                fetchBlogs(); // Listeyi güncelle
            } catch {
                localStorage.removeItem("token");
                navigate("/login");
            }

        }
    };

    //edit işleminde slate editör verisini slate biçiminde düzeltme işlemi ve current page değişkenine kaydetme
    const handleEdit = (page) => {

        let parsedContent = [];
        let enParsedContent = [];

        // Eğer content_data bir string ise JSON.parse yap
        if (typeof page.turkish_content_data === "string") {
            try {
                parsedContent = JSON.parse(page.turkish_content_data);

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
        else if (Array.isArray(page.turkish_content_data)) {
            parsedContent = page.turkish_content_data;
        }
        // Eğer content_data bir obje ise array içine al
        else if (typeof page.turkish_content_data === "object") {
            parsedContent = [page.turkish_content_data];
        }

        if (typeof page.english_content_data === "string") {
            try {
                enParsedContent = JSON.parse(page.english_content_data);

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
        else if (Array.isArray(page.english_content_data)) {
            enParsedContent = page.english_content_data;
        }
        // Eğer content_data bir obje ise array içine al
        else if (typeof page.english_content_data === "object") {
            enParsedContent = [page.english_content_data];
        }

        setCurrentBlogs({
            ...page,
            turkish_content_data: parsedContent,
            english_content_data: enParsedContent,
        });
        setSelectedImages(page.img_id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleAddNew = () => {
        setCurrentBlogs({
            id: "",
            title: "",
            entitle: "",
            detail: "",
            endetail: "",
            date: null,
            authorname: "",
            keywords: "",
            enkeywords: "",
            turkish_content_data: [],
            english_content_data: [],
            position: "",
            status: false
        });
        setSelectedImages([]);
        setIsEditing(false);
        setShowModal(true);
    };

    // güncelleme ya da ekleme işleminin gerçekleştiği fonksiyon
    const handleSave = async () => {
        try {
            const updatedPage = {
                ...currentBlogs,
                turkish_content_data: JSON.stringify(currentBlogs.turkish_content_data), // JSON formatına çeviriyoruz
                english_content_data: JSON.stringify(currentBlogs.english_content_data), // JSON formatına çeviriyoruz
            };
            if (updatedPage.date === null) {
                setError("Tarih Boş Olamaz");
                return;
            } else if (updatedPage.authorname === "") {
                setError("Yazar Boş Olamaz");
                return;
            } else if (updatedPage.keywords === "") {
                setError("Keyword Boş Olamaz");
                return;
            }



            if (isEditing) {
                await axios.put(`http://localhost:5000/posts/update/${currentBlogs.id}`, updatedPage, {
                    headers: { Authorization: `Bearer ${token}` }

                }).catch(() => localStorage.removeItem("token"));

                await axios.delete(`http://localhost:5000/images/post-images/${currentBlogs.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => localStorage.removeItem("token"));



                selectedImages.forEach(async (imageId) => {
                    if (imageId !== null) {
                        await axios.post(
                            "http://localhost:5000/posts/post-images",
                            { postId: updatedPage.id, imageId },
                            { headers: { Authorization: `Bearer ${token}` } }
                        ).catch(() => localStorage.removeItem("token"));
                    }

                });

            } else {
                const postId = await axios.post("http://localhost:5000/posts", updatedPage, {
                    headers: { Authorization: `Bearer ${token}` },
                }).catch(() => localStorage.removeItem("token"));


                selectedImages.forEach(async (imageId) => {
                    await axios.post(
                        "http://localhost:5000/posts/post-images",
                        { postId: postId.data, imageId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    ).catch(() => localStorage.removeItem("token"));
                });
            }
            fetchBlogs();


            setShowModal(false);
            fetchBlogs(); // Güncellenmiş listeyi getir
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    };


    //editör ekleme işlemi
    const addContentBlockTr = (type) => {
        setCurrentBlogs({
            ...currentBlogs,
            turkish_content_data: [...currentBlogs.turkish_content_data, [{ type, children: [{ text: "" }] }]]
        });
    };
    const addContentBlockEn = (type) => {
        setCurrentBlogs({
            ...currentBlogs,
            english_content_data: [...currentBlogs.english_content_data, [{ type, children: [{ text: "" }] }]]
        });
    };

    //editör silme işlemleri
    const removeContentBlockTr = (index) => {
        const newContent = [...currentBlogs.turkish_content_data];
        newContent.splice(index, 1); // İlgili index'teki öğeyi sil
        setCurrentBlogs({ ...currentBlogs, turkish_content_data: newContent });
    };
    const removeContentBlockEn = (index) => {
        const newContent = [...currentBlogs.english_content_data];
        newContent.splice(index, 1); // İlgili index'teki öğeyi sil
        setCurrentBlogs({ ...currentBlogs, english_content_data: newContent });
    };


    // eklenen editörlerin yerini değiştirme
    const moveContentBlockTr = (index, direction) => {
        const newContent = [...currentBlogs.turkish_content_data];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= newContent.length) return; // Sınırları aşma

        // Elemanları yer değiştir
        [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];

        setCurrentBlogs({ ...currentBlogs, turkish_content_data: newContent });
    };
    const moveContentBlockEn = (index, direction) => {
        const newContent = [...currentBlogs.english_content_data];
        const newIndex = index + direction;

        if (newIndex < 0 || newIndex >= newContent.length) return; // Sınırları aşma

        // Elemanları yer değiştir
        [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];

        setCurrentBlogs({ ...currentBlogs, english_content_data: newContent });
    };

    // blogların sıralamasını değiştirme
    const moveBlogs = async (page, direction) => {
        const newPages = [...blogs].sort((a, b) => a.position - b.position); // Önce sıralayalım
        const index = newPages.findIndex(p => p.id === page.id);
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newPages.length) return; // Geçersiz hareketleri engelle

        // Sayfaların position değerlerini değiştir
        const tempposition = newPages[index].position;
        newPages[index].position = newPages[targetIndex].position;
        newPages[targetIndex].position = tempposition;

        // Verileri güncelle
        setBlogs([...newPages]); // State güncelle

        // Backend'e güncelleme isteği gönder
        await updatePageOrder(newPages[index]);
        await updatePageOrder(newPages[targetIndex]);
        fetchBlogs();
    };

    // Veritabanında position değerini güncelleyen API fonksiyonu
    const updatePageOrder = async (page) => {
        try {
            await fetch(`http://localhost:5000/posts/change-position`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: page.id, position: page.position }),
            });
        } catch {
            localStorage.removeItem("token");
            navigate("/login");

        }

    };

    // resim seçme işlemi
    const handleSelectImage = (imgId) => {
        if (selectedImages.includes(imgId)) {
            setSelectedImages(selectedImages.filter((id) => id !== imgId)); // Eğer zaten seçiliyse kaldır
        } else {
            setSelectedImages([...selectedImages, imgId]); // Yeni resmi ekle
        }
    };

    //editör içerik kaydetme işlemleri
    const editorContentSaveTr = async (content, index) => {
        if (!content || content.length === 0) return; // İçerik boşsa işlem yapma

        const newContent = JSON.parse(JSON.stringify(currentBlogs.turkish_content_data)); // Derin kopya

        if (!newContent[index]) return; // Hatalı index kontrolü
        newContent[index] = content; // Yeni içeriği ekle
        setCurrentBlogs({ ...currentBlogs, turkish_content_data: newContent }); // State güncelle

    };
    const editorContentSaveEn = async (content, index) => {
        if (!content || content.length === 0) return; // İçerik boşsa işlem yapma

        const newContent = JSON.parse(JSON.stringify(currentBlogs.english_content_data)); // Derin kopya

        if (!newContent[index]) return; // Hatalı index kontrolü
        newContent[index] = content; // Yeni içeriği ekle
        setCurrentBlogs({ ...currentBlogs, english_content_data: newContent }); // State güncelle

    };

    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="container mt-4">
                <h2>Blog Yönetimi</h2>

                {/* Sayfa Ekleme Butonu */}
                <Button variant="success" onClick={handleAddNew} className="mb-3">
                    + Yeni Blog Ekle
                </Button>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Başlık</th>
                            <th>Durum</th>
                            <th>Sıra</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((page, index) => (
                            <tr key={page.id}>
                                <td>{page.id}</td>
                                <td>{page.title}</td>
                                <td>{page.status ? "Aktif" : "Pasif"}</td>
                                <td>{page.position}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(page)}>
                                        Düzenle
                                    </Button>{" "}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(page.id)}>
                                        Sil
                                    </Button>{" "}
                                    <Button variant="primary" size="sm" onClick={() => moveBlogs(page, -1)} disabled={index === 0}>
                                        ⬆ Yukarı
                                    </Button>{" "}
                                    <Button variant="primary" size="sm" onClick={() => moveBlogs(page, 1)} disabled={index === blogs.length - 1}>
                                        ⬇ Aşağı
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>


                {/* Sayfa Ekleme ve Düzenleme Modalı */}
                <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>{isEditing ? "Sayfa Düzenle" : "Yeni Sayfa Ekle"}</Modal.Title>
                        <LanguageSwitcher />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            {language === 'tr' ? (
                                <>
                                    <Form.Label style={{ color: "red" }}>{error}</Form.Label>

                                    <Form.Group>

                                        <Form.Label>Blog Adı</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentBlogs.title}
                                            onChange={(e) => setCurrentBlogs({ ...currentBlogs, title: e.target.value })}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Control
                                        as="textarea"
                                        placeholder="Özet Metin girin..."
                                        value={currentBlogs.detail}
                                        onChange={(e) => setCurrentBlogs({ ...currentBlogs, detail: e.target.value })}
                                        required
                                    />

                                    <Form.Group>
                                        <Form.Label>Türkçe Anahtar Kelime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentBlogs.keywords}
                                            onChange={(e) => setCurrentBlogs({ ...currentBlogs, keywords: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                </>
                            ) : (
                                <>
                                    <Form.Group>
                                        <Form.Label>Blog İngilizce Adı</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentBlogs.entitle}
                                            onChange={(e) => setCurrentBlogs({ ...currentBlogs, entitle: e.target.value })}
                                        />
                                    </Form.Group>

                                    <Form.Control
                                        as="textarea"
                                        placeholder="Özet Metin girin..."
                                        value={currentBlogs.endetail}
                                        onChange={(e) => setCurrentBlogs({ ...currentBlogs, endetail: e.target.value })}
                                    />

                                    <Form.Group>
                                        <Form.Label>İngilizce Anahtar Kelime</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentBlogs.enkeywords}
                                            onChange={(e) => setCurrentBlogs({ ...currentBlogs, enkeywords: e.target.value })}
                                        />
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group controlId="date">
                                <Form.Label>Tarih Seç</Form.Label>

                                <label>{language === 'tr' ? 'Tarih' : 'Date'}:</label>
                                <input type="date" value={currentBlogs.date?.split("T")[0]} onChange={(e) => setCurrentBlogs({ ...currentBlogs, date: e.target.value })} required />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Yazar Adı</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentBlogs.authorname}
                                    onChange={(e) => setCurrentBlogs({ ...currentBlogs, authorname: e.target.value })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Aktif"
                                    checked={currentBlogs.status}
                                    onChange={(e) => setCurrentBlogs({ ...currentBlogs, status: e.target.checked })}
                                />
                            </Form.Group>

                            {/* 🟢 İçerik Düzenleme Alanı */}

                            {language === 'tr' && currentBlogs.turkish_content_data.map((block, index) => (
                                <div key={index}>
                                    <h4>Türkçe içerik</h4>

                                    <div className="p-4">
                                        <h1 className="text-xl font-bold mb-4">Metin Editörü</h1>
                                        <TextEditor value={block} onSave={(content) => { editorContentSaveTr(content, index) }} />

                                    </div>

                                    {/* İçerik yönetimi butonları */}
                                    <div className="d-flex gap-2 mt-2">
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlockTr(index, -1)} disabled={index === 0}>
                                            ⬆ Yukarı
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlockTr(index, 1)} disabled={index === currentBlogs.turkish_content_data.length - 1}>
                                            ⬇ Aşağı
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => removeContentBlockTr(index)}>
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {language === 'en' && currentBlogs.english_content_data.map((block, index) => (
                                <div key={index}>
                                    <h4>İngilizce içerik</h4>
                                    <div className="p-4">
                                        <h1 className="text-xl font-bold mb-4">Metin Editörü</h1>
                                        <TextEditor value={block} onSave={(content) => { editorContentSaveEn(content, index) }} />

                                    </div>

                                    {/* İçerik yönetimi butonları */}
                                    <div className="d-flex gap-2 mt-2">
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlockEn(index, -1)} disabled={index === 0}>
                                            ⬆ Yukarı
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlockEn(index, 1)} disabled={index === currentBlogs.turkish_content_data.length - 1}>
                                            ⬇ Aşağı
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => removeContentBlockEn(index)}>
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            {/*  Yeni İçerik Ekleme Butonları */}
                            {language === 'tr' ? (
                                <>
                                    <Button variant="outline-secondary" onClick={() => addContentBlockTr("paragraph")}>
                                        + Yazı Ekle
                                    </Button>{" "}
                                </>

                            ) : (
                                <>
                                    <Button variant="outline-secondary" onClick={() => addContentBlockEn("paragraph")}>
                                        + Yazı Ekle
                                    </Button>{" "}

                                </>

                            )}



                        </Form >
                        <div className="choose-image-container">
                            <h4>{language === 'tr' ? 'Resim Seç' : 'Choose Picture'}</h4>
                            <div className="image-container">
                                {images.map((img) => (
                                    <img
                                        key={img.id}
                                        src={img.image} // BYTEA olarak saklanan resmi göster
                                        alt={`Resim ${img.id}`}
                                        className={selectedImages.includes(img.id) ? "selected" : ""}
                                        onClick={() => handleSelectImage(img.id)}
                                    />
                                ))}
                            </div>

                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Kapat
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Kaydet
                        </Button>
                    </Modal.Footer>
                </Modal>

            </div>
        </div>
    );
};

export default BlogList;
