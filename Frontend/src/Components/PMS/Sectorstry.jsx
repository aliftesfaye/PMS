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
import SectorAdd from "./SectorAdd";
import SectorDetail from "./SectorDetails";
import SectorEdit from "./SectorEdit";
import SectorDelete from "./Sectordelete";

const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Sectorstry = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [organizations, setOrganizations] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [createSector, setCreateSector] = useState(0);
  const [updateSector, setUpdateSector] = useState(0);
  const [deleteSector, setDeleteSector] = useState(0);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setLoading(true);
        const organizationsData = await apiService.getallOrganizations(
          userInfo.access_token
        );
        console.log("Fetched organizations:", organizationsData);
        const sortedResponse = organizationsData.sort((a, b) => {
          if (a.sector.createdAt > b.sector.createdAt) {
            return -1;
          }
        });
        setTimeout(() => {
          setOrganizations(sortedResponse);
          setLoading(false);
        }, 1000);
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
    fetchOrganizations();
    fetchPermissions();
    const CREATE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_SECTOR
    );

    const UPDATE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_SECTOR
    );

    const DELETE_SECTOR = permissions.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_SECTOR
    );

    setCreateSector(CREATE_SECTOR.length);
    setUpdateSector(UPDATE_SECTOR.length);
    setDeleteSector(DELETE_SECTOR.length);
  }, [userInfo, permissions]);

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };
  const handlefetchOrganizations = async () => {
    try {
      const organizationsData = await apiService.getallOrganizations(
        userInfo.access_token
      );
      console.log("Fetched organizations:", organizationsData);
      const sortedResponse = organizationsData.sort((a, b) => {
        if (a.sector.createdAt > b.sector.createdAt) {
          return -1;
        }
      });
      setOrganizations(sortedResponse);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };
  const handleViewClick = (row) => {
    setSelectedRow(row);
    console.log(row);

    setViewModalOpen(true);
  };

  const handleAddClick = () => {
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

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
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
  const filteredRows = organizations.filter(
    (row) =>
      row.sector.name &&
      row.sector.name
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
        <h1 className="text-2xl font-bold">Sectors</h1>
      </div>

      <div className="">
        <div className="flex flex-row relative">
          <input
            type="text"
            placeholder="Search by Sector Name"
            className="pl-7"
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

          {createSector !== 0 && (
            <button
              className="text-white font-bold py-2 px-4 rounded"
              onClick={handleAddClick}
              style={{ backgroundColor: "#082f49" }}
            >
              + Add New Sector
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
                  <div className="header-cell">Sector name</div>
                </BoldTableCell>
                <BoldTableCell>
                  <div className="header-cell ">Leader</div>
                </BoldTableCell>
                {(updateSector !== 0 || deleteSector !== 0) && (
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
                    {row.sector.name}
                  </StyledTableCell>
                  <StyledTableCell>
                    {/* {row.leader_img ? (
                      <img
                        src={Leader}
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      <img
                        src={row.leader_img}
                        alt=""
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    )} */}
                    {row.leader.length !== 0 ? row.leader[0].full_name : ""}
                  </StyledTableCell>

                  <StyledTableCell>
                    <div className="flex text-white flex-row relative justify-center rounded-md">
                      <div className="actions flex flex-row gap-4">
                        {updateSector !== 0 && (
                          <div className=" text-white font-bold py-2  rounded cursor-pointer">
                            <div
                              className="text-blue-900"
                              onClick={() => handleEditClick(row)}
                            >
                              <FaEdit size={18} />
                            </div>
                          </div>
                        )}
                        {deleteSector !== 0 && (
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
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-2/3  rounded-md relative">
            <div
              className=" cursor-pointer text-end mr-12 mt-4  "
              onClick={handleAddModalClose}
            >
              {" "}
              X
            </div>
            <SectorAdd
              handlefetchOrganizations={handlefetchOrganizations}
              handleCloseModal={handleAddModalClose}
            />
          </div>
        </div>
      )}
      {editModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleEditModalClose}
            >
              {" "}
              X
            </div>
            <SectorEdit
              handlefetchOrganizations={handlefetchOrganizations}
              handleCloseModal={handleEditModalClose}
              selectedRow={selectedRow}
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
            <SectorDelete
              handlefetchOrganizations={handlefetchOrganizations}
              handleDeleteModalClose={handleDeleteModalClose}
              selectedRow={selectedRow}
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
            <SectorDetail row={selectedRow} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Sectorstry;
