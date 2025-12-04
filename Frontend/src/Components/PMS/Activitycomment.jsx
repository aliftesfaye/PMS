import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";
import { Send, X } from "lucide-react";

const Activitycomment = ({
  activityName,
  activityId,
  userId,
  handleCloseModal,
  handlefetchActivity,
}) => {
  const [formData, setFormData] = useState({
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const characterCount = formData.comment.length;
  const maxCharacters = 500;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleCommentOnActivity = async (e) => {
    e.preventDefault();
    if (!formData.comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await apiService.addComment(
        {
          comment: formData.comment,
        },
        {
          activity_id: activityId,
        }
      );

      if (response.status === 201) {
        setFormData({ comment: "" });

        // Success notification
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Comment Added",
          showConfirmButton: false,
          timer: 2000,
          background: "#10B981",
          color: "#FFFFFF",
          toast: true,
          customClass: {
            popup: "animate__animated animate__fadeInRight",
          },
        });

        handleCloseModal();
        handlefetchActivity();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add",
        text: error.response?.data?.message || "Please try again",
        confirmButtonText: "Okay",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Add Comment
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Activity: {activityName}
              </p>
            </div>
            <button
              onClick={handleCloseModal}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Textarea with character counter */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-slate-700">
                Your comment
              </label>
              <span
                className={`text-sm font-medium ${
                  characterCount > maxCharacters * 0.8
                    ? "text-red-500"
                    : "text-slate-500"
                }`}
              >
                {characterCount}/{maxCharacters}
              </span>
            </div>

            <div className="relative">
              <textarea
                id="comment"
                name="comment"
                rows="5"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Write your comment here..."
                value={formData.comment}
                onChange={handleInputChange}
                maxLength={maxCharacters}
                autoFocus
              />
            </div>

            {/* Tips */}
            {characterCount === 0 && (
              <div className="mt-3">
                <p className="text-xs text-slate-500">
                  Tip: Be specific and constructive with your feedback.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleCommentOnActivity}
              disabled={!formData.comment.trim() || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                !formData.comment.trim() || isSubmitting
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        </div>

        {/* Footer Note */}
        <div className="px-6 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Comments will be visible to team members.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Activitycomment;
