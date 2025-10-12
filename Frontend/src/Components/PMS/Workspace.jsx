import { Box, Tooltip, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AddCommentIcon from "@mui/icons-material/MapsUgcOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import SearchIcon from "@mui/icons-material/Search";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Badge, IconButton, InputAdornment, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Helmet } from "react-helmet-async";

import PuffLoader from "react-spinners/ClipLoader";
// import AddCommentIcon from '@mui/icons-material/MapsUgcOutlined';
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";
import Subtaskcomment from "./Subtaskcomment.jsx";
import WorkspaceAddMajorTask from "./WorkspaceAddMajorTask.jsx";
import WorkspaceAddSubTask from "./WorkspaceAddSubTask.jsx";
import WorkspaceAssignMember from "./WorkspaceAssignMember.jsx";
import WorkspaceEditMajorTask from "./WorkspaceEditMajorTask.jsx";
import WorkspaceEditSubtask from "./WorkspaceEditSubtask.jsx";
import WorkspaceSubtasktrash from "./WorkspaceSubtasktrash.jsx";
import WorkspaceTaskTrash from "./WorkspaceTaskTrash.jsx";
// import Subtaskcomment from "./Subtaskcomment.jsx";
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

  const toggleAddSubSubTaskModal = () => {};

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
      <div className="flex gap-3 px-5 py-5 ">
        <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
          <div className="justify-center items-center px-3 py-1 bg-blue-900 rounded">
            {props.setSelectedProjectInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-auto my-auto text-xl font-medium text-blue-950">
          {props.setSelectedProjectInfo.name} - workspace
        </div>
      </div>

      <div>
        <ul class="my-5 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-200 dark:text-gray-400">
          <li class="me-2 " onClick={() => handleFilterClick("All")}>
            <a
              href="#"
              aria-current="page"
              className={`cursor-pointer ${
                statusFilter === "All"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4 rounded-t-lg"
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>All</div>
            </a>
          </li>

          <li class="me-2" onClick={() => handleFilterClick("Completed")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Completed"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4  rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>Completed</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("On Progress")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "On Progress"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>On Progress</div>
            </a>
          </li>

          <li class="me-2" onClick={() => handleFilterClick("Pending")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Pending"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50 "
              }`}
            >
              <div>Pending</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("Pending")}></li>
        </ul>
        <div className="flex flex-wrap gap-6 items-center mb-4">
          <div className="flex flex-wrap relative gap-6 items-center">
            <div class=" self-center">
              <TextField
                type="text"
                placeholder="Search by Activity Name"
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
            <div className="flex flex-row ">
              <input
                type="checkbox"
                id="is_milestone"
                name="is_milestone"
                checked={formData.is_milestone}
                onChange={handleInputChange}
                className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
              />
              <label htmlFor="is_milestone" className="ml-3">
                Is Milestone?
              </label>
            </div>
            <button onClick={fetchAllActivities}>Show All Activities</button>
          </div>
        </div>
      </div>

      {activities.length !== 0 ? (
        <Box
          sx={{
            border: "2px solid #ccc",
            borderRadius: "4px",
            padding: "30px",
          }}
          style={{
            minWidth: "900px", // Default minWidth for all screen sizes
            "@media (max-width: 640px)": {
              minWidth: "initial", // Reset minWidth for screens less than 640px
            },
          }}
        >
          <SimpleTreeView>
            {currentActivities.map((activityItem, activityIndex) => (
              <TreeItem
                key={`activity-${activityIndex}`}
                itemId={`activity-${activityIndex}`}
                label={
                  <div className="flex">
                    <div className=" flex flex-row justify-center self-stretch px-4 py-1.5 my-auto whitespace-nowrap  rounded-md cursor-pointer">
                      {activityItem.activity.name}
                      {activityItem.activity.is_milestone === true && (
                        <div className=" w-fit  right-2 text-xs  px-2  rounded">
                          <FlagIcon fontSize="small" />
                        </div>
                      )}
                    </div>
                    {createTask !== 0 && (
                      <div
                        className="flex gap-2 justify-center items-center self-stretch px-3 py-2 rounded-md text-black text-opacity-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddTaskModal();
                          setSelectedActivity(activityItem);
                        }}
                      >
                        <AddCircleOutlineIcon style={{ fontSize: 20 }} />
                        <div className="cursor-pointer">Add Task</div>
                      </div>
                    )}
                  </div>
                }
              >
                {activityItem.tasks.map((taskItem, taskIndex) => (
                  <>
                    <TreeItem
                      key={`task-${activityIndex}-${taskIndex}`}
                      itemId={`task-${activityIndex}-${taskIndex}`}
                      label={
                        <Box className="grid grid-cols-4 gap-4 py-4 items-center text-sm max-md:flex-wrap max-md:px-5 ml-8">
                          <div className="flex space-x-2 items-center">
                            <div
                              className="text-sm text-black"
                              style={{ wordWrap: "break-word" }}
                              onClick={() =>
                                toggleTask(activityIndex, taskIndex)
                              }
                            >
                              <div className="flex flex-row font-medium items-center gap-1 ">
                                <TaskAltIcon style={{ fontSize: 17 }} />{" "}
                                {taskItem.name}
                                {taskItem.is_milestone === true && (
                                  <div className="  right-2 text-xs  pb-6  rounded">
                                    <FlagIcon style={{ fontSize: 14 }} />
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              {taskItem && (
                                <div>
                                  {createSubTask !== 0 && (
                                    // {}
                                    <div
                                      className="flex gap-2 justify-center text-xs items-center self-stretch px-3 py-2 rounded-md text-black text-opacity-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAddSubTaskModal();
                                        setSelectedTask(taskItem);
                                      }}
                                    >
                                      {taskItem.members.some(
                                        (member) =>
                                          member.user_id ===
                                          userInfo.foundUser.user_id
                                      ) && (
                                        <>
                                          <AddCircleOutlineIcon
                                            style={{ fontSize: 17 }}
                                          />
                                          <div className="cursor-pointer">
                                            Add Sub Task
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <PendingActionsIcon />
                            {new Date(
                              taskItem.start_date
                            ).toLocaleDateString()}{" "}
                            - {new Date(taskItem.end_date).toLocaleDateString()}
                          </div>

                          <div
                            className={` px-3 text-xs py-2 w-fit whitespace-nowrap rounded-md ${
                              taskItem.task_status === "Completed"
                                ? "text-green-700 bg-green-200"
                                : taskItem.task_status === "On Progress"
                                ? "text-orange-700 bg-orange-200"
                                : taskItem.task_status === "Canceled"
                                ? "text-red-700 bg-red-200"
                                : ""
                            }`}
                          >
                            {taskItem.task_status}
                          </div>

                          {(updateTask !== 0 || deleteTask !== 0) && (
                            <div className="flex flex-row  right-0 mt-2  rounded-lg ">
                              {updateTask !== 0 && (
                                <div className="py-2">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleEditMajorTaskModal(taskIndex);
                                      setSelectedTask(taskItem);
                                    }}
                                  >
                                    <FaEdit
                                      className="cursor-pointer text-green-500"
                                      size={17}
                                    />
                                  </div>
                                </div>
                              )}
                              {deleteTask !== 0 && (
                                <div className="py-2">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleMajorTaskTrashModal(taskIndex);
                                      setSelectedTask(taskItem);
                                    }}
                                  >
                                    <FaTrash
                                      className="ml-1 cursor-pointer text-red-500"
                                      size={17}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Box>
                      }
                    >
                      {taskItem.subTask.map((subtaskItem, subtaskIndex) => (
                        <TreeItem
                          style={{ backgroundColor: "#edf4fb" }}
                          key={`subtask-${activityIndex}-${taskIndex}-${subtaskIndex}`}
                          itemId={`subtask-${activityIndex}-${taskIndex}-${subtaskIndex}`}
                          label={
                            <Box className="grid grid-cols-5 gap-4 py-4 items-center text-sm max-md:flex-wrap max-md:px-5 ml-16">
                              <div
                                className="flex gap-2 self-stretch my-auto"
                                onClick={() =>
                                  handlefetchSubTasks(subtaskItem.task_id)
                                }
                              >
                                <div className="taskname flex flex-col gap-1 justify-between py-0.5 overflow-hidden">
                                  <div
                                    className="text-sm text-black"
                                    style={{
                                      wordWrap: "break-word",
                                    }}
                                    onClick={() =>
                                      toggleSubtask(
                                        activityIndex,
                                        taskIndex,
                                        subtaskIndex
                                      )
                                    }
                                  >
                                    <div className="flex flex-row gap-2">
                                      <ListAltIcon /> {subtaskItem.name}
                                      {subtaskItem.is_milestone === true && (
                                        <div className=" right-2 text-xs pb-2 rounded">
                                          <FlagIcon style={{ fontSize: 14 }} />
                                        </div>
                                      )}
                                    </div>{" "}
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 items-center">
                                <PendingActionsIcon />
                                {new Date(
                                  subtaskItem.start_date
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(
                                  subtaskItem.end_date
                                ).toLocaleDateString()}
                              </div>

                              <div className="flex gap-2">
                                <div>
                                  {viewCommentOnSubtask !== 0 && (
                                    <div className="flex  cursor-pointer">
                                      <Tooltip
                                        title="View comments"
                                        placement="bottom"
                                      >
                                        <IconButton
                                          onClick={() => {
                                            handleViewCommentOnSubtaskClick(
                                              subtaskItem
                                            );
                                            setSelectedSubTask(subtaskItem);
                                          }}
                                          style={{
                                            backgroundColor: "transparent",
                                          }}
                                        >
                                          <Badge
                                            badgeContent={
                                              subtaskItem.Coments.length
                                            }
                                            color="info"
                                          >
                                            <CommentIcon />
                                          </Badge>
                                        </IconButton>
                                      </Tooltip>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  {commentOnSubtask !== 0 && (
                                    <div
                                      className="flex  cursor-pointer"
                                      onClick={() => {
                                        handleCommentOnSubtaskClick(
                                          subtaskItem
                                        );
                                        setSelectedSubTask(subtaskItem);
                                      }}
                                    >
                                      <AddCommentIcon />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="z-50 flex items-center gap-2">
                                {taskItem.members.some(
                                  (member) =>
                                    member.user_id ===
                                    userInfo.foundUser.user_id
                                ) ? (
                                  <>
                                    <FormControl variant="outlined">
                                      <Select
                                        value={subtaskItem.subtask_status}
                                        onChange={handleChange(subtaskItem)}
                                        className={`h-8 rounded-md text-xs`}
                                        style={{
                                          color:
                                            statusOptions.find(
                                              (option) =>
                                                option.value ===
                                                subtaskItem.subtask_status
                                            )?.color || "inherit",
                                          backgroundColor: statusOptions.find(
                                            (option) =>
                                              option.value ===
                                              subtaskItem.subtask_status
                                          )?.color
                                            ? `${
                                                statusOptions.find(
                                                  (option) =>
                                                    option.value ===
                                                    subtaskItem.subtask_status
                                                )?.color
                                              }-200`
                                            : "inherit",
                                        }}
                                      >
                                        {statusOptions.map((option) => (
                                          <MenuItem
                                            key={option.value}
                                            value={option.value}
                                          >
                                            {option.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </>
                                ) : (
                                  <div>{subtaskItem.subtask_status}</div>
                                )}
                              </div>
                              {subtaskItem.members.some(
                                (member) =>
                                  member.user_id === userInfo.foundUser.user_id
                              ) && (
                                <>
                                  {(updateSubTask !== 0 ||
                                    deleteSubTask !== 0) && (
                                    <div className="flex flex-row mr-20 absolute right-0  ">
                                      {updateSubTask !== 0 && (
                                        <div className="py-2">
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              toggleEditSubtaskModal(
                                                subtaskIndex
                                              );
                                              setSelectedSubTask(subtaskItem);
                                            }}
                                          >
                                            <FaEdit
                                              className="cursor-pointer text-green-500"
                                              size={17}
                                            />
                                          </div>
                                        </div>
                                      )}
                                      {deleteSubTask !== 0 && (
                                        <div className="py-2">
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setShowSubtasktrashModal(true);
                                              setSelectedSubTask(subtaskItem);
                                            }}
                                          >
                                            <FaTrash
                                              className="ml-1 cursor-pointer text-red-500"
                                              size={17}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </>
                              )}
                            </Box>
                          }
                        />
                      ))}
                    </TreeItem>
                  </>
                ))}
              </TreeItem>
            ))}
          </SimpleTreeView>
        </Box>
      ) : (
        <div class="text-center">
          <Typography>{noActivity}</Typography>
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white w-2/3 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleModal}
            >
              X
            </span>
            <WorkspaceAssignMember />
          </div>
        </div>
      )}
      {showEditMajorTaskModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div ref={modalRef} className="bg-white rounded-md relative">
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleEditMajorTaskModal}
            >
              X
            </span>
            <WorkspaceEditMajorTask
              selectedTask={selectedTask}
              selectedActivity={selectedActivity}
              selectedProject={props.setSelectedProjectInfo}
              handlefetchActivity={fetchActivities}
              handleCloseModal={handleEditTaskModalClose}
            />
          </div>
        </div>
      )}
      {showEditSubtaskModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div ref={modalRef} className="bg-white rounded-md relative">
            <span
              className="absolute top-4 right-10 cursor-pointer text-gray-500"
              onClick={toggleEditSubtaskModal}
            >
              X
            </span>
            <WorkspaceEditSubtask
              selectedTask={selectedSubTask}
              selectedActivity={selectedActivity}
              selectedProject={props.setSelectedProjectInfo}
              handlefetchSubTask={fetchActivities}
              handleCloseModal={handleEditSubTaskModalClose}
            />{" "}
          </div>
        </div>
      )}
      {showAddTaskModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white mt-20 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleAddTaskModal}
            >
              X
            </span>
            <WorkspaceAddMajorTask
              selectedActivity={selectedActivity}
              selectedProject={props.setSelectedProjectInfo}
              handlefetchTask={fetchActivities}
              handleCloseModal={handleAddTaskModalClose}
            />
          </div>
        </div>
      )}
      {showAddSubTaskModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white mt-20 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleAddSubTaskModal}
            >
              X
            </span>
            <WorkspaceAddSubTask
              selectedTask={selectedTask}
              selectedProject={props.setSelectedProjectInfo}
              handlefetchSubTask={fetchActivities}
              handleCloseModal={handleAddSubModalClose}
            />
          </div>
        </div>
      )}
      {showMajorTaskTrashModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white w-2/3 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleMajorTaskTrashModal}
            >
              X
            </span>
            <WorkspaceTaskTrash
              selectedRow={selectedTask}
              handleDeleteModalClose={toggleMajorTaskTrashModal}
              handlefetchActivity={fetchActivities}
            />
          </div>
        </div>
      )}
      {commentSubModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/4 rounded-md relative" ref={modalRef}>
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleCommentModalClose}
            >
              X
            </div>
            <Subtaskcomment
              handlefetchActivity={fetchActivities}
              subtaskId={selectedSubTask?.sub_task_id}
              handleCloseModal={handleCommentModalClose}
            />
          </div>
        </div>
      )}
      {viewCommentSubModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/4 rounded-md relative" ref={modalRef}>
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleViewCommentModalClose}
            >
              X
            </div>
            <Subtaskcommentview
              handlefetchActivity={fetchActivities}
              subtaskId={selectedSubTask?.sub_task_id}
              handleCloseModal={handleViewCommentModalClose}
              selectedTask={selectedTask}
            />
          </div>
        </div>
      )}
      {showSubtasktrashModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white w-2/3 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleSubtasktrashModal}
            >
              X
            </span>
            <WorkspaceSubtasktrash
              selectedRow={selectedSubTask}
              handleDeleteModalClose={toggleSubtasktrashModal}
              handlefetchActivity={fetchActivities}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
