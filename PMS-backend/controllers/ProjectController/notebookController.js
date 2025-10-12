const db = require("../../config/db");
const User = db.User;
const { DataTypes, UUID, UUIDV4 } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const Notebook = db.Notebook;
const Project = db.Project;
const Activity = db.Activity;
const Sub_task = db.Sub_task;
const Task = db.Task;

// Create a new notebook entry
const createNotebook = async (req, res) => {
  const uuid = uuidv4();
  const { project_id, activity_id, sub_task_id, task_id } = req.params;
  const { title, content } = req.body;

  console.log("User ID:", req.id);

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content" });
  }

  try {
    // Check if the provided IDs exist in the respective tables
    const existingProject = project_id
      ? await Project.findByPk(project_id)
      : null;
    const existingActivity = activity_id
      ? await Activity.findByPk(activity_id)
      : null;
    const existingSubTask = sub_task_id
      ? await Sub_task.findByPk(sub_task_id)
      : null;
    const existingTask = task_id ? await Task.findByPk(task_id) : null;

    // One ID must be there to create
    if (
      !existingProject &&
      !existingActivity &&
      !existingSubTask &&
      !existingTask
    ) {
      return res.status(401).json({ message: "IDs not found" });
    }

    const newNotebook = await Notebook.create({
      notebook_id: uuid,
      project_id: project_id || null,
      activity_id: activity_id || null,
      sub_task_id: sub_task_id || null,
      task_id: task_id || null,
      title,
      content,
      created_by: req.id,
      updated_by: req.id,
    });

    return res
      .status(201)
      .json({ message: "New notebook created", notebook: newNotebook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get notebook entry by ID
const getNotebookById = async (req, res) => {
  const { notebook_id } = req.params;

  try {
    const notebook = await Notebook.findByPk(notebook_id);
    if (!notebook) {
      return res.status(404).json({ message: "Notebook not found" });
    }

    const user = await User.findByPk(notebook.created_by); // to get the info of notebook creator
    if (user) {
      notebook.dataValues.createdBy = user.full_name;
    }

    return res.status(200).json(notebook);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all notebook entries
const getAllNotebooks = async (req, res) => {
  const { project_id, activity_id, sub_task_id, task_id } = req.params;

  try {
    // Define the filter object based on the presence of project_id, activity_id, sub_task_id, or task_id
    const filter = {};
    if (project_id) filter.project_id = project_id;
    if (activity_id) filter.activity_id = activity_id;
    if (sub_task_id) filter.sub_task_id = sub_task_id;
    if (task_id) filter.task_id = task_id;

    // Find all notebooks based on the filter object
    const notebooks = await Notebook.findAll({ where: filter });

    // Fetch the full_name of the creator for each notebook using a loop
    for (let i = 0; i < notebooks.length; i++) {
      const notebook = notebooks[i];
      const user = await User.findByPk(notebook.created_by); // Assuming created_by is the foreign key linking to User table
      if (user) {
        // Add full_name to the notebook object if user exists
        notebook.dataValues.createdBy = user.full_name;
      }
    }

    return res.status(200).json(notebooks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update a notebook entry
const updateNotebook = async (req, res) => {
  const { notebook_id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content" });
  }

  try {
    const existingNotebook = await Notebook.findByPk(notebook_id);
    if (!existingNotebook) {
      return res.status(404).json({ message: "Notebook not found" });
    }

    await existingNotebook.update({ title, content, updated_by: req.id });
    return res.status(200).json({ message: "Notebook updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a notebook entry
const deleteNotebook = async (req, res) => {
  const { notebook_id } = req.params;

  try {
    const existingNotebook = await Notebook.findByPk(notebook_id);
    if (!existingNotebook) {
      return res.status(404).json({ message: "Notebook not found" });
    }

    await existingNotebook.destroy();
    return res.status(200).json({ message: "Notebook deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createNotebook,
  getNotebookById,
  getAllNotebooks,
  updateNotebook,
  deleteNotebook,
};
