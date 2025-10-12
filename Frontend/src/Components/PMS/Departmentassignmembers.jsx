import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const Divisionassignmember = ({
  handleSectorAssignmemberModalClose,
  handlefetchOrganizationalunit,
  selectedRow,
  division_name,
  selectedDepartmentId,
}) => {
  const [memberOptions, setMemberOptions] = useState([]);
  const [leader, setLeader] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || {};
  });

  const handleLeaderChange = (selectedOption) => {
    setLeader(selectedOption ? selectedOption.value : null);
  };

  const handleMembersChange = (selectedOptions) => {
    setMembers(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleCheckboxChange = (e) => {
    setIsLeader(e.target.checked);
    if (e.target.checked) {
      setMembers([]);
    } else {
      setLeader(null);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      marginTop: "-15px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none",
    }),
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await apiService.getAllUsers(userInfo.access_token);
        const options = users.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));
        setMemberOptions(options);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo.access_token) {
      fetchUsers();
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("is_division_leader", isLeader);
    formData.append("division_id", selectedRow.division_id);

    if (isLeader) {
      formData.append("user_ids", leader);
    } else {
      members.forEach((member) => {
        formData.append("user_ids", member);
      });
    }

    try {
      const response = await apiService.assigntodepartment(
        selectedRow.division_id,
        formData
      );
      console.log(response);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: isLeader
            ? "Leader assigned successfully"
            : "Members assigned successfully",
          timer: 1500,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
          timerProgressBar: true,
        }).then(() => {
          handleSectorAssignmemberModalClose();
          handlefetchOrganizationalunit();
        });
      }
    } catch (error) {
      console.error("Error assigning leader to department:", error);
      Swal.fire({
        icon: "error",
        title: isLeader
          ? "Failed to assign leader to department"
          : "Failed to assign members to department",
        text: error.response?.data?.message || error.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const resetForm = () => {
    setLeader(null);
    setMembers([]);
    setIsLeader(false);
  };

  const handleResetClick = () => {
    resetForm();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div className=" text-2xl font-semibold " style={{ color: "#082f49" }}>
        Division {selectedRow.name}
      </div>

      <div className="flex gap-2 my-3 items-center">
        <input
          type="checkbox"
          checked={isLeader}
          onChange={handleCheckboxChange}
          className="h-4 w-4"
        />
        <label className="ml-1">Is Leader</label>
      </div>

      {isLeader ? (
        <div className=" mb-2">
          <div>
            Leader <span className="required"></span>
          </div>
          <Select
            name="leader"
            value={
              leader
                ? {
                    value: leader,
                    label: memberOptions.find(
                      (option) => option.value === leader
                    )?.label,
                  }
                : null
            }
            onChange={handleLeaderChange}
            options={memberOptions}
            className="mr-10 w-64"
            styles={customStyles}
          />
        </div>
      ) : (
        <div className=" mb-2">
          <div>
            Members <span className="required"></span>
          </div>
          <Select
            name="members"
            value={memberOptions.filter((option) =>
              members.includes(option.value)
            )}
            onChange={handleMembersChange}
            options={memberOptions}
            className="mr-10 w-64"
            styles={customStyles}
            isMulti
            closeMenuOnSelect={false}
          />
        </div>
      )}

      <div className="flex w-64 mr-10 mt-5 justify-end self-end text-base">
        <div
          className="flex justify-center cursor-pointer items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
          onClick={handleResetClick}
        >
          Reset
        </div>
        <button
          className="justify-center p-2.5 font-bold text-white rounded-lg cursor-pointer"
          type="submit"
          style={{ backgroundColor: "#082f49" }}
        >
          Assign
        </button>
      </div>
    </form>
  );
};

export default Divisionassignmember;



