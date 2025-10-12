import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import "../Assets/Leader.png";
import "../Assets/Member1.png";
import Createnewteam from "./Createnewteam";

const Teams = () => {
  const teams = [
    {
      name: "Team 1",
      description: "Description for Team 1",
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
    // Add other teams here
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

  return (
    <div className="teams-container">
      <div className="py-12 font-semibold font-sans p-5 text-lg text-slate-800">
        Teams
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
          <div
            className="create-team-button"
            onClick={() => handleCreateNewTeam()}
          >
            <p>Create a new team</p>
          </div>
        </Grid>
        {teams.map((team, index) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={index}>
            <div
              className={`team-box ${
                expandedTeamIndices[index] ? " team-box-expanded" : ""
              }`}
            >
              <Card>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {team.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {team.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Members: {team.members}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">View Details</Button>
                </CardActions>
              </Card>
            </div>
          </Grid>
        ))}
      </Grid>

      {showCreateNewTeamContainer && (
        <div className="modal-overlay">
          <div className="create-new-team-container-modal">
            <div className="modal">
              <button className="close-modal-team" onClick={handleCloseModal}>
                X
              </button>
              <Createnewteam />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
