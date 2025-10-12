import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./SectorModal.css";
const SectorAdd = ({ handleCloseModal, handlefetchSectors }) => {
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    leader_id: "",
  });
  const [divisions, setDivisions] = useState([]);
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
 
  useEffect(() => {
    fetchDivisions();
    fetchUsers();
    async function fetchUsers2() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers2();

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

  const handleChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption.value,
    });
  };

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers(userInfo.access_token);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const fetchDivisions = async () => {
    try {
      const divisionsData = await apiService.getDivisions();
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const response = await apiService.addSectors(
        formData,
        userInfo.access_token
      );
      console.log("Response:", response);

      setFormData({
        name: "",
        sector_id: "",
        leader_id: "",
      });
      if (response.message === "New sector created") {
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
          title: "Sector Saved successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchSectors();
        });
      }
    } catch (error) {
      console.error("Error adding Sector:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add Sector",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
     
    }),
   
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
    menu: (provided, state) => ({
      ...provided,
      maxHeight: 75,
      overflowY: "auto", 
      scrollbarWidth: "thin", 
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-thumb": {
        borderRadius: "4px",
      },
      "&:hover::-webkit-scrollbar-thumb": {
      },
    }),
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: 75,
      padding: 0,
      overflowY: "auto", 
    }),
  };


  const resetFormData = () => {
    setFormData({
      sector: "",
      name: "",
      leader_id: "",
    });
  };

  return (
    <div className="">
      <div className="role-title">Add Cluster</div>
      <form onSubmit={handleSubmit}>
        <div className="form-row w-fit">
          <div className="">
            <label htmlFor="sector_name" className="required">
              Cluster Name
            </label>
            <input
              type="text"
              id="sector_name"
              name=""
              value={formData.name}
              placeholder="Enter Cluster Name"
              className="pl-4 w-80 h-14 "
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
        
        </div>

        <div className="form-row w-fit">
          <div className="form-group w-80 mt-8">
            <label htmlFor="leader" className="required ">
              Leader
            </label>
            <Select
              name="leader"
              className="w-80"
              value={{
                value: formData.leader_id,
                label:
                  users.find((user) => user.user_id === formData.leader_id)
                    ?.full_name || "",
              }}
              required
              onChange={(selectedOption) =>
                handleChange(selectedOption, "leader_id")
              }
              options={[...users]
                .sort((a, b) => a.full_name.localeCompare(b.full_name))
                .map((user) => ({
                  value: user.user_id,
                  label: user.full_name,
                }))}
                styles={customStyles}

            />
          </div>
        </div>

        <div className=" flex gap-3 mt-5 justify-end ">
          <button
            type="button"
            className="flex gap-2 p-2 rounded-lg text-lg  border-[#d73d36] text-[#d73d36] font-bold"
            onClick={() => {
              resetFormData();
            }}
          >
            Reset
          </button>
          <button
            className="text-white font-bold py-2 px-4 rounded"
            type="submit"
            onClick={handleSubmit}
            style={{ backgroundColor: "#082f49" }}
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectorAdd;
