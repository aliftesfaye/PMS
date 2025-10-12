import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

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
    <div className="flex  bg-white  flex-col items-center p-20 rounded-2xl shadow-sm max-w-[540px] max-md:px-5">
      <Helmet>
        <title>PMS - Reset Password</title>
      </Helmet>
      <div className="mt-5 text-2xl font-semibold text-blue-950">
        New Password
      </div>
      <div className="mt-5 text-base tracking-normal leading-6 text-center text-zinc-500">
        Set a new password for your account.
      </div>
      <form onSubmit={handleSubmit} className="w-full mt-9">
        <div className="text-base text-slate-950">New Password</div>
        <div className="relative mt-1 max-w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your new password"
            className="justify-center items-start px-4 py-5 mt-1 max-w-full text-sm whitespace-nowrap rounded-lg bg-zinc-100 text-slate-950 max-md:pr-14"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="inset-y-0 right-0 px-3 py-1.5 my-auto text-blue-950 flex items-center"
          ></button>
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
        <div className="text-base text-slate-950 mt-5">
          Confirm New Password
        </div>
        <div className="relative mt-1 max-w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your new password"
            className="justify-center items-start px-4 py-5 mt-1 w-full text-sm  rounded-lg bg-zinc-100 text-slate-950 max-md:pr-14"
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="inset-y-0 right-0 py-1.5 my-auto relative text-blue-950 flex items-center  "
          ></button>
        </div>
        {errorMessage && (
          <div className="text-red-500 mt-2">{errorMessage}</div>
        )}
        <button
          type="submit"
          className="justify-center items-center px-16 py-4 mt-4  max-w-full text-base font-bold text-white bg-sky-500 rounded-xl w-[349px] max-md:px-5"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordbody;
