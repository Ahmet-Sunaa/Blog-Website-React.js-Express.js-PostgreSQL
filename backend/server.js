const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require('bcryptjs');
const pool = require("./src/PostgreDb/pgdb");
const bodyParser = require('body-parser');

const postsRoutes = require("./src/routes/posts");
const aboutUsRoutes = require("./src/routes/aboutUs");
const loginRoutes = require("./src/routes/Login");
const adminRoutes = require("./src/routes/admin")
const authRoutes = require("./src/routes/auth");
const uploadImageRoutes = require("./src/routes/image");
const usersRoutes = require("./src/routes/users");
const messageRoutes = require("./src/routes/message");
const projectsRoutes = require("./src/routes/projects");
const publicationsRoutes = require("./src/routes/publications");
const teamsRoutes = require("./src/routes/teams");
const socialMediaRoutes = require("./src/routes/socialMedia");
const menuPagesRoutes = require("./src/routes/menuPages");
const genralRoutes = require("./src/routes/general");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/posts", postsRoutes);
app.use("/about-us", aboutUsRoutes);
app.use("/login", loginRoutes);
app.use("/admin", adminRoutes);
app.use("/auths", authRoutes);
app.use("/images", uploadImageRoutes);
app.use("/users", usersRoutes);
app.use("/message", messageRoutes);
app.use("/projects", projectsRoutes);
app.use("/publications", publicationsRoutes);
app.use("/teams", teamsRoutes);
app.use("/social-media", socialMediaRoutes);
app.use("/menu-pages", menuPagesRoutes);
app.use("/general", genralRoutes);


app.use(bodyParser.json({ limit: '50mb' }));  // JSON veri için limit arttırıldı
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


// Admin kullanıcısı için şifreyi hash'leyelim
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};


const createAdminIfNotExist = async () => {
  const query = `
    SELECT users.role 
    FROM users
    WHERE users.role = 'admin';
 `;
  const result = await pool.query(query, []);
  // Eğer admin yoksa, oluştur
  if (result.rows.length === 0) {
    const hashedPassword = await hashPassword('admin');
    const insertQuery = 'INSERT INTO users (name, password, role, email) VALUES ($1, $2, $3, $4)';
    await pool.query(insertQuery, ['admin', hashedPassword, 'admin','adminmail@gmail.com']);
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
};


createAboutUsIfNotExist=async () => {
  const query = `SELECT * FROM about`
  const result = await pool.query(query,[]);
  try{
    if (result.rows.length ===0 ){
      const insertQuery = `INSERT INTO about (title, entitle, content, encontent) VALUES ($1, $2, $3, $4)`;
      await pool.query(insertQuery, [" ", " ", "[[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]]","[[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]]"]);
    }
  }catch (err){
    console.error(err);
  }

} 
createHomeContentIfNotExist=async () => {
  const query = `SELECT * FROM homecontact`
  const result = await pool.query(query,[]);
  if (result.rows.length ===0 ){
    const insertQuery = `INSERT INTO homecontact (contactadress, contacttitle, contactentitle ,contactphone, contactemail, hometitle, homeentitle) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    await pool.query(insertQuery, [" ", " ", " ", " ", " ", " ", " "]);
  }

} 


const PORT = process.env.PORT || 5000;
// Uygulama başladığında admin kontrolünü yap
createAdminIfNotExist().then(() => {
  createAboutUsIfNotExist();
  createHomeContentIfNotExist();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

const path = require("path");

// FRONTEND BUILD SERVE
app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

