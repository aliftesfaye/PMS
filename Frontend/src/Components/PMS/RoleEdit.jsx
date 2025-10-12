import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import "./Rolesmodal.css";

const RoleEdit = ({ handleCloseModal, handlefetchRoles, roleId }) => {
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [rolePermission, setRolePermission] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [initialRoleName, setInitialRoleName] = useState("");
  const [groupedSelectedPermissions, setGroupedSelectedPermissions] = useState({});
  const [initialSelectedPermissions, setInitialSelectedPermissions] = useState([]);
  const [initialSelectAll, setInitialSelectAll] = useState(false);
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPermissions([]); // Unselect all
      setGroupedSelectedPermissions({}); // Clear grouped selections
    } else {
      setSelectedPermissions(rolePermission); // Select all permissions
      // Set grouped selections to all permissions in each group
      const allGroupedPermissions = rolePermission.reduce((acc, permission) => {
        const groupCode = permission.group_code;
        if (!acc[groupCode]) {
          acc[groupCode] = [];
        }
        acc[groupCode].push(permission);
        return acc;
      }, {});
      
  
      setGroupedSelectedPermissions(allGroupedPermissions);
    }
    setSelectAll(!selectAll);
  };
  

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await apiService.getRoleById(roleId);
        setRoleName(role.name);
        setInitialRoleName(role.name);
        setSelectedPermissions(role.Permissions);
        setInitialSelectedPermissions(role.Permissions);
        setSelectAll(role.Permissions.length === rolePermission.length); // Adjust as needed
        setInitialSelectAll(role.Permissions.length === rolePermission.length);
        console.log("selected permissions...", role.Permissions);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };
  

    const fetchPermission = async () => {
      try {
        const permission = await apiService.getPermission();
        setRolePermission(permission);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
  
    fetchRole();
    fetchPermission();
  
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
}, [handleCloseModal, roleId]);

const handlePermissionChange = (permission) => {
  if (
      selectedPermissions.some(
          (selected) => selected.permission_id === permission.permission_id
      )
  ) {
      setSelectedPermissions(
          selectedPermissions.filter(
              (selected) => selected.permission_id !== permission.permission_id
          )
      );
  } else {
      setSelectedPermissions([...selectedPermissions, permission]);
  }
  
  // Update groupedSelectedPermissions if relevant
  const groupCode = permission.group_code;
  setGroupedSelectedPermissions((prev) => ({
      ...prev,
      [groupCode]: prev[groupCode] ? [...prev[groupCode], permission] : [permission],
  }));
};


  const groupedPermissions = rolePermission.reduce((acc, permission) => {
    const groupCode = permission.group_code;
    if (!acc[groupCode]) {
      acc[groupCode] = [];
    }
    acc[groupCode].push(permission);
    return acc;
  }, {});
  const handleRoleNameChange = (event) => {
    setRoleName(event.target.value);
  };
  const permissionsByGroup = {};
  rolePermission.forEach((permission) => {
    if (!permissionsByGroup[permission.groupCode]) {
      permissionsByGroup[permission.groupCode] = [];
    }
    permissionsByGroup[permission.groupCode].push(permission);
  });
  const handleSelectAllGroup = (groupCode) => {
    const currentSelection = groupedSelectedPermissions[groupCode] || [];
    const groupPermissions = groupedPermissions[groupCode] || [];
  
    if (currentSelection.length === groupPermissions.length) {
      // If all are selected, deselect them
      setGroupedSelectedPermissions((prev) => ({
        ...prev,
        [groupCode]: [],
      }));
      setSelectedPermissions((prev) =>
        prev.filter(
          (selected) => !groupPermissions.some(
            (permission) => permission.permission_id === selected.permission_id
          )
        )
      );
    } else {
      // If not all are selected, select them all
      setGroupedSelectedPermissions((prev) => ({
        ...prev,
        [groupCode]: groupPermissions,
      }));
      setSelectedPermissions((prev) => [
        ...prev,
        ...groupPermissions.filter(
          (permission) => !prev.some(
            (selected) => selected.permission_id === permission.permission_id
          )
        ),
      ]);
    }
  
    // Update selectAll state based on current selections
    const allGroupPermissions = Object.keys(groupedPermissions).every((key) => {
      return (groupedSelectedPermissions[key] || []).length === (groupedPermissions[key] || []).length;
    });
    setSelectAll(allGroupPermissions);
  };
  
  const handleSaveChanges = async () => {
    try {
      await apiService.updateRole({
        id: roleId,
        name: roleName,
        permissions: selectedPermissions,
      });
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
        title: "Role updated successfully",
      }).then(() => {
        handleCloseModal();
        handlefetchRoles();
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update Role",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };



  const resetFormData = () => {
    setRoleName(initialRoleName);
    setSelectedPermissions(initialSelectedPermissions);
    setSelectAll(initialSelectAll);
  };

  const permissionsRows = Object.entries(groupedPermissions).reduce((rows, [groupCode, permissions], index) => {
    if (index % 4 === 0) {
        rows.push([]);
    }
    rows[rows.length - 1].push(
        <div key={groupCode} className="w-1/4">
            <div className="text-blue-900 text-xl mb-2 mx-5">
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
                    {/* Add more mappings if needed */}
                </strong>
            </div>
            <div className="">
                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        checked={
                            (groupedSelectedPermissions[groupCode] || []).length ===
                            permissions.length
                        }
                        onChange={() => handleSelectAllGroup(groupCode)}
                        className="mr-2"
                    />
                    Select All
                </label>
                {permissions.map((permission) => (
                    <label className="checkbox-label flex items-center my-1" key={permission.permission_id}>
                        <input
                            type="checkbox"
                            className="mr-2"
                            checked={
                                selectedPermissions.some(
                                    (selected) =>
                                        selected.permission_id === permission.permission_id
                                ) || (groupedSelectedPermissions[groupCode] || []).some(
                                    (selected) => selected.permission_id === permission.permission_id
                                )
                            }
                            onChange={() => handlePermissionChange(permission)}
                        />
                        <div>
                        {permission.name}</div>
                    </label>
                ))}
            </div>
        </div>
    );
    return rows;
}, []).map((row, index) => (
    <div key={index} className="flex">
        {row}
    </div>
));

  const emptyPlaceholders = Array(
    Math.ceil(Object.keys(groupedPermissions).length / 4) * 4 -
      Object.keys(groupedPermissions).length
  )
    .fill(null)
    .map((_, index) => <div key={index} className="w-1/4" />);

  return (
    <div className="mx-5 h-96 mb-5 overflow-y-auto">
      <div className="">
        <div className="role-title mx-5">Edit Role</div>
        <div className="mx-5 mb-2">Role Name </div>
       
        <div className="mx-5">
          <input
            type="text"
            className="px-3"
            value={roleName}
            onChange={handleRoleNameChange}
            required
          />
        </div>
        <div
          className="text-xl font-bold font-poppins ml-5  mt-2 "
          style={{ color: "#172B4D" }}
        >
          Permissions
        </div>
        <div className="">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="mr-2 my-2"
            />
            Select All Permissions
          </label>
        </div>
        <div>{permissionsRows}</div>
        <div className="flex">{emptyPlaceholders}</div>
        <div className="justify-end flex   my-6">
          <button
            type="button"
            className="flex justify-center items-center  p-2 rounded-lg text-lg w-40   text-[#d73d36] font-bold"
            onClick={() => {
              resetFormData();
            }}
          >
            Reset
          </button>
          <button
            className="text-white font-bold py-2 px-4 rounded"
            style={{ backgroundColor: "#082f49" }}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleEdit;
