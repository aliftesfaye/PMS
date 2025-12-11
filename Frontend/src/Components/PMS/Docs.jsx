import SearchIcon from "@mui/icons-material/Search";
import { Backdrop, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaDownload,
  FaEdit,
  FaFile,
  FaTrash,
  FaEllipsisV,
} from "react-icons/fa";
import PuffLoader from "react-spinners/ClipLoader";
import Swal from "sweetalert2";
import { BASE_URL, PERMISSIONS } from "../../config";
import pdffile from "../Assets/PDF file icon.png";
import wordfile from "../Assets/Word file icon.png";
import apiService from "../services/apiServices";
import DocsAdd from "./DocsAdd";
import DocsEdit from "./Docsedit";

const Docs = (props) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const dropdownStates = useRef({});
  const [documents, setDocuments] = useState([]);
  const modalRef = useRef(null);
  const dropdownRef = useRef(null);
  const [viewDocument, setViewDocument] = useState(0);
  const [editDocument, setEditDocument] = useState(0);
  const [downloadDocument, setDownloadDocument] = useState(0);
  const [deleteDocument, setDeleteDocument] = useState(0);
  const [editDocumentModal, setEditDocumentModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [userInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });
  const [projectPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("project_permissions")) || [];
  });

  const getIcon = (fileType) => {
    if (fileType === "word") {
      return wordfile;
    } else if (fileType === "pdf") {
      return pdffile;
    } else {
      return <FaFile />;
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleDropdownClick = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
        setEditDocumentModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiService.documentgetAll(
        props.setSelectedProjectInfo.project_id
      );

      const sortedResponse = response.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });

      setDocuments(sortedResponse);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Documents:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [showModal]);

  useEffect(() => {
    const nonProjectRelatedRoles =
      userInfo.foundUser?.Roles?.filter((role) => !role.project_related).map(
        (role) => role.name
      ) || [];

    const isDepartmentAdminRolePresent =
      nonProjectRelatedRoles.includes("Department Admin");
    const isClusterAdminRolePresent =
      nonProjectRelatedRoles.includes("Cluster Admin");
    const isOrganizationAdminRolePresent =
      nonProjectRelatedRoles.includes("Organization Admin");

    let selectedPermission;
    if (
      isClusterAdminRolePresent ||
      isDepartmentAdminRolePresent ||
      isOrganizationAdminRolePresent
    ) {
      selectedPermission = permissions;
    } else {
      selectedPermission = projectPermissions;
    }

    const VIEW_DOCUMENT = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.VIEW_DOCUMENT
    );
    const EDIT_DOCUMENT = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.EDIT_DOCUMENT
    );
    const DOWNLOAD_DOCUMENT = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.DOWNLOAD_DOCUMENT
    );
    const DELETE_DOCUMENT = selectedPermission.filter(
      (permission) => permission.name === PERMISSIONS.DELETE_DOCUMENT
    );

    setViewDocument(VIEW_DOCUMENT.length);
    setEditDocument(EDIT_DOCUMENT.length);
    setDownloadDocument(DOWNLOAD_DOCUMENT.length);
    setDeleteDocument(DELETE_DOCUMENT.length);
  }, [userInfo, permissions, projectPermissions]);

  const handleDownload = (fileUrl, fileName) => {
    console.log("Downloading document:", fileName);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${BASE_URL}/documents/${fileName}`, true);
    xhr.responseType = "blob";

    xhr.onload = function () {
      if (this.status === 200) {
        const blob = new Blob([xhr.response], {
          type: "application/octet-stream",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        Swal.fire({
          icon: "error",
          title: "Download failed!",
          text: "An error occurred while trying to download the document.",
        });
      }
    };

    xhr.onerror = function () {
      Swal.fire({
        icon: "error",
        title: "Download failed!",
        text: "An error occurred while trying to download the document.",
      });
    };

    xhr.send();
  };

  const openEditModal = (document) => {
    setDocumentToEdit(document);
    setEditDocumentModal(true);
  };

  const closeEditModal = () => {
    setEditDocumentModal(false);
    setDocumentToEdit(null);
    fetchDocuments();
  };

  const getFileType = (documentName) => {
    const extension = documentName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "pdf";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
      case "doc":
      case "docx":
        return "word";
      default:
        return "unsupported";
    }
  };

  const handleViewDocument = (document) => {
    console.log("Viewing document:", document);
    const fileUrl = `${BASE_URL}/documents/${document.document}`;
    window.open(fileUrl, "_blank");
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="docs-container ml-auto mr-5 mt-6 px-4 lg:px-6 xl:px-8 w-full ">
      <Helmet>
        <title>{props.setSelectedProjectInfo.name} - Documents</title>
      </Helmet>

      {/* Project Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mt-10 ">
        <div className="flex items-center gap-4">
          <div
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md"
            style={{ backgroundColor: "#082f49" }}
          >
            {getInitials(props.setSelectedProjectInfo.name)}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800">
              {props.setSelectedProjectInfo.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Project Documents</p>
          </div>
        </div>
      </div>

      {/* Search and Add Button Section */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 py-6 border-b border-gray-200">
        <TextField
          type="text"
          placeholder="Search documents..."
          size="small"
          className="flex-1 max-w-md"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="text-gray-400" />
              </InputAdornment>
            ),
            className: "bg-white rounded-lg shadow-sm",
          }}
        />
        <button
          className="hover:bg-blue-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
          style={{ backgroundColor: "#082f49" }}
          onClick={openModal}
        >
          + Add New Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="py-6">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <PuffLoader color="#fff" />
        </Backdrop>

        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-gray-400 text-6xl mb-4">
              <FaFile />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : "Add your first document to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:border-blue-200"
              >
                {/* Document Header with Actions */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                      {getIcon(document.document)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">
                        {document.document}
                      </h3>
                    </div>
                  </div>

                  {/* Actions Dropdown */}
                  <div className="relative">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                      onClick={() => handleDropdownClick(index)}
                    >
                      <FaEllipsisV />
                    </button>

                    {activeDropdownIndex === index && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50"
                      >
                        {viewDocument !== 0 && (
                          <button
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                            onClick={() => handleViewDocument(document)}
                          >
                            <FaFile className="text-gray-400" />
                            View Document
                          </button>
                        )}
                        {editDocument !== 0 && (
                          <button
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                            onClick={() => openEditModal(document)}
                          >
                            <FaEdit className="text-blue-500" />
                            Edit Details
                          </button>
                        )}
                        {downloadDocument !== 0 && (
                          <button
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3"
                            onClick={() =>
                              handleDownload(
                                document.fileUrl,
                                document.document
                              )
                            }
                          >
                            <FaDownload className="text-gray-400" />
                            Download
                          </button>
                        )}
                        {deleteDocument !== 0 && (
                          <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3">
                            <FaTrash className="text-red-500" />
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Details */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </span>
                    <p className="text-sm font-semibold text-gray-800 mt-1">
                      {document.Document_type?.document_type || "N/A"}
                    </p>
                  </div>

                  {document.description && (
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </span>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {document.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Document Modal */}
      {editDocumentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Document
              </h2>
              <button
                onClick={closeEditModal}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <DocsEdit
                closeModal={closeEditModal}
                selectedProject={props.setSelectedProjectInfo}
                documentToEdit={documentToEdit}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Document
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <DocsAdd
                closeModal={closeModal}
                selectedProject={props.setSelectedProjectInfo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;
