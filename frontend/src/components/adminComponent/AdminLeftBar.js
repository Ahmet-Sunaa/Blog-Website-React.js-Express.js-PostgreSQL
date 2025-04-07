import React from "react";
import { Link } from "react-router-dom";
import "../../pages/admin/Admin.css";

const AdminLeftBar = ()=>(
      
      <div className="admin-sidebar">
        <h2>Admin Paneli</h2>
        <ul>
        <li>
            <Link to="/admin/general">Genel Ayarlar</Link>
          </li>
        <li>
            <Link to="/admin/blog-list">Bloglar</Link>
          </li>

          <li>
            <Link to="/admin/image-manager">Resim İşlemleri</Link>
          </li>

          <li>
            <Link to="/admin/page-list">Sayfalar</Link>
          </li>
          
          <li>
            <Link to="/admin/about-edit">Hakkında işlemleri</Link>
          </li>
          <li>

            <Link to="/admin/project-list">Proje işlemleri</Link>
          </li>

          <li>
            <Link to="/admin/publications-list">Yayın işlemleri</Link>
          </li>

          <li>
            <Link to="/admin/teams-list">Ekip işlemleri</Link>
          </li>

          <li>
            <Link to="/admin/social-media">Sosyal Medya</Link>
          </li>

          <li>
            <Link to="/admin/users">Kullanıcı İşlemleri</Link>
          </li>
          
          <li>
            <Link to="/admin/messages">Mesajlar</Link>
          </li>
      
        </ul>
      </div>
    
      );
export default AdminLeftBar;
