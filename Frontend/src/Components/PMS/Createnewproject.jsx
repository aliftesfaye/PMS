// import React, { useState } from "react";
// import Swal from "sweetalert2";
// import "./Createnewproject.css";

// const Createnewproject = () => {
//   const [formData, setFormData] = useState({
//     title: "",
//     projectmanager: "",
//     technicalmanager: "",
//     members: [],
//     startDate: "",
//     endDate: "",
//     file: null,
//   });
//   const [fileInputKey, setFileInputKey] = useState(0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = () => {
//     console.log("Member assigned!");
//     Swal.fire({
//       position: "top-end",
//       icon: "success",
//       title: "Member assigned successfully!",
//       showConfirmButton: false,
//       timer: 2500,
//     });
//   };

//   const handleCancel = () => {
//     setFormData({
//       title: "",
//       projectmanager: "",
//       technicalmanager: "",
//       members: [],
//       startDate: "",
//       endDate: "",
//       file: null,
//     });

//     setFileInputKey((prevKey) => prevKey + 1);
//   };

//   return (
//     <div className="create-new-project-container w-fit bg-red-300 ">
//       <div className="create-title">Create New Project</div>
//       <form>
//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="title" className="required">
//               Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="form-group">
//             <label htmlFor="startDate" className="required">
//               Project Start Date
//             </label>
//             <input
//               type="date"
//               id="startDate"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="projectmanager" className="required">
//               Project Manager
//             </label>
//             <select
//               id="projectmanager"
//               name="projectmanager"
//               value={formData.projectmanager}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Project Manager</option>
//               <option value="manager1">Manager 1</option>
//               <option value="manager2">Manager 2</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="endDate" className="required">
//               Project End Date
//             </label>
//             <input
//               type="date"
//               id="endDate"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="technicalmanager" className="required">
//               Technical Manager
//             </label>
//             <select
//               id="technicalmanager"
//               name="technicalmanager"
//               value={formData.technicalmanager}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Technical Manager</option>
//               <option value="tech1">Technical 1</option>
//               <option value="tech2">Technical 2</option>
//             </select>
//           </div>

//           <div className="form-group">
//             <label htmlFor="file">Project Related Documents</label>
//             <input
//               type="file"
//               id="file"
//               name="file"
//               key={fileInputKey}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label htmlFor="members" className="required">
//               Members
//             </label>
//             <select
//               id="members"
//               name="members"
//               value={formData.members}
//               onChange={handleChange}
//               required
//               multiple
//             >
//               <option value="">Select Members</option>
//               <option value="tech1">Technical 1</option>
//               <option value="tech2">Technical 2</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex -mt-10 justify-end gap-5">
//           <button className="bg-white" onClick={handleCancel}>
//             Cancel
//           </button>
//           <button className="text-white" onClick={handleSubmit}>
//             Create Project
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Createnewproject;
