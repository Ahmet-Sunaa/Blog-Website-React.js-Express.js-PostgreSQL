const express = require("express");
const multer = require("multer");
const pool = require("../PostgreDb/pgdb"); // PostgreSQL bağlantısı
const authenticateAdmin = require("../middleWares/authenticateAdmin");

const router = express.Router();

const upload = multer();
// Bloglar için resim işlemleri !!!!
// 📌 Veritabanındaki tüm resimleri getir (Base64 formatında)
router.get("/",authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, data FROM images");
    const images = result.rows.map((row) => ({
      id: row.id,
      image: `data:image/jpeg;base64,${row.data.toString("base64")}`,
    }));

    res.json(images);
  } catch (error) {
    console.error("Resim getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// 📌 Tek bir resmi ID ile getir
router.get("/:id",authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT data FROM images WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Resim bulunamadı" });
    }

    const base64Image = result.rows[0].data.toString("base64");
    res.json({ id, image: `data:image/jpeg;base64,${base64Image}` });
  } catch (error) {
    console.error("Resim getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});


router.post("/",authenticateAdmin, upload.array("images"), async (req, res) => {
  try {
    for (let file of req.files) {
      await pool.query("INSERT INTO images (data) VALUES ($1) RETURNING id", [file.buffer]);
    }
    res.json({ message: "Resim başarıyla yüklendi"});
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});
// 📌 Resmi ID ile silme
router.delete("/:id",authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM images WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Resim bulunamadı" });
    }

    res.json({ message: "Resim başarıyla silindi" });
  } catch (error) {
    console.error("Resim silme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

router.post("/post-images/", authenticateAdmin, async (req, res) => {
  try {
    const { id, imageId } = req.body;
    await pool.query("INSERT INTO post_images (post_id, image_id) VALUES ($1, $2)", [id, imageId]);

    res.json({ message: "Resim başarıyla eklendi!" });
  } catch (error) {
    res.status(500).json({ error: "Resim eklenirken hata oluştu!" });
  }
});

router.delete("/post-images/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM post_images WHERE post_id = $1", [id]);
    res.json({ message: "Resim başarıyla silindi!" });
  } catch (error) {
    res.status(500).json({ error: "Resim silinirken hata oluştu!" });
  }
});
module.exports = router;
