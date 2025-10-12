import React from "react";
import Swal from "sweetalert2";
import warning from "../Assets/warning.png";
import apiService from "../services/apiServices";
const Activitydelete = ({
  selectedRow,
  handleDeleteModalClose,
  handlefetchActivity,
}) => {
  const handleMoveToTrash = async () => {
    try {
      console.log(selectedRow);
      const response = await apiService.deleteActivity(selectedRow.activity_id);
      console.log("activity deleted:", response);

      if (response.status === 200) {
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
          title: "Activity deleted successfully ",
        }).then(() => {
          handleDeleteModalClose();
          handlefetchActivity();
        });
      }
    } catch (error) {
      console.error("Error deleting activity:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to delete activity",
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
          <img src={warning} className="w-8" alt="" />
          <div className="justify-center py-0.5">Delete Activity?</div>
        </div>
        <div className="mt-6 text-lg tracking-normal leading-6 text-justify text-zinc-500 max-md:max-w-full">
          Are you sure you want to delete this activity?
          <br />
        </div>
        <div className="flex gap-5 justify-between self-end ml-10 mt-6 text-base">
          <div
            className="my-auto cursor-pointer text-black"
            onClick={handleDeleteModalClose}
          >
            Cancel
          </div>
          <div
            className="cursor-pointer justify-center p-2.5 font-bold text-white bg-red-600 rounded-lg"
            onClick={handleMoveToTrash}
          >
            Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activitydelete;
