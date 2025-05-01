import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
const token = localStorage.getItem("token");

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // boş veri kontrolü sonrası geçerli formattaki verileri db ye kaydetme
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validasyonu
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Tüm alanları doldurun!");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Geçerli bir e-posta adresi girin!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler uyuşmuyor!");
      return;
    }

    try {
      /*await axios.post(`${process.env.REACT_APP_API_URL}/users`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }, // Verileri gönder
        { headers: { Authorization: `Bearer ${token}` } });
*/
      alert("Kayıt başarılı! (Güvenlik sebebi ile bu işlem çalışmamaktadır!!!!)");
      navigate("/login"); // Başarıyla kayıt olduktan sonra giriş sayfasına yönlendirme

    } catch (error) {
      setError(error.response.data.message);
      localStorage.removeItem('token');
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="register-container">
        <h2>Kayıt Ol</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Kullanıcı Adı</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Kullanıcı adınızı girin"
            required
          />

          <label>E-posta</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="E-posta adresinizi girin"
            required
          />

          <label>Şifre</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Şifrenizi girin"
            required
          />

          <label>Şifreyi Tekrar Girin</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Şifrenizi tekrar girin"
            required
          />

          <button type="submit">Kayıt Ol</button>
        </form>
      </div>

    </div>
  );
};

export default Register;
