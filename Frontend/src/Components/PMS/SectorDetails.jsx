import { Typography } from "@mui/material";
import React, { useState } from "react";
import "./OrganizationalUnitModal.css";

const SectorDetail = ({ row }) => {
  const [divisions, setDivsions] = useState(row.sector.Divisions);

  return (
    <div>
      <div className="employee">
        <div className="employee-name">
          List of Departments in {row.sector.name} Sector
        </div>
        <table>
          <thead>
            {divisions.length !== 0 ? (
              <tr>
                <th className="numb">No</th>
                <th>Department Name</th>
              </tr>
            ) : (
              <tr></tr>
            )}
          </thead>
          <tbody>
            {divisions.length !== 0 ? (
              divisions.map((division, index) => (
                <tr key={index}>
                  <td className="numb">{index + 1}</td>
                  <td className="td-employee-name">
                    <div>
                      {/* <img src={employee.img_url} alt="" /> */}
                      <span>{division.name}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <>
                <Typography class="text-center">No Sector Data</Typography>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectorDetail;
