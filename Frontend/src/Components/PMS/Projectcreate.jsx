import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import apiService from "../services/apiServices";

const Projectcreate = ({ handleCloseModal, handlefetchProjects }) => {
  const [title, SetTitle] = useState("");
  const [projectManager, setProjectManager] = useState([]);
  const [technicalManager, setTechnicalManager] = useState([]);
  const [members, setMembers] = useState([]);
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState(null);
  const [document_type, setDocument_type] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [description, setDescription] = useState("");
  const [projectManagerOptions, setProjectManagerOptions] = useState([]);
  const [technicalManagerOptions, setTechnicalManagerOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [includeDepartment, setIncludeDepartment] = useState(false);
  const [isDepartmentAdmin, setIsDepartmentAdmin] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  });
  const [minEndDate, setMinEndDate] = useState("");

  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
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

  const fetchDivisions = async () => {
    try {
      const divisionsData = await apiService.getDivisions(
        userInfo.access_token
      );
      setDivisions(divisionsData);
    } catch (error) {
      console.error("Error fetching divisions:", error.message);
    }
  };

  useEffect(() => {
    async function fetchUsersAndDocTypes() {
      try {
        const users = await apiService.getAllUsers(userInfo.access_token);

        // Map and sort users alphabetically by full_name
        const options = users
          .map((user) => ({
            value: user.user_id,
            label: user.full_name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

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
    fetchDivisions();
    const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
      (role) => !role.project_related
    ).map((role) => role.name);

    const isDepartmentAdminRolePresent =
      nonProjectRelatedRoles.includes("Department Admin");

    const userDivisionId = userInfo.foundUser.division_id;
    if (isDepartmentAdminRolePresent && userDivisionId) {
      setSelectedDepartment({ value: userDivisionId });
      setIsDepartmentAdmin(true);
    } else if (isDepartmentAdminRolePresent) {
      setIsDepartmentAdmin(true);
    }

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [userInfo, handleCloseModal]);

  const availableProjectManagerOptions = useMemo(
    () =>
      projectManagerOptions.filter(
        (option) => ![...technicalManager, ...members].includes(option.value)
      ),
    [projectManagerOptions, technicalManager, members]
  );

  const handleChange = (e) => {
    const { value } = e.target;

    const newValue = value.replace(/(?!^)-/g, "");

    setBudget(newValue);
  };
  const availableTechnicalManagerOptions = useMemo(
    () =>
      technicalManagerOptions.filter(
        (option) => ![...projectManager].includes(option.value)
      ),
    [technicalManagerOptions, projectManager]
  );

  const availableMemberOptions = useMemo(
    () =>
      memberOptions.filter(
        (option) => ![...projectManager].includes(option.value)
      ),
    [memberOptions, projectManager]
  );

  const handleProjectManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setProjectManager(selectedValues);
  };

  const handleTechnicalManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setTechnicalManager(selectedValues);
  };

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setMembers(selectedValues);
  };

  const handleDocTypeChange = (selectedOption) => {
    const selectedValue = selectedOption ? selectedOption.value : null;
    setDocument_type(selectedValue);
  };

  const handleCheckboxChange = (e) => {
    setIncludeDepartment(e.target.checked);
    if (!e.target.checked) {
      setSelectedDepartment({
        value: "",
        label: "",
      });
    }
  };

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (new Date(endDate) < new Date(newStartDate)) {
      setEndDate("");
      alert(
        "End date cannot be before the start date. Please select a valid end date."
      );
    }

    if (new Date(endDate) < new Date(newStartDate)) {
      setEndDate("");
    }

    setMinEndDate(newStartDate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", title);
    formData.append("project_managers", projectManager);
    formData.append("technical_managers", technicalManager);
    formData.append("members", members);
    formData.append("budget", budget);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("documents", file);
    formData.append("document_type_id", document_type);
    formData.append("division_id", selectedDepartment.value);
    const userDivisionId = userInfo.foundUser.division_id;

    if (isDepartmentAdmin && !userDivisionId) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to create project",
        text: "This user is not assigned to any department",
        showConfirmButton: false,
        timer: 2500,
      });
    } else {
      try {
        const response = await apiService.projectadd(formData);
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
          handleCloseModal();
          handlefetchProjects();
          resetFormData();
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
    }
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

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex flex-col pr-9 pl-20 bg-white rounded-2xl max-w-[925px] max-md:px-5">
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
                      label: availableProjectManagerOptions.find(
                        (option) => option.value === manager
                      )?.label,
                    }))}
                    onChange={handleProjectManagerChange}
                    options={availableProjectManagerOptions}
                    isMulti
                    className="border-gray-300 rounded p-2 resize-none w-80 mt-2"
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
                      label: availableTechnicalManagerOptions.find(
                        (option) => option.value === manager
                      )?.label,
                    }))}
                    onChange={handleTechnicalManagerChange}
                    options={availableTechnicalManagerOptions}
                    isMulti
                    className="border-gray-300 rounded p-2 resize-none w-80 mt-2"
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
                      label: availableMemberOptions.find(
                        (option) => option.value === member
                      )?.label,
                    }))}
                    onChange={handleMemberChange}
                    options={availableMemberOptions}
                    isMulti
                    className="border-gray-300 rounded p-2 resize-none w-80 mt-2"
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                  <div className=" mt-8"> Budget </div>
                  <input
                    type="number"
                    name="budget"
                    placeholder="Enter amount in numbers"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="justify-center items-start px-4 mr-4 py-5 w-80 h-14 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />

                  {!isDepartmentAdmin && (
                    <div className="mt-2 -ml-4 bg-white rounded-md p-4">
                      <label
                        htmlFor="includeDepartment"
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id="includeDepartment"
                          checked={includeDepartment}
                          onChange={handleCheckboxChange}
                          className="form-checkbox h-5 w-5 text-blue-500"
                        />
                        <span className="text-gray-700">
                          Include Department
                        </span>
                      </label>
                    </div>
                  )}

                  {includeDepartment && (
                    <div className="mt-2">
                      <label htmlFor="department">Select Department</label>
                      <Select
                        id="divisions"
                        className="w-80 p-2"
                        name="division"
                        styles={customStyles}
                        value={{
                          value: selectedDepartment.value,
                          label:
                            divisions.find(
                              (division) =>
                                division.division.division_id ===
                                selectedDepartment.value
                            )?.division.name || "",
                        }}
                        onChange={handleDepartmentChange}
                        options={divisions.map((division) => ({
                          value: division.division.division_id,
                          label: division.division.name,
                        }))}
                        placeholder="Select Department"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
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
                    className="justify-center items-start px-4 py-2 mt-3.5 h-14 w-80 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-8">
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
                    onChange={(e) => setEndDate(e.target.value)}
                    min={minEndDate}
                    className="justify-center items-start px-4 py-2 mt-3.5  h-14 w-80 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-11">
                    Document Type <span className="required"></span>
                  </div>
                  <Select
                    name="documentType"
                    value={
                      docTypeOptions.find(
                        (option) => option.value === document_type
                      ) || null
                    }
                    onChange={handleDocTypeChange}
                    options={docTypeOptions}
                    className="border-gray-300 rounded p-2 resize-none w-80 mt-2 "
                    styles={customStyles}
                  />

                  <div className="mt-8">Project Related Documents</div>
                  <div className="relative mt-3.5">
                    <input
                      type="file"
                      id="fileInput"
                      name="documents"
                      onChange={handleFileChange}
                      placeholder="Enter Related Documents"
                      className="hidden"
                    />
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer flex justify-center items-center px-4 py-2 w-80 h-14 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-colors"
                    >
                      Choose File
                    </label>
                    {file && (
                      <div className="mt-2 text-sm text-gray-700">
                        Selected file: {file.name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
                    <label htmlFor="description" className="mb-2 mt-8">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="9"
                      cols="40"
                      className="border-gray-300 rounded p-2 resize-none w-80"
                      style={{ backgroundColor: "#f3f3f4" }}
                      placeholder="Write a short description about the project that you are going to create"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="flex flex-col"></div>
            </div>
          </div>
          <div className="flex mr-5 mt-2 my-10 justify-between self-end text-base">
            <button
              type="button"
              className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
              onClick={() => {
                resetFormData();
              }}
            >
              Reset
            </button>
            <button
              className="justify-center p-2.5 font-bold text-white rounded-lg cursor-pointer"
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

export default Projectcreate;
