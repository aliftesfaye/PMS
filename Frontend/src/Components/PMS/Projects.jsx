import Tooltip from "@material-ui/core/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Pagination, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

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
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { PERMISSIONS, PROJECT_ROLES, USER_ROLES } from "../../config";
import apiService from "../services/apiServices";
import Projectscreate from "./Projectcreate";
import Projectdelete from "./Projectdelete";
import Projectsview from "./Projectdetail";
import Projectsedit from "./Projectsedit";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Projects = (props) => {
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projects, setProjects] = useState([]);
  const [createProject, setCreateProject] = useState(0);
  const [updateProject, setUpdateProject] = useState(0);
  const [deleteProject, setDeleteProject] = useState(0);
  const [viewProjectDashboard, setViewProjectDashboard] = useState(0);
  const [viewActivity, setViewActivity] = useState(0);
  const [viewMilestone, setViewMilestone] = useState(0);
  const [viewWorkspace, setViewWorkspace] = useState(0);
  const [viewAllProjects, setViewAllProjects] = useState(0);
  const [viewProjectMembers, setViewProjectMembers] = useState(0);
  const [noProject, setNoProject] = useState();

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [projectPermissions, setProjectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await apiService.getAllProjects(
        userInfo.access_token
      );
      const sectorData = await apiService.getSectors(userInfo.access_token);

      const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
        (role) => !role.project_related
      ).map((role) => role.name);

      const isDepartmentAdminRolePresent =
        nonProjectRelatedRoles.includes("Department Admin");

      const isClusterAdminRolePresent =
        nonProjectRelatedRoles.includes("Cluster Admin");

      const userDivisionId = userInfo.foundUser.division_id;
      const userId = userInfo.foundUser.user_id;
      const validDivisionIds = sectorData.flatMap((sector) => {
        const isUserLeader = sector.leader.some(
          (leader) => leader.user_id === userId
        );
        if (isUserLeader) {
          return sector.sector.Divisions.map((sector) => sector.division_id);
        }
        return [];
      });
      const filteredProjects = isClusterAdminRolePresent
        ? projectsData.filter((project) =>
            validDivisionIds.includes(project.division_id)
          )
        : isDepartmentAdminRolePresent
        ? projectsData.filter(
            (project) => project.division_id === userDivisionId
          )
        : projectsData;
      const sortedResponse = filteredProjects.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setProjects(sortedResponse);
      projects.length === 0
        ? setNoProject("No Project Found")
        : setNoProject("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const formatBudget = (budget) => {
    if (budget == null || isNaN(budget)) {
      return "N/A";
    }

    if (budget >= 1000000000) {
      const billions = budget / 1000000000;
      return `${(Math.round(billions * 100) / 100).toFixed(2)}B`;
    } else if (budget >= 1000000) {
      const millions = budget / 1000000;
      return `${(Math.round(millions * 100) / 100).toFixed(2)}M`;
    }
    return budget.toLocaleString();
  };

  const getColorByRange = (value) => {
    if (!value) return "black";

    const colorRanges = [
      { range: ["a".charCodeAt(0), "e".charCodeAt(0)], color: "red" },
      { range: ["f".charCodeAt(0), "j".charCodeAt(0)], color: "green" },
      { range: ["k".charCodeAt(0), "o".charCodeAt(0)], color: "purple" },
      { range: ["p".charCodeAt(0), "t".charCodeAt(0)], color: "blue" },
      { range: ["u".charCodeAt(0), "z".charCodeAt(0)], color: "gray" },
    ];
    const charCode = value.toLowerCase().charCodeAt(0);
    const rangeMatch = colorRanges.find(
      (range) => charCode >= range.range[0] && charCode <= range.range[1]
    );
    return rangeMatch ? rangeMatch.color : "";
  };

  useEffect(() => {
    fetchProjects();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    async function fetchProjectPermissions() {
      localStorage.setItem(
        "project_permissions",
        JSON.stringify(projectPermissions)
      );
    }
    fetchUsers();
    fetchPermissions();
    fetchProjectPermissions();

    const CREATE_PROJECT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_PROJECT
    );

    const UPDATE_PROJECT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_PROJECT
    );

    const DELETE_PROJECT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_PROJECT
    );

    const GET_PROJECT_DASHBOARD = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_PROJECT_DASHBOARD
    );

    const GET_ALL_PROJECT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_PROJECT
    );

    const roles = userInfo.foundUser.Roles;
    const systemRoles = roles.filter((role) => role.project_related === false);
    const hasUserRole = systemRoles.some(
      (role) => role.role_id === USER_ROLES.USER
    );
    let VIEW_PROJECT_MEMBERS;
    if (hasUserRole) {
      VIEW_PROJECT_MEMBERS = permissions.filter(
        (permission) => permission.name === PERMISSIONS.VIEW_PROJECT_MEMBERS
      );
    } else {
      VIEW_PROJECT_MEMBERS = permissions.filter(
        (permission) => permission.name === PERMISSIONS.VIEW_PROJECT_MEMBERS
      );
    }

    const GET_ALL_ACTIVITY = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_ACTIVITY
    );

    const GET_WORKSPACE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_WORKSPACE
    );
    const GET_MILESTONE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_MILESTONE
    );

    setCreateProject(CREATE_PROJECT.length);
    setViewProjectMembers(VIEW_PROJECT_MEMBERS.length);
    setUpdateProject(UPDATE_PROJECT.length);
    setDeleteProject(DELETE_PROJECT.length);
    setViewProjectDashboard(GET_PROJECT_DASHBOARD.length);
    setViewActivity(GET_ALL_ACTIVITY.length);
    setViewWorkspace(GET_WORKSPACE.length);
    setViewMilestone(GET_MILESTONE.length);
    setViewAllProjects(GET_ALL_PROJECT.length);
  }, [userInfo, permissions, projectPermissions]);

  const dropdownRef = useRef(null);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };
  const handlefetchProjects = async () => {
    try {
      const projectsData = await apiService.getAllProjects(
        userInfo.access_token
      );
      const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
        (role) => !role.project_related
      ).map((role) => role.name);

      const sectorData = await apiService.getSectors(userInfo.access_token);
      const isDepartmentAdminRolePresent =
        nonProjectRelatedRoles.includes("Department Admin");

      const isClusterAdminRolePresent =
        nonProjectRelatedRoles.includes("Cluster Admin");

      const userDivisionId = userInfo.foundUser.division_id;
      const userId = userInfo.foundUser.user_id;
      const validDivisionIds = sectorData.flatMap((sector) => {
        const isUserLeader = sector.leader.some(
          (leader) => leader.user_id === userId
        );
        if (isUserLeader) {
          return sector.sector.Divisions.map((sector) => sector.division_id);
        }
        return [];
      });
      const filteredProjects = isClusterAdminRolePresent
        ? projectsData.filter((project) =>
            validDivisionIds.includes(project.division_id)
          )
        : isDepartmentAdminRolePresent
        ? projectsData.filter(
            (project) => project.division_id === userDivisionId
          )
        : projectsData;
      const sortedResponse = filteredProjects.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setProjects(sortedResponse);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleAddClick = (row) => {
    setSelectedRow(row);
    setAddModalOpen(true);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleMenuOpen = (rowId) => {
    setOpenRowMenu(rowId);
  };

  const handleMenuClose = () => {
    setOpenRowMenu(null);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const getProjectPermission = async (row) => {
    const isProjectManager = row.project_manager.some(
      (manager) => manager.user_id === userInfo.foundUser.user_id
    );

    const isTechnicalManager = row.technical_manager.some(
      (manager) => manager.user_id === userInfo.foundUser.user_id
    );

    const isProjectMember = row.project_member.some(
      (member) => member.user_id === userInfo.foundUser.user_id
    );

    switch (true) {
      case isProjectManager && isTechnicalManager && isProjectMember:
        console.log(
          "User is a Project Manager, a Technical Manager and a Project Member."
        );
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.PROJECT_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isProjectManager && isTechnicalManager:
        console.log("User is both a Project Manager and a Technical Manager.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.PROJECT_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isProjectManager && isProjectMember:
        console.log("User is both a Project Manager and a Project Member.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.PROJECT_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isTechnicalManager && isProjectMember:
        console.log("User is both a Technical Manager and a Project Member.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.TECHNICAL_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isProjectManager:
        console.log("User is a Project Manager.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.PROJECT_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isTechnicalManager:
        console.log("User is a Technical Manager.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.TECHNICAL_MANAGER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      case isProjectMember:
        console.log("User is a Project Member.");
        try {
          const permissions = await apiService.getSpecificRolePermission(
            PROJECT_ROLES.PROJECT_MEMBER
          );
          localStorage.setItem(
            "project_permissions",
            JSON.stringify(permissions.Permissions)
          );
        } catch (error) {
          console.error("Error fetching permissions:", error);
        }
        break;
      default:
        console.log("User does not have any specific role.");
    }
  };

  const handleProjectClick = (row) => {
    props.setIsProjectSelected(true);
    props.setSelectedProjectInfo(row);
    props.setShowProjectsBox(false);
    getProjectPermission(row);
    localStorage.setItem("isProjectSelected", true);
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const filteredProject = projects.filter(
    (project) =>
      project.project_manager.some(
        (manager) => manager.user_id === userInfo.foundUser.user_id
      ) ||
      project.project_member.some(
        (member) => member.user_id === userInfo.foundUser.user_id
      ) ||
      project.technical_manager.some(
        (manager) => manager.user_id === userInfo.foundUser.user_id
      )
  );
  const filteredRows =
    statusFilter === "All"
      ? viewAllProjects !== 0
        ? projects
        : filteredProject
      : viewAllProjects !== 0
      ? projects.filter((row) => row.overall_progress === statusFilter)
      : filteredProject.filter((row) => row.overall_progress === statusFilter);

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);

  const search = filteredRows.filter(
    (row) =>
      row.name &&
      row.name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );
  const currentItems = search.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: 50,
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "0px 20px",
  }));
  const handleChange = (event, value) => {
    paginate(value);
  };
  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative">
      <Helmet>
        <title>PMS - Projects</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
      </div>
      <div>
        <ul class="my-5 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-200 dark:text-gray-400">
          <li class="me-2 " onClick={() => handleFilterClick("All")}>
            <a
              href="#"
              aria-current="page"
              className={`cursor-pointer ${
                statusFilter === "All"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4 rounded-t-lg"
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>All</div>
            </a>
          </li>

          <li class="me-2" onClick={() => handleFilterClick("Completed")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Completed"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4  rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>Completed</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("On Progress")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "On Progress"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>On Progress</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("Canceled")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Canceled"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50  "
              }`}
            >
              <div>Canceled</div>
            </a>
          </li>
        </ul>

        <div>
          <div className="flex mb-7 justify-between">
            <div class=" self-center ">
              <TextField
                type="text"
                placeholder="Search by Project Name"
                size="small"
                class="  rounded-lg "
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            {createProject !== 0 && (
              <button
                className="text-white font-bold py-2 px-4 rounded"
                onClick={() => handleAddClick()}
                style={{ backgroundColor: "#082f49" }}
              >
                + Create New Project
              </button>
            )}
          </div>
        </div>
        {projects.length !== 0 && (
          <div className="rows-per-page flex ml-2 justify-start my-6 text-sm">
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
        )}
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
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
          {currentItems.length !== 0 ? (
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
                    <div className="header-cell">Project Name</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Start date</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">End date</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Budget</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Project Members</div>
                  </BoldTableCell>

                  <BoldTableCell>
                    <div className="header-cell">Status</div>
                  </BoldTableCell>
                  {(updateProject !== 0 || deleteProject !== 0) && (
                    <BoldTableCell>
                      <div className="header-cell">Actions</div>
                    </BoldTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row, index) => {
                  {
                    return (
                      <StyledTableRow
                        key={row.project_id}
                        style={
                          index % 2
                            ? { background: "white" }
                            : { background: "#f7f6fe" }
                        }
                      >
                        <StyledTableCell
                          onClick={() => handleProjectClick(row)}
                        >
                          <div className="flex  cursor-pointer">
                            <Tooltip
                              title={`Open Project ${row.name}`}
                              placement="right"
                            >
                              <div>
                                <span
                                  className="initials"
                                  style={{
                                    backgroundColor: getColorByRange(
                                      row.name.charAt(0)
                                    ),
                                    borderRadius: "50%",
                                    width: "30px",
                                    height: "30px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "10px",
                                    color: "#fff",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {row.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="">{row.name}</span>
                              </div>
                            </Tooltip>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(row.start_date).toLocaleDateString()}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(row.end_date).toLocaleDateString()}
                        </StyledTableCell>

                        <StyledTableCell>
                          {formatBudget(row.budget)}
                        </StyledTableCell>
                        {viewProjectMembers !== 0 ? (
                          <StyledTableCell>
                            <div className="group w-fit">
                              <div className="text-blue-900 w-fit cursor-pointer ml-11   ">
                                <Tooltip
                                  title="View Project Members"
                                  placement="right"
                                >
                                  <div
                                    className=" hover:bg-gray-200 rounded-lg"
                                    onClick={() => handleViewClick(row)}
                                  >
                                    <FaUsers size={30} />
                                  </div>
                                </Tooltip>
                              </div>
                            </div>
                          </StyledTableCell>
                        ) : (
                          <StyledTableCell>
                            <div className="group w-fit">
                              <div className="text-blue-900 w-fit cursor-pointer ml-11   "></div>
                            </div>
                          </StyledTableCell>
                        )}
                        <StyledTableCell>
                          <div className="">
                            <div
                              className={`cursor-pointer w-fit py-2 text-xs font-medium rounded-2xl ${
                                row.overall_progress === "Completed"
                                  ? "text-green-600 bg-emerald-50"
                                  : row.overall_progress === "On Progress"
                                  ? "text-orange-600 bg-orange-50"
                                  : row.overall_progress === "Canceled"
                                  ? "text-red-600 bg-red-50"
                                  : ""
                              }`}
                            >
                              {row.overall_progress}
                            </div>
                          </div>
                        </StyledTableCell>
                        {(updateProject !== 0 || deleteProject !== 0) && (
                          <StyledTableCell>
                            <div className="cursor-pointer flex gap-2 text-white flex-row relative">
                              <div className="cursor-pointer flex-row shadow-sm rounded-md flex gap-2">
                                {updateProject !== 0 && (
                                  <Tooltip
                                    title="Edit Project"
                                    placement="right"
                                  >
                                    <div className="p-2 hover:bg-gray-200 rounded-lg">
                                      <div
                                        className="text-blue-900"
                                        onClick={() => handleEditClick(row)}
                                      >
                                        <FaEdit fontSize={16} />
                                      </div>
                                    </div>
                                  </Tooltip>
                                )}
                                {deleteProject !== 0 && (
                                  <Tooltip
                                    title="Delete Project"
                                    placement="right"
                                  >
                                    <div className="p-2 hover:bg-gray-200 rounded-lg">
                                      <div
                                        className="text-red-600"
                                        onClick={() => handleDeleteClick(row)}
                                      >
                                        <FaTrash fontSize={16} />
                                      </div>
                                    </div>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          </StyledTableCell>
                        )}
                      </StyledTableRow>
                    );
                  }
                })}
              </TableBody>
            </Table>
          ) : (
            <div class="m-10 flex items-center justify-center">{noProject}</div>
          )}
        </TableContainer>
        {projects.length !== 0 && (
          <Box className="text-sm flex justify-end mt-1 pb-20 pt-5">
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              shape="rounded"
              size="small"
              color="primary"
              sx={{ "& .MuiPaginationItem-root": { margin: "0 4px" } }}
            />
          </Box>
        )}
      </div>

      {addModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white h-4/5   overflow-y-auto rounded-md">
            <div
              className="close cursor-pointer text-end mr-12 mt-3"
              onClick={handleAddModalClose}
            >
              X
            </div>
            <Projectscreate
              selectedRow={selectedRow}
              handlefetchProjects={handlefetchProjects}
              handleCloseModal={handleAddModalClose}
            />
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white h-4/5   overflow-y-auto rounded-md">
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleEditModalClose}
            >
              X
            </div>
            <Projectsedit
              selectedRow={selectedRow}
              handlefetchProjects={handlefetchProjects}
              handleCloseModal={handleEditModalClose}
            />
          </div>
        </div>
      )}

      {viewModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-2/3 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleViewModalClose}
            >
              X
            </div>
            <Projectsview selectedRow={selectedRow} />
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 pt-4 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12"
              onClick={handleDeleteModalClose}
            >
              X
            </div>
            <Projectdelete
              selectedRow={selectedRow}
              handleDeleteModalClose={handleDeleteModalClose}
              handlefetchProjects={handlefetchProjects}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
