import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const Activitycomment = ({
  activityName,
  activityId,
  userId,
  handleCloseModal,
  handlefetchActivity,
}) => {
  useEffect(() => {
    console.log("Props received in Activitycomment:", {
      activityName,
      activityId,
      userId,
    });
  }, [activityName, activityId, userId]);

  const [formData, setFormData] = useState({
    comment: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCommentOnActivity = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.addComment(
        {
          comment: formData.comment,
        },
        {
          activity_id: activityId,
        }
      );

      console.log("Comment added:", response);

      if (response.status === 201) {
        setFormData({ comment: "" });

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
          title: "Comment has been added",
        }).then(() => {
          handleCloseModal();
          handlefetchActivity();
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error adding comment",
        text: error.response?.data?.message || "An error occurred",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  useEffect(() => {
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
  }, [handleCloseModal]);

  const resetFormData = () => {
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; // Reset each key to an empty string
        return acc;
      }, {});
      return resetFormData;
    });
  };

  return (
    <div className="px-8 py-4 flex flex-col">
      <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
        <label htmlFor="comment" >
        <div className="text-xl font-bold">
  Comment for {activityName}
</div>
        </label>
        <textarea
          id="comment"
          name="comment"
          rows="9"
          cols="40"
          className="w-full border-gray-300 rounded p-2 resize-none"
          style={{ backgroundColor: "#f3f3f4" }}
          placeholder={`Write a short comment `}
          //   placeholder={`Write a short comment for "${activityName}" the activity`}

          value={formData.comment}
          onChange={handleInputChange}
        ></textarea>
      </div>
      <div className="flex pt-3 justify-end">
     
        <button
          type="button"
          className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40 border border-[#d73d36] text-[#d73d36] font-bold"
          onClick={() => {
            resetFormData();
          }}
        >
          Reset
        </button>
        <div
          className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg cursor-pointer"
          onClick={handleCommentOnActivity}
        >
          Add Comment
        </div>
      </div>
    </div>
  );
};

export default Activitycomment;
