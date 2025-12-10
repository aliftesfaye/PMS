import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  X,
  Save,
  RotateCcw,
  User,
  Mail,
  Shield,
  CircleSmall,
} from "lucide-react";
import apiService from "../services/apiServices";
import "./Registernewuser.css";

const EditUser = ({ handleCloseModal, selectedRow, handleFetchUsers }) => {
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [roles, setRoles] = useState([]);

  const [initialFormData, setInitialFormData] = useState({
    full_name: "",
    email: "",
    division_id: "",
    role: "",
    gender: "",
    password: "",
  });

  const [formData, setFormData] = useState(initialFormData);

  // Fetch divisions data
  const fetchDivisions = useCallback(async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.access_token;

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const divisionsData = await apiService.getDivisions(token);
      setDivisions(divisionsData || []);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load divisions. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, []);

  // Fetch roles data
  const fetchRoles = useCallback(async () => {
    try {
      const rolesData = await apiService.getRoles();
      const filteredRoles = (rolesData || []).filter(
        (role) => !role.project_related
      );
      setRoles(filteredRoles);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load roles. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, []);

  // Initialize form data from selected row
  const initializeFormData = useCallback(() => {
    if (selectedRow) {
      const initialData = {
        full_name: selectedRow.full_name || "",
        email: selectedRow.email || "",
        division_id: selectedRow.division_id || "",
        role:
          selectedRow.Roles?.find((role) => !role.project_related)?.role_id ||
          "",
        gender: selectedRow.gender || "",
        password: "",
      };

      setInitialFormData(initialData);
      setFormData(initialData);
    }
  }, [selectedRow]);

  // Validate form
  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.full_name?.trim()) {
      errors.full_name = "Full name is required";
    }

    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    if (!formData.gender) {
      errors.gender = "Gender is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fill all required fields correctly.",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.updateUsers(
        selectedRow.user_id,
        formData
      );

      if (response.status === 201) {
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

        await Toast.fire({
          icon: "success",
          title: "User updated successfully",
        });

        handleCloseModal();
        handleFetchUsers();
      }
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update user. Please try again.",
        confirmButtonColor: "#082f49",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle select change
  const handleSelectChange = (selectedOption, name) => {
    const value = selectedOption ? selectedOption.value : "";
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Reset form to initial data
  const resetFormData = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setEmailError("");
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleCloseModal]);

  // Initialize on component mount and when selectedRow changes
  useEffect(() => {
    initializeFormData();
    fetchDivisions();
    fetchRoles();
  }, [initializeFormData, fetchDivisions, fetchRoles]);

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "56px",
      borderRadius: "0.5rem",
      borderColor: formErrors[state.selectProps.name] ? "#ef4444" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(8, 47, 73, 0.1)" : "none",
      "&:hover": {
        borderColor: formErrors[state.selectProps.name] ? "#ef4444" : "#d1d5db",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#082f49"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#374151",
      "&:active": {
        backgroundColor: "#082f49",
        color: "white",
      },
    }),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update user information
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div
          className="overflow-y-auto px-8 py-6"
          style={{ maxHeight: "calc(90vh - 140px)" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="full_name"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    formErrors.full_name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="John Doe"
                />
                {formErrors.full_name && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.full_name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                    formErrors.email || emailError
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="john.doe@example.com"
                />
                {(formErrors.email || emailError) && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span>{" "}
                    {formErrors.email || emailError}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label
                  htmlFor="role"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Role *
                </label>
                <Select
                  id="role"
                  name="role"
                  value={
                    roles.find((role) => role.role_id === formData.role)
                      ? {
                          value: formData.role,
                          label: roles.find(
                            (role) => role.role_id === formData.role
                          )?.name,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "role")
                  }
                  options={roles.map((role) => ({
                    value: role.role_id,
                    label: role.name,
                  }))}
                  placeholder="Select a role"
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  isSearchable
                />
                {formErrors.role && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.role}
                  </p>
                )}
              </div>

              {/* Gender Field */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <CircleSmall className="w-4 h-4 mr-2" />
                  Gender *
                </label>
                <Select
                  id="gender"
                  name="gender"
                  value={
                    formData.gender
                      ? {
                          value: formData.gender,
                          label: formData.gender,
                        }
                      : null
                  }
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "gender")
                  }
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                  ]}
                  placeholder="Select gender"
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {formErrors.gender && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* Current User Info (Read-only) */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">
                Current User Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">User ID:</span>
                  <p className="font-medium">{selectedRow.user_id}</p>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <p
                    className={`font-medium ${
                      selectedRow?.account_status
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedRow?.account_status ? "Active" : "Inactive"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Last Updated:</span>
                  <p className="font-medium">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Created:</span>
                  <p className="font-medium">
                    {selectedRow.created_at
                      ? new Date(selectedRow.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={resetFormData}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
