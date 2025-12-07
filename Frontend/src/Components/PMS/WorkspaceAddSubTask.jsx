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
  const [startDate] = useState(new Date(selectedTask.start_date));
  const [endDate] = useState(new Date(selectedTask.end_date));
  const [userInfo] = useState(() => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === "is_milestone" ? checked : value,
    });
  };

  const showConfirmationModal = async (message) => {
    const result = await Swal.fire({
      title: "Same Dates Detected",
      text: message,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Continue",
      cancelButtonText: "No, Change Dates",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "px-6 py-2 rounded-lg",
        cancelButton: "px-6 py-2 rounded-lg",
      },
      buttonsStyling: false,
      reverseButtons: true,
    });
    return result;
  };

  const handleAddSubTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Check if selected dates match the task's start and end dates
    const isTaskSameDates =
      selectedStartDate.getTime() === new Date(selectedTask.start_date).getTime() &&
      selectedEndDate.getTime() === new Date(selectedTask.end_date).getTime();

    if (isTaskSameDates) {
      const result = await showConfirmationModal(
        "Do you want to create the subtask with the same start and end dates as the task?"
      );
      if (!result.isConfirmed) {
        setIsSubmitting(false);
        return;
      }
    }

    const subtaskData = {
      ...formData,
      start_date: selectedStartDate,
      end_date: selectedEndDate,
      subtaskmembers: [...members],
    };

    // Add current user if no members selected and options available
    if (memberOptions.length > 0 && members.length === 0) {
      subtaskData.subtaskmembers.push(memberOptions[0].value);
    }

    try {
      const response = await apiService.subtaskadd(
        subtaskData,
        selectedTask.task_id
      );

      if (response.message === "Sub-task created") {
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
          title: "New Sub Task Created",
        }).then(() => {
          handleCloseModal();
          handlefetchSubTask();
        });
      } else {
        throw new Error("Subtask creation failed");
      }
    } catch (error) {
      console.error("Sub Task Registration Failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Sub Task Creation Failed",
        text: error.response?.data?.message || error.message,
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

        // Filter to include only the current user
        const filteredUsers = users.filter((user) =>
          user.user_id === userInfo.foundUser?.user_id
        );

        const options = filteredUsers
          .map((user) => ({
            value: user.project_member_id,
            label: user.UserInfo.full_name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setMemberOptions(options);

        // Auto-select current user if available
        if (options.length > 0 && members.length === 0) {
          setMembers([options[0].value]);
        }
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
  }, [userInfo, handleCloseModal, selectedProject.project_id]);

  const resetFormData = () => {
    setFormData({
      name: "",
      subtask_status: "Pending",
      start_date: "",
      end_date: "",
      subtaskmembers: [],
      is_milestone: false,
    });
    setSelectedStartDate(new Date(selectedTask.start_date));
    setSelectedEndDate(new Date(selectedTask.end_date));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Add New Sub Task</h1>
            <p className="text-gray-600 mt-2">
              Add a sub task to{" "}
              <span className="font-semibold text-blue-900">{selectedTask.name}</span>
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div>
                  Task ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{selectedTask.task_id}</span>
                </div>
                <div>
                  Project: <span className="font-medium">{selectedProject.name}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleAddSubTask}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Sub Task Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Task Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      placeholder="Enter sub task name"
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                {/* Auto-Assigned User Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">Assigned To</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {userInfo.foundUser?.full_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <div className="font-medium">{userInfo.foundUser?.full_name || "Current User"}</div>
                        <div className="text-xs text-blue-600">Auto-assigned (you)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Toggle */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${formData.is_milestone ? 'bg-blue-600' : 'bg-gray-300'}`}
                        onClick={() => setFormData({ ...formData, is_milestone: !formData.is_milestone })}>
                        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${formData.is_milestone ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                      <div>
                        <label htmlFor="is_milestone" className="text-sm font-medium text-gray-700">
                          Mark as Milestone Sub Task
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Important sub tasks that mark progress checkpoints
                        </p>
                      </div>
                    </div>
                    {formData.is_milestone && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        Milestone
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Sub Task Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Sub Task Timeline <span className="text-red-500">*</span>
                  </label>

                  {/* Start Date */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <DatePicker
                        selected={selectedStartDate}
                        onChange={(date) => setSelectedStartDate(date)}
                        minDate={startDate}
                        maxDate={endDate}
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
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <DatePicker
                        selected={selectedEndDate}
                        onChange={(date) => setSelectedEndDate(date)}
                        minDate={selectedStartDate}
                        maxDate={endDate}
                        className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        dateFormat="MMMM d, yyyy"
                      />
                    </div>
                  </div>
                </div>

                {/* Task Information */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-blue-900">Parent Task Information</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Task:</div>
                      <div className="font-medium truncate">{selectedTask.name}</div>
                      <div>Task Start:</div>
                      <div className="font-medium">
                        {new Date(selectedTask.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div>Task End:</div>
                      <div className="font-medium">
                        {new Date(selectedTask.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div>Task Status:</div>
                      <div className="font-medium">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${selectedTask.task_status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedTask.task_status === "In Progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                          }`}>
                          {selectedTask.task_status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Task Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Sub Task Status
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <select
                      value={formData.subtask_status}
                      onChange={(e) => setFormData({ ...formData, subtask_status: e.target.value })}
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50 appearance-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${formData.subtask_status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : formData.subtask_status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {formData.subtask_status}
                    </span>
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Form
              </button>
              <button
                type="submit"
                onClick={handleAddSubTask}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Sub Task...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Sub Task
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

export default WorkspaceAddSubTask;