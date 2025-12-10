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
  Building,
  Users,
  Key,
} from "lucide-react";
import apiService from "../services/apiServices";
import "./Registernewuser.css";

const Registernewuser = ({ handleCloseModal, handlefetchUsers }) => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || {};
  });

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    division: "",
    sector: "",
    role: "",
    gender: "",
    password: "",
    isRoot: false,
    isSector: false,
    isOrganizationUnit: false,
  });

  // Fetch divisions data
  const fetchDivisions = useCallback(async () => {
    try {
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
  }, [userInfo]);

  // Fetch sectors data
  const fetchSectors = useCallback(async () => {
    try {
      const token = userInfo?.access_token;
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const sectorsData = await apiService.getallOrganizations(token);
      setSectors(sectorsData || []);
    } catch (error) {
      console.error("Error fetching sectors:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load sectors. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [userInfo]);

  // Fetch roles data
  const fetchRoles = useCallback(async () => {
    try {
      const token = userInfo?.access_token;
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const rolesData = await apiService.getRoles(token);
      const nonProjectRole = (rolesData || []).filter(
        (role) => role.project_related === false
      );
      setRoles(nonProjectRole);
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
  }, [userInfo]);

  // Initialize component
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDivisions(), fetchSectors(), fetchRoles()]);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    // Event listener for Esc key to close modal
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [fetchDivisions, fetchSectors, fetchRoles, handleCloseModal]);

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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  // Handle checkbox change with exclusive logic
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setFormData((prev) => {
      const updatedData = { ...prev };

      // Reset all access checkboxes
      updatedData.isRoot = false;
      updatedData.isSector = false;
      updatedData.isOrganizationUnit = false;

      // Set only the checked one
      if (checked) {
        updatedData[name] = true;
      }

      return updatedData;
    });
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
      const response = await apiService.registerUser(formData);
      console.log("User registration response:", response);

      if (response.success) {
        // Reset form
        setFormData({
          full_name: "",
          email: "",
          division: "",
          sector: "",
          role: "",
          gender: "",
          password: "",
          isRoot: false,
          isSector: false,
          isOrganizationUnit: false,
        });

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#10b981",
          color: "white",
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        await Toast.fire({
          icon: "success",
          title: "User registered successfully",
        });

        handleCloseModal();
        handlefetchUsers();
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Registration Failed",
        text:
          error.response?.data?.message ||
          error.message ||
          "Failed to register user",
        confirmButtonColor: "#082f49",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      full_name: "",
      email: "",
      division: "",
      sector: "",
      role: "",
      gender: "",
      password: "",
      isRoot: false,
      isSector: false,
      isOrganizationUnit: false,
    });
    setFormErrors({});
  };

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
                <h2 className="text-2xl font-bold text-gray-800">
                  Register New User
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add a new user to your organization
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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading form data...</p>
            </div>
          ) : (
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
                    disabled={loading}
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
                      formErrors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    placeholder="john.doe@example.com"
                    disabled={loading}
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="mr-1">⚠</span> {formErrors.email}
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
                    placeholder="Select Role"
                    styles={selectStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isClearable
                    isSearchable
                    isLoading={loading}
                    isDisabled={loading}
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
                    placeholder="Select Gender"
                    styles={selectStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isLoading={loading}
                    isDisabled={loading}
                  />
                  {formErrors.gender && (
                    <p className="text-sm text-red-600 flex items-center mt-1">
                      <span className="mr-1">⚠</span> {formErrors.gender}
                    </p>
                  )}
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
                      Registering...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Register Member
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Registernewuser;
