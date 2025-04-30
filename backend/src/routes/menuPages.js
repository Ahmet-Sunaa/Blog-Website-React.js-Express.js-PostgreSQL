const express = require("express");
const router = express.Router();
const pool = require("../PostgreDb/pgdb"); // PostgreSQL bağlantısı
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const e = require("express");
/* Kullanıcılar için idye göre method ve tüm verilerin get metodu */
router.get("/user/:slug", async (req, res) => {
    const { slug } = req.params;
    try {
        const result = await pool.query(` 
            SELECT 
                p.id, 
                p.title, 
                p.slug, 
                p.status,
                p.entitle, 
                p.template, 
                p.content_data, 
                p.english_content_data,
                p.pageno,
                p.isfilter,
                p.headerstatus,
                (SELECT  ARRAY_AGG(c.id ORDER BY c.id ASC)  
                FROM page_colors AS c 
                WHERE c.page_id = p.id) AS cid, 
                (SELECT ARRAY_AGG(c.color ORDER BY c.id ASC) 
                FROM page_colors AS c 
                WHERE c.page_id = p.id) AS color, 
                (SELECT ARRAY_AGG(u.id) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS uid,
                (SELECT ARRAY_AGG(u.title) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS utitle,
                (SELECT ARRAY_AGG(u.active) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS uactive,
                (SELECT ARRAY_AGG(u.language) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS ulanguage,
                (SELECT ARRAY_AGG(u.filter) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS filter
            FROM pages AS p
            WHERE p.slug = $1           
            ORDER BY p.pageno ASC;
            `, ['/' + slug.toLowerCase()]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: "Sayfa bulunamadı1." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Sayfa alınırken hata oluştu." });
    }
});

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                p.id, 
                p.title, 
                p.slug, 
                p.status,
                p.entitle,
                p.headerstatus,
                (SELECT ARRAY_AGG(u.id) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS uid,
                (SELECT ARRAY_AGG(u.title) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS utitle,
                (SELECT ARRAY_AGG(u.active) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS uactive,
                (SELECT ARRAY_AGG(u.language) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS ulanguage,
                (SELECT ARRAY_AGG(u.filter) 
                FROM underpage AS u 
                WHERE u.pages_id = p.id) AS filter
            FROM pages AS p
            ORDER BY p.pageno ASC;
`);
res.json(result.rows);
        // if (result.rows.length > 0) {
        //     
        // } else {
        //     res.status(404).json({ error: "Sayfa bulunamadı2." });
        // }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Sayfa alınırken hata oluştu." });
    }
});
/* admin için get metodu */

router.get("/admin-get", authenticateAdmin, async (req, res) => {
    try{
        const result = await pool.query(`
            SELECT 
                    p.id, 
                    p.title, 
                    p.slug, 
                    p.status,
                    p.entitle, 
                    p.template, 
                    p.content_data, 
                    p.english_content_data,
                    p.pageno, 
                    p.isfilter,
                    p.headerstatus,
                    (SELECT  ARRAY_AGG(c.id ORDER BY c.id ASC)  
                    FROM page_colors AS c 
                    WHERE c.page_id = p.id) AS cid, 
                    (SELECT ARRAY_AGG(c.color ORDER BY c.id ASC) 
                    FROM page_colors AS c 
                    WHERE c.page_id = p.id) AS color, 
                    (SELECT ARRAY_AGG(u.id) 
                    FROM underpage AS u 
                    WHERE u.pages_id = p.id) AS uid,
                    (SELECT ARRAY_AGG(u.title) 
                    FROM underpage AS u 
                    WHERE u.pages_id = p.id) AS utitle,
                    (SELECT ARRAY_AGG(u.active) 
                    FROM underpage AS u 
                    WHERE u.pages_id = p.id) AS uactive,
                    (SELECT ARRAY_AGG(u.language) 
                    FROM underpage AS u 
                    WHERE u.pages_id = p.id) AS ulanguage,
                    (SELECT ARRAY_AGG(u.filter) 
                    FROM underpage AS u 
                    WHERE u.pages_id = p.id) AS filter
                FROM pages AS p
                ORDER BY p.pageno ASC;
    `);
    res.json(result.rows);
        // if (result.rows.length > 0) {
        //     res.json(result.rows);
        // } else {
        //     res.status(404).json({ error: "Sayfa bulunamadı2." });
        // }
    } catch(err){
        console.error(err)
    }
    
});

//sayfa ekleme metodu
router.post("/", authenticateAdmin, async (req, res) => {
    try {
        const { title, slug, content_data, english_content_data, status, entitle, template, color, isfilter, headerstatus } = req.body;
        
        const id = await pool.query(
            "INSERT INTO pages (title, entitle, slug, content_data, english_content_data, status, template,  isfilter, headerstatus, pageno) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (SELECT COALESCE(MAX(pageno), 0) + 1 FROM pages)) RETURNING id",
            [title, entitle, slug.toLowerCase(), JSON.stringify(content_data), JSON.stringify(english_content_data), status, template, isfilter, headerstatus]
        );

        const queries = Array.from({ length: 3 }, () =>
            pool.query(
                "INSERT INTO page_colors (page_id, color) VALUES ($1, $2)",
                [id.rows[0].id, "#ffffff"]
            )
        );

        await Promise.all(queries); // Tüm sorguları aynı anda çalıştır


        await Promise.all(color.map(c =>
            pool.query(
                "INSERT INTO page_colors (page_id, color) VALUES ($1, $2)",
                [id.rows[0].id, c]
            )
        ));



        res.json({ message: "Sayfa eklendi" });
    } catch (error) {
        console.error(error);
        res.json({ message: "Sayfa eklenirken hata meydana geldi" });

    }

});

//sayfa güncelleme metodu
router.put("/update/:id", authenticateAdmin, async (req, res) => {
    const { title, entitle, slug, content_data, english_content_data, status, template, isfilter, color, cid, headerstatus } = req.body;
    try {
        await pool.query(
            "UPDATE pages SET title = $1, entitle = $2, slug = $3, content_data = $4, status = $5, isfilter = $6, template = $7, english_content_data = $8, headerstatus = $9 WHERE id = $10",
            [title, entitle, slug.toLowerCase(), JSON.stringify(content_data), status, isfilter, template, JSON.stringify(english_content_data), headerstatus, req.params.id]
        );
        
        const colorsIdQuery = await pool.query(
            "SELECT id FROM page_colors WHERE page_id = $1 ORDER BY id ASC",
            [req.params.id]
        );
        const colorsId = colorsIdQuery.rows.map(row => row.id); // ID listesini diziye çevirdik
        
        const newIds = new Set(cid); // Yeni gelen ID'leri Set'e çeviriyoruz (hızlı karşılaştırma için)
        const oldIds = new Set(colorsId); // Eski ID'leri Set'e çeviriyoruz
        
        // 🔹 **Silinecek ID’ler** (Eskide var ama yenide yoksa sil)
        const idsToDelete = colorsId.filter(id => !newIds.has(id));
        
        // 🔹 **Eklenecek ID’ler** (Yenide var ama eskide yoksa ekle)
        const idsToInsert = cid.filter(id => !oldIds.has(id));
        
        // 🔹 **Güncellenecek ID’ler** (Hem eski hem yeni listede varsa güncelle)
        const idsToUpdate = colorsId.filter(id => newIds.has(id));
        
        // ✅ Silme işlemi
        for (const id of idsToDelete) {
            await pool.query("DELETE FROM page_colors WHERE id = $1", [id]);
        }
        
        // ✅ Ekleme işlemi
        for (const id of idsToInsert) {
            const colorIndex = cid.indexOf(id); // CID içindeki indeksini bul
            if (colorIndex !== -1) {
                await pool.query(
                    "INSERT INTO page_colors (page_id, color) VALUES ($1, $2)",
                    [req.params.id, color[colorIndex]]
                );
            }
        }
        
        // ✅ Güncelleme işlemi
        for (const id of idsToUpdate) {
            const colorIndex = cid.indexOf(id);
            if (colorIndex !== -1) {
                await pool.query(
                    "UPDATE page_colors SET color = $1 WHERE id = $2",
                    [color[colorIndex], id]
                );
            }
        }
        

        
    
        res.json({ message: "Sayfa güncellendi" });
    } catch (error) {
        console.error(error);
        res.json({ message: "Sayfa güncellenirken hata oluştu" });
    }

});

//alt sayfa güncelleme methodu
router.put("/under-page-update", authenticateAdmin, async (req, res) => {
    const { id, title, filter, active, language } = req.body;

    await pool.query(
        "UPDATE underpage SET title = $1, filter = $2, active = $3, language = $4 WHERE id = $5",
        [title, filter, active, language, id]
    );
    res.json({ message: "Sayfa güncellendi" });
});
//alt sayfa ekleme methodu
router.post("/under-page-add", authenticateAdmin, async (req, res) => {
    try {
        const { title, filter, pageId, active, language } = req.body;
        await pool.query(
            "INSERT INTO underpage (title, filter, pages_id, active, language) VALUES ($1, $2, $3, $4, $5)",
            [title, filter, pageId, active, language]
        );

        res.json({ message: "Sayfa eklendi" });
    } catch (error) {
        console.error(error);
    }
});
//al sayfa silme methodu
router.delete("/under-page-delete/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query("DELETE FROM underpage WHERE id = $1", [id]);

        res.json({ message: "Sayfa güncellendi" });
    } catch (error) {
        console.error(error);
    }

});
//sayfa sıralama değiştirme methodu
router.put("/change-pageno", authenticateAdmin, async (req, res) => {
    const { id, pageno } = req.body;
    await pool.query(
        "UPDATE pages SET pageno = $1 WHERE id = $2",
        [pageno, id]
    );
    res.json({ message: "Sayfa güncellendi" });
});

//sayfa silme methodu
router.delete("/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT pageno FROM pages WHERE id = $1", [id]);
        if (result.length === 0) return; // Eğer sayfa bulunamazsa işlem yapma

        const deletedPagePageno = result.rows[0].pageno;

        await pool.query("DELETE FROM pages WHERE id = $1", [id]);
        await pool.query("UPDATE pages SET pageno = pageno - 1 WHERE pageno > $1", [deletedPagePageno]);
        res.json({ message: "sayfa başarıyla silindi!" });
    } catch (error) {
        console.error("sayfa silinirken hata oluştu:", error);
        res.status(500).json({ error: "Possayfat silinirken hata oluştu!" });
    }
});



module.exports = router;
