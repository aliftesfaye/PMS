import { Card, Typography } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, TextField } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";

import React, { useEffect, useRef, useState } from "react";
import member10 from "../Assets/member10.png";
import apiService from "../services/apiServices";
import Addmembertoproject from "./Addmembertoproject.jsx";
import Assign from "./Assign.jsx";

import "./Tasks.css";
import View from "./Viewprofile.jsx";

const Try2 = ({ selectedProjectInfo }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const assignModalRef = useRef(null);
  const viewModalRef = useRef(null);
  const [noActivity, setNoActivity] = useState("loading ...");
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState([]);
  const [activityLength, setActivityLength] = useState();
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState();
  const [totalSubTasks, setTotalSubTasks] = useState();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [onProgressTasks, setOnProgressTasks] = useState([]);

  const [showViewModal, setShowViewModal] = useState(false);
  const members = [
    {
      name: "Robe Getachew",
      expertise: "React Developer",
      totalTasks: 11,
      assignedTasks: 8,
      completedTasks: 3,
      image: member10,
    },
    {
      name: "Robe Getachew",
      expertise: "React Developer",
      totalTasks: 11,
      assignedTasks: 8,
      completedTasks: 3,
      image: member10,
    },
    {
      name: "Robe Getachew",
      expertise: "React Developer",
      totalTasks: 11,
      assignedTasks: 8,
      completedTasks: 3,
      image: member10,
    },
    {
      name: "Robe Getachew",
      expertise: "React Developer",
      totalTasks: 11,
      assignedTasks: 8,
      completedTasks: 3,
      image: member10,
    },
    {
      name: "Robe Getachew",
      expertise: "React Developer",
      totalTasks: 11,
      assignedTasks: 8,
      completedTasks: 3,
      image: member10,
    },
  ];
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [projectMembers, setProjectMembers] = useState(
    selectedProjectInfo.project_member
  );
  const [memberInfo, setMemberInfo] = useState([]);

  const modalRef = useRef(null);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAssignModal = () => {
    setShowAssignModal(!showAssignModal);
  };
  const toggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      let activityData = await apiService.getAllActivities(
        selectedProjectInfo.project_id,
        userInfo.access_token
      );
      const sortedResponse = activityData.sort((a, b) => {
        if (a.activity.createdAt > b.activity.createdAt) {
          return -1;
        }
      });
      setActivities(sortedResponse);

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
        (data) => data.task_status === "In Progress"
      );

      setOnProgressTasks(on_progress_task);
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

  const handleClickOutsideModal = (e) => {
    const isModalClicked =
      modalRef.current && modalRef.current.contains(e.target);

    if (!isModalClicked) {
      setShowModal(false);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      const allProjectMembers = await apiService.getAllProjectMembers(
        selectedProjectInfo.project_id
      );

      const commonMembers = allProjectMembers.filter((member1) =>
        projectMembers.some((member2) => member1.user_id === member2.user_id)
      );

      const newMemberInfo = [];

      for (const member of commonMembers) {
        const projectMemberSubTasks = await apiService.getAllSubTasksByMember(
          member.project_member_id
        );

        const memberInfo = {
          user_id: member.user_id,
          subTasks: projectMemberSubTasks,
        };
        console.log(projectMemberSubTasks);

        newMemberInfo.push(memberInfo);
      }

      const combinedArray = [];

      newMemberInfo.forEach((obj1) => {
        const matchingObj = projectMembers.find(
          (obj2) => obj1.user_id === obj2.user_id
        );
        if (matchingObj) {
          combinedArray.push({ ...obj1, ...matchingObj });
        }
      });
      setMemberInfo(combinedArray);
      memberInfo.length === 0
        ? setNoActivity("No Member Found")
        : setNoActivity("loading ...");
    } catch (error) {
      console.error("Error fetching users and document types:", error);
    }
  };

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }

    fetchUsers();
    fetchUsers();
    fetchActivities();
    fetchProjectMembers();
    fetchPermissions();
  }, []);

  const filteredMembers = memberInfo.filter((member) =>
    member.UserRoleToUser.full_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24">
      <Helmet>
        <title>{selectedProjectInfo.name} - Members</title>
      </Helmet>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>
      <div className="flex gap-3 px-5 py-5 ">
        <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
          <div
            className="justify-center items-center px-3 py-1rounded"
            style={{ backgroundColor: "#082f49" }}
          >
            {selectedProjectInfo.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-auto my-auto text-xl font-medium text-blue-950">
          {selectedProjectInfo.name}
        </div>
      </div>
      <div className="flex-auto my-auto px-5 py-2 text-xl font-medium text-blue-950">
        List of Members
      </div>
      <div className=" flex items-center mb-4 justify-between  mt-8">
        <div class=" self-center ">
          <TextField
            type="text"
            placeholder="Search members by name"
            size="small"
            class="bg-white rounded-lg "
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
        {/* <button onClick={toggleModal} className="text-white ">
          +Add New Member
        </button> */}
      </div>
      <div
        class={
          projectMembers.length !== 0
            ? "flex flex-wrap"
            : "flex flex-wrap justify-center"
        }
      >
        {projectMembers.length !== 0 ? (
          filteredMembers.map((member, index) => {
            {
              return (
                <Card
                  className="border-x border-y rounded-full m-1 "
                  key={index}
                >
                  <div className=" rounded-lg shadow-lg flex flex-col  px-5 py-5 text-xs font-semibold border-0 border-solid border-black border-opacity-50 max-w-[350px] text-slate-900">
                    <div className="flex gap-3 justify-between">
                      {/* <img
                        loading="lazy"
                        src={member.image}
                        alt={member.name}
                        className="shrink-0 my-auto rounded-full aspect-square"
                      />
                      <div className="border-l border-gray-300 h-52" /> */}
                      <div className="flex flex-col m-4">
                        <div className="text-xs">
                          {member.UserRoleToUser.full_name}
                        </div>
                        <div className="w-fit p-1 bg-sky-200 rounded-md">
                          {member.UserRoleToUser.email}
                        </div>
                        <div className="border-b border-gray-300 mt-2"></div>
                        {member && (
                          <div className="mt-6">
                            Total Sub Tasks : {member.subTasks.totalCount}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2 whitespace-nowrap items-center">
                          <ListAltIcon className="shrink-0 aspect-[1.22] text-orange-500 w-[11px]" />
                          {member && (
                            <div className="flex-auto">
                              {member.subTasks.InprgressCount}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 mt-2 whitespace-nowrap items-center">
                          <CheckCircleIcon className="shrink-0 w-2.5 aspect-square text-green-500" />
                          <div className="flex-auto my-auto">
                            {member.subTasks.completedCount}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2 whitespace-nowrap items-center">
                          <HistoryToggleOffIcon className="shrink-0 w-2.5 aspect-square text-gray-500" />
                          <div className="flex-auto my-auto">
                            {member.subTasks.pendingCount}
                          </div>
                        </div>
                        {/* <div className="flex gap-4 mt-3.5 text-white">
                          <div className="flex flex-col cursor-pointer  p-2 whitespace-nowrap bg-sky-500 rounded">
                            <div
                              onClick={toggleAssignModal}
                              className=" flex gap-1"
                            >
                              <img
                                loading="lazy"
                                src={assign}
                                alt="Assign Icon"
                                className="shrink-0 w-4 aspect-square fill-white"
                              />
                              <div>Assign</div>
                            </div>
                          </div>
                          <div className="flex flex-col cursor-pointer justify-center p-2 bg-sky-500 rounded w-28">
                            <div
                              onClick={toggleViewModal}
                              className="flex gap-2"
                            >
                              <img
                                loading="lazy"
                                src={view}
                                alt="View Icon"
                                className="shrink-0 aspect-[1.1] fill-white w-[11px]"
                              />
                              <div className="my-auto">View Profile</div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
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

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white w-2/3   p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-24 cursor-pointer text-gray-500"
              onClick={toggleModal}
            >
              X
            </span>
            <Addmembertoproject onCancel={toggleModal} />
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-2/3 p-8 rounded-md relative">
            <span
              className="absolute top-2 right-8 cursor-pointer text-gray-500"
              onClick={toggleAssignModal}
            >
              X
            </span>
            <Assign onCancel={toggleAssignModal} />
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed top-0 h-full left-0 w-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-3/5 p-6  rounded-md ">
            <span
              className=" right-8 flex justify-end mr-6 cursor-pointer text-gray-500"
              onClick={toggleViewModal}
            >
              X
            </span>
            <View />
          </div>
        </div>
      )}
    </div>
  );
};

export default Try2;
