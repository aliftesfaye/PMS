import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./SectorModal.css";

const SectorEdit = ({ selectedRow, handlefetchClusters, handleCloseModal }) => {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const sectorName = selectedRow?.sector?.name || "";
  const leaderName =
    selectedRow?.leader && selectedRow.leader.length > 0
      ? selectedRow.leader[0].full_name
      : "";
  const leader_id =
    selectedRow?.leader && selectedRow.leader.length > 0
      ? selectedRow.leader[0].user_id
      : "";
  console.log(selectedRow);
  const [formData, setFormData] = useState({
    sector_name: sectorName,
    leader: leaderName,
    leader_id: leader_id,
  });
  const initialFormData = {
    sector_name: sectorName,
    leader: leaderName,
    leader_id: leader_id,
  };

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers(userInfo.access_token);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };
  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { sector_name, leader_id } = formData;
      const response = await apiService.updateSector(
        formData,
        selectedRow.sector.sector_id
      );
      console.log("Sector updated:", response);

      if (response && response.message === "Sector updated") {
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
          title: "Sector Updated successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchClusters();
        });
      }
    } catch (error) {
      console.error("Error updating sector:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to Update Sector",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const handleChange = (selectedOption, name) => {
    console.log(selectedOption);
    setFormData({
      ...formData, //check
      leader: selectedOption.label,
      leader_id: selectedOption.value,
    });
  };

  const resetFormData = (e) => {
    e.preventDefault();
    setFormData(initialFormData);
  };

  return (
    <div className=" w-fit px-8 py-3">
      <div className="role-title">Edit Cluster</div>
      <form>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sector_name ">Cluster Name</label>
            <input
              type="text"
              className="w-80 mt-2 h-14 px-4"
              id="sector_name"
              name="sector_name"
              value={formData.sector_name}
              placeholder="Enter sector Name"
              onChange={(e) =>
                setFormData({ ...formData, sector_name: e.target.value })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="leader" className="mt-4">
              Leader
            </label>
            <Select
              name="leader"
              className="w-80 mt-2"
              value={{ value: formData.leader, label: formData.leader }}
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
              styles={{
                menu: (provided) => ({
                  ...provided,
                  maxHeight: 70,
                  overflowY: "auto",
                }),
                menuList: (provided) => ({
                  ...provided,
                  padding: 0,
                }),
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 mb-4 ">
          <button
            type="button"
            className="flex justify-center items-center  p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
            onClick={(e) => {
              resetFormData(e);
            }}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 rounded-lg  text-white"
            style={{ backgroundColor: "#082f49" }}
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectorEdit;
