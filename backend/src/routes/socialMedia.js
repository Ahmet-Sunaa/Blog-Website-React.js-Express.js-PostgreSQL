const express = require("express");
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
/* Top bar için */
router.get("/public", async (req, res) => {
    try {
        const query = `
        SELECT 
           *
        FROM socialmedia
        `;

        const result = await pool.query(query);
        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).send("Server error");
    }
});
/* Admin sayfası için */
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        const query = `
        SELECT 
           *
        FROM socialmedia
        `;

        const result = await pool.query(query);
        res.json(result.rows[0]);

    } catch (err) {
        res.status(500).send("Server error");
    }
});

// 🛑 Sadece adminlerin Link değiştirebilmesi için middleware ekledik!
router.put("/", authenticateAdmin, async (req, res) => {
    const { facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl } = req.body;


    try {
        const query = `
            UPDATE socialmedia 
            SET facebook = $1, 
                instagram = $2, 
                x = $3, 
                youtube = $4, 
                google = $5, 
                behance = $6, 
                github = $7, 
                pinterest = $8, 
                linkedin = $9, 
                researchgate = $10, 
                googlescholar = $11 
            WHERE id = $12;

        `;

        const result = await pool.query(query, [facebookUrl, instagramUrl, xUrl, youtubeUrl, googleUrl, behanceUrl, githubUrl, pinterestUrl, linkedinUrl, researchGateUrl, googleScholarUrl, 1]
        );
        res.json(result.rows);

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
