import React, { useEffect, useState } from "react";
import apiService from "../services/apiServices";
import {
  X,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ListTodo,
} from "lucide-react";

const SubtaskCommentView = ({ subtaskId, selectedRow, handleCloseModal }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (subtaskId) {
      fetchComments();
    }
  }, [subtaskId]);

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
      const response = await apiService.getAllSubtaskComments(subtaskId);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getResultIcon = (result) => {
    switch (result?.toLowerCase()) {
      case "completed":
      case "success":
      case "done":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "pending":
      case "in progress":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "failed":
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResultColor = (result) => {
    switch (result?.toLowerCase()) {
      case "completed":
      case "success":
      case "done":
        return "bg-green-50 border-green-200";
      case "pending":
      case "in progress":
        return "bg-amber-50 border-amber-200";
      case "failed":
      case "error":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 truncate">
                Subtask Comments
              </h2>
              {selectedRow && (
                <div className="flex items-center mt-1 space-x-2">
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {selectedRow.subtaskName || "Subtask Details"}
                  </p>
                  {selectedRow.status && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedRow.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : selectedRow.status === "In Progress"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedRow.status}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={handleCloseModal}
            className="p-2 hover:bg-white/50 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col p-6">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Total Comments</span>
                <span className="font-bold text-gray-900">
                  {comments.length}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Latest</span>
                <span className="font-medium text-gray-900">
                  {comments.length > 0
                    ? formatDate(comments[0]?.comment?.createdAt)
                    : "N/A"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchComments}
              disabled={loading}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
          </div>

          {/* Comments Area */}
          <div className="flex-1 overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="relative">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-400 blur-xl opacity-20 animate-pulse"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">
                  Loading comments...
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Fetching from server
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="p-4 bg-red-50 rounded-full mb-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <p className="text-red-600 font-bold text-lg mb-2">
                  Connection Error
                </p>
                <p className="text-gray-600 text-center mb-6 max-w-md">
                  {error}
                </p>
                <button
                  onClick={fetchComments}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retry Loading Comments</span>
                  </span>
                </button>
              </div>
            ) : comments.length > 0 ? (
              <div className="h-full overflow-y-auto pr-2 space-y-4">
                {comments.map((comment, index) => (
                  <div
                    key={index}
                    className={`p-5 rounded-xl border transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${getResultColor(
                      comment.result
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-200">
                          <User className="w-4 h-4 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {comment.comment.commentedBy}
                          </p>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="flex items-center space-x-1 text-sm text-gray-500">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {formatDate(comment.comment.createdAt)}
                              </span>
                            </span>
                            <div className="flex items-center space-x-2">
                              {getResultIcon(comment.result)}
                              <span
                                className={`text-sm font-medium px-2.5 py-1 rounded-full ${
                                  comment.result?.toLowerCase() === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : comment.result?.toLowerCase() ===
                                      "pending"
                                    ? "bg-amber-100 text-amber-800"
                                    : comment.result?.toLowerCase() === "failed"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {comment.result}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {comment.comment.comment}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-6">
                  <MessageSquare className="w-16 h-16 text-gray-400" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  No Comments Yet
                </p>
                <p className="text-gray-600 text-center max-w-md mb-6">
                  This subtask doesn't have any comments. Be the first to add
                  feedback or updates.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Track progress</span>
                  </span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
                  <span className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>Add updates</span>
                  </span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Monitor status</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600 flex items-center space-x-4">
              <span>
                Subtask ID:{" "}
                <code className="px-2 py-1 bg-gray-200 rounded text-gray-800 font-mono">
                  {subtaskId.slice(0, 7)}
                </code>
              </span>
              {selectedRow?.dueDate && (
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Due: {new Date(selectedRow.dueDate).toLocaleDateString()}
                  </span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 hover:shadow-sm"
              >
                Close
              </button>
              <button
                onClick={fetchComments}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Refresh Comments
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskCommentView;
