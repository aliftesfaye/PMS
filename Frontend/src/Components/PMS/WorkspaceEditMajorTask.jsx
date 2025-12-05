import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "react-datepicker/dist/react-datepicker.css";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "0.5rem",
      minHeight: "44px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(30, 58, 138, 0.2)" : "none",
      "&:hover": {
        borderColor: "#94a3b8",
      },
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0.25rem",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#1e3a8a"
        : state.isFocused
        ? "#f1f5f9"
        : "white",
      color: state.isSelected ? "white" : "#1e293b",
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      borderRadius: "0.25rem",
      margin: "0.125rem 0",
      "&:active": {
        backgroundColor: "#1e3a8a",
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e0f2fe",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#0369a1",
      fontWeight: "500",
      padding: "0.25rem 0.5rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#0369a1",
      borderRadius: "0 0.375rem 0.375rem 0",
      "&:hover": {
        backgroundColor: "#bae6fd",
        color: "#0c4a6e",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.875rem",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#64748b",
      "&:hover": {
        color: "#475569",
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: "#64748b",
      "&:hover": {
        color: "#475569",
      },
    }),
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const taskData = {
      ...formData,
      start_date: selectedStartDate,
      end_date: selectedEndDate,
      taskmembers: members.map((item) => ({
        project_member_id: item.value,
        UserInfo: { full_name: item.label },
      })),
    };

    try {
      const response = await apiService.updateTask(
        taskData,
        selectedTask.task_id
      );

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
        throw new Error("Task update failed");
      }
    } catch (error) {
      console.error("Task update failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Task Update Failed",
        text: error.response?.data?.message || "An error occurred",
        showConfirmButton: false,
        timer: 2500,
      });
    } finally {
      setIsSubmitting(false);
    }
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
        console.error("Error fetching project members:", error);
      }
    }

    fetchUsers();

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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Task
            </h1>
            <p className="text-gray-600 mt-2">Update task details</p>
            <div className="mt-2 text-sm text-gray-500">
              Task ID:{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {selectedTask.task_id.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleUpdateTask}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter task name"
                      value={formData.name}
                      onChange={handleInputChange}
                      name="name"
                      required
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                {/* Task Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <select
                      value={formData.task_status}
                      onChange={handleInputChange}
                      name="task_status"
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 appearance-none"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        formData.task_status
                      )}`}
                    >
                      {formData.task_status}
                    </span>
                  </div>
                </div>

                {/* Assignees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign Team Members
                  </label>
                  <Select
                    name="members"
                    value={members.map((member) => ({
                      value: member.value,
                      label:
                        memberOptions.find(
                          (option) => option.value === member.value
                        )?.label || member.label,
                    }))}
                    onChange={handleMemberChange}
                    options={memberOptions}
                    isMulti
                    className="w-full"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                    placeholder="Select team members..."
                  />
                </div>

                {/* Milestone Toggle */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                          formData.is_milestone ? "bg-blue-600" : "bg-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            is_milestone: !formData.is_milestone,
                          })
                        }
                      >
                        <div
                          className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                            formData.is_milestone
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="is_milestone"
                          className="text-sm font-medium text-gray-700"
                        >
                          Mark as Milestone Task
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Critical tasks that mark important progress points
                        </p>
                      </div>
                    </div>
                    {formData.is_milestone && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Milestone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Task Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Task Timeline <span className="text-red-500">*</span>
                  </label>

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <DatePicker
                        selected={selectedStartDate}
                        onChange={setSelectedStartDate}
                        minDate={new Date(selectedProject.start_date)}
                        maxDate={new Date(selectedProject.end_date)}
                        className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <DatePicker
                        selected={selectedEndDate}
                        onChange={setSelectedEndDate}
                        minDate={selectedStartDate}
                        maxDate={new Date(selectedProject.end_date)}
                        className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </div>
                </div>

                {/* Context Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">
                      Task Information
                    </span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Project:</div>
                      <div className="font-medium truncate">
                        {selectedProject.name}
                      </div>
                      <div>Created:</div>
                      <div className="font-medium">
                        {new Date(selectedTask.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div>Last Updated:</div>
                      <div className="font-medium">
                        {new Date(selectedTask.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Timeline Reference */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-700 mb-2">
                    Project Timeline Reference:
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="grid grid-cols-2 gap-1">
                      <div>Project Start:</div>
                      <div className="font-medium">
                        {new Date(
                          selectedProject.start_date
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div>Project End:</div>
                      <div className="font-medium">
                        {new Date(selectedProject.end_date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={resetFormData}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Reset Form
              </button>
              <button
                type="submit"
                onClick={handleUpdateTask}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Update Task
                  </>
                )}
              </button>
            </div>

            {/* Required Fields Note */}
            <div className="mt-6 text-sm text-gray-500">
              <span className="text-red-500">*</span> Indicates required fields
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceEditMajorTask;
