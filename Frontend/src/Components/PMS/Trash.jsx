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
      name: 'User Management System',
      deletionDate:'2024/02/02',
      secleader: Member1,
      deletedBy: "Abebe Kebede"
    },
    {
        no: '2',
        name: 'Disease Detection System',
        deletionDate:'2020/01/02',
        secleader: Leader,
        deletedBy: "Naol Atomsa"

      },
      {
        no: '3',
        name: 'Telemedicine System',
        deletionDate:'2024/02/02',
        secleader: Member1,
        deletedBy: "Naol Atomsa"

      },
      {
        no: '4',
        name: 'School Management System',
        deletionDate:'2024/02/02',
        secleader: Leader,
        deletedBy: "Naol Atomsa"

      },
      {
        no: '5',
        name: 'Hotel Management System',
        deletionDate:'2024/02/02',
        secleader: Member1,
      },
      {
        no: '6',
        name: 'Inventory System',
        deletionDate:'2024/02/02',
        secleader: Leader,
      },
      {
        no: '7',
        name: 'PMS',
        deletionDate:'2024/02/02',
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
 

  const handleRestore = (sector) => {
    setSelectedSector(sector);
    handleCreateProject('Restore');
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
      <div className="title">Trash</div>
      <div className='search-add '>
      <div className="sector-search" style={{ marginLeft: '670px'}}>
      <img src={SearchIcon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Search"
            className="sector-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
      <select className="add-sector" style={{ 
  marginLeft: '-940px', 
  width:'200px', 
  borderRadius: '4px', 
  border: '1px solid #ccc' 
}} onChange={(e) => handleCreateProject(e.target.value)}>    <option value="">Select </option>
    <option value="Projects">Projects</option>
    <option value="Milestones">Milestones</option>
    <option value="Major Tasks">Major Tasks</option>
    <option value="Main Tasks">Main Tasks</option>
  </select>
</div>
      <div className="sector">
        <table>
          <thead>
            <tr>
              <th className='numb'>No</th>
              <th>Name </th>
              <th>Deletion Date</th>
              <th >Deleted By</th>
              <th className='actions'>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedSectors.map((sector, index) => (
              <tr key={index}>
               <td className='numb'>{sector.no}</td>
                <td className='td-sector-name'>{sector.name}</td>
                <td>{sector.deletionDate}</td>
                <td className='sec-leader'>
                <img src={sector.secleader} alt="" />
                </td>
                <td><div className='actions'>

  <button className="sector-division-button " onClick={() => handleRestore(sector)}
   style={{
    padding: '8px 16px',
    color: 'white',
    border: 'none',
    marginLeft: '30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  }}>Restore</button>
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


              
              {actionType === 'Restore' && (
                <div>
                  
                  <h2>Restore Modal Content</h2>
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
