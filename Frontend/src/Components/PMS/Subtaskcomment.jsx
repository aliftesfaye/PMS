import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import {
  X,
  MessageSquare,
  Send,
  Type,
  User,
  AlertCircle,
  Clock,
} from "lucide-react";

const Subtaskcomment = ({
  userId,
  handleCloseModal,
  handlefetchActivity,
  subtaskId,
}) => {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    console.log("Props received in Subtaskcomment:", { userId, subtaskId });
  }, [userId, subtaskId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setCharacterCount(value.length);
  };

  const handleCommentOnSubtask = async (e) => {
    e.preventDefault();

    if (!formData.comment.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Comment Required",
        text: "Please enter a comment before submitting.",
        confirmButtonColor: "#3b82f6",
        confirmButtonText: "OK",
        customClass: {
          popup: "rounded-2xl border border-gray-200",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.addSubtaskComment(
        {
          comment: formData.comment,
        },
        {
          sub_task_id: subtaskId,
        }
      );

      console.log("Comment added:", response);

      if (response.status === 201) {
        setFormData({ comment: "" });
        setCharacterCount(0);

        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          background: "#10b981",
          color: "white",
          customClass: {
            popup: "rounded-xl shadow-lg",
          },
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        await Toast.fire({
          icon: "success",
          title: "Comment added successfully!",
          iconColor: "white",
        });

        handleCloseModal();
        handlefetchActivity();
      }
    } catch (error) {
      console.error("Error adding comment:", error);

      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to Add Comment",
        text: error.response?.data?.message || "Please try again later.",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "Retry",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        customClass: {
          popup: "rounded-2xl border border-gray-200 shadow-xl",
          confirmButton: "rounded-lg",
          cancelButton: "rounded-lg",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          handleCommentOnSubtask(e);
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-sm">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add Comment</h2>
              <p className="text-sm text-gray-600 mt-0.5">
                Share your feedback or updates
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 pt-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg border border-gray-300">
                <User className="w-4 h-4 text-gray-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">User ID</p>
                <p className="text-xs text-gray-600">#{userId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-xs text-gray-600">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleCommentOnSubtask} className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor="comment"
                className="flex items-center space-x-2 text-sm font-semibold text-gray-900"
              >
                <Type className="w-4 h-4" />
                <span>Your Comment</span>
              </label>
              <div className="text-xs text-gray-500">
                <span
                  className={
                    characterCount > 500 ? "text-red-600 font-bold" : ""
                  }
                >
                  {characterCount}
                </span>
                /500 characters
              </div>
            </div>
            <div className="relative">
              <textarea
                id="comment"
                name="comment"
                rows="6"
                className="w-full px-4 py-3.5 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 resize-none placeholder:text-gray-400"
                placeholder="Type your comment here... Provide updates, ask questions, or share feedback about this subtask."
                value={formData.comment}
                onChange={handleInputChange}
                maxLength="500"
                disabled={isSubmitting}
              />
              <div className="absolute bottom-3 right-3">
                {characterCount > 450 && characterCount <= 500 && (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
                {characterCount > 500 && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
            {characterCount > 500 && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Comment exceeds 500 characters limit</span>
              </p>
            )}
          </div>

          {/* Tips */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-1">
              💡 Writing tips
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Be specific about changes or updates needed</li>
              <li>• Mention any blockers or dependencies</li>
              <li>• Include relevant links or references</li>
              <li>• Keep it concise and actionable</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting || !formData.comment.trim() || characterCount > 500
              }
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Add Comment</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="px-6 pb-6">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Comments are visible to all team members working on this subtask
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subtaskcomment;
