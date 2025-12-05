import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";
import {
  X,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
      setError(null);
      const response = await apiService.getAllActivityComments(activityId);
      const sortedResponse = response.sort(
        (a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
      );
      setComments(sortedResponse);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Activity Comments
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {selectedRow?.activityName || "Activity Details"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-2">
                Error Loading Comments
              </p>
              <p className="text-gray-600 text-center">{error}</p>
              <button
                onClick={fetchComments}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : comments.length > 0 ? (
            <div className="h-full overflow-y-auto pr-2 space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {comment.comment.commentedBy}
                        </p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {formatDate(comment.comment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        comment.result === "Success"
                          ? "bg-green-100 text-green-800"
                          : comment.result === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {comment.result}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {comment.comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">No comments yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Be the first to add a comment
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold">{comments.length}</span>{" "}
              comments
            </div>
            <button
              onClick={handleCloseModal}
              className="px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCommentView;
