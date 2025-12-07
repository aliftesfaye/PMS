import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
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
  RefreshCw,
  FileText,
  TrendingUp,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Download,
  ExternalLink,
  MoreVertical,
  Copy,
  Eye,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Sparkles
} from "lucide-react";
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

const SubtaskCommentView = ({ subtaskId, selectedRow, handleCloseModal }) => {
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedComment, setExpandedComment] = useState(null);
  const [showMetrics, setShowMetrics] = useState(false);
  const [activeTab, setActiveTab] = useState("comments");
  const [selectedComments, setSelectedComments] = useState(new Set());
  const [commentStats, setCommentStats] = useState({});
  const modalRef = useRef();

  const statusOptions = [
    { value: "all", label: "All Status", color: "gray" },
    { value: "completed", label: "Completed", color: "green" },
    { value: "success", label: "Success", color: "green" },
    { value: "pending", label: "Pending", color: "yellow" },
    { value: "in progress", label: "In Progress", color: "yellow" },
    { value: "failed", label: "Failed", color: "red" },
    { value: "error", label: "Error", color: "red" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "status", label: "By Status" },
    { value: "author", label: "By Author" },
  ];

  // Calculate metrics
  const calculateMetrics = useCallback((comments) => {
    const stats = {
      completed: 0,
      pending: 0,
      failed: 0,
      total: comments.length,
      authors: new Set(),
      timeline: [],
      avgCommentLength: 0,
      sentimentScore: 0
    };

    let totalLength = 0;
    const authorSet = new Set();
    const timelineData = [];

    comments.forEach((comment, index) => {
      const result = comment.result?.toLowerCase();
      if (['completed', 'success', 'done'].includes(result)) {
        stats.completed++;
      } else if (['pending', 'in progress'].includes(result)) {
        stats.pending++;
      } else if (['failed', 'error'].includes(result)) {
        stats.failed++;
      }

      authorSet.add(comment.comment.commentedBy);
      totalLength += comment.comment.comment.length;

      // Add to timeline for chart
      timelineData.push({
        index,
        date: new Date(comment.comment.createdAt),
        status: result
      });
    });

    stats.authors = authorSet.size;
    stats.avgCommentLength = stats.total > 0 ? Math.round(totalLength / stats.total) : 0;
    stats.timeline = timelineData;

    return stats;
  }, []);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    if (!subtaskId) return;

    try {
      if (refreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const response = await apiService.getAllSubtaskComments(subtaskId);
      const sortedResponse = response.sort(
        (a, b) => new Date(b.comment.createdAt) - new Date(a.comment.createdAt)
      );
      setComments(sortedResponse);
      setFilteredComments(sortedResponse);
      setCommentStats(calculateMetrics(sortedResponse));
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Unable to load comments. Please check your connection and try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [subtaskId, refreshing, calculateMetrics]);

  // Initial fetch
  useEffect(() => {
    if (subtaskId) {
      fetchComments();
    }
  }, [subtaskId, fetchComments]);

  // Filter and sort comments
  useEffect(() => {
    let result = [...comments];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(comment =>
        comment.comment.comment.toLowerCase().includes(query) ||
        comment.comment.commentedBy.toLowerCase().includes(query) ||
        comment.result?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(comment =>
        comment.result?.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.comment.createdAt) - new Date(a.comment.createdAt);
        case "oldest":
          return new Date(a.comment.createdAt) - new Date(b.comment.createdAt);
        case "status":
          return (a.result || "").localeCompare(b.result || "");
        case "author":
          return a.comment.commentedBy.localeCompare(b.comment.commentedBy);
        default:
          return 0;
      }
    });

    setFilteredComments(result);
    setCommentStats(calculateMetrics(result));
  }, [comments, searchQuery, statusFilter, sortBy, calculateMetrics]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
      if (event.key === "m" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        setShowMetrics(!showMetrics);
      }
      if (event.key === "f" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleCloseModal, showMetrics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComments();
  };

  const handleCopyComment = (comment) => {
    navigator.clipboard.writeText(comment.comment.comment);
    // Could add toast notification here
  };

  const handleExportCSV = () => {
    return filteredComments.map(comment => ({
      Author: comment.comment.commentedBy,
      Comment: comment.comment.comment,
      Status: comment.result || "No Status",
      Date: format(new Date(comment.comment.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      "Date (Readable)": formatDate(comment.comment.createdAt),
      "Comment Length": comment.comment.comment.length,
      Subtask: selectedRow?.subtaskName || "N/A"
    }));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();

      if (isToday(date)) {
        return `Today at ${format(date, 'h:mm a')}`;
      } else if (isYesterday(date)) {
        return `Yesterday at ${format(date, 'h:mm a')}`;
      } else if ((now - date) / (1000 * 60 * 60 * 24) < 7) {
        return format(date, 'EEEE') + ' at ' + format(date, 'h:mm a');
      } else {
        return format(date, 'MMM d, yyyy • h:mm a');
      }
    } catch {
      return "Invalid date";
    }
  };

  const getFullDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'PPPPpp');
  };

  const getResultIcon = (result) => {
    const lowerResult = result?.toLowerCase();
    switch (lowerResult) {
      case "completed":
      case "success":
      case "done":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case "pending":
      case "in progress":
        return <Clock className="w-4 h-4 text-amber-600" />;
      case "failed":
      case "error":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getResultColor = (result) => {
    const lowerResult = result?.toLowerCase();
    switch (lowerResult) {
      case "completed":
      case "success":
      case "done":
        return "border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/30 to-white";
      case "pending":
      case "in progress":
        return "border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50/30 to-white";
      case "failed":
      case "error":
        return "border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50/30 to-white";
      default:
        return "border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50/30 to-white";
    }
  };

  const getResultBadgeColor = (result) => {
    const lowerResult = result?.toLowerCase();
    switch (lowerResult) {
      case "completed":
      case "success":
      case "done":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "pending":
      case "in progress":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "failed":
      case "error":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Timeline chart data
  const chartData = useMemo(() => {
    const data = filteredComments.map((comment, index) => ({
      name: `#${index + 1}`,
      date: format(new Date(comment.comment.createdAt), 'MMM dd'),
      value: index,
      status: comment.result?.toLowerCase()
    }));
    return data;
  }, [filteredComments]);

  if (!subtaskId) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && handleCloseModal()}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
      >
        {/* Header with tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <ListTodo className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  Subtask Comments & Analytics
                </h2>
                {selectedRow && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-600 truncate max-w-md">
                      {selectedRow.subtaskName || "Subtask Details"}
                    </p>
                    {selectedRow.status && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(selectedRow.status)}`}
                      >
                        {selectedRow.status}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`p-2 rounded-lg transition-colors ${showMetrics ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Toggle metrics (Ctrl+M)"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                aria-label="Refresh comments"
              >
                <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-6">
            <button
              onClick={() => setActiveTab("comments")}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === "comments"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Comments ({comments.length})
              {activeTab === "comments" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${activeTab === "analytics"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              Analytics
              {activeTab === "analytics" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="search-input"
                type="text"
                placeholder="Search comments, authors, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative min-w-[140px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 z-10" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative min-w-[140px]">
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none text-sm"
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

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className={`flex-1 overflow-hidden flex flex-col ${showMetrics ? 'lg:w-2/3' : 'w-full'}`}>
            {activeTab === "comments" ? (
              <>
                {/* Stats Overview */}
                <div className="p-4 border-b border-gray-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-700 font-medium">Total Comments</p>
                          <p className="text-2xl font-bold text-gray-900">{commentStats.total || 0}</p>
                        </div>
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-emerald-700 font-medium">Completed</p>
                          <p className="text-2xl font-bold text-emerald-700">{commentStats.completed || 0}</p>
                        </div>
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-amber-700 font-medium">In Progress</p>
                          <p className="text-2xl font-bold text-amber-700">{commentStats.pending || 0}</p>
                        </div>
                        <Clock className="w-5 h-5 text-amber-500" />
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-lg border border-rose-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-rose-700 font-medium">Attention</p>
                          <p className="text-2xl font-bold text-rose-700">{commentStats.failed || 0}</p>
                        </div>
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="relative">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-400 blur-xl opacity-20 animate-pulse"></div>
                      </div>
                      <p className="mt-4 text-gray-600 font-medium">
                        Loading comments...
                      </p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                      <p className="text-red-600 font-bold text-lg mb-2">
                        Connection Error
                      </p>
                      <p className="text-gray-600 text-center mb-6 max-w-md">
                        {error}
                      </p>
                      <button
                        onClick={fetchComments}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
                      >
                        Retry Loading
                      </button>
                    </div>
                  ) : filteredComments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                      {filteredComments.map((comment, index) => {
                        const isExpanded = expandedComment === index;
                        const isLongComment = comment.comment.comment.length > 200;

                        return (
                          <div
                            key={index}
                            className={`rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg ${getResultColor(comment.result)}`}
                          >
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <User className="w-4 h-4 text-gray-700" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">
                                      {comment.comment.commentedBy}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span
                                        className="flex items-center gap-1 text-xs text-gray-500 cursor-help"
                                        title={getFullDate(comment.comment.createdAt)}
                                      >
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(comment.comment.createdAt)}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getResultBadgeColor(comment.result)}`}
                                  >
                                    {getResultIcon(comment.result)}
                                    {comment.result || "No Status"}
                                  </span>
                                </div>
                              </div>

                              <div className="bg-white/80 rounded-lg p-3.5 border border-gray-100">
                                <p className={`text-gray-700 leading-relaxed whitespace-pre-wrap ${!isExpanded && isLongComment ? "max-h-24 overflow-hidden" : ""
                                  }`}>
                                  {comment.comment.comment}
                                </p>
                                {isLongComment && (
                                  <button
                                    onClick={() => setExpandedComment(isExpanded ? null : index)}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    {isExpanded ? (
                                      <>
                                        <ChevronUp className="w-4 h-4" />
                                        Show less
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4" />
                                        Read more
                                      </>
                                    )}
                                  </button>
                                )}
                              </div>

                              {/* Comment actions */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleCopyComment(comment)}
                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700 transition-colors"
                                    title="Copy comment"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                </div>
                                <span className="text-xs text-gray-400">
                                  {comment.comment.comment.length} chars
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6">
                        <MessageSquare className="w-16 h-16 text-gray-300" />
                      </div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        No Comments Found
                      </p>
                      <p className="text-gray-600 text-center max-w-sm mb-6">
                        {searchQuery || statusFilter !== "all"
                          ? "No comments match your search criteria. Try adjusting your filters."
                          : "This subtask doesn't have any comments yet. Start the conversation!"}
                      </p>
                      {(searchQuery || statusFilter !== "all") && (
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setStatusFilter("all");
                          }}
                          className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Analytics Tab */
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">


                  {/* Stats Cards */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 p-4 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-700">Unique Authors</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">{commentStats.authors || 0}</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-blue-200">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-4 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-emerald-700">Avg Comment Length</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">{commentStats.avgCommentLength || 0}</p>
                          <p className="text-xs text-emerald-600 mt-1">characters per comment</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-emerald-200">
                          <FileText className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100/30 p-4 rounded-xl border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-700">Completion Rate</p>
                          <p className="text-3xl font-bold text-gray-900 mt-1">
                            {commentStats.total > 0 ? Math.round((commentStats.completed / commentStats.total) * 100) : 0}%
                          </p>
                          <p className="text-xs text-amber-600 mt-1">success rate</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border border-amber-200">
                          <TrendingUp className="w-5 h-5 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metrics Sidebar */}
          {showMetrics && (
            <div className="lg:w-1/3 border-l border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>

                <div className="space-y-4">
                  {/* Status Distribution */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Status Distribution</h4>
                    <div className="space-y-2">
                      {[
                        { label: 'Completed', value: commentStats.completed, color: 'bg-emerald-500', text: 'text-emerald-600' },
                        { label: 'In Progress', value: commentStats.pending, color: 'bg-amber-500', text: 'text-amber-600' },
                        { label: 'Failed', value: commentStats.failed, color: 'bg-rose-500', text: 'text-rose-600' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${item.text}`}>{item.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900">{item.value || 0}</span>
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} rounded-full`}
                                style={{
                                  width: `${commentStats.total > 0 ? (item.value / commentStats.total) * 100 : 0}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Latest Activity */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Latest Activity</h4>
                    <div className="space-y-3">
                      {filteredComments.slice(0, 3).map((comment, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <User className="w-3 h-3 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {comment.comment.commentedBy}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {truncateText(comment.comment.comment, 50)}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {formatDate(comment.comment.createdAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-4 flex-wrap">
                <span>
                  Subtask ID: <code className="px-2 py-1 bg-gray-200 rounded text-gray-800 font-mono text-xs">{subtaskId?.slice(0, 8)}</code>
                </span>
                {selectedRow?.dueDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Due: {format(new Date(selectedRow.dueDate), 'MMM dd, yyyy')}</span>
                  </span>
                )}
                <span className="text-gray-500">
                  Showing {filteredComments.length} of {comments.length} comments
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+F</kbd>
              <span>Search</span>
              <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl+M</kbd>
              <span>Metrics</span>
              <kbd className="px-2 py-1 bg-gray-200 rounded">Esc</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtaskCommentView;