import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./SectorModal.css";

const Organizationaluniteditt = ({
  selectedRow,
  handleCloseModal,
  handlefetchOrganizationalunit,
}) => {
  console.log("Selected Row:", selectedRow);

  const [formData, setFormData] = useState({
    division_name: selectedRow?.name || "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const fetchOrganizations = async () => {
    try {
      const organizationsData = await apiService.getallOrganizations(
        userInfo.access_token
      );
      setOrganizations(organizationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations();
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

  }, [userInfo ,handleCloseModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      division_name: formData.division_name,
    };

    console.log("Form submitted:", updatedFormData);

    try {
      // Update the department name in one API call
      const response = await apiService.updateDepartment(selectedRow.division_id, updatedFormData);

      console.log("Department updated successfully");

      Swal.fire({
        icon: "success",
        title: "Department Updated successfully",
        timer: 1500,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
        timerProgressBar: true,
      }).then(() => {
        handleCloseModal();
        handlefetchOrganizationalunit();
      });
    } catch (error) {
      console.error("Error updating department:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update Department",
        text: error.response?.data?.message || error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const resetFormData = (e) => {
    e.preventDefault();
    setFormData({
      division_name: selectedRow?.name || "",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      division_name: e.target.value,
    });
  };

  return (
    <div className="">
      <div className="role-title">Edit Department</div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="division_name">Department Name</label>
            <input
              type="text"
              className="w-80 h-14 px-4"
              id="division_name"
              name="division_name"
              value={formData.division_name}
              placeholder="Enter Department Name"
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex mt-3 mb-4 justify-end  ">

          <button
            type="button"
            className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
            onClick={(e) => {
              resetFormData(e);
            }}
          >
            Reset
          </button>

          <button
            className="px-4 rounded-lg py-2 text-white"
            style={{ backgroundColor: "#082f49" }}
            type="submit"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Organizationaluniteditt;
