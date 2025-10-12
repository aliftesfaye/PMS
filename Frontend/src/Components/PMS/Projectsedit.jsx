import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import apiService from "../services/apiServices";
const Projectsedit = ({
  selectedRow,
  handleCloseModal,
  handlefetchProjects,
}) => {
  console.log(selectedRow);
  const [title, SetTitle] = useState(selectedRow.name);
  const [budget, setBudget] = useState(selectedRow.budget);

  const [projectManager, setProjectManager] = useState(
    selectedRow.project_manager.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );
  const [technicalManager, setTechnicalManager] = useState(
    selectedRow.technical_manager.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: selectedRow.division?.division_id || "",
    label: selectedRow.division?.name || "Select Department",
  });
  const [divisions, setDivisions] = useState([]);

  const [members, setMembers] = useState(
    selectedRow.project_member.map((user) => ({
      value: user.user_id,
      label: user.UserRoleToUser.full_name,
    }))
  );
  const s_date = new Date(selectedRow.start_date);
  const formattedDate = s_date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const e_date = new Date(selectedRow.end_date);
  const formattedEndDate = e_date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
  const formattedDateString = moment(formattedDate, "MM/DD/YYYY").format(
    "YYYY-MM-DD"
  );

  const formattedDateEndString = moment(formattedEndDate, "MM/DD/YYYY").format(
    "YYYY-MM-DD"
  );
  const [startDate, setStartDate] = useState(formattedDateString);

  const [endDate, setEndDate] = useState(formattedDateEndString);

  const [selectedDocType, setSelectedDocType] = useState(null);
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [description, setDescription] = useState("");
  const [isDepartmentAdmin, setIsDepartmentAdmin] = useState(false);

  const [includeDepartment, setIncludeDepartment] = useState(
    !!selectedRow?.division
  );

  const [docTypeOptions, setDocTypeOptions] = useState([]);
  const [file, seFile] = useState("");
  const [document_type, setDocument_type] = useState([]);
  const [projectManagerOptions, setProjectManagerOptions] = useState([]);
  const [technicalManagerOptions, setTechnicalManagerOptions] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const auth = useAuth();
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo")) || [];
  });
  const resetFormData = () => {
    SetTitle(selectedRow.name);
    setBudget(selectedRow.budget);
    setProjectManager(
      selectedRow.project_manager.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    setTechnicalManager(
      selectedRow.technical_manager.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    setMembers(
      selectedRow.project_member.map((user) => ({
        value: user.user_id,
        label: user.UserRoleToUser.full_name,
      }))
    );
    const s_date = new Date(selectedRow.start_date);
    const formattedDate = s_date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const e_date = new Date(selectedRow.end_date);
    const formattedEndDate = e_date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    const formattedDateString = moment(formattedDate, "MM/DD/YYYY").format(
      "YYYY-MM-DD"
    );
    const formattedDateEndString = moment(
      formattedEndDate,
      "MM/DD/YYYY"
    ).format("YYYY-MM-DD");
    setStartDate(formattedDateString);
    setEndDate(formattedDateEndString);
    setDocument_type([]);
    setSelectedDocType(null);
    setProjectDocuments([]);
    setDescription("");
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
  useEffect(() => {
    fetchDivisions();
    const nonProjectRelatedRoles = userInfo.foundUser.Roles.filter(
      (role) => !role.project_related
    ).map((role) => role.name);

    const isDepartmentAdminRolePresent =
      nonProjectRelatedRoles.includes("Department Admin");

    if (isDepartmentAdminRolePresent) {
      setIsDepartmentAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (selectedRow && selectedRow.division) {
      setSelectedDepartment({
        value: selectedRow.division.division_id,
        label: selectedRow.division.name || "Select Department",
      });
    } else {
      setSelectedDepartment({
        value: "",
        label: "Select Department",
      });
    }
  }, [selectedRow]);
  fetchDivisions();

  const handleDepartmentChange = (selectedOption) => {
    setSelectedDepartment(selectedOption);
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
  }, [userInfo]);

  const handleProjectManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setProjectManager(selectedValues);
  };

  const handleTechnicalManagerChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setTechnicalManager(selectedValues);
  };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setProjectDocuments(Array.from(e.target.files));
    seFile(selectedFile);
  };
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;

    if (new Date(newEndDate) < new Date(startDate)) {
      alert(
        "End date cannot be before the start date. Please select a valid end date."
      );
      e.target.value = endDate;
    } else {
      setEndDate(newEndDate);
    }
  };
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIncludeDepartment(checked);
    if (!checked) {
      setSelectedDepartment({
        value: "",
        label: "",
      });
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;

    if (new Date(newStartDate) > new Date(endDate)) {
      setStartDate(newStartDate); // Update the start date to the new value
      setEndDate(""); // Clear the end date field
    } else {
      setStartDate(newStartDate);
    }
  };

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setMembers(selectedValues);
  };

  const handleDocTypeChange = (selectedOption) => {
    const selectedValue = selectedOption.value;
    setDocument_type(selectedValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newDataToSend = {
        title,
        budget,
        projectManager,
        technicalManager,
        members,
        startDate,
        endDate,
        document_type: selectedDocType,
        documents: projectDocuments,
        division_id: includeDepartment ? selectedDepartment.value : null,
      };
      const response = await apiService.updateProject(
        selectedRow,
        newDataToSend
      );
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
        title: "Project updated",
      }).then(() => {
        handleCloseModal();
        handlefetchProjects();
      });
    } catch (error) {
      console.error("Error creating project:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Failed to update project",
        text: error.response.data.message,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const handleIncludeDepartmentChange = (e) => {
    setIncludeDepartment(e.target.checked);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col pr-9 pl-20 bg-white rounded-2xl max-w-[925px] max-md:px-5">
          <div className="self-start text-2xl font-bold text-blue-950">
            Edit Project
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
                    className="justify-center items-start px-4 py-5 w-80 h-14 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  <div className="mt-8">
                    Project Manager <span className="required"></span>
                  </div>
                  <Select
                    name="projectManager"
                    value={projectManager.map((manager) => ({
                      value: manager.value,
                      label: projectManagerOptions.find(
                        (option) => option.value === manager.value
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
                      value: manager.value,
                      label: projectManagerOptions.find(
                        (option) => option.value == manager.value
                      )?.label,
                    }))}
                    onChange={handleTechnicalManagerChange}
                    options={technicalManagerOptions}
                    isMulti
                    className="mr-10 mt-3 w-80 "
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                  <div className="mt-8">
                    Members <span className="required"></span>
                  </div>
                  <Select
                    name="members"
                    value={members.map((member) => ({
                      value: member.value,
                      label: projectManagerOptions.find(
                        (option) => option.value === member.value
                      )?.label,
                    }))}
                    onChange={handleMemberChange}
                    options={memberOptions}
                    isMulti
                    className="mr-10 mt-3 w-80 "
                    closeMenuOnSelect={false}
                    styles={customStyles}
                  />
                  <div className="mt-8">Budget</div>
                  <input
                    type="text"
                    name="budget"
                    placeholder="Enter amount in numbers"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="justify-center mb-6 items-start px-4 py-5 w-80 h-14 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
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

                  {!isDepartmentAdmin && includeDepartment && (
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
                  <div>
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
                    className="justify-center w-80 h-14 items-start px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
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
                    onChange={handleEndDateChange}
                    className="justify-center w-80 h-14 items-start px-4 py-2 mt-3.5 text-sm rounded-lg bg-zinc-100 text-slate-950 max-md:pr-5"
                  />
                  {/* <div className="mt-8">
  Document Type <span className="required"></span>
</div>
<Select
  name="docType"
  value={docTypeOptions.find(option => option.value === selectedDocType)}
  onChange={(option) => setSelectedDocType(option?.value)}
  options={docTypeOptions}
  className=" mt-3 w-80"
  styles={customStyles}
/>

<div className="mt-8">
  Project Documents <span className="required"></span>
</div>
<div className="relative mt-3.5">
                    <input
                      type="file"
                      id="fileInput"
                      name="documents"
                      onChange={handleFileChange}                      placeholder="Enter Related Documents"
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
</div> */}
                  <div className="flex mb-7  mt-12 justify-between self-end text-base">
                    <button
                      type="button"
                      className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
                      onClick={() => {
                        resetFormData();
                      }}
                    >
                      Reset{" "}
                    </button>
                    <button
                      className="justify-center p-2.5  font-bold text-white  rounded-lg cursor-pointer"
                      onClick={handleSubmit}
                      style={{ backgroundColor: "#082f49" }}
                    >
                      Save Changes{" "}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Projectsedit;
