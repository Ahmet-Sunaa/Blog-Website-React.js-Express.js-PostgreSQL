import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Admin.css";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [IsAuthorized, setIsAuthorized] = useState(null); // Admin olup olmadığını kontrol etmek için
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);

  // role kontrolü
  useEffect(() => {
  if (!token) {
    navigate("/login");
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));

    if (user.role === "admin" || user.role === "administrator"){ 
      setIsAuthorized(true)
      setIsLoading(false);
    } else {
      setIsAuthorized(false);
      localStorage.removeItem('token');
      navigate("/login");
    }
}, [navigate]);


if (isLoading) {
  return <p>Yükleniyor...</p>;
}

if (IsAuthorized === false) {
  return null; // Admin değilse hiçbir şey gösterme
}

  return (
    <div className="main-container">
      <div className="admin-dashboard">
      <AdminLeftBar />

      </div>
    </div>
  )
};

export default AdminPanel;
