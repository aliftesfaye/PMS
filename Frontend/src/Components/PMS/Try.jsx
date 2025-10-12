// import React, { useState, useEffect } from 'react';
// import { Table } from 'react-bootstrap';
// import Createnewproject from './Createnewproject';
// import { Badge } from '@material-ui/core';
// import { AiOutlineCloseCircle } from 'react-icons/ai';
// import { TiTick } from 'react-icons/ti';

// const Projects = () => {
//     const projectsData = [
//             {
//               name: 'Project 1',
//               dueDate: '2024-03-01',
//               status: 'Completed',
//               projmanager: 'Leader',
//               technicalManager: 'Leader',
//               members: ['Member1', 'Leader', 'Member1'],
//             },
//             {
//               name: 'Project 2',
//               dueDate: '2024-03-01',
//               status: 'Process',
//               projmanager: 'Member1',
//               technicalManager: 'Leader',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//             {
//               name: 'Project 3',
//               dueDate: '2024-03-01',
//               status: 'Canceled',
//               projmanager: 'Leader',
//               technicalManager: 'Member1',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//             {
//               name: 'Project 4',
//               dueDate: '2024-03-01',
//               status: 'Canceled',
//               projmanager: 'Member1',
//               technicalManager: 'Leader',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//             {
//               name: 'Hoject 5',
//               dueDate: '2024-03-01',
//               status: 'Process',
//               projmanager: 'Member1',
//               technicalManager: 'Member1',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//             {
//               name: 'apbc 6',
//               dueDate: '2024-03-01',
//               status: 'Process',
//               projmanager: 'Leader',
//               technicalManager: 'Member1',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//              {
//               name: 'Hoject 5',
//               dueDate: '2024-03-01',
//               status: 'Process',
//               projmanager: 'Member1',
//               technicalManager: 'Member1',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//              {
//               name: 'Hoject 5',
//               dueDate: '2024-03-01',
//               status: 'Process',
//               projmanager: 'Member1',
//               technicalManager: 'Member1',
//               members: ['Member1', 'Member1', 'Leader'],
//             },
//           ];

//           const itemsPerPage = 6;
//           const [currentPage, setCurrentPage] = useState(1);
//           const [selectedStatus, setSelectedStatus] = useState('All');
//           const [showCreateProjectContainer, setShowCreateProjectContainer] = useState(false);

//           const handleStatusFilter = (status) => {
//             setSelectedStatus(status);
//             setCurrentPage(1);
//           };

//           const handleCreateProject = () => {
//             setShowCreateProjectContainer(true);
//           };

//           const handlePageChange = (page) => {
//             setCurrentPage(page);
//           };

//           const handlePreviousPage = () => {
//             setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
//           };

//           const handleNextPage = () => {
//             setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
//           };

//           const handleCloseModal = () => {
//             setShowCreateProjectContainer(false);
//           };

//           const filteredProjects =
//             selectedStatus === 'All'
//               ? projectsData
//               : projectsData.filter((project) => project.status.toLowerCase() === selectedStatus.toLowerCase());

//           const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

//           const startIndex = (currentPage - 1) * itemsPerPage;
//           const endIndex = Math.min(startIndex + itemsPerPage, filteredProjects.length);

//           const displayedProjects = filteredProjects.slice(startIndex, endIndex);

//           const getColorByRange = (value) => {
//             if (!value) return 'black';

//             const colorRanges = [
//               { range: ['a'.charCodeAt(0), 'e'.charCodeAt(0)], color: 'red' },
//               { range: ['f'.charCodeAt(0), 'j'.charCodeAt(0)], color: 'green' },
//               { range: ['k'.charCodeAt(0), 'o'.charCodeAt(0)], color: 'purple' },
//               { range: ['p'.charCodeAt(0), 't'.charCodeAt(0)], color: 'blue' },
//               { range: ['u'.charCodeAt(0), 'z'.charCodeAt(0)], color: 'gray' },
//             ];

//             const charCode = value.toLowerCase().charCodeAt(0);
//             const rangeMatch = colorRanges.find(range => charCode >= range.range[0] && charCode <= range.range[1]);
//             return rangeMatch ? rangeMatch.color : '';
//           };

//           useEffect(() => {
//             const handleClickOutsideModal = (event) => {
//               const modal = document.querySelector('.create-project-container');
//               if (modal && !modal.contains(event.target)) {
//                 handleCloseModal();
//               }
//             };

//             document.addEventListener('mousedown', handleClickOutsideModal);

//             return () => {
//               document.removeEventListener('mousedown', handleClickOutsideModal);
//             };
//           }, []);

//           return (
//             <div className="min-h-screen w-auto  mx-auto p-4">
//               <div className="text-2xl font-bold mb-4">Projects</div>
//               <div className="flex space-x-4 mb-4">
//                 <span
//                   className={`cursor-pointer ${selectedStatus === 'All' ? 'text-blue-500' : 'text-gray-500'}`}
//                   onClick={() => handleStatusFilter('All')}
//                 >
//                   All
//                 </span>
//                 <span
//                   className={`cursor-pointer ${selectedStatus === 'Completed' ? 'text-blue-500' : 'text-gray-500'}`}
//                   onClick={() => handleStatusFilter('Completed')}
//                 >
//                   Completed
//                 </span>
//                 <span
//                   className={`cursor-pointer ${selectedStatus === 'Process' ? 'text-blue-500' : 'text-gray-500'}`}
//                   onClick={() => handleStatusFilter('Process')}
//                 >
//                   Process
//                 </span>
//                 <span
//                   className={`cursor-pointer ${selectedStatus === 'Canceled' ? 'text-blue-500' : 'text-gray-500'}`}
//                   onClick={() => handleStatusFilter('Canceled')}
//                 >
//                   Canceled
//                 </span>
//                 <button
//                   className="c-button"
//                   style={{ marginLeft: '37.5%' }}
//                   onClick={() => handleCreateProject()}
//                 >
//                   + Create New Project
//                 </button>
//               </div>

//               <div>
//                 <Table responsive="sm" className="proj">
//                   <thead>
//                     <tr>
//                       <th>Project Name</th>
//                       <th>Due Date</th>
//                       <th>Status</th>
//                       <th>Project Manager</th>
//                       <th>Technical Manager</th>
//                       <th>Members</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {displayedProjects.map((project, index) => (
//                       <tr key={index}>
//                         <td>
//                           <span className="initials" style={{ backgroundColor: getColorByRange(project.name.charAt(0)) }}>
//                             {project.name.charAt(0).toUpperCase()}
//                           </span>
//                           {project.name}
//                         </td>
//                         <td>{project.dueDate}</td>
//                         <td>
//                           {project.status === 'Completed' && <Badge color="primary"><TiTick /></Badge>}
//                           {project.status === 'Canceled' && <Badge color="secondary"><AiOutlineCloseCircle /></Badge>}
//                           {project.status === 'Process' && <Badge color="warning">Process</Badge>}
//                         </td>
//                         <td>
//                           <img src={require(`../Assets/${project.projmanager}.png`)} alt="Project Manager"/>
//                         </td>
//                         <td>
//                           <img src={require(`../Assets/${project.technicalManager}.png`)} alt="Technical Manager"/>
//                         </td>
//                         <td className="flex space-x-2">
//                           {project.members.map((member, memberIndex) => (
//                             <img
//                               key={memberIndex}
//                               src={require(`../Assets/${member}.png`)}
//                               alt={`Member ${memberIndex + 1}`}
//                               className="member-image"
//                             />
//                           ))}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>

//               <div className="flex justify-content-center mt-4">
//               <button
//   className="prev-button text-white px-4 py-2"
//   onClick={handlePreviousPage}
// >
//   Previous
// </button>
// <div className="flex space-x-2">
//   {Array.from({ length: totalPages }, (_, index) => (
//     <span
//       key={index + 1}
//       className={`cursor-pointer ${currentPage === index + 1 ? 'text-blue-500' : 'text-gray-500'}`}
//       onClick={() => handlePageChange(index + 1)}
//     >
//       {index + 1}
//     </span>
//   ))}
// </div>
// <button
//   className="prev-button text-white px-4 py-2 rounded"
//   onClick={handleNextPage}
// >
//   Next
// </button>

//               </div>

//               {showCreateProjectContainer && (
//                 <div className="modal-overlay">
//                   <div className='create-project-container'>
//                     <div className="modal">
//                       <button className="close-modal" onClick={handleCloseModal}>X</button>
//                       <Createnewproject />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         };

//         export default Projects;
