import SearchIcon from "@mui/icons-material/Search";
import { Backdrop, InputAdornment, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaDownload, FaEdit, FaFile, FaTrash } from "react-icons/fa";
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
  const [activeDocument, setActiveDocument] = useState(null);
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
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const [permissions, setPermissions] = useState(() => {
    return JSON.parse(localStorage.getItem("permissions")) || [];
  });

  const [projectPermissions, setProjectPermissions] = useState(() => {
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

  const handleClickOutsideDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setActiveDropdownIndex(null);
    }
  };

  const handleClickOutsideModal = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  const handleDropdownClick = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownIndex(null);
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
      setLoading(false); // Ensure loading is set to false even on error
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [showModal]);

  useEffect(() => {
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    async function fetchPermissions() {
      localStorage.setItem("permissions", JSON.stringify(permissions));
    }
    async function fetchProjectPermissions() {
      localStorage.setItem(
        "project_permissions",
        JSON.stringify(projectPermissions)
      );
    }
    fetchUsers();
    fetchProjectPermissions();
    fetchPermissions();

    const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
      (role) => !role.project_related
    ).map((role) => role.name);

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
  }, [userInfo]);

  const handleDownload = (fileUrl, fileName) => {
    console.log("Downloading document:", fileName);

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Set up the request
    xhr.open("GET", `${BASE_URL}/documents/${fileName}`, true);
    xhr.responseType = "blob";

    // Handle the load event
    xhr.onload = function () {
      // Check if the request was successful
      if (this.status === 200) {
        // Create a new blob object from the response data
        const blob = new Blob([xhr.response], {
          type: "application/octet-stream",
        });

        // Create a temporary URL for the blob
        const url = window.URL.createObjectURL(blob);

        // Create a new link element
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);

        // Trigger a click event on the link to initiate the download
        link.click();

        // Cleanup: remove the temporary URL and link element
        window.URL.revokeObjectURL(url);

        // Show success message
        // Swal.fire({
        //   icon: "success",
        //   title: "Downloaded successfully!",
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
      } else {
        // Show error message if the request was not successful
        Swal.fire({
          icon: "error",
          title: "Download failed!",
          text: "An error occurred while trying to download the document.",
        });
      }
    };

    // Handle the error event
    xhr.onerror = function () {
      // Show error message if an error occurred during the request
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
    const fileType = getFileType(document.document);

    // Open the document in the default application
    const fileUrl = `${BASE_URL}/documents/${document.document}`;
    window.open(fileUrl, "_blank");
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.document.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-auto w-4/5 mr-5 mt-24 ">
      <Helmet>
        <title>{props.setSelectedProjectInfo.name} - Documents</title>
      </Helmet>
      <div className="flex gap-3 mt-10">
        <div className="flex flex-col justify-center text-3xl font-semibold text-white whitespace-nowrap">
          <div
            className="justify-center items-center px-3.5 w-11 h-11 rounded"
            style={{ backgroundColor: "#082f49" }}
          >
            {props.setSelectedProjectInfo.name.charAt(0)}
          </div>
        </div>
        <div className="flex-auto my-auto text-xl font-medium text-blue-950">
          {props.setSelectedProjectInfo.name}
        </div>
      </div>
      <div className="flex py-8 justify-between">
        <TextField
          type="text"
          placeholder="Search by Document Type"
          size="small"
          className="border-gray-300 rounded-lg mt-4 px-4 mr-7 py-2 pl-10"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <button
          className=" hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          style={{ backgroundColor: "#082f49" }}
          onClick={openModal}
        >
          + Add New Document
        </button>
      </div>

      <div className="flex flex-wrap gap-5 'ml-[207px] mt-3 mb-16">
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <PuffLoader color="#fff" />
        </Backdrop>
        {filteredDocuments.map((document, index) => (
          <div
            key={index}
            className="flex flex-col  w-64 rounded-xl border-2 border-gray-200 p-4"
          >
            <div className="flex justify-between items-center px-2 rounded-lg border-2 border-gray-200">
              <div className="flex gap-2 items-center">
                <div className="text-xs font-semibold text-black w-36 overflow-hidden text-ellipsis whitespace-nowrap">
                  {document.document}
                </div>
              </div>
              <div
                className="cursor-pointer bg-white w-12 h-12 flex flex-wrap justify-center items-center text-base  text-slate-900 rounded-sm z-50"
                onClick={() => handleDropdownClick(index)}
              >
                <span className=" font-extrabold">...</span>
                {activeDropdownIndex === index && (
                  <div
                    ref={dropdownRef}
                    className="mt-2 w-32 bg-white rounded-md shadow-md border border-gray-200"
                  >
                    {viewDocument !== 0 && (
                      <div
                        className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => handleViewDocument(document)}
                      >
                        <FaFile className="mr-2" />
                        View
                      </div>
                    )}
                    {editDocument !== 0 && (
                      <div
                        className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() => openEditModal(document)}
                      >
                        <FaEdit className="mr-2 text-blue-500" />
                        Edit
                      </div>
                    )}
                    {downloadDocument !== 0 && (
                      <div
                        className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center"
                        onClick={() =>
                          handleDownload(document.fileUrl, document.document)
                        }
                      >
                        <FaDownload className="mr-2" />
                        Download
                      </div>
                    )}
                    {deleteDocument !== 0 && (
                      <div className="py-2 px-3 hover:bg-gray-100 cursor-pointer flex items-center">
                        <FaTrash className="mr-2 text-red-500" />
                        Delete
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 text-xs font-semibold text-black">
              {document.Document_type.document_type}
            </div>
            <div className="mt-2 text-xs text-black">
              {document.description}
            </div>
          </div>
        ))}
      </div>
      {editDocumentModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white py-2 px-4 h-4/5 w-fit rounded-md overflow-y-scroll"
          >
            <div className="flex justify-end">
              <div
                className="cursor-pointer w-fit mt-3"
                onClick={closeEditModal}
              >
                X
              </div>
            </div>
            <DocsEdit
              closeModal={closeEditModal}
              selectedProject={props.setSelectedProjectInfo}
              documentToEdit={documentToEdit}
            />
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white py-2 px-4 h-4/5 w-fit rounded-md overflow-y-scroll"
          >
            <div className="flex justify-end">
              <div className="cursor-pointer w-fit mt-3" onClick={closeModal}>
                X
              </div>
            </div>
            <DocsAdd
              closeModal={closeModal}
              selectedProject={props.setSelectedProjectInfo}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Docs;
