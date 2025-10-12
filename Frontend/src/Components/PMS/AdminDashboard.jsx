import CloseIcon from "@mui/icons-material/Close";
import { Pagination } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";

import "./Home.css";
//icons
import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

import Container from "@mui/material/Container";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// Table
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { tableCellClasses } from "@mui/material/TableCell";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

//Charts
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
//
import { CardActionArea } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import SearchIcon from "../Assets/Search-icon.png";

const projectOptions = [
  "Smart Court System",
  "Police Commission System",
  "Project Managment System",
  "User Managment System",
  "Customs Commision System",
  "Planning and Monitoring",
];

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: "none", // Remove bottom border from all cells
  padding: "12px", // Adjust padding for cell content
  fontWeight: "bold", // Make text bold
  color: "#444", // Darker text color
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#f0f0f7", // Light background color on hover
  },
}));

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const AdminDashboard = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProject, setSelectedProject] = useState();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [noProject, setNoProject] = useState();
  const [totalProjects, setTotalProjects] = useState();
  const [completedProjects, setCompletedProjects] = useState();
  const [sectors, setSectors] = useState();
  const [onProgressProjects, setOnProgressProjects] = useState();
  const [pendingProjects, setPendingProjects] = useState();
  const [projectManagers, setProjectManagers] = useState([]);
  const [projects2, setProjects2] = useState([]);
  const [selectedProject2, setSelectedProject2] = useState(null);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const fetchProjects = async () => {
    try {
      setLoading(true);
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

      setProjects2(filteredProjects);

      const totalProjects = filteredProjects.length;
      const completedProjects = filteredProjects.filter(
        (project) => project.overall_progress === "Completed"
      ).length;
      const inProgressProjects = filteredProjects.filter(
        (project) => project.overall_progress === "On Progress"
      ).length;
      const pendingProjects = filteredProjects.filter(
        (project) => project.overall_progress === "Pending"
      ).length;

      const sortedResponse = filteredProjects.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        } else if (a.createdAt < b.createdAt) {
          return 1;
        }
        return 0;
      });

      const projectManagers = filteredProjects.map(
        (project) => project.project_manager
      );

      setProjects(sortedResponse);
      setLoading(false);

      setTotalProjects(totalProjects);
      setCompletedProjects(completedProjects);
      setOnProgressProjects(inProgressProjects);
      setPendingProjects(pendingProjects);
      setProjectManagers(projectManagers);

      setNoProject(
        filteredProjects.length === 0 ? "No Project Found" : "Loading..."
      );
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const data2 = [
    { label: "Total Completed", value: completedProjects, color: "green" },
    {
      label: "Total On Progress",
      value: onProgressProjects,
      color: "#FFA500",
    },
    {
      label: "Total Pending",
      value: pendingProjects,
      color: "#808080",
    },
  ];

  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [performance, setPerformance] = useState(true);
  const [performanceDetail, setPerformanceDetail] = useState(false);
  const [showCreateProjectContainer, setShowCreateProjectContainer] =
    useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handlePerformanceDetail = () => {
    setPerformance(false);
    setPerformanceDetail(true);
  };

  const handleTableClose = () => {
    setPerformance(true);
    setPerformanceDetail(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontSize: 15,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projects.length);

  const displayedProjects = projects.slice(startIndex, endIndex);

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

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  const filteredRows = projects.filter(
    (row) =>
      row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  const handleChange = (event, value) => {
    paginate(value);
  };

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);

  const filterMilestoneActivities = (projectId) => {
    const project = projects2.find(
      (project) => project.project_id === projectId
    );
    if (project) {
      const milestoneActivities = project.activity.filter(
        (activity) => activity.is_milestone === true
      );
      setFilteredActivities(milestoneActivities);
    } else {
      setFilteredActivities([]);
    }
  };

  const handleProjectChange = (option) => {
    setSelectedProject2(option);
  };

  let chartComponent = null;

  if (filteredActivities.length > 0) {
    chartComponent = (
      <div className="mt-4 overflow-x-auto min-w-96">
        <BarChart
          series={[
            {
              data: filteredActivities.map((data) => {
                const progress = function (start_date, end_date) {
                  const currentDate = new Date();
                  const totalDuration =
                    new Date(end_date) - new Date(start_date);
                  const elapsedDuration = currentDate - new Date(start_date);
                  const progress = Math.min(
                    Math.max((elapsedDuration / totalDuration) * 100, 0),
                    100
                  );
                  return progress;
                };

                const progress_result = progress(
                  data.start_date,
                  data.end_date
                );

                return parseInt(progress_result);
              }),
              stack: "A",
              label: "Milestones",
            },
            // Add more series as needed
          ]}
          height={320}
          xAxis={[
            {
              data: filteredActivities.map((activity) => activity.name), // Assuming 'name' is the activity name
              scaleType: "band",
              paddingInner: 0.6,
              paddingOuter: 0.2,
            },
          ]}
          margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
        />
      </div>
    );
  } else {
    chartComponent = <p className="text-center">No Milestone found.</p>;
  }

  const dropdownOptions = projects2.map((project) => ({
    value: project.project_id,
    label: project.name,
  }));

  useEffect(() => {
    if (selectedProject2 !== null) {
      filterMilestoneActivities(selectedProject2.value);
    }
  }, [selectedProject2]);

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();
    fetchProjects();
  }, [userInfo]);
  return (
    <div style={{ backgroundColor: "#f1f4f6" }}>
      <Helmet>
        <title>PMS - Admin Dashboard</title>
      </Helmet>

      <div className="ml-auto w-4/5 mr-6 mt-24 ">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
        <Container maxWidth="lg" sx={{ paddingBottom: 3 }}>
          <Grid container spacing={3} sx={{ marginBottom: 3 }}>
            {/* Total Projects Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <ListAltIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Total Projects</Typography>
                    <Typography variant="body1">{totalProjects}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Completed Projects Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <ChecklistIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Completed Projects</Typography>
                    <Typography variant="body1">{completedProjects}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Inprogress Projects Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <HistoryToggleOffIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">OnProgress Projects</Typography>
                    <Typography variant="body1">
                      {onProgressProjects}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Coming Projects Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={3}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <TimelineOutlinedIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Pending Projects</Typography>
                    <Typography variant="body1">{pendingProjects}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <box class="shadow-3xl my-10 rounded-lg ">
            {" "}
            <div className="">
              <div class="pt-10 pb-7 px-5 border-t-2 rounded-t-lg border-x-2  text-xl font-bold text-sky-950 bg-white">
                Project Information
              </div>
            </div>
            <div class="border-x-2">
              <TableContainer component={Paper} sx={{}}>
                <div className="rows-per-page flex ml-2 py-8 justify-start ">
                  <div>
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
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Project Name</StyledTableCell>
                      <StyledTableCell>Start Date</StyledTableCell>
                      <StyledTableCell>End Date</StyledTableCell>
                      <StyledTableCell>Budget</StyledTableCell>
                      <StyledTableCell>Project Manager</StyledTableCell>
                      <StyledTableCell>Department</StyledTableCell>
                      {/* <StyledTableCell>Completion</StyledTableCell> */}
                      <StyledTableCell>Status</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentItems.map((project, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <span
                              className="initials"
                              style={{
                                backgroundColor: getColorByRange(
                                  project.name.charAt(0)
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
                              {project.name.charAt(0).toUpperCase()}
                            </span>
                            <span style={{ fontWeight: "bold" }}>
                              {project.name}
                            </span>
                          </div>
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(project.start_date).toLocaleDateString()}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(project.end_date).toLocaleDateString()}
                        </StyledTableCell>
                        <StyledTableCell>
                          {formatBudget(project.budget)}
                        </StyledTableCell>
                        <StyledTableCell>
                          {projectManagers[index]
                            .map((user) => user.UserRoleToUser.full_name)
                            .join(" , ")}
                        </StyledTableCell>
                        <StyledTableCell>
                          {project.division ? project.division.name : "N/A"}
                        </StyledTableCell>

                        {/* <StyledTableCell>
                          <ProgressBar
                            completed={parseInt(project.completion)}
                            bgColor="#2196f3"
                            borderRadius="5px"
                            height="10px"
                          />
                        </StyledTableCell> */}
                        <StyledTableCell>
                          {project.overall_progress === "Completed" && (
                            <span
                              style={{ color: "#4caf50", fontWeight: "bold" }}
                            >
                              Completed
                            </span>
                          )}
                          {project.overall_progress === "Canceled" && (
                            <span
                              style={{ color: "#f44336", fontWeight: "bold" }}
                            >
                              Canceled
                            </span>
                          )}
                          {project.overall_progress === "On Progress" && (
                            <span
                              style={{ color: "#ff9800", fontWeight: "bold" }}
                            >
                              On Progress
                            </span>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box className="text-sm flex justify-end mt-1 pb-5 pt-5">
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
              </TableContainer>
            </div>
          </box>
          <Grid container spacing={2} sx={{ marginY: 3, marginBottom: 5 }}>
            <Grid item xs={12} md={8}>
              <div className="shadow-lg border border-gray-200 rounded-lg bg-white">
                <div className="flex justify-between items-center py-5 px-5">
                  <h2 className="text-lg font-bold text-blue-900">
                    Milestone Completion
                  </h2>
                  <Dropdown
                    options={dropdownOptions}
                    onChange={handleProjectChange}
                    value={selectedProject2}
                    placeholder="Select Project"
                  />
                </div>

                <div className="overflow-x-auto max-w-full ">
                  {chartComponent}
                </div>
              </div>
            </Grid>

            {/* Right side content (Project Statistics) */}
            <Grid item xs={12} md={4}>
              <div className="shadow-lg border border-gray-200 rounded-lg bg-white">
                <div className="py-10 px-5 text-lg font-bold text-blue-900">
                  Project Statistics
                </div>
                <div className="flex justify-center">
                  {/* Replace PieChart with appropriate Material-UI component */}
                  <PieChart
                    margin={{ bottom: 100, left: 100, right: 100 }}
                    series={[
                      {
                        data: data2,
                        innerRadius: 60,
                        outerRadius: 80,
                      },
                    ]}
                    height={300}
                    width={350}
                    slotProps={{
                      legend: {
                        direction: "column",
                        position: { vertical: "bottom", horizontal: "middle" },
                        padding: 0,
                      },
                    }}
                  />
                </div>
              </div>
            </Grid>
          </Grid>

          <div class="hidden">
            {performance && (
              <div>
                <box class="shadow-3xl my-10 rounded-lg border-t-2 ">
                  <div style={{ backgroundColor: "#f7f6fe" }}>
                    <div className="flex flex-wrap items-center justify-between">
                      <text class="p-5 text-lg font-bold text-sky-950">
                        Members Performance
                      </text>
                      <div class="flex flex-wrap gap-9">
                        <div>
                          <Dropdown
                            options={projectOptions}
                            onChange={(values) => setSelectedProject(values)}
                            placeholder="Select project"
                          />
                        </div>
                        <div class="bg-white items-center flex px-3 space-x-3 border-x-2 border-y-2">
                          <img src={SearchIcon} alt="Search Icon" />
                          <input
                            type="text"
                            placeholder="Search member"
                            style={{
                              border: "none",
                              outline: "none",
                              backgroundColor: "#fff",
                              width: "200px",
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </box>
                <box class="shadow-3xl lg:flex ">
                  {" "}
                  <div
                    style={{ backgroundColor: "#f7f6fe" }}
                    class="content-center"
                  >
                    <div className="flex flex-wrap gap-18">
                      <div className="flex flex-col space-y-20 p-5">
                        <div className="text-center space-y-5">
                          <p className="text-3xl font-medium font-sans">22</p>
                          <p className="text-xl font-medium font-sans">
                            Total Tasks
                          </p>
                        </div>
                        <div className="text-center space-y-5">
                          <p className="text-3xl font-medium font-sans">26</p>
                          <p className="text-xl font-medium font-sans">
                            Completed Tasks
                          </p>
                        </div>
                      </div>{" "}
                    </div>
                  </div>
                  <div
                    class="rounded-lg lg:py-16 lg:pr-20 "
                    style={{ backgroundColor: "#f7f6fe" }}
                  >
                    <div className="flex flex-wrap gap-8 ">
                      <Grid
                        container
                        spacing={{ xs: 2, md: 3 }}
                        columns={{ xs: 2, sm: 8, md: 12 }}
                      >
                        {displayedProjects.map((project, index) => (
                          <Grid item xs={4}>
                            <Item class="border-x-2 border-y-2 bg-slate-400">
                              <Card
                                style={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              >
                                <CardActionArea
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    justifyContent: "space-between",
                                  }}
                                  onClick={handlePerformanceDetail}
                                >
                                  <CardContent>
                                    {/* <img
                                    src={require(`../Assets/${project.projmanager}.png`)}
                                    alt="Project Manager"
                                    class="w-16 h-16 place-self-center"
                                  /> */}
                                    <Typography
                                      gutterBottom
                                      variant="h5"
                                      component="div"
                                    >
                                      {/* {project.projmanager} */}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {/* {project.completion}% */}
                                    </Typography>
                                  </CardContent>
                                </CardActionArea>
                              </Card>
                            </Item>
                          </Grid>
                        ))}
                      </Grid>
                      <div class="justify-center">
                        <button
                          className="prev-button"
                          onClick={handlePreviousPage}
                        >
                          {" "}
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                          <span
                            key={index + 1}
                            className={
                              currentPage === index + 1 ? "active-page" : ""
                            }
                            onClick={() => handlePageChange(index + 1)}
                          >
                            {index + 1}
                          </span>
                        ))}
                        <button
                          className="next-button"
                          onClick={handleNextPage}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                </box>
              </div>
            )}
            {performanceDetail && (
              <div>
                <box class="shadow-3xl my-10 rounded-lg border-t-2 ">
                  {" "}
                  <div style={{ backgroundColor: "#f7f6fe" }}>
                    <div className="flex flex-wrap items-center justify-between">
                      <text class="p-5 text-lg font-bold text-sky-950">
                        Members Performance
                      </text>
                      <div class="flex flex-wrap gap-9">
                        <div class="bg-white items-center flex px-3 space-x-3 border-x-2 border-y-2">
                          <img src={SearchIcon} alt="Search Icon" />
                          <input
                            type="text"
                            placeholder="Search member"
                            style={{
                              border: "none",
                              outline: "none",
                              backgroundColor: "#fff",
                              width: "200px",
                            }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </box>
                <Box className="shadow-3xl lg:flex border-x-2 border-b-2">
                  <Box
                    sx={{ backgroundColor: "#f7f6fe" }}
                    className="content-center"
                  >
                    <Grid
                      container
                      justifyContent="center"
                      alignItems="center"
                      spacing={4}
                      className="p-8"
                    >
                      <Grid item xs={12} md={6}>
                        <Box className="flex flex-col items-center space-y-5">
                          <Typography
                            variant="h3"
                            className="font-medium text-purple-900"
                          >
                            22
                          </Typography>
                          <Typography
                            variant="h5"
                            className="font-medium text-purple-900"
                          >
                            Total Tasks
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box className="flex flex-col items-center space-y-5">
                          <Typography
                            variant="h3"
                            className="font-medium text-purple-900"
                          >
                            26
                          </Typography>
                          <Typography
                            variant="h5"
                            className="font-medium text-purple-900"
                          >
                            Completed Tasks
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box sx={{ flexGrow: 1, backgroundColor: "#f7f6fe" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Paper elevation={3} className="p-4">
                          <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                          >
                            <Grid item>
                              <img
                                src={require(`../Assets/Leader.png`).default}
                                alt="Project Manager"
                                className="w-16 h-16"
                              />
                            </Grid>
                            <Grid item>
                              <Typography variant="h6" className="text-center">
                                Project Manager
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                10%
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Paper elevation={3} className="p-4">
                          <Box className="flex justify-between items-center">
                            <Typography
                              variant="h6"
                              className="font-bold text-purple-900"
                            >
                              Smart Court System
                            </Typography>
                            <IconButton onClick={handleTableClose}>
                              <CloseIcon />
                            </IconButton>
                          </Box>

                          <TableContainer
                            component={Paper}
                            className="max-h-96 overflow-auto"
                          >
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Task Name</TableCell>
                                  <TableCell>Completion</TableCell>
                                  <TableCell>Stage</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {projects
                                  .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                  )
                                  .map((project, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        backgroundColor:
                                          index % 2 === 0 ? "#f7f6fe" : "white",
                                      }}
                                    >
                                      <TableCell>{project.name}</TableCell>
                                      <TableCell>
                                        <LinearProgress
                                          variant="determinate"
                                          value={project.completion}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          className={
                                            project.status === "Completed"
                                              ? "text-green-600"
                                              : project.status === "Canceled"
                                              ? "text-red-600"
                                              : "text-purple-600"
                                          }
                                        >
                                          {project.status}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                25,
                                { label: "All", value: -1 },
                              ]}
                              component="div"
                              count={projects.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                          </TableContainer>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AdminDashboard;
