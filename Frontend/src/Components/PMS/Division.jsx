import React from "react";
import Member1 from "../Assets/Member1.png";
import Leader from "../Assets/Leader.png";
import "./SectorModal.css";

const Division = () => {
  const divisionsData = [
    {
      no: "1",
      name: "Starting Comittee",
      divleader: Member1,
      leaderName: "John Doe",
    },
    {
      no: "2",
      name: "Technical Comittee",
      divleader: Leader,
      leaderName: "John Doe",
    },
    {
      no: "3",
      name: "Project Manager",
      divleader: Member1,
      leaderName: "John Doe",
    },
    {
      no: "4",
      name: "Technical Manager",
      divleader: Leader,
      leaderName: "John Doe",
    },
    {
      no: "5",
      name: "Client/Owner",
      divleader: Member1,
      leaderName: "John Doe",
    },
    {
      no: "6",
      name: "Project Investigator",
      divleader: Leader,
      leaderName: "John Doe",
    },
    {
      no: "7",
      name: "pm",
      divleader: Member1,
      leaderName: "John Doe",
    },
  ];
  const displayedDivisions = divisionsData;

  return (
    <div>
      <div className="division">
        <div className="division-name">Research and Developement</div>
        <table>
          <thead>
            <tr>
              <th className="numb">No</th>
              <th>Division</th>
              <th>Leader</th>
            </tr>
          </thead>
          <tbody>
            {displayedDivisions.map((division, index) => (
              <tr key={index}>
                <td className="numb">{division.no}</td>
                <td className="td-division-name">{division.name}</td>
                <td className="div-leader">
                  <img src={division.divleader} alt="" />
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Division;
