import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./Registernewuser.css";

const EditUser = ({ handleCloseModal, selectedRow, handleFetchUsers }) => {
  const [emailError, setEmailError] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [initialFormData, setInitialFormData] = useState({
    full_name: selectedRow.full_name,
    email: selectedRow.email,
    division_id: selectedRow.division_id,
    role: selectedRow.Roles.find((role) => !role.project_related).role_id,
    gender: selectedRow.gender,
    password: "",
  });
  const [formData, setFormData] = useState(initialFormData);

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const fetchDivisions = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo.access_token;

      const divisionsData = await apiService.getDivisions(token);
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await apiService.getRoles();
      const filteredRoles = rolesData.filter((role) => !role.project_related);
      setRoles(filteredRoles);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = "replace_with_actual_user_id";
      const userData = await apiService.getUserById(userId);
      setFormData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleChange = (selectedOption, name) => {
    let value = selectedOption;
    if (name === "gender") {
      value = selectedOption.value;
    } else {
      value = selectedOption ? selectedOption.value : "";
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setEmailError("Invalid email address");
      return;
    } else {
      setEmailError("");
    }

    try {
      const response = await apiService.updateUsers(
        selectedRow.user_id,
        formData
      );
      console.log("User updated successfully:", response);
      if (response.status === 201) {
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
          title: "User updated successfully",
        }).then(() => {
          handleCloseModal();
          handleFetchUsers();
        });
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  useEffect(() => {
    setInitialFormData({
      full_name: selectedRow.full_name,
      email: selectedRow.email,
      division_id: selectedRow.division_id,
      role: selectedRow.Roles.find((role) => !role.project_related).role_id,
      gender: selectedRow.gender,
      password: "",
    });
    setFormData(initialFormData);
    fetchDivisions();
    fetchRoles();
    fetchUserData();
    console.log("Selected Row:", selectedRow);

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [selectedRow]); // Add selectedRow as a dependency to reset form data on row change

  const resetFormData = () => {
    setFormData(initialFormData);
  };

  return (
    <div className="px-4 w-fit">
      <h2 className="role-title">Edit Member</h2>
      <form>
        <div className="flex flex-wrap ">
          <div>
            <div className="form-group">
              {" "}
              <label htmlFor="full_name" className="block">
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className=" px-3 py-2 rounded  w-80 h-14"
                placeholder="Enter Full Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={` px-3 py-2 rounded w-80 h-14 ${
                  emailError ? "border-red-500" : ""
                }`}
                placeholder="example@example.com"
              />
              {emailError && <div className="text-red-500">{emailError}</div>}
            </div>

            <div className=" mb-4">
              <label htmlFor="roles" className="block">
                Role
              </label>

              <Select
                id="roles"
                className="w-80"
                name="role"
                value={{
                  value: formData.role,
                  label:
                    roles.find((role) => role.role_id === formData.role)
                      ?.name || "",
                }}
                onChange={(selectedOption) =>
                  handleChange(selectedOption, "role")
                }
                options={roles.map((role) => ({
                  value: role.role_id,
                  label: role.name,
                }))}
                placeholder="Select Role"
              />
            </div>
            <div className=" mb-4">
              <label htmlFor="gender" className="block">
                Gender
              </label>
              <Select
                id="gender"
                name="gender"
                value={{ value: formData.gender, label: formData.gender }}
                onChange={(selectedOption) =>
                  handleChange(selectedOption, "gender")
                }
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                ]}
                className="w-80"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-5  mb-10">
          <button
            type="button"
            className="flex justify-center items-center p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
            onClick={() => {
              resetFormData();
            }}
          >
            Reset
          </button>
          <button
            className="text-white font-bold py-2 px-2 rounded"
            onClick={handleSubmit}
            style={{ backgroundColor: "#082f49" }}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUser;
