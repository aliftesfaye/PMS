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
import Registernewuser from "./Registernewuser";
import Userdelete from "./Userdelete";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
    color: "#1e3a8a",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
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
      const sortedResponse = response.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
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
    height: 60,
    "&:hover": {
      backgroundColor: "#f8fafc",
      transition: "background-color 0.2s ease",
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "16px 24px",
    fontSize: "0.875rem",
    color: "#334155",
  }));

  const handlefetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers(userInfo.access_token);
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
    <div className="ml-auto w-full lg:w-4/5 mr-0 lg:mr-6 mt-6 px-4 lg:px-0 relative">
      <Helmet>
        <title>PMS - Users</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-1">
          Manage and monitor all system users
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-1 bg-white rounded-lg border border-gray-200 p-1 w-fit">
          {["All", "Active", "Inactive"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterClick(status)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                statusFilter === status
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-blue-900 hover:bg-blue-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Create Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-auto">
            <TextField
              type="text"
              placeholder="Search by User Name..."
              size="small"
              className="w-full lg:w-64"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="text-gray-400" />
                  </InputAdornment>
                ),
                classes: {
                  root: "rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                },
              }}
            />
          </div>
          {createUser !== 0 && (
            <button
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow whitespace-nowrap"
              onClick={() => handleAddClick()}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Register New User
            </button>
          )}
        </div>
      </div>

      {/* Rows per page selector */}
      {usersData.length !== 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredRows.length)} of{" "}
            {filteredRows.length} users
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Rows per page:
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Box sx={{ width: "100%" }}>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? "100ms" : "0ms",
            }}
            unmountOnExit
          >
            <LinearProgress sx={{ height: 2 }} />
          </Fade>
        </Box>

        {currentItems.length !== 0 ? (
          <div className="overflow-x-auto">
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                  <BoldTableCell sx={{ padding: "20px 24px" }}>
                    <div className="header-cell">Full Name</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Email</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Password</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Gender</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Status</div>
                  </BoldTableCell>
                  {(updateUser !== 0 || deleteUser !== 0) && (
                    <BoldTableCell>
                      <div className="header-cell">Actions</div>
                    </BoldTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row) => (
                  <StyledTableRow key={row.user_id}>
                    <StyledTableCell>
                      <div className="flex items-center cursor-pointer group">
                        <div className="flex-shrink-0 mr-3">
                          <AccountCircleIcon
                            className="text-blue-900 group-hover:text-blue-800 transition-colors"
                            style={{ fontSize: 32 }}
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                            {capitalizeName(row.full_name)}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {row.user_id?.slice(0, 8)}
                          </div>
                        </div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="font-medium text-gray-900">
                        {row.email}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      {row.unchanged_password ? (
                        <div className="flex items-center gap-3">
                          <Tooltip
                            title={
                              eyeIcon === "eye"
                                ? " Hide Password"
                                : "View Password"
                            }
                            placement="top"
                          >
                            <button
                              onClick={() =>
                                handlePasswordVisibility(row.user_id)
                              }
                              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            >
                              {eyeIcon === "eye" &&
                              row.user_id === selectedUser ? (
                                <VisibilityOutlinedIcon />
                              ) : (
                                <VisibilityOffOutlinedIcon />
                              )}
                            </button>
                          </Tooltip>
                          {isSecureEntry && row.user_id === selectedUser ? (
                            <div className="font-mono text-gray-700">
                              {row.unchanged_password}
                            </div>
                          ) : (
                            <div className="text-gray-400">••••••••</div>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm">
                          No password set
                        </div>
                      )}
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        {getGenderLabel(row.gender)}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center">
                        <Tooltip title="Change User Status" placement="top">
                          <div>
                            <Switch
                              checked={row.account_status}
                              onChange={() => handleStatusChange(row.user_id)}
                              color="primary"
                              inputProps={{
                                "aria-label": "toggle user status",
                              }}
                            />
                          </div>
                        </Tooltip>
                        <div
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ml-3 ${
                            row.account_status
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {row.account_status ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </StyledTableCell>
                    {(updateUser !== 0 || deleteUser !== 0) && (
                      <StyledTableCell>
                        <div className="flex items-center gap-2">
                          {updateUser !== 0 && (
                            <Tooltip title="Edit User" placement="top">
                              <button
                                onClick={() => handleEditClick(row)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                              >
                                <FaEdit size={16} />
                              </button>
                            </Tooltip>
                          )}
                          {deleteUser !== 0 && (
                            <Tooltip title="Delete User" placement="top">
                              <button
                                onClick={() => handleDeleteClick(row)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              >
                                <FaTrash size={16} />
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {loading
                ? "Loading users..."
                : "No users match your current filters. Try adjusting your search or filters."}
            </p>
            {!loading && createUser !== 0 && (
              <button
                onClick={() => handleAddClick()}
                className="mt-4 bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Register your first user
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {usersData.length !== 0 && search.length > 0 && (
        <div className="mt-6 flex justify-center mb-20">
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 shadow-sm">
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handleChange}
              variant="outlined"
              shape="rounded"
              color="primary"
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "0.875rem",
                  margin: "0 2px",
                  "&.Mui-selected": {
                    backgroundColor: "#1e3a8a",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#1e40af",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="rounded-2xl shadow-2xl w-11/12 lg:w-4/5 max-h-[90vh] overflow-hidden mx-4">
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Registernewuser
                handleCloseModal={handleAddModalClose}
                handlefetchUsers={handlefetchUsers}
              />
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="rounded-2xl shadow-2xl w-11/12 lg:w-4/5 max-h-[90vh] overflow-hidden mx-4">
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <EditUsers
                selectedRow={selectedRow}
                handleCloseModal={handleEditModalClose}
                handleFetchUsers={fetchData}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className=" rounded-2xl shadow-2xl w-11/12 lg:w-1/2 max-h-[90vh] overflow-hidden mx-4">
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <Userdelete
                selectedRow={selectedRow}
                handlefetchUsers={handlefetchUsers}
                handleDeleteModalClose={handleDeleteModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-1/3 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">
                Confirm Status Change
              </h2>
              <button
                onClick={cancelStatusChange}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="text-gray-700 mb-6">
                Are you sure you want to change this user's status?
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelStatusChange}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmStatusChange}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
