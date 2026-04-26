import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { X, Save, RotateCcw, Building, User, Layers } from "lucide-react";
import apiService from "../services/apiServices";

const SectorAdd = ({ handleCloseModal, handlefetchSectors }) => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    leader_id: "",
  });
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  useEffect(() => {
    fetchDivisions();
    fetchUsers();
    async function fetchUsers2() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers2();

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

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "Cluster name is required";
    }

    if (!formData.leader_id) {
      errors.leader_id = "Leader is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getSectorAdminUsers(userInfo.access_token);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchDivisions = async () => {
    try {
      const divisionsData = await apiService.getDivisions();
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

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
      console.log(formData);
      const response = await apiService.addSectors(
        formData,
        userInfo.access_token
      );
      console.log("Response:", response);

      if (response.message === "New sector created") {
        setFormData({
          name: "",
          sector_id: "",
          leader_id: "",
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
          title: "Cluster Saved successfully",
        });

        handleCloseModal();
        handlefetchSectors();
      }
    } catch (error) {
      console.error("Error adding Sector:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add Cluster",
        text: error.response?.data?.message || error.message || "Failed to add cluster",
        confirmButtonColor: "#082f49",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "56px",
      borderRadius: "0.5rem",
      borderColor: formErrors.leader_id ? "#ef4444" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(8, 47, 73, 0.1)" : "none",
      "&:hover": {
        borderColor: formErrors.leader_id ? "#ef4444" : "#d1d5db",
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

  const resetFormData = () => {
    setFormData({
      name: "",
      sector: "",
      leader_id: "",
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Cluster
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Create a new cluster and assign a leader
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
            <div className="space-y-6">
              {/* Cluster Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Cluster Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${formErrors.name
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-gray-400"
                    }`}
                  placeholder="Enter cluster name"
                  disabled={loading}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Leader Field */}
              <div className="space-y-2">
                <label
                  htmlFor="leader_id"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Cluster Leader *
                </label>
                <Select
                  id="leader_id"
                  name="leader_id"
                  value={{
                    value: formData.leader_id,
                    label:
                      users.find((user) => user.user_id === formData.leader_id)
                        ?.full_name || "",
                  }}
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, "leader_id")
                  }
                  options={[...users]
                    .sort((a, b) => a.full_name.localeCompare(b.full_name))
                    .map((user) => ({
                      value: user.user_id,
                      label: user.full_name,
                    }))}
                  placeholder="Select cluster leader"
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  isClearable
                  isSearchable
                  isLoading={loading}
                  isDisabled={loading}
                />
                {formErrors.leader_id && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.leader_id}
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
                    Adding Cluster...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Add Cluster
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

export default SectorAdd;