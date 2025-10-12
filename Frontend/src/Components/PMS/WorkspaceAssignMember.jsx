import React, { useState } from 'react';
import Swal from 'sweetalert2';
const WorkspaceAssignMember = () => {
  const [milestone] = useState('Received Milestone');
  const [majorTask] = useState('Received Major Task');
  const [subTaskName] = useState('Received Sub Task');
  const [assignee, setAssignee] = useState('');



  const handleAssigneeChange = (event) => {
    setAssignee(event.target.value);
  };

  const handleAssignMember = () => {
    console.log('Assigning member...');
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Member Assigned successfully!',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleCancel = () => {
    console.log('Cancelling...');
  };

  return (
    <div>
      <div className="flex flex-row py-12 pr-9 pl-20 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className="flex flex-col w-6/12">
          <div className="text-2xl font-bold text-blue-950 max-md:max-w-full">
            Assign Member
          </div>
          <div className="mt-8 max-md:max-w-full">
            <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
              <div>Milestone</div>
              <input
                type="text"
                value={milestone}
                readOnly
                className="justify-center items-start px-4 py-5 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
              />
              <div className="mt-8">Major Task</div>
              <input
                type="text"
                value={majorTask}
                readOnly
                className="justify-center items-start px-4 py-5 mt-3 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
              />
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div>Sub Task Name</div>
            <input
              type="text"
              value={subTaskName}
              readOnly              
              className="justify-center items-start px-4 py-5 mt-3.5 text-sm rounded-lg bg-zinc-100 max-md:pr-5"
            />
            <div className="required mt-8">Assignee</div>
            <div className="">
              <select
                value={assignee}
                onChange={handleAssigneeChange}
                className="px-4 mt-4 rounded-lg  border-gray-300 focus:outline-none"
              >
                <option value="" style={{ color: 'gray' }} className="" disabled hidden>
                  Select Assignee
                </option>
                <option value="assignee1">Assignee 1</option>
                <option value="assignee2">Assignee 2</option>
                <option value="assignee3">Assignee 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-5 mr-12 justify-end text-base">
        <button
          className="my-auto bg-white  text-black  border-black px-4 py-2 rounded-lg"
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className="justify-center p-2.5 font-bold text-white bg-sky-500 rounded-lg"
          onClick={handleAssignMember}
        >
          Assign Member
        </button>
      </div>
    </div>
  );
};

export default WorkspaceAssignMember;
