import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";

const SubtaskCommentView = ({ subtaskId, selectedRow, handleCloseModal }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subtaskId) {
      fetchComments();
    }
  }, [subtaskId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllSubtaskComments(subtaskId);
      const sortedResponse = response.sort(
        (a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
      );
      setComments(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setLoading(false);
      setError("Failed to fetch comments. Please try again later.");
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
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
      <div className="relative bg-white p-6 rounded-lg shadow-md border border-gray-300 max-w-lg w-full">
        <button
          onClick={handleCloseModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-4">Subtask Comments</h2>
        <div className="h-80 overflow-y-scroll">
          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && comments.length > 0
            ? comments.map((comment, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center mb-2">
                    <p className="text-gray-800 font-semibold">
                      {comment.comment.commentedBy}
                    </p>
                    <span className="text-gray-500 ml-4 text-sm">
                      {comment.result}
                    </span>
                  </div>
                  <p className="text-gray-700 w-1/2 ">
                    {comment.comment.comment}
                  </p>
                </div>
              ))
            : !loading && (
                <div className="text-gray-500">No comments found.</div>
              )}
        </div>
      </div>
    </div>
  );
};

export default SubtaskCommentView;
