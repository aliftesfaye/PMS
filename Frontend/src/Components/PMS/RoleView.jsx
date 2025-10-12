import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";

const RoleView = (props) => {
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [rolePermission, setRolePermission] = useState([]);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        const permissionsResponse = await apiService.getSpecificRolePermission(
          props.id.role_id
        );
        setPermissions(permissionsResponse.Permissions);
        setRoleName(permissionsResponse.name);
        setRolePermission(permissionsResponse.Permissions); // Update rolePermission state
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchRoleData();
  }, [props.id.role_id]);

  const groupedPermissions = rolePermission.reduce((acc, permission) => {
    const groupCode = permission.group_code;
    if (!acc[groupCode]) {
      acc[groupCode] = [];
    }
    acc[groupCode].push(permission);
    return acc;
  }, {});

  const renderPermissions = Object.entries(groupedPermissions).map(([groupCode, permissions]) => (
    <div key={groupCode} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"> {/* Responsive widths */}
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
        </strong>
      </div>
      <ul className="list-disc pl-3">
        {permissions.map((permiss) => (
          <li className="ml-3 mr-3 my-2" key={permiss.permission_id}>
            <p>{permiss.name}</p>
          </li>
        ))}
      </ul>
    </div>
  ));

  return (
    <div className="mx-10 h-96 mb-5 overflow-y-auto">
      <div className="mb-4 text-3xl font-bold font-poppins" style={{ color: "#172B4D" }}>
        {roleName.charAt(0).toUpperCase() + roleName.slice(1)}
      </div>

      <div className="text-xl font-bold font-poppins " style={{ color: "#172B4D" }}>
        Permissions
      </div>
      <div className="flex flex-wrap">{renderPermissions}</div> {/* Use flex-wrap to allow items to wrap */}
    </div>
  );
};

export default RoleView;
