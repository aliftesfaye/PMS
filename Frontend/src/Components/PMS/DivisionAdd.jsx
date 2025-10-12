import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./OrganizationalUnitModal.css";
const DivisionAdd = ({
  handleCloseModal,
  handlefetchClusters,
  selectedSectorId,
}) => {
  // Add selectedSectorId to props
  const [formData, setFormData] = useState({
    sector_id: selectedSectorId || "",
    name: "",
  });

  const [organizations, setOrganizations] = useState([]);
  const [users, setUsers] = useState([]);
  const handleChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });
  };
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await apiService.addorganizationalunit(formData);
      console.log(response);
      if (response.message === "New division created") {
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
          title: "Department Added successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchClusters();
        });
      }
    } catch (error) {
      console.error("Error adding department:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add Department",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const resetFormData = () => {
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; // Reset each key to an empty string
        return acc;
      }, {});
      return resetFormData;
    });
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const organizationsData = await apiService.getallOrganizations(
          userInfo.access_token
        );
        const allEmployees = await apiService.getAllUsers(
          userInfo.access_token
        );
        console.log("Fetched organizations:", organizationsData);
        console.log("fetched all employees", allEmployees);
        setOrganizations(organizationsData);
        setUsers(allEmployees);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();

    fetchOrganizations();

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
  }, [handleCloseModal]);

  return (
    <div className="">
      <div className="add-div-title">Add Department</div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="division_name" className="required">
              Department Name
            </label>
            <input
              type="text"
              id="division_name"
              name="division_name"
            
              value={formData.name}
              className="pl-4 w-80 h-14"
              placeholder="Enter Department Name"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end  mt-4 mb-10 ">
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
            style={{ backgroundColor: "#082f49" }}
          >
            Add Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default DivisionAdd;
