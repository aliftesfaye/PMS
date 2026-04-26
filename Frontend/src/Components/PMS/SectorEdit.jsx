import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { X, Save, RotateCcw, Building, Crown } from "lucide-react";
import apiService from "../services/apiServices";

const SectorEdit = ({ selectedRow, handlefetchClusters, handleCloseModal }) => {
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const sectorName = selectedRow?.sector?.name || "";
  const leaderName =
    selectedRow?.leader && selectedRow.leader.length > 0
      ? selectedRow.leader[0].full_name
      : "";
  const leader_id =
    selectedRow?.leader && selectedRow.leader.length > 0
      ? selectedRow.leader[0].user_id
      : "";

  console.log(selectedRow);

  const [initialFormData, setInitialFormData] = useState({
    sector_name: sectorName,
    leader: leaderName,
    leader_id: leader_id,
  });

  const [formData, setFormData] = useState(initialFormData);

  const fetchUsers = useCallback(async () => {
    try {
      const usersData = await apiService.getSectorAdminUsers(userInfo.access_token);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load users. Please try again.",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }, [userInfo]);

  useEffect(() => {
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
  }, [fetchUsers, handleCloseModal]);

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.sector_name?.trim()) {
      errors.sector_name = "Cluster name is required";
    }

    if (!formData.leader_id) {
      errors.leader = "Cluster leader is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
      const { sector_name, leader_id } = formData;
      const response = await apiService.updateSector(
        { sector_name, leader_id },
        selectedRow.sector.sector_id
      );
      console.log("Sector updated:", response);

      if (response && response.message === "Sector updated") {
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
          title: "Cluster Updated successfully",
        });

        handleCloseModal();
        handlefetchClusters();
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to Update Cluster",
        text: error.response?.data?.message || error.message || "Failed to update cluster",
        confirmButtonColor: "#082f49",
        confirmButtonText: "Try Again",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (selectedOption, name) => {
    console.log(selectedOption);
    setFormData({
      ...formData,
      leader: selectedOption.label,
      leader_id: selectedOption.value,
    });

    // Clear error for this field
    if (formErrors.leader) {
      setFormErrors((prev) => ({
        ...prev,
        leader: "",
      }));
    }
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

  const resetFormData = (e) => {
    e.preventDefault();
    setFormData(initialFormData);
    setFormErrors({});
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "56px",
      borderRadius: "0.5rem",
      borderColor: formErrors.leader ? "#ef4444" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(8, 47, 73, 0.1)" : "none",
      "&:hover": {
        borderColor: formErrors.leader ? "#ef4444" : "#d1d5db",
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Edit Cluster
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update cluster information and leadership
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
                  htmlFor="sector_name"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Cluster Name *
                </label>
                <input
                  type="text"
                  id="sector_name"
                  name="sector_name"
                  value={formData.sector_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${formErrors.sector_name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                    }`}
                  placeholder="Enter cluster name"
                  disabled={loading}
                />
                {formErrors.sector_name && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.sector_name}
                  </p>
                )}
              </div>

              {/* Leader Field */}
              <div className="space-y-2">
                <label
                  htmlFor="leader"
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Cluster Leader *
                </label>
                <Select
                  name="leader"
                  value={
                    formData.leader
                      ? {
                        value: formData.leader_id,
                        label: formData.leader,
                      }
                      : null
                  }
                  required
                  onChange={(selectedOption) =>
                    handleChange(selectedOption, "leader_id")
                  }
                  options={[...users]
                    .sort((a, b) => a.full_name?.localeCompare(b.full_name))
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
                {formErrors.leader && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <span className="mr-1">⚠</span> {formErrors.leader}
                  </p>
                )}
              </div>
            </div>

            {/* Current Cluster Info (Read-only) */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">
                Current Cluster Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Cluster ID:</span>
                  <p className="font-medium">{selectedRow?.sector?.sector_id || "N/A"}</p>
                </div>
                <div>
                  <span className="text-gray-500">Current Leader:</span>
                  <p className="font-medium text-blue-600">
                    {initialFormData.leader || "No leader assigned"}
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
                    Saving Changes...
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

export default SectorEdit;