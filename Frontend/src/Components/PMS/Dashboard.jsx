import {
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import ClipLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";
import "./Home.css";
//icons
import TaskIcon from "@mui/icons-material/Checklist";
import ActivityIcon from "@mui/icons-material/ListAlt";
import SubTaskIcon from "@mui/icons-material/Splitscreen";
import { Pagination } from "@mui/material";
import Container from "@mui/material/Container";
import "react-dropdown/style.css";

// Table
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";

import TableRow from "@mui/material/TableRow";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";

//Charts
import { PieChart } from "@mui/x-charts/PieChart";

//

import SearchIcon from "@mui/icons-material/Search";

import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController
);
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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const Dashboard = (props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedProject, setSelectedProject] = useState();

  const handleChange = (event, value) => {
    paginate(value);
  };
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [activities, setActivities] = useState([]);
  const [activityLength, setActivityLength] = useState();
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState();
  const [totalSubTasks, setTotalSubTasks] = useState();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [onProgressTasks, setOnProgressTasks] = useState([]);
  const [pendingTask, setPendingTasks] = useState([]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5));
    setPage(0);
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  const data2 = [
    { label: "Total Completed", value: completedTasks.length, color: "green" },
    {
      label: "Total On Progress",
      value: onProgressTasks.length,
      color: "#FFA500",
    },
    {
      label: "Total Pending",
      value: pendingTask.length,
      color: "#808080",
    },
  ];

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let activityData = await apiService.getAllActivities(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      console.log("AD", activityData);
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });
      console.log("SR", sortedResponse);
      const milestoneActivities = sortedResponse.filter(
        (activity) => activity.activity.is_milestone === true
      );
      console.log("MA", milestoneActivities);

      setActivities(milestoneActivities);

      let all_tasks = [];

      for (const activity of sortedResponse) {
        const task = activity.tasks;
        if (task.length === 0) {
          continue;
        }
        all_tasks.push(...task);
      }
      setTasks(all_tasks);
      const completed_task = all_tasks.filter(
        (data) => data.task_status === "Completed"
      );

      setCompletedTasks(completed_task);
      const on_progress_task = all_tasks.filter(
        (data) => data.task_status === "On Progress"
      );

      setOnProgressTasks(on_progress_task);

      const pending_task = all_tasks.filter(
        (data) => data.task_status === "Pending"
      );

      setPendingTasks(pending_task);

      setActivityLength(sortedResponse.length);
      setTotalTasks(
        sortedResponse.reduce((n, { Tasklength }) => n + Tasklength, 0)
      );
      setTotalSubTasks(
        sortedResponse.reduce(
          (n, { sub_tasks_length }) => n + sub_tasks_length,
          0
        )
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

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
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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
  const search = tasks.filter(
    (task) =>
      task.name &&
      task.name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = search.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();
    fetchActivities();
  }, [userInfo]);
  const pageCount = Math.ceil(tasks.length / rowsPerPage);

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  return (
    <div style={{ backgroundColor: "#f1f4f6" }}>
      <Helmet>
        <title>{props.setSelectedProjectInfo.name} - Dashboard</title>
      </Helmet>
      <div className="ml-auto w-4/5 mr-5 mt-24 z-10">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <ClipLoader color="#fff" />
        </Backdrop>
        <Container maxWidth="lg" className="pb-7">
          <Grid container spacing={5} className="my-6" justifyContent="center">
            {/* Total Activities Card */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <ActivityIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Total Activities</Typography>
                    <Typography variant="body2">{activityLength}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Total Tasks Card */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <TaskIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Total Tasks</Typography>
                    <Typography variant="body2">{totalTasks}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Total Sub Tasks Card */}
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <Paper
                elevation={2}
                sx={{ p: 2, bgcolor: "#082f49", color: "white" }}
              >
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <SubTaskIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <Typography variant="h7">Total Sub Tasks</Typography>
                    <Typography variant="body2">{totalSubTasks}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          <div
            style={{ backgroundColor: "#f7f6fe" }}
            class="shadow-3xl  border-x-2 border-y-2"
          >
            <box class="shadow-3xl my-10 rounded-lg border-t-2 ">
              {" "}
              <div style={{ backgroundColor: "#f7f6fe" }}>
                <div className="flex flex-wrap items-center justify-between text-center gap-28">
                  <text class="p-5 text-2xl font-bold text-sky-950">
                    {props.setSelectedProjectInfo.name}
                  </text>

                  <div class=" self-center ">
                    <TextField
                      type="text"
                      placeholder="Search Task"
                      size="small"
                      class="bg-white rounded-lg"
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
              </div>
            </box>

            <box class="shadow-3xl lg:flex rounded-lg ">
              {" "}
              <div class="content-center">
                <div className="flex flex-wrap gap-18">
                  <div className="flex flex-col space-y-10 p-5">
                    <div className="text-center space-y-5">
                      <p className="text-3xl font-medium font-sans">
                        {totalTasks}
                      </p>
                      <p className="text-xl font-medium font-sans">
                        Project Tasks
                      </p>
                    </div>
                    <div className="text-center space-y-5">
                      <p className="text-3xl font-medium font-sans">
                        {completedTasks.length}
                      </p>
                      <p className="text-xl font-medium font-sans">
                        Completed Tasks
                      </p>
                    </div>
                    <div className="text-center space-y-5">
                      <p className="text-3xl font-medium font-sans">
                        {onProgressTasks.length}
                      </p>
                      <p className="text-xl font-medium font-sans">
                        On Progress Tasks
                      </p>
                    </div>
                  </div>{" "}
                </div>
              </div>
              <div class="shadow-3xl rounded-lg mb-4">
                <div
                  style={{
                    backgroundColor: "#fff",
                    border: "0.5px solid #c7c7c7",
                    borderRadius: 15,
                  }}
                >
                  <TableContainer
                    sx={{
                      width: "100%",
                      overflow: "auto",
                    }}
                  >
                    <Table
                      sx={{
                        minWidth: 900,
                        [`& .${tableCellClasses.root}`]: {
                          borderBottom: "none",
                        },
                      }}
                      size="large"
                    >
                      {totalTasks !== 0 ? (
                        <>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell>Task Name</StyledTableCell>
                              <StyledTableCell>Task Due Date</StyledTableCell>
                              <StyledTableCell>Completion</StyledTableCell>
                              <StyledTableCell>Status</StyledTableCell>
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {currentItems.map((task, index) => {
                              const progress = calculateProgress(
                                task.start_date,
                                task.end_date
                              );

                              return (
                                <StyledTableRow
                                  key={task.id}
                                  className={
                                    index % 2 === 0 ? "even-row" : "odd-row"
                                  }
                                >
                                  <StyledTableCell component="th" scope="row">
                                    <span
                                      className="text-center  text-white"
                                      style={{
                                        backgroundColor: getColorByRange(
                                          task.name
                                        ),
                                        borderRadius: "50%",
                                        width: 24,
                                        height: 24,
                                        display: "inline-block",
                                        textAlign: "center",
                                        lineHeight: "24px",
                                        marginRight: 8,
                                      }}
                                    >
                                      {task.name.charAt(0).toUpperCase()}
                                    </span>
                                    {task.name.charAt(0).toUpperCase() +
                                      task.name.slice(1)}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {new Date(
                                      task.end_date
                                    ).toLocaleDateString()}
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    <div className="progress-container">
                                      <div
                                        className="progress-bar"
                                        style={{
                                          width: `${progress}%`,
                                          backgroundColor: getProgressColor(
                                            progress,
                                            task.task_status
                                          ),
                                        }}
                                      />
                                      <span className="progress-text">{`${progress.toFixed(
                                        1
                                      )}%`}</span>
                                    </div>
                                  </StyledTableCell>
                                  <StyledTableCell>
                                    {task.task_status}
                                  </StyledTableCell>
                                </StyledTableRow>
                              );
                            })}
                          </TableBody>
                        </>
                      ) : (
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={4} align="center">
                              <Typography variant="h6">No Task Data</Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
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
          </div>

          <box class="lg:flex lg:flex-wrap lg:gap-5 lg:my-12 lg:rounded-lg ">
            <div className=" max-w-3xl grow border-x-2 border-y-2 rounded-lg bg-white">
              <div className="flex flex-wrap justify-between items-center py-5 gap-10">
                <text class="px-5 text-xl font-bold text-sky-950 font-sans">
                  Milestone
                </text>
              </div>

              <box class="shadow-3xl my-10 rounded-lg">
                {" "}
                <div className="overflow-x-auto max-w-full">
                  {activities.length !== 0 ? (
                    <div className="mt-4 overflow-x-auto min-w-96">
                      <BarChart
                        series={[
                          {
                            data: activities.map((data) => {
                              const progress = function (start_date, end_date) {
                                const currentDate = new Date();
                                const totalDuration =
                                  new Date(end_date) - new Date(start_date);
                                const elapsedDuration =
                                  currentDate - new Date(start_date);
                                const progress = Math.min(
                                  Math.max(
                                    (elapsedDuration / totalDuration) * 100,
                                    0
                                  ),
                                  100
                                );
                                return progress;
                              };

                              const activity = data.activity;

                              const progress_result = progress(
                                activity.start_date,
                                activity.end_date
                              );

                              return parseInt(progress_result);
                            }),
                            stack: "A",
                            // label: "Activities",
                            color: activities.map((data) => {
                              const progress = function (start_date, end_date) {
                                const currentDate = new Date();
                                const totalDuration =
                                  new Date(end_date) - new Date(start_date);
                                const elapsedDuration =
                                  currentDate - new Date(start_date);
                                const progress = Math.min(
                                  Math.max(
                                    (elapsedDuration / totalDuration) * 100,
                                    0
                                  ),
                                  100
                                );
                                return progress;
                              };

                              const activity = data.activity;

                              const progress_result = progress(
                                activity.start_date,
                                activity.end_date
                              );

                              let color_check = "gray";

                              return color_check;
                            }),
                          },
                        ]}
                        // width={600}
                        height={320}
                        xAxis={[
                          {
                            data: activities.map(
                              (data, index) => data.activity.name
                            ),
                            scaleType: "band",
                          },
                        ]}
                        margin={{ top: 50, bottom: 30, left: 40, right: 10 }}
                      />
                    </div>
                  ) : (
                    <Typography className="text-center">
                      No Milestone Data
                    </Typography>
                  )}
                </div>
              </box>
            </div>
            <div className=" shrink grow border-x-2 border-y-2 rounded-lg max-w-lg bg-white">
              <div class="pt-10 pb-4 px-5 text-lg font-bold text-sky-950">
                Project Statistics
              </div>
              <div>
                {tasks.length !== 0 ? (
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
                    bgColor={`green`}
                  />
                ) : (
                  <Typography className="text-center">No Task Data</Typography>
                )}
              </div>
            </div>
          </box>
        </Container>
      </div>
    </div>
  );
};

export default Dashboard;
