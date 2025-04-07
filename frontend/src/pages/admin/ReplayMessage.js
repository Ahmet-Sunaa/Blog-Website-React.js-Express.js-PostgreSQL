import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar"
import './Admin.css'
const ReplyMessage = () => {
  const { id } = useParams(); // Mesajın ID'si
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState(null);
  const [reply, setReply] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessage();
  }, []);

  // mesajları göstermek için çekme işlemi
  const fetchMessage = async () => {
    try {
      const res = await fetch(`http://localhost:5000/message/get-by-id/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data[0]);
    } catch (error) {
      console.error("Mesaj alınırken hata");
      localStorage.removeItem('token');

    }
  };

  // cevap gönderme işlemi
  const sendReply = async () => {
    try {
      const res = await fetch(`http://localhost:5000/message/${id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      });

      if (res.ok) {
        alert("Yanıt başarıyla gönderildi!");
        navigate("/admin/messages");
      } else {
        alert("Yanıt gönderilirken hata oluştu.");
      }
    } catch (error) {
      console.error("Yanıt gönderme hatası");
      localStorage.removeItem('token');

    }
  };

  if (!message) return <div>Yükleniyor...</div>;

  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="reply-container">
        <h2>✉️ {message.sender_name} adlı kullanıcıya cevap yaz</h2>
        <p><strong>Konu:</strong>{message.title}</p>
        <p><strong>Mesaj:</strong> {message.content}</p>

        <textarea
          placeholder="Yanıtınızı buraya yazın..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        ></textarea>

        <button onClick={sendReply}>📨 Yanıtı Gönder</button>
      </div>
    </div>

  );
};

export default ReplyMessage;
