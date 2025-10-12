import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const DocsAdd = ({ closeModal, selectedProject }) => {
  const [project, setProject] = useState("");
  const [doctype, setDoctype] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDocType, setNewDocType] = useState("");
  const [document_type, setDocument_type] = useState(null);

  const [options, setOptions] = useState([
    { value: "doctype1", label: "doctype 1" },
    { value: "doctype2", label: "doctype 2" },
    { value: "doctype3", label: "doctype 3" },
  ]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);

  const handleProjectChange = (event) => {
    setProject(event.target.value);
  };

  const handleDoctypeChange = (selectedOption) => {
    setDoctype(selectedOption.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append("document_type_id", document_type);
    formData.append("files", file);
    formData.append("description", description);

    try {
      const response = await apiService.addDocument(
        formData,
        selectedProject.project_id
      );

      if (response.status === 201) {
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
          title: "Document has been created",
        }).then(() => {
          fetchDocTypes();
          closeModal();
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Document registration Failed",
        text: error.response.data.message,
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  const resetFormData = () => {
    setProject("");
    setDoctype("");
    setDescription("");
    setFile(null);
    setDocument_type(""); 
    setShowModal(false);
    setNewDocType(""); 
    document.getElementById("fileInput").value = ""; // Clear the file input

    console.log("Form data reset. Document type:", document_type); // Debug log
  };

  const handleCancel = () => {
    resetFormData();
    console.log("Cancel button clicked. Document type should be reset."); // Debug log
  };

  const handleAddDocType = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewDocType("");
  };

  const handleNewDocTypeChange = (event) => {
    setNewDocType(event.target.value);
  };

  const handleConfirmAddDocType = async () => {
    const newOption = { value: newDocType, label: newDocType };
    setOptions((prevOptions) => [...prevOptions, newOption]);
    setDoctype(newDocType);

    try {
      const response = await apiService.addDocumentType({
        document_type: newDocType,
      });

      if (response.status === 201) {
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
          title: "Document type has been created",
        }).then(() => {
          fetchDocTypes();
          handleModalClose();
        });
      }
    } catch (error) {
      console.log(error.response.data.message);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Document type registration Failed",
        text: error.response.data.message,
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  const handleDocTypeChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    setDocument_type(selectedValue);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
    menu: (provided, state) => ({
      ...provided,
      overflowY: "100px",
    }),
  };

  async function fetchDocTypes() {
    try {
      const docTypes = await apiService.documentTypegetAll();
      const sortedResponse = docTypes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
      const docTypeOptions = sortedResponse.map((docType) => ({
        value: docType.document_type_id,
        label: docType.document_type,
      }));

      setDocTypeOptions(docTypeOptions);
    } catch (error) {
      console.error("Error fetching users and document types:", error);
    }
  }

  useEffect(() => {
    fetchDocTypes();
  }, []);

  return (
    <div className="w-fit">
      <div className="text-2xl font-bold  text-blue-950 ">
        Add Documents to {selectedProject.name} project
      </div>
      <div className="flex flex-wrap w-fit px-5 py-10 gap-16">
        <div className="flex flex-col ">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className=" flex justify-between ">
              <div>Document Type</div>
              <div className="flex justify-end">
                <div
                  className="cursor-pointer  bg-gray-200 px-2 mb-2 font-bold text-lg rounded-full text-black "
                  onClick={handleAddDocType}
                >
                  +
                </div>
              </div>
            </div>
            <div className="flex">
              <Select
                name="documentType"
                value={docTypeOptions.find(option => option.value === document_type) || null}
                onChange={handleDocTypeChange}
                options={docTypeOptions}
                styles={customStyles}
                className="w-80"
                isClearable={true} 
              />
            </div>
            <div className="mt-8">Project Related Documents</div>
            <input
              type="file"
              id="fileInput" 
              placeholder="Choose File"
              onChange={handleFileChange}
              className="px-4 py-2 mt-3.5 text-sm w-80 h-14 rounded-lg bg-zinc-100 max-md:pr-5 border-gray-300"
            />
          </div>
        </div>
        <div className="flex flex-col  ">
          <div className="flex flex-col grow py-1 text-base text-slate-950">
            <label
              htmlFor="description"
              className="block  mb-4"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="7"
              cols="40"
              className="border-gray-300 rounded p-2 resize-none w-fit"
              style={{ backgroundColor: "#f3f3f4" }}
              placeholder="Write a short description about the document that you are going to create"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="flex my-4 justify-end ">
        <button
          className="flex justify-center items-center p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
          onClick={handleCancel}
        >
Reset        </button>
        <button
          className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg"
          onClick={handleSaveChanges}
        >
          Add Document
        </button>
      </div>
        </div>
      </div>
      
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <div className="text-xl font-bold mb-4">Add New Document Type</div>
            <input
              type="text"
              placeholder="Enter new document type"
              value={newDocType}
              onChange={handleNewDocTypeChange}
              className="border-gray-300 w-80 rounded px-4 py-2 mb-4"
            />
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={handleModalClose}
              >
                Close
              </button>
              <button
                className="bg-blue-900 text-white px-4 py-2 rounded"
                onClick={handleConfirmAddDocType}
              >
                Add Document Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DocsAdd;
