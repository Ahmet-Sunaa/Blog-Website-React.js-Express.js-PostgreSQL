import { useLocation, useNavigate } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin, FaGithub, FaBehance, FaGoogle, FaPinterest, FaResearchgate } from "react-icons/fa";
import "./User.css";

const MemberDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const member = location.state?.member;

    if (!member) {
        return <p>Kişi bilgisi bulunamadı!</p>;
    }

    return (
        <div className="member-container">
            <button className="back-button" onClick={() => navigate(-1)}>← Geri</button>
            <div className="member-card">
                <div className="member-image">
                    <img src={`http://localhost:5000/teams/image/${member.id}`} alt={member.name} />
                </div>
                <div className="member-info">
                    <h2>{member.name}</h2>
                    <p><strong>Job:</strong> {member.jobtitle || "Bilinmiyor"}</p>
                    <p><strong>Type:</strong> {member.jobtitletype || "Bilinmiyor"}</p>
                    <p><strong>Email:</strong> {member.email || "Belirtilmemiş"}</p>
                    <p><strong>Phone:</strong> {member.tel || "Belirtilmemiş"}</p>

                    <div className="social-icons">
                        {member.facebook && <a href={member.facebook} target="_blank" alt="facebook" rel="noopener noreferrer"><FaFacebook /></a>}
                        {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                        {member.x && <a href={member.x} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
                        {member.youtube && <a href={member.youtube} target="_blank" rel="noopener noreferrer"><FaYoutube /></a>}
                        {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
                        {member.github && <a href={member.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
                        {member.behance && <a href={member.behance} target="_blank" rel="noopener noreferrer"><FaBehance /></a>}
                        {member.google && <a href={member.google} target="_blank" rel="noopener noreferrer"><FaGoogle /></a>}
                        {member.pinterest && <a href={member.pinterest} target="_blank" rel="noopener noreferrer"><FaPinterest /></a>}
                        {member.researchgate && <a href={member.google} target="_blank" rel="noopener noreferrer"><FaResearchgate /></a>}
                        {member.googlescholar && (<a href={member.googlescholar} target="_blank" rel="noopener noreferrer"><img src="/googleScholar.png" alt="Google Scholar" style={{ width: "24px", height: "24px" }} /></a>)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberDetails;
