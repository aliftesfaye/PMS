const db = require("../../config/db");
const User = db.User;
const { DataTypes, UUID, where, UUIDV4 } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const project = require("../../models/project");
const notfication = require("../../models/notfication");
const Sub_task = db.Sub_task;
const Project = db.Project;
const Notification = db.Notification;

const handleGetAllNotifications = async (req, res, io) => {
  try {
    let notificationArray = [];
    const notifications = await Notification.findAll({
      where: {
        read: 0,
      },
    });

    let customId = 1; // Start with 1 as the initial custom ID

    for (const notification of notifications) {
      notificationArray.push({
        id: customId, // Use a custom integer ID
        notification_id: notification.notification_id,
        message: notification.message,
        user_id: notification.user_id,
        date: new Date(notification.createdAt).toLocaleTimeString(),
      });

      customId++; // Increment the custom ID for the next notification
    }
    setTimeout(() => {
      io.emit("notification", notificationArray);
    }, 5000);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const markNotificationAsRead = async (req, res, io) => {
  try {
    const user_id = req.params.user_id;

    // Find all unread notifications for the user
    const notifications = await Notification.findAll({
      where: {
        user_id: user_id,
        read: 0,
      },
    });

    // Mark all found notifications as read
    for (const notification of notifications) {
      notification.read = true;
      await notification.save();
    }

    return res.json({
      message: `All ${notifications.length} notifications marked as read`,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error marking notifications as read" });
  }
};

module.exports = {
  handleGetAllNotifications,
  markNotificationAsRead,
};
