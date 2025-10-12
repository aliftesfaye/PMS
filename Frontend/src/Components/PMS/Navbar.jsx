import { Menu, MenuItem, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ProfilePicIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Badge,
  Box,
  Drawer,
  IconButton,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import EaiiIcon from "../Assets/Eaii.png";
import apiService from "../services/apiServices";
import ProfileUpdate from "./Myprofile";
import "./Navbar.css";

import { useNavigate } from "react-router-dom";
import { SOCKET_URL } from "../../config";
import { useAuth } from "../../context/authContext";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  dropdown: {
    position: "absolute",
    top: "100%",
    right: 0,
    zIndex: 1,
    marginTop: 65,
    minWidth: 180,
    // backgroundColor: theme.palette.background.paper,
    // boxShadow: theme.shadows[1],
  },
  notificationDropdown: {
    marginTop: 65,
  },
}));

const Navbar = (props) => {
  const classes = useStyles();

  const { window } = props;
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [mainRole, setMainRole] = useState({});
  const [socket, setSocket] = useState(null);
  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const auth = useAuth();
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleToggleDropdown = () => {
    setAnchorEl(anchorEl ? null : document.getElementById("dropdown-button"));
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModal = () => {
    setDropdownOpen(false);
    setModalOpen(true);
  };
  const logout = () => {
    setOpen(true);
    setTimeout(() => {
      auth.logout();
      navigate("/");
      console.log("Logged out succesfully");
      setDropdownOpen(false);
      setOpen(false);
    }, 1000);
  };
  const closeModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    // Mark all notifications as seen when the notification menu is opened
    markAllNotificationsAsSeen();
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const markNotificationAsSeen = (id) => {
    const updatedNotifications = realtimeNotifications.map((notification) =>
      notification.id === id ? { ...notification, seen: true } : notification
    );
    setRealtimeNotifications(updatedNotifications);
  };

  const markAllNotificationsAsSeen = async () => {
    const updatedNotifications = realtimeNotifications.map((notification) => ({
      ...notification,
      seen: true,
    }));
    try {
      await apiService.NotificationUpdate(userInfo.foundUser.user_id);
      setRealtimeNotifications(updatedNotifications);
    } catch (e) {
      console.error(e);
    }
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  useEffect(() => {
    const fetchUsers = () => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };

    const fetchPermissions = () => {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    };
    const fetchNotification = async () => {
      try {
        await apiService.getAllNotifications();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const initializeSocket = () => {
      const socket = io(SOCKET_URL);

      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("notification", (notification) => {
        // console.log("New notification received:", notification);
        const filteredNotifications = notification.filter(
          (notification) => notification.user_id === userInfo.foundUser.user_id
        );

        setRealtimeNotifications(filteredNotifications);
      });

      setSocket(socket);

      return () => {
        // Clean up socket connection when component unmounts
        socket.disconnect();
      };
    };

    fetchUsers();
    fetchPermissions();
    fetchNotification();
    initializeSocket();

    const filteredRole = userInfo.foundUser.Roles.find(
      (role) => role.project_related === false
    );

    setMainRole(filteredRole);

    // Clean up function for useEffect
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userInfo, permissions]); // Dependency array includes only userInfo and permissions

  return (
    <>
      <div class="flex flex-row items-center  place-content-center  fixed bg-sky-950 w-full lg:z-50 md:z-50 z-50">
        <div>
          <Box>
            <AppBar class="inline-block">
              <Toolbar>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <MenuIcon
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    sx={{
                      display: { sm: "block", xs: "block", md: "none" },
                      color: "white",
                      fontSize: "30px",
                      cursor: "pointer",
                      justifyItems: "center",
                      "&:hover": {
                        color: "gray",
                        fontSize: "30px",
                      },
                    }}
                  />
                </Box>
              </Toolbar>
            </AppBar>
            <nav>
              <Drawer
                container={container}
                variant="temporary"
                open={props.mobileOpen}
                onClose={props.handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: "block", sm: "block" },
                  "& .MuiDrawer-paper": {
                    boxSizing: "border-box",
                    width: drawerWidth,
                  },
                }}
              >
                {props.drawer}
              </Drawer>
            </nav>
          </Box>
        </div>
        <div class="flex flex-row sm:justify-between md:justify-between   place-content-center py-4 bg-sky-950 w-full ">
          <div class="flex flex-row space-x-3 items-center ">
            <img src={EaiiIcon} alt="Logo" class="hidden lg:block md:block" />
            <Typography class="text-white">EAII-PMS</Typography>
            <Typography class="text-white">{props.userName}</Typography>
          </div>
          <div class="flex flex-row gap-10">
            <div class=" self-center ">
              <TextField
                size="small"
                class="bg-white rounded-lg"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div class="flex flex-row space-x-8  place-items-center px-5">
              <Tooltip title="View Notifications" placement="bottom">
                <IconButton
                  onClick={handleNotificationClick}
                  style={{ backgroundColor: "transparent" }}
                >
                  {realtimeNotifications.some(
                    (notification) => !notification.seen
                  ) ? (
                    <Badge
                      badgeContent={
                        realtimeNotifications.filter(
                          (notification) => !notification.seen
                        ).length
                      }
                      color="error"
                    >
                      <NotificationIcon style={{ color: "white" }} />
                    </Badge>
                  ) : (
                    <NotificationIcon style={{ color: "white" }} />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationClose}
                className={classes.notificationDropdown}
              >
                <div className="flex flex-row  space-x-8 place-items-center px-5">
                  <div className="flex gap-1.5 ">
                    <div className="flex flex-col  grow shrink-0 text-blue-950 w-fit">
                      <div className="self-start  ml-5 text-xl font-bold">
                        Notifications
                      </div>

                      <div className="overflow-y-auto max-h-[400px]">
                        {/* Render real-time notifications */}
                        {realtimeNotifications.length > 0 ? (
                          realtimeNotifications.map((notification) => (
                            <div key={notification.id} className="relative">
                              <div className="flex flex-col py-3 pr-2 pl-5 mt-3 w-full bg-white">
                                <div className="flex gap-5 text-sm font-semibold">
                                  <div className="flex-auto">
                                    {notification.message}
                                  </div>
                                  {/* <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                      markNotificationAsSeen(notification.id)
                                    }
                                  >
                                    Mark as Read
                                  </div> */}
                                </div>
                                <div className="mt-3 text-sm">
                                  {notification.date}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-3 pr-2 pl-5 mt-3 w-full bg-white text-center text-gray-500">
                            No notifications
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Menu>
              <div>
                <div className="flex flex-row gap-4 items-center">
                  <IconButton
                    id="dropdown-button"
                    color="inherit"
                    onClick={handleToggleDropdown}
                    style={{ backgroundColor: "transparent" }}
                  >
                    <ProfilePicIcon
                      sx={{
                        color: "#fff",
                        fontSize: 30,
                        "&:hover": {
                          color: "white",
                        },
                      }}
                    />
                  </IconButton>

                  <div
                    onClick={handleToggleDropdown}
                    className="cursor-pointer"
                  >
                    <Typography
                      variant="body1"
                      className="hidden lg:block md:block text-white"
                    >
                      {userInfo.foundUser.full_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="hidden lg:block md:block text-white"
                    >
                      {mainRole.name}
                    </Typography>
                  </div>
                </div>

                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className={classes.dropdown}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      openModal();
                    }}
                  >
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </div>
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed  top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className=" w-full rounded-md relative py-5">
              <ProfileUpdate closeModal={closeModal} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
