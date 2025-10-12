import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const WorkspaceEditMajorTask = ({
  selectedActivity,
  selectedTask,
  handleCloseModal,
  handlefetchActivity,
  selectedProject,
}) => {
  const [formData, setFormData] = useState({
    name: selectedTask.name,
    start_date: selectedTask.start_date,
    task_status: selectedTask.task_status,
    end_date: selectedTask.end_date,
    taskmembers: [],
    is_milestone: selectedTask.is_milestone || false,
  });
  const [initialFormData] = useState({
    name: selectedTask.name,
    start_date: selectedTask.start_date,
    task_status: selectedTask.task_status,
    end_date: selectedTask.end_date,
    taskmembers: [],
    is_milestone: selectedTask.is_milestone || false,
  });
  
  const [initialMembers] = useState(
    selectedTask.members.map((user) => ({
      value: user.project_member_id,
      label: user.UserInfo.full_name,
    }))
  );
  

  const [members, setMembers] = useState(
    selectedTask.members.map((user) => ({
      value: user.project_member_id,
      label: user.UserInfo.full_name,
    }))
  );
  const [memberOptions, setMemberOptions] = useState([]);

  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(selectedTask.start_date)
  );

  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(selectedTask.end_date)
  );

  const handleUpdateTask = async (e) => {
    e.preventDefault();

    formData.start_date = selectedStartDate;
    formData.end_date = selectedEndDate;
    const newMembers = members.map((item) => {
      return {
        ...item,
        project_member_id: item.value,
        UserInfo: { full_name: item.label },
      };
    });
    formData.taskmembers.push(...newMembers);

    try {
      const response = await apiService.updateTask(
        formData,
        selectedTask.task_id
      );
      console.log("Existing Inputs:", formData);
      console.log("Response: ", response);

      if (response.status === 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "Task Updated Successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchActivity();
        });
      } else {
        console.error("failed : ", response);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Task Update Failed",
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Task Update Failed",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      marginTop: "-5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await apiService.getAllProjectMembers(
          selectedProject.project_id
        );

        const options = users
          .map((user) => ({
            value: user.project_member_id,
            label: user.UserInfo.full_name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setMemberOptions(options);
      } catch (error) {
        console.error("Error fetching users and document types:", error);
      }
    }

    fetchUsers();
    // Event listener for Esc key to close modal
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedProject.project_id, handleCloseModal]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const resetFormData = () => {
    setFormData({
      ...initialFormData,
      start_date: new Date(initialFormData.start_date),
      end_date: new Date(initialFormData.end_date),
    });
    setMembers(initialMembers); 
    setSelectedStartDate(new Date(initialFormData.start_date));
    setSelectedEndDate(new Date(initialFormData.end_date));
  };
  

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setMembers(selectedValues);
  };

  const handleCancel = () => {
    console.log("Cancelling...");
    handleCloseModal();
  };


  

  return (
    <div>
      <div className="flex flex-row py-12 pr-9 pl-20 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className="flex flex-col w-6/12">
          <div className="text-2xl font-bold text-blue-950 max-md:max-w-full">
            Edit Task
          </div>
          <div className="mt-8 max-md:max-w-full">
            <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
              <div className="">Task</div>
              <input
                type="text"
                placeholder={formData.name}
                value={formData.name}
                onChange={handleInputChange}
                name="name"
                className="h-12 pl-4"
              />

              <div className="mt-8 ">Task Status</div>
              <select
                value={formData.task_status}
                onChange={handleInputChange}
                name="task_status"
                className="h-12 pl-2 border-x-2 border-y-2"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="mt-8">Assignee</div>
              <Select
                name="members"
                value={members.map((member) => ({
                  value: member.value,
                  label: memberOptions.find(
                    (option) => option.value === member.value
                  )?.label,
                }))}
                onChange={handleMemberChange}
                options={memberOptions}
                isMulti
                className="mr-10 mt-3"
                closeMenuOnSelect={false}
                styles={customStyles}
              />

              <div className="flex flex-row mt-4">
                <input
                  type="checkbox"
                  id="is_milestone"
                  name="is_milestone"
                  checked={formData.is_milestone}
                  onChange={handleInputChange}
                  className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                />
                <label htmlFor="is_milestone" className="ml-3">
                  Is Milestone?
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className="mx-8">Task Start Date</div>
            <DatePicker
              selected={selectedStartDate}
              onChange={setSelectedStartDate}
              minDate={new Date(selectedProject.start_date)}
              maxDate={new Date(selectedProject.end_date)}
              className="h-12 pl-2 mx-8"
            />
            <div className="mt-8 mx-8 ">Task End Date</div>
            <DatePicker
              selected={selectedEndDate}
              onChange={setSelectedEndDate}
              minDate={selectedStartDate}
              maxDate={new Date(selectedProject.end_date)}
              className="h-12 pl-2 mt-3 mx-8"
            />
            <div className="flex  mt-20 justify-end text-base">
              <button
                type="button"
                className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
                onClick={() => {
                  resetFormData();
                }}
              >
                Reset
              </button>
              <button
                className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg"
                onClick={handleUpdateTask}
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceEditMajorTask;
