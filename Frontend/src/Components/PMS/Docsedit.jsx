import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const DocsEdit = ({ closeModal, selectedProject, documentToEdit }) => {
  const [doctype, setDoctype] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDocType, setNewDocType] = useState("");
  const initialState = {
    doctype: documentToEdit.document_type_id,
    description: documentToEdit.description,
    file: null
  };
  
  useEffect(() => {
    setDoctype(documentToEdit.document_type_id);
    setDescription(documentToEdit.description);
  }, [documentToEdit]);

  const handleDoctypeChange = (selectedOption) => {
    setDoctype(selectedOption.value);
  };

  const handleAddDocType = () => {
    setShowModal(true);
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
    formData.append("document_type_id", doctype);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const token = userInfo?.access_token;

      if (!token) {
        throw new Error("No token found");
      }

      const response = await apiService.updateDocument(
        selectedProject.project_id,
        documentToEdit.document_id,
        formData,
        token
      );

      if (response.status === 200) {
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
          title: "Document has been updated",
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
        title: "Document update Failed",
        text: error.response?.data?.message || "An error occurred",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
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
  useEffect(() => {
    setDoctype(initialState.doctype);
    setDescription(initialState.description);
  }, [documentToEdit]);
  const handleReset = () => {
    setDoctype(initialState.doctype);
    setDescription(initialState.description);
    setFile(initialState.file);
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
      console.error("Error fetching document types:", error);
    }
  }

  useEffect(() => {
    fetchDocTypes();
  }, []);

  const handleNewDocTypeChange = (event) => {
    setNewDocType(event.target.value);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewDocType("");
  };

  const handleConfirmAddDocType = async () => {
    const newOption = { value: newDocType, label: newDocType };
    setDocTypeOptions((prevOptions) => [...prevOptions, newOption]);
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
      console.log(error.response?.data?.message || "An error occurred");
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Document type registration Failed",
        text: error.response?.data?.message || "An error occurred",
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
  };

  return (
    <div className="w-fit">
      <div className="text-2xl font-bold text-blue-950">
        Edit Document in {selectedProject.name} project
      </div>
      <div className="flex flex-wrap w-fit px-5 py-10 gap-16">
        <div className="flex flex-col">
          <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
            <div className="flex justify-between">
              <div>Document Type</div>
            </div>
            <div className="flex justify-end">
              <div
                className="cursor-pointer bg-gray-200 px-2 mb-2 font-bold text-lg rounded-full text-black"
                onClick={handleAddDocType}
              >
                +
              </div>
            </div>
            <div className="flex">
              <Select
                name="documentType"
                value={docTypeOptions.find((option) => option.value === doctype) || null}
                onChange={handleDoctypeChange}
                options={docTypeOptions}
                styles={customStyles}
                className="w-80"
              />
            </div>
            <div className="mt-8">
              <label className="block mb-2 text-base text-slate-950">Document</label>
              <div className="flex items-center">
                <label className="px-4 py-2 mt-3.5 text-sm w-80 h-14 rounded-lg bg-zinc-100 max-md:pr-5 border-gray-300 flex items-center justify-between">
                  <span className=" w-36 overflow-hidden text-ellipsis whitespace-nowrap">{file ? file.name : documentToEdit.document}</span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                  <span className="cursor-pointer text-blue-500 underline ml-2">Choose File</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col grow py-1 text-base text-slate-950">
            <label htmlFor="description" className="block mb-4">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="7"
              cols="40"
              className="border-gray-300 rounded p-2 resize-none w-fit"
              style={{ backgroundColor: "#f3f3f4" }}
              placeholder="Write a short description about the document"
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
          <div className="flex  my-4 justify-end">
            <button className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
 onClick={handleReset}>
              Reset
            </button>
            <button className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg" onClick={handleSaveChanges}>
              Save Changes
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
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2" onClick={handleModalClose}>
                Close
              </button>
              <button className="bg-blue-900 text-white px-4 py-2 rounded" onClick={handleConfirmAddDocType}>
                Add Document Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocsEdit;
