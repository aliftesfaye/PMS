import { Card, Typography, Box, Grid, Chip, Avatar } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  InputAdornment,
  TextField,
  IconButton,
  LinearProgress,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";

import React, { useCallback, useEffect, useRef, useState } from "react";
import apiService from "../services/apiServices.jsx";
import Addmembertoproject from "./Addmembertoproject.jsx";
import Assign from "./Assign.jsx";

import "./Tasks.css";
import View from "./Viewprofile.jsx";

const MembersDashboard = ({ selectedProjectInfo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [noActivity, setNoActivity] = useState("Loading...");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [memberInfo, setMemberInfo] = useState([]);
  const [projectMembers, setProjectMembers] = useState(
    selectedProjectInfo.project_member
  );

  const modalRef = useRef(null);
  const assignModalRef = useRef(null);
  const viewModalRef = useRef(null);

  const [userInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAssignModal = () => {
    setShowAssignModal(!showAssignModal);
  };

  const toggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };

  const handleClickOutsideModal = (e) => {
    const isModalClicked =
      modalRef.current && modalRef.current.contains(e.target);
    if (!isModalClicked) {
      setShowModal(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const activityData = await apiService.getAllActivities(
        selectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
        return 0;
      });
      setActivities(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const fetchProjectMembers = useCallback(async () => {
    try {
      setLoading(true);
      const allProjectMembers = await apiService.getAllProjectMembers(
        selectedProjectInfo.project_id
      );

      const projectMembersSet = selectedProjectInfo.project_member || [];

      const seenUserIds = new Set();
      const uniqueMembers = [];

      allProjectMembers.forEach((member1) => {
        const isProjectMember = projectMembersSet.some(
          (member2) => member1.user_id === member2.user_id
        );

        if (isProjectMember && !seenUserIds.has(member1.user_id)) {
          seenUserIds.add(member1.user_id);
          uniqueMembers.push(member1);
        }
      });

      const memberPromises = uniqueMembers.map(async (member) => {
        try {
          const projectMemberSubTasks = await apiService.getAllSubTasksByMember(
            member.project_member_id
          );

          return {
            ...member,
            subTasks: projectMemberSubTasks || {
              totalCount: 0,
              completedCount: 0,
              InprgressCount: 0,
              pendingCount: 0,
            },
          };
        } catch (error) {
          console.error(
            `Error fetching subtasks for member ${member.user_id}:`,
            error
          );
          return {
            ...member,
            subTasks: {
              totalCount: 0,
              completedCount: 0,
              InprgressCount: 0,
              pendingCount: 0,
            },
          };
        }
      });

      const membersWithStats = await Promise.all(memberPromises);

      const uniqueCombinedArray = [];
      const finalSeenIds = new Set();

      membersWithStats.forEach((memberWithStats) => {
        const projectMemberDetails = projectMembersSet.find(
          (pm) => pm.user_id === memberWithStats.user_id
        );

        if (
          projectMemberDetails &&
          !finalSeenIds.has(memberWithStats.user_id)
        ) {
          finalSeenIds.add(memberWithStats.user_id);

          const combinedMember = {
            ...projectMemberDetails,
            ...memberWithStats,
            UserRoleToUser:
              projectMemberDetails.UserRoleToUser ||
              memberWithStats.UserRoleToUser,
          };

          uniqueCombinedArray.push(combinedMember);
        }
      });

      setMemberInfo(uniqueCombinedArray);
    } catch (error) {
      console.error("Error fetching project members:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectInfo.project_id, selectedProjectInfo.project_member]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await fetchActivities();
        await fetchProjectMembers();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
  }, [selectedProjectInfo.project_id]);

  const filteredMembers = memberInfo.filter((member) =>
    member.UserRoleToUser?.full_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (count, total) => {
    if (total === 0) return "#9CA3AF";
    const percentage = (count / total) * 100;
    if (percentage > 70) return "#10B981";
    if (percentage > 40) return "#F59E0B";
    return "#EF4444";
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "#8B5CF6";
      case "manager":
        return "#3B82F6";
      case "developer":
        return "#10B981";
      case "designer":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const ProjectBadge = ({ name }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
        borderRadius: "14px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        fontSize: "1.5rem",
        fontWeight: "bold",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {name?.charAt(0).toUpperCase() || "P"}
    </Box>
  );

  const MemberCard = ({ member, index }) => {
    const subTasks = member.subTasks || {};
    const total = subTasks.totalCount || 0;
    const completed = subTasks.completedCount || 0;
    const inProgress = subTasks.InprgressCount || 0;
    const pending = subTasks.pendingCount || 0;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;
    const statusColor = getStatusColor(completed, total);
    const roleColor = getRoleColor(member.UserRoleToUser?.role);

    return (
      <Card
        className="rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white group"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          "&:hover": {
            transform: "translateY(-4px)",
          },
        }}
        key={index}
      >
        {/* Card Header with Gradient */}
        <Box
          className="relative p-6 pb-3"
          sx={{
            background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          }}
        >
          <Box className="flex items-start justify-between mb-4">
            <Avatar
              className="w-16 h-16 border-4 border-white shadow-lg"
              sx={{
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                fontSize: "1.5rem",
                fontWeight: "bold",
              }}
            >
              {member.UserRoleToUser?.full_name?.charAt(0)?.toUpperCase() ||
                "M"}
            </Avatar>
            <IconButton size="small" className="opacity-70 hover:opacity-100">
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Box className="mb-2">
            <Typography
              variant="h6"
              className="font-bold text-gray-900 truncate mb-1"
            >
              {member.UserRoleToUser?.full_name || "Unknown Member"}
            </Typography>
            <Box className="flex items-center gap-2 mb-3">
              <EmailIcon className="w-4 h-4 text-gray-400" />
              <Typography
                variant="body2"
                className="text-gray-600 truncate"
                title={member.UserRoleToUser?.email}
              >
                {member.UserRoleToUser?.email || "No email"}
              </Typography>
            </Box>
          </Box>

          <Chip
            label={member.UserRoleToUser?.role || "Member"}
            size="small"
            className="font-medium"
            sx={{
              backgroundColor: `${roleColor}15`,
              color: roleColor,
              border: `1px solid ${roleColor}30`,
              borderRadius: "8px",
              fontWeight: 600,
            }}
          />
        </Box>

        {/* Card Body */}
        <Box className="px-6 flex-1">
          {/* Progress Bar */}
          <Box className="mb-6">
            <Box className="flex justify-between items-center mb-2">
              <Typography variant="body2" className="font-medium text-gray-700">
                Progress
              </Typography>
              <Typography
                variant="body2"
                className="font-bold"
                sx={{ color: statusColor }}
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
                  backgroundColor: statusColor,
                },
              }}
            />
          </Box>

          {/* Stats Grid */}
          <Typography
            variant="subtitle2"
            className="font-semibold text-gray-700 mb-4 pb-2 uppercase tracking-wide"
          >
            Task Statistics
          </Typography>

          <Grid container spacing={2} className="mb-6">
            <Grid item xs={6}>
              <Box className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-100">
                <Typography
                  variant="h4"
                  className="font-bold text-blue-700 mb-1"
                >
                  {total}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-medium text-blue-600"
                >
                  Total Tasks
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-100">
                <Typography
                  variant="h4"
                  className="font-bold text-green-700 mb-1"
                >
                  {completed}
                </Typography>
                <Typography
                  variant="caption"
                  className="font-medium text-green-600"
                >
                  Completed
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Detailed Stats */}
          <Box className="space-y-3">
            <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <ListAltIcon className="w-4 h-4 text-amber-600" />
                </Box>
                <Typography variant="body2" className="text-gray-700">
                  In Progress
                </Typography>
              </Box>
              <Typography variant="body2" className="font-bold text-gray-900">
                {inProgress}
              </Typography>
            </Box>

            <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center">
                  <HistoryToggleOffIcon className="w-4 h-4 text-gray-600" />
                </Box>
                <Typography variant="body2" className="text-gray-700">
                  Pending
                </Typography>
              </Box>
              <Typography variant="body2" className="font-bold text-gray-900">
                {pending}
              </Typography>
            </Box>

            <Box className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Box className="flex items-center gap-3">
                <Box className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                </Box>
                <Typography variant="body2" className="text-gray-700">
                  Completion Rate
                </Typography>
              </Box>
              <Typography
                variant="body2"
                className="font-bold"
                sx={{ color: statusColor }}
              >
                {total > 0 ? `${completionRate}%` : "0%"}
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box className="mt-6 pt-4 border-t border-gray-200 py-4 flex justify-between items-center">
            <Typography variant="caption" className="text-gray-500">
              ID: {member.user_id?.slice(-6) || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box className="ml-auto lg:w-4/5 w-full px-4 lg:px-8 mt-6">
      <Helmet>
        <title>{selectedProjectInfo.name} - Members</title>
      </Helmet>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>

      {/* Header Section */}
      <Box className="mb-1">
        <Box className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md"
                style={{ backgroundColor: "#082f49" }}
              >
                {selectedProjectInfo.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {selectedProjectInfo.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Project Team Members
                </p>
              </div>
            </div>
          </div>
        </Box>

        {/* Search and Stats Bar */}
        <Box className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <Box className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <Box>
              <Typography variant="h5" className="font-bold text-gray-900 mb-1">
                Team Members
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                {projectMembers.length} members in project
              </Typography>
            </Box>
            <TextField
              type="text"
              placeholder="Search members by name..."
              size="small"
              variant="outlined"
              className="bg-white w-full lg:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                classes: {
                  root: "rounded-xl",
                },
                sx: {
                  borderRadius: "12px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Members Grid */}
      <Box className="mb-12">
        {projectMembers.length > 0 ? (
          <Grid container spacing={3}>
            {filteredMembers.map((member, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                lg={4}
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <MemberCard member={member} index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
            <Box className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <PersonIcon className="w-12 h-12 text-gray-400" />
            </Box>
            <Typography
              variant="h5"
              className="font-semibold text-gray-600 mb-2"
            >
              {noActivity}
            </Typography>
            <Typography
              variant="body2"
              className="text-gray-500 max-w-md mx-auto"
            >
              Add members to start collaborating and track their progress
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modals */}
      {showModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4"
          >
            <Addmembertoproject onCancel={toggleModal} />
          </Box>
        </Box>
      )}

      {showAssignModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4">
            <Assign onCancel={toggleAssignModal} />
          </Box>
        </Box>
      )}

      {showViewModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl mx-4">
            <View />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MembersDashboard;
