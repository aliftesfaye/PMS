import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import apiService from "../services/apiServices";

const Projectsedit = ({
  selectedRow,
  handleCloseModal,
  handlefetchProjects,
}) => {
  console.log(selectedRow);
  const [title, SetTitle] = useState(selectedRow.name);
  const [budget, setBudget] = useState(selectedRow.budget);
  const [projectManager, setProjectManager] = useState(
    selectedRow.project_manager.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );
  const [technicalManager, setTechnicalManager] = useState(
    selectedRow.technical_manager.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: selectedRow.division?.division_id || "",
    label: selectedRow.division?.name || "Select Department",
  });
  const [divisions, setDivisions] = useState([]);
  const [members, setMembers] = useState(
    selectedRow.project_member.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );

  const s_date = new Date(selectedRow.start_date);
  const formattedDate = s_date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const e_date = new Date(selectedRow.end_date);
  const formattedEndDate = e_date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const formattedDateString = moment(formattedDate, "MM/DD/YYYY").format(
    "YYYY-MM-DD"
  );
  const formattedDateEndString = moment(formattedEndDate, "MM/DD/YYYY").format(
    "YYYY-MM-DD"
  );

  const [startDate, setStartDate] = useState(formattedDateString);
  const [endDate, setEndDate] = useState(formattedDateEndString);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [description, setDescription] = useState("");
  const [isDepartmentAdmin, setIsDepartmentAdmin] = useState(false);
  const [includeDepartment, setIncludeDepartment] = useState(
    !!selectedRow?.division
  );
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [file, seFile] = useState("");
  const [document_type, setDocument_type] = useState([]);
  const [projectManagerOptions, setProjectManagerOptions] = useState([]);
  const [technicalManagerOptions, setTechnicalManagerOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

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

  const resetFormData = () => {
    SetTitle(selectedRow.name);
    setBudget(selectedRow.budget);
    setProjectManager(
      selectedRow.project_manager.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    setTechnicalManager(
      selectedRow.technical_manager.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    setMembers(
      selectedRow.project_member.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    const s_date = new Date(selectedRow.start_date);
    const formattedDate = s_date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const e_date = new Date(selectedRow.end_date);
    const formattedEndDate = e_date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const formattedDateString = moment(formattedDate, "MM/DD/YYYY").format(
      "YYYY-MM-DD"
    );
    const formattedDateEndString = moment(
      formattedEndDate,
      "MM/DD/YYYY"
    ).format("YYYY-MM-DD");
    setStartDate(formattedDateString);
    setEndDate(formattedDateEndString);
    setDocument_type([]);
    setSelectedDocType(null);
    setProjectDocuments([]);
    setDescription("");
  };

  const fetchDivisions = async () => {
    try {
      const divisionsData = await apiService.getDivisions(
        userInfo.access_token
      );
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  useEffect(() => {
    fetchDivisions();
    const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
      (role) => !role.project_related
    ).map((role) => role.name);

    const isDepartmentAdminRolePresent =
      nonProjectRelatedRoles.includes("Department Admin");

    if (isDepartmentAdminRolePresent) {
      setIsDepartmentAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (selectedRow && selectedRow.division) {
      setSelectedDepartment({
        value: selectedRow.division.division_id,
        label: selectedRow.division.name || "Select Department",
      });
    } else {
      setSelectedDepartment({
        value: "",
        label: "Select Department",
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    async function fetchUsersAndDocTypes() {
      try {
        const users = await apiService.getAllUsers(userInfo.access_token);
        const options = users.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));
        setProjectManagerOptions(options);
        setTechnicalManagerOptions(options);
        setMemberOptions(options);

        const docTypes = await apiService.documentTypegetAll();
        const docTypeOptions = docTypes.map((docType) => ({
          value: docType.document_type_id,
          label: docType.document_type,
        }));
        setDocTypeOptions(docTypeOptions);
      } catch (error) {
        console.error("Error fetching users and document types:", error);
      }
    }

    fetchUsersAndDocTypes();
  }, [userInfo]);

  const handleProjectManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setProjectManager(selectedValues);
  };

  const handleTechnicalManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setTechnicalManager(selectedValues);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setProjectDocuments(Array.from(e.target.files));
    seFile(selectedFile);
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;

    if (new Date(newEndDate) < new Date(startDate)) {
      alert(
        "End date cannot be before the start date. Please select a valid end date."
      );
      e.target.value = endDate;
    } else {
      setEndDate(newEndDate);
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIncludeDepartment(checked);
    if (!checked) {
      setSelectedDepartment({
        value: "",
        label: "",
      });
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;

    if (new Date(newStartDate) > new Date(endDate)) {
      setStartDate(newStartDate); // Update the start date to the new value
      setEndDate(""); // Clear the end date field
    } else {
      setStartDate(newStartDate);
    }
  };

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setMembers(selectedValues);
  };

  const handleDocTypeChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setDocument_type(selectedValue);
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newDataToSend = {
        title,
        budget,
        projectManager,
        technicalManager,
        members,
        startDate,
        endDate,
        document_type: selectedDocType,
        documents: projectDocuments,
        division_id: includeDepartment ? selectedDepartment.value : null,
      };
      const response = await apiService.updateProject(
        selectedRow,
        newDataToSend
      );
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
        title: "Project updated successfully",
      }).then(() => {
        handleCloseModal();
        handlefetchProjects();
      });
    } catch (error) {
      console.error("Error updating project:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update project",
        text: error.response?.data?.message || "An error occurred",
        showConfirmButton: false,
        timer: 2500,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIncludeDepartmentChange = (e) => {
    setIncludeDepartment(e.target.checked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Edit Project
            </h1>
            <p className="text-gray-600 mt-2">Update project details</p>
            <div className="mt-2 text-sm text-gray-500">
              Project ID:{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {selectedRow.project_id.slice(0, 8)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title <span className="text-red-500">*</span>
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="title"
                      placeholder="Enter Project Title"
                      value={title}
                      onChange={(e) => SetTitle(e.target.value)}
                      required
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                {/* Project Manager */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Manager <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="projectManager"
                    value={projectManager.map((manager) => ({
                      value: manager.value,
                      label:
                        projectManagerOptions.find(
                          (option) => option.value === manager.value
                        )?.label || manager.label,
                    }))}
                    onChange={handleProjectManagerChange}
                    options={projectManagerOptions}
                    isMulti
                    className="w-full"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                    placeholder="Select project managers..."
                    required
                  />
                </div>

                {/* Technical Manager */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Manager <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="technicalManager"
                    value={technicalManager.map((manager) => ({
                      value: manager.value,
                      label:
                        projectManagerOptions.find(
                          (option) => option.value == manager.value
                        )?.label || manager.label,
                    }))}
                    onChange={handleTechnicalManagerChange}
                    options={technicalManagerOptions}
                    isMulti
                    className="w-full"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                    placeholder="Select technical managers..."
                    required
                  />
                </div>

                {/* Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Members <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="members"
                    value={members.map((member) => ({
                      value: member.value,
                      label:
                        projectManagerOptions.find(
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
                    required
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Budget
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      name="budget"
                      placeholder="Enter amount in numbers"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                    />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
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
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={startDate}
                        onChange={handleStartDateChange}
                        required
                        className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
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
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={endDate}
                        onChange={handleEndDateChange}
                        required
                        className="pl-10 w-full px-4 py-3 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-gray-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Department Selection */}
                {!isDepartmentAdmin && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="includeDepartment"
                        checked={includeDepartment}
                        onChange={handleCheckboxChange}
                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="includeDepartment"
                        className="text-sm font-medium text-gray-700"
                      >
                        Assign to Department
                      </label>
                    </div>

                    {includeDepartment && (
                      <div className="mt-3">
                        <label
                          htmlFor="department"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Select Department
                        </label>
                        <Select
                          id="divisions"
                          name="division"
                          styles={customStyles}
                          value={{
                            value: selectedDepartment.value,
                            label:
                              divisions.find(
                                (division) =>
                                  division.division.division_id ===
                                  selectedDepartment.value
                              )?.division.name || "",
                          }}
                          onChange={handleDepartmentChange}
                          options={divisions.map((division) => ({
                            value: division.division.division_id,
                            label: division.division.name,
                          }))}
                          placeholder="Select a department..."
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Project Status Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center space-x-2">
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
                      Project Information
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-blue-800">
                    <div className="grid grid-cols-2 gap-2">
                      <div>Created:</div>
                      <div className="font-medium">
                        {moment(selectedRow.createdAt).format("MMM DD, YYYY")}
                      </div>
                      <div>Last Updated:</div>
                      <div className="font-medium">
                        {moment(selectedRow.updatedAt).format("MMM DD, YYYY")}
                      </div>
                      <div>Status:</div>
                      <div className="font-medium">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedRow.overall_progress === "Completed"
                              ? "bg-green-100 text-green-800"
                              : selectedRow.overall_progress === "On Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedRow.overall_progress}
                        </span>
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
                onClick={handleSubmit}
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
                    Saving...
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
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Required Fields Note */}
            <div className="mt-6 text-sm text-gray-500">
              <span className="text-red-500">*</span> Indicates required fields
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Projectsedit;
