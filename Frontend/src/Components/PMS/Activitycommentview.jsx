import React, { useEffect, useState, useCallback, useMemo } from "react";
import apiService from "../services/apiServices";
import {
  X,
  MessageSquare,
  User,
  Calendar,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ExternalLink
} from "lucide-react";
import { format } from 'date-fns';

const ActivityCommentView = ({ activityId, selectedRow, handleCloseModal }) => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "Success", label: "Success", color: "green" },
    { value: "Pending", label: "Pending", color: "yellow" },
    { value: "Failed", label: "Failed", color: "red" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "author", label: "By Author" },
  ];

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!activityId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllActivityComments(activityId);
      const sortedResponse = response.sort(
        (a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
      );
      setComments(sortedResponse);
      setFilteredComments(sortedResponse);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch comments. Please try again.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [activityId]);

  // Initial fetch
  useEffect(() => {
    if (activityId) {
      fetchComments();
    }
  }, [activityId, fetchComments]);

  // Filter and sort comments
  useEffect(() => {
    let result = [...comments];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(comment =>
        comment.comment.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comment.comment.commentedBy.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(comment => comment.result === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.comment.createdAt) - new Date(a.comment.createdAt);
        case "oldest":
          return new Date(a.comment.createdAt) - new Date(b.comment.createdAt);
        case "author":
          return a.comment.commentedBy.localeCompare(b.comment.commentedBy);
        default:
          return 0;
      }
    });

    setFilteredComments(result);
  }, [comments, searchQuery, statusFilter, sortBy]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseModal]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchComments();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Success":
        return <CheckCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Success":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Failed":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = useCallback((dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • h:mm a');
    } catch {
      return "Invalid date";
    }
  }, []);

  const stats = useMemo(() => ({
    total: comments.length,
    success: comments.filter(c => c.result === "Success").length,
    failed: comments.filter(c => c.result === "Failed").length,
    pending: comments.filter(c => c.result === "Pending").length,
  }), [comments]);

  if (!activityId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Activity Comments
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {selectedRow?.activityName || "Activity Details"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-150 disabled:opacity-50"
              aria-label="Refresh comments"
              title="Refresh comments"
            >
              <RefreshCw className={`w-4 h-4 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleCloseModal}
              className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors duration-150"
              aria-label="Close modal"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                <span className="font-medium">{stats.total}</span> total comments
              </span>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  <CheckCircle className="w-3 h-3" />
                  {stats.success}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700">
                  <XCircle className="w-3 h-3" />
                  {stats.failed}
                </span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700">
                  <Clock className="w-3 h-3" />
                  {stats.pending}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredComments.length} shown
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search comments or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all duration-150 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative min-w-[120px]">
                <Filter className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 z-10" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none appearance-none text-sm transition-all duration-150"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative min-w-[140px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none appearance-none text-sm transition-all duration-150"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-600">Loading comments...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-12 px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-red-600 font-medium mb-2">
                Error Loading Comments
              </p>
              <p className="text-gray-600 text-center mb-6 max-w-md">
                {error}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={fetchComments}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 font-medium text-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          ) : filteredComments.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {filteredComments.map((comment, index) => (
                  <div
                    key={`${comment.comment.id || comment.comment.createdAt}-${index}`}
                    className="bg-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-colors duration-150"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gray-50 rounded">
                          <User className="w-3.5 h-3.5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">
                            {comment.comment.commentedBy}
                          </p>
                          <div className="flex items-center mt-0.5 space-x-1.5">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatDate(comment.comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          comment.result
                        )}`}
                      >
                        {getStatusIcon(comment.result)}
                        {comment.result}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded p-3.5">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {comment.comment.comment}
                      </p>
                    </div>

                    {/* Optional metadata */}
                    {comment.comment.metadata?.tags && comment.comment.metadata.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {comment.comment.metadata.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                        {comment.comment.metadata.tags.length > 3 && (
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            +{comment.comment.metadata.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">
                {searchQuery || statusFilter !== "all"
                  ? "No matching comments found"
                  : "No comments yet"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Be the first to add a comment"}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="mt-3 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150 text-sm"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{filteredComments.length}</span> of{" "}
              <span className="font-medium">{comments.length}</span> comments
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Simple export functionality
                  const dataStr = JSON.stringify(filteredComments, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                  const exportFileDefaultName = `comments-${activityId}.json`;

                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-150 text-sm flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCommentView;