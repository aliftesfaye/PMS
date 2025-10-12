import React, { useState, useEffect } from 'react';
import './Sectors.css';
import SearchIcon from '../Assets/Search-icon.png';
import Member1 from '../Assets/Member1.png';
import Leader from '../Assets/Leader.png';
import SectorAdd from './SectorAdd';
import Division from './Division';

import SectorEdit from './SectorEdit';

const Sectors = () => {
  const sectorsData = [
    {
      no: '1',
      name: 'Starting Comittee',
      secleader: Member1,
    },
    {
        no: '2',
        name: 'Technical Comittee',
        secleader: Leader,
      },
      {
        no: '3',
        name: 'Project Manager',
        secleader: Member1,
      },
      {
        no: '4',
        name: 'Technical Manager',
        secleader: Leader,
      },
      {
        no: '5',
        name: 'Client/Owner',
        secleader: Member1,
      },
      {
        no: '6',
        name: 'Project Investigator',
        secleader: Leader,
      },
      {
        no: '7',
        name: 'pm',
        secleader: Member1,
      },
  ];

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateProjectContainer, setShowCreateProjectContainer] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
    setSelectedSector(null);
    setActionType(null);
  };
  const handleDivision = (sector) => {
    setSelectedSector(sector);
    handleCreateProject('Division');
  };
  const handleEdit = (sector) => {
    setSelectedSector(sector);
    handleCreateProject('Edit');
  };
  const handleDelete = (sector) => {
    setSelectedSector(sector);
    handleCreateProject('Delete');
  };
  const totalPages = Math.ceil(sectorsData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sectorsData.length);
  const displayedSectors = sectorsData
  .filter((sector) => sector.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .slice(startIndex, endIndex);
  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      const modal = document.querySelector('.add-sector-container');
      if (modal && !modal.contains(event.target)) {
        handleCloseModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, []);

  return (
    <div className="sectors-container">
      <div className="title">Sectors</div>
      <div className='search-add'>
      <div className="sector-search">
      <img src={SearchIcon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Search by sector Name"
            className="sector-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      <button className="add-sector-button" onClick={() => handleCreateProject('Create')}>
  + Add New sector
</button>
</div>
      <div className="sector">
        <table>
          <thead>
            <tr>
              <th className='numb'>No</th>
              <th>Sector Name</th>
              <th >Leader</th>
              <th className='actions'>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedSectors.map((sector, index) => (
              <tr key={index}>
               <td className='numb'>{sector.no}</td>
                <td className='td-sector-name'>{sector.name}</td>
                <td className='sec-leader'>
                <img src={sector.secleader} alt="" />
                </td>
                <td><div className='actions'>
  <button className="sector-division-button" onClick={() => handleDivision(sector)}>Division</button>
  <button className="sector-edit-button" onClick={() => handleEdit(sector)}>Edit</button>
  <button className="sector-delete-button" onClick={() => handleDelete(sector)}>Delete</button>
  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="prev-button" onClick={handlePreviousPage}> Previous</button>
        {Array.from({ length: totalPages }, (_, index) => (
          <span
            key={index + 1}
            className={currentPage === index + 1 ? 'active-page' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </span>
        ))}
        <button className='next-button' onClick={handleNextPage}>Next</button>
      </div>

      {showCreateProjectContainer && (
        <div className="modal-overlay">
          <div className='add-sector-container'>
            <div className="modal">
              <button className="close-modal" onClick={handleCloseModal}>
                X
              </button>
              {actionType === 'Create' && <SectorAdd />}


              {actionType === 'Division' && (
                <div>
              <Division />
                </div>
              )}
              {actionType === 'Edit' && (
                <div>
                               <SectorEdit />

                </div>
              )}
              {actionType === 'Delete' && (
                <div>
                  
                  <h2>Delete Modal Content</h2>
                  <p>{selectedSector && selectedSector.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sectors;
