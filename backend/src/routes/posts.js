const express = require("express");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
const authenticateAdmin = require("../middleWares/authenticateAdmin");

// bloglar için tümünü çekme metodu
router.get("/", async (req, res) => {
  const result = await pool.query(`
    SELECT 
        p.id, 
        p.title, 
        p.detail,
        p.endetail,
        p.date, 
        p.authorname, 
        p.keywords, 
        p.entitle, 
        p.enkeywords, 
        p.turkish_content_data, 
        p.english_content_data, 
        p.position, 
        p.status,
        ARRAY_AGG(images.id) AS img_id, 
        ARRAY_AGG(images.data) AS img_data  -- Tüm resimleri tek bir liste olarak al   
    FROM posts AS p 
    LEFT JOIN post_images ON p.id = post_images.post_id 
    LEFT JOIN images ON post_images.image_id = images.id 
    WHERE p.status = true
    GROUP BY p.id 
    ORDER BY position ASC
    `);
    const formattedData = result.rows.map(post => ({
      ...post,
      img_data: post.img_data[0] === null ? [] : post.img_data.map(img => img.toString('base64')),
      turkish_content_data: post.turkish_content_data || "",
      english_content_data: post.english_content_data || ""
    }));

    res.json(formattedData);
  
});

// bloglar için idye göre çekme metodu
router.get("/user/:id", async (req, res) => {
  const result = await pool.query(`
    SELECT 
        p.id, 
        p.title, 
        p.detail,
        p.endetail,
        p.date, 
        p.authorname, 
        p.keywords, 
        p.entitle, 
        p.enkeywords, 
        p.turkish_content_data, 
        p.english_content_data, 
        p.position, 
        p.status,
        ARRAY_AGG(images.id) AS img_id, 
        ARRAY_AGG(images.data) AS img_data  -- Tüm resimleri tek bir liste olarak al   
    FROM posts AS p 
    LEFT JOIN post_images ON p.id = post_images.post_id 
    LEFT JOIN images ON post_images.image_id = images.id 
    WHERE p.id=$1
    GROUP BY p.id 
    ORDER BY position ASC
    `,[req.params.id]);
    const formattedData = result.rows.map(post => ({
      ...post,
      img_data: post.img_data[0] === null ? [] : post.img_data.map(img => img.toString('base64')),
      turkish_content_data: post.turkish_content_data || "",
      english_content_data: post.english_content_data || ""
    }));

    res.json(formattedData);
  
});


/* admin için */


router.get("/admin-get",authenticateAdmin, async (req, res) => {
  const result = await pool.query(`
    SELECT 
        p.id, 
        p.title, 
        p.detail,
        p.endetail,
        p.date, 
        p.authorname, 
        p.keywords, 
        p.entitle, 
        p.enkeywords, 
        p.turkish_content_data, 
        p.english_content_data, 
        p.position, 
        p.status,
        ARRAY_AGG(images.id) AS img_id, 
        ARRAY_AGG(images.data) AS img_data  -- Tüm resimleri tek bir liste olarak al   
    FROM posts AS p 
    LEFT JOIN post_images ON p.id = post_images.post_id 
    LEFT JOIN images ON post_images.image_id = images.id 
    GROUP BY p.id 
    ORDER BY position ASC
    `);
    const formattedData = result.rows.map(post => ({
      ...post,
      img_data: post.img_data[0] === null ? [] : post.img_data.map(img => img.toString('base64')),
      turkish_content_data: post.turkish_content_data || "",
      english_content_data: post.english_content_data || ""
    }));

    res.json(formattedData);

});

// bloglar için yeni blog oluşturma metodu
router.post("/",authenticateAdmin, async (req, res) => {
  const { title, date, authorname, keywords, turkish_content_data, english_content_data, status, entitle, enkeywords, detail, endetail} = req.body;
  const result = await pool.query(
      "INSERT INTO posts (title, date, authorname, keywords, turkish_content_data, status, english_content_data, entitle, enkeywords, detail, endetail, position) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,(SELECT COALESCE(MAX(position), 0) + 1 FROM posts)) RETURNING id",
      [title, date, authorname, keywords, JSON.stringify(turkish_content_data), status, JSON.stringify(english_content_data), entitle, enkeywords, detail, endetail]
  );
  const postId = result.rows[0].id;

   

    res.status(201).json(postId);
});

// bloglar için carousel için resim yükleme metodu
router.post("/post-images", authenticateAdmin, async (req, res) => {
  const { postId, imageId } = req.body;


  

  try {
    const query = "INSERT INTO post_images (post_id, image_id) VALUES ($1, $2)";


    // Burada her kategori ile ilgili işlemi yapabilirsiniz
    await pool.query(query, [parseInt(postId), parseInt(imageId)]);



    res.status(201).json({ message: "Resim ilişkisi başarıyla eklendi!" });
  } catch (error) {
    console.error("Resim ilişkisi eklerken hata oluştu:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// bloglar için güncelleme çekme metodu
router.put("/update/:id",authenticateAdmin, async (req, res) => {
  const { date, authorname, keywords, turkish_content_data, english_content_data, id, status, title, entitle, enkeywords, detail, endetail} = req.body;
  
  await pool.query(
      "UPDATE posts SET date = $1, authorname = $2, keywords = $3, turkish_content_data = $4, status = $5, english_content_data = $6, title=$7, entitle = $8, enkeywords = $9, detail = $10, endetail = $11 WHERE id = $12",
      [date, authorname, keywords, JSON.stringify(turkish_content_data), status, JSON.stringify(english_content_data), title, entitle, enkeywords, detail, endetail, id]
  );
  res.json({ message: "Sayfa güncellendi" });
});

// blogların sıralamasını değiştirmek için metod
router.put("/change-position",authenticateAdmin, async (req, res) => {
  const { id, position } = req.body;
  try {
    await pool.query(
      "UPDATE posts SET position = $1 WHERE id = $2",
      [position, id]
  );
  res.json({ message: "Sayfa güncellendi" });
  } catch{
    console.error("post silinirken hata oluştu:", error);
    res.status(500).json({ error: "post silinirken hata oluştu!" });
  }
  
});

// blogları silmek için metod

router.delete("/:id",authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const  result = await pool.query("SELECT position FROM posts WHERE id = $1", [id]);
    if (result.length === 0) return; // Eğer sayfa bulunamazsa işlem yapma

    const deletedPostNo = result.rows[0].position;

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    await pool.query("UPDATE posts SET position = position - 1 WHERE position > $1", [deletedPostNo]);
    res.json({ message: "sayfa başarıyla silindi!" });
  } catch (error) {
    console.error("post silinirken hata oluştu:", error);
    res.status(500).json({ error: "post silinirken hata oluştu!" });
  }
});

module.exports = router;
