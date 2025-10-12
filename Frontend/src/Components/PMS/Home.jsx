import {
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import "./Home.css";

//icons
import ChecklistIcon from "@mui/icons-material/Checklist";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

import Container from "@mui/material/Container";
import "react-dropdown/style.css";

// Table
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Pagination } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import apiService from "../services/apiServices";

//Charts

//
import SearchIcon from "@mui/icons-material/Search";

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
    <div className="ml-auto w-4/5 mr-5 mt-24 relative">
      <Helmet>
        <title>PMS - Home</title>
      </Helmet>
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
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Home = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [selectedProject, setSelectedProject] = useState();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [projects, setProjects] = useState([]);
  const [projects2, setProjects2] = useState([]);
  const [projectsAssigned, setProjectsAssigned] = useState([]);

  const [totalProjects, setTotalProjects] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [onProgressProjects, setOnProgressProjects] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setProjects(response.Projects);
      setProjects2(response.Projects);
      setProjectsAssigned(response.Projects);
      setTotalProjects(response.Projects.length);
      const completedProjects = response.Projects.filter(
        (project) => project.overall_progress === "Completed"
      );
      const onProgressProjects = response.Projects.filter(
        (project) => project.overall_progress === "On Progress"
      );
      setCompletedProjects(completedProjects.length);
      setOnProgressProjects(onProgressProjects.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const projectsWithSubtasks = projects.filter((project) =>
    project.activity.some((activity) =>
      activity.Task.some((task) => task.subTask.length > 0)
    )
  );

  const totalSubtasksLength = projectsWithSubtasks.reduce((total, project) => {
    return (
      total +
      project.activity.reduce((acc, activity) => {
        return (
          acc +
          activity.Task.reduce((sum, task) => {
            return sum + task.subTask.length;
          }, 0)
        );
      }, 0)
    );
  }, 0);

  const totalCompletedSubtasksLength = projectsWithSubtasks.reduce(
    (total, project) => {
      return (
        total +
        project.activity.reduce((acc, activity) => {
          return (
            acc +
            activity.Task.reduce((sum, task) => {
              return (
                sum +
                task.subTask.reduce((subtaskSum, subtask) => {
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "Completed") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
                  }
                }, 0)
              );
            }, 0)
          );
        }, 0)
      );
    },
    0
  );

  const totalPendingSubtasksLength = projectsWithSubtasks.reduce(
    (total, project) => {
      return (
        total +
        project.activity.reduce((acc, activity) => {
          return (
            acc +
            activity.Task.reduce((sum, task) => {
              return (
                sum +
                task.subTask.reduce((subtaskSum, subtask) => {
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "Pending") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
                  }
                }, 0)
              );
            }, 0)
          );
        }, 0)
      );
    },
    0
  );

  const totalInProgressSubtasksLength = projectsWithSubtasks.reduce(
    (total, project) => {
      return (
        total +
        project.activity.reduce((acc, activity) => {
          return (
            acc +
            activity.Task.reduce((sum, task) => {
              return (
                sum +
                task.subTask.reduce((subtaskSum, subtask) => {
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "On Progress") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
                  }
                }, 0)
              );
            }, 0)
          );
        }, 0)
      );
    },
    0
  );
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  const projectsData = [
    {
      name: "Project 1",
      dueDate: "2024-03-01",
      startDate: "2020-03-01",
      status: "Completed",
      projmanager: "Leader",
      completion: "50",
      members: ["Member1", "Leader", "Member1"],
    },
    {
      name: "Project 2",
      dueDate: "2024-03-01",
      startDate: "2024-03-01",
      status: "Process",
      projmanager: "Member1",
      completion: "15",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "Project 3",
      dueDate: "2024-03-01",
      startDate: "2020-03-01",
      status: "Canceled",
      projmanager: "Leader",
      completion: "20",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "Project 4",
      dueDate: "2024-03-01",
      startDate: "2024-01-01",
      status: "Canceled",
      projmanager: "Member1",
      completion: "25",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "Hoject 5",
      dueDate: "2024-03-01",
      startDate: "2024-02-01",
      status: "Process",
      projmanager: "Member1",
      completion: "35",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "apbc 6",
      dueDate: "2024-03-01",
      startDate: "2024-03-01",
      status: "Process",
      projmanager: "Leader",
      completion: "30",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "Hoject 5",
      dueDate: "2024-03-01",
      startDate: "2019-03-01",
      status: "Process",
      projmanager: "Member1",
      completion: "40",
      members: ["Member1", "Member1", "Leader"],
    },
    {
      name: "Hoject 5",
      dueDate: "2024-03-01",
      startDate: "2018-03-01",
      status: "Process",
      projmanager: "Member1",
      completion: "50",
      members: ["Member1", "Member1", "Leader"],
    },
  ];
  const data2 = [
    {
      label: "Total Completed",
      value: totalCompletedSubtasksLength,
      color: "green",
    },
    {
      label: "Total On Progress",
      value: totalInProgressSubtasksLength,
      color: "#FFA500",
    },
    {
      label: "Total Pending",
      value: totalPendingSubtasksLength,
      color: "#808080",
    },
  ];

  const itemsPerPage = 6;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const calculateProgress = (startDate, endDate) => {
    const currentDate = new Date();
    const totalDuration = new Date(endDate) - new Date(startDate);
    const elapsedDuration = currentDate - new Date(startDate);
    const progress = Math.min(
      Math.max((elapsedDuration / totalDuration) * 100, 0),
      100
    );
    return progress;
  };

  const getProgressColor = (progress, taskStatus) => {
    if (taskStatus === "Completed") {
      return "green"; // Completed tasks are green
    } else if (progress < 75) {
      return "orange"; // Less than 75% progress is orange
    } else if (progress <= 100 && taskStatus !== "Completed") {
      return "#A52A2A"; // In progress tasks (75-100%) are dark red
    } else {
      return "blue"; // Default color for other cases
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.activity.some((activity) =>
      activity.Task.some(
        (task) =>
          task.subTask &&
          task.subTask.some(
            (subTask) =>
              subTask.name &&
              subTask.name
                .toLowerCase()
                .includes(searchTerm ? searchTerm.toLowerCase() : "")
          )
      )
    )
  );

  const allSubTasks = filteredProjects.flatMap((project) =>
    project.activity.flatMap((activity) =>
      activity.Task.flatMap((task) =>
        task.subTask
          ? task.subTask
              .filter(
                (subTask) =>
                  subTask.name &&
                  subTask.name
                    .toLowerCase()
                    .includes(searchTerm ? searchTerm.toLowerCase() : "")
              )
              .map((subTask) => ({
                ...subTask,
                projectName: project.name,
              }))
          : []
      )
    )
  );

  const isDueWithin15Days = (dueDate) => {
    const today = new Date();
    const dueDateObj = new Date(dueDate);
    const fifteenDaysFromNow = new Date(today);
    fifteenDaysFromNow.setDate(today.getDate() + 15);
    return dueDateObj >= today && dueDateObj <= fifteenDaysFromNow;
  };

  const filteredProjects2 = projects.flatMap((project) =>
    project.activity.flatMap((activity) =>
      activity.Task.flatMap((task) =>
        task.subTask
          ? task.subTask
              .filter(
                (subTask) =>
                  subTask.end_date && isDueWithin15Days(subTask.end_date)
              )
              .map((subTask) => ({
                ...subTask,
                projectName: project.name,
              }))
          : []
      )
    )
  );

  const sortedSubTasks = filteredProjects2.sort((a, b) => {
    const dueDateA = new Date(a.end_date);
    const dueDateB = new Date(b.end_date);
    return dueDateA - dueDateB;
  });
  const limitedSubTasks = sortedSubTasks.slice(0, 10);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = allSubTasks.slice(indexOfFirstItem, indexOfLastItem);
  const pageCount = Math.ceil(allSubTasks.length / rowsPerPage);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleChange = (event, value) => {
    paginate(value);
  };

  const indexOfLastItem2 = currentPage2 * rowsPerPage2;
  const indexOfFirstItem2 = indexOfLastItem2 - rowsPerPage2;
  const currentItems2 = projectsAssigned.slice(
    indexOfFirstItem2,
    indexOfLastItem2
  );
  const pageCount2 = Math.ceil(projectsAssigned.length / rowsPerPage2);
  const paginate2 = (pageNumber) => {
    setCurrentPage2(pageNumber);
  };
  const handleChange2 = (event, value) => {
    paginate2(value);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const handleRowsPerPageChange2 = (event) => {
    setRowsPerPage2(parseInt(event.target.value, 10));
    setCurrentPage2(1);
  };

  const totalPages = Math.ceil(projectsData.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, projectsData.length);

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

  const sortByEndDate = (subTasks) => {
    return subTasks
      .slice()
      .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
  };

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchData();
    fetchUsers();
  }, [userInfo]);
  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 z-10">
      <Container maxWidth="lg">
        <Grid container spacing={5} className="my-6" justifyContent="center">
          {/* Project Assigned Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <ListAltIcon fontSize="medium" />
                </Grid>
                <Grid item>
                  <Typography variant="h7">Project Assigned</Typography>
                  <Typography variant="body2">{totalProjects}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Project Completed Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <ChecklistIcon fontSize="medium" />
                </Grid>
                <Grid item>
                  <Typography variant="h7">Project Completed</Typography>
                  <Typography variant="body2">{completedProjects}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Project Inprogress Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              elevation={3}
              sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <HistoryToggleOffIcon fontSize="medium" />
                </Grid>
                <Grid item>
                  <Typography variant="h7">Project On Progress</Typography>
                  <Typography variant="body2">{onProgressProjects}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
        <box>
          {" "}
          <div
            class="flex flex-wrap justify-between items-center pt-8 px-8"
            style={{ backgroundColor: "#f7f6fe" }}
          >
            <Typography class="font-bold text-3xl">Task List</Typography>
            <div
              className="self-center"
              style={{
                top: "0",
                zIndex: "1",
                padding: "10px 20px",
              }}
            >
              <TextField
                size="small"
                className="bg-white rounded-lg"
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
          </div>
          <div class="lg:flex border-x-2 border-b-2 shadow-3xl">
            <div style={{ backgroundColor: "#f7f6fe" }} class="content-center">
              <div className="flex flex-wrap gap-18">
                <div className="flex flex-col space-y-10 p-5">
                  <div className="text-center space-y-5">
                    {/* <p className="text-3xl font-medium font-sans">{totalTasks}</p> */}
                    <p className="text-3xl font-bold font-sans text-pretty">
                      {totalSubtasksLength}
                    </p>

                    <p className="text-xl font-bold font-sans text-pretty">
                      My Total Tasks
                    </p>
                  </div>
                  <div className="text-center space-y-5">
                    {/* <p className="text-3xl font-medium font-sans">
                    {completedTasks.length} 
                  </p> */}
                    <p className="text-3xl font-bold font-sans text-pretty">
                      {totalCompletedSubtasksLength}
                    </p>
                    <p className="text-xl font-bold font-sans text-pretty">
                      My Completed Tasks
                    </p>
                  </div>
                </div>{" "}
              </div>
            </div>
            <div
              class="rounded-lg lg:py-16 lg:pr-20  w-full"
              style={{ backgroundColor: "#f7f6fe" }}
            >
              <TableContainer
                sx={{
                  width: "100%",
                  border: 0.5,
                  borderRadius: 3,
                  borderColor: "#c7c7c7",
                  backgroundColor: "#fff",
                }}
              >
                <Table
                  sx={{
                    // minWidth: 900,
                    minHeight: 400,
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                    },
                  }}
                  size="large"
                >
                  {/* {totalTasks !== 0 ? ( */}
                  <>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Task Name</StyledTableCell>
                        <StyledTableCell>Project Name</StyledTableCell>
                        <StyledTableCell>Task Due Date</StyledTableCell>
                        <StyledTableCell>Completion</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((subTask, subTaskIndex) => {
                        const progress = calculateProgress(
                          subTask.start_date,
                          subTask.end_date
                        );
                        return (
                          <StyledTableRow
                            key={`${subTaskIndex}`}
                            className={
                              subTaskIndex % 2 === 0 ? "even-row" : "odd-row"
                            }
                          >
                            <StyledTableCell>{subTask.name}</StyledTableCell>
                            <StyledTableCell>
                              {subTask.projectName}
                            </StyledTableCell>
                            <StyledTableCell>
                              {new Date(subTask.end_date).toLocaleDateString()}
                            </StyledTableCell>
                            <StyledTableCell>
                              <div class="mx-5">
                                <div className="progress-container">
                                  <div
                                    className="progress-bar"
                                    style={{
                                      width: `${progress}%`,
                                      backgroundColor: getProgressColor(
                                        progress,
                                        subTask.subtask_status
                                      ),
                                    }}
                                  />
                                  <span className="progress-text">{`${progress.toFixed(
                                    1
                                  )}%`}</span>
                                </div>
                              </div>
                            </StyledTableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </>
                </Table>
              </TableContainer>
              <div className="flex flex-wrap justify-end gap-5">
                <div className="rows-per-page flex my-6 ml-2 justify-start text-sm ">
                  {" "}
                  Rows per page
                  <div>
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className=" w-fit pl-3 text-sm border-none outline-none bg-white  focus:border-none focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <Box className="text-sm flex  mt-1 pb-5 pt-5">
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        </box>
        <Grid container spacing={3} sx={{ py: 5 }}>
          {/* Left Section: Task Table */}
          <Grid item xs={12} md={8}>
            <Paper elevation={1} sx={{ p: 3, height: "100%" }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#0066cc" }}>
                  Near Due Date Tasks
                </Typography>
              </Box>
              <TableContainer
                sx={{
                  borderRadius: 3,
                  borderColor: "#c7c7c7",
                }}
              >
                <Table
                  sx={{
                    minWidth: 500,
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                    },
                  }}
                  size="small"
                >
                  {/* {totalTasks !== 0 ? ( */}
                  <>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Task Name</StyledTableCell>
                        <StyledTableCell>Project Name</StyledTableCell>
                        <StyledTableCell>Task Due Date</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {limitedSubTasks.map((subTask, subTaskIndex) => (
                        <TableRow
                          key={`${subTaskIndex}`}
                          sx={{
                            background: subTaskIndex % 2 ? "white" : "#f7f6fe",
                          }}
                        >
                          <TableCell>{subTask.name}</TableCell>
                          <TableCell>{subTask.projectName}</TableCell>
                          <TableCell>
                            {new Date(subTask.end_date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    {/* <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[
                            5,
                            10,
                            25,
                            { label: "All", value: -1 },
                          ]}
                          colSpan={3}
                          count={projectsData.length}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          slotProps={{
                            select: {
                              inputProps: {
                                "aria-label": "rows per page",
                              },
                              native: true,
                            },
                          }}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter> */}
                  </>
                </Table>
              </TableContainer>
              {/* <div className="flex flex-wrap justify-end gap-5">
                <div className="rows-per-page flex my-6 ml-2 justify-start text-sm ">
                  {" "}
                  Rows per page
                  <div>
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className=" w-fit pl-3 text-sm border-none outline-none bg-white  focus:border-none focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <Box className="text-sm flex  mt-1 pb-5 pt-5">
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              </div> */}
            </Paper>
          </Grid>

          {/* Right Section: Project Statistics */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#0066cc" }}>
                  Project Statistics
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
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
                  minWidth={350}
                  slotProps={{
                    legend: {
                      direction: "column",
                      position: { vertical: "bottom", horizontal: "middle" },
                      padding: 0,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {performance && (
          <div class="mb-36  rounded-t-lg border-x-2 border-y-2">
            <div class="pt-10 pb-7 px-5   text-xl font-bold text-sky-950">
              Project Assigned
            </div>
            <div class="">
              <TableContainer
                sx={{
                  width: "100%",
                }}
              >
                <Table
                  sx={{
                    minWidth: 900,
                    [`& .${tableCellClasses.root}`]: {
                      borderBottom: "none",
                    },
                  }}
                  size="midium"
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Project Name</StyledTableCell>
                      <StyledTableCell>Start Date</StyledTableCell>
                      <StyledTableCell>End Date</StyledTableCell>
                      {/* <StyledTableCell>Completion</StyledTableCell> */}
                      <StyledTableCell className="project_status">
                        Status
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody stripedRows>
                    {projectsAssigned.map((project, index) => (
                      <StyledTableRow
                        class="clickable-row"
                        style={
                          index % 2
                            ? { background: "white" }
                            : { background: "#f7f6fe" }
                        }
                      >
                        <StyledTableCell component="th" scope="row">
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
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(project.start_date).toLocaleDateString()}
                        </StyledTableCell>
                        <StyledTableCell>
                          {new Date(project.end_date).toLocaleDateString()}
                        </StyledTableCell>

                        {/* <StyledTableCell>
                          <div class="mx-5">
                            <ProgressBar
                              completed={parseInt(project.completion)}
                              bgColor="#082f49"
                              borderRadius="5px"
                            />
                          </div>
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
                  {/* <TableFooter>
                    <TableRow>
                      <TablePagination
                        rowsPerPageOptions={[
                          5,
                          10,
                          25,
                          { label: "All", value: -1 },
                        ]}
                        colSpan={3}
                        count={projectsData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        slotProps={{
                          select: {
                            inputProps: {
                              "aria-label": "rows per page",
                            },
                            native: true,
                          },
                        }}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </TableRow>
                  </TableFooter> */}
                </Table>
              </TableContainer>
              <div className="flex flex-wrap justify-end gap-5">
                <div className="rows-per-page flex my-6 ml-2 justify-start text-sm ">
                  {" "}
                  Rows per page
                  <div>
                    <select
                      value={rowsPerPage2}
                      onChange={handleRowsPerPageChange2}
                      className=" w-fit pl-3 text-sm border-none outline-none bg-white  focus:border-none focus:outline-none"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
                <Box className="text-sm flex  mt-1 pb-5 pt-5">
                  <Pagination
                    count={pageCount2}
                    page={currentPage2}
                    onChange={handleChange2}
                    variant="outlined"
                    shape="rounded"
                    size="small"
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root": {
                        margin: "0 4px",
                      },
                    }}
                  />
                </Box>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Home;
