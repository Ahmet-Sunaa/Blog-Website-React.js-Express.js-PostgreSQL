const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require("../PostgreDb/pgdb");
const authenticateAdmin = require("../middleWares/authenticateAdmin");

require("dotenv").config();
// Admin kullanıcısı için şifreyi hash'leyelim
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

//admin kullanıcı bilgilerini getirme
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        const query = `
       SELECT 
            users.id,
            users.name AS user_name, 
            users.email
        FROM users
  
  
      `;

        const result = await pool.query(query, []);
        res.json(result.rows); // Hazırlanmış ifade olarak çalıştırıyoruz.
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Server error");
    }
});

//admin şifre bilgisinin doğruluğuna göre kullanıcı bilgisi güncelleme
router.put("/", authenticateAdmin, async (req, res) => {
    const { id, user_name, email, password, oldpassword} = req.body; // req.body.user yerine doğrudan req.body
    try {
        //console.log();
        const isUserExistQuery = 'SELECT * FROM users WHERE name = $1 OR email=$2';
        const user = await pool.query(isUserExistQuery, [user_name, email]);
        console.log(user.rows);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Kullanıcı Bulunamadı !!!!" });
        }
        
        if (user.rows[0].name === user_name && user.rows[0].id !== id) {
            return res.status(400).json({ message: 'Kullanıcı Adı Zaten Kullanılıyor!!' });
        }
        if(user.rows[0].email===email && user.rows[0].id !== id){
            return res.status(400).json({ message: 'Eposta Zaten Kullanılıyor!!' });
        }       
        const isMatch = await bcrypt.compare(oldpassword, user.rows[0].password);
        if (!isMatch) {
          return res.status(400).json({ message: "Mevcut şifre hatalı." });
        }

        if(password!==null && password !== ''){
            const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        
            const result = await pool.query(
                "UPDATE users SET name = $1, password = $2, email = $3 WHERE id = $4 RETURNING name, email",
                [user_name, hashedPassword, email, id]
            );
        }
        else{
            await pool.query(
                "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING name, email",
                [user_name, email, id]
            );
        }
        
        res.json({message: "proccess done"}); // Hazırlanmış ifade olarak çalıştırıyoruz.
        

    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Server error");
    }


});

// yeni kullanıcı ekleme
router.post("/",authenticateAdmin, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const isUserExistQuery = 'SELECT * FROM users WHERE name = $1 OR email=$2';
        const result = await pool.query(isUserExistQuery, [username, email]);
        if(result.rows.length!==0){
            if (result.rows[0].name === username) {
                return res.status(400).json({ message: 'Kullanıcı Adı Zaten Kullanılıyor!!' });
            }
            if(result.rows[0].email===email){
                return res.status(400).json({ message: 'Eposta Zaten Kullanılıyor!!' });
            }
        }
        
        const hashedPassword = await hashPassword(password);
        await pool.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)", [username, email, hashedPassword, 'admin']);

        res.json({ message: 'Register successful' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// şifre eşleşmesine göre kullanıcı silme
router.delete("/", authenticateAdmin, async (req, res) => {
    const { id, password } = req.body;

    const userExists = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        if (userExists.rows.length === 0) {
            return res.status(400).json({ message: "Kullanıcı Bulunamadı !!!!" });
        }

        const isMatch = await bcrypt.compare(password, userExists.rows[0].password);
        if (!isMatch) {
          return res.status(400).json({ message: "Mevcut şifre hatalı." });
        }
        
        await pool.query(
            "DELETE FROM users WHERE id = $1",
            [id]
        );
        res.json({message: "proccess done"}); // Hazırlanmış ifade olarak çalıştırıyoruz.
        
})

module.exports = router;
