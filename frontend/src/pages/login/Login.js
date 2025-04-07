import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import "../user/User.css";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.token);

      const user = await axios.get('http://localhost:5000/auths/me', {
        headers: { Authorization: `Bearer ${response.data.token}` },
      })

      localStorage.setItem("user", JSON.stringify(user.data));



      window.dispatchEvent(new Event("storage")); 

      // Kullanıcı admin ise admin paneline yönlendir
      if (response.data.user.role === 'admin' || response.data.user.role === 'administrator') {
        navigate('/admin');
      } else {
        navigate('/');
      }

    } catch (error) {
      setMessage('Login failed: ' + error.response.data.message);
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h1 className="login-header">Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
            placeholder="Enter your username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      <div className="register-link">
        <Link to="/register">Üye Ol</Link>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  </div>
  );
}

export default Login;
