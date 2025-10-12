import { withStyles } from "@material-ui/core/styles";
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
import { FaEdit, FaTrash } from "react-icons/fa";
import { PERMISSIONS } from "../../config";
import SearchIcon from "../Assets/Search-icon.png";
import apiService from "../services/apiServices";
import DivisionAdd from "./DivisionAdd";
import Employees from "./Employees";
import OrganizationalUnitdelete from "./OrganizationalUnitdelete";
import OrganizationalUnitEdit from "./Organizationaluniteditt";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Organizationalunittry = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizationalunit, setOrganizationalunit] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [loading, setLoading] = useState(false);
  const [createDepartment, setCreateDepartment] = useState(0);
  const [updateDepartment, setUpdateDepartment] = useState(0);
  const [deleteDepartment, setDeleteDepartment] = useState(0);

  useEffect(() => {
    const fetchOrganizationalunit = async () => {
      try {
        setLoading(true);
        const organizationalunitData = await apiService.getDivisions(
          userInfo.access_token
        );
        console.log("Fetched organizationalunit:", organizationalunitData);
        const sortedResponse = organizationalunitData.sort((a, b) => {
          if (a.division.createdAt > b.division.createdAt) {
            return -1;
          }
        });
        setOrganizationalunit(sortedResponse);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    fetchUsers();
    fetchOrganizationalunit();
    fetchPermissions();

    const CREATE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_ORGANIZATION_UNIT
    );

    const UPDATE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_ORGANIZATION_UNIT
    );

    const DELETE_ORGANIZATION_UNIT = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_ORGANIZATION_UNIT
    );

    setCreateDepartment(CREATE_ORGANIZATION_UNIT.length);
    setUpdateDepartment(UPDATE_ORGANIZATION_UNIT.length);
    setDeleteDepartment(DELETE_ORGANIZATION_UNIT.length);
  }, [userInfo, permissions]);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };
  const handlefetchOrganizationalunit = async () => {
    try {
      const organizationalunitData = await apiService.getDivisions(
        userInfo.access_token
      );
      console.log("Fetched organizationalunit:", organizationalunitData);
      const sortedResponse = organizationalunitData.sort((a, b) => {
        if (a.division.createdAt > b.division.createdAt) {
          return -1;
        }
      });
      setOrganizationalunit(sortedResponse);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setViewModalOpen(true);
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
  const filteredRows = organizationalunit.filter(
    (row) =>
      row.division.name &&
      row.division.name
        .toLowerCase()
        .includes(searchTerm ? searchTerm.toLowerCase() : "")
  );
  const currentItems = filteredRows.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      height: 40,
    },
  }))(TableRow);

  const StyledTableCell = withStyles((theme) => ({
    root: {
      padding: "0px 10px",
    },
  }))(TableCell);

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Department</h1>
      </div>

      <div className="">
        <div className="flex flex-row relative mb-3">
          <input
            type="text"
            placeholder="Search by Department Name"
            className="pl-7 w-fix"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src={SearchIcon}
            alt="Search Icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
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
          {createDepartment !== 0 && (
            <button
              className="text-white font-bold py-2 px-4 rounded"
              onClick={handleAddClick}
              style={{ backgroundColor: "#082f49" }}
            >
              + Add New Department
            </button>
          )}
        </div>
      </div>
      <div>
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: 450,
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
                  <div className="header-cell">Department name</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell ">Leader</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell">Sector</div>
                </BoldTableCell>
                {(updateDepartment !== 0 || deleteDepartment !== 0) && (
                  <BoldTableCell>
                    <div className="header-cell">Actions</div>
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
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell
                    onClick={() => handleViewClick(row)}
                    class="cursor-pointer"
                  >
                    {row.division.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    {/* <img
                      src={row.gender === "male" ? Leader : Member1}
                      alt=""
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                      }}
                    /> */}
                    {row.head.length !== 0 ? row.head[0].full_name : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.sector.length !== 0 ? row.sector[0].name : ""}
                  </StyledTableCell>
                  <StyledTableCell>
                    <div className="flex gap-2 text-white flex-row relative ">
                      <div className="justify-center px-2.5 text-black rounded-md">
                        <div className="actions flex flex-row gap-4">
                          {updateDepartment !== 0 && (
                            <div className=" text-white font-bold py-2  rounded cursor-pointer">
                              <div
                                className="text-blue-900"
                                onClick={() => handleEditClick(row)}
                              >
                                <FaEdit size={18} />
                              </div>
                            </div>
                          )}
                          {deleteDepartment !== 0 && (
                            <div className=" text-white font-bold py-2  rounded cursor-pointer">
                              <div
                                className="text-red-500"
                                onClick={() => handleDeleteClick(row)}
                              >
                                <FaTrash size={15} />
                              </div>
                            </div>
                          )}
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
      <div className="text-sm flex justify-end mt-1">
        <button
          className="bg-white cursor-pointer"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(Math.ceil(filteredRows.length / rowsPerPage)).keys()].map(
          (number) => (
            <div
              key={number + 1}
              className={`bg-${
                currentPage === number + 1 ? "gray-100" : "white"
              } h-fit rounded-md px-3 mt-2 py-1 cursor-pointer`}
              onClick={() => paginate(number + 1)}
            >
              {number + 1}
            </div>
          )
        )}
        <button
          className="bg-white cursor-pointer"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastItem >= filteredRows.length}
        >
          Next
        </button>
      </div>
      {addModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleAddModalClose}
        >
          <div
            className="bg-white w-2/3  rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className=" cursor-pointer text-end mr-12 mt-4  "
              onClick={handleAddModalClose}
            >
              {" "}
              X
            </div>
            <DivisionAdd
              handlefetchOrganizationalunit={handlefetchOrganizationalunit}
              handleCloseModal={handleAddModalClose}
            />
          </div>
        </div>
      )}
      {editModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleEditModalClose}
        >
          <div
            className="bg-white w-fit rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleEditModalClose}
            >
              {" "}
              X
            </div>
            <OrganizationalUnitEdit
              selectedRow={selectedRow}
              handlefetchOrganizationalunit={handlefetchOrganizationalunit}
              handleCloseModal={handleEditModalClose}
            />
          </div>
        </div>
      )}
      {deleteModalOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50"
          onClick={handleDeleteModalClose}
        >
          <div
            className="bg-white w-fit pt-4 rounded-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="close cursor-pointer text-end mr-12 "
              onClick={handleDeleteModalClose}
            >
              X
            </div>
            <OrganizationalUnitdelete
              selectedRow={selectedRow}
              handlefetchOrganizationalunit={handlefetchOrganizationalunit}
              handleDeleteModalClose={handleDeleteModalClose}
            />
          </div>
        </div>
      )}

      {viewModalOpen && (
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
            <Employees row={selectedRow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizationalunittry;
