const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../PostgreDb/pgdb");
const authenticateAdmin = require("../middleWares/authenticateAdmin");
require("dotenv").config();

// token ile role kontrolü

router.get("/me",authenticateAdmin,  async (req, res) => {
  try {
    if (!req.headers.authorization.split(" ")[1]) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET);
    const user = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }
    res.json(user.rows[0]);
  } catch (error) {
    console.error("Invalid Token");
    res.status(500).json({ message: "Sunucu hatası." });
  }
});






module.exports = router;
