const { Op, where } = require("sequelize");
const db = require("../../config/db");
const Task = db.Task;
const Sub_task = db.Sub_task;
const Activity = db.Activity;
const Project_member = db.Project_member;
const User = db.User;
const { v4: uuidv4 } = require("uuid");

const getAllMilestone = async (req, res) => {
  const { idType, id } = req.params;
  console.log(
    "Received request to get milestones with ID type:",
    idType,
    "and ID:",
    id
  );

  try {
    let milestones;
    const milestonesWithDetails = [];
    if (idType === "project_id") {
      milestones = await Activity.findAll({
        where: { project_id: id, is_milestone: true, is_deleted: false },
        include: [
          {
            model: Project_member,
            as: "members",
            attributes: ["user_id"],
            through: { attributes: [] },
            include: [
              {
                model: User,
                as: "UserInfo",
                attributes: ["full_name", "img_url", "email"],
              },
            ],
          },
        ],
      });

      for (const milestone of milestones) {
        // Fetch  tasks for the current activity
        const tasks = await Task.findAll({
          where: {
            activity_id: milestone.activity_id,
            is_milestone: true,
            is_deleted: false,
          },
        });
        var sub_tasks = [];
        for (const task of tasks) {
          // Fetch  sub tasks for the current task
          sub_tasks = await Sub_task.findAll({
            where: {
              task_id: task.task_id,
              is_milestone: true,
              is_deleted: false,
            },
          });
        }

        // Add the current activity along with its major tasks and comments to the array
        milestonesWithDetails.push({
          activity: milestone,
          tasks: tasks,
          sub_tasks: sub_tasks,
          sub_tasks_length: sub_tasks.length,
          Tasklength: tasks.length,
        });
      }

      console.log("Fetched project milestones:", milestonesWithDetails);
    } else if (idType === "activity_id") {
      milestones = await Task.findAll({
        where: { activity_id: id, is_milestone: true, is_deleted: false },
      });
      console.log("Fetched activity milestones:", milestones);
    } else if (idType === "task_id") {
      milestones = await Sub_task.findAll({
        where: { task_id: id, is_milestone: true, is_deleted: false },
      });
      console.log("Fetched task milestones:", milestones);
    } else {
      console.error("Invalid request: Missing or invalid ID type");
      return res
        .status(400)
        .json({ message: "Invalid request: Missing or invalid ID type" });
    }

    if (milestonesWithDetails.length === 0) {
      console.log("No milestones found for the given ID type and ID");
    }

    return res.status(200).json(milestonesWithDetails);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllMilestone };
