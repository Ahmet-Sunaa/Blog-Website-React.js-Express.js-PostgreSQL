import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Modal, Form } from "react-bootstrap";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import TextEditor from "../../components/adminComponent/TextEditor";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
const PageList = () => {
    const [pages, setPages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showModalUnderPage, setShowModalUnderPage] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newUnderPageTitle, setNewUnderPageTitle] = useState("");
    const [newUnderPageFilter, setNewUnderPageFilter] = useState("");
    const [newUnderPageActive, setNewUnderPageActive] = useState(false);
    const [newUnderPageLanguage, setNewUnderPageLanguage] = useState("");

    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { language } = useLanguage();

    const [currentPage, setCurrentPage] = useState({
        id: "",
        title: "",
        entitle: "",
        slug: "",
        content_data: [],
        english_content_data: [],
        template: "",
        pageno: "",
        uactive: false,
        isfilter: false,
        ulanguage: [], //alt sayfa
        uid: [],
        utitle: [],
        filter: [],
        color: [],
        cid: [],
        status: false,
        headerstatus: false
    });

    useEffect(() => {
        fetchPages();
    }, []);

    //sayfaları backendden çekme işlemi
    const fetchPages = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/menu-pages/admin-get`, { headers: { Authorization: `Bearer ${token}` } });
            const formattedPages = response.data.map(page => ({
                ...page,
                content_data: page.content_data ? JSON.parse(page.content_data) : [] // JSON parse işlemi yap
            }));
            setPages(formattedPages);
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    };
    
    //sayfa silme
    const handleDelete = async (id) => {
        if (window.confirm("Bu sayfayı silmek istediğinizden emin misiniz?")) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_URL}/menu-pages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
                fetchPages(); // Listeyi güncelle
            } catch {
                localStorage.removeItem("token");
                navigate("/login");
            }

        }
    };


    const parsedContent = (page) =>{
        let parsedContent = [];

        if (language === 'tr') {
            // Eğer content_data bir string ise JSON.parse yap
            if (typeof page.content_data === "string") {
                try {
                    parsedContent = JSON.parse(page.content_data);

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
            else if (Array.isArray(page.content_data)) {
                parsedContent = page.content_data;
            }
            // Eğer content_data bir obje ise array içine al
            else if (typeof page.content_data === "object") {
                parsedContent = [page.content_data];
            }
            setCurrentPage({
                ...page,
                content_data: parsedContent //processedContent
            });
        }
        // Eğer content_data bir string ise JSON.parse yap
        if (typeof page.english_content_data === "string") {
            try {
                parsedContent = JSON.parse(page.english_content_data);

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
        else if (Array.isArray(page.english_content_data)) {
            parsedContent = page.english_content_data;
        }
        // Eğer content_data bir obje ise array içine al
        else if (typeof page.english_content_data === "object") {
            parsedContent = [page.english_content_data];
        }
        setCurrentPage({
            ...page,
            english_content_data: parsedContent //processedContent
        });

        console.log(page);

    }

    // sayfanın düzenleme işlemi (parse edilen editör içerikleri burda yapılıyor)
    const handleEdit = (page) => {
        parsedContent(page)
        setIsEditing(true);
        setShowModal(true);
    };

    // yeni sayfa ekleme
    const handleAddNew = () => {
        setCurrentPage({
            id: "",
            title: "",
            entitle: "",
            slug: "",
            pctitle: "",
            content_data: [], // JSON içeriği için dizi olarak başlat
            english_content_data: [],
            template: "",
            pageno: "",
            uactive: false,
            isfilter: false,
            ulanguage: [], //alt sayfa
            uid: [],
            utitle: [],
            filter: [],
            color: [],
            cid: [],
            status: false,
            headerstatus: false
        });
        setIsEditing(false);
        setShowModal(true);
    };


    // gerekli verileri parse eden ve ekleme düzenleme durumuna göre kaydetme
    const handleSave = async () => {
        try {
            const updatedPage = {
                ...currentPage,
                content_data: JSON.stringify(currentPage.content_data), // JSON formatına çeviriyoruz
                english_content_data: JSON.stringify(currentPage.english_content_data)
            };
            if (currentPage.title === '') {
                setError("Türkçe Başlığı girin")
            } else if (currentPage.entitle === '') {
                setError("İngilizce Başlığı girin")
            } else if (currentPage.slug === '') {
                setError("Linki girin")
            } else {
                if (isEditing) {
                    await axios.put(`${process.env.REACT_APP_API_URL}/menu-pages/update/${currentPage.id}`, updatedPage, { headers: { Authorization: `Bearer ${token}` } });
                } else {
                    await axios.post(`${process.env.REACT_APP_API_URL}/menu-pages`, updatedPage, { headers: { Authorization: `Bearer ${token}` } });
                }
                setShowModal(false);
                fetchPages(); // Güncellenmiş listeyi getir
            }

        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    };

    // sayfa rengi değiştirme
    const changePageColor = (color, index, e) => {
        e.preventDefault();
        const newPage = currentPage.color;
        newPage[index] = color;
        console.log(newPage);
        setCurrentPage({ ...currentPage, color: newPage });
    };

    // editör ekleme
    const addContentBlock = (type) => {
        const key = language === 'tr' ? 'content_data' : 'english_content_data';

        // Sadece ilgili dilin yeni uzunluğunu hesapla
        const newContentLength = currentPage[key].length + 1;

        // Eğer color ve cid dizileri, ilgili içeriğin uzunluğuna göre küçükse, güncelle
        //+3 sayfa arka plan rengi, filtre ve text container arka planı
        if (currentPage.color.length < newContentLength + 3) {
            setCurrentPage({
                ...currentPage,
                [key]: [...currentPage[key], [{ type, children: [{ text: "" }] }]], // Yeni içerik ekle
                color: [...currentPage.color, "#ffffff"].slice(0, newContentLength + 2), // 📌 Maksimum sınırda tut
                cid: [...currentPage.cid, ""].slice(0, newContentLength + 2) // 📌 Maksimum sınırda tut
            });
        } else {
            setCurrentPage({
                ...currentPage,
                [key]: [...currentPage[key], [{ type, children: [{ text: "" }] }]], // Yeni içerik ekle
            });
        }

    };

    // editör silme
    const removeContentBlock = (index) => {
        const key = language === 'tr' ? 'content_data' : 'english_content_data';
        const newContent = [...currentPage[key]];
        const newColor = [...currentPage.color];
        const newCid = [...currentPage.cid];
        newContent.splice(index, 1); // İlgili index'teki öğeyi sil
        newColor.splice(index, 1); // İlgili index'teki öğeyi sil
        newCid.splice(index, 1); // İlgili index'teki öğeyi sil
        setCurrentPage({ ...currentPage, [key]: newContent, color: newColor, cid: newCid });
    };

    // editör sıralama değiştirme
    const moveContentBlock = (index, direction) => {
        const key = language === 'tr' ? 'content_data' : 'english_content_data';
        const newContent = [...currentPage[key]];
        const newIndex = index + direction;

        // ⚠️ Eğer newIndex geçersizse işlemi sonlandır
        if (newIndex < 0 || newIndex >= newContent.length) return;

        // 📌 Elemanları yer değiştir
        [newContent[index], newContent[newIndex]] = [newContent[newIndex], newContent[index]];

        // 🔹 Güncellenmiş içeriği ilgili key'e set et
        setCurrentPage(prev => ({
            ...prev,
            [key]: [...newContent]
        }));


    };


    // sayfaları sıralama
    const movePage = async (page, direction) => {
        const newPages = [...pages].sort((a, b) => a.pageno - b.pageno); // Önce sıralayalım
        const index = newPages.findIndex(p => p.id === page.id);
        const targetIndex = index + direction;

        if (targetIndex < 0 || targetIndex >= newPages.length) return; // Geçersiz hareketleri engelle

        // Sayfaların pageno değerlerini değiştir
        const tempPageno = newPages[index].pageno;
        newPages[index].pageno = newPages[targetIndex].pageno;
        newPages[targetIndex].pageno = tempPageno;

        // Verileri güncelle
        setPages([...newPages]); // State güncelle

        // Backend'e güncelleme isteği gönder
        await updatePageOrder(newPages[index]);
        await updatePageOrder(newPages[targetIndex]);
        fetchPages();
    };

    // Veritabanında pageno değerini güncelleyen API fonksiyonu
    const updatePageOrder = async (page) => {
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/menu-pages/change-pageno`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ id: page.id, pageno: page.pageno }),
            });
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    };

    // alt başlık güncelleme
    const handleSaveUnderPage = async () => {
        try {
            currentPage.uid.map((id, index) => {
                return axios.put(`${process.env.REACT_APP_API_URL}/menu-pages/under-page-update`, {
                    id: id,
                    title: currentPage.utitle[index],
                    filter: currentPage.filter[index],
                    active: currentPage.uactive[index],
                    language: currentPage.ulanguage[index],
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
            });
            fetchPages(); // Güncellenmiş listeyi getir
            setShowModalUnderPage(false);
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    }
    
    // alt başlık ekleme
    const handleAddNewUnderPage = async () => {
        try {
            console.log(newUnderPageActive)
            axios.post(`${process.env.REACT_APP_API_URL}/menu-pages/under-page-add`, {
                pageId: currentPage.id,
                title: newUnderPageTitle,
                filter: newUnderPageFilter === null ? "" : newUnderPageFilter,
                active: newUnderPageActive,
                language: newUnderPageLanguage,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }

            });
            fetchPages(); // Güncellenmiş listeyi getir
            setShowModalUnderPage(false);
            alert("Alt başlık başarıyla eklendi");
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    }

    // alt başlık silme
    const handleDeleteUnderPage = async (id) => {
        try {
            axios.delete(`${process.env.REACT_APP_API_URL}/menu-pages/under-page-delete/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchPages();
            alert("Alt Başlık Başarıyla Silindi");
            setShowModalUnderPage(false);
        } catch {
            localStorage.removeItem("token");
            navigate("/login");
        }

    }
    // alt başlık değiştirme sayfasını açma işlemi ve currentpage değişkenine ilgili sayfanın verilerini aktarma
    const handleManageUnderPage = (page) => {
        parsedContent(page);
        setShowModalUnderPage(true);
    };

    // editör içeriğini kaydetme
    const editorContentSave = async (content, index) => {
        if (!content || content.length === 0) return; // İçerik boşsa işlem yapma
        console.log(content, index);
        if (language === 'tr') {
            const newContent = JSON.parse(JSON.stringify(currentPage.content_data)); // Derin kopya

            if (!newContent[index]) return; // Hatalı index kontrolü
            newContent[index] = content; // Yeni içeriği ekle
            setCurrentPage({ ...currentPage, content_data: newContent }); // State güncelle
        } else {
            const newContent = JSON.parse(JSON.stringify(currentPage.english_content_data)); // Derin kopya

            if (!newContent[index]) return; // Hatalı index kontrolü
            newContent[index] = content; // Yeni içeriği ekle
            setCurrentPage({ ...currentPage, english_content_data: newContent }); // State güncelle
        }
    };

    // renk bilgisini varsayılana döndürme
    const defaultColor = () => {
        const defaultColors = currentPage.color.map(() => ""); // Tüm değerleri "" yap
        setCurrentPage({ ...currentPage, color: defaultColors })
    };


    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="container mt-4" style={{ width: "75%" }}>
                <h2>Sayfa Yönetimi</h2>

                {/* Sayfa Ekleme Butonu */}
                <Button variant="success" onClick={handleAddNew} className="mb-3">
                    + Yeni Sayfa Ekle
                </Button>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Başlık</th>
                            <th>Slug</th>
                            <th>Durum</th>
                            <th>Sıra</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page, index) => (
                            <tr key={page.id}>
                                <td>{language === 'tr' ? page.title : page.entitle}</td>
                                <td>{page.slug}</td>
                                <td>{page.status ? "Aktif" : "Pasif"}</td>
                                <td>{page.pageno}</td>
                                <td>
                                    <Button variant="warning" size="sm" onClick={() => handleEdit(page)}>
                                        Düzenle
                                    </Button>{" "}
                                    <Button variant="warning" size="sm" onClick={() => handleManageUnderPage(page)}>
                                        Alt Başlıkları Yönet
                                    </Button>{" "}
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(page.id)}>
                                        Sil
                                    </Button>{" "}
                                    <Button variant="primary" size="sm" onClick={() => movePage(page, -1)} disabled={index === 0}>
                                        ⬆ Yukarı
                                    </Button>{" "}
                                    <Button variant="primary" size="sm" onClick={() => movePage(page, 1)} disabled={index === pages.length - 1}>
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
                            <Form.Label> {error} </Form.Label>
                            <Form.Group>
                                <Form.Label>Sayfa Adı</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentPage.title}
                                    onChange={(e) => setCurrentPage({ ...currentPage, title: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Sayfa İngilizce Adı</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={currentPage.entitle}
                                    onChange={(e) => setCurrentPage({ ...currentPage, entitle: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            {currentPage.color !== null && (
                                <React.Fragment id="color-side">
                                    {currentPage.color.map((color, index) => {
                                        return (
                                            <>
                                                {index === 3 && currentPage.slug === '/blogs' && (
                                                    <span> {language === 'tr' ? `Blog detay sayfası ` : `Blog Detail Page`} <br /></span>

                                                )}
                                                <span>
                                                    {index === 0
                                                        ? (language === 'tr' ? "Sayfa Arka Plan Rengi: " : "Page Background Color: ")
                                                        : (language === 'tr' ? `${index >= 3 && currentPage.slug === '/blogs' ? index - 2 : index}. İçerik Arka Planı` : `${index >= 3 && currentPage.slug === '/blogs' ? index - 2 : index}. Content Background Color`)}

                                                </span>
                                                <input
                                                    id={index}
                                                    type="color"
                                                    value={color}
                                                    onChange={(e) => changePageColor(e.target.value, index, e)}
                                                    title="Metin Rengi"
                                                />
                                                <div></div>
                                            </>
                                        );
                                    })}
                                    <Button variant="danger" size="sm" onClick={defaultColor}>
                                        Renklerin Hepsini Sıfırla
                                    </Button>

                                </React.Fragment>
                            )}
                            {currentPage.slug !== '/home' && currentPage.slug !== '/contact' && currentPage.slug !== '/about-us' && currentPage.slug !== '/blogs' && currentPage.slug !== '/publications' && currentPage.slug !== '/projects' && currentPage.slug !== '/teams' && (
                                <>
                                    <Form.Group>
                                        <Form.Label>Url Uzantısı (En Başa '/' Ekleyin)</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentPage.slug}
                                            onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Template</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentPage.template}
                                            onChange={(e) => setCurrentPage({ ...currentPage, template: e.target.value })}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label="Filtre Aktif"
                                            checked={currentPage.isfilter}
                                            onChange={(e) => setCurrentPage({ ...currentPage, isfilter: e.target.checked })}
                                        />
                                    </Form.Group>
                                </>
                            )}

                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Sayfa Aktif"
                                    checked={currentPage.status}
                                    onChange={(e) => setCurrentPage({ ...currentPage, status: e.target.checked })}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Headerda Görünsün mü?"
                                    checked={currentPage.headerstatus}
                                    onChange={(e) => setCurrentPage({ ...currentPage, headerstatus: e.target.checked })}
                                />
                            </Form.Group>

                            {/* 🟢 İçerik Düzenleme Alanı */}

                            {language === 'tr' ? currentPage.content_data.map((block, index) => (

                                <div >

                                    <div className="p-4" key={`${language}-${index}}`}>
                                        <h1 className="text-xl font-bold mb-4">Metin Editörü</h1>
                                        <TextEditor value={block} onSave={(content) => { editorContentSave(content, index) }} />

                                    </div>



                                    {/* İçerik yönetimi butonları */}
                                    <div className="d-flex gap-2 mt-2">
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlock(index, -1)} disabled={index === 0}>
                                            ⬆ Yukarı
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlock(index, 1)} disabled={index === currentPage.content_data.length - 1}>
                                            ⬇ Aşağı
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => removeContentBlock(index)}>
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            )) : currentPage.english_content_data.map((block, index) => (

                                <div >

                                    <div className="p-4" key={`${language}-${index}}`}>
                                        <h1 className="text-xl font-bold mb-4">Metin Editörü</h1>
                                        <TextEditor value={block} onSave={(content) => { editorContentSave(content, index) }} />

                                    </div>



                                    {/* İçerik yönetimi butonları */}
                                    <div className="d-flex gap-2 mt-2">
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlock(index, -1)} disabled={index === 0}>
                                            ⬆ Yukarı
                                        </Button>
                                        <Button variant="primary" size="sm" onClick={() => moveContentBlock(index, 1)} disabled={index === currentPage.english_content_data.length - 1}>
                                            ⬇ Aşağı
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => removeContentBlock(index)}>
                                            Sil
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {currentPage.slug !== '/home' && currentPage.slug !== '/contact' && currentPage.slug !== '/about-us' && currentPage.slug !== '/blogs' && currentPage.slug !== '/publications' && currentPage.slug !== '/projects' && currentPage.slug !== '/teams' && (
                                <>

                                    <Button variant="outline-secondary" onClick={() => addContentBlock("paragraph")}>
                                        + Yazı Ekle
                                    </Button>{" "}
                                </>
                            )}

                        </Form >
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


                <Modal show={showModalUnderPage} onHide={() => setShowModalUnderPage(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Alt Sayfa Ekle</Modal.Title>
                        <LanguageSwitcher />
                    </Modal.Header>
                    <Modal.Body>
                        <Form>

                            <h2>Yeni Alt Sayfa Ekle</h2>
                            <Form.Group>
                                <Form.Label>Alt başlık ismi</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newUnderPageTitle}
                                    onChange={(e) => setNewUnderPageTitle(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Filtre</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newUnderPageFilter} // Filter'da undefined olmasını engelle
                                    onChange={(e) => setNewUnderPageFilter(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Dil (en-tr)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newUnderPageLanguage} // Filter'da undefined olmasını engelle
                                    onChange={(e) => setNewUnderPageLanguage(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Filtre Aktif"
                                    checked={newUnderPageActive}
                                    onChange={(e) => setNewUnderPageActive(e.target.checked)}
                                />
                            </Form.Group>

                            <Button variant="outline-primary" onClick={handleAddNewUnderPage}>
                                Yeni ekle
                            </Button>


                            <h2>Mevcut Alt Sayfalar</h2>
                            {currentPage.utitle !== null && currentPage.utitle.map((underTitle, index) => (
                                <React.Fragment key={index}>
                                    <Form.Group>
                                        <Form.Label>Alt başlık ismi</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={underTitle}
                                            onChange={(e) => {
                                                const updatedUtitle = [...currentPage.utitle]; // utitle dizisini kopyala
                                                updatedUtitle[index] = e.target.value; // İlgili alt başlık değerini güncelle
                                                setCurrentPage({ ...currentPage, utitle: updatedUtitle }); // Güncellenmiş utitle ile currentPage'i güncelle
                                            }}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Filtre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentPage.filter[index] || ''} // Filter'da undefined olmasını engelle
                                            onChange={(e) => {
                                                const updatedFilter = [...currentPage.filter]; // filter dizisini kopyala
                                                updatedFilter[index] = e.target.value; // İlgili sayfa adı değerini güncelle
                                                setCurrentPage({ ...currentPage, filter: updatedFilter }); // Güncellenmiş filter ile currentPage'i güncelle
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Dil</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={currentPage.ulanguage[index] || ''} // dil'da undefined olmasını engelle
                                            onChange={(e) => {
                                                const updatedUlanguage = [...currentPage.ulanguage]; // dil dizisini kopyala
                                                updatedUlanguage[index] = e.target.value; // İlgili sayfa dili değerini güncelle
                                                setCurrentPage({ ...currentPage, ulanguage: updatedUlanguage }); // Güncellenmiş dil ile currentPage'i güncelle
                                            }}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label={`Filtre Aktif ${currentPage.uactive[index]}`}
                                            checked={currentPage.uactive[index]}
                                            onChange={(e) => {
                                                const updatedActive = [...currentPage.uactive]; // active dizisini kopyala
                                                updatedActive[index] = e.target.value; // İlgili active değerini güncelle
                                                setCurrentPage({ ...currentPage, uactive: updatedActive }); // Güncellenmiş active ile currentPage'i güncelle 
                                            }}
                                        />
                                    </Form.Group>
                                    <Button variant="outline-primary" onClick={() => handleDeleteUnderPage(currentPage.uid[index])}>
                                        sil
                                    </Button>
                                </React.Fragment>

                            ))}




                        </Form >
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModalUnderPage(false)}>
                            Kapat
                        </Button>
                        <Button variant="primary" onClick={handleSaveUnderPage}>
                            Kaydet
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    );
};

export default PageList;
