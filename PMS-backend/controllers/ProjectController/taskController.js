const { Op } = require("sequelize");
const db = require("../../config/db");
const Task = db.Task;
const Milestone = db.Milestone;
const Task_members = db.Task_member;
const Activity = db.Activity;
const User = db.User;

const Milestone_member = db.Milestone_members;
const Project_member = db.Project_member;
const Notification = db.Notification;
const { v4: uuidv4 } = require("uuid");
const task = require("../../models/task");
const uuid = uuidv4();

const createTask = async (req, res, io) => {
  const uuid = uuidv4();
  const {
    name,
    start_date,
    end_date,
    taskmembers,
    task_status,
    is_milestone,
    description,
  } = req.body;
  const { activity_id } = req.params;

  try {
    if (
      !activity_id ||
      !name ||
      !start_date ||
      !end_date ||
      !taskmembers ||
      !task_status
    ) {
      return res
        .status(400)
        .json({ message: "Please provide task information properly" });
    }

    const existingTask = await Task.findOne({
      where: { name, activity_id },
    });
    if (existingTask) {
      return res.status(409).json({ message: "Task name already exists" });
    }

    const activity = await Activity.findByPk(activity_id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const task = await Task.create({
      task_id: uuid,
      activity_id,
      name,
      start_date,
      end_date,
      task_status,
      is_milestone,
      description,
    });

    const notifications = [];
    for (const value of taskmembers) {
      const projectMember = await Project_member.findOne({
        where: { project_member_id: value },
      });
      if (!projectMember) {
        await Task.destroy({ where: { task_id: uuid } });
        return res.status(400).json({ message: "Invalid project_member_id" });
      }

      await Task_members.create({
        task_member_id: uuidv4(),
        task_id: uuid,
        project_member_id: value,
      });

      // Create notification for each task member
      const notification = await Notification.create({
        notification_id: uuidv4(),
        message: `You've been assigned a new task: '${name}' in activity '${activity.name}'.`,
        user_id: projectMember.user_id,
        project_id: activity.project_id,
      });
      notifications.push(notification);
    }

    if (is_milestone) {
      await activity.update({ is_milestone: true });
    }

    // Prepare notifications to emit via Socket.IO
    let notificationArray = [];
    const unreadNotifications = await Notification.findAll({
      where: { read: 0 },
    });

    let customId = 1; // Start with 1 as the initial custom ID
    for (const notification of unreadNotifications) {
      notificationArray.push({
        id: customId,
        notification_id: notification.notification_id,
        message: notification.message,
        user_id: notification.user_id,
        date: new Date(notification.createdAt).toLocaleTimeString(),
      });
      customId++;
    }

    // Emit notifications after a delay
    setTimeout(() => {
      io.emit("notification", notificationArray);
    }, 3000);

    return res.status(201).json({ message: "New task created", task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllTasks = async (req, res) => {
  const { activity_id } = req.params;
  console.log(activity_id);
  try {
    const tasks = await Task.findAll({
      where: { activity_id: activity_id, is_deleted: false },
      include: [
        {
          model: Project_member,
          as: "members",
          attributes: ["user_id", "project_member_id"],
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

    return res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getTaskById = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  const uuid = uuidv4();

  const {
    activity_id,
    name,
    start_date,
    end_date,
    created_by,
    updated_by,
    taskmembers,
    task_status,
    is_milestone,
    description,
  } = req.body;
  const { task_id } = req.params;
  console.log("task id--", task_id);
  console.log("taskmembers====", req.body);

  let taskmembersArray = taskmembers;

  // if (taskmembers) {
  //   taskmembersArray = taskmembers.split(",");
  // }

  try {
    const task = await Task.findOne({
      where: { task_id: task_id, is_deleted: false },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.update({
      activity_id,
      name,
      start_date,
      taskmembers,
      task_status,
      end_date,
      created_by,
      updated_by,
      is_milestone,
      description,
    });

    // Delete existing major task members
    await Task_members.destroy({
      where: { task_id: task_id },
    });

    // Create new task members

    for (const value of taskmembersArray) {
      await Task_members.create({
        task_member_id: uuidv4(),
        task_id: task_id,
        project_member_id: value.project_member_id,
      });
    }
    return res.status(200).json({ message: "Task updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.destroy();
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
// const gettaskmember = async (req, res) => {

const gettaskmember = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findOne({
      where: { task_id: id, is_deleted: false },
      include: [
        {
          model: Project_member,
          as: "members", // Use the correct alias here
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
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const members = task.members;
    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  gettaskmember,
};
