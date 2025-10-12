import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

const Activitiesedit = ({
  selectedRow,
  handleCloseModal,
  handlefetchActivity,
  selectedProject,
}) => {
  const dummyTitle = "Smart Court System";
  const dummyStartDate = "2024-02-23";
  const dummyEndDate = "2025-03-15";
  const dummyProjectManager = "Henok Mulatu";
  const dummyTechnicalManager = "Abebe Kebede";
  const dummyProjectMembers = ["Member 1", "Member 2", "Member 3"];
  const [title, setTitle] = useState(dummyTitle);
  const [memberOptions, setMemberOptions] = useState([]);
  const [members, setMembers] = useState(
    selectedRow.members.map((user) => ({
      value: user.project_member_id,
      label: user.UserInfo.full_name,
    }))
  );
  const [projectManager, setProjectManager] = useState(dummyProjectManager);
  const [technicalManager, setTechnicalManager] = useState(
    dummyTechnicalManager
  );
  const [description, setDescription] = useState("");

  const [selectedProjectMember, setSelectedProjectMember] = useState(null);
  const [formData, setFormData] = useState({
    project_id: selectedProject.project_id,
    name: selectedRow.name,
    activity_status: selectedRow.activity_status,
    start_date: selectedRow.start_date,
    end_date: selectedRow.end_date,
    projectmembers: [],
    is_milestone: selectedRow.is_milestone,
    description: selectedRow.description,
  });
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(selectedRow.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(selectedRow.end_date)
  );
  const [startDate, setStartDate] = useState(
    new Date(selectedProject.start_date)
  );
  const [endDate, setEndDate] = useState(new Date(selectedProject.end_date));

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option);
    setMembers(selectedValues);
  };

  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    formData.start_date = selectedStartDate;
    formData.end_date = selectedEndDate;
    const newMembers = members.map((item) => {
      return {
        ...item,
        project_member_id: item.value,
        UserInfo: { full_name: item.label },
      };
    });
    formData.projectmembers.push(...newMembers);
    try {
      const response = await apiService.updateActivity(
        formData,
        selectedRow.activity_id
      );
      console.log("Activity edit response:", response);

      // Check if the registration was successful based on the response
      if (response.status === 200) {
        // Assuming the response contains a "success" property
        // Clear the form data
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
          title: "Activity Updated Successfully",
        }).then(() => {
          handleCloseModal();
          handlefetchActivity();
        });
      } else {
        console.error(" failed");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Activity Update Failed",
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Registration failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Activity Update Failed",
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
      marginTop: "-5px",
    }),
    indicatorSeparator: (provided, state) => ({
      ...provided,
      display: "none",
    }),
  };
  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await apiService.getAllProjectMembers(
          selectedProject.project_id
        );
        const options = users
          .map((user) => ({
            value: user.project_member_id,
            label: user.UserInfo.full_name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setMemberOptions(options);
      } catch (error) {
        console.error("Error fetching users and document types:", error);
      }
    }

    fetchUsers();

    // Event listener for Esc key to close modal
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [handleCloseModal]);

  const resetFormData = () => {
    setFormData({
      project_id: selectedProject.project_id,
      name: selectedRow.name,
      activity_status: selectedRow.activity_status,
      start_date: selectedRow.start_date,
      end_date: selectedRow.end_date,
      projectmembers: selectedRow.members.map((user) => ({
        value: user.project_member_id,
        label: user.UserInfo.full_name,
      })),
      is_milestone: selectedRow.is_milestone,
      description: selectedRow.description,
    });
    setMembers(
      selectedRow.members.map((user) => ({
        value: user.project_member_id,
        label: user.UserInfo.full_name,
      }))
    );
    setSelectedStartDate(new Date(selectedRow.start_date));
    setSelectedEndDate(new Date(selectedRow.end_date));
  };
  

  return (
    <div>
      <div className="flex flex-col  pr-9 pl-10 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className=" text-2xl font-bold text-blue-950">Edit Activity</div>
        <div className="justify-end  max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col  py-1 text-base text-slate-950 max-md:mt-10">
                <div className=" my-4">
                  Name <span className="text-red-600">*</span>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  placeholder="Enter activity name"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-12 pl-2 w-4/5"
                />

                <div className="my-4">
                  Activity Status <span className="text-red-600">*</span>
                </div>
                {/* <input
                  type="dropdown"
                  value={formData.activity_status}
                  placeholder="Enter activity Status"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="h-12 pl-2"
                /> */}

                <select
                  value={formData.activity_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      activity_status: e.target.value,
                    })
                  }
                  className="h-12 w-4/5 pl-2 border-x-2 border-y-2"
                >
                  <option value={formData.activity_status}>
                    {formData.activity_status}
                  </option>
                  {formData.activity_status === "on Progress" ? (
                    <option value="Completed">Completed</option>
                  ) : (
                    <option value="on Progress">on Progress</option>
                  )}
                </select>

                <div className="my-4">Member</div>
                <Select
                  name="members"
                  value={members.map((member) => ({
                    value: member.value,
                    label: memberOptions.find(
                      (option) => option.value === member.value
                    )?.label,
                  }))}
                  onChange={handleMemberChange}
                  options={memberOptions}
                  isMulti
                  className=" w-4/5 "
                  closeMenuOnSelect={false}
                  styles={customStyles}
                />
                <div className="flex flex-col ">
                  <div className="flex flex-col grow py-1 text-base text-slate-950 max-md:mt-10">
                    <label htmlFor="description" className=" my-4">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows="9"
                      cols="40"
                      className="w-4/5 border-gray-300 rounded p-2  resize-none "
                      style={{ backgroundColor: "#f3f3f4" }}
                      placeholder="Write a short description about the activity that you are going to create"
                      value={formData.description}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
              <div className="flex flex-col grow py-1 text-base max-md:mt-10">
                <div className="my-4">
                  Activity Start Date <span className="text-red-600">*</span>
                </div>

                <DatePicker
                  selected={selectedStartDate}
                  onChange={(selectedStartDate) =>
                    setSelectedStartDate(selectedStartDate)
                  }
                  minDate={startDate}
                  maxDate={endDate}
                  className="h-12 w-4/5 pl-2"
                />
                <div className="my-4">
                  Activity End Date <span className="text-red-600">*</span>
                </div>

                <DatePicker
                  selected={selectedEndDate}
                  onChange={(selectedEndDate) =>
                    setSelectedEndDate(selectedEndDate)
                  }
                  minDate={selectedStartDate}
                  maxDate={endDate}
                  className="h-12 w-4/5 pl-2"
                />
                <div className="flex flex-row mt-4">
                  <input
                    type="checkbox"
                    id="is_milestone"
                    name="is_milestone"
                    checked={formData.is_milestone}
                    onChange={handleInputChange}
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                  />
                  <label htmlFor="is_milestone" className="ml-3">
                    Is Milestone?
                  </label>
                </div>
                <div className="flex  mr-20 justify-end self-end mt-6">
                  <button
                    type="button"
                    className="flex justify-center items-center gap-2 p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
                    onClick={() => {
                      resetFormData();
                    }}
                  >
                    Reset                  </button>
                  <div
                    className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg cursor-pointer"
                    onClick={handleUpdateActivity}
                  >
                    Update Activity
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activitiesedit;
