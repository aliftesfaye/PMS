import React, { useState } from "react";
import {
  CalendarDays,
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  BarChart3,
  Target,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

const ActivitiesDetail = ({
  selectedRow,
  handleCloseModal,
  selectedRowAllData,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        icon: (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
        ),
        label: "Active",
      },
      Completed: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
        label: "Completed",
      },
      Pending: {
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />,
        label: "Pending",
      },
      cancelled: {
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        icon: <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />,
        label: "Cancelled",
      },
    };
    return configs[status?.toLowerCase()] || configs.Pending;
  };

  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "EEEE, MMMM dd, yyyy");
      }
      return "Invalid date";
    } catch {
      return "Invalid date";
    }
  };

  const calculateProgress = () => {
    const tasks = selectedRowAllData.tasks || [];
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(
      (task) => task.task_status === "Completed"
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const statusConfig = getStatusConfig(selectedRow.activity_status);
  const progress = calculateProgress();

  // Function to format description with proper paragraph spacing
  const formatDescription = (text) => {
    if (!text || text.trim() === "") {
      return (
        <div className="text-slate-500 italic text-sm sm:text-base">
          No detailed description available.
        </div>
      );
    }

    // Split by multiple newlines to preserve paragraphs
    const paragraphs = text.split(/\n\s*\n+/);

    return paragraphs.map((paragraph, index) => {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) return null;

      // Split by single newlines for line breaks within paragraphs
      const lines = trimmedParagraph.split("\n");

      return (
        <div key={index} className="mb-3 sm:mb-4 last:mb-0">
          {lines.map((line, lineIndex) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            return (
              <p
                key={lineIndex}
                className="text-slate-700 leading-relaxed mb-2 last:mb-0 text-sm sm:text-base"
              >
                {trimmedLine}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="animate-fade-in max-h-[90vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
      {/* Header - Fixed */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-500 to-slate-800 rounded-t-3xl flex-shrink-0">
        <div className="absolute inset-0 bg-grid-slate-700/30" />
        <div className="relative px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
          <div className="flex items-start justify-between">
            <div className="max-w-3xl pr-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight break-words">
                {selectedRow.name || "Activity Details"}
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-4 sm:mb-6 line-clamp-2">
                {selectedRow.description
                  ? selectedRow.description.substring(0, 120) +
                    (selectedRow.description.length > 120 ? "..." : "")
                  : "Comprehensive overview and analytics"}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border w-fit`}
                >
                  {statusConfig.icon}
                  <span
                    className={`font-semibold text-sm sm:text-base ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm sm:text-base">
                  <CalendarDays className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate">
                    Created on{" "}
                    {formatDate(
                      selectedRow.created_at || new Date().toISOString()
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar - Fixed */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-6 relative z-10 flex-shrink-0">
        {[
          {
            label: "Total Tasks",
            value: selectedRowAllData.tasks?.length || 0,
            icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "bg-blue-500",
          },
          {
            label: "Team Members",
            value: selectedRow.members?.length || 0,
            icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "bg-emerald-500",
          },
          {
            label: "Progress",
            value: `${progress}%`,
            icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "bg-purple-500",
          },
          {
            label: "Priority",
            value: selectedRowAllData.priority || "Medium",
            icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
            color: "bg-amber-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2 sm:mb-4">
              <div
                className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.color} bg-opacity-10`}
              >
                <div className={stat.color.replace("bg-", "text-")}>
                  {stat.icon}
                </div>
              </div>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wider break-words">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-6 sm:space-y-8">
            {/* Timeline Section - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-blue-50 rounded-lg sm:rounded-xl">
                    <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider truncate">
                      Start Date
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-slate-900 ">
                      {formatDate(selectedRow.start_date)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:border-blue-300 transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg sm:rounded-xl">
                    <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider truncate">
                      End Date
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-bold text-slate-900 ">
                      {formatDate(selectedRow.end_date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section - Scrollable if content is too long */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-slate-50 rounded-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Activity Description
                </h3>
              </div>
              <div className="whitespace-pre-line max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {formatDescription(selectedRow.description)}
              </div>
            </div>

            {/* Team Members Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Team Members
                  </h3>
                </div>
                <span className="text-sm font-medium text-slate-500">
                  {selectedRow.members?.length || 0} members
                </span>
              </div>

              {selectedRow.members?.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex -space-x-2 sm:-space-x-3">
                    {selectedRow.members.slice(0, 6).map((member, index) => (
                      <div
                        key={index}
                        className="relative group"
                        title={member.UserInfo?.full_name || "Unknown"}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-sm md:text-base ring-2 sm:ring-4 ring-white">
                          {member.UserInfo?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="absolute bottom-full mb-1 sm:mb-2 hidden group-hover:block bg-slate-900 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap z-10">
                          {member.UserInfo?.full_name || "Unknown"}
                        </div>
                      </div>
                    ))}
                    {selectedRow.members.length > 6 && (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-xs sm:text-sm md:text-base ring-2 sm:ring-4 ring-white">
                        +{selectedRow.members.length - 6}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedRow.members.slice(0, 8).map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm sm:text-base">
                          {member.UserInfo?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-900 text-sm sm:text-base truncate">
                            {member.UserInfo?.full_name || "Unknown Member"}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-500 truncate">
                            {member.UserInfo?.role || "Team Member"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 mx-auto mb-2 sm:mb-3" />
                  <p className="text-slate-500 font-medium text-sm sm:text-base">
                    No team members assigned
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Tasks Section */}
          <div className="space-y-6 sm:space-y-8">
            {/* Progress Section */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Progress Overview
                  </h3>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-slate-900">
                  {progress}%
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm font-medium text-slate-600">
                  <span>Completion Rate</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 sm:h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {selectedRowAllData.tasks?.filter(
                    (t) => t.task_status === "Completed"
                  ).length || 0}{" "}
                  of {selectedRowAllData.tasks?.length || 0} tasks Completed
                </div>
              </div>
            </div>

            {/* Tasks List - Scrollable */}
            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
              <div className="px-4 sm:px-6 py-3 sm:py-5 bg-slate-50 border-b border-slate-200 flex-shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                      Associated Tasks
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    {selectedRowAllData.tasks?.length || 0} tasks
                  </span>
                </div>
              </div>

              {selectedRowAllData.tasks?.length > 0 ? (
                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto custom-scrollbar max-h-[300px]">
                  {selectedRowAllData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className="p-4 sm:p-6 hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div
                          className={`p-1.5 sm:p-2 rounded-lg ${
                            task.task_status === "Completed"
                              ? "bg-emerald-50"
                              : "bg-amber-50"
                          } flex-shrink-0`}
                        >
                          {task.task_status === "Completed" ? (
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                          ) : (
                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                            <h4 className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors duration-200 truncate">
                              {task.name}
                            </h4>
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${
                                task.task_status === "Completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {task.task_status || "Pending"}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-slate-500">
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  Due {formatDate(task.due_date)}
                                </span>
                              </div>
                            )}
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">
                                  {task.assignee}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 flex-1 flex flex-col justify-center">
                  <Target className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-slate-500 font-medium text-sm sm:text-base mb-1 sm:mb-2">
                    No tasks associated
                  </p>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Add tasks to track progress
                  </p>
                </div>
              )}
            </div>

            {/* Additional Info */}
            {selectedRowAllData.notes && (
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    Additional Notes
                  </h3>
                </div>
                <div className="max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="p-3 sm:p-4 bg-slate-50 rounded-lg sm:rounded-xl">
                    <p className="text-slate-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                      {selectedRowAllData.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-200 flex-shrink-0">
          <button
            onClick={handleCloseModal}
            className="px-4 sm:px-6 py-2 sm:py-3 text-slate-700 font-medium hover:bg-slate-100 rounded-lg sm:rounded-xl transition-colors duration-200 w-full sm:w-auto text-sm sm:text-base"
          >
            Close Details
          </button>
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg sm:rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .bg-grid-slate-700\/30 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.3)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default ActivitiesDetail;
