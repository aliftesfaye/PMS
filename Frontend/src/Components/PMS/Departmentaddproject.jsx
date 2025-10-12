import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import apiService from "../services/apiServices";

const Departmentaddproject = ({
  handleAddProjecttodepartmentModalClose,
  selectedDepartmentId,
}) => {
  const [title, SetTitle] = useState(""); 
   const [budget, setBudget] = useState("");
  const [projectManager, setProjectManager] = useState([]);
  const [minEndDate, setMinEndDate] = useState("");

  const [technicalManager, setTechnicalManager] = useState([]);

  const [members, setMembers] = useState([]);
  const [description, setDescription] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");
  const [includeDepartment, setIncludeDepartment] = useState(false);

  const [file, setFile] = useState("");
  const [document_type, setDocument_type] = useState(null);
  const [divisions, setDivisions] = useState([]);

  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });

  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  });

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      marginTop: "-15px",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
  };
  const formatNumber = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/,/g, ''); 
    if (!isNaN(value)) {
      setBudget(formatNumber(value)); 
    }
  };

  useEffect(() => {
    async function fetchUsersAndDocTypes() {
      try {
        const users = await apiService.getAllUsers(userInfo.access_token);
        const options = users.map((user) => ({
          value: user.user_id,
          label: user.full_name,
        }));
        setProjectManagerOptions(options);
        setTechnicalManagerOptions(options);
        setMemberOptions(options);

        const docTypes = await apiService.documentTypegetAll();
        const docTypeOptions = docTypes.map((docType) => ({
          value: docType.document_type_id,
          label: docType.document_type,
        }));
        setDocTypeOptions(docTypeOptions);
      } catch (error) {
        console.error("Error fetching users and document types:", error);
      }
    }
    fetchUsersAndDocTypes();
    async function fetchUsers() {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    fetchUsers();
  }, [userInfo]);

  const [projectManagerOptions, setProjectManagerOptions] = useState([]);
  const [technicalManagerOptions, setTechnicalManagerOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  // const [selectedFile,setSelectedFile]=useState(null)
  const handleProjectManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setProjectManager(selectedValues);
  };
  const resetFormData = () => {
    SetTitle("");
    setBudget("");
    setProjectManager([]);
    setTechnicalManager([]);
    setMembers([]);
    setStartDate("");
    setEndDate("");
    setFile(null);
    setDocument_type(null);
    setSelectedDepartment({
      value: "",
      label: "",
    });
    setIncludeDepartment(false);
    setDescription("");
    setMinEndDate("");
    document.getElementById("fileInput").value = null;
  };
  
  

  
  const handleTechnicalManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setTechnicalManager(selectedValues);
  };
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (new Date(endDate) < new Date(newStartDate)) {
      setEndDate("");
      alert("End date cannot be before the start date. Please select a valid end date.");
    }
  
    if (new Date(endDate) < new Date(newStartDate)) {
      setEndDate("");
    }
  
    setMinEndDate(newStartDate);
  };

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setMembers(selectedValues);
  };

  const handleDocTypeChange = (selectedOption) => {
    setDocument_type(selectedOption ? selectedOption.value : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", title);
    formData.append("budget", budget);
    formData.append("project_managers", projectManager);
    formData.append("technical_managers", technicalManager);
    formData.append("members", members);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("documents", file);
    formData.append("document_type_id", document_type);
    formData.append("division_id", selectedDepartmentId);

    // for (const key in formData) {
    //   formDataToSend.append(key, formData[key]);
    // }
    // console.log("inside submit")
    // formDataToSend.append("documents",selectedFile)

    // for (let i = 0; i < formData.documents.length; i++) {
    //   formDataToSend.append('documents', formData.documents[i]);
    // }

    try {
      console.log("calling project");
      const response = await apiService.projectadd(formData);
      console.log(`Project on Department id: ${selectedDepartmentId}`);
      console.log("Project created:", response);

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
        title: "New project has been created",
      }).then(() => {
        handleAddProjecttodepartmentModalClose();
      });
    } catch (error) {
      console.error("Error creating project:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to create project",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
   
    // setFormData({
    //   title: '',
    //   projectManager: [],
    //   technicalManager: [],
    //   members: [],
    //   startDate: '',
    //   endDate: '',
    //   documents: '',
    // });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col pr-9 pl-20 bg-white rounded-2xl  max-w-[925px] max-md:px-5">
          <div className="self-start text-2xl font-bold text-blue-950">
            Create New Project
          </div>
          <div className="mt-6 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow py-1 text-base max-md:mt-10">
                  <div>
                    Title <span className="required"></span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter Project Title"
                    value={title}
                    onChange={(e) => SetTitle(e.target.value)}
                    className="justify-center items-start px-4 mr-4 py-5 w-80 h-14 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-8">
                    Project Manager <span className="required"></span>
                  </div>
                  <Select
                    name="projectManager"
                    value={projectManager.map((manager) => ({
                      value: manager,
                      label: projectManagerOptions.find(
                        (option) => option.value === manager
                      )?.label,
                    }))}
                    onChange={handleProjectManagerChange}
                    options={projectManagerOptions}
                    isMulti
                    className="mr-10 mt-3 w-80"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                  <div className="mt-8">
                    Technical Manager <span className="required"></span>
                  </div>
                  <Select
                    name="technicalManager"
                    value={technicalManager.map((manager) => ({
                      value: manager,
                      label: technicalManagerOptions.find(
                        (option) => option.value === manager
                      )?.label,
                    }))}
                    onChange={handleTechnicalManagerChange}
                    options={technicalManagerOptions}
                    isMulti
                    className="mr-10 mt-3 w-80"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                  <div className="mt-8">
                    Members <span className="required"></span>
                  </div>
                  <Select
                    name="members"
                    value={members.map((member) => ({
                      value: member,
                      label: memberOptions.find(
                        (option) => option.value === member
                      )?.label,
                    }))}
                    onChange={handleMemberChange}
                    options={memberOptions}
                    isMulti
                    className="mr-10 mt-3 w-80"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                    <div className="mt-8"> Budget <span className="required"></span></div>
                <input
                   type="text" 
                    name="budget"
                  placeholder="Enter amount in numbers"
                  value={budget}
                  onChange={handleBudgetChange}
                  className="justify-center  w-80 items-start px-4 mr-4 py-5  h-14 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                />
                
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow py-1  text-base text-slate-950 max-md:mt-10">
                  <div className="">
                    Project Start Date <span className="required"></span>
                  </div>
                  <label htmlFor="startDate" className="hidden">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="justify-center  h-14 items-start px-4 py-2 w-80  mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className=" mt-8">
                    Project End Date <span className="required"></span>
                  </div>
                  <label htmlFor="endDate" className="hidden">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={endDate}
                    min={minEndDate}  

                    onChange={(e) => setEndDate(e.target.value)}
                    className="justify-center h-14 w-80 items-start px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-8">
                    Document Type <span className="required"></span>
                  </div>
                  <Select
  name="documentType"
  value={docTypeOptions.find((option) => option.value === document_type) || null}
  onChange={handleDocTypeChange}
  options={docTypeOptions}
  className="mr-10 mt-3 w-80"
  styles={customStyles}
/>
                  <div className="mt-8 mb-4">Project Related Documents</div>
                  <input
                    type="file"
                    id="fileInput"
                    name="documents"
                    value={FormData.file}
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                    placeholder="Enter Related Documents"
                    // onChange={(e) => setFormData({ ...formData, documents: e.target.files })}
                    className="hidden w-80"
                    />
                     <label
                      htmlFor="fileInput"
                      className="cursor-pointer flex justify-center items-center px-4 py-2 w-80 h-14 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      Choose File
                    </label>
                    {file && (
                      <div className=" text-sm text-gray-700">
                        Selected file: {file.name}
                      </div>
                    )}
                  <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
                    <label htmlFor="description" className="  mb-6 mt-5">
                      Description
                    </label>
                    <textarea
  id="description"
  name="description"
  rows="9"
  cols="40"
  className="border-gray-300  rounded p-2 resize-none w-80"
  style={{ backgroundColor: "#f3f3f4" }}
  placeholder="Write a short description about the project that you are going to create"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
></textarea>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-2 mr-10 my-10 justify-between self-end text-base">
          <div
  className="flex justify-center items-center cursor-pointer p-2 rounded-lg text-lg w-40  text-[#d73d36] font-bold"
  onClick={resetFormData}
>
  Reset
</div>

            <button
              className=" p-2.5  font-bold text-white  rounded-lg cursor-pointer"
              onClick={handleSubmit}
              style={{ backgroundColor: "#082f49" }}
            >
              Create Project
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Departmentaddproject;
