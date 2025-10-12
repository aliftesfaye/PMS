import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./Registernewuser.css";

const Registernewuser = ({ handleCloseModal, handlefetchUsers }) => {
  const [emailError, setEmailError] = useState("");
  const [divisions, setDivisions] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [roles, setRoles] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    division: "",
    sector: "",
    role: "",
    password: "",
    isRoot: false,
    isSector: false,
    isOrganizationUnit: false,
  });

  useEffect(() => {
    fetchDivisions();
    fetchSectors();

    fetchRoles();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
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
  }, [userInfo, handleCloseModal]);

  const fetchDivisions = async () => {
    try {
      const divisionsData = await apiService.getDivisions(
        userInfo.access_token
      );
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };
  const fetchSectors = async () => {
    try {
      const sectorsData = await apiService.getallOrganizations(
        userInfo.access_token
      );
      console.log(sectorsData);
      setSectors(sectorsData);
    } catch (error) {
      console.error("Error fetching sectors:", error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const rolesData = await apiService.getRoles(userInfo.access_token);

      const nonProjectRole = rolesData.filter(
        (role) => role.project_related === false
      );
      setRoles(nonProjectRole);
    } catch (error) {
      console.error("Error fetching roles:", error.message);
    }
  };

  const handleChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: checked,
    };

    if (name === "isSector" && checked) {
      updatedFormData.isRoot = false;
      updatedFormData.isOrganizationUnit = false;
    } else if (name === "isRoot" && checked) {
      updatedFormData.isSector = false;
      updatedFormData.isOrganizationUnit = false;
    } else if (name === "isOrganizationUnit" && checked) {
      updatedFormData.isRoot = false;
      updatedFormData.isSector = false;
    }

    setFormData(updatedFormData);
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
      const response = await apiService.registerUser(formData);
      console.log("User registration response:", response);
  
      if (response.success) {
        setFormData({
          full_name: "",
          email: "",
          division: "",
          role: "",
          gender: "",
          isRoot: false,
          isSector: false,
          isOrganizationUnit: false,
        });
  
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
  
        Toast.fire({
          icon: "success",
          title: "User Registered successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchUsers();
        });
      } else {
        console.error("User registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to register a member",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };
  
  const resetFormData = () => {
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; 
        return acc;
      }, {});
      return resetFormData;
    });
  };

  return (
    <div className="px-4">
      <h2 className="role-title">Register New Member</h2>
      <form>
        <div className="flex flex-wrap ">
          <div>
          <div className="form-group">
            <label htmlFor="full_name" className="required">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              className=" w-full pl-3 h-14 mb-4"
              name="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Enter Full Name"
            />
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="required">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-80 pl-3 h-14"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="example@example.com"
                />
                {emailError && (
    <div className="text-red-500 mt-1 text-sm">
      {emailError}
    </div>
  )}
              </div>
            </div>
          </div>

          <div className="form-group mt-4 ">
            <label htmlFor="roles" className="required">
              Role
            </label>
            <Select
              id="role"
              className="w-80 mb-4"
              name="role"
              value={{
                value: formData.role,
                label:
                  roles.find((role) => role.role_id === formData.role)?.name ||
                  "",
              }}
              onChange={(selectedOption) =>
                handleChange(selectedOption, "role")
              }
              options={roles.map((role) => ({
                value: role.role_id,
                label: role.name,
              }))}
              placeholder="Select Division"
            />
            <div className="form-group">
              <label htmlFor="gender" className="required">
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
                placeholder="Select Gender"
              />
            </div>
            </div>
            <div className="mb-4 mt-5">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
                  onClick={() => {
                    resetFormData();
                  }}
                >
                  Reset
                </button>
                <button
                  className="text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                  style={{ backgroundColor: "#082f49" }}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Registernewuser;
