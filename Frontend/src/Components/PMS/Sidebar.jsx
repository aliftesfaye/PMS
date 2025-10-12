import AccountBoxIcon from "@mui/icons-material/AccountBox";
import RoleIcon from "@mui/icons-material/AdminPanelSettings";
import SectorIcon from "@mui/icons-material/Apartment";
import ProjectGanttIcon from "@mui/icons-material/ArticleOutlined";
import ProjectIcon from "@mui/icons-material/Assignment";
import MilestoneIcon from "@mui/icons-material/Ballot";
import OrgIcon from "@mui/icons-material/Business";
import ProjectCalendarIcon from "@mui/icons-material/CalendarMonth";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Flag from "@mui/icons-material/Flag";
import ProjectMembersIcon from "@mui/icons-material/Groups";
import HomeIcon from "@mui/icons-material/Home";
import ProjectDocsIcon from "@mui/icons-material/InsertDriveFile";
import OrgUnitIcon from "@mui/icons-material/MapsHomeWork";
import UsersIcon from "@mui/icons-material/Person";
import TrashIcon from "@mui/icons-material/Recycling";
import ProjectBoardIcon from "@mui/icons-material/ViewKanban";
import ProjectWorkspaceIcon from "@mui/icons-material/ViewListOutlined";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";

import { Typography } from "@mui/material";
import { PERMISSIONS } from "../../config";

const Sidebar = (props) => {
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [viewOrganization, setViewOrganization] = useState(0);
  const [viewStructure, setViewStructure] = useState(0);
  const [viewStructure2, setViewStructure2] = useState(0);
  const [viewSector, setViewSector] = useState(0);
  const [viewOrganizationalUnit, setViewOrganizationalUnit] = useState(0);
  const [viewProjects, setViewProjects] = useState(0);
  const [viewUsers, setViewUsers] = useState(0);
  const [viewProfile, setViewProfile] = useState(0);
  const [viewRole, setViewRole] = useState(0);
  const [viewActivity, setViewActivity] = useState(0);
  const [viewWorkspace, setViewWorkspace] = useState(0);
  const [viewMilestone, setViewMilestone] = useState(0);
  const [viewHome, setViewHome] = useState(0);
  const [viewAdminDashboard, setViewAdminDashboard] = useState(0);
  const [viewProjectDashboard, setViewProjectDashboard] = useState(0);
  const [viewTeam, setViewTeam] = useState(0);
  const [viewProjectMembersProfile, setViewProjectMembersProfile] = useState(0);
  const [viewTrash, setViewTrash] = useState(0);

  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  const [projectPermissions, setProjectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });

  const [selectedProjectInfo, setSelectedProjectInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("selectedProjectInfo")) || {};
  });
  const [showDropdown, setShowDropdown] = useState(() => {
    return JSON.parse(localStorage.getItem("showDropdown")) || false;
  });

  const [isProjectSelected, setIsProjectSelected] = useState(() => {
    return JSON.parse(localStorage.getItem("isProjectSelected")) || false;
  });

  const [selectedLink, setSelectedLink] = useState(() => {
    const link = parseInt(localStorage.getItem("selectedLink"));
    return isNaN(link) ? 0 : link;
  });

  useEffect(() => {
    const storedSelectedLink = parseInt(localStorage.getItem("selectedLink"));
    const storedIsProjectSelected = JSON.parse(
      localStorage.getItem("isProjectSelected")
    );

    if (!isNaN(storedSelectedLink)) {
      setSelectedLink(storedSelectedLink);
    }
    if (storedIsProjectSelected !== null) {
      setIsProjectSelected(storedIsProjectSelected);
    }
    const storedSelectedProject = JSON.parse(
      localStorage.getItem("selectedProjectInfo")
    );
    if (storedSelectedProject) {
      setSelectedProjectInfo(storedSelectedProject);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedLink", selectedLink);
  }, [selectedLink]);

  useEffect(() => {
    localStorage.setItem("isProjectSelected", isProjectSelected);
  }, [isProjectSelected]);

  useEffect(() => {
    localStorage.setItem(
      "selectedProjectInfo",
      JSON.stringify(props.selectedProjectInfo)
    );
  }, [props.selectedProjectInfo]);

  useEffect(() => {
    localStorage.setItem("showDropdown", JSON.stringify(showDropdown));
  }, [showDropdown]);

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
    fetchPermissions();
    fetchProjectPermissions();
    const GET_ORGANIZATION = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ORGANIZATION
    );

    const GET_STRUCTURE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_STRUCTURE
    );
    const GET_STRUCTURE2 = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_STRUCTURE2
    );

    const GET_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_SECTOR
    );

    const GET_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ORGANIZATION_UNIT
    );

    const GET_ALL_PROJECT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_PROJECT
    );

    const GET_ALL_USER = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_USER
    );

    const GET_PROFILE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_PROFILE
    );

    const GET_ALL_ROLE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_ROLE
    );

    const GET_ALL_ACTIVITY = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_ACTIVITY
    );

    const GET_WORKSPACE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_WORKSPACE
    );
    const GET_MILESTONE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_MILESTONE
    );

    const GET_HOME = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_HOME
    );

    const GET_ADMIN_DASHBOARD = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ADMIN_DASHBOARD
    );

    const GET_PROJECT_DASHBOARD = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_PROJECT_DASHBOARD
    );

    const GET_TEAM = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_TEAM
    );

    const GET_PROJECT_MEMBERS_PROFILE = projectPermissions.filter(
      (permission) => permission.name === PERMISSIONS.VIEW_PROJECT_MEMBERS
    );
    const GET_TRASH = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_TRASH
    );

    setViewOrganization(GET_ORGANIZATION.length);
    setViewStructure(GET_STRUCTURE.length);
    setViewStructure2(GET_STRUCTURE2.length);
    setViewSector(GET_SECTOR.length);
    setViewOrganizationalUnit(GET_ORGANIZATION_UNIT.length);
    setViewProjects(GET_ALL_PROJECT.length);
    setViewUsers(GET_ALL_USER.length);
    setViewProfile(GET_PROFILE.length);
    setViewRole(GET_ALL_ROLE.length);
    setViewActivity(GET_ALL_ACTIVITY.length);
    setViewWorkspace(GET_WORKSPACE.length);
    setViewMilestone(GET_MILESTONE.length);
    setViewHome(GET_HOME.length);
    setViewAdminDashboard(GET_ADMIN_DASHBOARD.length);
    setViewProjectDashboard(GET_PROJECT_DASHBOARD.length);
    setViewTeam(GET_TEAM.length);
    setViewProjectMembersProfile(GET_PROJECT_MEMBERS_PROFILE.length);
    setViewTrash(GET_TRASH.length);
  }, [userInfo, permissions, projectPermissions]);

  const handleProjectSelection = (project) => {
    props.setSelectedProjectInfo(project);
    setIsProjectSelected(true);
    localStorage.setItem("selectedProjectInfo", JSON.stringify(project));
  };

  const handleDropdownLinkClick = (index) => {
    setSelectedLink(index);
    setShowDropdown(true);
  };

  const handleLinkClick = (index) => {
    const projectRelatedLinks = [10, 11, 12, 13, 14, 17];

    if (index === 5) {
      setShowDropdown(!showDropdown);
      setSelectedLink(6); // Set the default view to "Organization"
      // setIsProjectSelected(false); // Ensure project-related components are hidden
      // localStorage.setItem("isProjectSelected", false); // Persist the state
    } else if (index === 1) {
      setSelectedLink(1); // Always keep the Projects link selected
      // setIsProjectSelected(false); // Ensure the project list is shown
      // localStorage.setItem("isProjectSelected", false); // Persist the state
      setShowDropdown(false); // Ensure the Structure dropdown is hidden
    } else {
      setSelectedLink(index);
      setShowDropdown(false); // Ensure the Structure dropdown is hidden
      // Check if the clicked link is project-related, if so keep the dropdown open
      if (projectRelatedLinks.includes(index)) {
        setIsProjectSelected(true); // Keep the project dropdown open
        localStorage.setItem("isProjectSelected", true); // Persist the state
        // Retrieve and set the selected project info
        const selectedProject = JSON.parse(
          localStorage.getItem("selectedProjectInfo")
        );
        if (selectedProject) {
          setSelectedProjectInfo(selectedProject);
        }
      } else {
        setIsProjectSelected(false); // Close the project dropdown when other links are clicked
        localStorage.setItem("isProjectSelected", false); // Persist the state
      }
    }
  };

  const projectRelatedLinks = [10, 11, 12, 13, 14, 17];

  return (
    <div class="overflow-x-auto">
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <div class="no-scrollbar fixed h-screen overflow-x-hidden lg:px-1 py-28 w-1/6 items-center lg:z-40 md:z-40 shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] bg-white">
          {viewHome !== 0 && viewAdminDashboard === 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <HomeIcon />
              <Typography>Home</Typography>
            </div>
          )}
          {viewAdminDashboard !== 0 && viewHome === 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon
                style={{
                  color: `${selectedLink === 0 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Dashboard</Typography>
            </div>
          )}

          {viewAdminDashboard !== 0 && viewHome !== 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon
                style={{
                  color: `${selectedLink === 0 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Dashboard</Typography>
            </div>
          )}

          {/* {(viewOrganization !== 0  || viewOrganizationalUnit !== 0) && (
            <div
              className={`link ${selectedLink === 5 || selectedLink === 6 || selectedLink === 7 || selectedLink === 8 ? "selected" : ""}`}
              onClick={() => handleLinkClick(5)}
            >
              <OrgIcon />
              <Typography>Structure</Typography>
              <div class="ml-auto" onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}>
                {showDropdown ? "▲" : "▼"}
              </div>
            </div>
          )} */}

          {showDropdown && (
            <div className="organization-box">
              {viewOrganization !== 0 && (
                <div
                  className={`link ${
                    selectedLink === 6
                      ? "selected dropdown-item"
                      : "dropdown-item"
                  }`}
                  onClick={() => handleDropdownLinkClick(6)}
                >
                  <OrgIcon
                    style={{
                      color: `${selectedLink === 6 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography fontSize={13}>Organization</Typography>
                </div>
              )}

              {viewSector !== 0 && (
                <div
                  className={`link ${
                    selectedLink === 7
                      ? "selected dropdown-item"
                      : "dropdown-item"
                  }`}
                  onClick={() => handleDropdownLinkClick(7)}
                >
                  <SectorIcon
                    style={{
                      color: `${selectedLink === 7 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography fontSize={13}>Sectors</Typography>
                </div>
              )}
              {viewOrganizationalUnit !== 0 && (
                <div
                  className={`link ${
                    selectedLink === 8
                      ? "selected dropdown-item"
                      : "dropdown-item"
                  }`}
                  onClick={() => handleDropdownLinkClick(8)}
                >
                  <OrgUnitIcon
                    style={{
                      color: `${selectedLink === 8 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography fontSize={13}>Department</Typography>
                </div>
              )}
            </div>
          )}
          {viewStructure2 !== 0 && (
            <div
              className={`link ${selectedLink === 18 ? "selected" : ""}`}
              onClick={() => handleLinkClick(18)}
            >
              <OrgIcon
                style={{
                  color: `${selectedLink === 18 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Structure</Typography>
            </div>
          )}

          {viewRole !== 0 && (
            <div
              className={`link ${selectedLink === 4 ? "selected" : ""}`}
              onClick={() => handleLinkClick(4)}
            >
              <RoleIcon
                style={{
                  color: `${selectedLink === 4 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Roles</Typography>
            </div>
          )}

          {viewUsers !== 0 && (
            <div
              className={`link ${selectedLink === 3 ? "selected" : ""}`}
              onClick={() => handleLinkClick(3)}
            >
              <UsersIcon
                style={{
                  color: `${selectedLink === 3 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Members</Typography>
            </div>
          )}
          {viewProfile !== 0 && (
            <div
              className={`link ${selectedLink === 16 ? "selected" : ""}`}
              onClick={() => handleLinkClick(16)}
            >
              <AccountBoxIcon
                style={{
                  color: `${selectedLink === 16 ? "#fff" : "#082f49"}`,
                }}
              />
              <Typography>Profile</Typography>
            </div>
          )}

          <div
            className={`link ${selectedLink === 1 ? "selected" : ""}`}
            onClick={() => handleLinkClick(1)}
          >
            <ProjectIcon
              style={{
                color: `${selectedLink === 1 ? "#fff" : "#082f49"}`,
              }}
            />
            <Typography>Projects</Typography>
          </div>

          {/* {viewTeam !== 0 && (
            <div class="flex p-1 gap-3 ml-2">
              <TeamIcon style={{ color: "#082f49" }} />
              <Typography>Teams</Typography>
            </div>
          )} */}
          {viewTrash !== 0 && (
            <div>
              <div
                className={`link ${selectedLink === 9 ? "selected" : ""}`}
                onClick={() => handleLinkClick(9)}
              >
                <TrashIcon
                  style={{
                    color: `${selectedLink === 9 ? "#fff" : "#082f49"}`,
                  }}
                />
                <Typography>Trash</Typography>
              </div>

              {/* <div
                class="flex px-1 gap-3 ml-2"

                // className={`link ${selectedLink === 15 ? "selected" : ""}`}
                //   onClick={() => handleLinkClick(15)}
              >
                <SettingsIcon style={{ color: "#082f49" }} />
                <Typography>Settings</Typography>
              </div> */}
            </div>
          )}
          {isProjectSelected && (
            <div>
              <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <div class="text-center py-5 flex flex-row items-center">
                <span class="box-border h-8 w-8 py-1 m-2 border-2  inline-block bg-gray-300 rounded-lg">
                  {props.selectedProjectInfo &&
                    props.selectedProjectInfo.name.charAt(0)}
                </span>
                <Typography class="text-lg font-semibold">
                  {props.selectedProjectInfo && props.selectedProjectInfo.name}
                </Typography>
              </div>
              {viewProjectDashboard !== 0 && (
                <div
                  className={`link ${selectedLink === 10 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(10)}
                >
                  <DashboardIcon
                    style={{
                      color: `${selectedLink === 10 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography>Dashboard</Typography>
                </div>
              )}
              {viewActivity !== 0 && (
                <div
                  className={`link ${selectedLink === 11 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(11)}
                >
                  <MilestoneIcon
                    style={{
                      color: `${selectedLink === 11 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography>Activities</Typography>
                </div>
              )}
              {viewProjectMembersProfile !== 0 && (
                <div
                  className={`link ${selectedLink === 12 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(12)}
                >
                  <ProjectMembersIcon
                    style={{
                      color: `${selectedLink === 12 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography>Members</Typography>
                </div>
              )}

              {viewWorkspace !== 0 && (
                <div
                  className={`link ${selectedLink === 13 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(13)}
                >
                  <ProjectWorkspaceIcon
                    style={{
                      color: `${selectedLink === 13 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography>Workspace</Typography>
                </div>
              )}
              {viewMilestone !== 0 && (
                <div
                  className={`link ${selectedLink === 17 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(17)}
                >
                  <Flag
                    style={{
                      color: `${selectedLink === 17 ? "#fff" : "#082f49"}`,
                    }}
                  />
                  <Typography>Milestone</Typography>
                </div>
              )}
              <div class="flex p-1 gap-5 ml-1">
                <ProjectCalendarIcon style={{ color: "#082f49" }} />
                <Typography>Calendar</Typography>
              </div>
              <div class="flex p-1 gap-5 ml-1 my-2">
                <ProjectGanttIcon style={{ color: "#082f49" }} />
                <Typography>Gantt</Typography>
              </div>
              <div
                className={`link ${selectedLink === 14 ? "selected" : ""}`}
                onClick={() => handleLinkClick(14)}
                class="flex p-1 gap-5 ml-1"
              >
                <ProjectDocsIcon
                  style={{
                    color: `${selectedLink === 14 ? "#fff" : "#082f49"}`,
                  }}
                />
                <Typography>Docs</Typography>
              </div>
              <div class="flex p-1 gap-5 ml-1 my-2">
                <ProjectBoardIcon style={{ color: "#082f49" }} />
                <Typography>Boards</Typography>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default Sidebar;
