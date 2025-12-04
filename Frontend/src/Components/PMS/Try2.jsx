import { Card, Typography, Box, Grid, Chip } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { InputAdornment, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";

import React, { useCallback, useEffect, useRef, useState } from "react";
import apiService from "../services/apiServices";
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

      // Use a Set to track unique user_ids and avoid duplicates
      const seenUserIds = new Set();
      const uniqueMembers = [];

      // Filter and deduplicate in one pass
      allProjectMembers.forEach((member1) => {
        // Check if member exists in project and is not a duplicate
        const isProjectMember = projectMembersSet.some(
          (member2) => member1.user_id === member2.user_id
        );

        if (isProjectMember && !seenUserIds.has(member1.user_id)) {
          seenUserIds.add(member1.user_id);
          uniqueMembers.push(member1);
        }
      });

      // Fetch subtask data for all unique members in parallel
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

      // Combine with project member details and remove any potential duplicates
      const uniqueCombinedArray = [];
      const finalSeenIds = new Set();

      membersWithStats.forEach((memberWithStats) => {
        // Find matching project member details
        const projectMemberDetails = projectMembersSet.find(
          (pm) => pm.user_id === memberWithStats.user_id
        );

        if (
          projectMemberDetails &&
          !finalSeenIds.has(memberWithStats.user_id)
        ) {
          finalSeenIds.add(memberWithStats.user_id);

          // Create a clean combined object with priority: memberWithStats > projectMemberDetails
          const combinedMember = {
            // Start with project member details
            ...projectMemberDetails,
            // Override with memberWithStats data (especially subTasks)
            ...memberWithStats,
            // Ensure we preserve the UserRoleToUser from projectMemberDetails
            UserRoleToUser:
              projectMemberDetails.UserRoleToUser ||
              memberWithStats.UserRoleToUser,
          };

          uniqueCombinedArray.push(combinedMember);
        }
      });

      setMemberInfo(uniqueCombinedArray);
      // setNoMembers(
      //   uniqueCombinedArray.length === 0
      //     ? "No team members found"
      //     : `Loaded ${uniqueCombinedArray.length} team members`
      // );
    } catch (error) {
      console.error("Error fetching project members:", error);
      // setNoMembers("Failed to load members");
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
    if (total === 0) return "text-gray-400";
    const percentage = (count / total) * 100;
    if (percentage > 70) return "text-green-600";
    if (percentage > 40) return "text-yellow-600";
    return "text-red-600";
  };

  const ProjectBadge = ({ name }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 48,
        height: 48,
        borderRadius: "12px",
        backgroundColor: "primary.main",
        color: "white",
        fontSize: "1.25rem",
        fontWeight: "bold",
      }}
    >
      {name?.charAt(0).toUpperCase() || "P"}
    </Box>
  );

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <Box className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <Icon style={{ color }} className="w-4 h-4" />
      <Box>
        <Typography variant="caption" className="text-gray-600">
          {label}
        </Typography>
        <Typography variant="body2" className="font-semibold">
          {value}
        </Typography>
      </Box>
    </Box>
  );

  const MemberCard = ({ member, index }) => {
    const subTasks = member.subTasks || {};
    const total = subTasks.totalCount || 0;
    const completed = subTasks.completedCount || 0;
    const inProgress = subTasks.InprgressCount || 0;
    const pending = subTasks.pendingCount || 0;

    return (
      <Card
        className="rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
        key={index}
      >
        <Box className="p-6">
          <Box className="flex items-start gap-4 mb-4">
            <Box className="flex-shrink-0">
              <PersonIcon className="w-12 h-12 text-gray-300" />
            </Box>
            <Box className="flex-1 min-w-0">
              <Typography
                variant="h6"
                className="font-semibold text-gray-900 truncate"
              >
                {member.UserRoleToUser?.full_name || "Unknown Member"}
              </Typography>
              <Box className="flex items-center gap-2 mt-1">
                <EmailIcon className="w-4 h-4 text-gray-400" />
                <Typography
                  variant="body2"
                  className="text-gray-600 truncate"
                  title={member.UserRoleToUser?.email}
                >
                  {member.UserRoleToUser?.email || "No email"}
                </Typography>
              </Box>
              {member.UserRoleToUser?.role && (
                <Chip
                  label={member.UserRoleToUser.role}
                  size="small"
                  className="mt-2"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Box className="mt-6">
            <Typography
              variant="subtitle2"
              className="font-medium text-gray-700 mb-3"
            >
              Task Statistics
            </Typography>

            <Box className="grid grid-cols-2 gap-3 mb-4">
              <Box className="text-center p-3 bg-blue-50 rounded-lg">
                <Typography variant="h5" className="font-bold text-blue-700">
                  {total}
                </Typography>
                <Typography variant="caption" className="text-blue-600">
                  Total Tasks
                </Typography>
              </Box>
              <Box className="text-center p-3 bg-green-50 rounded-lg">
                <Typography variant="h5" className="font-bold text-green-700">
                  {completed}
                </Typography>
                <Typography variant="caption" className="text-green-600">
                  Completed
                </Typography>
              </Box>
            </Box>

            <Box className="space-y-2">
              <StatCard
                icon={ListAltIcon}
                label="In Progress"
                value={inProgress}
                color="#f59e0b"
              />
              <StatCard
                icon={HistoryToggleOffIcon}
                label="Pending"
                value={pending}
                color="#6b7280"
              />
              <StatCard
                icon={CheckCircleIcon}
                label="Completion Rate"
                value={
                  total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%"
                }
                color={getStatusColor(completed, total)}
              />
            </Box>
          </Box>

          <Box className="mt-6 pt-4 border-t border-gray-200">
            <Typography variant="caption" className="text-gray-500">
              Member ID: {member.user_id || "N/A"}
            </Typography>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box className="ml-auto lg:w-4/5 w-full px-4 lg:px-8 mt-24">
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
      <Box className="mb-8">
        <Box className="flex flex-col lg:flex-row lg:items-center gap-6 mb-6">
          <ProjectBadge name={selectedProjectInfo.name} />
          <Box>
            <Typography
              variant="h4"
              className="font-bold text-gray-900"
              gutterBottom
            >
              {selectedProjectInfo.name}
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              Project Members Management
            </Typography>
          </Box>
        </Box>

        <Box className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <Typography variant="h5" className="font-semibold text-gray-800">
            Team Members ({projectMembers.length})
          </Typography>
          <TextField
            type="text"
            placeholder="Search members by name..."
            size="small"
            variant="outlined"
            className="bg-white w-full lg:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              classes: {
                root: "rounded-lg",
              },
            }}
          />
        </Box>
      </Box>

      {/* Members Grid */}
      <Box className="mb-12">
        {projectMembers.length > 0 ? (
          <Grid container spacing={3}>
            {filteredMembers.map((member, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <MemberCard member={member} index={index} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="text-center py-12">
            <PersonIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <Typography variant="h6" className="text-gray-600 mb-2">
              {noActivity}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Add members to get started with project collaboration
            </Typography>
          </Box>
        )}
      </Box>

      {/* Modals */}
      {showModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4"
          >
            <Addmembertoproject onCancel={toggleModal} />
          </Box>
        </Box>
      )}

      {showAssignModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4">
            <Assign onCancel={toggleAssignModal} />
          </Box>
        </Box>
      )}

      {showViewModal && (
        <Box className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Box className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mx-4">
            <View />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MembersDashboard;
