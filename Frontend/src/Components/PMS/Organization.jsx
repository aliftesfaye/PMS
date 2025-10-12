import { Typography } from "@material-ui/core";
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
import React, { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";

import { BASE_URL, PERMISSIONS } from "../../config";
import apiService from "../services/apiServices";
import Addorganization from "./Addorganization.jsx";
import Editorganization from "./Editorganization";
import Projectdelete from "./Projectdelete";
const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Organization = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [noOrganization, setNoOrganization] = useState("loading ...");

  const [openRowMenu, setOpenRowMenu] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [organizationData, setOrganizationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [eyeIcon, setEyeIcon] = useState("eye");
  const [selectedUser, setSelectedUser] = useState();
  const [selectedUserForStatusChange, setSelectedUserForStatusChange] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [leader, setLeader] = useState("");
  const [userStatus, setUserStatus] = useState();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [createOrganization, setCreateOrganization] = useState(0);
  const [updateOrganization, setUpdateOrganization] = useState(0);

  const [organizationDataInfo, setOrganizationDataInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getOrganization();
      console.log(response);
      const sortedResponse = response.organization.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setOrganizationData(sortedResponse);
      setLeader(response.leader);
      organizationData.length === 0
        ? setNoOrganization("No Organization Found")
        : setNoOrganization("loading ...");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(organizationDataInfo));
    }
    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    fetchUsers();
    fetchPermissions();
    const CREATE_ORGANIZATION = permissions.filter(
      (permission) => permission.name === PERMISSIONS.CREATE_ORGANIZATION
    );

    const UPDATE_ORGANIZATION = permissions.filter(
      (permission) => permission.name === PERMISSIONS.UPDATE_ORGANIZATION
    );

    setCreateOrganization(CREATE_ORGANIZATION.length);
    setUpdateOrganization(UPDATE_ORGANIZATION.length);
  }, [organizationDataInfo, permissions]);

  const handleCreateUser = () => {
    setShowCreateUserModal(true);
  };

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

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowConfirmModal(false);
    }
  };

  const modalRef = useRef(null);

  const handleCloseModal = () => {
    setShowCreateUserModal(false);
  };

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

  const StyledTableRow = withStyles((theme) => ({
    root: {
      height: 40,
    },
  }))(TableRow);

  const StyledTableCell = withStyles((theme) => ({
    root: {
      padding: "0px 20px",
    },
  }))(TableCell);
  const handlefetchUsers = async () => {
    try {
      const usersData = await apiService.getAllOrganization(
        organizationDataInfo.access_token
      );
      const sortedResponse = usersData.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
      });
      setOrganizationDataInfo(sortedResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 relative ">
      <div className="  mb-6">
        <h1 className="text-2xl font-bold">Organization</h1>
      </div>
      {organizationData.length === 0 && createOrganization !== 0 && (
        <div className="flex mb-7 justify-between">
          <button
            className="text-white font-bold py-2 px-4 rounded"
            onClick={() => handleAddClick()}
            style={{ backgroundColor: "#082f49" }}
          >
            + Add Organization
          </button>
        </div>
      )}
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
          {organizationData.length !== 0 ? (
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
                    <div className="header-cell">Organization</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell">Logo</div>
                  </BoldTableCell>
                  <BoldTableCell>
                    <div className="header-cell ml-5">Leader</div>
                  </BoldTableCell>
                  {updateOrganization !== 0 && (
                    <BoldTableCell>
                      <div className="header-cell ">Action</div>
                    </BoldTableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {organizationData.map((row, index) => (
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
                          className={`h-8 w-fit flex  items-center justify-center rounded-md text-`}
                        >
                          <div>{row.name}</div>{" "}
                        </div>
                      </div>
                    </StyledTableCell>
                    <StyledTableCell>
                      <img
                        className="w-7 h-7"
                        src={`${BASE_URL}/images/${row.logo}`}
                        alt="Logo"
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      <div className="flex items-center cursor-pointer">
                        <div
                          className={`h-8 w-fit flex  items-center justify-center rounded-md text-`}
                        >
                          {/* <img
                            src={Leader}
                            alt="Profile"
                            className="profile-image"
                          /> */}
                          <div>
                            {leader
                              ? leader.UserRoleToUser.full_name
                              : "Not Defined"}
                          </div>{" "}
                        </div>
                      </div>
                    </StyledTableCell>
                    {updateOrganization !== 0 && (
                      <StyledTableCell>
                        <div className="cursor-pointer flex gap-2 text-white flex-row relative">
                          <div
                            onClick={() => handleEditClick(row)}
                            className="text-blue-900"
                          >
                            {" "}
                            <FaEdit size={22} />
                          </div>
                        </div>
                      </StyledTableCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div class="text-center self-center p-6">
              <Typography>{noOrganization}</Typography>
            </div>
          )}
        </TableContainer>
      </div>

      {addModalOpen && (
        <div className="fixed  top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-fit h-fit p-5 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleAddModalClose}
            >
              {" "}
              X
            </div>
            <Addorganization
              handleCloseModal={handleAddModalClose}
              handlefetchUsers={handlefetchUsers}
            />
          </div>
        </div>
      )}
      {editModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/3 rounded-md relative">
            <div
              className="close cursor-pointer text-end mr-12 mt-5 "
              onClick={handleEditModalClose}
            >
              {" "}
              X
            </div>
            <Editorganization
              leader={leader}
              selectedRow={selectedRow}
              handleCloseModal={handleEditModalClose}
              handlefetchOrganization={fetchData}
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
            <Projectdelete />
          </div>
        </div>
      )}
    </div>
  );
};
export default Organization;
