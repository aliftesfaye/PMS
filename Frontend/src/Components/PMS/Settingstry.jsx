import React, { useState } from "react";
import Table from "@mui/material/Table";
import { styled } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import logo from '../Assets/logoo.png';
import bg from '../Assets/bg.png';

// Styles for bold table cell
const BoldTableCell = styled(TableCell)({
  "& .header-cell": {
    fontWeight: "bold",
  },
});

const Settingstry = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setEditModalOpen(true);
  };

  const handleViewClick = (row) => {
    setSelectedRow(row);
    setViewModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleViewModalClose = () => {
    setViewModalOpen(false);
  };

  const TablePaginationActions = (props) => {
    const { count, page, rowsPerPage, onPageChange } = props;
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
      <div style={{ flexShrink: 0, marginLeft: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          <FirstPageIcon />
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          <KeyboardArrowLeft />
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          <KeyboardArrowRight />
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          <LastPageIcon />
        </IconButton>
      </div>
    );
  };

  const rows = [
    { id: 1, organizationName: "John Doe", logo: logo, acronym: "New York", backgroundImage: bg },
    { id: 2, organizationName: "Jane Doe", logo: logo, acronym: "Los Angeles", backgroundImage: bg },
    { id: 3, organizationName: "Alice Smith", logo: logo, acronym: "Chicago", backgroundImage: bg },
    { id: 4, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
    { id: 5, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
    { id: 6, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
    { id: 7, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
    { id: 8, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
    { id: 9, organizationName: "Bob Johnson", logo: logo, acronym: "Houston", backgroundImage: bg },
  ];

  return (
    <div className=" ml-auto w-4/5  mt-24">
      <h1 className=" text-2xl font-bold mb-6 mt-6">Settings</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <BoldTableCell>
                <div className="header-cell">OrganizationName</div>
              </BoldTableCell>
              <BoldTableCell>
                <div className="header-cell">Logo</div>
              </BoldTableCell>
              <BoldTableCell>
                <div className="header-cell">Acronym</div>
              </BoldTableCell>
              <BoldTableCell>
                <div className="header-cell">Background Image</div>
              </BoldTableCell>
              <BoldTableCell>
                <div className="header-cell">Actions</div>
              </BoldTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Paginate the rows */}
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.organizationName}</TableCell>
                  <TableCell><img src={row.logo} alt="Logo" style={{ width: "50px" }} /></TableCell>
                  <TableCell>{row.acronym}</TableCell>
                  <TableCell><img src={row.backgroundImage} alt="Background" style={{ width: "50px" }} /></TableCell>
                  <TableCell>
                    <div className=" cursor-pointer flex gap-2 text-white flex-row">
                      <div className="justify-center px-2.5 py-2 bg-sky-500 rounded-md" onClick={() => handleViewClick(row)}>
                        Show
                      </div>
                      <div className="justify-center px-2.5 py-2 bg-amber-500 rounded-md" onClick={() => handleEditClick(row)}>
                        Edit
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            colSpan={5}
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </Table>
      </TableContainer>
      
      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleEditModalClose}>&times;</span>
            <h2>Edit Modal</h2>
            <p>Edit form goes here...</p>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleViewModalClose}>&times;</span>
            <h2>View Modal</h2>
            <p>View details go here...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settingstry;
