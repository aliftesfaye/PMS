import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Tooltip,
  Typography,
  Badge,
  IconButton,
  InputAdornment,
  TextField,
  Backdrop,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet-async";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import Swal from "sweetalert2";
import PuffLoader from "react-spinners/ClipLoader";

// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCommentIcon from "@mui/icons-material/MapsUgcOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { FaEdit, FaTrash } from "react-icons/fa";

// Config & Services
import { PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";

// Components
import Subtaskcomment from "./Subtaskcomment.jsx";
import WorkspaceAddMajorTask from "./WorkspaceAddMajorTask.jsx";
import WorkspaceAddSubTask from "./WorkspaceAddSubTask.jsx";
import WorkspaceAssignMember from "./WorkspaceAssignMember.jsx";
import WorkspaceEditMajorTask from "./WorkspaceEditMajorTask.jsx";
import WorkspaceEditSubtask from "./WorkspaceEditSubtask.jsx";
import WorkspaceSubtasktrash from "./WorkspaceSubtasktrash.jsx";
import WorkspaceTaskTrash from "./WorkspaceTaskTrash.jsx";
import Subtaskcommentview from "./Subtaskcommentview.jsx";

const useStyles = makeStyles({
  "@global": {
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label":
    {
      backgroundColor: "white",
    },
    ".MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label:hover, .MuiTreeItem-root.Mui-selected:focus > .MuiTreeItem-content .MuiTreeItem-label":
    {
      backgroundColor: "blue",
    },
  },
});

const Workspace = (props) => {
  const [formData, setFormData] = useState({
    subtask_status: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditMajorTaskModal, setShowEditMajorTaskModal] = useState(false);
  const [showAddSubTaskModal, setShowAddSubTaskModal] = useState(false);
  const [showMajorTaskTrashModal, setShowMajorTaskTrashModal] = useState(false);
  const [showSubtasktrashModal, setShowSubtasktrashModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedItems, setExpandedItems] = useState([]);
  const [showOptions, setShowOptions] = useState({});
  const [showSubtaskOptions, setShowSubtaskOptions] = useState({});
  const [showSubsubtaskOptions, setShowSubsubtaskOptions] = useState({});
  const [commentSubModalOpen, setCommentSubModalOpen] = useState(false);
  const [viewCommentSubModalOpen, setViewCommentSubModalOpen] = useState(false);

  const [commentOnSubtask, setCommentOnSubtask] = useState(0);
  const [viewCommentOnSubtask, setViewCommentOnSubtask] = useState(0);

  const [selectedSubTaskId, setSelectedSubTaskId] = useState("");
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedSubtaskIndex, setSelectedSubtaskIndex] = useState(null);
  const [selectedSubsubtaskIndex, setSelectedSubsubtaskIndex] = useState(null);

  const [expandedActivities, setExpandedActivities] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [createTask, setCreateTask] = useState(0);
  const [updateTask, setUpdateTask] = useState(0);
  const [deleteTask, setDeleteTask] = useState(0);
  const [createSubTask, setCreateSubTask] = useState(0);
  const [updateSubTask, setUpdateSubTask] = useState(0);
  const [deleteSubTask, setDeleteSubTask] = useState(0);

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
  const [noActivity, setNoActivity] = useState();
  const [selectedActivity, setSelectedActivity] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [selectedSubTask, setSelectedSubTask] = useState({});

  const modalRef = useRef(null);

  const handleToggle = (itemId) => {
    setExpandedItems((prevExpanded) => {
      if (prevExpanded.includes(itemId)) {
        return prevExpanded.filter((item) => item !== itemId);
      } else {
        return [...prevExpanded, itemId];
      }
    });
  };

  const toggleModal = () => setShowModal(!showModal);
  const toggleEditMajorTaskModal = (index) => {
    setSelectedTaskIndex(index);
    setShowEditMajorTaskModal(!showEditMajorTaskModal);
  };

  const toggleAddTaskModal = () => setShowAddTaskModal(!showAddTaskModal);
  const toggleAddSubTaskModal = () =>
    setShowAddSubTaskModal(!showAddSubTaskModal);
  const toggleMajorTaskTrashModal = (index) => {
    setSelectedTaskIndex(index);
    setShowMajorTaskTrashModal(!showMajorTaskTrashModal);
  };
  const statusOptions = [
    { value: "Pending", label: "Pending", color: "" },
    { value: "On Progress", label: "On Progress", color: "orange" },
    { value: "Completed", label: "Completed", color: "green" },
  ];

  const toggleSubtasktrashModal = (index) => {
    setSelectedTaskIndex(index);
    setShowSubtasktrashModal(!showSubtasktrashModal);
  };
  const toggleEditSubtaskModal = () => {
    setShowEditSubtaskModal(!showEditSubtaskModal);
  };
  const toggleSubtask = (activityIndex, taskIndex, subtaskIndex) => {
    const subtaskKey = `${activityIndex}-${taskIndex}-${subtaskIndex}`;
    setExpandedSubtasks((prevState) => {
      if (prevState.includes(subtaskKey)) {
        return prevState.filter((item) => item !== subtaskKey);
      } else {
        return [...prevState, subtaskKey];
      }
    });
  };
  const handleChange = (subtaskItem) => (event) => {
    handleStatusChange(event.target.value, subtaskItem.sub_task_id);
  };
  const handlefetchTask = async () => {
    try {
      const taskData = await apiService.getAllTasks(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = taskData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setTasks(sortedResponse);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const handlefetchSubTask = async () => {
    try {
      const taskData = await apiService.getAllSubTasks(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = taskData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setSubTasks(sortedResponse);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  const handleAddTaskModalClose = () => {
    setShowAddTaskModal(false);
  };

  const handleStatusChange = async (selectedStatus, sub_task_id) => {
    formData.subtask_status = selectedStatus;
    try {
      const response = await apiService.updateSubTaskStatus(
        formData,
        sub_task_id
      );

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Sub Task Updated Successfully",
        }).then(() => {
          fetchActivities();
        });
      } else {
        console.error("failed : ", response);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Sub Task Status Update Failed",
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Sub Task Status Update failed:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sub Task Status Update Failed",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };
  const handleEditTaskModalClose = () => {
    setShowEditMajorTaskModal(false);
  };
  const handleEditSubTaskModalClose = () => {
    setShowEditSubtaskModal(false);
  };

  const handleAddSubModalClose = () => {
    setShowAddSubTaskModal(false);
  };
  const handleCommentModalClose = () => {
    setCommentSubModalOpen(false);
  };
  const handleViewCommentModalClose = () => {
    setViewCommentSubModalOpen(false);
  };

  const toggleAddSubSubTaskModal = () => { };

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
      setShowEditMajorTaskModal(false);
      setShowAddTaskModal(false);
      setShowAddSubTaskModal(false);
      setShowMajorTaskTrashModal(false);
      setShowSubtasktrashModal(false);
      setShowEditSubtaskModal(false);
      setShowOptions({});
      setShowSubtaskOptions({});
      setSelectedTaskIndex(null);
      setSelectedSubtaskIndex(null);
    }
  };

  const toggleOptions = (
    activityIndex,
    taskIndex,
    subtaskIndex,
    subsubtaskIndex
  ) => {
    setSelectedTaskIndex(taskIndex);
    setShowOptions((prevOptions) => ({
      ...prevOptions,
      [`${activityIndex}-${taskIndex}`]:
        !prevOptions[`${activityIndex}-${taskIndex}`],
    }));
  };

  const toggleSubtaskOptions = (activityIndex, taskIndex, subtaskIndex) => {
    setSelectedSubtaskIndex(subtaskIndex);
    setShowSubtaskOptions((prevOptions) => ({
      ...prevOptions,
      [`${activityIndex}-${taskIndex}-${subtaskIndex}`]:
        !prevOptions[`${activityIndex}-${taskIndex}-${subtaskIndex}`],
    }));
  };

  const toggleActivity = async (index) => {
    if (expandedActivities.includes(index)) {
      setExpandedActivities(
        expandedActivities.filter((item) => item !== index)
      );
    } else {
      setExpandedActivities([...expandedActivities, index]);
    }
  };
  const toggleTask = (activityIndex, taskIndex) => {
    const taskKey = `${activityIndex}-${taskIndex}`;
    if (expandedTasks.includes(taskKey)) {
      setExpandedTasks(expandedTasks.filter((item) => item !== taskKey));
    } else {
      setExpandedTasks([...expandedTasks, taskKey]);
    }
  };
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Fetch activities based on the checkbox value
    fetchActivitiesWithMilestone(value);
  };
  const fetchActivitiesWithMilestone = async (isMilestone) => {
    try {
      setLoading(true);
      let activityData = await apiService.getAllActivities(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });

      // Filter activities based on the isMilestone parameter
      const filteredActivities = sortedResponse.filter(
        (activity) => activity.activity.is_milestone === isMilestone
      );

      setActivities(filteredActivities);

      filteredActivities.length === 0
        ? setNoActivity("No Activity Found")
        : setNoActivity("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };
  const fetchAllActivities = async () => {
    try {
      setLoading(true);
      let activityData = await apiService.getAllActivities(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });
      setActivities(sortedResponse);
      activities.length === 0
        ? setNoActivity("No Activity Found")
        : setNoActivity("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const activityData = await apiService.getAllActivities(
        props.setSelectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });
      setActivities(sortedResponse);
      activities.length === 0
        ? setNoActivity("No Activity Found")
        : setNoActivity("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };

  const handlefetchSubTasks = async (task_id) => {
    try {
      const subTaskData = await apiService.getAllSubTasks(task_id);
      const sortedResponse = subTaskData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setSubTasks(sortedResponse);
    } catch (error) {
      console.error("Error fetching sub tasks:", error);
    }
  };
  const filteredRows =
    statusFilter === "All"
      ? activities
      : activities.filter(
        (row) => row.activity.activity_status === statusFilter
      );

  const search = filteredRows.filter(
    (row) =>
      row.activity.name &&
      row.activity.name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );

  const indexOfLastActivity = currentPage;
  const indexOfFirstActivity = indexOfLastActivity;

  const currentActivities = search.slice(currentPage);

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage();
  };
  const handleCommentOnSubtaskClick = (activity) => {
    setSelectedSubTaskId(activity.sub_task_id);
    setCommentSubModalOpen(true);
  };
  const handleViewCommentOnSubtaskClick = (activity) => {
    setSelectedSubTaskId(activity.sub_task_id);
    setViewCommentSubModalOpen(true);
  };
  useEffect(() => {
    fetchActivities();
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
    fetchProjectPermissions();
    fetchPermissions();

    const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
      (role) => !role.project_related
    ).map((role) => role.name);

    const isDepartmentAdminRolePresent =
      nonProjectRelatedRoles.includes("Department Admin");

    const isClusterAdminRolePresent =
      nonProjectRelatedRoles.includes("Cluster Admin");
    const isOrganizationAdminRolePresent =
      nonProjectRelatedRoles.includes("Organization Admin");

    let selectedPermission;
    if (
      isClusterAdminRolePresent ||
      isDepartmentAdminRolePresent ||
      isOrganizationAdminRolePresent
    ) {
      selectedPermission = permissions;
    } else {
      selectedPermission = projectPermissions;
    }
    const COMMENT_ON_SUBTASK = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.COMMENT_ON_SUBTASK
    );
    const VIEW_COMMENT_ON_SUBTASK = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.VIEW_COMMENT_ON_SUBTASK
    );
    const CREATE_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_TASK
    );
    const UPDATE_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_TASK
    );
    const DELETE_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_TASK
    );

    const CREATE_SUB_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_SUB_TASK
    );
    const UPDATE_SUB_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_SUB_TASK
    );
    const DELETE_SUB_TASK = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_SUB_TASK
    );
    setCommentOnSubtask(COMMENT_ON_SUBTASK.length);
    setViewCommentOnSubtask(VIEW_COMMENT_ON_SUBTASK.length);

    setCreateTask(CREATE_TASK.length);
    setUpdateTask(UPDATE_TASK.length);
    setDeleteTask(DELETE_TASK.length);
    setCreateSubTask(CREATE_SUB_TASK.length);
    setUpdateSubTask(UPDATE_SUB_TASK.length);
    setDeleteSubTask(DELETE_SUB_TASK.length);
  }, [userInfo]);

  const handleSubtaskAssigneeClick = () => {
    setShowModal(true);
  };

  const classes = useStyles();

  return (
    <div className=" w-4/5 border-x-4 border-y-4 pb-6 mb-16 ml-auto mt-24 mr-6 overflow-x-auto no-scrollbar">
      <Helmet>
        <title>{props.setSelectedProjectInfo.name} - Workspace</title>
      </Helmet>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>

      {/* Header */}
      <div className="bg-gradient-to-r  text-blue-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl border-gray-600 border flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              {props.setSelectedProjectInfo.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {props.setSelectedProjectInfo.name}
              </h1>
              <p className="text-blue-400 opacity-90">Project Workspace</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 md:px-6 overflow-x-auto">
        <div className="flex space-x-1 min-w-max">
          {["All", "Completed", "On Progress", "Pending"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterClick(status)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap ${statusFilter === status
                ? "text-blue-700 border-b-2 border-blue-700 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <TextField
            type="text"
            placeholder="Search activities..."
            size="small"
            className="bg-white rounded-lg w-full md:w-auto md:min-w-[300px]"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              className: "rounded-lg",
            }}
          />

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                id="is_milestone"
                name="is_milestone"
                checked={formData.is_milestone}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                Show Milestones Only
              </span>
            </label>

            <button
              onClick={fetchAllActivities}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Show All Activities
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6">
        {activities.length !== 0 ? (
          <Box
            sx={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "24px",
              backgroundColor: "white",
            }}
            className="overflow-x-auto"
          >
            <SimpleTreeView>
              {currentActivities.map((activityItem, activityIndex) => (
                <TreeItem
                  key={`activity-${activityIndex}`}
                  itemId={`activity-${activityIndex}`}
                  label={
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">
                          {activityItem.activity.name}
                        </span>
                        {activityItem.activity.is_milestone === true && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            <FlagIcon fontSize="small" />
                            Milestone
                          </span>
                        )}
                      </div>

                      {createTask !== 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAddTaskModal();
                            setSelectedActivity(activityItem);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors duration-200"
                        >
                          <AddCircleOutlineIcon style={{ fontSize: 18 }} />
                          Add Task
                        </button>
                      )}
                    </div>
                  }
                >
                  {activityItem.tasks.map((taskItem, taskIndex) => (
                    <React.Fragment key={`task-${activityIndex}-${taskIndex}`}>
                      <TreeItem
                        itemId={`task-${activityIndex}-${taskIndex}`}
                        label={
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 px-4 items-center text-sm border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ml-4 md:ml-8">
                            <div className="lg:col-span-4 flex items-start gap-3">
                              <TaskAltIcon
                                className="text-blue-600 mt-0.5 flex-shrink-0"
                                style={{ fontSize: 18 }}
                              />
                              <div>
                                <div className="font-medium text-gray-900 mb-1">
                                  {taskItem.name}
                                </div>
                                {taskItem.is_milestone === true && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded">
                                    <FlagIcon style={{ fontSize: 12 }} />
                                    Milestone
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="lg:col-span-3 flex items-center gap-2 text-gray-600">
                              <PendingActionsIcon style={{ fontSize: 16 }} />
                              <span className="text-sm">
                                {new Date(
                                  taskItem.start_date
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  taskItem.end_date
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="lg:col-span-2">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${taskItem.task_status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : taskItem.task_status === "On Progress"
                                    ? "bg-orange-100 text-orange-800"
                                    : taskItem.task_status === "Canceled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                              >
                                {taskItem.task_status}
                              </span>
                            </div>

                            <div className="lg:col-span-2">
                              {createSubTask !== 0 &&
                                taskItem.members.some(
                                  (member) =>
                                    member.user_id ===
                                    userInfo.foundUser.user_id
                                ) && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAddSubTaskModal();
                                      setSelectedTask(taskItem);
                                    }}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                  >
                                    <AddCircleOutlineIcon
                                      style={{ fontSize: 16 }}
                                    />
                                    Add Sub Task
                                  </button>
                                )}
                            </div>

                            {(updateTask !== 0 || deleteTask !== 0) && (
                              <div className="lg:col-span-1 flex items-center gap-3 justify-end">
                                {updateTask !== 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleEditMajorTaskModal(taskIndex);
                                      setSelectedTask(taskItem);
                                    }}
                                    className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                  >
                                    <FaEdit size={16} />
                                  </button>
                                )}
                                {deleteTask !== 0 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMajorTaskTrashModal(taskIndex);
                                      setSelectedTask(taskItem);
                                    }}
                                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                  >
                                    <FaTrash size={16} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        }
                      >
                        {taskItem.subTask.map((subtaskItem, subtaskIndex) => (
                          <TreeItem
                            key={`subtask-${activityIndex}-${taskIndex}-${subtaskIndex}`}
                            itemId={`subtask-${activityIndex}-${taskIndex}-${subtaskIndex}`}
                            label={
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4 px-4 items-center text-sm bg-blue-50/50 border-b border-blue-100 hover:bg-blue-50 transition-colors duration-150 ml-8 md:ml-16">
                                <div className="lg:col-span-3 flex items-start gap-3">
                                  <ListAltIcon
                                    className="text-gray-600 mt-0.5 flex-shrink-0"
                                    style={{ fontSize: 16 }}
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {subtaskItem.name}
                                    </div>
                                    {subtaskItem.is_milestone === true && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs font-medium rounded mt-1">
                                        <FlagIcon style={{ fontSize: 12 }} />
                                        Milestone
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="lg:col-span-2 flex items-center gap-2 text-gray-600">
                                  <PendingActionsIcon
                                    style={{ fontSize: 14 }}
                                  />
                                  <span className="text-sm">
                                    {new Date(
                                      subtaskItem.start_date
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      subtaskItem.end_date
                                    ).toLocaleDateString()}
                                  </span>
                                </div>

                                <div className="lg:col-span-2 flex items-center gap-3">
                                  {viewCommentOnSubtask !== 0 && (
                                    <Tooltip
                                      title="View comments"
                                      placement="top"
                                    >
                                      <IconButton
                                        onClick={() => {
                                          handleViewCommentOnSubtaskClick(
                                            subtaskItem
                                          );
                                          setSelectedSubTask(subtaskItem);
                                        }}
                                        size="small"
                                        className="hover:bg-blue-100"
                                      >
                                        <Badge
                                          badgeContent={
                                            subtaskItem.Coments?.length || 0
                                          }
                                          color="info"
                                          size="small"
                                        >
                                          <CommentIcon fontSize="small" />
                                        </Badge>
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                  {commentOnSubtask !== 0 && (
                                    <Tooltip
                                      title="Add comment"
                                      placement="top"
                                    >
                                      <IconButton
                                        onClick={() => {
                                          handleCommentOnSubtaskClick(
                                            subtaskItem
                                          );
                                          setSelectedSubTask(subtaskItem);
                                        }}
                                        size="small"
                                        className="hover:bg-blue-100"
                                      >
                                        <AddCommentIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </div>

                                <div className="lg:col-span-3">
                                  {taskItem.members.some(
                                    (member) =>
                                      member.user_id ===
                                      userInfo.foundUser.user_id
                                  ) ? (
                                    <FormControl
                                      size="small"
                                      className="min-w-[140px]"
                                    >
                                      <Select
                                        value={subtaskItem.subtask_status}
                                        onChange={handleChange(subtaskItem)}
                                        className={`rounded-lg text-sm ${subtaskItem.subtask_status ===
                                          "Completed"
                                          ? "bg-green-100 text-green-800"
                                          : subtaskItem.subtask_status ===
                                            "On Progress"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-gray-100 text-gray-800"
                                          }`}
                                      >
                                        {statusOptions.map((option) => (
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}
                                            className="text-sm"
                                          >
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  ) : (
                                    <span
                                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${subtaskItem.subtask_status ===
                                        "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : subtaskItem.subtask_status ===
                                          "On Progress"
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                      {subtaskItem.subtask_status}
                                    </span>
                                  )}
                                </div>

                                {subtaskItem.members.some(
                                  (member) =>
                                    member.user_id ===
                                    userInfo.foundUser.user_id
                                ) && (
                                    <div className="lg:col-span-2 flex items-center gap-3 justify-end">
                                      {updateSubTask !== 0 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleEditSubtaskModal(subtaskIndex);
                                            setSelectedSubTask(subtaskItem);
                                          }}
                                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                        >
                                          <FaEdit size={15} />
                                        </button>
                                      )}
                                      {deleteSubTask !== 0 && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSubtasktrashModal(true);
                                            setSelectedSubTask(subtaskItem);
                                          }}
                                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                        >
                                          <FaTrash size={15} />
                                        </button>
                                      )}
                                    </div>
                                  )}
                              </div>
                            }
                          />
                        ))}
                      </TreeItem>
                    </React.Fragment>
                  ))}
                </TreeItem>
              ))}
            </SimpleTreeView>
          </Box>
        ) : (
          <div className="text-center py-16">
            <Typography className="text-gray-500 text-lg">
              {noActivity || "No activities found"}
            </Typography>
          </div>
        )}
      </div>

      {/* Modal Components */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Assign Member
                </h3>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <WorkspaceAssignMember />
            </div>
          </div>
        </div>
      )}

      {showEditMajorTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-2/3 max-h-[90vh] overflow-hidden mx-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900"></h3>
                <button
                  onClick={toggleEditMajorTaskModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <WorkspaceEditMajorTask
                  selectedTask={selectedTask}
                  selectedActivity={selectedActivity}
                  selectedProject={props.setSelectedProjectInfo}
                  handlefetchActivity={fetchActivities}
                  handleCloseModal={handleEditTaskModalClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditSubtaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Edit Subtask
                </h3>
                <button
                  onClick={toggleEditSubtaskModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <WorkspaceEditSubtask
                selectedTask={selectedSubTask}
                selectedActivity={selectedActivity}
                selectedProject={props.setSelectedProjectInfo}
                handlefetchSubTask={fetchActivities}
                handleCloseModal={handleEditSubTaskModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-2/3 max-h-[90vh] overflow-hidden mx-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {/* Add New Task */}
                </h3>
                <button
                  onClick={toggleAddTaskModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <WorkspaceAddMajorTask
                  selectedActivity={selectedActivity}
                  selectedProject={props.setSelectedProjectInfo}
                  handlefetchTask={fetchActivities}
                  handleCloseModal={handleAddTaskModalClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddSubTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-2/3 max-h-[90vh] overflow-hidden mx-4"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Subtask
                </h3>
                <button
                  onClick={toggleAddSubTaskModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <WorkspaceAddSubTask
                  selectedTask={selectedTask}
                  selectedProject={props.setSelectedProjectInfo}
                  handlefetchSubTask={fetchActivities}
                  handleCloseModal={handleAddSubModalClose}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {commentSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="p-6">
            <Subtaskcomment
              handlefetchActivity={fetchActivities}
              subtaskId={selectedSubTask?.sub_task_id}
              handleCloseModal={handleCommentModalClose}
            />
          </div>
        </div>
      )}

      {viewCommentSubModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="p-6">
            <Subtaskcommentview
              handlefetchActivity={fetchActivities}
              subtaskId={selectedSubTask?.sub_task_id}
              handleCloseModal={handleViewCommentModalClose}
              selectedTask={selectedTask}
            />
          </div>
        </div>
      )}

      {showMajorTaskTrashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Delete Task
                </h3>
                <button
                  onClick={toggleMajorTaskTrashModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <WorkspaceTaskTrash
                selectedRow={selectedTask}
                handleDeleteModalClose={toggleMajorTaskTrashModal}
                handlefetchActivity={fetchActivities}
              />
            </div>
          </div>
        </div>
      )}

      {showSubtasktrashModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Delete Subtask
                </h3>
                <button
                  onClick={toggleSubtasktrashModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <WorkspaceSubtasktrash
                selectedRow={selectedSubTask}
                handleDeleteModalClose={toggleSubtasktrashModal}
                handlefetchActivity={fetchActivities}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
