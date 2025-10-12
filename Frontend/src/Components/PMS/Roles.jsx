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
    console.log(row);
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
    // console.log(row)
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
    height: 50,
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    padding: "0px 20px",
  }));
  const handleChange = (event, value) => {
    paginate(value);
  };

  const pageCount = Math.ceil(filteredRows.length / rowsPerPage);

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative ">
      <Helmet>
        <title>PMS - Roles</title>
      </Helmet>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Roles</h1>
      </div>

      <div className="">
        <div class=" self-center ">
          <TextField
            type="text"
            placeholder="Search by Role Name"
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
        <div className="flex mb-7 justify-between">
          <div className="rows-per-page flex ml-2 justify-start mt-4 text-sm ">
            Rows per page
            <div>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="w-fit pl-3 text-sm border-none outline-none bg-white focus:border-none focus:outline-none"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <button
            className=" text-white font-bold py-2 px-4 rounded"
            onClick={handleAddClick}
            style={{ backgroundColor: "#082f49" }}
          >
            + Add New Role
          </button>
        </div>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
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
                  <div className="header-cell">No</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Role name</div>
                </BoldTableCell>

                <BoldTableCell>
                  <div className="header-cell ml-10">Actions</div>
                </BoldTableCell>
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
                    {index + 1 + indexOfFirstItem}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.name.charAt(0).toUpperCase() + row.name.slice(1)}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex gap-2 text-white flex-row relative">
                      <div className="justify-center px-2.5 text-black rounded-md">
                        <div className="actions flex flex-row gap-4">
                          <div className="text-white font-bold  rounded cursor-pointer">
                            <div
                              className="ml-16 text-blue-900"
                              onClick={() => handleViewClick(row)}
                            >
                              <FaEye size={18} />
                            </div>
                          </div>
                          <div className=" text-white font-bold  rounded cursor-pointer">
                            <div
                              className="text-blue-900"
                              onClick={() => handleEditClick(row)}
                            >
                              <FaEdit size={18} />
                            </div>
                          </div>
                          <div className=" text-white font-bold  rounded cursor-pointer">
                            {row.project_related === true ? (
                              <div
                                className="text-red-500"
                                onClick={() => handleDeleteClick(row)}
                                key={row.role_id}
                              >
                                {/* <FaTrash size={15} /> */}
                              </div>
                            ) : (
                              <div
                                className="text-gray-500"
                                key={row.role_id}
                              ></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
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
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleAddModalClose}
        >
          <div
            className="bg-white w-2/3 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleAddModalClose}
            >
              X
            </div>
            <RoleAdd
              handlefetchRoles={handlefetchRoles}
              handleCloseModal={handleAddModalClose}
            />
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal-overlay" onClick={handleEditModalClose}>
          <div
            className="modal-content bg-white w-2/3  rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleEditModalClose}
            >
              {" "}
              X
            </div>
            <RoleEdit
              roleId={selectedRow.role_id}
              handleCloseModal={handleEditModalClose}
              handlefetchRoles={handlefetchRoles}
            />
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div className="modal-overlay" onClick={handleDeleteModalClose}>
          <div
            className="modal-content bg-white w-fit rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 "
              onClick={handleDeleteModalClose}
            >
              X
            </div>
            <RoleDelete
              selectedRow={selectedRow}
              handleDeleteModalClose={handleDeleteModalClose}
              handlefetchRoles={handlefetchRoles}
            />
          </div>
        </div>
      )}

      {viewModalOpen && (
        <div className="modal-overlay">
          <div
            className="modal-content bg-white w-2/3 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer my-3 text-end mr-12 "
              onClick={handleViewModalClose}
            >
              X
            </div>
            <RoleView id={selectedRow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
