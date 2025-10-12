const db = require("../../config/db");
const Activity = db.Activity;
const Project = db.Project;
const User = db.User;
const Task = db.Task;
const Sub_task = db.Sub_task;
const Comment = db.Comment;
const Project_member = db.Project_member;
const Notification = db.Notification;
const Activity_members = db.Activity_members;
const { DataTypes, UUID, where } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const project = require("../../models/project");

const getAlllprojectMembers = async (req, res) => {
  const { project_id } = req.params;
  try {
    const members = await db.Project_member.findAll({
      where: { project_id: project_id },
      include: [
        {
          model: db.User,
          as: "UserInfo",
          attributes: ["full_name"],
          include: [
            {
              model: db.user_role,
              as: "UserToUserRoles",
              where: { project_id: project_id },
              include: [
                {
                  model: db.Roles,
                  as: "UserRoleToRoles",
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
      ],
    });
    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const createActivity = async (req, res, io) => {
  const uuid = uuidv4();
  let {
    name,
    activity_status,
    start_date,
    end_date,
    projectmembers,
    is_milestone,
    description,
  } = req.body;
  const { project_id } = req.params;

  if (!name || !project_id || !start_date || !end_date) {
    return res
      .status(400)
      .json({ message: "Please provide activity information properly" });
  }

  const existingProject = await Project.findOne({
    where: { project_id },
  });
  if (!existingProject) {
    return res
      .status(400)
      .json({ message: "Cannot find the project to create activity for" });
  }

  try {
    if (projectmembers.length === 0) {
      return res
        .status(400)
        .json({ message: "No project member checkboxes are selected." });
    }

    const existingActivity = await Activity.findOne({
      where: { name, project_id, is_deleted: false },
    });

    if (existingActivity) {
      return res.status(409).json({ message: "Activity name already exists" });
    }

    const activity = await Activity.create({
      activity_id: uuid,
      project_id,
      name,
      activity_status,
      start_date,
      end_date,
      is_milestone,
      description,
    });

    const notifications = [];
    for (const value of projectmembers) {
      const projectMember = await Project_member.findOne({
        where: { project_member_id: value },
      });
      if (!projectMember) {
        await Activity.destroy({ where: { activity_id: uuid } });
        return res.status(400).json({ message: "Invalid project_member_id" });
      }

      await Activity_members.create({
        activity_member_id: uuidv4(),
        activity_id: uuid,
        project_member_id: value,
      });

      // Create notification for each project members
      const notification = await Notification.create({
        notification_id: uuidv4(),
        message: `You've been assigned to a new activity: '${name}' in '${existingProject.name}' project.`,
        user_id: projectMember.user_id,
        project_id,
      });
      notifications.push(notification);
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

    return res.status(201).json({ message: "New activity created", activity });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllActivities = async (req, res) => {
  const { project_id } = req.params;
  try {
    const activities = await Activity.findAll({
      where: { project_id: project_id, is_deleted: false },
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

    const activitiesWithDetails = [];
    for (const activity of activities) {
      const tasks = await Task.findAll({
        where: { activity_id: activity.activity_id, is_deleted: false },
        include: [
          {
            model: Sub_task,
            as: "subTask",
            include: [
              {
                model: Comment,
                as: "Coments",
              },
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
            where: { is_deleted: false },
            required: false, // include tasks even if there are no sub-tasks
          },
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

      const sub_tasks = [];
      for (const task of tasks) {
        // Fetch sub tasks for the current task
        const taskSubTasks = await Sub_task.findAll({
          where: { task_id: task.task_id, is_deleted: false },
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
        sub_tasks.push(...taskSubTasks);
      }

      // Fetch comments for the current activity
      const comments = await Comment.findAll({
        where: { activity_id: activity.activity_id, is_deleted: false },
      });

      // Add the current activity along with its major tasks and comments to the array
      activitiesWithDetails.push({
        activity: activity,
        tasks: tasks,
        sub_tasks: sub_tasks,
        sub_tasks_length: sub_tasks.length,
        comments: comments,
        Tasklength: tasks.length,
        commentlength: comments.length,
      });
    }

    return res.status(200).json(activitiesWithDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getActivityById = async (req, res) => {
  const { id } = req.params;
  try {
    const activity = await Activity.findOne({
      where: { activity_id: id, is_deleted: false },
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
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    return res.status(200).json(activity);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleGetAllMembersOfActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findOne({
      where: { activity_id: id, is_deleted: false },
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
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    const members = activity.members;
    return res.status(200).json(members);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateActivity = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const {
    project_id,
    name,
    activity_status,
    start_date,
    end_date,
    created_by,
    updated_by,
    projectmembers,
    is_milestone,
    description,
  } = req.body;

  let projectMembersArray = projectmembers;

  try {
    const activity = await Activity.findOne({
      where: { activity_id: id, is_deleted: false },
    });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activity.update({
      project_id,
      name,
      activity_status,
      start_date,
      end_date,
      created_by,
      updated_by,
      is_milestone,
      description,
    });

    await Activity_members.destroy({
      where: { activity_id: id },
    });

    for (const value of projectMembersArray) {
      await Activity_members.create({
        activity_member_id: uuidv4(),
        activity_id: id,
        project_member_id: value.project_member_id,
      });
    }

    return res.status(200).json({ message: "Activity updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteActivity = async (req, res) => {
  const { id } = req.params;

  try {
    const activity = await Activity.findByPk(id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    await activity.destroy();
    return res.status(200).json({ message: "Activity deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createActivity,
  getAllActivities,
  getActivityById,
  handleGetAllMembersOfActivity,
  updateActivity,
  deleteActivity,
  getAlllprojectMembers,
};
