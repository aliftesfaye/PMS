import React, { useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";

const Createnewteam = ({ handleCloseModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectmanagers: [],
    teammembers: [],
  });

  const optionsProjectManagers = [
    { value: "John", label: "John" },
    { value: "Jane", label: "Jane" },
    { value: "Alice", label: "Alice" }
  ];

  const optionsTeamMembers = [
    { value: "Michael", label: "Michael" },
    { value: "Emily", label: "Emily" },
    { value: "William", label: "William" }
  ];

  const handleChange = (selectedOption, { name }) => {
    const selectedValues = selectedOption ? selectedOption.map(option => option.value) : [];
    setFormData({
      ...formData,
      [name]: selectedValues,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      description: "",
      projectmanagers: [],
      teammembers: [],
    });
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Team created successfully",
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      description: "",
      projectmanagers: [],
      teammembers: [],
    });
    handleCloseModal(); 
  };

  return (
    <div className="w-full px-16 py-4">
      <div className="text-xl font-bold mb-4">Create New Team</div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4 ">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="pl-3 w-1/3 h-12 border-gray-300 rounded py-2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter Team Name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="projectmanagers" className="block text-sm font-bold mb-2">
            Project Managers
          </label>
          <div className="projectmanager-input-container">
            <Select
              id="projectmanagers"
              name="projectmanagers "
              className="w-1/3 "
              value={optionsProjectManagers.filter(option => formData.projectmanagers.includes(option.value))}
              onChange={(selectedOption) => handleChange(selectedOption, { name: "projectmanagers" })}
              options={optionsProjectManagers}
              isMulti
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#f3f3f4", 
                }),
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="teammembers" className="block text-sm font-bold mb-2">
            Team Members
          </label>
          <div className="teammembers-input-container">
            <Select
              id="teammembers"
              name="teammembers"
              className="w-1/3"
              value={optionsTeamMembers.filter(option => formData.teammembers.includes(option.value))}
              onChange={(selectedOption) => handleChange(selectedOption, { name: "teammembers" })}
              options={optionsTeamMembers}
              isMulti
              required
              styles={{
                control: (provided) => ({
                  ...provided,
                  backgroundColor: "#f3f3f4", 
                }),
              }}
            />
          </div>
        </div>

 <div className="ml-72 -mt-72 pt-1 w-auto">       
    <label htmlFor="description" className="block text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="9"
            cols="40"
            className=" border-gray-300 rounded p-2 resize-none w-full"
            style={{ backgroundColor: "#f3f3f4" }}
            placeholder="Write a short description about the team that you are going to create"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="flex justify-end gap-6 mt-4">
          <div className=" text-black  rounded cursor-pointer py-2" onClick={handleCancel}>
            Cancel
          </div>
          <div type="submit" className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded" onClick={handleSubmit}>
            Register
          </div>
        </div>
      </form>
    </div>
  );
};

export default Createnewteam;
