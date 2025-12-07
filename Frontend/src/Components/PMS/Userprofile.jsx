import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  LinearProgress,
  Avatar,
  Chip,
  Box,
  Card,
  Grid,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";

const Userprofile = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUsers();
      setProjects(response.Projects);
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
                  if (subtask.subtask_status === "Completed") {
                    return subtaskSum + 1;
                  } else {
                    return subtaskSum;
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
                  if (subtask.subtask_status === "Pending") {
                    return subtaskSum + 1;
                  } else {
                    return subtaskSum;
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
                  if (subtask.subtask_status === "In Progress") {
                    return subtaskSum + 1;
                  } else {
                    return subtaskSum;
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

  const completionRate =
    totalSubtasksLength > 0
      ? Math.round((totalCompletedSubtasksLength / totalSubtasksLength) * 100)
      : 0;

  useEffect(() => {
    fetchData();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    const timeout = setTimeout(() => {
      setLoadingProjects(false);
    }, 1000);

    return () => clearTimeout(timeout);
    fetchUsers();
  }, [userInfo]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#10B981";
      case "in progress":
        return "#F59E0B";
      case "pending":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "#D1FAE5";
      case "in progress":
        return "#FEF3C7";
      case "pending":
        return "#F3F4F6";
      default:
        return "#F3F4F6";
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtext }) => (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
      sx={{
        p: isMobile ? 2 : 3,
        height: '100%'
      }}
    >
      <Box className="flex items-center gap-3">
        <Box
          className={`rounded-lg`}
          sx={{
            p: isMobile ? 1.5 : 2,
            backgroundColor: `${color}15`
          }}
        >
          <Icon
            sx={{
              fontSize: isMobile ? '1rem' : '1.25rem',
              color
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            className="font-bold text-gray-900 truncate"
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            className="text-gray-600 block"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
          >
            {label}
          </Typography>
          {subtext && (
            <Typography
              variant="caption"
              className="block text-gray-500"
              sx={{ fontSize: isMobile ? '0.65rem' : '0.7rem' }}
            >
              {subtext}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  const ProjectCard = ({ project }) => (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
      sx={{ p: isMobile ? 2 : 3 }}
    >
      <Box className="flex items-center gap-3">
        <Avatar
          sx={{
            width: isMobile ? 32 : 40,
            height: isMobile ? 32 : 40,
            bgcolor: "primary.main",
            fontWeight: "bold",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          {project.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            className="font-semibold text-gray-900 truncate"
          >
            {project.name.charAt(0).toUpperCase() +
              project.name.slice(1).toLowerCase()}
          </Typography>
          <Typography
            variant="caption"
            className="text-gray-600"
            sx={{ fontSize: isMobile ? '0.7rem' : '0.75rem' }}
          >
            {project.overall_progress} progress
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  const SubTaskCard = ({ subTask, projectName }) => (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 mb-3"
      sx={{ p: isMobile ? 2 : 3 }}
    >
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Box className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar
            sx={{
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
              bgcolor: "#3B82F6",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
            }}
          >
            {subTask.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={isMobile ? "body2" : "body1"}
              className="font-medium text-gray-900 truncate"
            >
              {subTask.name.charAt(0).toUpperCase() +
                subTask.name.slice(1).toLowerCase()}
            </Typography>
            <Chip
              label={projectName}
              size="small"
              sx={{
                backgroundColor: "#E0F2FE",
                color: "#0369A1",
                fontSize: isMobile ? "0.6rem" : "0.625rem",
                height: "20px",
                mt: 0.5,
                maxWidth: '100%'
              }}
            />
          </Box>
        </Box>
        <Box className="self-start sm:self-center">
          <Chip
            label={subTask.subtask_status}
            size="small"
            sx={{
              backgroundColor: getStatusBgColor(subTask.subtask_status),
              color: getStatusColor(subTask.subtask_status),
              fontWeight: 600,
              fontSize: isMobile ? "0.7rem" : "0.75rem",
              minWidth: isMobile ? 80 : 90,
            }}
          />
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box className="ml-auto lg:w-4/5 w-full px-4 lg:px-8 mt-24">

      <Helmet>
        <title>PMS - Profile</title>
      </Helmet>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>

      {/* Header */}
      <Box className="mb-6 md:mb-8">
        <Typography
          variant={isMobile ? "h5" : "h4"}
          className="font-bold text-gray-900 mb-2"
        >
          User Profile
        </Typography>
        <Typography
          variant={isMobile ? "body2" : "body1"}
          className="text-gray-600"
        >
          Overview of your tasks and projects
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={isMobile ? 2 : 3}>
        {/* Left Column - Profile & Projects */}
        <Grid item xs={12} lg={5}>
          {/* Profile Card */}
          <Card
            className="rounded-2xl shadow-lg border-0 overflow-hidden"
            sx={{ mb: isMobile ? 3 : 4 }}
          >
            {/* Profile Header with Gradient */}
            <Box
              sx={{
                p: isMobile ? 3 : 4,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Box className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Avatar
                  sx={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                    border: '4px solid white',
                    boxShadow: 3,
                    mx: isMobile ? 'auto' : 0,
                    mb: isMobile ? 2 : 0
                  }}
                >
                  <AccountCircleIcon
                    sx={{
                      width: isMobile ? 48 : 64,
                      height: isMobile ? 48 : 64
                    }}
                  />
                </Avatar>
                <Box sx={{ textAlign: isMobile ? 'center' : 'left', flex: 1 }}>
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    className="font-bold text-white mb-1"
                  >
                    {userInfo.foundUser?.full_name || "User Name"}
                  </Typography>
                  <Box className={`flex ${isMobile ? 'justify-center' : ''} gap-2`}>
                    <EmailIcon sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }} className="text-white opacity-90" />
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      className="text-white opacity-90 truncate"
                    >
                      {userInfo.foundUser?.email || "user@example.com"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Profile Stats */}
            <Box sx={{ p: isMobile ? 3 : 4 }}>
              {/* Completion Progress */}
              <Box sx={{ mb: isMobile ? 4 : 5 }}>
                <Box className="flex justify-between items-center mb-2">
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    className="font-medium text-gray-700"
                  >
                    Overall Completion
                  </Typography>
                  <Typography
                    variant={isMobile ? "body2" : "body1"}
                    className="font-bold text-gray-900"
                  >
                    {completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: isMobile ? 6 : 8,
                    borderRadius: 4,
                    backgroundColor: "#E5E7EB",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                      background:
                        "linear-gradient(90deg, #10B981 0%, #3B82F6 100%)",
                    },
                  }}
                />
              </Box>

              {/* Stats Grid */}
              <Grid container spacing={isMobile ? 1.5 : 2}>
                <Grid item xs={6}>
                  <StatCard
                    icon={AssignmentIcon}
                    label="Total Tasks"
                    value={totalSubtasksLength}
                    color="#3B82F6"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={CheckCircleIcon}
                    label="Completed"
                    value={totalCompletedSubtasksLength}
                    color="#10B981"
                    subtext={`${completionRate}% completion`}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={ListAltIcon}
                    label="In Progress"
                    value={totalInProgressSubtasksLength}
                    color="#F59E0B"
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={HistoryToggleOffIcon}
                    label="Pending"
                    value={totalPendingSubtasksLength}
                    color="#6B7280"
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Projects Card */}
          <Card className="rounded-2xl mb-10 shadow-lg border-0">
            <Box sx={{ p: isMobile ? 3 : 4 }}>
              <Box className="flex items-center gap-2 mb-4 md:mb-6">
                <WorkIcon sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }} className="text-gray-700" />
                <Typography
                  variant={isMobile ? "subtitle1" : "h6"}
                  className="font-bold text-gray-900"
                >
                  Projects Worked On
                </Typography>
              </Box>

              {loadingProjects && (
                <LinearProgress color="primary" sx={{ mb: 3 }} />
              )}

              <Box
                sx={{
                  maxHeight: { xs: '200px', sm: '300px', md: '380px' },
                  overflowY: 'auto',
                  pr: 1
                }}
                className="space-y-3"
              >
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))
                ) : (
                  <Box className="text-center py-6 md:py-8">
                    <WorkIcon
                      sx={{
                        fontSize: { xs: '2.5rem', sm: '3rem' },
                        mb: 2
                      }}
                      className="text-gray-300 mx-auto"
                    />
                    <Typography
                      variant="body2"
                      className="text-gray-500"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      No projects found
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Column - Current Tasks */}
        <Grid item xs={12} lg={7}>
          <Card className="rounded-2xl shadow-lg border-0">
            <Box sx={{ p: isMobile ? 3 : 4, height: '100%' }}>
              <Box className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 md:mb-6">
                <Box className="flex items-center gap-2">
                  <TrendingUpIcon sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }} className="text-gray-700" />
                  <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    className="font-bold text-gray-900"
                  >
                    Current Sub Tasks
                  </Typography>
                </Box>
                <Chip
                  label={`${totalSubtasksLength} tasks`}
                  size="small"
                  sx={{
                    backgroundColor: "#E0F2FE",
                    color: "#0369A1",
                    fontWeight: 600,
                    alignSelf: 'flex-start',
                    ml: { sm: 2 },
                    mt: { xs: 1, sm: 0 }
                  }}
                />
              </Box>

              {loadingProjects && (
                <LinearProgress color="primary" sx={{ mb: 3 }} />
              )}

              <Box
                sx={{
                  maxHeight: {
                    xs: 'calc(100vh - 380px)',
                    sm: 'calc(100vh - 420px)',
                    md: 'calc(100vh - 300px)'
                  },
                  overflowY: 'auto',
                  pr: 1
                }}
                className="space-y-4"
              >
                {projectsWithSubtasks.length > 0 ? (
                  projectsWithSubtasks.map((project, index) => (
                    <Box key={index} className="mb-4 md:mb-6">
                      {/* Project Header */}
                      <Box className="flex items-center gap-2 mb-3 md:mb-4">
                        <Avatar
                          sx={{
                            width: isMobile ? 28 : 32,
                            height: isMobile ? 28 : 32,
                            bgcolor: "primary.main",
                            fontSize: isMobile ? "0.75rem" : "0.875rem",
                          }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          variant={isMobile ? "body1" : "subtitle1"}
                          className="font-semibold text-gray-900 truncate"
                        >
                          {project.name.charAt(0).toUpperCase() +
                            project.name.slice(1).toLowerCase()}
                        </Typography>
                      </Box>

                      {/* SubTasks List */}
                      <Box className="space-y-2 md:space-y-3">
                        {project.activity.map((activity) => (
                          <React.Fragment key={activity.activity_id}>
                            {activity.Task.map((task) => (
                              <React.Fragment key={task.task_id}>
                                {task.subTask.map((subTask, subIndex) => (
                                  <SubTaskCard
                                    key={`${task.task_id}-${subIndex}`}
                                    subTask={subTask}
                                    projectName={project.name}
                                  />
                                ))}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Box className="text-center py-8 md:py-12">
                    <AssignmentIcon
                      sx={{
                        fontSize: { xs: '3rem', sm: '4rem' },
                        mb: 3
                      }}
                      className="text-gray-300 mx-auto"
                    />
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      className="text-gray-600 mb-2"
                    >
                      No active sub-tasks
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-500 px-4"
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      You don't have any assigned sub-tasks at the moment
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Userprofile;