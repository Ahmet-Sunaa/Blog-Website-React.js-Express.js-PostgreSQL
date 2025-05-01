import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./Admin.css";
import AdminLeftBar from "../../components/adminComponent/AdminLeftBar";

const Users = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        const user = JSON.parse(localStorage.getItem("user"));
        if (user.role === "admin") {
            setIsAdmin(true);
            fetchUsers();

        } else {
            localStorage.removeItem("user");
            setIsAdmin(false);
            navigate("/login");
        }
        setIsLoading(false)
    }, [navigate]);

    // verileri çekme işlemi
    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            setError("Kullanıcılar yüklenirken hata oluştu!");
            navigate("/login");
        }
    };

    // editing user bilgisini kaydetme
    const handleEditClick = (user) => {
        setEditingUser({ ...user, password: "" }); // Şifreyi boş bırakıyoruz
    };

    //userı güncelleme
    const handleUpdateUser = async () => {
/*
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/users`, editingUser, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUsers(users.map(user => (user.id === editingUser.id ? editingUser : user)));
            setEditingUser(null); // Düzenleme modundan çık
        } catch (error) {
            localStorage.removeItem('token');

            setError(error.response.data.message);
        }*/
    };

    // kullanıcı silme
    const handleDeleteUser = async () => {
        /*try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { id: editingUser.id, password: editingUser.oldpassword }  // Doğru kullanım!
            });
    
            setUsers(users.filter(user => user.id !== editingUser.id)); // Kullanıcıyı listeden kaldır
            setEditingUser(null); // Düzenleme modundan çık
        } catch (error) {
            localStorage.removeItem('token');

            setError(error.response.data.message);
        }*/
    };
    
    if (isAdmin === false) {
        return null; // Admin değilse hiçbir şey gösterme
    }
    return (
        <div className="admin-dashboard">
            <AdminLeftBar />
            <div className="user-container">
                <h2>Kullanıcılar</h2>
                <button className="add-btn" onClick={() => navigate("/admin/users/add-user")}>
                    + Yeni Kullanıcı Ekle
                </button>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <ul>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <li key={user.id}>
                                {editingUser && editingUser.id === user.id ? (
                                    // Düzenleme modu
                                    <div>
                                        <input
                                            type="text"
                                            value={editingUser.user_name}
                                            onChange={(e) => setEditingUser({ ...editingUser, user_name: e.target.value })}
                                            placeholder="İsim"
                                        />
                                        <input
                                            type="email"
                                            value={editingUser.email}
                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                            placeholder="E-posta"
                                        />
                                        <input
                                            type="password"
                                            value={editingUser.oldpassword || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, oldpassword: e.target.value })}
                                            placeholder="Eski Şifre"
                                        />
                                        <input
                                            type="password"
                                            value={editingUser.password || ""}
                                            onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                            placeholder="Yeni Şifre (İsteğe Bağlı)"
                                        />

                                        <button onClick={handleUpdateUser}>Kaydet</button>
                                        <button onClick={() => setEditingUser(null)}>İptal</button>
                                        <button onClick={handleDeleteUser}>Delete</button>
                                    </div>
                                ) : (
                                    // Normal görüntüleme modu
                                    <span>
                                        {user.user_name} ({user.email})
                                    </span>
                                )}
                                <button onClick={() => handleEditClick(user)}>Düzenle</button>
                            </li>
                        ))
                    ) : (
                        <p>Kullanıcılar bulunamadı.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Users;
