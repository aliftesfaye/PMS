import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import {
  Lock,
  Visibility,
  VisibilityOff,
  ErrorOutline,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import Backdrop from "@mui/material/Backdrop";
import PuffLoader from "react-spinners/ClipLoader";

const FirstResetcontainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const params = new URLSearchParams(location.search);
  const userId = params.get("userid");

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current_password":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new_password":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm_password":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setOpen(true);

    const currentPassword = formData.current_password;
    const newPassword = formData.new_password;
    const confirmPassword = formData.confirm_password;

    if (
      !passwordValidation.minLength ||
      !passwordValidation.hasUpperCase ||
      !passwordValidation.hasLowerCase ||
      !passwordValidation.hasNumber ||
      !passwordValidation.hasSpecialChar
    ) {
      setOpen(false);
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
    if (!currentPassword || !newPassword || !confirmPassword) {
      setOpen(false);
      setErrorMessage("All fields are required");
      return;
    }
    if (currentPassword === newPassword) {
      setOpen(false);
      setErrorMessage("Current password and new password cannot be the same");
      return;
    }
    if (newPassword !== confirmPassword) {
      setOpen(false);
      setErrorMessage("New password and confirm password do not match");
      return;
    }

    try {
      const response = await apiService.firstlogin({
        currentPassword,
        newPassword,
        confirmPassword,
        userId,
      });

      if (response.status === 200) {
        setOpen(false);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Your password has been reset successfully",
          showConfirmButton: true,
          timer: 2500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
        setTimeout(() => {
          window.location.href = "/";
        }, 2500);
      } else {
        setOpen(false);
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setOpen(false);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-100">
      {/* Loading Backdrop */}
      <div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock style={{ fontSize: 32, color: "white" }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reset Your Password
        </h1>
        <p className="text-gray-600">
          This is your first time logging in. Please set a new password.
        </p>
      </div>

      <form onSubmit={handleResetPassword}>
        <div className="space-y-6">

          {/* Current Password Field */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
              <div className="pl-3">
                <Lock style={{ fontSize: 20, color: "#9CA3AF" }} />
              </div>
              <input
                id="current_password"
                type={showCurrentPassword ? "text" : "password"}
                name="current_password"
                className="w-full px-3 py-3 border-0 focus:ring-0 focus:outline-none bg-transparent"
                placeholder="Enter current password"
                value={formData.current_password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="pr-3"
                onClick={() => togglePasswordVisibility("current_password")}
              >
                {showCurrentPassword ? (
                  <VisibilityOff style={{ fontSize: 20, color: "#6B7280" }} />
                ) : (
                  <Visibility style={{ fontSize: 20, color: "#6B7280" }} />
                )}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div>

            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200">
                <div className="pl-3">
                  <Lock style={{ fontSize: 20, color: "#9CA3AF" }} />
                </div>
                <input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  name="new_password"
                  className="w-full px-3 py-3 border-0 focus:ring-0 focus:outline-none bg-transparent"
                  placeholder="Enter new password"
                  value={formData.new_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="pr-3"
                  onClick={() => togglePasswordVisibility("new_password")}
                >
                  {showNewPassword ? (
                    <VisibilityOff style={{ fontSize: 20, color: "#6B7280" }} />
                  ) : (
                    <Visibility style={{ fontSize: 20, color: "#6B7280" }} />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Password must contain:
              </p>
              <div className="space-y-1">
                <div className="flex items-center">
                  {passwordValidation.minLength ? (
                    <CheckCircle
                      style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}
                    />
                  ) : (
                    <Cancel
                      style={{ fontSize: 16, color: "#EF4444", marginRight: 8 }}
                    />
                  )}
                  <span
                    className={`text-sm ${passwordValidation.minLength
                      ? "text-green-600"
                      : "text-gray-600"
                      }`}
                  >
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasUpperCase ? (
                    <CheckCircle
                      style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}
                    />
                  ) : (
                    <Cancel
                      style={{ fontSize: 16, color: "#EF4444", marginRight: 8 }}
                    />
                  )}
                  <span
                    className={`text-sm ${passwordValidation.hasUpperCase
                      ? "text-green-600"
                      : "text-gray-600"
                      }`}
                  >
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasLowerCase ? (
                    <CheckCircle
                      style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}
                    />
                  ) : (
                    <Cancel
                      style={{ fontSize: 16, color: "#EF4444", marginRight: 8 }}
                    />
                  )}
                  <span
                    className={`text-sm ${passwordValidation.hasLowerCase
                      ? "text-green-600"
                      : "text-gray-600"
                      }`}
                  >
                    One lowercase letter
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasNumber ? (
                    <CheckCircle
                      style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}
                    />
                  ) : (
                    <Cancel
                      style={{ fontSize: 16, color: "#EF4444", marginRight: 8 }}
                    />
                  )}
                  <span
                    className={`text-sm ${passwordValidation.hasNumber
                      ? "text-green-600"
                      : "text-gray-600"
                      }`}
                  >
                    One number
                  </span>
                </div>
                <div className="flex items-center">
                  {passwordValidation.hasSpecialChar ? (
                    <CheckCircle
                      style={{ fontSize: 16, color: "#10B981", marginRight: 8 }}
                    />
                  ) : (
                    <Cancel
                      style={{ fontSize: 16, color: "#EF4444", marginRight: 8 }}
                    />
                  )}
                  <span
                    className={`text-sm ${passwordValidation.hasSpecialChar
                      ? "text-green-600"
                      : "text-gray-600"
                      }`}
                  >
                    One special character
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>

            <div className="relative">
              <div className={`flex items-center border ${formData.new_password && formData.confirm_password
                ? formData.new_password === formData.confirm_password
                  ? "border-green-500 focus-within:ring-green-500"
                  : "border-red-500 focus-within:ring-red-500"
                : "border-gray-300"
                } rounded-lg hover:border-gray-400 focus-within:ring-2 focus-within:border-transparent transition-all duration-200`}>
                <div className="pl-3 pr-2">
                  <Lock style={{
                    fontSize: 20,
                    color: formData.new_password && formData.confirm_password
                      ? formData.new_password === formData.confirm_password
                        ? "#10B981"
                        : "#EF4444"
                      : "#9CA3AF"
                  }} />
                </div>
                <input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  className="w-full py-3 border-0 focus:ring-0 focus:outline-none bg-transparent placeholder-gray-500"
                  placeholder="Re-enter new password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="px-3 py-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                  onClick={() => togglePasswordVisibility("confirm_password")}
                >
                  {showConfirmPassword ? (
                    <VisibilityOff style={{ fontSize: 20, color: "#6B7280" }} />
                  ) : (
                    <Visibility style={{ fontSize: 20, color: "#6B7280" }} />
                  )}
                </button>
              </div>
              {/* Password match indicator */}
              {formData.new_password && formData.confirm_password && (
                <div className="mt-1 flex items-center">
                  {formData.new_password === formData.confirm_password ? (
                    <>
                      <CheckCircle style={{ fontSize: 16, color: "#10B981", marginRight: 4 }} />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <Cancel style={{ fontSize: 16, color: "#EF4444", marginRight: 4 }} />
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center">
                <ErrorOutline
                  style={{ fontSize: 20, color: "#F87171", marginRight: 8 }}
                />
                <span className="text-red-700 text-sm">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Update Password Button */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-900 via-sky-800 to-sky-900 text-white py-3 px-4 rounded-lg font-semibold hover:from-sky-900 hover:to-sky-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Update Password
            </button>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Setting a strong password helps protect your account
        </p>
      </div>
    </div>
  );
};

export default FirstResetcontainer;
