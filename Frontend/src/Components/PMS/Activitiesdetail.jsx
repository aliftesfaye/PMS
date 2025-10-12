import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(4),
    maxWidth: "925px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#082f49",
    marginBottom: theme.spacing(0.6),
  },
  section: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(4),
    width: "100%",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      gap: theme.spacing(4),
    },
  },
  column: {
    display: "flex",
    flexDirection: "column",
    width: "48%", // Adjust width to leave space between columns
    backgroundColor: "white",
    padding: theme.spacing(3),
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginBottom: theme.spacing(4),
    },
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: theme.spacing(1),
    color: "#333", // Dark text color
    fontSize: "1.1rem",
  },
  infoText: {
    minHeight: "48px",
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    overflow: "auto",
    fontSize: "1rem",
  },
  noTaskText: {
    color: "#999", // Lighter text color
    fontStyle: "italic",
  },
}));

const Activitiesdetail = ({
  selectedRow,
  handleCloseModal,
  selectedRowAllData,
}) => {
  const [memberOptions, setMemberOptions] = useState([]);
  const [members, setMembers] = useState([]);
  const classes = useStyles();
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-4 text-gray-800">
        Activity Details
      </h2>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">Activity Name</h5>
            <p className="text-gray-600">{selectedRow.name}</p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">
              Activity Status
            </h5>
            <p className="text-gray-600">{selectedRow.activity_status}</p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">Members</h5>
            <div className="text-gray-600">
              {selectedRow.members.length > 0 ? (
                selectedRow.members.map((member, index) => (
                  <p key={index}>{member.UserInfo.full_name}</p>
                ))
              ) : (
                <p>No Members</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">
              Activity Description
            </h5>
            <p className="text-gray-600">{selectedRow.description}</p>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">
              Activity Start Date
            </h5>
            <p className="text-gray-600">
              {new Date(selectedRow.start_date).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">
              Activity End Date
            </h5>
            <p className="text-gray-600">
              {new Date(selectedRow.end_date).toLocaleDateString()}
            </p>
          </div>
          <div className="mb-4">
            <h5 className="text-lg font-medium text-gray-700">Tasks</h5>
            <div className="text-gray-600">
              {selectedRowAllData.tasks.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selectedRowAllData.tasks.map((task, index) => (
                    <li key={index}>{task.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No Task Found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activitiesdetail;
