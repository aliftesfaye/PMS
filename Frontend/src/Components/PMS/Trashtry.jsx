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
import SearchIcon from "../Assets/Search-icon.png";
import warning from "../Assets/warning.png";
import apiService from "../services/apiServices";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Trashtry = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [deletedData, setDeletedData] = useState([]);
  const [noProject, setNoProject] = useState("loading ...");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rowToRestore, setRowToRestore] = useState(null);

  useEffect(() => {
    fetchDeletedData();
  }, [selectedCategory]);

  const fetchDeletedData = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      let response;
      switch (selectedCategory) {
        case "Sectors":
          response = await apiService.getDeletedSectors(token);
          break;
        case "Departments":
          response = await apiService.getDeletedDivisions(token);
          break;
        case "Roles":
          response = await apiService.getDeletedRoles(token);
          break;
        case "Projects":
          response = await apiService.getDeletedProjects(token);
          break;
        case "Activities":
          response = await apiService.getDeletedActivities();
          break;
        case "Tasks":
          response = await apiService.getDeletedTasks();
          break;
        case "Sub tasks":
          response = await apiService.getDeletedSubtasks();
          break;
        default:
          response = { data: [] };
      }
      setDeletedData(response.data || response);
    } catch (error) {
      console.error("Error fetching deleted data:", error);
      setDeletedData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  const filteredRows = deletedData.filter((row) => {
    return row.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setCurrentPage(1);
  };

  const handleRestoreSector = async (sectorId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreSector(token, sectorId);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring sector:", error);
    }
  };

  const handleRestoreDepartment = async (departmentId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreDivision(token, departmentId);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring department:", error);
    }
  };

  const handleRestoreRole = async (roleId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreRoles(token, roleId);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring role:", error);
    }
  };

  const handleRestoreProject = async (projectId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreProjects(token, projectId);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring project:", error);
    }
  };

  const handleRestoreActivity = async (activity_id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreActivities(token, activity_id);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring project:", error);
    }
  };

  const handleRestoreTask = async (task_id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreTasks(token, task_id);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring project:", error);
    }
  };

  const handleRestoreSubTask = async (sub_task_id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;
      await apiService.restoreSubTasks(token, sub_task_id);
      fetchDeletedData();
    } catch (error) {
      console.error("Error restoring project:", error);
    }
  };

  const getDeletedByField = (row) => {
    switch (selectedCategory) {
      case "Sectors":
        return row.SectorDeletedBy;
      case "Departments":
        return row.DivisionDeletedBy;
      case "Roles":
        return row.RoleDeletedBy;
      case "Projects":
        return row.DeletedByProjects;
      case "Activities":
        return row.ActivityDeletedBy;
      case "Tasks":
        return row.TaskDeletedBy;
      case "Sub tasks":
        return row.SubTaskDeletedBy;
      default:
        return null;
    }
  };

  const getNoDataMessage = () => {
    switch (selectedCategory) {
      case "Sectors":
        return "No deleted sectors";
      case "Departments":
        return "No deleted departments";
      case "Roles":
        return "No deleted roles";
      case "Projects":
        return "No deleted projects";
      case "Activities":
        return "No deleted activities";
      case "Tasks":
        return "No deleted tasks";
      case "Sub tasks":
        return "No deleted sub tasks";
      default:
        return "No data available";
    }
  };

  const handleRestore = (row) => {
    setRowToRestore(row);
    setShowModal(true);
  };

  const confirmRestore = () => {
    if (selectedCategory === "Sectors") {
      handleRestoreSector(rowToRestore.sector_id);
    } else if (selectedCategory === "Departments") {
      handleRestoreDepartment(rowToRestore.division_id);
    } else if (selectedCategory === "Roles") {
      handleRestoreRole(rowToRestore.role_id);
    } else if (selectedCategory === "Projects") {
      handleRestoreProject(rowToRestore.project_id);
    } else if (selectedCategory === "Activities") {
      handleRestoreActivity(rowToRestore.activity_id);
    } else if (selectedCategory === "Tasks") {
      handleRestoreTask(rowToRestore.task_id);
    } else if (selectedCategory === "Sub tasks") {
      handleRestoreSubTask(rowToRestore.sub_task_id);
    }
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setRowToRestore(null);
  };

  return (
    <div className="ml-auto  mr-5 mt-5 relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trash</h1>
      </div>

      <div>
        <div className="flex flex-row justify-between">
          <select
            className="flex w-48 rounded-md border-gray-300"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Sectors">Clusters</option>
            <option value="Departments">Departments</option>
            <option value="Roles">Roles</option>
            <option value="Projects">Projects</option>
            <option value="Activities">Activities</option>
            <option value="Tasks">Tasks</option>
            <option value="Sub tasks">Sub tasks</option>
          </select>

          <div className="flex gap-2">
            <div className="flex flex-row">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-2 py-2 rounded-md border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  backgroundImage: `url(${SearchIcon})`,
                  backgroundPosition: "5px center",
                  backgroundRepeat: "no-repeat",
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex mb-7 justify-between">
        <div className="rows-per-page flex ml-2 justify-start mt-4 text-sm">
          Rows per page
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
                  <div className="header-cell">Deletion Date</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Deleted By</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Actions</div>
                </BoldTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedCategory === "" ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Please select a category to view deleted items
                  </TableCell>
                </TableRow>
              ) : currentItems.length > 0 ? (
                currentItems.map((row, index) => (
                  <StyledTableRow
                    key={`${
                      row.sector_id ||
                      row.division_id ||
                      row.role_id ||
                      row.project_id ||
                      row.activity_id ||
                      row.task_id ||
                      row.sub_task_id
                    }-${index}`}
                    style={
                      index % 2
                        ? { background: "white" }
                        : { background: "#f7f6fe" }
                    }
                  >
                    <StyledTableCell>{index + 1}</StyledTableCell>
                    <StyledTableCell>{row.name}</StyledTableCell>
                    <StyledTableCell>
                      {new Date(row.deletionAt).toLocaleDateString("en-GB")}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center">
                        {getDeletedByField(row)?.full_name}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex gap-2 text-white flex-row relative">
                        <div className="justify-center px-2.5 py-2 text-black rounded-md">
                          <button
                            className="w-fit bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleRestore(row)}
                          >
                            Restore
                          </button>
                        </div>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {getNoDataMessage()}
                  </TableCell>
                </TableRow>
              )}
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
        {[...Array(Math.ceil(filteredRows.length / rowsPerPage)).keys()].map(
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
          disabled={indexOfLastItem >= filteredRows.length}
        >
          Next
        </button>
      </div>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleModalClose}
        >
          <div
            className="bg-white w-fit pt-4 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end px-4 "
              onClick={handleModalClose}
            >
              &times;
            </div>
            <div className="p-4">
              <div className="flex items-center">
                <img src={warning} className="w-8" alt="" />
                <p className="ml-2">
                  Are you sure you want to restore this item?
                </p>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={confirmRestore}
                >
                  Yes
                </button>
                <button
                  className=" hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                  onClick={handleModalClose}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trashtry;
