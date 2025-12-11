import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment, Pagination, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaEdit, FaEye } from "react-icons/fa";
import RoleAdd from "./RoleAdd";
import RoleDelete from "./RoleDelete";
import RoleEdit from "./RoleEdit";
import RoleView from "./RoleView";
import "./Roles.css";

import apiService from "../services/apiServices";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
    color: "#1e3a8a",
    fontSize: "0.875rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
});

const Roles = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const rolesData = await apiService.getallRoles(userInfo.access_token);
        const sortedResponse = rolesData.sort((a, b) => {
          if (a.createdAt > b.createdAt) {
            return -1;
          }
        });
        setRoles(sortedResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();

    fetchRoles();
  }, [userInfo]);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };
  const handleCloseModal = (row) => {
    return 0;
  };
  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handlefetchRoles = async () => {
    try {
      const rolesData = await apiService.getallRoles();
      const sortedResponse = rolesData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setRoles(sortedResponse);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setDeleteModalOpen(true);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setViewModalOpen(true);
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

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const handleFilterClick = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const filteredRows = roles.filter(
    (row) =>
      row.name && row.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const handleChange = (event, value) => {
    paginate(value);
  };

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div className="ml-auto w-full  mr-0 lg:mr-6 mt-6 px-4 lg:px-0 relative">
      <Helmet>
        <title>PMS - Roles</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Roles</h1>
        <p className="text-gray-600 mt-1">
          Manage system roles and permissions
        </p>
      </div>

      {/* Search and Create Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:w-auto">
            <TextField
              type="text"
              placeholder="Search by Role Name"
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
          <button
            className="bg-blue-900 hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow whitespace-nowrap"
            onClick={handleAddClick}
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
            Add New Role
          </button>
        </div>
      </div>

      {/* Rows per page selector */}
      {roles.length !== 0 && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredRows.length)} of{" "}
            {filteredRows.length} roles
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
                    <div className="header-cell">No</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Role Name</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Type</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Actions</div>
                  </BoldTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row, index) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell>
                      <div className="font-medium text-gray-900">
                        {index + 1 + indexOfFirstItem}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="font-medium text-gray-900">
                        {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                          row.project_related
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {row.project_related ? "Project Role" : "System Role"}
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleViewClick(row)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="View Role"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditClick(row)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Role"
                        >
                          <FaEdit size={16} />
                        </button>
                        {row.project_related && (
                          <button
                            onClick={() => handleDeleteClick(row)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete Role"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </StyledTableCell>
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
              No roles found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {loading
                ? "Loading roles..."
                : "No roles match your search. Try adjusting your search term."}
            </p>
            {!loading && (
              <button
                onClick={handleAddClick}
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
                Add your role
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {roles.length !== 0 && filteredRows.length > 0 && (
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
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-3/4 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Role</h2>
              <button
                onClick={handleAddModalClose}
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
            <div
              className="overflow-y-auto max-h-[calc(90vh-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <RoleAdd
                handlefetchRoles={handlefetchRoles}
                handleCloseModal={handleAddModalClose}
              />
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-3/4 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Role</h2>
              <button
                onClick={handleEditModalClose}
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
            <div
              className="overflow-y-auto max-h-[calc(90vh-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <RoleEdit
                roleId={selectedRow?.role_id}
                handleCloseModal={handleEditModalClose}
                handlefetchRoles={handlefetchRoles}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-1/2 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Delete Role</h2>
              <button
                onClick={handleDeleteModalClose}
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
            <div
              className="overflow-y-auto max-h-[calc(90vh-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <RoleDelete
                selectedRow={selectedRow}
                handleDeleteModalClose={handleDeleteModalClose}
                handlefetchRoles={handlefetchRoles}
              />
            </div>
          </div>
        </div>
      )}

      {viewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl w-11/12 lg:w-3/4 max-h-[90vh] overflow-hidden mx-4">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900">Role Details</h2>
              <button
                onClick={handleViewModalClose}
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
            <div
              className="overflow-y-auto max-h-[calc(90vh-80px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <RoleView id={selectedRow} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
