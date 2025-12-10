import React from "react";
import Swal from "sweetalert2";
import { X, AlertTriangle, Trash2, Undo } from "lucide-react";
import apiService from "../services/apiServices";

const Userdelete = ({
  selectedRow,
  handleDeleteModalClose,
  handlefetchUsers,
}) => {
  const handleMoveToTrash = async () => {
    try {
      console.log(selectedRow);
      const response = await apiService.deleteUser(selectedRow.user_id);

      if (
        response &&
        response.message ===
          "user deleted successfully to recover go to trash page"
      ) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });

        Toast.fire({
          icon: "success",
          title: "user deleted successfully to recover go to trash page",
        }).then(() => {
          handleDeleteModalClose();
          handlefetchUsers();
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to delete user",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Delete User
              </h3>
            </div>
            <button
              onClick={handleDeleteModalClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* User Information */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {selectedRow?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {selectedRow?.full_name || "User Name"}
                </h4>
                <p className="text-sm text-gray-500">
                  {selectedRow?.email || "user@example.com"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500">Role:</span>
                <p className="font-medium text-gray-700">
                  {selectedRow?.Roles?.[0]?.name || "Not specified"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">
                Are you sure you want to delete this user?
              </p>
              <p className="text-sm text-gray-600">
                This action will move the user to trash. You can recover them
                from the trash page within 30 days.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-amber-700">
                <Undo className="w-4 h-4" />
                <span>Recoverable from trash page</span>
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="mb-8">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              This action will:
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                <span>Remove user access immediately</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                <span>Preserve user data for recovery</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleDeleteModalClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleMoveToTrash}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userdelete;
