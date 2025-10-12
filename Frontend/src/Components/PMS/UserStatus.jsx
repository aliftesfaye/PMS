// import React, { useState } from 'react';
// import warning from "../Assets/warning.png";

// const UserStatus = () => {
//   const [status, setStatus] = useState('idle'); 

//   const handleCancel = () => {
//     setStatus('cancelled');
//   };

//   const handleConfirm = () => {
//     setStatus('confirmed');
//   };

//   return (
//     <div className="flex gap-5 px-12 pt-9 pb-16 bg-white rounded-2xl max-md:flex-wrap max-md:px-5">
//       <div className="flex flex-col grow shrink-0 basis-0 w-fit max-md:max-w-full">
//         <div className="flex gap-2 self-start mt-2.5 text-2xl font-bold text-blue-950">
//           <img
//             src={warning}
//             className="w-8"
//             alt=""
//           />
//           <div className="justify-center py-0.5">Change User Status?</div>
//         </div>
//         <div className="mt-6 text-lg tracking-normal leading-6 text-justify text-zinc-500 max-md:max-w-full">
//           Are you sure you want to change the user's status?
//           <br />
//           <br />
//           Only admins have permission to change user statuses.
//         </div>
        
//         </div>
//       </div>
//   );
// };

// export default UserStatus;
