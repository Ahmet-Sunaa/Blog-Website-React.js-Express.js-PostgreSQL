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
  if (result.rows.length ===0 ){
    const insertQuery = `INSERT INTO about (title, content) VALUES ($1, $2)`;
    await pool.query(insertQuery, [" ",[
  {
    "type": "heading-one",
    "children": [
      {
        "bold": true,
        "text": "Lorem Ipsum Dolor A Sit TR",
        "italic": true,
        "fontSize": "24px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "bold": true,
        "text": "Lorem ıpsum dolor a sit",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      },
      {
        "bold": true,
        "text": " ",
        "fontSize": "16px",
        "fontFamily": "Courier New"
      },
      {
        "bold": true,
        "text": "Lorem ıpsum",
        "fontSize": "16px",
        "underline": true,
        "fontFamily": "Courier New"
      },
      {
        "bold": true,
        "text": " dolor a ",
        "fontSize": "16px",
        "underline": true,
        "fontFamily": "Verdana"
      },
      {
        "text": "sit Lorem ",
        "fontSize": "16px",
        "underline": true,
        "fontFamily": "Verdana"
      },
      {
        "text": "ıpsum dol",
        "italic": true,
        "fontSize": "16px",
        "underline": true,
        "fontFamily": "Verdana"
      },
      {
        "text": "or a sit Lorem ıpsum dolor a sit Lorem ",
        "italic": true,
        "fontSize": "16px",
        "fontFamily": "Verdana"
      },
      {
        "bold": true,
        "text": "ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit ",
        "italic": true,
        "fontSize": "16px",
        "underline": true,
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "paragraph",
    "align": "center",
    "children": [
      {
        "text": "Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit ",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "paragraph",
    "align": "right",
    "children": [
      {
        "text": "Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit ",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "paragraph",
    "children": [
      {
        "text": "Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit Lorem ıpsum dolor a sit ",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "numbered-list",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "text": "Lorem 1"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Lorem 2"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "lorem3"
          }
        ]
      }
    ]
  },
  {
    "type": "bulleted-list",
    "children": [
      {
        "type": "list-item",
        "children": [
          {
            "text": "Lorem 1"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Lorem 2"
          }
        ]
      },
      {
        "type": "list-item",
        "children": [
          {
            "text": "Lorem 3"
          }
        ]
      }
    ]
  },
  {
    "url": "https://th.bing.com/th/id/R.98f1fc17b606afef39d7b367559ca39c?rik=4e7BQ3TTzxKf1A&pid=ImgRaw&r=0",
    "type": "image",
    "children": [
      {
        "text": ""
      }
    ]
  },
  {
    "url": "https://th.bing.com/th/id/R.98f1fc17b606afef39d7b367559ca39c?rik=4e7BQ3TTzxKf1A&pid=ImgRaw&r=0",
    "type": "link",
    "children": [
      {
        "type": "paragraph",
        "children": [
          {
            "text": "Lorem Link",
            "color": "#7f5cff",
            "fontSize": "16px",
            "fontFamily": "Verdana"
          }
        ]
      }
    ]
  },
  {
    "type": "code",
    "children": [
      {
        "text": "Lorem ıpsum dolor Lorem ıpsum dolor Lorem ıpsum dolor Lorem ıpsum dolor Lorem ıpsum dolor ",
        "color": "#ffffff",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "code",
    "children": [
      {
        "text": "Lorem ıpsum dolor Lorem ıpsum dolor ",
        "color": "#ffffff",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "code",
    "children": [
      {
        "text": "Lorem ıpsum dolor ",
        "color": "#ffffff",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "url": "https://google.com",
    "type": "link",
    "children": [
      {
        "type": "blockquote",
        "children": [
          {
            "text": "Lorem ıpsum dolor",
            "color": "#5c67ff",
            "fontSize": "16px",
            "fontFamily": "Verdana"
          }
        ]
      }
    ]
  },
  {
    "type": "heading-three",
    "children": [
      {
        "text": "Lorem ıpsum dolor",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  },
  {
    "type": "heading-two",
    "children": [
      {
        "text": "",
        "fontSize": "16px",
        "fontFamily": "Verdana"
      }
    ]
  }
]]);
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
