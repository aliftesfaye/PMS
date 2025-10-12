import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiService from "../services/apiServices";
import "./FirstReset.css";

const FirstResetnew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const params = new URLSearchParams(location.search);
  const userId = params.get("userid");
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmPassword":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleResetPassword = async () => {
    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

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
      console.log("API Response:", response);
      navigate("/");
    } catch (error) {
      console.error("Password reset failed:", error.message);
      setErrorMessage("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="reset-password-container-input" style={{ height: "400px" }}>
      <div className="center-container ">
        <div className="titlee">EAII-PMS</div>
        <div className="subtitlee">Change Password</div>
      </div>
      <div className="res-group">
        <label htmlFor="currentPassword">Current Password</label>
        <div className="password-input">
          <input
            className="res-input"
            type={showCurrentPassword ? "text" : "password"}
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
          />
          <i
            className={`password-toggle-icon ${
              showCurrentPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("currentPassword")}
          ></i>
        </div>
      </div>
      <div className="res-group">
        <label htmlFor="newPassword">New Password</label>
        <div className="password-input">
          <input
            className="res-input"
            type={showNewPassword ? "text" : "password"}
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
          />
          <i
            className={`password-toggle-icon ${
              showNewPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("newPassword")}
          ></i>
        </div>
      </div>
      <div className="res-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <div className="password-input">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            className="res-input"
            name="confirmPassword"
            placeholder="Re-enter new password"
          />
          <i
            className={`password-toggle-icon ${
              showConfirmPassword ? "visible" : "hidden"
            }`}
            onClick={() => togglePasswordVisibility("confirmPassword")}
          ></i>
        </div>
      </div>
      <div className="res-buttons">
        <button type="submit" onClick={handleResetPassword} className="ml-7">
          Reset Password
        </button>
        <div className="error-message text-red-500 ml-7">{errorMessage}</div>
      </div>
    </div>
  );
};

export default FirstResetnew;
