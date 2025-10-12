import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const WorkspaceAddMajorTask = ({
  selectedActivity,
  selectedProject,
  handleCloseModal,
  handlefetchTask,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    task_status: "Pending",
    start_date: "",
    end_date: "",
    taskmembers: [],
    is_milestone: false,
  });
  const [members, setMembers] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(selectedActivity.activity.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(selectedActivity.activity.end_date)
  );
  const [startDate, setStartDate] = useState(
    new Date(selectedActivity.activity.start_date)
  );
  const [endDate, setEndDate] = useState(
    new Date(selectedActivity.activity.end_date)
  );

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === "is_milestone" ? checked : value,
    });
  };

  const handleMemberChange = (selectedOption) => {
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
        const confirmButton = document.querySelector(".swal2-confirm");
        const cancelButton = document.querySelector(".swal2-cancel");
        confirmButton.style.marginRight = "10px"; // Adjust the margin as needed
        cancelButton.style.marginLeft = "10px"; // Adjust the margin as needed
      },
    });
    return result;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    formData.start_date = selectedStartDate;
    formData.end_date = selectedEndDate;
    formData.taskmembers.push(...members);

    // Check if selected dates match the activity's start and end dates
    const isActivitySameDates =
      selectedStartDate.getTime() ===
        new Date(selectedActivity.activity.start_date).getTime() &&
      selectedEndDate.getTime() ===
        new Date(selectedActivity.activity.end_date).getTime();

    if (isActivitySameDates) {
      const result = await showConfirmationModal(
        "Do you want to create the task with the same start date and end dates as the activity?"
      );
      if (!result.isConfirmed) {
        return; // Exit if the user selects "No"
      }
    }

    try {
      const response = await apiService.taskadd(
        formData,
        selectedActivity.activity.activity_id
      );
      console.log("Task creation response:", response.message);

      if (response.message === "New task created") {
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
          title: "New Task has been created",
        }).then(() => {
          handleCloseModal();
          handlefetchTask();
        });
      } else {
        console.error("Task Registered Failed");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Task Registration Failed",
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
        text: error.response.data.message,
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      marginTop: "-5px",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      start_date: "",
      end_date: "",
      taskmembers: [],
    });
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
  }, [handleCloseModal]);

  const resetFormData = () => {
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; // Reset each key to an empty string
        setMembers([]);
        setSelectedStartDate(selectedActivity.activity.start_date);
        setSelectedEndDate(selectedActivity.activity.end_date);
        return acc;
      }, {});
      return resetFormData;
    });
  };

  return (
    <div className="py-4">
      <div className="text-2xl px-16 font-bold text-blue-950 max-md:max-w-full">
        Add Task for{" "}
        <span className="italic" style={{ color: "#0c66e4" }}>
          {selectedActivity.activity.name}
        </span>{" "}
        Activity
      </div>
      <div className="flex flex-row py-3 px-16 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className="flex flex-col w-6/12 max-md:max-w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className="mb-2">Task Name</div>
            <input
              type="text"
              value={formData.name}
              placeholder="Enter Task  name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-12 pl-2"
            />

            <div className="mt-8 mb-2">Assignee</div>
            <Select
              name="members"
              value={members.map((member) => ({
                value: member,
                label: memberOptions.find((option) => option.value === member)
                  ?.label,
              }))}
              onChange={handleMemberChange}
              options={memberOptions}
              isMulti
              closeMenuOnSelect={false}
              styles={customStyles}
            />
            <div className="flex flex-row mt-4  ">
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

        <div className=" flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className="mb-2">
              Task Start Date <span className="text-red-600">*</span>
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
            <div className="mt-8 mb-2">
              Task End Date <span className="text-red-600">*</span>
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
      <div className="flex flex-row px-16 bg-white rounded-2xl max-w-[925px] max-md:px-5 justify-end">
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
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default WorkspaceAddMajorTask;
