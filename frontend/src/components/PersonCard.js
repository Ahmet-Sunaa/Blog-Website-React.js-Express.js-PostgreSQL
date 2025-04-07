import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/user/User.css";

const PersonCard = ({ id, name, title, member, style }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/teams/member/${member.id}`, { state: { member } });
    };
    return (
        <div className="person-card" style={style}>
            <div className="person-image">
                <img
                    src={`http://localhost:5000/teams/image/${id}`} 
                    alt={`Image ${name}`}
                />

            </div>
            <div className="person-info">
                <h4>{name}</h4>
                <p>{title}</p>
            </div>
            <button className="person-button" onClick={handleClick}>
                →
            </button>

        </div>
    );
};

export default PersonCard;
