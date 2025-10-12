import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import apiService from '../services/apiServices';

const Subtaskcomment = ({ userId, handleCloseModal, handlefetchActivity, subtaskId}) => {
  useEffect(() => {
    console.log('Props received in Subtaskcomment:', {  userId , subtaskId });
  }, [ userId, subtaskId]);

  const [formData, setFormData] = useState({
    comment: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCommentOnSubtask = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.addSubtaskComment({
        comment: formData.comment,
      }, {
        sub_task_id: subtaskId,
       
      });
  
      console.log('Comment added:', response);
  
      if (response.status === 201) {
        setFormData({ comment: '' });
  
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
  
        Toast.fire({
          icon: 'success',
          title: 'Comment has been added',
        }).then(() => {
          handleCloseModal();
          handlefetchActivity();
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Error adding comment',
        text: error.response?.data?.message || 'An error occurred',
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: 'custom-popup-style',
        },
      });
    }
  };
  

  return (
    <div className="px-8 py-4 flex flex-col">
      <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
        <label htmlFor="comment" className="my-4">
          {/* Comment for {activityName} */}
          Comment 
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
      <div className="flex gap-5 pt-3 justify-end">
        <div className="my-auto text-black" onClick={handleCloseModal}>Cancel</div>
        <div
          className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg cursor-pointer"
          onClick={handleCommentOnSubtask}
        >
          Add Comment
        </div>
      </div>
    </div>
  );
};

export default Subtaskcomment;
