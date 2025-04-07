const express = require("express");
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
const multer = require("multer");

const storage = multer.memoryStorage(); // Resmi hafızada tut
const upload = multer({ storage: storage });
/* Ana sayfa için */
router.get("/", async (req, res) => {
    try {
        const query = `SELECT id, name, jobtitle, jobtitletype, enjobtitle, enjobtitletype, email, tel, facebook, instagram, x, youtube, google, behance, github, pinterest, linkedin, researchgate, googlescholar FROM teams ORDER BY priority ASC;`;
        const result = await pool.query(query, []); 
        

        // Eğer resim yoksa JSON verisini döndür
        res.json(result.rows);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

// id ye göre üye bilgisini çekmek için 
router.get("/:id", async (req, res) => {
    const { id } = req.params; 
    try {
        const query = `SELECT id, name, jobtitle, jobtitletype, enjobtitle, enjobtitletype, email, tel, facebook, instagram, x, youtube, google, behance, github, pinterest, linkedin, researchgate, googlescholar FROM teams WHERE id= $1`;
        const result = await pool.query(query, [id]); 

        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

// team memberların resim verisini çekme metodu
router.get("/image/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT image FROM teams WHERE id = $1`;
        const result = await pool.query(query, [parseInt(id)]);

        if (result.rows.length > 0 && result.rows[0].image) {
            const imageBuffer = result.rows[0].image;
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(imageBuffer);
        } else {
            res.status(404).json({ message: "Resim bulunamadı" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
/* admin teams list için için */
router.get("/admin/get",authenticateAdmin, async (req, res) => {
    try {
        const query = `SELECT id, name, jobtitle, jobtitletype, enjobtitle, enjobtitletype, priority, email, tel, facebook, instagram, x, youtube, google, behance, github, pinterest, linkedin, researchgate, googlescholar FROM teams ORDER BY priority ASC;`;
        const result = await pool.query(query, []); 
        // Eğer resim yoksa JSON verisini döndür
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});
/* admin teams detail için */
router.get("/admin/:id",authenticateAdmin, async (req, res) => {
    const { id } = req.params; 
    try {
        const query = `SELECT id, name, jobtitle, jobtitletype, enjobtitle, enjobtitletype, priority, email, tel, facebook, instagram, x, youtube, google, behance, github, pinterest, linkedin, researchgate, googlescholar FROM teams WHERE id= $1`;
        const result = await pool.query(query, [id]); 

        res.json(result.rows[0]);

    } catch (err) {

        res.status(500).send("Server error");
    }
});
/* admin team details için*/
router.get("/admin/image/:id",authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT image FROM teams WHERE id = $1`;
        const result = await pool.query(query, [parseInt(id)]);

        if (result.rows.length > 0 && result.rows[0].image) {
            const imageBuffer = result.rows[0].image;
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(imageBuffer);
        } else {
            res.status(404).json({ message: "Resim bulunamadı" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

// 🛑 Sadece adminlerin yeni ekip üyesi ekleyebilmesi için middleware ekledik!
router.post("/", authenticateAdmin, async (req, res) => {
    const { name, priority, jobTitle, jobTitleType, enJobTitle, enJobTitleType, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl } = req.body;
    try {
        const query = `
        INSERT INTO teams 
        (name, priority, jobtitle, jobtitletype, enjobtitle, enjobtitletype, email, tel, facebook, instagram, x, youtube, google, behance, github, pinterest, linkedin, researchgate, googlescholar) 
        VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) 
        RETURNING id;
      `;
      
      const result = await pool.query(query, [name, priority, jobTitle, jobTitleType, enJobTitle, enJobTitleType, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl]);
      
      const id = result.rows[0].id; // Dönen ID'yi al      

        res.status(201).json({"data":{id}, "message": "yayın başarıyla eklendi!" });
    } catch (error) {
        console.error("yayın ekleme hatası:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// admin resim ekleme kısmı için metod
router.put("/image", authenticateAdmin, upload.single("image"), async (req, res) => {
    try {
        const { userId } = req.body;
        let imageBuffer = req.file ? req.file.buffer : null; // Eğer dosya yoksa null bırak

        if (!imageBuffer) {
            // Eğer kullanıcı resim yüklemediyse, varsayılan bir resmi oku ve kullan
            const fs = require("fs");
            imageBuffer = fs.readFileSync("../frontend/public/no-image.jpg"); // Varsayılan resim dosya yolunu güncelle!
        }

        await pool.query("UPDATE teams SET image = $1 WHERE id = $2", [
            imageBuffer,
            userId,
        ]);

        res.json({ message: "Resim başarıyla yüklendi!" });
    } catch (error) {
        console.error("Yükleme hatası:", error);
        res.status(500).json({ message: "Sunucu hatası!" });
    }
});

// admin üye güncelleme fonksiyonu
router.put("/update-team-member", authenticateAdmin, async (req, res) => {
    const { id, priority, name, jobTitle, jobTitleType, enJobTitle, enJobTitleType, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl } = req.body;


    try {
        const query = `
            UPDATE teams 
            SET name = $1, 
                jobtitle = $2, 
                jobtitletype = $3, 
                email = $4, 
                tel = $5, 
                facebook = $6, 
                instagram = $7, 
                x = $8, 
                youtube = $9, 
                google = $10, 
                behance = $11, 
                github = $12, 
                pinterest = $13, 
                linkedin = $14, 
                researchgate = $15, 
                googlescholar = $16,
                enjobtitle = $17, 
                enjobtitletype = $18,
                priority = $19
            WHERE id = $20;

        `;

        const result = await pool.query(query, [name, jobTitle, jobTitleType, email, tel, facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl,enJobTitle,enJobTitleType, priority, parseInt(id)]
        );
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

//admin silme fonksiyonus
router.delete("/delete/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params; // req.params yerine req.body
        await pool.query("DELETE FROM teams WHERE id = $1", [parseInt(id)]);

        res.json({ message: "yayın başarıyla silindi!" });
    } catch (error) {
        console.error("yayın silinirken hata oluştu:", error);
        res.status(500).json({ error: "yayın silinirken hata oluştu!" });
    }
});


module.exports = router;
