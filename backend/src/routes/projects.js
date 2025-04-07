const express = require("express");
const multer = require('multer');
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");

/* Ana sayfa için */
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
         *
      FROM projects
      `;

        const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});
//admin sayfası için
router.get("/admin",authenticateAdmin, async (req, res) => {
    try {
        const query = `
      SELECT 
         *
      FROM projects
      `;

        const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

router.get("/proje/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT 
           *
        FROM projects
        WHERE id = $1
        `;

        const result = await pool.query(query, [parseInt(id)]);
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🛑 Sadece adminlerin yeni proje ekleyebilmesi için middleware ekledik!
router.post("/", authenticateAdmin, async (req, res) => {
    const { title, content, date, projectOwner, keywords, enTitle, enContent, enKeywords } = req.body;

    try {
        const query = `
        INSERT INTO projects (title, content, date, projectOwner, keywords, entitle, encontent, enkeywords) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
      `;
        await pool.query(query, [title, content, date, projectOwner, keywords, enTitle, enContent, enKeywords]);



        res.status(201).json({ "message": "Proje başarıyla eklendi!" });
    } catch (error) {
        console.error("Post ekleme hatası:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// proje güncellemek için metod
router.put("/update-project", authenticateAdmin, async (req, res) => {
    const { id, title, content, date, projectOwner,  keywords, enTitle, enContent, enKeywords } = req.body;

    try {
        const query = `
            UPDATE projects SET title = $1, content = $2, date = $3, projectowner = $4, keywords = $5, entitle=$6, encontent=$7, enkeywords=$8 WHERE id = $9
        `;

        const result = await pool.query(query, [title, content, date, projectOwner, keywords,enTitle, enContent, enKeywords, parseInt(id)]
        );
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

//proje silmek için metod
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params; // req.params yerine req.body
        await pool.query("DELETE FROM projects WHERE id = $1", [parseInt(id)]);

        res.json({ message: "post başarıyla silindi!" });
    } catch (error) {
        console.error("post silinirken hata oluştu:", error);
        res.status(500).json({ error: "Post silinirken hata oluştu!" });
    }
});


module.exports = router;
