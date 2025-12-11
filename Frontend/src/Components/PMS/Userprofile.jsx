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
  alpha,
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
                  if (subtask.subtask_status === "On Progress") {
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
      elevation={0}
      className="rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border border-gray-100/80 backdrop-blur-sm"
      sx={{
        p: isMobile ? 2.5 : 3.5,
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.paper,
          0.8
        )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color} 0%, ${alpha(
            color,
            0.5
          )} 100%)`,
        },
      }}
    >
      <Box className="flex items-center gap-4">
        <Box
          className="rounded-xl transition-transform duration-300 hover:scale-110"
          sx={{
            p: isMobile ? 2 : 2.5,
            backgroundColor: `${color}10`,
            border: `1px solid ${color}20`,
          }}
        >
          <Icon
            sx={{
              fontSize: isMobile ? "1.25rem" : "1.5rem",
              color: color,
            }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            className="font-bold text-gray-900 truncate"
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.text.primary} 0%, ${theme.palette.text.secondary} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-600 font-medium"
            sx={{
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
          {subtext && (
            <Typography
              variant="caption"
              className="font-medium"
              sx={{
                fontSize: isMobile ? "0.7rem" : "0.75rem",
                color: color,
                display: "inline-block",
                mt: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: "12px",
                backgroundColor: `${color}15`,
              }}
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
      elevation={0}
      className="rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/30 group"
      sx={{
        p: isMobile ? 2.5 : 3,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.paper,
          0.9
        )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
      }}
    >
      <Box className="flex items-center gap-4">
        <Avatar
          sx={{
            width: isMobile ? 40 : 48,
            height: isMobile ? 40 : 48,
            bgcolor: "primary.main",
            fontWeight: "bold",
            fontSize: isMobile ? "1rem" : "1.25rem",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "scale(1.1)",
            },
          }}
        >
          {project.name.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors"
          >
            {project.name.charAt(0).toUpperCase() +
              project.name.slice(1).toLowerCase()}
          </Typography>
          <Box className="flex items-center gap-2 mt-1">
            <Box sx={{ flex: 1 }}>
              <LinearProgress
                variant="determinate"
                value={parseInt(project.overall_progress) || 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 3,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  },
                }}
              />
            </Box>
            <Typography
              variant="caption"
              className="font-semibold text-gray-600"
              sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
            >
              {project.overall_progress || 0}%
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );

  const SubTaskCard = ({ subTask, projectName }) => (
    <Card
      elevation={0}
      className="rounded-xl transition-all duration-300 hover:shadow-lg hover:border-primary/20 group"
      sx={{
        p: isMobile ? 2.5 : 3,
        mb: 2.5,
        border: "1px solid",
        borderColor: "divider",
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.background.paper,
          0.9
        )} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Box className="flex items-start gap-4 flex-1 min-w-0">
          <Box
            sx={{
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "12px",
                border: `2px solid ${getStatusColor(subTask.subtask_status)}20`,
                animation: "pulse 2s infinite",
              },
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                bgcolor: `${getStatusColor(subTask.subtask_status)}20`,
                color: getStatusColor(subTask.subtask_status),
                fontSize: isMobile ? "0.875rem" : "1rem",
                fontWeight: 600,
                border: `2px solid ${getStatusColor(subTask.subtask_status)}40`,
              }}
            >
              {subTask.name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant={isMobile ? "subtitle2" : "subtitle1"}
              className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors"
            >
              {subTask.name.charAt(0).toUpperCase() +
                subTask.name.slice(1).toLowerCase()}
            </Typography>
            <Box className="flex flex-wrap gap-2 mt-2">
              <Chip
                label={projectName}
                size="small"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontSize: isMobile ? "0.625rem" : "0.6875rem",
                  fontWeight: 600,
                  height: "22px",
                }}
              />
              <Chip
                icon={<span className="w-2 h-2 rounded-full bg-current" />}
                label={subTask.subtask_status}
                size="small"
                sx={{
                  backgroundColor: getStatusBgColor(subTask.subtask_status),
                  color: getStatusColor(subTask.subtask_status),
                  fontWeight: 700,
                  fontSize: isMobile ? "0.625rem" : "0.6875rem",
                  height: "22px",
                  "& .MuiChip-icon": {
                    fontSize: 8,
                    ml: 1,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box className="self-start sm:self-center">
          <Box
            sx={{
              width: isMobile ? 12 : 16,
              height: isMobile ? 12 : 16,
              borderRadius: "50%",
              backgroundColor: getStatusColor(subTask.subtask_status),
              animation: "pulse 2s infinite",
            }}
          />
        </Box>
      </Box>
    </Card>
  );

  return (
    <Box
      className="w-full px-4 lg:px-8 py-6"
      sx={{
        background: `linear-gradient(135deg, ${
          theme.palette.background.default
        } 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
        minHeight: "100vh",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <Helmet>
        <title>PMS - Profile Dashboard</title>
      </Helmet>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: alpha(theme.palette.background.default, 0.9),
          backdropFilter: "blur(10px)",
        }}
        open={loading}
      >
        <Box sx={{ textAlign: "center" }}>
          <PuffLoader
            color={theme.palette.primary.main}
            size={60}
            cssOverride={{
              animation: "float 2s ease-in-out infinite",
            }}
          />
          <Typography variant="h6" className="text-white mt-4">
            Loading Profile...
          </Typography>
        </Box>
      </Backdrop>

      {/* Header */}
      <Box className="mb-8 md:mb-12">
        <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Box>
            <Typography
              variant={isMobile ? "h4" : "h4"}
              className="font-bold"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Profile Dashboard
            </Typography>
            <Typography
              variant={isMobile ? "body2" : "body1"}
              className="text-gray-600"
              sx={{ maxWidth: 600 }}
            >
              Comprehensive overview of your performance metrics, active
              projects, and task progression across all assignments
            </Typography>
          </Box>
          <Chip
            icon={<CheckCircleIcon />}
            label={`${completionRate}% Overall Completion`}
            sx={{
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 600,
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              px: 2,
              py: 1,
              borderRadius: "20px",
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={isMobile ? 3 : 4}>
        {/* Left Column - Profile & Projects */}
        <Grid item xs={12} lg={5}>
          {/* Profile Card */}
          <Card
            elevation={0}
            className="rounded-3xl overflow-hidden mb-6"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Profile Header with Animated Gradient */}
            <Box
              sx={{
                p: isMobile ? 4 : 5,
                position: "relative",
                overflow: "hidden",
                background: `linear-gradient(135deg, 
                  ${theme.palette.primary.dark} 0%, 
                  ${theme.palette.secondary.dark} 50%, 
                  ${theme.palette.primary.main} 100%)`,
                backgroundSize: "400% 400%",
                animation: "gradient 15s ease infinite",
              }}
            >
              <style>{`
                @keyframes gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
              `}</style>

              {/* Animated Background Elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: alpha("#fff", 0.1),
                  animation: "float 6s ease-in-out infinite",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  background: alpha("#fff", 0.05),
                  animation: "float 8s ease-in-out infinite",
                }}
              />

              <Box className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
                <Box
                  sx={{
                    position: "relative",
                    mx: isMobile ? "auto" : 0,
                    mb: isMobile ? 3 : 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: isMobile ? 100 : 120,
                      height: isMobile ? 100 : 120,
                      border: "4px solid white",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                      animation: "float 3s ease-in-out infinite",
                    }}
                  >
                    <AccountCircleIcon
                      sx={{
                        width: "80%",
                        height: "80%",
                      }}
                    />
                  </Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.success.main,
                      border: "2px solid white",
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: isMobile ? "center" : "left", flex: 1 }}>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    className="font-bold text-white mb-2"
                    sx={{
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                    }}
                  >
                    {userInfo.foundUser?.full_name || "User Name"}
                  </Typography>
                  <Box className="flex items-center justify-center sm:justify-start gap-3">
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: "12px",
                        backgroundColor: alpha("#fff", 0.2),
                        backdropFilter: "blur(10px)",
                      }}
                    >
                      <EmailIcon className="text-white" />
                    </Box>
                    <Typography
                      variant={isMobile ? "body2" : "body1"}
                      className="text-white/90"
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {userInfo.foundUser?.email || "user@example.com"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Profile Stats */}
            <Box sx={{ p: isMobile ? 4 : 5 }}>
              {/* Completion Progress */}
              <Box sx={{ mb: isMobile ? 4 : 5 }}>
                <Box className="flex justify-between items-center mb-3">
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    className="font-bold text-gray-800"
                  >
                    Performance Metrics
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    className="font-bold"
                    sx={{
                      color: theme.palette.primary.main,
                    }}
                  >
                    {completionRate}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 5,
                      background: `linear-gradient(90deg, 
                        ${theme.palette.success.main} 0%, 
                        ${theme.palette.primary.main} 50%, 
                        ${theme.palette.secondary.main} 100%)`,
                    },
                  }}
                />
                <Box className="flex justify-between mt-2">
                  {["0%", "25%", "50%", "75%", "100%"].map((point) => (
                    <Typography
                      key={point}
                      variant="caption"
                      className="text-gray-500"
                    >
                      {point}
                    </Typography>
                  ))}
                </Box>
              </Box>

              {/* Stats Grid */}
              <Grid container spacing={isMobile ? 2 : 3}>
                <Grid item xs={6}>
                  <StatCard
                    icon={AssignmentIcon}
                    label="Total Tasks"
                    value={totalSubtasksLength}
                    color={theme.palette.primary.main}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={CheckCircleIcon}
                    label="Completed"
                    value={totalCompletedSubtasksLength}
                    color={theme.palette.success.main}
                    subtext={`${completionRate}% completion`}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={ListAltIcon}
                    label="On Progress"
                    value={totalInProgressSubtasksLength}
                    color={theme.palette.warning.main}
                  />
                </Grid>
                <Grid item xs={6}>
                  <StatCard
                    icon={HistoryToggleOffIcon}
                    label="Pending"
                    value={totalPendingSubtasksLength}
                    color={theme.palette.grey[600]}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* Projects Card */}
          <Card
            elevation={0}
            className="rounded-3xl"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: "blur(20px)",
            }}
          >
            <Box sx={{ p: isMobile ? 4 : 5 }}>
              <Box className="flex items-center justify-between mb-6">
                <Box className="flex items-center gap-3">
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    }}
                  >
                    <WorkIcon
                      sx={{ fontSize: "1.5rem" }}
                      className="text-primary"
                    />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      className="font-bold text-gray-900"
                    >
                      Active Projects
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-600"
                      sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
                    >
                      {projects.length} projects assigned
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  label={`${projects.length} total`}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                />
              </Box>

              {loadingProjects && (
                <LinearProgress
                  color="primary"
                  sx={{
                    mb: 3,
                    height: 4,
                    borderRadius: 2,
                  }}
                />
              )}

              <Box
                sx={{
                  maxHeight: { xs: 300, sm: 400, md: 450 },
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha(theme.palette.grey[300], 0.3),
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(theme.palette.primary.main, 0.5),
                    borderRadius: 3,
                    "&:hover": {
                      background: alpha(theme.palette.primary.main, 0.8),
                    },
                  },
                }}
                className="space-y-3"
              >
                {projects && projects.length > 0 ? (
                  projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                  ))
                ) : (
                  <Box
                    className="text-center py-8"
                    sx={{
                      background: alpha(theme.palette.background.default, 0.5),
                      borderRadius: "16px",
                      border: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    <WorkIcon
                      sx={{
                        fontSize: "3.5rem",
                        mb: 2,
                        color: theme.palette.grey[400],
                      }}
                      className="mx-auto"
                    />
                    <Typography
                      variant="h6"
                      className="text-gray-500 mb-2"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      No projects assigned
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-gray-400"
                      sx={{ fontSize: { xs: "0.875rem", sm: "0.9375rem" } }}
                    >
                      You will see assigned projects here
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Right Column - Current Tasks */}
        <Grid item xs={12} lg={7}>
          <Card
            elevation={0}
            className="rounded-3xl h-full"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.background.paper,
                0.95
              )} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: "blur(20px)",
              height: "100%",
            }}
          >
            <Box sx={{ p: isMobile ? 4 : 5, height: "100%" }}>
              <Box className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <Box className="flex items-center gap-3">
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
                      boxShadow: `0 4px 20px ${alpha(
                        theme.palette.info.main,
                        0.3
                      )}`,
                    }}
                  >
                    <TrendingUpIcon className="text-white" />
                  </Box>
                  <Box>
                    <Typography
                      variant={isMobile ? "h6" : "h5"}
                      className="font-bold text-gray-900"
                    >
                      Active Sub Tasks
                    </Typography>
                    <Typography
                      variant="caption"
                      className="text-gray-600"
                      sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
                    >
                      Real-time task tracking and progress monitoring
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex items-center gap-2">
                  <Chip
                    label={`${totalSubtasksLength} total`}
                    size="medium"
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      fontWeight: 600,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    }}
                  />
                  <Chip
                    label={`${completionRate}% done`}
                    size="medium"
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 600,
                      fontSize: isMobile ? "0.75rem" : "0.875rem",
                    }}
                  />
                </Box>
              </Box>

              {loadingProjects && (
                <LinearProgress
                  color="info"
                  sx={{
                    mb: 3,
                    height: 4,
                    borderRadius: 2,
                  }}
                />
              )}

              <Box
                sx={{
                  maxHeight: {
                    xs: "calc(100vh - 400px)",
                    sm: "calc(100vh - 450px)",
                    md: "calc(100vh - 350px)",
                  },
                  overflowY: "auto",
                  pr: 1,
                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha(theme.palette.grey[300], 0.3),
                    borderRadius: 3,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(theme.palette.info.main, 0.5),
                    borderRadius: 3,
                    "&:hover": {
                      background: alpha(theme.palette.info.main, 0.8),
                    },
                  },
                }}
                className="space-y-6"
              >
                {projectsWithSubtasks.length > 0 ? (
                  projectsWithSubtasks.map((project, index) => (
                    <Box key={index} className="mb-6">
                      {/* Project Header */}
                      <Box
                        className="flex items-center gap-3 mb-4 p-3 rounded-xl"
                        sx={{
                          background: alpha(theme.palette.primary.main, 0.05),
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: isMobile ? 36 : 44,
                            height: isMobile ? 36 : 44,
                            bgcolor: theme.palette.primary.main,
                            fontSize: isMobile ? "0.875rem" : "1rem",
                            fontWeight: 600,
                            boxShadow: `0 4px 12px ${alpha(
                              theme.palette.primary.main,
                              0.3
                            )}`,
                          }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant={isMobile ? "subtitle1" : "h6"}
                            className="font-bold text-gray-900"
                          >
                            {project.name.charAt(0).toUpperCase() +
                              project.name.slice(1).toLowerCase()}
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-gray-600"
                            sx={{ fontSize: isMobile ? "0.7rem" : "0.75rem" }}
                          >
                            {project.activity.length} activities •{" "}
                            {project.activity.reduce(
                              (acc, act) => acc + act.Task.length,
                              0
                            )}{" "}
                            main tasks
                          </Typography>
                        </Box>
                        <Chip
                          label={`${project.overall_progress}%`}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.1
                            ),
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      {/* SubTasks List */}
                      <Box className="space-y-3">
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
                  <Box
                    className="text-center py-12"
                    sx={{
                      background: alpha(theme.palette.background.default, 0.5),
                      borderRadius: "20px",
                      border: `1px dashed ${theme.palette.divider}`,
                    }}
                  >
                    <AssignmentIcon
                      sx={{
                        fontSize: "4rem",
                        mb: 3,
                        color: theme.palette.grey[400],
                      }}
                      className="mx-auto"
                    />
                    <Typography
                      variant="h5"
                      className="text-gray-600 mb-3"
                      sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                    >
                      No Active Sub-tasks
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-gray-500 px-4"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      All caught up! New sub-tasks will appear here when
                      assigned.
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
