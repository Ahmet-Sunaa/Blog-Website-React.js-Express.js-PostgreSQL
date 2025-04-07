const express = require("express");
const multer = require('multer');
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
const upload = multer(); 


router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
          a.id,
          a.title,
          a.content,
          a.entitle,
          a.encontent,
          ARRAY_AGG(i.data) AS images,
          ARRAY_AGG(i.id) AS img_id
      FROM about a
      LEFT JOIN imageAbout i ON a.id = i.about_id
      GROUP BY a.id, a.title, a.content;

      `;

    const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.

    const abouts = result.rows.map(about => {
      if(about.images[0] === null){
        return about;
      }
      else{
          return { 
          ...about, 
          images: about.images.map(img => img.toString('base64')) // Her resmi Base64 formatına çevir
        };
      }
    });
    res.json(abouts[0]);
    
  } catch (err) {
    res.status(500).send("Server error");
  }
});
//admin sayfası için
router.get("/admin",authenticateAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
          a.id,
          a.title,
          a.content,
          a.entitle,
          a.encontent,
          ARRAY_AGG(i.data) AS images,
          ARRAY_AGG(i.id) AS img_id
      FROM about a
      LEFT JOIN imageAbout i ON a.id = i.about_id
      GROUP BY a.id, a.title, a.content;

      `;

    const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.

    const abouts = result.rows.map(about => {
      if(about.images[0] === null){
        return about;
      }
      else{
          return { 
          ...about, 
          images: about.images.map(img => img.toString('base64')) // Her resmi Base64 formatına çevir
        };
      }
    });
    res.json(abouts[0]);
    
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.put('/',authenticateAdmin, async (req, res) => {
  const { title, jsonContent, enTitle, jsonEnContent } = req.body;
  try {
    await pool.query('UPDATE about SET title = $1, content = $2, entitle = $3, encontent = $4 WHERE id = 1', [title, jsonContent, enTitle, jsonEnContent]);
    res.json({ message: 'Başarıyla güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Güncelleme hatası' });
  }
});

// 📌 Yeni Resim Yükleme
router.post('/images',authenticateAdmin, upload.array('images'), async (req, res) => {
  try {
    const { aboutId } = req.body;  // aboutId'yi body'den al
    if (!aboutId) {
      return res.status(400).json({ error: 'aboutId parametresi eksik' });
    }    
    for (let file of req.files) {
      await pool.query('INSERT INTO imageAbout (about_id, data) VALUES ($1, $2)', [aboutId,file.buffer]);
    }
    res.json({ message: 'Resimler başarıyla yüklendi' });
  } catch (error) {

    res.status(500).json({ error: 'Resim yükleme hatası' });
  }
});

// 📌 Resim Silme
router.delete('/images',authenticateAdmin, async (req, res) => {
  const { imageId } = req.body;
  try {
    await pool.query('DELETE FROM imageAbout WHERE id = $1', [imageId]);
    res.json({ message: 'Resim başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Silme hatası' });
  }
});


module.exports = router;
