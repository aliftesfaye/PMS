import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";
import Swal from "sweetalert2";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Tooltip } from "@material-ui/core";

const ProfileUpdate = ({ closeModal }) => {
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    full_name: userInfo.foundUser?.full_name || "",
    email: userInfo.foundUser?.email || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "new_password") {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasLowerCase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[\W_]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !passwordValidation.minLength ||
      !passwordValidation.hasUpperCase ||
      !passwordValidation.hasLowerCase ||
      !passwordValidation.hasNumber ||
      !passwordValidation.hasSpecialChar
    ) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Password does not meet all requirements",
        showConfirmButton: true,
        customClass: {
          popup: "custom-popup-style",
        },
      });
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Passwords do not match",
        showConfirmButton: true,
        customClass: {
          popup: "custom-popup-style",
        },
      });
      return;
    }

    try {
      const response = await apiService.updateUserProfile(
        userInfo.foundUser.user_id,
        formData
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
          title: response.data.message,
        }).then(() => {
          closeModal();
        });
      } else {
        console.error("Profile Updating Failed");
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.data.message,
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Profile Updating Failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Profile Updating Failed",
        text: error.response?.data?.message || "An error occurred while updating profile",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  useEffect(() => {
    const fetchUsers = () => {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    };

    const fetchPermissions = () => {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    };

    fetchUsers();
    fetchPermissions();
  }, [userInfo, permissions]);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          placeholder="Enter your full name"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter your current password"
            required
          />
          <Tooltip title={showCurrentPassword ? "Hide Password" : "View Password"} placement="top">
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              {showCurrentPassword ? (
                <VisibilityOffOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            placeholder="Enter new password"
            required
          />
          <Tooltip title={showNewPassword ? "Hide Password" : "View Password"} placement="top">
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              {showNewPassword ? (
                <VisibilityOffOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
            <span className="text-base">{passwordValidation.minLength ? '✓' : '○'}</span>
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
            <span className="text-base">{passwordValidation.hasUpperCase ? '✓' : '○'}</span>
            <span>One uppercase letter</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
            <span className="text-base">{passwordValidation.hasLowerCase ? '✓' : '○'}</span>
            <span>One lowercase letter</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
            <span className="text-base">{passwordValidation.hasNumber ? '✓' : '○'}</span>
            <span>One number</span>
          </div>
          <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'} md:col-span-2`}>
            <span className="text-base">{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>
            <span>One special character (!@#$%^&*)</span>
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 pr-11 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white ${formData.confirm_password && formData.new_password !== formData.confirm_password
                ? 'border-red-500'
                : 'border-gray-300'
              }`}
            placeholder="Confirm your new password"
            required
          />
          <Tooltip title={showConfirmPassword ? "Hide Password" : "View Password"} placement="top">
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-md hover:bg-gray-100"
            >
              {showConfirmPassword ? (
                <VisibilityOffOutlinedIcon fontSize="small" />
              ) : (
                <VisibilityOutlinedIcon fontSize="small" />
              )}
            </button>
          </Tooltip>
        </div>
        {formData.confirm_password && formData.new_password !== formData.confirm_password && (
          <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
            <span>⚠</span> Passwords do not match
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        >
          Update Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileUpdate;