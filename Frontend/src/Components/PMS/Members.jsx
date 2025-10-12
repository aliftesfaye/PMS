import React, { useState, useRef, useEffect } from "react";
import "./Tasks.css";
import member10 from "../Assets/member10.png";
import member11 from "../Assets/member11.png";
import member12 from "../Assets/member9.png";
import assigned from "../Assets/assigned.png";
import completed from "../Assets/completed.png";
import assign from "../Assets/assign.png";
import view from "../Assets/view.png";
import SearchIcon from "../Assets/Search-icon.png";
import Assign from "./Assign.jsx";
import AddMemberToProject from "./Addmembertoproject.jsx";
import View from "./Viewprofile.jsx";

const Members = () => {
  const membersData = [
    {
      memberName: "Milestone 1",
      memberImage: member10,
      expertise: "React Dev",
      totalTasks: "10",
      assigned: "10",
      completed: "4",
    },
    {
      memberName: "Milestone 2",
      memberImage: member12,
      expertise: "5",
      totalTasks: "10",
      assigned: "10",
      completed: "4",
    },
    {
      memberName: "Milestone 3",
      memberImage: member11,
      expertise: "5",
      totalTasks: "10",
      assigned: "10",
      completed: "4",
    },
    {
      memberName: "Milestone 4",
      memberImage: member12,
      expertise: "5",
      totalTasks: "10",
      assigned: "10",
      completed: "4",
    },
    {
      memberName: "Milestone 5",
      memberImage: member10,
      expertise: "Frontend",
      totalTasks: "10",
      assigned: "10",
      completed: "4",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState(membersData);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const modalRef = useRef(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredMembers = membersData.filter((member) =>
      member.memberName.toLowerCase().includes(term)
    );
    setMembers(filteredMembers);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleAssignModal = () => {
    setShowAssignModal(!showAssignModal);
  };
  const toggleViewModal = () => {
    setShowViewModal(!showViewModal);
  };

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, []);

  const groupedMembers = [];
  let currentRow = [];
  members.forEach((member, index) => {
    currentRow.push(member);
    if (currentRow.length === 3 || index === members.length - 1) {
      groupedMembers.push(currentRow);
      currentRow = [];
    }
  });

  return (
    <div >
      <div className="milestone-title">Project 1</div>
      <div className="button-and-search flex justify-between mb-5">
        <form className="search-form relative">
          <input
            type="text"
            placeholder="Search members"
            value={searchTerm}
            onChange={handleSearch}
            className=" border-gray-300 rounded-lg  mt-4 ml-8 px-4 py-2 pl-10 "
          />
          <img
            src={SearchIcon}
            alt="Search"
            className="search-icon absolute top-7 left-10"
          />
        </form>
        <button onClick={toggleModal} className="add-member-btn mr-20">
          + Add Member to this Project
        </button>
      </div>
      {groupedMembers.map((row, rowIndex) => (
        <div key={rowIndex} className="milestone-row">
          {row.map((member, memberIndex) => (
            <div className="members-card flex w-64  " key={memberIndex}>
              <img
                src={member.memberImage}
                alt={member.memberImage}
                className="w-32 h-32 mt-14 ml-4"
              />

              <div className=" h-52 bg-gray-400 mx-4 w-0.5 ml-6 mt-8"></div>
              <div className=" mt-8 w-32">{member.memberName}</div>
              <div>
                <div className="mt-16 px-1.5 bg-blue-100 inline-block rounded-md -ml-32">
                  {member.expertise}
                </div>
              </div>
              <hr className=" w-52 border-gray-400 mt-24 -ml-32 " />
              <div className="mt-28 -ml-52">
                Total tasks {member.totalTasks}
              </div>
              <div className="mt-36  -ml-24 flex">
                <img
                  src={assigned}
                  alt="Assigned"
                  className="w-4 h-4 mr-2 mt-1"
                />
                <span>{member.assigned}</span>
              </div>
              <div className="mt-44 -ml-10 flex">
                <img
                  src={completed}
                  alt="Completed"
                  className="w-4 h-4 mt-1 mr-2"
                />
                <span>{member.completed}</span>
                <button
                  onClick={toggleAssignModal}
                  className=" flex assign-btn mt-7 text-white h-10 -ml-8"
                >
                  <img
                    src={assign}
                    alt="Assign"
                    className="w-4 h-4 mr-1 mt-1"
                  />{" "}
                  Assign
                </button>
                <button
                  onClick={toggleViewModal}
                  className="profilee-btn ml-0.5 flex mt-7 text-white h-10 "
                >
                  <img src={view} alt="View" className="w-4 h-4 mt-1 mr-1" />{" "}
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div
            ref={modalRef}
            className="bg-white w-2/3 p-8 rounded-md relative"
          >
            <span
              className="absolute top-4 right-8 cursor-pointer text-gray-500"
              onClick={toggleModal}
            >
              X
            </span>
            <AddMemberToProject />
          </div>
        </div>
      )}
      {showAssignModal && (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-2/3 p-8 rounded-md relative">
            <span
              className="absolute top-2 right-8 cursor-pointer text-gray-500"
              onClick={toggleAssignModal}
            >
              X
            </span>
            <Assign />
          </div>
        </div>
      )}

      {showViewModal && (
        <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-3/5 p-8 rounded-md relative">
            <span
              className="absolute top-2 right-8 cursor-pointer text-gray-500"
              onClick={toggleViewModal}
            >
              X
            </span>
            <View />{" "}
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
