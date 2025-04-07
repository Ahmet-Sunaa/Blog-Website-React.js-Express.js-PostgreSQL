const express = require("express");
const router = express.Router();
const pool = require("../PostgreDb/pgdb");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
// login için post metodu
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE name = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
   
    res.json({ message: 'Login successful', token, user: { id: user.id, username: user.name, role: 'admin' } });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
