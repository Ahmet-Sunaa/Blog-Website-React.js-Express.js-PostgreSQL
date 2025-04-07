const express = require("express");
const multer = require('multer');
const authenticateAdmin = require("../middleWares/authenticateAdmin");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
const upload = multer(); 

// footer get metodu
router.get("/footer", async (req, res) => {
  try {
    const query = `
      SELECT 
          hc.contactadress,
          hc.contacttitle,
          hc.contactentitle,
          hc.contactphone,
          hc.contactemail,
          hc.footercolor,
          hc.footertextcolor
      FROM homecontact hc

      `;

    const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.

    res.json(result.rows[0]);
    
  } catch (err) {
    console.log(err);

    res.status(500).send("Server error");
  }
});

// entries get metodu
router.get("/entries", async (req, res) => {
    try {
      const query = `
        SELECT 
            hc.hometitle,
            hc.homeentitle,
            hc.homecontent,
          hc.homeencontent,
            ARRAY_AGG(i.data) AS images
        FROM homecontact hc
        LEFT JOIN imagehomecontact i ON hc.id = i.hc_id
        GROUP BY hc.hometitle, hc.homeentitle, hc.homecontent, hc.homeencontent;
        `;
  
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      const homecontacts = result.rows.map(homecontact => {
        if(homecontact.images[0] === null){
          return homecontact;
        }
        else{
            return { 
            ...homecontact, 
            images: homecontact.images.map(img => img.toString('base64')) // Her resmi Base64 formatına çevir
          };
        }
      });
      res.json(homecontacts[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });

  // home get metodu
  router.get("/home", async (req, res) => {
    try {
      const query = `SELECT hc.homeblogstitle, hc.homeenblogstitle FROM homecontact hc`;
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      res.json(result.rows[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });

// topbar get metodu
router.get("/topbar", async (req, res) => {
    try {
      const query = `SELECT hc.topbarcolor1, hc.topbarcolor2, hc.topbarcolor3 FROM homecontact hc`;
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      res.json(result.rows[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });

// header get metodu
router.get("/header", async (req, res) => {
    try {
      const query = `SELECT hc.headertitle, hc.headertitlecolor, hc.headercolor1, 
      hc.headercolor2, hc.headercolor3, hc.headercolor4, hc.headercolor5, 
      hc.headercolor6, hc.headercolor7, hc.headerlanguagebuttontext,
      hc.headercolor8, hc.headerlanguagebuttonentext  
      FROM homecontact hc`;
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      res.json(result.rows[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });

// dil değiştirme butonu için get metodu
router.get("/language-switcher", async (req, res) => {
    try {
      const query = `SELECT hc.headercolor7, hc.headerlanguagebuttontext,
      hc.headercolor8, hc.headerlanguagebuttonentext  
      FROM homecontact hc`;
      const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.
  
      res.json(result.rows[0]);
      
    } catch (err) {
      console.log(err);
  
      res.status(500).send("Server error");
    }
  });


//admin sayfası için
router.get("/admin",authenticateAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
          hc.id,
          hc.hometitle,
          hc.homeentitle,
          hc.homecontent,
          hc.homeencontent,
          hc.homeblogstitle,
          hc.homeenblogstitle,
          hc.footercolor,
          hc.footertextcolor,
          hc.contactadress,
          hc.contacttitle,
          hc.contactentitle,
          hc.contactphone,
          hc.contactemail,
          hc.topbarcolor1,
          hc.topbarcolor2,
          hc.topbarcolor3,
          hc.headertitle,
          hc.headertitlecolor,
          hc.headercolor1,
          hc.headercolor2,
          hc.headercolor3,
          hc.headercolor4,
          hc.headercolor5,
          hc.headercolor6,
          hc.headercolor7,
          hc.headercolor8,
          hc.headerlanguagebuttontext,
          hc.headerlanguagebuttonentext,
          ARRAY_AGG(i.data) AS images,
          ARRAY_AGG(i.id) AS img_id
      FROM homecontact hc
      LEFT JOIN imagehomecontact i ON hc.id = i.hc_id
      GROUP BY hc.id, hc.contactadress,hc.homeblogstitle, hc.homeenblogstitle, hc.contacttitle,  
      hc.footertextcolor, hc.footercolor, hc.contactentitle, hc.contactphone, hc.contactemail, hc.homecontent, hc.homeencontent,
      hc.topbarcolor1, hc.topbarcolor2, hc.topbarcolor3, hc.headertitle, hc.headertitlecolor,
      hc.headercolor1, hc.headercolor2, hc.headercolor3, hc.headercolor4, hc.headercolor5,
      hc.headercolor6, hc.headercolor7, hc.headercolor8, hc.headerlanguagebuttontext, hc.headerlanguagebuttonentext;

      `;

    const result = await pool.query(query, []); // Hazırlanmış ifade olarak çalıştırıyoruz.

    const homecontacts = result.rows.map(homecontact => {
      if(homecontact.images[0] === null){
        return homecontact;
      }
      else{
          return { 
          ...homecontact, 
          images: homecontact.images.map(img => img.toString('base64')) // Her resmi Base64 formatına çevir
        };
      }
    });
    res.json(homecontacts[0]);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

//Genel bilgileri güncelleme metodu
router.put('/',authenticateAdmin, async (req, res) => {
  const { footertextcolor, hometitle, homeentitle, homecontent, homeencontent, homeblogstitle, homeenblogstitle, contactadress, contacttitle, contactentitle, contactphone, 
    footercolor, contactemail, topbarcolor1, topbarcolor2, topbarcolor3, headertitle, headertitlecolor, headercolor1, headercolor2, headercolor3, headercolor4, 
    headercolor5, headercolor6, headercolor7, headercolor8, headerlanguagebuttontext, headerlanguagebuttonentext } = req.body;
  try {
    await pool.query(`UPDATE homecontact SET hometitle = $1, homeentitle = $2, homecontent = $3, homeencontent = $4, homeblogstitle = $5, homeenblogstitle = $6, contactadress = $7, 
          contacttitle = $8, contactentitle = $9, contactphone = $10, contactemail = $11, topbarcolor1 = $12, topbarcolor2 = $13, topbarcolor3 = $14, headertitle = $15, headertitlecolor = $16, 
          headercolor1 = $17, headercolor2 = $18, headercolor3 = $19, headercolor4 = $20, headercolor5 = $21, headercolor6 = $22, headercolor7 = $23, headerlanguagebuttontext = $24,  
          headercolor8 = $25, headerlanguagebuttonentext = $26, footercolor = $27, footertextcolor = $28 WHERE id = 1`, 
        [hometitle, homeentitle, homecontent, homeencontent, homeblogstitle, homeenblogstitle, contactadress, contacttitle, contactentitle, contactphone, 
          contactemail, topbarcolor1, topbarcolor2, topbarcolor3, headertitle, headertitlecolor, headercolor1, headercolor2, headercolor3, headercolor4, 
          headercolor5, headercolor6, headercolor7, headerlanguagebuttontext, headercolor8,headerlanguagebuttonentext, footercolor, footertextcolor]
    );
    res.json({ message: 'Başarıyla güncellendi' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Güncelleme hatası' });
  }
});

// 📌 Yeni Resim Yükleme
router.post('/images',authenticateAdmin, upload.array('images'), async (req, res) => {
  try {
    const { id } = req.body;  // aboutId'yi body'den al
    if (!id) {
      return res.status(400).json({ error: 'homecontactId parametresi eksik' });
    }    
    for (let file of req.files) {
      await pool.query('INSERT INTO imagehomecontact (hc_id, data) VALUES ($1, $2)', [id, file.buffer]);
    }
    res.json({ message: 'Resimler başarıyla yüklendi' });
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: 'Resim yükleme hatası' });
  }
});

// 📌 Resim Silme
router.delete('/images',authenticateAdmin, async (req, res) => {
  const { imageId } = req.body;
  try {
    await pool.query('DELETE FROM imagehomecontact WHERE id = $1', [imageId]);
    res.json({ message: 'Resim başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ error: 'Silme hatası' });
  }
});


module.exports = router;
