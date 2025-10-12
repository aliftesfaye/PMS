import React from "react";
import Swal from "sweetalert2";
import warning from "../Assets/warning.png";
import apiService from "../services/apiServices";
const OrganizationalUnitdelete = ({
  selectedRow,
  handlefetchClusters,
  handleDeleteDepartmentModalClose,
}) => {
  const handleMoveToTrash = async () => {
    try {
      const response = await apiService.deleteDivision(selectedRow.division_id);

      if (
        response &&
        response.message ===
          "division deleted successfully to recover go to trash page"
      ) {
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
          title: "department deleted successfully to recover go to trash page",
        }).then(() => {
          handleDeleteDepartmentModalClose();
          handlefetchClusters();
        });
      }
    } catch (error) {
      console.error("Error deleting department:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to delete department",
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="flex gap-5 px-12 pt-9 pb-16 bg-white rounded-2xl max-md:flex-wrap max-md:px-5">
      <div className="flex flex-col grow shrink-0 basis-0 w-fit max-md:max-w-full">
        <div className="flex gap-2 self-start mt-2.5 text-2xl font-bold text-blue-950">
          <img src={warning} className="w-8" alt="" />
          <div className="justify-center py-0.5">Move to trash?</div>
        </div>
        <div className="mt-6 text-lg tracking-normal leading-6 text-justify text-zinc-500 max-md:max-w-full">
          Are you sure you want to move this organizational unit to trash?
          <br />
          <br />
          Only allowed users can restore the organizational unit from trash.
        </div>
        <div className="flex gap-5 justify-between self-end ml-10 mt-6 text-base">
          <div
            className="my-auto cursor-pointer text-black"
            onClick={handleDeleteDepartmentModalClose}
          >
            Cancel
          </div>
          <div
            className="cursor-pointer justify-center p-2.5 font-bold text-white bg-red-600 rounded-lg"
            onClick={handleMoveToTrash}
          >
            Move to trash
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalUnitdelete;
