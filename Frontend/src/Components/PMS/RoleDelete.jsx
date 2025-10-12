import React from 'react';
import warning from "../Assets/warning.png";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
const RoleDelete = ({selectedRow,handleDeleteModalClose, handlefetchRoles}) => {
  const handleMoveToTrash = async () => {
    try {
      console.log(selectedRow)
      const response = await apiService.deleteRole(selectedRow.role_id);
      console.log("role deleted:", response);

      if (response && response.message === "role deleted successfully to recover go to trash page") {
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
          title: "role deleted successfully to recover go to trash page",
        }).then(() => {
          handleDeleteModalClose();
          handlefetchRoles();
        });
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to delete role",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="flex gap-5 px-12 pt-9 pb-16 bg-white rounded-2xl max-md:flex-wrap max-md:px-5">
      <div className="flex flex-col grow shrink-0 basis-0 w-fit max-md:max-w-full">
        <div className="flex gap-2 self-start mt-2.5 text-2xl font-bold text-blue-950">
          <img
            src={warning}
            className="w-8"
            alt=""
          />
          <div className="justify-center py-0.5">Move to trash?</div>
        </div>
        <div className="mt-6 text-lg tracking-normal leading-6 text-justify text-zinc-500 max-md:max-w-full">
          Are you sure you want to move this role to trash?
          <br />
          <br />
          Only allowed users can restore the role from trash.
        </div>
        <div className="flex gap-5 justify-between self-end ml-10 mt-6 text-base">
          <div className="my-auto cursor-pointer text-black" onClick={handleDeleteModalClose}>Cancel</div>
          <div className="cursor-pointer justify-center p-2.5 font-bold text-white bg-red-600 rounded-lg" onClick={handleMoveToTrash}>
            Move to trash
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDelete;
