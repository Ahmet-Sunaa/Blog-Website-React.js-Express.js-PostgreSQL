const express = require("express");
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");

//ana sayfa için
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
         *
      FROM publications
      `;

        const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});
//admin panel için
router.get("/admin",authenticateAdmin, async (req, res) => {
    try {
        const query = `
      SELECT 
         *
      FROM publications
      `;

        const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});
router.get("/publications/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT 
           *
        FROM publications
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
    const { title, date, keywords, link, enTitle, enKeywords  } = req.body;

    try {
        const query = `
        INSERT INTO publications (title, date, keywords, link, entitle, enkeywords) 
        VALUES ($1, $2, $3, $4, $5, $6);
      `;
        await pool.query(query, [title, date, keywords, link, enTitle, enKeywords]);



        res.status(201).json({ "message": "yayın başarıyla eklendi!" });
    } catch (error) {
        console.error("yayın ekleme hatası:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// yayın güncellemek için metod
router.put("/update-publications", authenticateAdmin, async (req, res) => {
    const { id, title, date, keywords, link, enTitle, enKeywords } = req.body;

    try {
        const query = `
            UPDATE publications SET title = $1, date = $2, keywords = $3, link = $4, entitle = $5, enkeywords = $6 WHERE id = $7
        `;

        const result = await pool.query(query, [title, date, keywords, link, enTitle, enKeywords, parseInt(id)]
        );
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// yayın silmek için metod
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params; // req.params yerine req.body
        await pool.query("DELETE FROM publications WHERE id = $1", [parseInt(id)]);

        res.json({ message: "yayın başarıyla silindi!" });
    } catch (error) {
        console.error("yayın silinirken hata oluştu:", error);
        res.status(500).json({ error: "yayın silinirken hata oluştu!" });
    }
});


module.exports = router;
