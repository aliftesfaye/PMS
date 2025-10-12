import React, { useEffect, useRef, useState } from "react";
import "../Assets/Leader.png";
import "../Assets/Member1.png";
import Createnewteam from "./Createnewteam";
import "./Teams.css";

const Teams = () => {
  const teams = [
    {
      name: "Team 2",
      description: "Description for Team 2",
      members: 5,
      teamMembers: [
        "Leader.png",
        "Member1.png",
        "Leader.png",
        "Leader.png",
        "Leader.png",
      ],
      member: ["Meme", "profile2", "profile3", "profile4", "profile5"],
    },
  ];

  const [expandedTeamIndices, setExpandedTeamIndices] = useState(
    Array(teams.length).fill(false)
  );
  const [showCreateNewTeamContainer, setShowCreateNewTeamContainer] =
    useState(false);

  const toggleTeamExpansion = (index) => {
    const newExpandedTeamIndices = [...expandedTeamIndices];
    newExpandedTeamIndices[index] = !newExpandedTeamIndices[index];
    setExpandedTeamIndices(newExpandedTeamIndices);
  };
  const handleCreateNewTeam = () => {
    setShowCreateNewTeamContainer(true);
  };
  const handleCloseModal = () => {
    setShowCreateNewTeamContainer(false);
  };
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCreateNewTeamContainer(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);
  const chunkTeams = (teams, size) => {
    return teams.reduce((rows, team, index) => {
      if (index % size === 0) rows.push([]);
      rows[rows.length - 1].push(team);
      return rows;
    }, []);
  };

  const teamsRows = chunkTeams(teams.slice(2), 3);

  return (
    <div className="ml-64">
      <div
        // className="section-title"
        class="py-12 font-semibold font-sans p-5 text-lg text-slate-800"
      >
        Teams
      </div>

      <div className="row">
        <div
          className="create-team-button"
          onClick={() => handleCreateNewTeam()}
        >
          <p>Create a new team</p>
        </div>
        {teams.slice(0, 2).map((team, index) => (
          <div
            className={`team-box ${
              expandedTeamIndices[index] ? " team-box-expanded" : ""
            }`}
            key={index}
          >
            <div className="team-header">
              <h3 className="team-name">
                {team.name}{" "}
                <button className="team-button" onClick={() => {}}>
                  ...
                </button>
              </h3>
            </div>
            <p className="description">{team.description}</p>
            <p className="members">
              Members: <div className="number-of-members">{team.members}</div>
              <span
                className="members-dropdown"
                onClick={() => toggleTeamExpansion(index)}
              >
                {expandedTeamIndices[index] ? "▲" : "▼"}
              </span>
            </p>
            {expandedTeamIndices[index] && (
              <div class="ml-8 h-32 overflow-x-auto">
                {(team.teamMembers || []).map((member, memberIndex) => (
                  <div key={memberIndex} className={`member-info`}>
                    <img
                      src={require(`../Assets/${member}`)}
                      alt={`Member ${memberIndex + 1}`}
                      className="member-image"
                    />
                    <p className="member-name">
                      {team.member ? team.member[memberIndex] || "" : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* {!expandedTeamIndices[index] && (
              <div className="profile-pictures" class=" ml-8 flex flex-row">
                {team.teamMembers.map((member, memberIndex) => (
                  <img
                    key={memberIndex}
                    src={require(`../Assets/${member}`)}
                    alt={`Member ${memberIndex + 1}`}
                    className="member-image"
                  />
                ))}
              </div>
            )} */}
          </div>
        ))}
      </div>

      {teamsRows.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((team, index) => (
            <div
              className={`team-box ${
                expandedTeamIndices[teams.length + rowIndex * 3 + index]
                  ? " team-box-expanded"
                  : ""
              }`}
              key={teams.length + rowIndex * 3 + index}
            >
              <div className="team-header">
                <h3 className="team-name">
                  {team.name} <button className="team-button">...</button>
                </h3>
              </div>
              <p className="description">{team.description}</p>
              <p className="members">
                Members: <div className="number-of-members">{team.members}</div>
                <span
                  className="members-dropdown"
                  onClick={() =>
                    toggleTeamExpansion(teams.length + rowIndex * 3 + index)
                  }
                >
                  {expandedTeamIndices[teams.length + rowIndex * 3 + index]
                    ? "▲"
                    : "▼"}
                </span>
              </p>
              {expandedTeamIndices[teams.length + rowIndex * 3 + index] && (
                <div class="ml-8 h-32 overflow-x-auto">
                  {team.teamMembers.map((member, memberIndex) => (
                    <div key={memberIndex} className="member-info">
                      <img
                        src={require(`../Assets/${member}`)}
                        alt={`Member ${memberIndex + 1}`}
                        className="member-image"
                      />
                      <p className="member-name">
                        {team.member ? team.member[memberIndex] : ""}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {!expandedTeamIndices[teams.length + rowIndex * 3 + index] && (
                <div className="profile-pictures" class="ml-8 flex flex-row">
                  {(team.teamMembers || []).map((member, memberIndex) => (
                    <img
                      key={memberIndex}
                      src={require(`../Assets/${member}`)}
                      alt={`Member ${memberIndex + 1}`}
                      className="member-image"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
      {showCreateNewTeamContainer && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div ref={modalRef} className="bg-white rounded-md">
            <div className=" flex justify-end ">
              <div
                className=" mr-4 w-fit   p-4  cursor-pointer"
                onClick={handleCloseModal}
              >
                X
              </div>
            </div>
            <Createnewteam handleCloseModal={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
