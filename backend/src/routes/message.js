const express = require("express");
const router = express.Router();
const pool = require("../PostgreDb/pgdb"); // PostgreSQL bağlantısı
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const jwt = require("jsonwebtoken");
const sendMail = require("../servicess/sendMail"); // Az önce oluşturduğumuz mail fonksiyonunu çağır

//map bilgisi için adresi çeken get metodu
router.get("/map-adress", async (req, res) => {
    try {
      const query = `SELECT hc.contactadress FROM homecontact hc`;
  
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      res.json(result.rows[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });
// kullanıcılar için mesaj gönderme fonksiyonu
router.post("/", async (req, res) => {
    try {
        const { title, sender_name, sender_email, content, id } = req.body;
        
      

        const newMessage = await pool.query(
            `INSERT INTO messages (title, sender_name, sender_email, content, user_id) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, sender_name, sender_email, content, id]
        );

        res.status(201).json(newMessage.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Mesaj gönderilirken hata oluştu" });
    }
});


// 📩 Tüm mesajları listeleme (Admin)
router.get("/",authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Mesajları çekerken hata oluştu." });
    }
});

// ✅ Mesajın okundu bilgisini değiştirme
router.put("/:id/toggle-read",authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        // Mevcut okundu bilgisini al
        const result = await pool.query("SELECT is_read FROM messages WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Mesaj bulunamadı." });
        }

        const currentStatus = result.rows[0].is_read;
        const newStatus = !currentStatus; // Durumu tersine çevir

        // Güncelleme işlemi
        await pool.query("UPDATE messages SET is_read = $1 WHERE id = $2", [newStatus, id]);

        res.json({ message: "Mesaj durumu değiştirildi.", is_read: newStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Durumu değiştirirken hata oluştu." });
    }
});



// ❌ Mesaj Silme
router.delete("/:id",authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM messages WHERE id = $1", [id]);
        res.json({ message: "Mesaj başarıyla silindi." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Mesaj silme sırasında hata oluştu." });
    }
});


//mesaj yanıtlama
router.post("/:id/reply", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
  const { reply } = req.body;
  
  try {

    // Mesajın sahibini bul
    const message = await pool.query("SELECT sender_name, sender_email, content FROM messages WHERE id = $1", [id]);

  // Burada veritabanından mesajı alacağız
   // Veritabanından mesajı al
  const senderEmail = message.rows[0].sender_email; // Gönderen kişinin e-posta adresi
  const senderName = message.rows[0].sender_name;   // Gönderen kişinin adı
  const messageContent = message.rows[0].content;   // Orijinal mesaj içeriği


  // E-posta gönderme fonksiyonunu çağır
  await sendMail(senderEmail, senderName, messageContent, reply);

  res.json({ message: 'Yanıt başarıyla gönderildi.' });
  

  } catch (error) {
    res.status(500).json({ error: "Sunucu hatası" });
  }
  });
  
  // id ye göre ilgili mesaj bilgisini çekme
  router.get("/get-by-id/:id",authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM messages WHERE id=$1 ORDER BY created_at DESC",[id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Mesajları çekerken hata oluştu." });
    }
});



  
module.exports = router;
