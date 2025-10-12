import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

import "react-datepicker/dist/react-datepicker.css";

const WorkspaceAddSubTask = ({
  selectedTask,
  selectedProject,
  handleCloseModal,
  handlefetchSubTask,
}) => {
  const [members, setMembers] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(selectedTask.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(selectedTask.end_date)
  );
  const [startDate, setStartDate] = useState(new Date(selectedTask.start_date));
  const [endDate, setEndDate] = useState(new Date(selectedTask.end_date));
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [formData, setFormData] = useState({
    name: "",
    subtask_status: "Pending",
    start_date: "",
    end_date: "",
    subtaskmembers: [],
    is_milestone: false,
  });

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === "is_milestone" ? checked : value,
    });
  };

  const handleMemberChange = (selectedOption) => {
    if (!selectedOption) return;
    const selectedValues = selectedOption.map((option) => option.value);
    setMembers(selectedValues);
  };

  const showConfirmationModal = async (message) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      customClass: {
        confirmButton: "mr-2",
        cancelButton: "ml-2",
      },
      didOpen: () => {
        const confirmButton = document.querySelector('.swal2-confirm');
        const cancelButton = document.querySelector('.swal2-cancel');
        confirmButton.style.marginRight = '10px'; // Adjust the margin as needed
        cancelButton.style.marginLeft = '10px';  // Adjust the margin as needed
      }
    });
    return result;
  };

  const handleAddSubTask = async (e) => {
    e.preventDefault();
    formData.start_date = selectedStartDate;
    formData.end_date = selectedEndDate;
    if (memberOptions.length > 0) {
      members.push(memberOptions[0].value);
    }
    formData.subtaskmembers.push(...members);
    console.log(formData);

    // Check if selected dates match the task's start and end dates
    const isTaskSameDates =
      selectedStartDate.getTime() === new Date(selectedTask.start_date).getTime() &&
      selectedEndDate.getTime() === new Date(selectedTask.end_date).getTime();

    if (isTaskSameDates) {
      const result = await showConfirmationModal(
        "Do you want to create the subtask with the same start and end dates as the task?"
      );
      if (!result.isConfirmed) {
        return; // Exit if the user selects "No"
      }
    }

    try {
      const response = await apiService.subtaskadd(
        formData,
        selectedTask.task_id
      );
      console.log("Subtask creation response:", response.message);

      if (response.message === "Sub-task created") {
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
          subtaskmembers: [],
        });
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
          title: "New Sub Task has been created",
        }).then(() => {
          handleCloseModal();
          handlefetchSubTask();
        });
      } else {
        console.error("Sub Task Registration Failed");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Sub Task Registration Failed",
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Task Registration Failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Task Registration Failed",
        text: error.response?.data?.message || error.message,
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      subtaskmembers: [],
    });
  };

  useEffect(() => {
    async function fetchUsers() {
      console.log(formData);
      try {
        const users = await apiService.getAllProjectMembers(
          selectedProject.project_id
        );
        const uniqueUserIds = new Set();
        const filteredUsers = users.filter((user) => {
          if (
            user.user_id === userInfo.foundUser.user_id &&
            !uniqueUserIds.has(user.user_id)
          ) {
            uniqueUserIds.add(user.user_id);
            return true;
          }
          return false;
        });

        const options = filteredUsers
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

    async function fetchLoginUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    console.log(userInfo);
    fetchLoginUsers();
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
  }, [userInfo, handleCloseModal]);

  const resetFormData = () => {
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; // Reset each key to an empty string
        setSelectedStartDate(selectedTask.start_date);
        setSelectedEndDate(selectedTask.end_date);
        return acc;
      }, {});
      return resetFormData;
    });
  };

  return (
    <div className="py-4">
      <div className="text-2xl px-16 font-bold text-blue-950 max-md:max-w-full">
        Add Sub Task for{" "}
        <span className="italic" style={{ color: "#0c66e4" }}>
          {selectedTask.name}
        </span>{" "}
        Task
      </div>
      <div className="flex flex-row py-3 px-16 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className="flex flex-col w-6/12 max-md:max-w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div>Sub Task Name</div>
            <input
              type="text"
              value={formData.name}
              placeholder="Enter Sub Task name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 pl-2"
            />
            <div className="flex flex-row mt-12">
              <input
                type="checkbox"
                id="is_milestone"
                name="is_milestone"
                checked={formData.is_milestone}
                onChange={handleInputChange}
                className="h-4 w-4  text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
              />
              <label htmlFor="is_milestone" className="ml-1 ">
                Is Milestone?
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className="">
              Sub Task Start Date <span className="text-red-600">*</span>
            </div>
            <DatePicker
              selected={selectedStartDate}
              onChange={(selectedStartDate) =>
                setSelectedStartDate(selectedStartDate)
              }
              minDate={startDate}
              maxDate={endDate}
              className="h-12 pl-2"
            />
            <div className="mt-8">
              Sub Task End Date <span className="text-red-600">*</span>
            </div>
            <DatePicker
              selected={selectedEndDate}
              onChange={(selectedEndDate) =>
                setSelectedEndDate(selectedEndDate)
              }
              minDate={selectedStartDate}
              maxDate={endDate}
              className="h-12 pl-2"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row px-16 bg-white rounded-2xl max-md:px-5 justify-end">
        <button
          type="button"
          className="flex justify-center items-center p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
          onClick={() => {
            resetFormData();
          }}
        >
          Reset
        </button>
        <button
          className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg"
          onClick={handleAddSubTask}
        >
          Add Sub Task
        </button>
      </div>
    </div>
  );
};

export default WorkspaceAddSubTask;
