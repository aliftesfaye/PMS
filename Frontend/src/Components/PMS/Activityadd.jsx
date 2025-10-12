import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import Swal from "sweetalert2";
import apiService from "../services/apiServices";

import "react-datepicker/dist/react-datepicker.css";

const Activityadd = ({
  selectedProject,
  handleCloseModal,
  handlefetchActivity,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    activity_status: "Pending",
    start_date: "",
    end_date: "",
    projectmembers: [],
    is_milestone: false,
    description: "",
  });
  const [members, setMembers] = useState([]);
  const [memberOptions, setMemberOptions] = useState([]);
  const [description, setDescription] = useState("");

  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date(selectedProject.start_date)
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(selectedProject.end_date)
  );
  const [startDate, setStartDate] = useState(
    new Date(selectedProject.start_date)
  );
  const [endDate, setEndDate] = useState(new Date(selectedProject.end_date));

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

  const handleMemberChange = (selectedOption) => {
    const selectedValues = selectedOption.map((option) => option.value);
    setMembers(selectedValues);
  };
  const handleInputChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData({
      ...formData,
      [name]: name === "is_milestone" ? checked : value,
    });
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    const isSameDates =
      selectedStartDate.getTime() ===
        new Date(selectedProject.start_date).getTime() &&
      selectedEndDate.getTime() ===
        new Date(selectedProject.end_date).getTime();

    if (isSameDates) {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to create the activity with the same start date and end date as the project?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        customClass: {
          confirmButton: "confirm-button",
          cancelButton: "cancel-button",
        },
        didOpen: () => {
          const confirmButton = document.querySelector(".swal2-confirm");
          const cancelButton = document.querySelector(".swal2-cancel");
          confirmButton.style.marginRight = "10px";
          cancelButton.style.marginLeft = "10px";
        },
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    formData.start_date = selectedStartDate;
    formData.end_date = selectedEndDate;
    formData.projectmembers.push(...members);

    try {
      const response = await apiService.activityadd(
        formData,
        selectedProject.project_id
      );
      console.log("Activity creation response:", response);

      if (response.message === "New activity created") {
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
          projectmembers: [],
          description: "",
        });
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
          title: "New Activity has been created",
        }).then(() => {
          handleCloseModal();
          handlefetchActivity();
        });
      } else {
        console.error("User registration failed");
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Activity Registered Failed",
          showConfirmButton: true,
          timer: 1500,
          customClass: {
            popup: "custom-popup-style",
          },
        });
      }
    } catch (error) {
      console.error("Activity Registration failed:", error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Activity Registered Failed",
        text: error.response.data.message,
        showConfirmButton: true,
        timer: 1500,
        customClass: {
          popup: "custom-popup-style",
        },
      });
    }
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
    setFormData((prevFormData) => {
      const resetFormData = Object.keys(prevFormData).reduce((acc, key) => {
        acc[key] = ""; // Reset each key to an empty string
        setMembers([]);
        setSelectedStartDate(selectedProject.start_date);
        setSelectedEndDate(selectedProject.end_date);
        return acc;
      }, {});
      return resetFormData;
    });
  };

  return (
    <div>
      <div className="flex flex-col py-12  pr-9 pl-10 bg-white rounded-2xl max-w-[925px] max-md:px-5">
        <div className=" ">
          <div className="self-start text-2xl font-bold  text-blue-950">
            Add Activity
          </div>

          <div className="justify-end mt-7 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <div className="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
                <div className="flex flex-col py-1 text-base text-slate-950 max-md:mt-10">
                  <div className="mb-4 ">
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

                  <div className="mt-4">Member</div>
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
                    className="mr-10 w-4/5 mt-3"
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
                <div className="flex  flex-col grow py-1 text-base max-md:mt-10">
                  <div className="mb-4  w-fit">
                    Activity Start Date <span className="text-red-600">*</span>
                  </div>

                  <DatePicker
                    selected={selectedStartDate}
                    onChange={(selectedStartDate) =>
                      setSelectedStartDate(selectedStartDate)
                    }
                    minDate={startDate}
                    maxDate={endDate}
                    className="w-4/5  h-12 pl-2"
                  />
                  <div className="my-4 w-fit ">
                    Activity End Date <span className="text-red-600">*</span>
                  </div>

                  <DatePicker
                    selected={selectedEndDate}
                    onChange={(selectedEndDate) =>
                      setSelectedEndDate(selectedEndDate)
                    }
                    minDate={selectedStartDate}
                    maxDate={endDate}
                    className="w-4/5 h-12 pl-2"
                  />
                  <div className="flex  w-fit flex-row mt-4  ">
                    <input
                      type="checkbox"
                      id="is_milestone"
                      name="is_milestone"
                      checked={formData.is_milestone}
                      onChange={handleInputChange}
                      className="h-4 w-4  mt-5 mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-md"
                    />
                    <label htmlFor="is_milestone" className="my-4">
                      Is Milestone?
                    </label>
                  </div>
                  <div className="flex mr-20 justify-end ">
                    <button
                      type="button"
                      className="flex justify-center items-center p-2 rounded-lg text-lg w-40  border-[#d73d36] text-[#d73d36] font-bold"
                      onClick={() => {
                        resetFormData();
                      }}
                    >
                      Reset
                    </button>
                    <div
                      className="justify-center p-2.5 font-bold text-white bg-blue-900 rounded-lg cursor-pointer"
                      onClick={handleAddActivity}
                    >
                      Add Activity
                    </div>
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

export default Activityadd;
