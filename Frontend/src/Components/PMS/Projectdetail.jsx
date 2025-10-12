import { withStyles } from "@material-ui/core/styles";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Projectdetail = ({ selectedRow }) => {
  const [projects, setProjects] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      console.log("Fetching projects...");
      setLoading(true);
      const projectsData = await apiService.getAllProjects(
        userInfo.access_token,
        selectedRow
      );
      console.log("Projects data received:", projectsData);

      const sortedResponse = projectsData.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
      console.log("Sorted projects data:", sortedResponse);

      setProjects(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      height: 40,
    },
  }))(TableRow);

  const StyledTableCell = withStyles((theme) => ({
    root: {
      padding: "0px",
    },
  }))(TableCell);

  const mergeRows = () => {
    const maxLength = Math.max(
      selectedRow.project_manager.length,
      selectedRow.technical_manager.length,
      selectedRow.project_member.length
    );

    const rows = [];
    for (let i = 0; i < maxLength; i++) {
      rows.push(
        <StyledTableRow
          key={i}
          style={i % 2 ? { background: "white" } : { background: "#f7f6fe" }}
        >
          <StyledTableCell>
            <div className="ml-5">
              {selectedRow.project_manager[i]
                ? selectedRow.project_manager[i].UserRoleToUser.full_name
                : ""}
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <div className="ml-5">
              {selectedRow.technical_manager[i]
                ? selectedRow.technical_manager[i].UserRoleToUser.full_name
                : ""}
            </div>
          </StyledTableCell>
          <StyledTableCell>
            <div className="ml-5">
              {selectedRow.project_member[i]
                ? selectedRow.project_member[i].UserRoleToUser.full_name
                : ""}
            </div>
          </StyledTableCell>
        </StyledTableRow>
      );
    }
    return rows;
  };

  return (
    <div className="p-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Project Members of {selectedRow.name}
        </h1>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 350,
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Fade
              in={loading}
              style={{
                transitionDelay: loading ? "100ms" : "0ms",
              }}
              unmountOnExit
            >
              <LinearProgress />
            </Fade>
          </Box>
          <Table
            sx={{
              minWidth: 700,
              borderBottom: "none",
            }}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <BoldTableCell>
                  <div className="header-cell">Project Manager</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Technical Manager</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Members</div>
                </BoldTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{mergeRows()}</TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Projectdetail;
