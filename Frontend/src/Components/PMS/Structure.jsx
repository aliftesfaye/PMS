import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CircleIcon from "@mui/icons-material/AccountBalance";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import Backdrop from "@mui/material/Backdrop";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash } from "react-icons/fa";
import PuffLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import { BASE_URL, PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";
import Addorganization from "./Addorganization.jsx";
import Addprojecttodepartment from "./Departmentaddproject.jsx";
import Departmentassignmembers from "./Departmentassignmembers.jsx";
import DivisionAdd from "./DivisionAdd.jsx";
import Editorganization from "./Editorganization";
import OrganizationalUnitdelete from "./OrganizationalUnitdelete.jsx";
import Organizationaluniteditt from "./Organizationaluniteditt.jsx";
import SectorAdd from "./SectorAdd.jsx";
import SectorEdit from "./SectorEdit.jsx";
import Sectordelete from "./Sectordelete.jsx";
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
const Structure = (props) => {
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
  const [createDepartment, setCreateDepartment] = useState(0);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [selectedSubtaskIndex, setSelectedSubtaskIndex] = useState(null);

  const [expandedOrganization, setExpandedOrganization] = useState([]);
  const [expandedTasks, setExpandedTasks] = useState([]);
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [expandedSubtasks, setExpandedSubtasks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [updateDepartment, setUpdateDepartment] = useState(0);
  const [deleteDepartment, setDeleteDepartment] = useState(0);
  const [sectorAssignmemberModalOpen, setSectorAssignmemberModalOpen] =
    useState(false);

  //orgn
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editClusterModalOpen, setEditClusterModalOpen] = useState(false);
  const [deleteClusterModalOpen, setDeleteClusterModalOpen] = useState(false);

  const [leader, setLeader] = useState("");
  const [structureName, setStructureName] = useState(
    "Organizational Structure"
  );
  const [noOrganization, setNoOrganization] = useState("loading ...");
  const [organizationData, setOrganizationData] = useState([]);
  const [clusterData, setClusterData] = useState([]);
  const [updateOrganization, setUpdateOrganization] = useState(0);
  const [createOrganization, setCreateOrganization] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [deleteDepartmentModalOpen, setDeleteDepartmentModalOpen] =
    useState(false);

  const [createSector, setCreateSector] = useState(0);
  const [updateSector, setUpdateSector] = useState(0);
  const [deleteSector, setDeleteSector] = useState(0);
  const [assignmembertosector, setAssignmembertosector] = useState(0);
  const [assignmembertodepartment, setAssignmembertodepartment] = useState(0);
  const [addprojecttodepartment, setAddprojecttodepartment] = useState(0);
  const [addprojecttodepartmentOpen, setAddProjecttodepartmentOpen] =
    useState(0);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addSectorModalOpen, setAddSectorModalOpen] = useState(false);
  const [editDepartmentModalOpen, setEditDepartmentModalOpen] = useState(false);

  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [projectPermissions, setProjectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });
  const [loading, setLoading] = useState(false);
  const [noActivity, setNoActivity] = useState();
  const [selectedActivity, setSelectedActivity] = useState({});
  const [selectedTask, setSelectedTask] = useState({});
  const [selectedSubTask, setSelectedSubTask] = useState({});
  const [organizationaddModalOpen, setOrganizationAddModalOpen] =
    useState(false);
  const [addDepartmentModalOpen, setAddDepartmentModalOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(null);

  const [selectedSectorId, setSelectedSectorId] = useState(null);
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

  const handleSectorAssignmemberModalClose = () => {
    setSectorAssignmemberModalOpen(false);
  };
  const handleAddProjecttodepartmentModalClose = () => {
    setAddProjecttodepartmentOpen(false);
  };

  const handleSectorAssignMemberClick = (row) => {
    setSelectedRow(row);
    setSectorAssignmemberModalOpen(true);
  };

  const toggleAddTaskModal = () => setShowAddTaskModal(!showAddTaskModal);
  const toggleAddSubTaskModal = () =>
    setShowAddSubTaskModal(!showAddSubTaskModal);
  const toggleMajorTaskTrashModal = (index) => {
    setSelectedTaskIndex(index);
    setShowMajorTaskTrashModal(!showMajorTaskTrashModal);
  };
  const handleDeleteDepartmentClick = (row) => {
    setSelectedRow(row);
    setDeleteDepartmentModalOpen(true);
  };
  const toggleSubtasktrashModal = (index) => {
    setSelectedTaskIndex(index);
    setShowSubtasktrashModal(!showSubtasktrashModal);
  };
  const toggleEditSubtaskModal = () => {
    setShowEditSubtaskModal(!showEditSubtaskModal);
  };

  const toggleSubtask = (
    organizationIndex,
    clusterIndex,
    selectedDepartmentIndex
  ) => {
    const subtaskKey = `${organizationIndex}-${clusterIndex}-${selectedDepartmentIndex}`;
    setExpandedSubtasks((prevState) => {
      if (prevState.includes(subtaskKey)) {
        return prevState.filter((item) => item !== subtaskKey);
      } else {
        return [...prevState, subtaskKey];
      }
    });
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
  const handleAddDepartmentClick = (sectorId) => {
    setSelectedSectorId(sectorId);
    setAddDepartmentModalOpen(true);
  };
  const handleAddProjecttodepartment = (selectedDepartment) => {
    setSelectedDepartmentId(selectedDepartment.division_id);
    setAddProjecttodepartmentOpen(true);
  };

  const handleEditDepartmentClick = (row) => {
    setSelectedRow(row);
    setEditDepartmentModalOpen(true);
  };
  const handleEditDepartmentModalClose = () => {
    setEditDepartmentModalOpen(false);
  };
  const handleDeleteDepartmentModalClose = () => {
    setDeleteDepartmentModalOpen(false);
  };

  const handleAddDepartmentModalClose = () => {
    setAddDepartmentModalOpen(false);
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
          fetchData();
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
  const handleClusterDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteClusterModalOpen(true);
  };
  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };
  const handleEditSubTaskModalClose = () => {
    setShowEditSubtaskModal(false);
  };
  const handleAddSectorClick = () => {
    setAddSectorModalOpen(true);
  };
  const handleAddSubModalClose = () => {
    setShowAddSubTaskModal(false);
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
    organizationIndex,
    clusterIndex,
    selectedDepartmentIndex,
    subselectedDepartmentIndex
  ) => {
    setSelectedTaskIndex(clusterIndex);
    setShowOptions((prevOptions) => ({
      ...prevOptions,
      [`${organizationIndex}-${clusterIndex}`]:
        !prevOptions[`${organizationIndex}-${clusterIndex}`],
    }));
  };

  const toggleSubtaskOptions = (
    organizationIndex,
    clusterIndex,
    selectedDepartmentIndex
  ) => {
    setSelectedSubtaskIndex(selectedDepartmentIndex);
    setShowSubtaskOptions((prevOptions) => ({
      ...prevOptions,
      [`${organizationIndex}-${clusterIndex}-${selectedDepartmentIndex}`]:
        !prevOptions[
          `${organizationIndex}-${clusterIndex}-${selectedDepartmentIndex}`
        ],
    }));
  };

  const toggleActivity = async (index) => {
    if (expandedOrganization.includes(index)) {
      setExpandedOrganization(
        expandedOrganization.filter((item) => item !== index)
      );
    } else {
      setExpandedOrganization([...expandedOrganization, index]);
    }
  };
  const toggleTask = (organizationIndex, clusterIndex) => {
    const taskKey = `${organizationIndex}-${clusterIndex}`;
    if (expandedTasks.includes(taskKey)) {
      setExpandedTasks(expandedTasks.filter((item) => item !== taskKey));
    } else {
      setExpandedTasks([...expandedTasks, taskKey]);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganization();

      const sortedResponse = response.organization.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      console.log(sortedResponse);
      setOrganizationData(sortedResponse);
      setLeader(response.leader);
      organizationData.length === 0
        ? setNoOrganization("No Organization Found")
        : setNoOrganization("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const organizationsData = await apiService.getallOrganizations(
        userInfo.access_token
      );
      console.log("Fetched organizations:", organizationsData);
      const sortedResponse = organizationsData.sort((a, b) => {
        if (a.sector.createdAt > b.sector.createdAt) {
          return -1;
        }
      });
      setTimeout(() => {
        setClusterData(sortedResponse);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const search = organizationData.filter(
    (row) =>
      row.name &&
      row.name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );
  const handleEditClick = (row) => {
    setSelectedRow(row);
    console.log("dfv", row);
    setEditModalOpen(true);
  };
  const handleClusterEditClick = (row) => {
    setSelectedRow(row);
    setEditClusterModalOpen(true);
  };
  const handleClusterDeleteModalClose = () => {
    setDeleteClusterModalOpen(false);
  };
  const handleOrganizationAddClick = (row) => {
    setSelectedRow(row);
    setOrganizationAddModalOpen(true);
  };
  const handleAddProjecttodepartmentClick = (row) => {
    setSelectedRow(row);
    setAddProjecttodepartmentOpen(true);
  };
  const handleOrganizationAddModalClose = () => {
    setOrganizationAddModalOpen(false);
  };
  const handleAddSectorModalClose = () => {
    setAddSectorModalOpen(false);
  };

  const handleEditClusterModalClose = () => {
    setEditClusterModalOpen(false);
  };

  const indexOfLastActivity = currentPage;
  const indexOfFirstActivity = indexOfLastActivity;

  const currentOrganization = search.slice(currentPage);

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage();
  };
  useEffect(() => {
    fetchData();
    fetchClusters();

    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    async function fetchProjectPermissions() {
      localStorage.setItem(
        "project_permissions",
        JSON.stringify(projectPermissions)
      );
    }

    fetchUsers();
    fetchProjectPermissions();

    const CREATE_ORGANIZATION = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_ORGANIZATION
    );

    const UPDATE_ORGANIZATION = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_ORGANIZATION
    );

    const CREATE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_SECTOR
    );

    const UPDATE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_SECTOR
    );

    const DELETE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_SECTOR
    );

    const ASSIGN_MEMBER_TO_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.ASSIGN_MEMBER_TO_SECTOR
    );
    const CREATE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_ORGANIZATION_UNIT
    );

    const UPDATE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_ORGANIZATION_UNIT
    );

    const DELETE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_ORGANIZATION_UNIT
    );
    const ADD_PROJECT_TO_DEPARTMENT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.ADD_PROJECT_TO_DEPARTMENT
    );

    setCreateDepartment(CREATE_ORGANIZATION_UNIT.length);
    setUpdateDepartment(UPDATE_ORGANIZATION_UNIT.length);
    setDeleteDepartment(DELETE_ORGANIZATION_UNIT.length);
    setCreateOrganization(CREATE_ORGANIZATION.length);
    setUpdateOrganization(UPDATE_ORGANIZATION.length);
    setCreateSector(CREATE_SECTOR.length);
    setUpdateSector(UPDATE_SECTOR.length);
    setDeleteSector(DELETE_SECTOR.length);
    setAssignmembertosector(ASSIGN_MEMBER_TO_SECTOR.length);
    setAddprojecttodepartment(ADD_PROJECT_TO_DEPARTMENT.length);

    setAssignmembertodepartment(ASSIGN_MEMBER_TO_SECTOR.length);
  }, [userInfo, permissions]);

  const handleSubtaskAssigneeClick = () => {
    setShowModal(true);
  };

  const classes = useStyles();

  return (
    <div>
      <Helmet>
        <title>PMS - Organizational Structure</title>
      </Helmet>
      <div className=" border-x-4 border-y-4 pb-6 mb-16 ml-auto mt-6 mr-6 overflow-x-auto no-scrollbar">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
        <div className="flex flex-wrap gap-3 px-5 py-5 ">
          <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
            <div className="justify-center items-center px-3 py-1 bg-blue-900 rounded">
              {structureName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="flex-auto my-auto text-xl font-medium text-blue-950">
            {structureName}
          </div>
        </div>

        {/* <div>
        <div className="flex flex-wrap gap-6 items-center mb-4">
          <div className="flex flex-row relative ">
            <div class=" self-center ">
              <TextField
                type="text"
                placeholder="Search by Name"
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
      </div> */}
        {organizationData.length === 0 && createOrganization !== 0 && (
          <div className="flex gap-2 justify-end items-center self-stretch px-3 py-2 rounded-md text-black text-opacity-50">
            <div className="flex mb-7 justify-between">
              <button
                className="flex text-white text-end font-bold py-2 px-4 rounded"
                onClick={() => handleOrganizationAddClick()}
                style={{ backgroundColor: "#082f49" }}
              >
                + Add Organization
              </button>
            </div>
          </div>
        )}

        {organizationData.length !== 0 ? (
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
              {organizationData.map((organizationItem, organizationIndex) => (
                <TreeItem
                  key={organizationItem.id}
                  itemId={organizationItem.id}
                  label={
                    <div className="flex items-center gap-4">
                      <div className="flex flex-row items-center gap-2 self-stretch px-4 py-1.5 my-auto whitespace-nowrap rounded-md cursor-pointer">
                        <span>
                          <img
                            className="w-7 h-7"
                            src={`${BASE_URL}/images/${organizationItem.logo}`}
                            alt="Logo"
                          />
                        </span>
                        <span>{organizationItem.name}</span>
                        {createSector !== 0 && (
                          <div
                            className="flex gap-2 justify-center items-center self-stretch px-3 py-2 rounded-md text-black text-opacity-50 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddSectorClick();
                            }}
                          >
                            <AddCircleOutlineIcon style={{ fontSize: 20 }} />
                            <span>Add Cluster</span>
                          </div>
                        )}
                      </div>

                      {updateOrganization !== 0 && (
                        <div className="cursor-pointer flex gap-2 text-white flex-row relative">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(organizationItem);
                            }}
                            className="text-blue-900 text-opacity-85"
                          >
                            <FaEdit size={19} />
                          </div>
                        </div>
                      )}
                    </div>
                  }
                >
                  {clusterData.map((clusterItem, clusterIndex) => (
                    <TreeItem
                      key={`task-${organizationIndex}-${clusterIndex}`}
                      itemId={`task-${organizationIndex}-${clusterIndex}`}
                      label={
                        <Box className="grid grid-cols-4 py-2  text-sm max-md:flex-wrap max-md:px-5 ml-8">
                          <div className="flex space-x-2 items-center">
                            <div
                              className="text-sm text-black"
                              style={{ wordWrap: "break-word" }}
                              onClick={() =>
                                toggleTask(organizationIndex, clusterIndex)
                              }
                            >
                              <div className="flex flex-row font-normal text-sm items-center gap-2 ">
                                <CircleIcon
                                  style={{ fontSize: 13, opacity: "50%" }}
                                />
                                <span className="font-normal text-sm">
                                  {" "}
                                  {clusterItem.sector.name}
                                </span>
                              </div>
                            </div>
                            {createSector !== 0 && (
                              <div
                                className="flex gap-2 justify-center items-center self-stretch px-3 py-2 rounded-md text-black text-opacity-50 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddDepartmentClick(
                                    clusterItem.sector.sector_id
                                  ); // Pass the sector ID here
                                }}
                              >
                                <AddCircleOutlineIcon
                                  style={{ fontSize: 20 }}
                                />
                                <span>Add Department</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 items-center text-blue-900 text-opacity-50">
                            <AccountCircleIcon />
                            {clusterItem.leader.length !== 0
                              ? clusterItem.leader[0].full_name
                              : "TBA"}
                          </div>

                          <div className="flex text-white flex-row relative justify-center rounded-md">
                            <div className="actions flex flex-row gap-4">
                              {updateSector !== 0 && (
                                <div className=" text-white font-bold py-2  rounded cursor-pointer">
                                  <div
                                    className="text-blue-900"
                                    onClick={() =>
                                      handleClusterEditClick(clusterItem)
                                    }
                                  >
                                    <FaEdit size={18} />
                                  </div>
                                </div>
                              )}
                              {deleteSector !== 0 && (
                                <div className=" text-white font-bold py-2  rounded cursor-pointer">
                                  <div
                                    className="text-red-400 opacity-90"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleClusterDeleteClick(clusterItem);
                                    }}
                                  >
                                    <FaTrash size={15} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Box>
                      }
                    >
                      {clusterItem.sector.Divisions &&
                        clusterItem.sector.Divisions.map(
                          (selectedDepartment, selectedDepartmentIndex) => (
                            <TreeItem
                              style={{ backgroundColor: "#edf4fb" }}
                              key={`subtask-${organizationIndex}-${clusterIndex}-${selectedDepartmentIndex}`}
                              itemId={`subtask-${organizationIndex}-${clusterIndex}-${selectedDepartmentIndex}`}
                              label={
                                <Box className="flex flex-row gap-36 py-4 text-sm max-md:flex-wrap max-md:px-5 ml-5">
                                  <div className="flex my-auto">
                                    <div className="taskname flex flex-col gap-1 py-0.5 overflow-hidden">
                                      <div
                                        className="text-sm text-black"
                                        style={{ wordWrap: "break-word" }}
                                        onClick={() =>
                                          toggleSubtask(
                                            organizationIndex,
                                            clusterIndex,
                                            selectedDepartmentIndex
                                          )
                                        }
                                      >
                                        <div className="flex flex-row gap-2  ">
                                          <span>
                                            {" "}
                                            {selectedDepartmentIndex + 1}.
                                          </span>
                                          <span>
                                            {" "}
                                            {selectedDepartment.name}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex gap-6 text-blue-900 text-opacity-50 items-center">
                                    <div className="flex gap-2">
                                      <AccountCircleIcon />
                                      {selectedDepartment.Users &&
                                      selectedDepartment.Users.length !== 0
                                        ? selectedDepartment.Users.some(
                                            (user) => user.is_division_leader
                                          )
                                          ? selectedDepartment.Users.map(
                                              (user) =>
                                                user.is_division_leader
                                                  ? user.full_name
                                                  : null
                                            ).filter((name) => name !== null)
                                          : "TBA"
                                        : "TBA"}
                                    </div>

                                    {addprojecttodepartment !== 0 && (
                                      <div className=" text-white py-2  rounded cursor-pointer">
                                        <div
                                          className="text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(
                                              `Department ID: ${selectedDepartment.division_id}`
                                            );
                                            handleAddProjecttodepartment(
                                              selectedDepartment
                                            );
                                          }}
                                        >
                                          <div className="text-black text-opacity-50 ">
                                            <AddCircleOutlineIcon
                                              style={{ fontSize: 20 }}
                                            />
                                            <span className="ml-1">
                                              Add project{" "}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {assignmembertodepartment !== 0 && (
                                      <div className=" text-white py-2  rounded cursor-pointer">
                                        <div
                                          className="text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            console.log(
                                              `Department Name: ${selectedDepartment.name}`
                                            );
                                            handleSectorAssignMemberClick(
                                              selectedDepartment
                                            );
                                          }}
                                        >
                                          <div className="text-black text-opacity-50">
                                            <PersonAddAlt1Icon
                                              style={{ fontSize: 20 }}
                                            />
                                            <span className="ml-1">
                                              Assign Members
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex text-white flex-row relative justify-center rounded-md">
                                    <div className="actions flex flex-row gap-4">
                                      {updateDepartment !== 0 && (
                                        <div className="text-white font-bold py-2 rounded pointer-events-auto">
                                          <div
                                            className="text-blue-900"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              console.log(
                                                `Department name: ${selectedDepartment.name}`
                                              );
                                              handleEditDepartmentClick(
                                                selectedDepartment
                                              );
                                            }}
                                          >
                                            <FaEdit size={18} />
                                          </div>
                                        </div>
                                      )}
                                      {deleteDepartment !== 0 && (
                                        <div className="text-white font-bold py-2 rounded pointer-events-auto">
                                          <div
                                            className="text-red-500"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteDepartmentClick(
                                                selectedDepartment
                                              );
                                            }}
                                          >
                                            <FaTrash size={15} />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </Box>
                              }
                            />
                          )
                        )}
                    </TreeItem>
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

        {organizationaddModalOpen && (
          <div className="fixed  top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-fit h-fit p-5 rounded-md relative">
              <div
                className="close cursor-pointer text-end mr-12 mt-5 "
                onClick={handleOrganizationAddModalClose}
              >
                {" "}
                X
              </div>
              <Addorganization
                handleCloseModal={handleOrganizationAddModalClose}
                handlefetchOrganization={fetchData}
              />
            </div>
          </div>
        )}

        {editModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white  rounded-md relative">
              <div
                className="close cursor-pointer text-end mr-8 mt-5 "
                onClick={handleEditModalClose}
              >
                {" "}
                X
              </div>
              <Editorganization
                leader={leader}
                selectedRow={selectedRow}
                handleCloseModal={handleEditModalClose}
                handlefetchOrganization={fetchData}
              />
            </div>
          </div>
        )}
        {addSectorModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-7  rounded-md relative">
              <div
                className=" cursor-pointer text-end mr-5  "
                onClick={handleAddSectorModalClose}
              >
                {" "}
                X
              </div>
              <SectorAdd
                handlefetchSectors={fetchClusters}
                handleCloseModal={handleAddSectorModalClose}
              />
            </div>
          </div>
        )}
        {addDepartmentModalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleAddDepartmentModalClose}
          >
            <div
              className="bg-white px-12 w-fit rounded-md "
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className=" cursor-pointer text-end  mt-4  "
                onClick={handleAddDepartmentModalClose}
              >
                {" "}
                X
              </div>
              <DivisionAdd
                handlefetchClusters={fetchClusters}
                selectedSectorId={selectedSectorId}
                handleCloseModal={handleAddDepartmentModalClose}
              />
            </div>
          </div>
        )}
        {editClusterModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-md relative">
              <div
                className="close cursor-pointer text-end mr-12 mt-5 "
                onClick={handleEditClusterModalClose}
              >
                {" "}
                X
              </div>
              <SectorEdit
                handlefetchClusters={fetchClusters}
                handleCloseModal={handleEditClusterModalClose}
                selectedRow={selectedRow}
              />
            </div>
          </div>
        )}
        {deleteClusterModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white w-1/2 pt-4 rounded-md relative">
              <div
                className="close cursor-pointer text-end mr-12 "
                onClick={handleClusterDeleteModalClose}
              >
                X
              </div>
              <Sectordelete
                handlefetchClusters={fetchClusters}
                handleDeleteModalClose={handleClusterDeleteModalClose}
                selectedRow={selectedRow}
              />
            </div>
          </div>
        )}
        {editDepartmentModalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleEditDepartmentModalClose}
          >
            <div
              className="bg-white w-fit px-8 rounded-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="close cursor-pointer text-end  mt-5 "
                onClick={handleEditDepartmentModalClose}
              >
                {" "}
                X
              </div>
              <Organizationaluniteditt
                selectedRow={selectedRow}
                selectedDepartmentId={selectedDepartmentId}
                handlefetchOrganizationalunit={fetchClusters}
                handleCloseModal={handleEditDepartmentModalClose}
              />
            </div>
          </div>
        )}
        {deleteDepartmentModalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleDeleteDepartmentModalClose}
          >
            <div
              className="bg-white w-fit pt-4 rounded-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="close cursor-pointer text-end mr-12 "
                onClick={handleDeleteDepartmentModalClose}
              >
                X
              </div>
              <OrganizationalUnitdelete
                selectedRow={selectedRow}
                handlefetchClusters={fetchClusters}
                handleDeleteDepartmentModalClose={
                  handleDeleteDepartmentModalClose
                }
              />
            </div>
          </div>
        )}
        {addprojecttodepartmentOpen === !0 && (
          <div
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleAddProjecttodepartmentModalClose}
          >
            <div
              className="bg-white h-5/6 overflow-y-scroll w-fit p-4 pl-8 pb-10 rounded-md "
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="close flex justify-end cursor-pointer  "
                onClick={handleAddProjecttodepartmentModalClose}
              >
                X
              </div>
              <Addprojecttodepartment
                selectedRow={selectedRow}
                selectedDepartmentId={selectedDepartmentId}
                handleAddProjecttodepartmentModalClose={
                  handleAddProjecttodepartmentModalClose
                }
              />
            </div>
          </div>
        )}
        {sectorAssignmemberModalOpen && (
          <div
            className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
            onClick={handleSectorAssignmemberModalClose}
          >
            <div
              className="bg-white w-fit p-4 pl-8 pb-10 rounded-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="close flex justify-end cursor-pointer  "
                onClick={handleSectorAssignmemberModalClose}
              >
                X
              </div>
              <Departmentassignmembers
                selectedRow={selectedRow}
                handlefetchOrganizationalunit={fetchClusters}
                handleSectorAssignmemberModalClose={
                  handleSectorAssignmemberModalClose
                }
                selectedDepartmentId={selectedDepartmentId}
              />
            </div>
          </div>
        )}

        {/* {viewModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleViewModalClose}
        >
          <div
            className="bg-white w-fit rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 mt-5"
              onClick={handleViewModalClose}
            >
              X
            </div>
            <SectorDetail row={selectedRow} />
          </div>
        </div>
      )} */}
      </div>
    </div>
  );
};

export default Structure;
