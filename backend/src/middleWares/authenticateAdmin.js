const jwt = require("jsonwebtoken");

const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Yetkilendirme başarısız! Token eksik." });
    }
  
    try {
      // Bearer token içindeki asıl JWT'yi al
      const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
        return res.status(403).json({ error: "Yetkisiz erişim! Admin yetkisi gerekiyor." });
      }
  
      req.user = decoded; // Token doğrulandı, kullanıcı bilgisini req'e ekle
      next(); // Yetki doğrulandı, devam et
    } catch (error) {
      return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token!" });
    }
  }

module.exports = authenticateAdmin;


