import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const ResetPasswordbody = () => {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const { value } = e.target;
    setPasswordValidation({
      minLength: value.length >= 8,
      hasUpperCase: /[A-Z]/.test(value),
      hasLowerCase: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[\W_]/.test(value),
    });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const hash = queryParams.get("hash");

    try {
      const response = await apiService.resetpassword({
        email,
        hash,
        password,
      });

      if (response.status === 200) {
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
          navigate("/");
        }, 2000);
      } else {
        const data = await response.json();
        setErrorMessage(
          data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <Helmet>
        <title>PMS - Reset Password</title>
      </Helmet>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-2">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock style={{ fontSize: 32, color: "white" }} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
        <p className="text-gray-600">Create a new secure password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock style={{ fontSize: 20, color: "#9CA3AF" }} />
            </div>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <VisibilityOff style={{ fontSize: 20, color: "#9CA3AF" }} />
              ) : (
                <Visibility style={{ fontSize: 20, color: "#9CA3AF" }} />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Password Requirements</h3>
          <ul className="space-y-2 text-sm">
            <li className={`flex items-center ${passwordValidation.minLength ? "text-green-600" : "text-red-600"}`}>
              {passwordValidation.minLength ? (
                <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />
              ) : (
                <Cancel style={{ fontSize: 16, marginRight: 8 }} />
              )}
              At least 8 characters long
            </li>
            <li className={`flex items-center ${passwordValidation.hasUpperCase ? "text-green-600" : "text-red-600"}`}>
              {passwordValidation.hasUpperCase ? (
                <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />
              ) : (
                <Cancel style={{ fontSize: 16, marginRight: 8 }} />
              )}
              At least one uppercase letter
            </li>
            <li className={`flex items-center ${passwordValidation.hasLowerCase ? "text-green-600" : "text-red-600"}`}>
              {passwordValidation.hasLowerCase ? (
                <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />
              ) : (
                <Cancel style={{ fontSize: 16, marginRight: 8 }} />
              )}
              At least one lowercase letter
            </li>
            <li className={`flex items-center ${passwordValidation.hasNumber ? "text-green-600" : "text-red-600"}`}>
              {passwordValidation.hasNumber ? (
                <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />
              ) : (
                <Cancel style={{ fontSize: 16, marginRight: 8 }} />
              )}
              At least one number
            </li>
            <li className={`flex items-center ${passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-600"}`}>
              {passwordValidation.hasSpecialChar ? (
                <CheckCircle style={{ fontSize: 16, marginRight: 8 }} />
              ) : (
                <Cancel style={{ fontSize: 16, marginRight: 8 }} />
              )}
              At least one special character
            </li>
          </ul>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your new password"
              className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock style={{ fontSize: 20, color: "#9CA3AF" }} />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <Cancel style={{ fontSize: 20, color: "#F87171", marginRight: 8 }} />
              <span className="text-red-700 text-sm">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Update Password Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Update Password
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-center text-sm text-gray-600">
          Make sure your new password is strong and unique
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordbody;
