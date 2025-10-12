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
import { PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Milestone = (props) => {
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [deleteMilestone, setDeleteMilestone] = useState(0);
  const [milestoneInfo, setMilestoneInfo] = useState(null);

  const [projectPermissions, setProjectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });

  useEffect(() => {
    const projectInfo = props.setSelectedProjectInfo;
    const project_id = projectInfo?.project_id;
    const activity_id = projectInfo?.activity?.activity_id;
    const task_id = props.task_id;

    console.log(`Project ID: ${project_id}`);
    console.log(`Activity ID: ${activity_id}`);
    console.log(`Task ID: ${task_id}`);
    console.log("props.setSelectedProjectInfo:", projectInfo);

    if (task_id) {
      setMilestoneInfo({
        idType: "task_id",
        id: task_id,
      });
    } else if (activity_id) {
      setMilestoneInfo({
        idType: "activity_id",
        id: activity_id,
      });
    } else if (project_id) {
      setMilestoneInfo({
        idType: "project_id",
        id: project_id,
      });
    } else {
      console.error("No valid ID found in props.setSelectedProjectInfo");
    }
  }, [props.setSelectedProjectInfo]);

  useEffect(() => {
    if (milestoneInfo) {
      console.log("Fetching data with milestoneInfo:", milestoneInfo);
      fetchData();
    }
  }, [milestoneInfo, projectPermissions]);

  const fetchData = async () => {
    if (!milestoneInfo) {
      console.error("milestoneInfo is not set");
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getAllMilestone(
        milestoneInfo.idType,
        milestoneInfo.id,
        props.setSelectedProjectInfo.project_id
      );
      console.log("API response:", response);
      const sortedResponse = response.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Log milestones separately
      if (milestoneInfo.idType === "project_id") {
        console.log("Project milestones:", sortedResponse);
      } else if (milestoneInfo.idType === "activity_id") {
        console.log("Activity milestones:", sortedResponse);
      } else if (milestoneInfo.idType === "task_id") {
        console.log("Task milestones:", sortedResponse);
      }

      setTimeout(() => {
        setUsersData(sortedResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const DELETE_MILESTONE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_MILESTONE
    );
    setDeleteMilestone(DELETE_MILESTONE.length);
  }, [projectPermissions]);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = usersData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      height: 40,
    },
  }))(TableRow);

  const StyledTableCell = withStyles((theme) => ({
    root: {
      padding: "0px 20px",
    },
  }))(TableCell);

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative">
      <div className="flex gap-3 px-5 py-5 ">
        <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
          <div className="justify-center items-center px-3 py-1 bg-blue-600 rounded">
            {props.setSelectedProjectInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-auto my-auto text-xl font-medium text-blue-950">
          {props.setSelectedProjectInfo.name}
        </div>
      </div>

      <div>
        <div className="flex mb-7 justify-between">
          <div className="rows-per-page flex ml-2 justify-start mt-4 text-sm">
            Rows per page
            <div>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="w-fit pl-3 text-sm border-none outline-none bg-white focus:border-none focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 450,
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
              minWidth: 900,
              borderBottom: "none",
            }}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <BoldTableCell>
                  <div className="header-cell">No</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Name</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Start Date</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">End Date</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell ml-5">Status</div>
                </BoldTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((response, index) => (
                <StyledTableRow
                  key={response.id}
                  style={
                    index % 2
                      ? { background: "white" }
                      : { background: "#f7f6fe" }
                  }
                >
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{response.activity.name}</StyledTableCell>
                  <StyledTableCell>
                    {formatDate(response.activity.start_date)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {formatDate(response.activity.end_date)}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div
                      className={`w-24 text-center px-3 py-2 text-xs whitespace-nowrap rounded-md ${
                        response.activity.activity_status === "Completed"
                          ? "text-green-700 bg-green-200"
                          : response.activity.activity_status === "on Progress"
                          ? "text-orange-700 bg-orange-200"
                          : response.activity.activity_status === "Canceled"
                          ? "text-red-700 bg-red-200"
                          : response.activity.activity_status === "Pending"
                          ? "text-gray-700 bg-gray-200"
                          : ""
                      }`}
                    >
                      {response.activity.activity_status}{" "}
                    </div>{" "}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <div className="text-sm flex justify-end mt-1">
        <button
          className="bg-white cursor-pointer"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(Math.ceil(usersData.length / rowsPerPage)).keys()].map(
          (number) => (
            <div
              key={number + 1}
              className={`bg-${
                currentPage === number + 1 ? "gray-100" : "white"
              } h-fit rounded-md px-3 mt-2 py-1 cursor-pointer`}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </div>
          )
        )}
        <button
          className="bg-white cursor-pointer"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= usersData.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Milestone;
