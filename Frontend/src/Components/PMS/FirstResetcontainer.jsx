import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiService from "../services/apiServices"; // Import your API service

import EaiiLogin from "../Assets/EaiiLoginicon.png";
import "./LoginContainer.css";

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

    const currentPassword = formData.current_password;
    const newPassword = formData.new_password;
    const confirmPassword = formData.confirm_password;
    console.log("new_password", newPassword);
    console.log("confirm_password", confirmPassword);

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
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }
    if (currentPassword === newPassword) {
      setErrorMessage("Current password and new password cannot be the same");
      return;
    }
    if (newPassword !== confirmPassword) {
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
      console.log(response);

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
        setInterval(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="md:w-full max-w-screen-sm mx-auto sm:mt-4 mt-0 md:mt-0 p-4 bg-white rounded-xl">
      <div className="md:hidden flex justify-center items-center mt-6 mb-4">
        <img src={EaiiLogin} alt="EaiiLogin" className="h-12" />
      </div>

      <div className="mx-auto space-x-4">
        <div className="grid space-y-2 md:space-y-10 text-center md:mb-4">
          <div className="md:text-3xl text-md font-bold pt-4">First Reset</div>
          <div>
            This is your first time logging in to your account.
            <br />
            Please change the password given to you by the admin.
          </div>
        </div>
        <div className="required font-semibold font-sans mt-4">
          Current Password
        </div>
        <div>
          <input
            type={showCurrentPassword ? "text" : "password"}
            id="current_password"
            name="current_password"
            className="px-2 py-2 rounded-xl w-full mt-2 h-12"
            placeholder="Enter current password"
            value={formData.current_password}
            onChange={handleChange}
          />
          <i
            className={`password-toggle-icon ${
              showCurrentPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("current_password")}
          ></i>
        </div>

        <div className="required font-semibold font-sans mt-4">
          New Password
        </div>
        <div className="password-input">
          <input
            className="px-2 py-2 rounded-xl w-full mt-2 h-12"
            type={showNewPassword ? "text" : "password"}
            id="new_password"
            name="new_password"
            placeholder="Enter new password"
            value={formData.new_password}
            onChange={handleChange}
          />
          <i
            className={`password-toggle-icon ${
              showNewPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("new_password")}
          ></i>
        </div>
        <ul className="mt-2 text-sm text-gray-600">
          <li
            className={
              passwordValidation.minLength ? "text-green-500" : "text-red-500"
            }
          >
            At least 8 characters long
          </li>
          <li
            className={
              passwordValidation.hasUpperCase
                ? "text-green-500"
                : "text-red-500"
            }
          >
            At least one uppercase letter
          </li>
          <li
            className={
              passwordValidation.hasLowerCase
                ? "text-green-500"
                : "text-red-500"
            }
          >
            At least one lowercase letter
          </li>
          <li
            className={
              passwordValidation.hasNumber ? "text-green-500" : "text-red-500"
            }
          >
            At least one number
          </li>
          <li
            className={
              passwordValidation.hasSpecialChar
                ? "text-green-500"
                : "text-red-500"
            }
          >
            At least one special character
          </li>
        </ul>
        <div className="required font-semibold font-sans mt-4">
          Confirm Password
        </div>
        <div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirm_password"
            className="px-2 py-2 rounded-xl w-full mt-2 h-12"
            name="confirm_password"
            placeholder="Re-enter new password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          <i
            className={`password-toggle-icon ${
              showConfirmPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("confirm_password")}
          ></i>
        </div>
        <div class="text-center">
          {/* <button
            className="text-white font-bold py-2 px-4"
            
            type="submit"
            style={{ backgroundColor: "#082f49" }}
          >
            Reset Password
          </button> */}
          <button
            onClick={handleResetPassword}
            className="justify-center items-center px-5 py-2 my-6  max-w-full text-base font-bold text-white bg-sky-500 rounded-xl w-[200px] max-md:px-5"
          >
            Update Password
          </button>
          <div className="error-message text-red-500 ml-7">{errorMessage}</div>
        </div>
      </div>
    </div>
  );
};

export default FirstResetcontainer;
