import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";

const ActivityCommentView = ({ activityId, selectedRow, handleCloseModal }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activityId) {
      fetchComments();
    }
  }, [activityId]);

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

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllActivityComments(activityId);
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

  return (
    <div className="p-6 rounded-lg shadow-md border border-gray-300 bg-white">
      <h2 className="text-2xl font-bold mb-4">Activity Comments</h2>
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
                  <span className="text-gray-500 ml-2">{comment.result}</span>
                </div>
                <p className="text-gray-700">{comment.comment.comment}</p>
              </div>
            ))
          : !loading && <div className="text-gray-500">No comments found.</div>}
      </div>
    </div>
  );
};

export default ActivityCommentView;
