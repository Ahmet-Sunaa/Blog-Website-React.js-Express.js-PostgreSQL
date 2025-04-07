import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext";
import { useLocation } from 'react-router-dom';
import "./User.css";

const Publications = () => {
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [publications, setPublications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [color, setColor] = useState([]);
    const { language } = useLanguage();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const filters = params.get('filter');
    const [page, setPage] = useState(null);
    const slug = location.pathname.split("/").pop();
    // useEffect(() => {

    //     if (filters !== null) {
    //         setSelectedDate(filters.match(/\d+/g) === null ? "" : filters.match(/\d+/g)[0]);
    //         setSearch(filters.match(/[a-zA-Z]+/g) === null ? "" : filters.match(/[a-zA-Z]+/g).map(filter => filter).join(" "));
    //     }

    //     axios
    //         .get("http://localhost:5000/publications")
    //         .then((response) => {
    //             if (response.data.length === 0) {
    //                 setError("Proje yok.");
    //             } else {
    //                 if (language === 'tr')
    //                     setPublications(response.data);
    //                 else {
    //                     setPublications(response.data.filter((publication) => publication.entitle !== null));

    //                 }
    //             }
    //         })
    //         .catch(() => {
    //             setError("Projeler yüklenirken bir hata oluştu.");
    //         })
    //         .finally(() => setLoading(false));
    // }, []);

    useEffect(() => {
        const pathSlug = location.pathname.split("/").pop() || "home";

        if (filters !== null) {
            setSelectedDate(filters.match(/\d+/g) === null ? "" : filters.match(/\d+/g)[0]);
            setSearch(filters.match(/[a-zA-Z]+/g) === null ? "" : filters.match(/[a-zA-Z]+/g).map(filter => filter).join(" "));
        }

        Promise.all([
            axios.get("http://localhost:5000/publications"),
            axios.get(`http://localhost:5000/menu-pages/user/${pathSlug}`)
        ])
            .then(([publicationsRes, colorRes]) => {
                if (publicationsRes.data.length === 0) {
                    setError("Proje yok.");
                } else {
                    if (language === 'tr')
                        setPublications(publicationsRes.data);
                    else {
                        setPublications(publicationsRes.data.filter((publication) => publication.entitle !== null));

                    }
                }

                setColor(colorRes.data.color);
            })
            .catch(err => console.error("Error fetching data:", err))
            .finally(() => setLoading(false));

    }, []);

    const uniqueYears = [...new Set(publications.map(pub => pub.date.split("-")[0]))];

    const filteredPublications = publications.filter(
        (pub) =>
            (selectedDate === "" || pub.date.split("-")[0] === selectedDate) &&
            (search === "" || language === 'tr' ? pub.keywords.toLowerCase().includes(search.toLowerCase()) : pub.enkeywords !== null ? pub.enkeywords.toLowerCase().includes(search.toLowerCase()) : '')


    );
    console.log(color);

    useEffect(() => {
        axios.get(`http://localhost:5000/menu-pages/user/${slug}`)
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

    if (loading) return <p>Yükleniyor...</p>;
    if (error) return <h2 className="error">{error}</h2>;
    if (!page) return <h2>Sayfa bulunamadı</h2>;
    if (page.status === false) return <h2>Sayfa bulunamadı</h2>;



    return (
        <div className="publications-container" style={{backgroundColor: color[0]}}>
            {/* SOL TARAF: Filtreleme Alanı */}
            <div className="filter-section" style={{backgroundColor: color[1]}}>
                <h3>{language === 'tr' ? 'Filtrele' : 'Filter'}</h3>
                <input
                    type="text"
                    placeholder={language === 'tr' ? 'Anahtar Kelime Giriniz...' : 'Enter Keyword...'}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select key='select-box' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                    <option key='default' value="">{language === 'tr' ? 'Tarih Seç' : 'Choose a Date'}</option>
                    {uniqueYears.map((year, index) => (
                        <option key={`year-${index}`} value={year}>{year}</option>
                    ))}
                </select>

            </div>

            {/* SAĞ TARAF: Yayın Listesi */}
            <div className="publications-list" style={{backgroundColor: color[2]}}>
                {filteredPublications.length > 0 ? (
                    filteredPublications.map((pub) => (
                        <React.Fragment key={'div' + pub.id}>
                            {language === 'en' && pub.entitle !== null && pub.entitle !== '' && (
                                <a
                                    href={pub.link} // Yayının bağlantısı
                                    target="_blank" // Yeni sekmede aç
                                    rel="noopener noreferrer" // Güvenlik için
                                    className="publication-card"
                                    key={pub.id}
                                    style={{backgroundColor: color[3]}}
                                >
                                    <h4>{pub.entitle}</h4>
                                    <p className="publication-meta">
                                        ({pub.date})
                                    </p>
                                    <p className="publication-source"><em>{pub.enkeywords}</em></p>
                                </a>
                            )}
                            {language === 'tr' && (
                                <a
                                    href={pub.link} // Yayının bağlantısı
                                    target="_blank" // Yeni sekmede aç
                                    rel="noopener noreferrer" // Güvenlik için
                                    className="publication-card"
                                    key={pub.id}
                                    style={{backgroundColor: color[3]}}
                                >
                                    <h4>{pub.title}</h4>
                                    <p className="publication-meta">
                                        ({pub.date})
                                    </p>
                                    <p className="publication-source"><em>{pub.keywords}</em></p>
                                </a>
                            )}
                        </React.Fragment>

                    ))
                ) : (
                    <p className="no-results">{language === 'tr' ? 'Sonuç bulunamadı' : 'No Result'}.</p>
                )}
            </div>
        </div>
    );
};

export default Publications;
