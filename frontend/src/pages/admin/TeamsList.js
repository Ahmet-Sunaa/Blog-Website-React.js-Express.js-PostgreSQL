import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";
import "../admin/Admin.css";
import { Link } from "react-router-dom";

const TeamsList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false); // Yetki durumu
  useEffect(() => {
        if (token) {
          checkAuthorization();
        } else {
          setIsAuthorized(false);
          navigate("/login");
        }
      }, [token]);
  const checkAuthorization = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "admin"){ 
      setIsAuthorized(true)
      fetchTeams();
    } else {
      setIsAuthorized(false);
      navigate("/login");
    }
  }

  // verileri çekme
  const fetchTeams = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/teams/admin/get`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch((err)=>console.log(err));
      setTeams(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      localStorage.removeItem('token');
      setError("Projeler yüklenirken hata oluştu.");
      setLoading(false);
    }
  };

  // ekip üyesi silme işlemi
  const handleDeleteTeam = async (id) => {
    const confirmDelete = window.confirm("Bu yayını silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/teams/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeams(teams.filter((team) => team.id !== id));
      alert("Proje başarıyla silindi!");
    } catch (err) {
      localStorage.removeItem('token');

      setError("Silme işlemi başarısız oldu!");
    }
  };

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!isAuthorized) {
    return;
  }
  return (
    <div className="admin-dashboard">
      <AdminLeftBar />
      <div className="blog-container">
        <h3>Ekip Üyeleri</h3>
        <button className="add-btn" onClick={() => navigate("/admin/add-team-member")}>
          + Yeni Ekip Üyesi Ekle
        </button>
        {teams.length === 0 ? (
          <p>Henüz eklenmiş bir ekip üyesi yok.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>İsim</th>
                <th>Ünvan</th>
                <th>Ünvan Türü</th>
                <th>Ünvan Türü önceliği</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.jobtitle}</td>
                  <td>{team.jobtitletype}</td>
                  <td>{team.priority}</td>
                  
                  <td>
                    <Link to={`/admin/teams-list/edit-team-member/${team.id}`}>Detay</Link>
                    
                    <button className="delete-btn" onClick={() => handleDeleteTeam(team.id)}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TeamsList;
