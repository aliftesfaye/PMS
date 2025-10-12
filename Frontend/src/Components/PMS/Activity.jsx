import { Card, Typography } from "@material-ui/core";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Duration from "@mui/icons-material/QueryBuilder";
import SearchIcon from "@mui/icons-material/Search";
import AddCommentIcon from "@mui/icons-material/SmsOutlined";
import {
  Box,
  Divider,
  InputAdornment,
  Pagination,
  TextField,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import ProgressBar from "@ramonak/react-progress-bar";
import { EditorState } from "draft-js";
import React, { useEffect, useRef, useState } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // Import editor styles
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash } from "react-icons/fa";
import PuffLoader from "react-spinners/ClipLoader";
import { PERMISSIONS } from "../../config";
import ActivityAdd from "../PMS/Activityadd";
import Activitycomment from "../PMS/Activitycomment";
import apiService from "../services/apiServices";
import Activitiesdetail from "./Activitiesdetail";
import Activitiesedit from "./Activitiesedit";
import Activitycommentview from "./Activitycommentview";
import Activitydelete from "./Activitydelete";
import "./Tasks.css";

const Activity = (props) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [viewcommentModalOpen, setViewcommentModalOpen] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  const [projectPermissions, setProjectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });
  const [expandedTeamIndices, setExpandedTeamIndices] = useState(
    Array(activities.length).fill(false)
  );
  const [loading, setLoading] = useState(false);
  const [noActivity, setNoActivity] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRowAllData, setSelectedRowAllData] = useState(null);
  const [createActivity, setCreateActivity] = useState(0);
  const [updateActivity, setUpdateActivity] = useState(0);
  const [commentOnActivity, setCommentOnActivity] = useState(0);
  const [viewCommentOnActivity, setViewCommentOnActivity] = useState(0);

  const [deleteActivity, setDeleteActivity] = useState(0);
  const [selectedActivityId, setSelectedActivityId] = useState(null);
  const [formData, setFormData] = useState({
    is_milestone: false,
  });
  const activitiesPerPage = 8;
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const totalPages = Math.ceil(activities.length / activitiesPerPage);
  const handleMenuOpen = (rowId) => {
    setOpenRowMenu(rowId);
  };
  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormData({
      ...formData,
      [name]: value,
    });

    fetchActivitiesWithMilestone(value);
  };

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, []);

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

  const fetchActivities = async () => {
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

      // Filter activities based on the is_milestone flag
      const filteredActivities = sortedResponse.filter(
        (activity) => activity.activity.is_milestone === formData.is_milestone
      );

      setActivities(filteredActivities);
      activities.length === 0
        ? setNoActivity("No Activity Found")
        : setNoActivity("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching activity:", error);
    }
  };
  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDetailClick = (row, data) => {
    setSelectedRow(row);
    setSelectedRowAllData(data);
    setSelectedActivityId(data.activity.activity_id);
    setDetailModalOpen(true);
  };
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setEditModalOpen(false);
      setDetailModalOpen(false);
      setAddModalOpen(false);
      setDeleteModalOpen(false);
      setCommentModalOpen(false);
      setViewcommentModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setCommentModalOpen(false);
    setViewcommentModalOpen(false);
  };
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };
  const modalRef = useRef(null);

  const handlefetchActivity = async () => {
    try {
      setLoading(true);
      const activityData = await apiService.getAllActivities(
        props.setSelectedProjectInfo.project_id
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });
      setActivities(sortedResponse);
      sortedResponse.length === 0
        ? setNoActivity("No Activity Found")
        : setNoActivity("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Activities:", error);
    }
  };
  const handleAddModalClose = () => {
    setAddModalOpen(false);
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

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };
  useEffect(() => {
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

    const CREATE_ACTIVITY = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_ACTIVITY
    );
    const UPDATE_ACTIVITY = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_ACTIVITY
    );
    const DELETE_ACTIVITY = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_ACTIVITY
    );
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
    const COMMENT_ON_ACTIVITY = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.COMMENT_ON_ACTIVITY
    );
    const VIEW_COMMENT_ON_ACTIVITY = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.VIEW_COMMENT_ON_ACTIVITY
    );

    setCreateActivity(CREATE_ACTIVITY.length);
    setUpdateActivity(UPDATE_ACTIVITY.length);
    setCommentOnActivity(COMMENT_ON_ACTIVITY.length);
    setViewCommentOnActivity(VIEW_COMMENT_ON_ACTIVITY.length);

    setDeleteActivity(DELETE_ACTIVITY.length);

    handlefetchActivity();
  }, [userInfo]);

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

  const handleAddActivityClick = () => {
    setAddModalOpen(true);
  };
  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (storedUserInfo) {
      setUserInfo(storedUserInfo);
    }
  }, []);

  const handleCommentOnActivityClick = (activity) => {
    setSelectedRow(activity);
    setCommentModalOpen(true);
  };
  const handleViewCommentOnActivityClick = (activity) => {
    setSelectedRow(activity);
    setViewcommentModalOpen(true);
  };

  const indexOfLastActivity = currentPage * rowsPerPage;
  const indexOfFirstActivity = indexOfLastActivity - rowsPerPage;

  const currentActivities = search.slice(
    indexOfFirstActivity,
    indexOfLastActivity
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // setExpandedTeamIndices(currentActivities);
  const toggleTeamExpansion = (activityIndex) => {
    const newExpandedTeamIndices = [...expandedTeamIndices];
    newExpandedTeamIndices[activityIndex] =
      !newExpandedTeamIndices[activityIndex];
    setExpandedTeamIndices(newExpandedTeamIndices);
  };

  const handleChange = (event, value) => {
    paginate(value);
  };

  const pageCount = Math.ceil(search.length / rowsPerPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };
  return (
    <div className="ml-auto w-4/5 mr-5 mt-24">
      <Helmet>
        <title>{props.setSelectedProjectInfo.name} - Activities</title>
      </Helmet>
      <div className="flex gap-3 px-5 py-5 ">
        <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
          <div
            className="justify-center items-center px-3 py-1 rounded"
            style={{ backgroundColor: "#082f49" }}
          >
            {props.setSelectedProjectInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-auto my-auto text-xl font-medium text-blue-950">
          {props.setSelectedProjectInfo.name}
        </div>
      </div>
      <div className="flex-auto my-auto px-5 py-2 text-xl font-medium text-blue-950">
        List of Activities
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
        </ul>
        <div className="flex justify-between">
          <div className="flex flex-row relative gap-6 items-center">
            <div class=" self-center ">
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
          <div className="text-end">
            {createActivity !== 0 && (
              <button
                className="text-white p-3 m-3 "
                style={{ backgroundColor: "#082f49" }}
                onClick={() => handleAddActivityClick()}
              >
                + Add New Activity
              </button>
            )}
          </div>
          {/* <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
          /> */}
        </div>
      </div>
      {filteredRows.length !== 0 && (
        <div className="rows-per-page flex my-6 ml-2 justify-start text-sm ">
          {" "}
          Rows per page
          <div>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className=" w-fit pl-3 text-sm border-none outline-none bg-white  focus:border-none focus:outline-none"
            >
              <option value={8}>8</option>
              <option value={16}>16</option>
              <option value={32}>32</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      <div
        class={
          activities.length !== 0
            ? "flex flex-wrap"
            : "flex flex-wrap justify-center"
        }
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <PuffLoader color="#fff" />
        </Backdrop>

        {activities.length !== 0 ? (
          currentActivities.map((data, activityIndex) => {
            {
              const progress = function (start_date, end_date) {
                const currentDate = new Date();
                const totalDuration = new Date(end_date) - new Date(start_date);
                const elapsedDuration = currentDate - new Date(start_date);
                const progress = Math.min(
                  Math.max((elapsedDuration / totalDuration) * 100, 0),
                  100
                );
                return progress;
              };

              const activity = data.activity;
              const Tasklength = data.Tasklength;
              const commentlength = data.commentlength;
              const date_diff_indays = function (date1, date2) {
                const dt1 = new Date(date1);
                const dt2 = new Date(date2);
                return Math.floor(
                  (Date.UTC(
                    dt2.getFullYear(),
                    dt2.getMonth(),
                    dt2.getDate(),
                    dt2.getHours(),
                    dt2.getMinutes()
                  ) -
                    Date.UTC(
                      dt1.getFullYear(),
                      dt1.getMonth(),
                      dt1.getDate(),
                      dt2.getHours(),
                      dt2.getMinutes()
                    )) /
                    (1000 * 60 * 60 * 24)
                );
              };
              const daysBetween = date_diff_indays(
                activity.start_date,
                activity.end_date
              );

              const days_left = date_diff_indays(new Date(), activity.end_date);

              const isActivityStarted = date_diff_indays(
                new Date(),
                activity.start_date
              );

              var daysLeftDisplay =
                days_left > 0
                  ? days_left + (days_left === 1 ? " day" : " days")
                  : "";

              const progress_result = progress(
                activity.start_date,
                activity.end_date
              );

              const activity_progress = activity.activity_status;

              var days = Math.floor((daysBetween % 365) % 30);
              var daysDisplay =
                days > 0 ? days + (days === 1 ? " day" : " days") : "";

              return (
                <Card
                  className="border-x border-y rounded-full m-1 hover:bg-gray-300"
                  key={activityIndex}
                >
                  <div className="flex flex-wrap justify-between py-4 px-2">
                    <Typography className="font-bold text-lg flex flex-row">
                      <div className="flex flex-row">
                        {activity.name}
                        {activity.is_milestone === true && (
                          <div className="w-fit top-2 right-2 text-xs px-2 py-1 rounded">
                            <FlagIcon fontSize="small" />
                          </div>
                        )}
                      </div>
                    </Typography>

                    <div className="flex gap-3">
                      <div
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMenuOpen(activity.activity_id);
                        }}
                      >
                        {(updateActivity !== 0 || deleteActivity !== 0) && (
                          <MoreHorizIcon className="cursor-pointer" />
                        )}

                        {openRowMenu === activity.activity_id && (
                          <div className="cursor-pointer flex-row shadow-lg rounded-md flex gap-2">
                            {updateActivity !== 0 && (
                              <div
                                className="text-blue-900"
                                onClick={() => handleEditClick(activity)}
                              >
                                <FaEdit />
                              </div>
                            )}
                            {deleteActivity !== 0 && (
                              <div
                                className="text-red-400"
                                onClick={() => handleDeleteClick(activity)}
                              >
                                <FaTrash />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* <div>
                      {!expandedTeamIndices[activityIndex] && (
                        <div class="flex flex-wrap ml-4">
                          {activity.members.map((member, memberIndex) => (
                            <AccountCircleIcon />
                          ))}
                        </div>
                      )}
                      <p class="flex flex-wrap ml-4 justify-between pr-3">
                        <div class="flex flex-wrap">
                          Members:{" "}
                          <div className="number-of-members">
                            {activity.members.length}
                          </div>
                        </div>
                        <span
                          class="cursor-pointer"
                          onClick={() => toggleTeamExpansion(activityIndex)}
                        >
                          {expandedTeamIndices[activityIndex] ? "▲" : "▼"}
                        </span>
                      </p>
                      {expandedTeamIndices[activityIndex] && (
                        <div class="ml-8 overflow-x-auto  mr-3">
                          {(activity.members || []).map(
                            (member, memberIndex) => (
                              <div key={memberIndex}>
                                <p>
                                  {member
                                    ? member.UserInfo.full_name || ""
                                    : ""}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div> */}

                    <div className="icon-text flex items-center ml-5">
                      <div className="flex gap-2 items-center">
                        <AssignmentOutlinedIcon fontSize="15" />
                        {Tasklength >= 1 ? (
                          <div>
                            <span className="text-black ml-1">
                              {Tasklength}
                            </span>
                            <span className="text-black ml-1">
                              {Tasklength === 1 ? "Task" : "Tasks"}
                            </span>
                          </div>
                        ) : (
                          <div>No Task</div>
                        )}
                      </div>
                    </div>

                    <div className="icon-text flex items-center justify-between ml-5">
                      <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() =>
                          handleViewCommentOnActivityClick(activity)
                        }
                      >
                        {viewCommentOnActivity !== 0 && (
                          <>
                            <ChatOutlinedIcon fontSize="15" />
                            {commentlength >= 1 ? (
                              <div>
                                <span className="text-black ml-1">
                                  {commentlength}{" "}
                                </span>
                                <span className="text-black ml-1">
                                  {commentlength === 1
                                    ? " Comment"
                                    : " Comments"}
                                </span>
                              </div>
                            ) : (
                              <div>No comment</div>
                            )}
                          </>
                        )}
                      </div>

                      <div>
                        {commentOnActivity !== 0 && (
                          <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() =>
                              handleCommentOnActivityClick(activity)
                            }
                          >
                            <Typography>Add</Typography>
                            <AddCommentIcon fontSize="small" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="icon-text flex items-center ml-5">
                      <Duration fontSize="16" />
                      <span className="text-black ml-1">
                        {daysDisplay}
                        {/* (
                        {new Date(activity.start_date).toLocaleDateString()} -{" "}
                        {new Date(activity.end_date).toLocaleDateString()} ) */}
                      </span>
                      {/* <span className="text-black ml-1 ">days</span> */}
                    </div>

                    <Divider />
                    {isActivityStarted <= 0 ? (
                      <div
                        className="progress-bar-container w-72 hover:cursor-pointer"
                        onClick={() => handleDetailClick(activity, data)}
                      >
                        <div className="icon-text flex items-center ml-3 mt-2  justify-evenly">
                          <div className="progress-title">Progress</div>

                          {days_left > 0 &&
                          activity_progress !== "Completed" ? (
                            <div
                              class="flex ml-auto mr-4 gap-1 items-center px-1 rounded-md"
                              style={{
                                backgroundColor: `${
                                  parseInt(progress_result) < 75
                                    ? "orange"
                                    : parseInt(progress_result) <= 100
                                    ? "green"
                                    : "red"
                                }`,
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="20"
                                sx={{ color: "white" }}
                              />

                              <span className="text-white">
                                {daysLeftDisplay}{" "}
                              </span>
                              <span className="text-white ml-1 "> left</span>
                            </div>
                          ) : days_left > 0 &&
                            activity_progress === "Completed" ? (
                            <div
                              class="flex ml-auto mr-4 gap-1 items-center px-1 rounded-md"
                              style={{
                                backgroundColor: "green",
                              }}
                            >
                              <AccessTimeIcon
                                fontSize="20"
                                sx={{ color: "white" }}
                              />

                              <span className="text-white ml-1 ">
                                Completed
                              </span>
                            </div>
                          ) : activity_progress === "Completed" ? (
                            <Typography style={{ color: "green" }}>
                              Completed
                            </Typography>
                          ) : (
                            <Typography style={{ color: "#EE4B2B" }}>
                              Deadline Passed
                            </Typography>
                          )}
                        </div>
                        <div class="my-4 mx-2">
                          {days_left > 0 &&
                          activity_progress !== "Completed" ? (
                            <div>
                              <ProgressBar
                                completed={parseInt(progress_result)}
                                bgColor={`${
                                  parseInt(progress_result) < 75
                                    ? "orange"
                                    : parseInt(progress_result) <= 100
                                    ? "green"
                                    : "blue"
                                }`}
                                height="12px"
                                borderRadius="50px"
                              />
                            </div>
                          ) : days_left > 0 &&
                            activity_progress === "Completed" ? (
                            <div>
                              <ProgressBar
                                completed={parseInt(progress_result)}
                                bgColor={`green`}
                                height="12px"
                                borderRadius="50px"
                              />
                            </div>
                          ) : activity_progress === "Completed" ? (
                            <ProgressBar
                              completed={parseInt(progress_result)}
                              bgColor={`green`}
                              height="12px"
                              borderRadius="50px"
                            />
                          ) : (
                            <ProgressBar
                              completed={parseInt(progress_result)}
                              bgColor={`#A52A2A`}
                              height="12px"
                              borderRadius="50px"
                            />
                          )}
                        </div>
                        <div class="my-4 mx-2">
                          <div class="flex flex-wrap items-center justify-evenly">
                            <Typography>Activity Status</Typography>
                            <Typography
                              style={{
                                color: `${
                                  activity_progress === "On Progress"
                                    ? "orange"
                                    : activity_progress === "Completed"
                                    ? "green"
                                    : "gray"
                                }`,
                              }}
                              borderRadius="50px"
                            >
                              {activity_progress}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="progress-bar-container w-72 hover:cursor-pointer"
                        onClick={() => handleDetailClick(activity, data)}
                      >
                        <div className="icon-text flex items-center ml-3 mt-2  justify-evenly">
                          <div className="progress-title"></div>
                          <div
                            class="flex ml-auto mr-4 gap-1 items-center"
                            style={{
                              color: `${
                                activity_progress === "on Progress"
                                  ? "orange"
                                  : activity_progress === "Completed"
                                  ? "green"
                                  : "blue"
                              }`,
                            }}
                          >
                            <AccessTimeIcon fontSize="20" />

                            <span> Upcomming</span>
                          </div>
                        </div>
                        <div class="my-4 mx-2">
                          {days_left > 0 ? (
                            <div>
                              <ProgressBar
                                completed={parseInt(progress_result)}
                                bgColor={`${
                                  parseInt(progress_result) < 75
                                    ? "orange"
                                    : parseInt(progress_result) <= 100
                                    ? "green"
                                    : "blue"
                                }`}
                                height="12px"
                                borderRadius="50px"
                              />
                            </div>
                          ) : (
                            <ProgressBar
                              completed={parseInt(progress_result)}
                              bgColor={`##A52A2A`}
                              height="12px"
                              borderRadius="50px"
                            />
                          )}
                        </div>
                        <div class="my-4 mx-2">
                          {/* <div
                    className="progress-bar-background"
                    style={{ width: "100%" }}
                  ></div> */}
                          {/* <div
                    className={`progress-bar-progress ${
                      activity.progress >= 80
                        ? "green"
                        : activity.progress >= 50
                        ? "yellow"
                        : "red"
                    }`}
                    style={{ width: activity.progress + "%" }}
                  ></div> */}
                          <div class="flex flex-wrap items-center justify-evenly">
                            <Typography>Activity Status</Typography>
                            <Typography
                              style={{
                                color: `${
                                  activity_progress === "on Progress"
                                    ? "orange"
                                    : activity_progress === "Completed"
                                    ? "green"
                                    : "blue"
                                }`,
                              }}
                              borderRadius="50px"
                            >
                              Upcomming
                            </Typography>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            }
          })
        ) : (
          <div class="text-center self-center">
            <Typography>{noActivity}</Typography>
          </div>
        )}
      </div>
      {filteredRows.length !== 0 && (
        <div className="flex flex-wrap justify-center gap-5 mb-10">
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
      )}

      {addModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-3/5  rounded-md relative">
            <span
              className="absolute top-2 right-8 cursor-pointer text-gray-500"
              onClick={handleAddModalClose}
            >
              X
            </span>
            <ActivityAdd
              handlefetchActivity={handlefetchActivity}
              handleCloseModal={handleAddModalClose}
              selectedProject={props.setSelectedProjectInfo}
            />{" "}
          </div>
        </div>
      )}
      {editModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            className="bg-white w-3/5 h-4/6 overflow-y-scroll rounded-md relative"
            ref={modalRef}
          >
            <div
              className="close  cursor-pointer text-end mr-12 mt-5"
              onClick={handleEditModalClose}
            >
              X
            </div>
            <Activitiesedit
              selectedRow={selectedRow}
              handlefetchActivity={handlefetchActivity}
              handleCloseModal={handleEditModalClose}
              selectedProject={props.setSelectedProjectInfo}
            />
          </div>
        </div>
      )}

      {detailModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-2/3 rounded-md relative" ref={modalRef}>
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleDetailModalClose}
            >
              X
            </div>
            <Activitiesdetail
              selectedRow={selectedRow}
              selectedRowAllData={selectedRowAllData}
              handleCloseModal={handleAddModalClose}
            />
          </div>
        </div>
      )}
      {commentModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/4 rounded-md relative" ref={modalRef}>
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleDetailModalClose}
            >
              X
            </div>
            <Activitycomment
              handlefetchActivity={handlefetchActivity}
              activityName={selectedRow?.name}
              selectedRow={selectedRow}
              activityId={selectedRow?.activity_id}
              userId={userInfo?.foundUser?.user_id}
              handleCloseModal={handleDetailModalClose}
              selectedProject={props.setSelectedProjectInfo}
            />
          </div>
        </div>
      )}
      {viewcommentModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/4 rounded-md relative" ref={modalRef}>
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleDetailModalClose}
            >
              X
            </div>
            <Activitycommentview
              handlefetchActivity={handlefetchActivity}
              activityName={selectedRow?.name}
              selectedRow={selectedRow}
              activityId={selectedRow?.activity_id}
              userId={userInfo?.foundUser?.user_id}
              handleCloseModal={handleDetailModalClose}
              selectedProject={props.setSelectedProjectInfo}
            />
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 pt-4 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12"
              onClick={handleDeleteModalClose}
            >
              X
            </div>
            <Activitydelete
              selectedRow={selectedRow}
              handlefetchActivity={handlefetchActivity}
              handleDeleteModalClose={handleDeleteModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;
