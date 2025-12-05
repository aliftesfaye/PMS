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
    color: "#1e3a8a",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
      return `${(Math.round(billions * 100) / 100).toFixed(2)}B ETB`;
    } else if (budget >= 1000000) {
      const millions = budget / 1000000;
      return `${(Math.round(millions * 100) / 100).toFixed(2)}M ETB`;
    }
    return `${budget.toLocaleString()} ETB`;
  };

  const getColorByRange = (value) => {
    if (!value) return "#1e3a8a";

    const colorRanges = [
      { range: ["a".charCodeAt(0), "e".charCodeAt(0)], color: "#dc2626" },
      { range: ["f".charCodeAt(0), "j".charCodeAt(0)], color: "#059669" },
      { range: ["k".charCodeAt(0), "o".charCodeAt(0)], color: "#7c3aed" },
      { range: ["p".charCodeAt(0), "t".charCodeAt(0)], color: "#1d4ed8" },
      { range: ["u".charCodeAt(0), "z".charCodeAt(0)], color: "#475569" },
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
    height: 60,
    "&:hover": {
      backgroundColor: "#f8fafc",
      transition: "background-color 0.2s ease",
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "16px 24px",
    fontSize: "0.875rem",
    color: "#334155",
  }));

  const handleChange = (event, value) => {
    paginate(value);
  };

  return (
    <div className="ml-auto w-full lg:w-4/5 mr-0 lg:mr-5 mt-24 px-4 lg:px-0 relative">
      <Helmet>
        <title>PMS - Projects</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Projects
        </h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor all your projects
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
          {["All", "Completed", "On Progress", "Canceled"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterClick(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                statusFilter === status
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-900 hover:bg-blue-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Create Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-auto">
            <TextField
              type="text"
              placeholder="Search projects..."
              size="small"
              className="w-full lg:w-64"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                classes: {
                  root: "rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                },
              }}
            />
          </div>
          {createProject !== 0 && (
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow whitespace-nowrap"
              onClick={() => handleAddClick()}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Project
            </button>
          )}
        </div>
      </div>

      {/* Rows per page selector */}
      {projects.length !== 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredRows.length)} of{" "}
            {filteredRows.length} projects
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Rows per page:
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Box sx={{ width: "100%" }}>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? "100ms" : "0ms",
            }}
            unmountOnExit
          >
            <LinearProgress sx={{ height: 2 }} />
          </Fade>
        </Box>

        {currentItems.length !== 0 ? (
          <div className="overflow-x-auto">
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <BoldTableCell sx={{ padding: "20px 24px" }}>
                    <div className="header-cell">Project Name</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Start Date</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">End Date</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Budget</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Members</div>
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
                  return (
                    <StyledTableRow key={row.project_id}>
                      <StyledTableCell onClick={() => handleProjectClick(row)}>
                        <div className="flex items-center cursor-pointer group">
                          <div
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold mr-3 transition-all duration-200 group-hover:scale-105"
                            style={{
                              backgroundColor: getColorByRange(
                                row.name.charAt(0)
                              ),
                            }}
                          >
                            {row.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                              {row.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              ID: {row.project_id.slice(0, 7)}
                            </div>
                          </div>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="font-medium text-gray-900">
                          {new Date(row.start_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="font-medium text-gray-900">
                          {new Date(row.end_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div className="font-semibold text-gray-900">
                          {formatBudget(row.budget)}
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        {viewProjectMembers !== 0 ? (
                          <Tooltip title="View Project Members" placement="top">
                            <button
                              onClick={() => handleViewClick(row)}
                              className="text-blue-900 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            >
                              <FaUsers size={20} />
                            </button>
                          </Tooltip>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                            row.overall_progress === "Completed"
                              ? "bg-green-100 text-green-800"
                              : row.overall_progress === "On Progress"
                              ? "bg-blue-100 text-blue-800"
                              : row.overall_progress === "Canceled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {row.overall_progress}
                        </div>
                      </StyledTableCell>
                      {(updateProject !== 0 || deleteProject !== 0) && (
                        <StyledTableCell>
                          <div className="flex items-center gap-2">
                            {updateProject !== 0 && (
                              <Tooltip title="Edit Project" placement="top">
                                <button
                                  onClick={() => handleEditClick(row)}
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                >
                                  <FaEdit size={16} />
                                </button>
                              </Tooltip>
                            )}
                            {deleteProject !== 0 && (
                              <Tooltip title="Delete Project" placement="top">
                                <button
                                  onClick={() => handleDeleteClick(row)}
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                  <FaTrash size={16} />
                                </button>
                              </Tooltip>
                            )}
                          </div>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No projects found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {noProject === "No Project Found"
                ? "No projects match your current filters. Try adjusting your search or filters."
                : "Loading projects..."}
            </p>
            {noProject === "No Project Found" && createProject !== 0 && (
              <button
                onClick={() => handleAddClick()}
                className="mt-4 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create your first project
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {projects.length !== 0 && search.length > 0 && (
        <div className="mt-6 flex justify-center mb-20">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "0.875rem",
                  margin: "0 2px",
                  "&.Mui-selected": {
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-4/5 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Project
              </h2>
              <button
                onClick={handleAddModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Projectscreate
                selectedRow={selectedRow}
                handlefetchProjects={handlefetchProjects}
                handleCloseModal={handleAddModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-4/5 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
              <button
                onClick={handleEditModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Projectsedit
                selectedRow={selectedRow}
                handlefetchProjects={handlefetchProjects}
                handleCloseModal={handleEditModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-2/3 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Project Details
              </h2>
              <button
                onClick={handleViewModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Projectsview selectedRow={selectedRow} />
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-1/2 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Delete Project
              </h2>
              <button
                onClick={handleDeleteModalClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Projectdelete
                selectedRow={selectedRow}
                handleDeleteModalClose={handleDeleteModalClose}
                handlefetchProjects={handlefetchProjects}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
