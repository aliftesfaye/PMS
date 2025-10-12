import React from 'react';
import Swal from 'sweetalert2';
const Addmembertoproject = ({ onCancel }) => {
  const handleAdd = () => {
  console.log("Member assigned!");
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Member assigned successfully!",
    showConfirmButton: false,
    timer: 2500
  }).then(() => {
    onCancel();
  });

};
  
    
      const handleCancel = () => {
        console.log("Adding cancelled!");
      };
  return (
    <div>
      <div className="flex flex-col w-fit  py-2  pl-5 max-md:px-5">
        
        <div className="text-2xl font-bold text-blue-950 max-md:max-w-full">
          Add Member
        </div>
        <div className="mt-5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col max-md:ml-0 max-md:w-full">
              <div className=" flex flex-col grow py-1 text-base text-slate-950">
                <div className="mb-4">Project</div>
                <input
                  type="text"
                  className="-mb-4 justify-center items-start px-4 py-2 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
                  placeholder="Smart Court System"
                />
                <div className="required mt-8">Name</div>
                <select
                  className="px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
                >
                      <option value="" disabled selected hidden>Select Member</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Web App">Web App</option>
                  <option value="Desktop App">Desktop App</option>
                </select>
                <div className="required mt-3">Role</div>
                <select
                  className="px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
                >
                      <option value="" disabled selected hidden > Select Role</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Web App">Web App</option>
                  <option value="Desktop App">Desktop App</option>
                </select>
              </div>
              
            </div>
            <div className=" flex flex-col ml-5 -mt-7 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
              <div className="mt-8">Milestone</div>
<select
  className="-mb-4 px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
>
<option value="" disabled selected hidden className="text-gray-100">Select milestone</option>
  <option value="Mobile App">Mobile App</option>
  <option value="Web App">Web App</option>
  <option value="Desktop App">Desktop App</option>
</select>
                <div className="mt-8">Major Task</div>
                <select
                  className=" -mb-4 px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
                >
                      <option value="" disabled selected hidden>Select Major Task</option>
                  <option value="UI Design">UI Design</option>
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                </select>
                <div className="mt-8  ">Sub Task</div>
                <select
                  className=" px-4 py-2 mt-3 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
                > 
                 <option value="" disabled selected hidden>Select Sub Task</option>
                  <option value="Login Page Design">Login Page Design</option>
                  <option value="Dashboard Design">Dashboard Design</option>
                  <option value="Profile Page Design">Profile Page Design</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="  flex gap-5 justify-between self-end mt-6 text-base">
        <button className="my-auto text-black bg-white" onClick={handleCancel}>Cancel</button>
          <button className="justify-center p-2.5 font-bold text-white bg-sky-500 rounded-lg"
          onClick={handleAdd}>Assign Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addmembertoproject;
