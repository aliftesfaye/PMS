import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const Editorganization = ({
  leader,
  selectedRow,
  handlefetchOrganization,
  handleCloseModal,
}) => {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  console.log(selectedRow);
  const leaderName = leader ? leader.UserRoleToUser.full_name : null;
  const leader_id = leader ? leader.UserRoleToUser.user_id : null;
  const [formData, setFormData] = useState({
    leader: leaderName,
    leader_id: leader_id,
  });

  const fetchUsers = async () => {
    try {
      const usersData = await apiService.getAllUsers(userInfo.access_token);
      setUsers(usersData);
      console.log(usersData);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Old leader name:", leaderName);

    console.log("Leader name:", formData.leader);
    try {
      const { leader_id } = formData;
      const response = await apiService.updateOrganization({
        selectedRow,
        leader_id,
      });
      console.log("Organization updated:", response);

      if (response && response.message === "Organization updated") {
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
          title: "Organization Updated successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchOrganization();
        });
      }
    } catch (error) {
      console.error("Error updating organization:", error.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to Update Organization",
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
    setFormData({
      leader: "",
    });
  };

  return (
    <div className="p-8 w-fit">
      <div className="role-title">Edit Organization's Leader</div>
      <form>
        <div className="form-group">
          <label htmlFor="leader">Leader</label>
          <Select
            name="leader"
            className="w-80"
            label="just incase"
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
              styles={customStyles}

          />
        </div>

        <div className="flex justify-end mt-5  ">
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
            className="px-4 py-2 rounded-lg text-white"
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

export default Editorganization;
