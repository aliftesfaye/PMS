import AccountBoxIcon from "@mui/icons-material/AccountBox";
import RoleIcon from "@mui/icons-material/AdminPanelSettings";
import SectorIcon from "@mui/icons-material/Apartment";
import ProjectIcon from "@mui/icons-material/Assignment";
import MilestoneIcon from "@mui/icons-material/Ballot";
import DashboardIcon from "@mui/icons-material/Dashboard";
import OrgIcon from "@mui/icons-material/Domain";
import Flag from "@mui/icons-material/Flag";
import OrgUnitIcon from "@mui/icons-material/Group";
import ProjectMembersIcon from "@mui/icons-material/Groups";
import ProjectDocsIcon from "@mui/icons-material/InsertDriveFile";
import UsersIcon from "@mui/icons-material/Person";
import TrashIcon from "@mui/icons-material/Recycling";
import ProjectWorkspaceIcon from "@mui/icons-material/ViewListOutlined";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { PERMISSIONS } from "../../config";
import Activity from "./Activity";
import AdminDashboard from "./AdminDashboard";
import Dashboard from "./Dashboard";
import Docs from "./Docs";
import Footer from "./Footer";
import Home from "./Home";
import Milestone from "./Milestone";
import Navbar from "./Navbar";
import Organization from "./Organization";
import OrganizationalUnits from "./Organizationalunittry";
import Projects from "./Projects";
import Roles from "./Roles";
import Sectors from "./Sectorstry";
import Settings from "./Settingstry";
import "./Sidebar.css";
import Structure from "./Structure";
import Teams from "./Teams";
import Trash from "./Trashtry";
import Profile from "./Userprofile";
import Users from "./Users";
import Workspace from "./Workspace";
import MembersDashboard from "./ProjectMembers";

const SideandNav = (props) => {
  const navigate = useNavigate();

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

  const [selectedLink, setSelectedLink] = useState(() => {
    const link = parseInt(localStorage.getItem("selectedLink"));
    return isNaN(link) ? 0 : link;
  });
  const [showHomeBox, setShowHomeBox] = useState(true);
  const [showProjectsBox, setShowProjectsBox] = useState(false);
  const [showProfileBox, setShowProfileBox] = useState(false);
  const [showTeamsBox, setShowTeamsBox] = useState(false);
  const [showUserBox, setShowUserBox] = useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showRolesBox, setShowRolesBox] = useState(false);
  const [showStructureBox2, setShowStructureBox2] = useState(false);

  const [showSectorBox, setShowSectorBox] = useState(false);
  const [showTrashBox, setShowTrashBox] = useState(false);
  const [showDashboardBox, setShowDashboardBox] = useState(false);
  const [showMilestoneBox, setShowMilestoneBox] = useState(false);
  const [showMembersBox, setShowMembersBox] = useState(false);
  const [showActivityBox, setShowActivityBox] = useState(false);
  const [showWorkspaceBox, setShowWorkspaceBox] = useState(false);
  const [showDocsBox, setShowDocsBox] = useState(false);
  const [showSettingsBox, setShowSettingsBox] = useState(false);
  const [selectedProjectInfo, setSelectedProjectInfo] = useState(() => {
    const savedProjectInfo = localStorage.getItem("selectedProjectInfo");
    return savedProjectInfo !== null ? JSON.parse(savedProjectInfo) : {};
  });
  const [selectedProfileInfo, setSelectedProfileInfo] = useState({});

  const [isProjectSelected, setIsProjectSelected] = useState(() => {
    const isProjectSelected = localStorage.getItem("isProjectSelected");
    const isProjectSelectedJson = JSON.parse(isProjectSelected);
    return isProjectSelectedJson ? isProjectSelectedJson : false;
  });
  const [check, setCheck] = useState(0);

  const [showOrganizationalUnitBox, setShowOrganizationalUnitBox] =
    useState(false);

  const [showOrganizationBox, setShowOrganizationBox] = useState(false);
  const [showDropdown, setShowDropdown] = useState(() => {
    return JSON.parse(localStorage.getItem("showDropdown")) || false;
  });
  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleDropdownLinkClick = (index) => {
    setSelectedLink(index);
    setShowDropdown(true);
  };

  const handleProjectSelection = (project) => {
    setSelectedProjectInfo(project);
    setIsProjectSelected(true);
    localStorage.setItem("selectedProjectInfo", JSON.stringify(project));
  };
  const handleLinkClick = (index) => {
    setSelectedLink(index);
    localStorage.setItem("selectedLink", index);
    setShowHomeBox(false);
    setShowProjectsBox(false);
    setShowTeamsBox(false);
    setShowUserBox(false);
    setShowRolesBox(false);
    setShowOrganizationBox(false);
    setShowSectorBox(false);
    setShowOrganizationalUnitBox(false);
    setShowDropdown(false);
    setShowTrashBox(false);
    setIsProjectSelected(false);
    setShowDashboardBox(false);
    setShowMilestoneBox(false);
    setShowMembersBox(false);
    setShowWorkspaceBox(false);
    setShowDocsBox(false);
    setShowSettingsBox(false);
    setShowProfileBox(false);
    setShowActivityBox(false);
    setShowStructureBox2(false);

    switch (index) {
      case 0:
        setShowHomeBox(true);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        navigate("/home");
        setCheck(0);
        break;
      case 1:
        setShowHomeBox(false);
        setShowProjectsBox(true);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(1);
        navigate("/home/projects");
        break;
      case 2:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(true);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(2);
        navigate("/home/teams");
        break;
      case 3:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(true);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(3);
        navigate("/home/users");
        break;
      case 4:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(true);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(4);
        navigate("/home/roles");

        break;
      case 5:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(!showDropdown);
        if (check === 0) {
          setShowHomeBox(true);
        } else if (check === 1) {
          setShowProjectsBox(true);
        } else if (check === 2) {
          setShowTeamsBox(true);
        } else if (check === 3) {
          setShowUserBox(true);
        } else if (check === 4) {
          setShowRolesBox(true);
        } else if (check === 6) {
          setShowOrganizationBox(true);
        } else if (check === 7) {
          setShowSectorBox(true);
        } else if (check === 8) {
          setShowOrganizationalUnitBox(true);
        } else if (check === 9) {
          setShowTrashBox(true);
        } else if (check === 10) {
          setShowDashboardBox(true);
        } else if (check === 11) {
          setShowMilestoneBox(true);
        } else if (check === 12) {
          setShowMembersBox(true);
        } else if (check === 13) {
          setShowWorkspaceBox(true);
        } else if (check === 14) {
          setShowDocsBox(true);
        } else if (check === 15) {
          setShowSettingsBox(true);
        } else if (check === 16) {
          setShowProfileBox(true);
        } else if (check === 17) {
          setShowActivityBox(true);
        } else if (check === 18) {
          setShowStructureBox2(true);
        } else {
          setShowHomeBox(false);
          setShowProjectsBox(false);
          setShowProfileBox(false);
          setShowTeamsBox(false);
          setShowUserBox(false);
          setShowRolesBox(false);
          setShowSectorBox(false);
          setShowOrganizationalUnitBox(false);
          setShowTrashBox(false);
          setShowSettingsBox(false);
          setShowDropdown(false);
          setShowDashboardBox(false);
          setShowMilestoneBox(false);
          setShowMembersBox(false);
          setShowWorkspaceBox(false);
          setShowDocsBox(false);
          setShowActivityBox(false);
          setShowStructureBox2(false);
        }

        break;
      case 6:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(true);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(true);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(6);
        break;
      case 7:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(true);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(true);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(7);

        break;
      case 8:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(true);
        setShowDropdown(true);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(8);
        break;
      case 9:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(true);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(9);
        navigate("/home/trash");
        break;
      case 10:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(true);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(10);
        navigate(`${selectedProjectInfo.name}/dashboard`);

        break;
      case 11:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(false);
        setShowMilestoneBox(true);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(11);
        navigate(`${selectedProjectInfo.name}/activities`);
        break;
      case 12:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(true);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(12);
        navigate(`${selectedProjectInfo.name}/members`);
        break;
      case 13:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(true);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(13);
        navigate(`${selectedProjectInfo.name}/workspace`);
        break;

      case 14:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(true);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(14);
        navigate(`${selectedProjectInfo.name}/documents`);
        break;
      case 15:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(true);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(15);
        break;
      case 16:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(true);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(16);
        navigate("/home/profiles");
        break;

      case 17:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(true);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(true);
        setShowStructureBox2(false);
        setCheck(17);
        navigate(`${selectedProjectInfo.name}/milestones`);
        break;

      case 18:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowOrganizationBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(true);
        navigate("/home/structure");
        setCheck(18);
        break;
      default:
        setShowHomeBox(false);
        setShowProjectsBox(false);
        setShowTeamsBox(false);
        setShowUserBox(false);
        setShowRolesBox(false);
        setShowSectorBox(false);
        setShowOrganizationalUnitBox(false);
        setShowDropdown(false);
        setShowTrashBox(false);
        setIsProjectSelected(false);
        setShowDashboardBox(false);
        setShowMilestoneBox(false);
        setShowMembersBox(false);
        setShowWorkspaceBox(false);
        setShowDocsBox(false);
        setShowSettingsBox(false);
        setShowProfileBox(false);
        setShowActivityBox(false);
        setShowStructureBox2(false);
        setCheck(18);
    }
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, color: "#0A5077", fontWeight: 600 }}
      >
        ECSC - PMS
      </Typography>
      <Divider />
      <Box sx={{ display: { xs: "block", sm: "block", md: "none" }, px: 2 }}>
        <div className="space-y-1">
          {viewHome !== 0 && viewAdminDashboard === 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Home</Typography>
            </div>
          )}
          {viewAdminDashboard !== 0 && viewHome === 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Dashboard</Typography>
            </div>
          )}

          {viewAdminDashboard !== 0 && viewHome !== 0 && (
            <div
              className={`link ${selectedLink === 0 ? "selected" : ""}`}
              onClick={() => handleLinkClick(0)}
            >
              <DashboardIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Dashboard</Typography>
            </div>
          )}

          {showDropdown && (
            <div className="organization-box space-y-1">
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
                    className="transition-colors duration-200"
                    style={{
                      color: `${selectedLink === 6 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography fontSize={13} className="font-medium">
                    Organization
                  </Typography>
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
                    className="transition-colors duration-200"
                    style={{
                      color: `${selectedLink === 7 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography fontSize={13} className="font-medium">
                    Sectors
                  </Typography>
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
                    className="transition-colors duration-200"
                    style={{
                      color: `${selectedLink === 8 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography fontSize={13} className="font-medium">
                    Department
                  </Typography>
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
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 18 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Structure</Typography>
            </div>
          )}

          {viewRole !== 0 && (
            <div
              className={`link ${selectedLink === 4 ? "selected" : ""}`}
              onClick={() => handleLinkClick(4)}
            >
              <RoleIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 4 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Roles</Typography>
            </div>
          )}

          {viewUsers !== 0 && (
            <div
              className={`link ${selectedLink === 3 ? "selected" : ""}`}
              onClick={() => handleLinkClick(3)}
            >
              <UsersIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 3 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Users</Typography>
            </div>
          )}
          {viewProfile !== 0 && (
            <div
              className={`link ${selectedLink === 16 ? "selected" : ""}`}
              onClick={() => handleLinkClick(16)}
            >
              <AccountBoxIcon
                className="transition-colors duration-200"
                style={{
                  color: `${selectedLink === 16 ? "#fff" : "#0A5077"}`,
                }}
              />
              <Typography className="font-medium">Profile</Typography>
            </div>
          )}

          <div
            className={`link ${selectedLink === 1 ? "selected" : ""}`}
            onClick={() => handleLinkClick(1)}
          >
            <ProjectIcon
              className="transition-colors duration-200"
              style={{
                color: `${selectedLink === 1 ? "#fff" : "#0A5077"}`,
              }}
            />
            <Typography className="font-medium">Projects</Typography>
          </div>

          {viewTrash !== 0 && (
            <div>
              <div
                className={`link ${selectedLink === 9 ? "selected" : ""}`}
                onClick={() => handleLinkClick(9)}
              >
                <TrashIcon
                  className="transition-colors duration-200"
                  style={{
                    color: `${selectedLink === 9 ? "#fff" : "#0A5077"}`,
                  }}
                />
                <Typography className="font-medium">Trash</Typography>
              </div>
            </div>
          )}
          {isProjectSelected === true && (
            <div className="mt-6">
              <Divider className="my-4" />
              <div className="flex flex-col items-center py-4">
                <div className="flex items-center justify-center w-10 h-10 mb-2 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <span className="text-blue-700 font-semibold">
                    {Object.keys(selectedProjectInfo).length !== 0
                      ? selectedProjectInfo.name.charAt(0).toUpperCase()
                      : ""}
                  </span>
                </div>
                <Typography className="text-sm font-semibold text-gray-800 text-center">
                  {selectedProjectInfo.name}
                </Typography>
              </div>
              <div className="space-y-1">
                {viewProjectDashboard !== 0 && (
                  <div
                    className={`link ${selectedLink === 10 ? "selected" : ""}`}
                    onClick={() => handleLinkClick(10)}
                  >
                    <DashboardIcon
                      className="transition-colors duration-200"
                      style={{
                        color: `${selectedLink === 10 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Dashboard</Typography>
                  </div>
                )}
                {viewActivity !== 0 && (
                  <div
                    className={`link ${selectedLink === 11 ? "selected" : ""}`}
                    onClick={() => handleLinkClick(11)}
                  >
                    <MilestoneIcon
                      className="transition-colors duration-200"
                      style={{
                        color: `${selectedLink === 11 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Activities</Typography>
                  </div>
                )}
                {viewProjectMembersProfile !== 0 && (
                  <div
                    className={`link ${selectedLink === 12 ? "selected" : ""}`}
                    onClick={() => handleLinkClick(12)}
                  >
                    <ProjectMembersIcon
                      className="transition-colors duration-200"
                      style={{
                        color: `${selectedLink === 12 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Members</Typography>
                  </div>
                )}

                {viewWorkspace !== 0 && (
                  <div
                    className={`link ${selectedLink === 13 ? "selected" : ""}`}
                    onClick={() => handleLinkClick(13)}
                  >
                    <ProjectWorkspaceIcon
                      className="transition-colors duration-200"
                      style={{
                        color: `${selectedLink === 13 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Workspace</Typography>
                  </div>
                )}
                {viewMilestone !== 0 && (
                  <div
                    className={`link ${selectedLink === 17 ? "selected" : ""}`}
                    onClick={() => handleLinkClick(17)}
                  >
                    <Flag
                      className="transition-colors duration-200"
                      style={{
                        color: `${selectedLink === 17 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Milestone</Typography>
                  </div>
                )}

                <div
                  className={`link ${selectedLink === 14 ? "selected" : ""}`}
                  onClick={() => handleLinkClick(14)}
                >
                  <ProjectDocsIcon
                    className="transition-colors duration-200"
                    style={{
                      color: `${selectedLink === 14 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Docs</Typography>
                </div>
              </div>
            </div>
          )}
        </div>
      </Box>
    </Box>
  );
  useEffect(() => {
    const storedSelectedLink = parseInt(localStorage.getItem("selectedLink"));

    if (!isNaN(storedSelectedLink)) {
      setSelectedLink(storedSelectedLink);
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
    localStorage.setItem(
      "selectedProjectInfo",
      JSON.stringify(selectedProjectInfo)
    );
  }, [selectedProjectInfo]);

  useEffect(() => {
    localStorage.setItem("showDropdown", JSON.stringify(showDropdown));
  }, [showDropdown]);

  useEffect(() => {
    setShowHomeBox(true);
    setShowProjectsBox(false);
    setShowTeamsBox(false);
    setShowUserBox(false);
    setShowRolesBox(false);
    setShowOrganizationBox(false);
    setShowSectorBox(false);
    setShowOrganizationalUnitBox(false);
    setShowTrashBox(false);
    setShowDropdown(false);
    setShowDashboardBox(false);
    setShowMilestoneBox(false);
    setShowMembersBox(false);
    setShowWorkspaceBox(false);
    setShowDocsBox(false);
    setShowSettingsBox(false);
    setShowProfileBox(false);
    setShowActivityBox(false);
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }

    async function fetchIsProjectSelected() {
      localStorage.setItem("isProjectSelected", isProjectSelected);
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
    fetchIsProjectSelected();

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
      (permission) => permission.name === PERMISSIONS.VIEW_USERS
    );

    const GET_PROFILE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_PROFILE
    );

    const GET_ALL_ROLE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_ROLE
    );

    const GET_ALL_ACTIVITY = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ALL_ACTIVITY
    );

    const GET_WORKSPACE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_WORKSPACE
    );
    const GET_MILESTONE = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_MILESTONE
    );

    const GET_HOME = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_HOME
    );

    const GET_ADMIN_DASHBOARD = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_ADMIN_DASHBOARD
    );

    const GET_PROJECT_DASHBOARD = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_PROJECT_DASHBOARD
    );

    const GET_TEAM = permissions.filter(
      (permission) => permission.name === PERMISSIONS.GET_TEAM
    );

    const GET_PROJECT_MEMBERS_PROFILE = permissions.filter(
      (permission) =>
        permission.name === PERMISSIONS.GET_PROJECT_MEMBERS_PROFILE
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
  }, [userInfo, permissions, projectPermissions, isProjectSelected]);

  const handleDropdownClick = (option) => {
    setShowOrganizationBox(option === "Organization");
    setShowSectorBox(option === "Sector");
    setShowOrganizationalUnitBox(option === "Organizational Unit");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        drawer={drawer}
        handleDrawerToggle={handleDrawerToggle}
        mobileOpen={mobileOpen}
      />

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
          <div className="fixed h-screen w-64 lg:w-72 xl:w-80 overflow-y-auto py-8 px-4 bg-white border-r border-gray-200 shadow-lg shadow-gray-100">
            <div className="space-y-1">
              {viewHome !== 0 && viewAdminDashboard === 0 && (
                <div
                  className={`link group ${
                    selectedLink === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(0)}
                >
                  <DashboardIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Home</Typography>
                </div>
              )}
              {viewAdminDashboard !== 0 && viewHome === 0 && (
                <div
                  className={`link group ${
                    selectedLink === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(0)}
                >
                  <DashboardIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Dashboard</Typography>
                </div>
              )}

              {viewAdminDashboard !== 0 && viewHome !== 0 && (
                <div
                  className={`link group ${
                    selectedLink === 0 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(0)}
                >
                  <DashboardIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 0 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Dashboard</Typography>
                </div>
              )}

              {showDropdown && (
                <div className="organization-box space-y-1 ml-6 border-l border-blue-100 pl-4">
                  {viewOrganization !== 0 && (
                    <div
                      className={`link group ${
                        selectedLink === 6
                          ? "selected dropdown-item"
                          : "dropdown-item"
                      }`}
                      onClick={() => handleDropdownLinkClick(6)}
                    >
                      <OrgIcon
                        className="transition-all duration-200 group-hover:scale-110"
                        style={{
                          color: `${selectedLink === 6 ? "#fff" : "#0A5077"}`,
                        }}
                      />
                      <Typography fontSize={14} className="font-medium">
                        Organization
                      </Typography>
                    </div>
                  )}

                  {viewSector !== 0 && (
                    <div
                      className={`link group ${
                        selectedLink === 7
                          ? "selected dropdown-item"
                          : "dropdown-item"
                      }`}
                      onClick={() => handleDropdownLinkClick(7)}
                    >
                      <SectorIcon
                        className="transition-all duration-200 group-hover:scale-110"
                        style={{
                          color: `${selectedLink === 7 ? "#fff" : "#0A5077"}`,
                        }}
                      />
                      <Typography fontSize={14} className="font-medium">
                        Sectors
                      </Typography>
                    </div>
                  )}
                  {viewOrganizationalUnit !== 0 && (
                    <div
                      className={`link group ${
                        selectedLink === 8
                          ? "selected dropdown-item"
                          : "dropdown-item"
                      }`}
                      onClick={() => handleDropdownLinkClick(8)}
                    >
                      <OrgUnitIcon
                        className="transition-all duration-200 group-hover:scale-110"
                        style={{
                          color: `${selectedLink === 8 ? "#fff" : "#0A5077"}`,
                        }}
                      />
                      <Typography fontSize={14} className="font-medium">
                        Department
                      </Typography>
                    </div>
                  )}
                </div>
              )}
              {viewStructure2 !== 0 && (
                <div
                  className={`link group ${
                    selectedLink === 18 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(18)}
                >
                  <OrgIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 18 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Structure</Typography>
                </div>
              )}

              {viewRole !== 0 && (
                <div
                  className={`link group ${
                    selectedLink === 4 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(4)}
                >
                  <RoleIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 4 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Roles</Typography>
                </div>
              )}

              {viewUsers !== 0 && (
                <div
                  className={`link group ${
                    selectedLink === 3 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(3)}
                >
                  <UsersIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 3 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Users</Typography>
                </div>
              )}
              {viewProfile !== 0 && (
                <div
                  className={`link group ${
                    selectedLink === 16 ? "selected" : ""
                  }`}
                  onClick={() => handleLinkClick(16)}
                >
                  <AccountBoxIcon
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{
                      color: `${selectedLink === 16 ? "#fff" : "#0A5077"}`,
                    }}
                  />
                  <Typography className="font-medium">Profile</Typography>
                </div>
              )}

              <div
                className={`link group ${selectedLink === 1 ? "selected" : ""}`}
                onClick={() => handleLinkClick(1)}
              >
                <ProjectIcon
                  className="transition-all duration-200 group-hover:scale-110"
                  style={{
                    color: `${selectedLink === 1 ? "#fff" : "#0A5077"}`,
                  }}
                />
                <Typography className="font-medium">Projects</Typography>
              </div>

              {viewTrash !== 0 && (
                <div>
                  <div
                    className={`link group ${
                      selectedLink === 9 ? "selected" : ""
                    }`}
                    onClick={() => handleLinkClick(9)}
                  >
                    <TrashIcon
                      className="transition-all duration-200 group-hover:scale-110"
                      style={{
                        color: `${selectedLink === 9 ? "#fff" : "#0A5077"}`,
                      }}
                    />
                    <Typography className="font-medium">Trash</Typography>
                  </div>
                </div>
              )}
              {isProjectSelected === true && (
                <div className="mt-8">
                  <Divider className="my-6" />
                  <div className="flex flex-col items-center py-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 border-2 border-white shadow-md">
                      <span className="text-blue-800 font-bold text-lg">
                        {Object.keys(selectedProjectInfo).length !== 0
                          ? selectedProjectInfo.name.charAt(0).toUpperCase()
                          : ""}
                      </span>
                    </div>
                    <Typography className="text-base font-bold text-gray-900 text-center px-2">
                      {selectedProjectInfo && selectedProjectInfo.name}
                    </Typography>
                    <Typography className="text-xs text-gray-600 mt-1">
                      Active Project
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    {viewProjectDashboard !== 0 && (
                      <div
                        className={`link group ${
                          selectedLink === 10 ? "selected" : ""
                        }`}
                        onClick={() => handleLinkClick(10)}
                      >
                        <DashboardIcon
                          className="transition-all duration-200 group-hover:scale-110"
                          style={{
                            color: `${
                              selectedLink === 10 ? "#fff" : "#0A5077"
                            }`,
                          }}
                        />
                        <Typography className="font-medium">
                          Dashboard
                        </Typography>
                      </div>
                    )}
                    {viewActivity !== 0 && (
                      <div
                        className={`link group ${
                          selectedLink === 11 ? "selected" : ""
                        }`}
                        onClick={() => handleLinkClick(11)}
                      >
                        <MilestoneIcon
                          className="transition-all duration-200 group-hover:scale-110"
                          style={{
                            color: `${
                              selectedLink === 11 ? "#fff" : "#0A5077"
                            }`,
                          }}
                        />
                        <Typography className="font-medium">
                          Activities
                        </Typography>
                      </div>
                    )}
                    {viewProjectMembersProfile !== 0 && (
                      <div
                        className={`link group ${
                          selectedLink === 12 ? "selected" : ""
                        }`}
                        onClick={() => handleLinkClick(12)}
                      >
                        <ProjectMembersIcon
                          className="transition-all duration-200 group-hover:scale-110"
                          style={{
                            color: `${
                              selectedLink === 12 ? "#fff" : "#0A5077"
                            }`,
                          }}
                        />
                        <Typography className="font-medium">Members</Typography>
                      </div>
                    )}

                    {viewWorkspace !== 0 && (
                      <div
                        className={`link group ${
                          selectedLink === 13 ? "selected" : ""
                        }`}
                        onClick={() => handleLinkClick(13)}
                      >
                        <ProjectWorkspaceIcon
                          className="transition-all duration-200 group-hover:scale-110"
                          style={{
                            color: `${
                              selectedLink === 13 ? "#fff" : "#0A5077"
                            }`,
                          }}
                        />
                        <Typography className="font-medium">
                          Workspace
                        </Typography>
                      </div>
                    )}
                    {viewMilestone !== 0 && (
                      <div
                        className={`link group ${
                          selectedLink === 17 ? "selected" : ""
                        }`}
                        onClick={() => handleLinkClick(17)}
                      >
                        <Flag
                          className="transition-all duration-200 group-hover:scale-110"
                          style={{
                            color: `${
                              selectedLink === 17 ? "#fff" : "#0A5077"
                            }`,
                          }}
                        />
                        <Typography className="font-medium">
                          Milestone
                        </Typography>
                      </div>
                    )}

                    <div
                      className={`link group ${
                        selectedLink === 14 ? "selected" : ""
                      }`}
                      onClick={() => handleLinkClick(14)}
                    >
                      <ProjectDocsIcon
                        className="transition-all duration-200 group-hover:scale-110"
                        style={{
                          color: `${selectedLink === 14 ? "#fff" : "#0A5077"}`,
                        }}
                      />
                      <Typography className="font-medium">Docs</Typography>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Box>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 lg:ml-72 xl:ml-80 transition-all duration-300">
          <div className="p-4 md:p-6 lg:p-8">
            <Routes>
              {selectedLink === 0 && (
                <React.Fragment>
                  {viewAdminDashboard !== 0 ? (
                    <Route path="/" element={<AdminDashboard />} />
                  ) : viewHome !== 0 ? (
                    <Route path="/" element={<Home />} />
                  ) : null}
                </React.Fragment>
              )}
              {selectedLink === 16 && (
                <React.Fragment>
                  <Route path="/profiles" element={<Profile />} />
                </React.Fragment>
              )}

              {selectedLink === 1 && (
                <React.Fragment>
                  <Route
                    path="/projects"
                    element={
                      <Projects
                        isProjectSelected={false}
                        setIsProjectSelected={setIsProjectSelected}
                        setSelectedProjectInfo={handleProjectSelection}
                        setShowDashboardBox={setShowDashboardBox}
                        setShowMilestoneBox={setShowMilestoneBox}
                        setShowActivityBox={setShowActivityBox}
                        setShowWorkspaceBox={setShowWorkspaceBox}
                        setShowProjectsBox={setShowProjectsBox}
                        handleLinkClick={handleLinkClick}
                      />
                    }
                  />
                </React.Fragment>
              )}

              {selectedLink === 2 && (
                <React.Fragment>
                  <Route path="/teams" element={<Teams />} />
                </React.Fragment>
              )}

              {selectedLink === 3 && (
                <React.Fragment>
                  <Route path="/users" element={<Users />} />
                </React.Fragment>
              )}

              {selectedLink === 6 && (
                <React.Fragment>
                  <Route path="/organization" element={<Organization />} />
                </React.Fragment>
              )}

              {selectedLink === 7 && (
                <React.Fragment>
                  <Route path="/structure/clusters" element={<Sectors />} />
                </React.Fragment>
              )}

              {selectedLink === 8 && (
                <React.Fragment>
                  <Route
                    path="/structure/departments"
                    element={<OrganizationalUnits />}
                  />
                </React.Fragment>
              )}

              {selectedLink === 9 && (
                <React.Fragment>
                  <Route path="/trash" element={<Trash />} />
                </React.Fragment>
              )}
              {selectedLink === 15 && (
                <React.Fragment>
                  <Route path="/settings" element={<Settings />} />
                </React.Fragment>
              )}

              {selectedLink === 10 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/dashboard`}
                    element={
                      <Dashboard setSelectedProjectInfo={selectedProjectInfo} />
                    }
                  />
                </React.Fragment>
              )}
              {selectedLink === 11 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/activities`}
                    element={
                      <Activity setSelectedProjectInfo={selectedProjectInfo} />
                    }
                  />
                </React.Fragment>
              )}
              {selectedLink === 17 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/milestones`}
                    element={
                      <Milestone
                        setSelectedProjectInfo={selectedProjectInfo}
                        activity_id={props.activity_id}
                        task_id={props.task_id}
                      />
                    }
                  />
                </React.Fragment>
              )}

              {selectedLink === 4 && (
                <React.Fragment>
                  <Route path="/roles" element={<Roles />} />
                </React.Fragment>
              )}
              {selectedLink === 12 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/members`}
                    element={
                      <MembersDashboard
                        selectedProjectInfo={selectedProjectInfo}
                      />
                    }
                  />
                </React.Fragment>
              )}
              {selectedLink === 13 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/workspace`}
                    element={
                      <Workspace setSelectedProjectInfo={selectedProjectInfo} />
                    }
                  />
                </React.Fragment>
              )}

              {selectedLink === 14 && (
                <React.Fragment>
                  <Route
                    path={`${selectedProjectInfo.name}/documents`}
                    element={
                      <Docs setSelectedProjectInfo={selectedProjectInfo} />
                    }
                  />
                </React.Fragment>
              )}

              {selectedLink === 18 && (
                <React.Fragment>
                  <Route
                    path="/structure"
                    element={
                      <Structure setSelectedProjectInfo={selectedProjectInfo} />
                    }
                  />
                </React.Fragment>
              )}
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default SideandNav;
