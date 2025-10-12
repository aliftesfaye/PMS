import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";

import ListAltIcon from "@mui/icons-material/ListAlt";
import { LinearProgress } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import PuffLoader from "react-spinners/ClipLoader";
import emailIcon from "../Assets/email.png";
import apiService from "../services/apiServices";

const Userprofile = (props) => {
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalSubTasks, setTotalSubTasks] = useState();
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
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "Completed") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
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
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "Pending") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
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
                  // Check if the subtask is completed
                  if (subtask.subtask_status === "In Progress") {
                    return subtaskSum + 1; // Increment the count if completed
                  } else {
                    return subtaskSum; // Otherwise, return the current count
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

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative">
      <Helmet>
        <title>PMS - Profile</title>
      </Helmet>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <PuffLoader color="#fff" />
      </Backdrop>
      <div className="flex flex-col mt-24 pr-9 pl-2 rounded-2xl md:ml-2 ">
        <div className="title-profile-view mb-4 text-2xl font-bold text-blue-950">
          User profile
        </div>
        <div className=" ">
          <div className="  flex  gap-8 max-md:flex-col max-md:gap-0">
            <div className="workedon-and-user-profile-container w-2/5 h-fit  flex flex-col max-md:ml-0 max-md:w-full ">
              <div className="flex  flex-col max-md:mt-9">
                <div className="profile-container-box flex flex-col py-5 mt-3 h-full rounded-2xl border-x-2 border-y-2 border-gray-200">
                  <div className="profile-cont flex pr-1.5">
                    <div className="right-side ml-4 flex flex-col justify-center items-center">
                      <AccountCircleIcon
                        className="rounded-full"
                        fontSize="large"
                        style={{ width: "100px", height: "100px" }}
                      />
                    </div>
                    <div className="border-l ml-5 border-gray-300"></div>

                    <div
                      className="left-side ml-4 flex flex-col flex-nowrap w-full overflow-x-auto"
                      style={{
                        maxWidth: "calc(100% - 150px)",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      <div className="Fullname text-base whitespace-nowrap">
                        {userInfo.foundUser.full_name}
                      </div>

                      <div className="email mb-1 mt-3 flex gap-1 items-center text-black whitespace-nowrap">
                        <img
                          loading="lazy"
                          src={emailIcon}
                          alt=""
                          className="mt-2"
                        />
                        <div>{userInfo.foundUser.email}</div>
                      </div>

                      <div className="border-t mt-5 border-gray-300"></div>

                      <div className="total-task mt-2 whitespace-nowrap">
                        Total tasks {totalSubtasksLength}
                      </div>

                      <div className="flex gap-2 mt-2 items-center whitespace-nowrap">
                        <CheckCircleIcon className="shrink-0 w-2.5 aspect-square text-green-500" />
                        <div className="flex-auto my-auto">
                          {totalCompletedSubtasksLength}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2 items-center whitespace-nowrap">
                        <HistoryToggleOffIcon className="shrink-0 w-2.5 aspect-square text-gray-500" />
                        <div className="flex-auto my-auto">
                          {totalPendingSubtasksLength}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-2 items-center whitespace-nowrap">
                        <ListAltIcon className="shrink-0 aspect-[1.22] text-orange-500 w-[11px]" />
                        <div className="flex-auto my-auto">
                          {totalInProgressSubtasksLength}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="workedon-container-box flex  flex-col py-1 mt-5 bg-white rounded-2xl border-solid  max-md:px-5 border-x-2 border-y-2 border-gray-200">
                  <div className="workedon-titl text-xl ml-6 font-bold text-blue-950">
                    Worked on
                  </div>
                  <div className="relative">
                    {loadingProjects && (
                      <LinearProgress
                        color="primary"
                        className="absolute top-0 left-0 right-0"
                      />
                    )}
                    <div className="content">
                      <div
                        className={`workedon-container ${
                          projects && projects.length > 4
                            ? "   overflow-y-auto"
                            : ""
                        }   flex flex-col px-2  ml-6 mt-2.5 mr-4 bg-white rounded-lg border-0 border-solid h-64  shadow-sm border-black border-opacity-50`}
                      >
                        {projects &&
                          projects.map((project, index) => (
                            <div key={index} className="flex gap-2">
                              <div className="flex flex-col justify-center mt-1 text-lg font-semibold text-white whitespace-nowrap">
                                <div className="initial pl-2 mb-3 justify-center items-center w-7 h-7 rounded bg-slate-500">
                                  {project.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="project-title flex-1 my-auto text-xs font-medium text-black">
                                {project.name.charAt(0).toUpperCase() +
                                  project.name.slice(1).toLowerCase()}
                              </div>
                              <div className="project-title flex-1 my-auto text-xs font-medium text-black">
                                {project.overall_progress}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 h-screen   w-2/5  max-md:ml-0 max-md:w-full">
              <div className="currenttask-box flex flex-col h-fit px-9 py-5 mt-3 rounded-2xl border-solid max-md:px-5 border-x-2 border-y-2 border-gray-200 mb-36 overflow-y-auto">
                <div className="text-xl font-bold text-blue-950">
                  Current Sub Tasks
                </div>
                <div className="relative">
                  {loadingProjects && (
                    <LinearProgress
                      color="primary"
                      className="absolute top-0 left-0 right-0"
                    />
                  )}
                  <div className="content">
                    <div>
                      {projectsWithSubtasks.map((project, index) => (
                        <div
                          key={project.project_id}
                          className="project-container-box  flex flex-col px-1 py-5 mt-2.5  bg-white rounded-lg border-solid shadow-sm border-black border-opacity-50"
                        >
                          {project.activity.map((activity) => (
                            <div key={activity.activity_id}>
                              {activity.Task.map((task) => (
                                <div key={task.task_id}>
                                  {task.subTask.map((subTask, index) => (
                                    <div
                                      key={index}
                                      className="flex gap-24 mb-4 justify-between px-0.5"
                                    >
                                      <div className="flex gap-2">
                                        <div className="flex flex-col text-lg font-semibold text-white whitespace-nowrap">
                                          <div className="initial px-2 justify-center items-center bg-blue-600 rounded-sm">
                                            {subTask.name
                                              .charAt(0)
                                              .toUpperCase()}
                                          </div>
                                        </div>
                                        <div className="project-title text-xs font-medium text-black">
                                          {subTask.name
                                            .charAt(0)
                                            .toUpperCase() +
                                            subTask.name.slice(1).toLowerCase()}
                                        </div>
                                      </div>
                                      <div className="px-2 py-2 text-xs font-medium whitespace-nowrap  rounded-2xl">
                                        {subTask.subtask_status}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ))}

                          <div className="milestone justify-center w-fit px-1.5 py-1.5 mt-6 text-base  font-semibold bg-sky-200 rounded-md inline-block text-slate-900">
                            {project.name.charAt(0).toUpperCase() +
                              project.name.slice(1).toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
