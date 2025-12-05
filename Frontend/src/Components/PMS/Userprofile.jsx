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
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";
import apiService from "../services/apiServices";

const Userprofile = (props) => {
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
    <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <Box className="flex items-center gap-3">
        <Box
          className={`p-2 rounded-lg`}
          sx={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" sx={{ color }} />
        </Box>
        <Box>
          <Typography variant="h5" className="font-bold text-gray-900">
            {value}
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            {label}
          </Typography>
          {subtext && (
            <Typography variant="caption" className="block text-gray-500">
              {subtext}
            </Typography>
          )}
        </Box>
      </Box>
    </Card>
  );

  const ProjectCard = ({ project }) => (
    <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
      <Box className="flex items-center gap-3">
        <Avatar
          className="w-10 h-10"
          sx={{
            bgcolor: "primary.main",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {project.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box className="flex-1 min-w-0">
          <Typography
            variant="body1"
            className="font-semibold text-gray-900 truncate"
          >
            {project.name.charAt(0).toUpperCase() +
              project.name.slice(1).toLowerCase()}
          </Typography>
          <Typography variant="caption" className="text-gray-600">
            {project.overall_progress} progress
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  const SubTaskCard = ({ subTask, projectName }) => (
    <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 mb-3">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center gap-3">
          <Avatar
            className="w-8 h-8"
            sx={{
              bgcolor: "#3B82F6",
              fontSize: "0.875rem",
            }}
          >
            {subTask.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" className="font-medium text-gray-900">
              {subTask.name.charAt(0).toUpperCase() +
                subTask.name.slice(1).toLowerCase()}
            </Typography>
            <Chip
              label={projectName}
              size="small"
              className="mt-1"
              sx={{
                backgroundColor: "#E0F2FE",
                color: "#0369A1",
                fontSize: "0.625rem",
                height: "20px",
              }}
            />
          </Box>
        </Box>
        <Chip
          label={subTask.subtask_status}
          size="small"
          sx={{
            backgroundColor: getStatusBgColor(subTask.subtask_status),
            color: getStatusColor(subTask.subtask_status),
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
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
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold text-gray-900 mb-2">
          User Profile
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          Overview of your tasks and projects
        </Typography>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Profile & Projects */}
        <Grid item xs={12} lg={5}>
          {/* Profile Card */}
          <Card className="rounded-2xl shadow-lg border-0 mb-6 overflow-hidden">
            {/* Profile Header with Gradient */}
            <Box
              className="p-6"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              <Box className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AccountCircleIcon className="w-16 h-16" />
                </Avatar>
                <Box>
                  <Typography
                    variant="h5"
                    className="font-bold text-white mb-1"
                  >
                    {userInfo.foundUser?.full_name || "User Name"}
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <EmailIcon className="w-4 h-4 text-white opacity-90" />
                    <Typography
                      variant="body2"
                      className="text-white opacity-90"
                    >
                      {userInfo.foundUser?.email || "user@example.com"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Profile Stats */}
            <Box className="p-6">
              {/* Completion Progress */}
              <Box className="mb-6">
                <Box className="flex justify-between items-center mb-2">
                  <Typography
                    variant="body2"
                    className="font-medium text-gray-700"
                  >
                    Overall Completion
                  </Typography>
                  <Typography
                    variant="body2"
                    className="font-bold text-gray-900"
                  >
                    {completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: 8,
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
              <Grid container spacing={2}>
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
          <Card className="rounded-2xl shadow-lg border-0">
            <Box className="p-6">
              <Box className="flex items-center gap-2 mb-6">
                <WorkIcon className="text-gray-700" />
                <Typography variant="h6" className="font-bold text-gray-900">
                  Projects Worked On
                </Typography>
              </Box>

              {loadingProjects && (
                <LinearProgress color="primary" className="mb-4" />
              )}

              <Box className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))
                ) : (
                  <Box className="text-center py-8">
                    <WorkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <Typography variant="body2" className="text-gray-500">
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
          <Card className="rounded-2xl shadow-lg border-0 h-full">
            <Box className="p-6">
              <Box className="flex items-center gap-2 mb-6">
                <TrendingUpIcon className="text-gray-700" />
                <Typography variant="h6" className="font-bold text-gray-900">
                  Current Sub Tasks
                </Typography>
                <Chip
                  label={`${totalSubtasksLength} tasks`}
                  size="small"
                  sx={{
                    backgroundColor: "#E0F2FE",
                    color: "#0369A1",
                    fontWeight: 600,
                  }}
                />
              </Box>

              {loadingProjects && (
                <LinearProgress color="primary" className="mb-4" />
              )}

              <Box className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {projectsWithSubtasks.length > 0 ? (
                  projectsWithSubtasks.map((project, index) => (
                    <Box key={index} className="mb-6">
                      {/* Project Header */}
                      <Box className="flex items-center gap-2 mb-4">
                        <Avatar
                          className="w-8 h-8"
                          sx={{
                            bgcolor: "primary.main",
                            fontSize: "0.875rem",
                          }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold text-gray-900"
                        >
                          {project.name.charAt(0).toUpperCase() +
                            project.name.slice(1).toLowerCase()}
                        </Typography>
                      </Box>

                      {/* SubTasks List */}
                      <Box className="space-y-2">
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
                  <Box className="text-center py-12">
                    <AssignmentIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <Typography variant="h6" className="text-gray-600 mb-2">
                      No active sub-tasks
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
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
