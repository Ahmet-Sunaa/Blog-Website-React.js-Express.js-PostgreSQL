import React from "react";
import PersonCard from "./PersonCard";
import "../pages/user/User.css";

const TeamSection = ({ title, members, style }) => {
  return (
    <>
      {members.length > 0 && (
        <div className="team-section">

          <h3>{title}</h3>
          <div className="team-grid">
            {members.map((member) => (
                <PersonCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  title={member.jobTitle}
                  member={member}
                  style={style}
                />
            


            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamSection;
