import React, { useEffect, useState } from "react";
import SearchIcon from "../Assets/Search-icon.png";
import DivisionAdd from "./DivisionAdd";
import Employees from "./Employees";
import "./Organizationalunits.css";

const Organizationalunits = () => {
  const organizationalunitsData = [
    {
      no: "1",
      name: "Starting Comittee",
      leader: "10/12/2020",
      sector: "sec1",
    },
    {
      no: "2",
      name: "Technical Comittee",
      leader: "10/12/2020",
      sector: "sec1",
    },
    {
      no: "3",
      name: "Project Manager",
      leader: "10/12/2020",
      sector: "sec1",
    },
    {
      no: "4",
      name: "Technical Manager",
      leader: "10/12/2020",
      sector: "sec4",
    },
    {
      no: "5",
      name: "Client/Owner",
      leader: "10/12/2020",
      sector: "sec1",
    },
    {
      no: "6",
      name: "Project Investigator",
      leader: "10/12/2020",
      sector: "sec1",
    },
    {
      no: "1",
      name: "pm",
      leader: "10/12/2020",
      sector: "sec10",
    },
  ];

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateProjectContainer, setShowCreateProjectContainer] =
    useState(false);
  const [selectedOrganizationalunit, setSelectedOrganizationalunit] =
    useState(null);
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateProject = (action) => {
    setActionType(action);
    setShowCreateProjectContainer(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleCloseModal = () => {
    setShowCreateProjectContainer(false);
    setSelectedOrganizationalunit(null);
    setActionType(null);
  };
  const handleEmployees = (organizationalunit) => {
    setSelectedOrganizationalunit(organizationalunit);
    handleCreateProject("Employees");
  };
  const handleEdit = (organizationalunit) => {
    setSelectedOrganizationalunit(organizationalunit);
    handleCreateProject("Edit");
  };
  const handleDelete = (organizationalunit) => {
    setSelectedOrganizationalunit(organizationalunit);
    handleCreateProject("Delete");
  };
  const totalPages = Math.ceil(organizationalunitsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(
    startIndex + itemsPerPage,
    organizationalunitsData.length
  );
  const displayedOrganizationalunits = organizationalunitsData
    .filter((organizationalunit) =>
      organizationalunit.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(startIndex, endIndex);
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      const modal = document.querySelector(".add-organizationalunit-container");
      if (modal && !modal.contains(event.target)) {
        handleCloseModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  return (
    <div className="organizationalunits-container">
      <div className="title">Organizationalunits</div>
      <div className="search-add">
        <div className="organizationalunit-search">
          <img src={SearchIcon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Search by organizationalunit Name"
            className="organizationalunit-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="add-organizationalunit-button"
          onClick={() => handleCreateProject("Create")}
        >
          + Add Division
        </button>
      </div>
      <div className="organizationalunit">
        <table>
          <thead>
            <tr>
              <th className="numb">No</th>
              <th>Organizationalunit Name</th>
              <th>Leader</th>
              <th>Sector</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedOrganizationalunits.map((organizationalunit, index) => (
              <tr key={index}>
                <td className="numb">{organizationalunit.no}</td>
                <td className="organizationalunit-name">
                  {organizationalunit.name}
                </td>
                <td className="leader">{organizationalunit.leader}</td>
                <td className="sectororg">{organizationalunit.sector}</td>
                <td>
                  <div className="orgactions">
                    <button
                      className="organizationalunit-employees-button"
                      onClick={() => handleEmployees(organizationalunit)}
                    >
                      Employees
                    </button>
                    <button
                      className="organizationalunit-edit-button"
                      onClick={() => handleEdit(organizationalunit)}
                    >
                      Edit
                    </button>
                    <button
                      className="organizationalunit-delete-button"
                      onClick={() => handleDelete(organizationalunit)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="prev-button" onClick={handlePreviousPage}>
          {" "}
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index + 1}
            className={currentPage === index + 1 ? "active-page" : ""}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <button className="next-button" onClick={handleNextPage}>
          Next
        </button>
      </div>

      {showCreateProjectContainer && (
        <div className="modal-overlay">
          <div className="add-organizationalunit-container">
            <div className="modal">
              <button className="close-modal" onClick={handleCloseModal}>
                X
              </button>
              {actionType === "Create" && (
                <div>
                  <DivisionAdd />
                </div>
              )}
              {actionType === "Employees" && (
                <div>
                  <Employees />
                </div>
              )}

              {actionType === "Delete" && (
                <div>
                  <h2>Delete Modal Content</h2>
                  <p>
                    {selectedOrganizationalunit &&
                      selectedOrganizationalunit.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organizationalunits;
