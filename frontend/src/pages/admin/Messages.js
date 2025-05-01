import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "./Admin.css";
import axios from "axios";

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const token = localStorage.getItem("token");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const [selectedMessage, setSelectedMessage] = useState(null); // Seçili mesajı sakla
    const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
    const [showModal, setShowModal] = useState(false); // Modal açık/kapalı durumu

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
        if (user.role === "admin" || user.role === "administrator") {
            setIsAuthorized(true);
            fetchMessages();
        } else {
            setIsAuthorized(false);
            navigate("/login");
        }
    };

    // 📩 Mesajları Getir
    const fetchMessages = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/message`, {
                headers: { Authorization: `Bearer ${token}` },
            }).catch(() => {localStorage.removeItem("token"); navigate("/login")});
            setMessages(res.data);
       
    };

    // ✅ Okundu/Okunmadı Durumunu Değiştir
    const toggleReadStatus = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/message/${id}/toggle-read`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();
            if (data.is_read !== undefined) {
                setMessages((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === id ? { ...msg, is_read: data.is_read } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Durum değiştirme hatası:");
            localStorage.removeItem('token');
        }
    };

    // ❌ Mesajı Sil
    const deleteMessage = async (id) => {
        if (!window.confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;

        try {
            await fetch(`${process.env.REACT_APP_API_URL}/message/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMessages();
        } catch (error) {
            console.error("Silme hatası");
            localStorage.removeItem('token');
        }
    };
    
    // cevapla butonuna basıldığında zaten okundu durumundaysa tekrar toggle olmasını engelleme
    const replyMessage = async (id)=>{
        if(messages[selectedMessageIndex].is_read===false){
            toggleReadStatus(id);
        }
        navigate(`/admin/reply-message/${id}`)
    }

    // 📌 Mesaj Detaylarını Açan Fonksiyon
    const handleShowDetails = (message, index) => {
        setSelectedMessage(message);
        setSelectedMessageIndex(index);
        setShowModal(true);
    };

    if (!isAuthorized) {
        return <div>Yetkisiz giriş</div>;
    }

    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="message-container">
                <h2>📩 Mesaj Yönetimi</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Kimden</th>
                            <th>Konu</th>
                            <th>Tarih</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages.map((msg,index) => (
                            <tr key={msg.id} className={msg.is_read ? "read-message" : "unread-message"}>
                                <td>{msg.sender_name} ({msg.sender_email})</td>
                                <td>{msg.title}</td>
                                <td>{new Date(msg.created_at).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleShowDetails(msg, index)}>🔍 Detaylar</button>
                                    <button onClick={() => toggleReadStatus(msg.id)}>
                                        {msg.is_read ? "🔴 Okunmadı Yap" : "✅ Okundu Yap"}
                                    </button>
                                    <button onClick={() => deleteMessage(msg.id)}>❌ Sil</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* 📌 Detayları Gösteren Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>📩 Mesaj Detayları</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedMessage && (
                            <div>
                                <p><strong>Kimden:</strong> {selectedMessage.sender_name} ({selectedMessage.sender_email})</p>
                                <p><strong>Konu:</strong> {selectedMessage.subjects}</p>
                                <p><strong>Mesaj:</strong> {selectedMessage.content}</p>
                                <p><strong>Tarih:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Modal.Footer>
                            {/* 📨 Cevapla Butonu */}
                            <Button
                                variant="primary"
                                onClick={() => replyMessage(selectedMessage.id, selectedMessage.index)}
                                
                            >
                                ✉️ Cevapla
                            </Button>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Kapat
                            </Button>
                        </Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Messages;
