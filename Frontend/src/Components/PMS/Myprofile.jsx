import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";
import Swal from "sweetalert2";

const ProfileUpdate = ({ closeModal }) => {
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [formData, setFormData] = useState({
    full_name: userInfo.foundUser.full_name,
    email: userInfo.foundUser.email,
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
        text: error.data.message,
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
    <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
      <div className="flex justify-between ">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            type="password"
            id="current_password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
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
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex items-center justify-center ">
          <div className="w-1/3">
            <button
              type="submit"
              className="w-full text-white p-2"
              style={{ backgroundColor: "#082f49" }}
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
