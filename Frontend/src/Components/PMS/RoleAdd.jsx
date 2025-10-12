import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./Rolesmodal.css";

const RoleAdd = ({ handleCloseModal, handlefetchRoles }) => {
  const [rolePermission, setRolePermission] = useState([]);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [categorySelection, setCategorySelection] = useState({});

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPermission([]);
    } else {
      const allPermissionIds = rolePermission.map(
        (permission) => permission.permission_id
      );
      setSelectedPermission(allPermissionIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const permission = await apiService.getPermission();
        setRolePermission(permission);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermission();

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


  const handlePermissionChange = (permission) => {
    if (selectedPermission.includes(permission)) {
      setSelectedPermission(
        selectedPermission.filter((item) => item !== permission)
      );
    } else {
      setSelectedPermission([...selectedPermission, permission]);
    }
  };
  
  const handleSelectCategory = (groupCode) => {
    if (categorySelection[groupCode]) {
      const permissionsToDeselect = groupedPermissions[groupCode].map(
        (permission) => permission.permission_id
      );
      setSelectedPermission(
        selectedPermission.filter((id) => !permissionsToDeselect.includes(id))
      );
    } else {
      const permissionsToSelect = groupedPermissions[groupCode].map(
        (permission) => permission.permission_id
      );
      setSelectedPermission([...selectedPermission, ...permissionsToSelect]);
    }
    setCategorySelection((prev) => ({
      ...prev,
      [groupCode]: !prev[groupCode],
    }));
  };
  
  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const newRole = {
        name: roleName,
        permissions: selectedPermission,
      };

      const response = await apiService.addRole(newRole);

      console.log("New role added successfully:", response);
      setRoleName("");
      setSelectedPermission([]);

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
        title: "Role added successfully",
      }).then(() => {
        handleCloseModal();
        handlefetchRoles();
      });
    } catch (error) {
      console.error("Error adding new role:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to add Role",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const groupedPermissions = rolePermission.reduce((acc, permission) => {
    const groupCode = permission.group_code;
    if (!acc[groupCode]) {
      acc[groupCode] = [];
    }
    acc[groupCode].push(permission);
    return acc;
  }, {});

  const handleCancel = () => {
    handleCloseModal();
    handlefetchRoles();
  };

  const resetFormData = () => {
    setSelectedPermission([]);
    setRoleName("");
    setSelectAll(false);
  };

  const renderPermissions = Object.entries(groupedPermissions)
  .reduce((rows, [groupCode, permissions], index) => {
    if (index % 4 === 0) {
      rows.push([]);
    }
    rows[rows.length - 1].push(
      <div key={groupCode} className="w-full sm:w-1/2 lg:w-1/4 p-2">
        <div className="text-blue-900 ml-4 text-xl">
          <strong>
            {groupCode === "1" && "Organization"}
            {groupCode === "2" && "Member"}
            {groupCode === "3" && "Project"}
            {groupCode === "4" && "Activity"}
            {groupCode === "5" && "Task"}
            {groupCode === "6" && "Subtask"}
            {groupCode === "7" && "Team"}
            {groupCode === "8" && "Dashboard"}
            {groupCode === "9" && "Trash"}
            {groupCode === "10" && "Milestone"}
            {groupCode === "11" && "Structure"}
            {groupCode === "12" && "Document"}
          </strong>
        </div>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={categorySelection[groupCode] || false}
            onChange={() => handleSelectCategory(groupCode)}
            className="mr-2"
          />
          Select All 
        </label>

        {/* Permissions List */}
        <div className="flex flex-col mt-2">
        {permissions.map((permission) => (
  <label key={permission.permission_id} className="checkbox-label flex items-center my-1">
    <input
      type="checkbox"
      className="mr-2"
      checked={selectedPermission.includes(permission.permission_id)}
      onChange={() => handlePermissionChange(permission.permission_id)}
    />
    <span className="flex-1 overflow-visible whitespace-normal" title={permission.name}>
      {permission.name}
    </span>
  </label>
))}

        </div>
      </div>
    );
    return rows;
  }, [])
  .map((row, index) => (
    <div key={index} className="flex flex-wrap">
      {row}
    </div>
  ));




  const emptyPlaceholders = Array(
    Math.ceil(Object.keys(groupedPermissions).length / 4) * 4 -
      Object.keys(groupedPermissions).length
  )
    .fill(null)
    .map((_, index) => <div key={index} className="w-full sm:w-1/2 lg:w-1/4 p-2" />);

  return (
    <div className="mx-5 h-96 mb-5 overflow-y-auto overflow-x-auto">
      <div>
        <div className="role-title mx-5">Add New Role</div>
        <div className="mx-5 mb-2">Role Name </div>
        <div className="mx-5">
          <input
            type="text"
            placeholder="Role Name"
            className="px-3 "
            value={roleName}
            onChange={handleRoleNameChange}
            required
          />
        </div>
        <div
          className="text-xl font-bold font-poppins ml-5 mt-2"
          style={{ color: "#172B4D" }}
        >
          Permissions
        </div>
        <div className="permissions-list">
          <div>
            <label className="checkbox-label ml-3">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="mr-2 ml-4 my-2"
              />
              Select All Permissions
            </label>
          </div>
        </div>
      
        {renderPermissions}
        <div className="flex">{emptyPlaceholders}</div>

        <div className="justify-end flex mr-7 my-6">
          <button
            type="button"
            className="flex justify-center items-center p-2 rounded-lg text-lg w-40 border-[#d73d36] text-[#d73d36] font-bold"
            onClick={resetFormData}
          >
            Reset
          </button>
          <button
            className="text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
            style={{ backgroundColor: "#082f49" }}
          >
            Add Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAdd;
