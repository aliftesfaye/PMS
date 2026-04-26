const bcrypt = require("bcrypt");
const db = require("../../config/db");
const user_role = db.user_role;
const User = db.User;
const Roles = db.Roles;
const Project = db.Project;
const Activity = db.Activity;
const Task = db.Task;
const Sub_task = db.Sub_task;

const getUser = async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await User.findOne({
      where: { user_id, is_deleted: false },
      include: [
        {
          model: Project,
          as: "Projects",
          include: [
            {
              model: Activity,
              as: "activity",
              where: { is_deleted: false },
              include: [
                {
                  model: Task,
                  as: "Task",
                  where: { is_deleted: false },
                  include: [
                    {
                      model: Sub_task,
                      as: "subTask",
                      where: { is_deleted: false },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: false },
      include: [
        { model: Project, as: "Projects" },
        { model: Roles, as: "Roles" },
      ],
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users); // Use 200 status code for success
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getOrganizationAdminUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: false },
      include: [
        { model: Project, as: "Projects" },
        {
          model: Roles,
          as: "Roles",
          where: {
            name: "Organization Admin",
            is_deleted: false,
          },
          required: true,
        },
      ],
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users); // Use 200 status code for success
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getSectorAdminUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: false },
      include: [
        { model: Project, as: "Projects" },
        {
          model: Roles,
          as: "Roles",
          where: {
            name: "Cluster Admin",
            is_deleted: false,
          },
          required: true,
        },
      ],
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users); // Use 200 status code for success
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const getDepartmentAdminUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: false },
      include: [
        { model: Project, as: "Projects" },
        {
          model: Roles,
          as: "Roles",
          where: {
            name: "Department Admin",
            is_deleted: false,
          },
          required: true,
        },
      ],
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(users); // Use 200 status code for success
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  const full_name = req.params.full_name;
  const role = req.params.role;

  if (!full_name || !role) {
    return res.sendStatus(404);
  }

  try {
    const deleteUser = await User.destroy({ where: { full_name } });
    return res
      .status(201)
      .json({ message: `${full_name} deleted successfully` });
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: "User can't be deleted" });
  }
};

const editMember = async (req, res) => {
  const user_id = req.params.id;
  console.log(user_id);
  const { full_name, email, gender, division_id, role, isRoot, isSector } =
    req.body;

  try {
    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      if (full_name) user.full_name = full_name;
      if (email) user.email = email;
      if (gender) user.gender = gender;
      if (division_id) user.division_id = division_id;

      // Save the user first
      await user.save();

      // Update the role if provided
      if (role || isRoot || isSector) {
        let newRole = role;

        if (isRoot) {
          newRole = process.env.ORGANIZATION_ADMIN;
        } else if (isSector) {
          newRole = process.env.SECTOR_ADMIN;
        }

        const userRole = await user_role.findOne({ where: { user_id } });
        if (userRole) {
          userRole.role_id = newRole;
          await userRole.save();
        } else {
          await user_role.create({
            user_role_id: uuidv4(),
            user_id: user_id,
            role_id: newRole,
            project_id: "97a17f58-f00c-11ee-bd81-c01803d475fd",
          });
        }
      }

      return res.status(201).json({ message: "User account updated" });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Error updating user details" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server problem" });
  }
};

const editUserProfile = async (req, res) => {
  const user_id = req.params.id;
  const { full_name, email, current_password, new_password, confirm_password } = req.body;

  try {
    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update full_name and email
    if (full_name) user.full_name = full_name;
    if (email) user.email = email;

    // Password change logic
    if (current_password || new_password || confirm_password) {
      if (!current_password || !new_password || !confirm_password) {
        return res.status(400).json({ message: "All password fields are required" });
      }

      const isMatch = await bcrypt.compare(current_password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      if (new_password !== confirm_password) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
      }

      // Password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(new_password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(new_password, salt);
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};


const toggleSuspend = async (req, res) => {
  const user_id = req.params.id;
  try {
    const result = await User.findOne({ where: { user_id } });
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }

    result.account_status = !result.account_status; // Remove the space before 'account_status'
    await result.save();

    return res.status(201).json({ message: `status is updated ` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server problem" });
  }
};
const getAllUserproject = async (req, res) => {
  const { user_id } = req.params;
  console.log("getting all user project.....");
  try {
    const projectMembers = await db.Project_member.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: db.Project,
          as: "userproject",
          include: [
            {
              model: db.Activity,
              as: "activity",
              include: [
                {
                  model: db.Task,
                  as: "Task",
                  include: [
                    {
                      model: db.Sub_task,
                      as: "subTask",
                      attributes: [
                        "sub_task_id",

                        "name",
                        "subtask_status",
                        "start_date",
                        "end_date",
                        "is_milestone",
                        "created_by",
                        "updated_by",
                        "createdAt",
                        "updatedAt",
                        "is_deleted",
                        "deletionAt",
                        "deletedBy",
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (projectMembers.length === 0) {
      return res.status(404).json({ message: "No result" });
    }

    return res.status(200).json(projectMembers); // Use 200 status code for success
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getUser,
  deleteUser,
  editMember,
  editUserProfile,
  toggleSuspend,
  getAllUser,
  getOrganizationAdminUser,
  getSectorAdminUser,
  getDepartmentAdminUser,
  getAllUserproject,
};
