import { Tooltip } from "@material-ui/core";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { InputAdornment, Pagination, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";
import EditUsers from "./EditUsers";
import Projectdelete from "./Projectdelete";
import Registernewuser from "./Registernewuser";
import Userdelete from "./Userdelete";
// import UserStatus from "./UserStatus.jsx";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Users = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRow, setSelectedRow] = useState(null);
  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [usersData, setUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserForStatusChange, setSelectedUserForStatusChange] =
    useState(null);
  const [loading, setLoading] = useState(false);

  const [userStatus, setUserStatus] = useState();
  const [createUser, setCreateUser] = useState(0);
  const [deleteUser, setDeleteUser] = useState(0);
  const [updateUser, setUpdateUser] = useState(0);
  const [changeUserStatus, setChangeUserStatus] = useState(0);
  const [viewPassword, setViewPassword] = useState(0);

  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers(userInfo.access_token);
      console.log(response);
      const sortedResponse = response.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      console.log(sortedResponse);
      setUsersData(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }

    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    fetchUsers();
    fetchPermissions();
    const CREATE_USER = permissions.filter(
      (permission) => permission.name === PERMISSIONS.REGISTER_NEW_USER
    );

    const UPDATE_USER = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_USER
    );

    const DELETE_USER = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_USER
    );

    const CHANGE_USER_STATUS = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CHANGE_USER_STATUS
    );

    const VIEW_PASSWORD = permissions.filter(
      (permission) => permission.name === PERMISSIONS.VIEW_PASSWORD
    );

    setCreateUser(CREATE_USER.length);
    setUpdateUser(UPDATE_USER.length);
    setDeleteUser(DELETE_USER.length);
    setChangeUserStatus(CHANGE_USER_STATUS.length);
    setViewPassword(VIEW_PASSWORD.length);
  }, [userInfo, permissions]);

  const capitalizeName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const changeStatus = async (id) => {
    try {
      const confirmation = await Swal.fire({
        title: "Change User Status?",
        text: "Are you sure you want to change the user's status?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change status!",
        customClass: {
          confirmButton: "mr-8",
        },
      });

      if (confirmation.isConfirmed) {
        await apiService.updateUserStatus(id, userInfo.access_token);
        await fetchData();
        Swal.fire({
          title: "Status Changed!",
          text: "The user's status has been updated successfully.",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleStatusChange = async (id) => {
    changeUserStatus !== 0
      ? changeStatus(id)
      : (() => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "User lacks the necessary permissions to change status",
            showConfirmButton: false,
            timer: 2500,
          });
        })();
  };

  const handleCreateUser = () => {
    setShowCreateUserModal(true);
  };
  const cancelStatusChange = () => {
    setSelectedUserForStatusChange(null);
    setShowConfirmModal(false);
  };
  const confirmStatusChange = async () => {
    await apiService.updateUserStatus(selectedUserForStatusChange);
    setShowConfirmModal(false);
    await fetchData();
  };

  const visiblePassword = (id) => {
    setSelectedUser(id);
    if (eyeIcon === "eye") {
      setEyeIcon("eye-off");
      setIsSecureEntry(!isSecureEntry);
    } else if (eyeIcon === "eye-off") {
      setEyeIcon("eye");
      setIsSecureEntry(!isSecureEntry);
    }
  };

  const handlePasswordVisibility = (id) => {
    viewPassword !== 0
      ? visiblePassword(id)
      : (() => {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "User lacks the necessary permissions to view password",
            showConfirmButton: false,
            timer: 2500,
          });
        })();
  };

  const toggleConfirmModal = () => setShowConfirmModal(!showConfirmModal);

  const handleEditClick = (row) => {
    console.log(row);
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleAddClick = (row) => {
    setSelectedRow(row);
    setAddModalOpen(true);
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleMenuOpen = (rowId) => {
    setOpenRowMenu(rowId);
  };

  const handleMenuClose = () => {
    setOpenRowMenu(null);
  };

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowConfirmModal(false);
    }
  };

  const modalRef = useRef(null);

  const handleCloseModal = () => {
    setShowCreateUserModal(false);
  };
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;

  const filteredRows =
    statusFilter === "All"
      ? usersData
      : usersData.filter((row) =>
          statusFilter === "Active"
            ? row.account_status === true
            : row.account_status === false
        );
  const search = filteredRows.filter(
    (row) =>
      row.full_name &&
      row.full_name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );
  const currentItems = search.slice(indexOfFirstItem, indexOfLastItem);
  const getGenderLabel = (gender) => {
    if (gender === "M") {
      return "Male";
    } else if (gender === "F") {
      return "Female";
    } else {
      return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChange = (event, value) => {
    paginate(value);
  };

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);

  useEffect(() => {
    fetchData();
    const handleClickOutsideModal = (event) => {
      const modal = document.querySelector(".create-user-container");
      if (modal && !modal.contains(event.target)) {
        handleCloseModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutsideModal);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [userStatus]);

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: 50,
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "0px 20px",
  }));
  const handlefetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers(userInfo.access_token);
      console.log(usersData);
      const sortedResponse = usersData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setUsersData(sortedResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="ml-auto w-4/5 mr-6 mt-24 relative ">
      <Helmet>
        <title>PMS - Users</title>
      </Helmet>
      <div className="  mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div>
        <ul class="my-5 flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-200 dark:text-gray-400">
          <li class="me-2 " onClick={() => handleFilterClick("All")}>
            <a
              href="#"
              aria-current="page"
              className={`cursor-pointer ${
                statusFilter === "All"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50  dark:hover:text-gray-300"
              }`}
            >
              <div>All</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("Active")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Active"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg  hover:bg-gray-50  dark:hover:text-gray-300"
              }`}
            >
              <div>Active</div>
            </a>
          </li>
          <li class="me-2" onClick={() => handleFilterClick("Inactive")}>
            <a
              href="#"
              className={`cursor-pointer ${
                statusFilter === "Inactive"
                  ? "font-bold text-blue-900 bg-gray-100 inline-block p-4   rounded-t-lg "
                  : "inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-gray-50  dark:hover:text-gray-300"
              }`}
            >
              <div>Inactive</div>
            </a>
          </li>
        </ul>

        <div className="flex flex-wrap mb-7 justify-between">
          <div class=" self-center ">
            <TextField
              type="text"
              placeholder="Search by User Name"
              size="small"
              class=" rounded-lg "
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
          {createUser !== 0 && (
            <button
              className="text-white font-bold py-2 px-4 rounded"
              onClick={() => handleAddClick()}
              style={{ backgroundColor: "#082f49" }}
            >
              + Register User
            </button>
          )}
        </div>
        <div className="rows-per-page flex my-6 ml-2 justify-start text-sm ">
          {" "}
          Rows per page
          <div>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className=" w-fit pl-3 text-sm border-none outline-none bg-white  focus:border-none focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
            // maxHeight: 300,
            width: "100%",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <Fade
              in={loading}
              style={{
                transitionDelay: loading ? "100ms" : "0ms",
              }}
              unmountOnExit
            >
              <LinearProgress />
            </Fade>
          </Box>
          <Table
            sx={{
              minWidth: 900,
              borderBottom: "none",
            }}
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <BoldTableCell>
                  <div className="header-cell">Full Name</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Email</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Password</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell ">Gender</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Status</div>
                </BoldTableCell>
                {/* <BoldTableCell>
                  <div className="header-cell">Project</div>
                </BoldTableCell> */}
                {updateUser !== 0 && (
                  <BoldTableCell>
                    <div className="header-cell ">Action</div>
                  </BoldTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentItems.map((row, index) => (
                <StyledTableRow
                  key={row.id}
                  style={
                    index % 2
                      ? { background: "white" }
                      : { background: "#f7f6fe" }
                  }
                >
                  <StyledTableCell>
                    <div className="flex items-center cursor-pointer">
                      <div
                        className={`h-8 w-fit flex gap-1 items-center justify-center rounded-md text-`}
                      >
                        <AccountCircleIcon style={{ color: "#223c5d" }} />
                        <div>{capitalizeName(row.full_name)}</div>
                      </div>
                    </div>
                  </StyledTableCell>

                  <StyledTableCell>{row.email}</StyledTableCell>

                  <StyledTableCell>
                    {" "}
                    {row.unchanged_password ? (
                      <div className="flex flex-row items-center gap-3">
                        <div className="text-center cursor-pointer">
                          <div
                            onClick={() =>
                              handlePasswordVisibility(row.user_id)
                            }
                          >
                            {eyeIcon === "eye" &&
                            row.user_id === selectedUser ? (
                              <Tooltip title="Hide Password">
                                <div className="p-2 hover:bg-gray-200 rounded-lg">
                                  <VisibilityOffOutlinedIcon />
                                </div>
                              </Tooltip>
                            ) : (
                              <Tooltip title="View Password">
                                <div className="p-2 hover:bg-gray-200 rounded-lg">
                                  <VisibilityOutlinedIcon />
                                </div>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        {isSecureEntry && row.user_id === selectedUser ? (
                          <div>{row.unchanged_password}</div>
                        ) : (
                          <div>*****</div>
                        )}
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex flex-row">
                      <div className="ml-5">{getGenderLabel(row.gender)}</div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="manager-cell flex">
                      <Tooltip title="Change User Status">
                        <div>
                          <Switch
                            checked={row.account_status}
                            onChange={() => handleStatusChange(row.user_id)}
                            color="primary"
                            inputProps={{ "aria-label": "toggle user status" }}
                          />
                        </div>
                      </Tooltip>
                    </div>
                  </StyledTableCell>

                  {/* <StyledTableCell
                    className={String(row.project_status).toLowerCase()}
                  >
                    <div className="status-cell">
                      <div style={{ alignItems: "center" }}>
                        {String(row.project_status) === "true" && (
                          <span className="bg-green-200  text-green-700 rounded-xl p-1">
                            Assigned
                          </span>
                        )}
                        {String(row.project_status) === "false" && (
                          <span className="bg-red-200  text-red-700 rounded-xl p-1">
                            Unassigned
                          </span>
                        )}
                      </div>
                    </div>
                  </StyledTableCell> */}
                  <StyledTableCell>
                    <div className="flex flex-row items-center">
                      {updateUser !== 0 && (             
                      <div className="cursor-pointer flex gap-2 text-white flex-row relative">
                        <Tooltip title="Edit User Info..">
                          <div className="p-2 hover:bg-gray-200 rounded-lg">
                            <div
                              onClick={() => handleEditClick(row)}
                              className="text-blue-900"
                            >
                              {" "}
                              <FaEdit size={22} />
                            </div>
                          </div>
                        </Tooltip>
                      </div>
                  )}
                  {deleteUser !== 0 && (
                      <div className="cursor-pointer flex gap-2 text-white flex-row relative">
                        <Tooltip title="Delete User">
                          <div className="p-2 hover:bg-gray-200 rounded-lg">
                          <div
                        className="text-red-500"
                        onClick={() => handleDeleteClick(row)}
                      >
                        <FaTrash size={15} />
                      </div>
                          </div>
                        </Tooltip>
                      </div>
                    
                  )}</div>
                  
                  </StyledTableCell>
                  
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Box className="text-sm flex justify-end mt-1 pb-20 pt-5">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={handleChange}
          variant="outlined"
          shape="rounded"
          size="small"
          color="primary"
          sx={{ "& .MuiPaginationItem-root": { margin: "0 4px" } }}
        />
      </Box>

      {addModalOpen && (
        <div className="fixed  top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white  h-fit p-5 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-5 "
              onClick={handleAddModalClose}
            >
              {" "}
              X
            </div>
            <Registernewuser
              handleCloseModal={handleAddModalClose}
              handlefetchUsers={handlefetchUsers}
            />
          </div>
        </div>
      )}
      {editModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-5 w-fit  rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-5 "
              onClick={handleEditModalClose}
            >
              {" "}
              X
            </div>
            <EditUsers
              selectedRow={selectedRow}
              handleCloseModal={handleEditModalClose}
              handleFetchUsers={fetchData}
            />
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 pt-4 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12 "
              onClick={handleDeleteModalClose}
            >
              X
            </div>
            <Userdelete  selectedRow={selectedRow}
              handlefetchUsers={handlefetchUsers}
              handleDeleteModalClose={handleDeleteModalClose} />
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="confirm-modal-container">
            <div className="fixed top-0 left-0 w-full h-full z-70 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white w-2/3 p-8 rounded-md relative">
                <span
                  onClick={toggleConfirmModal}
                  className="  cursor-pointer text-gray-500"
                >
                  X
                </span>
                {/* <UserStatus /> */}
                <div className="mt-4 flex justify-end">
                  <button
                    className="bg-white text-black py-2 px-4 rounded mr-4"
                    onClick={cancelStatusChange}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={confirmStatusChange}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
