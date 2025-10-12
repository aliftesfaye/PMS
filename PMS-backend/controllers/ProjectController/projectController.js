const db = require("../../config/db");
const Project = db.Project;
const User = db.User;
const Document = db.Document;
const DocumentType = db.Document_type;
const ProjectMembers = db.Project_member;
const TaskMembers = db.Task_member;
const SubTaskMembers = db.Sub_task_member;
const ActivityMembers = db.Activity_members;
const MajorTaskMembers = db.Major_task_member;
const Milestone = db.Milestone;
const Notification = db.Notification;
const { v4: uuidv4, validate: isValidUUID } = require("uuid");
const user_role = require("../../models/user_role");
const UserRole = db.user_role;
const Roles = db.Roles;
const {
  handleGetAllNotifications,
} = require("../../controllers/notficationControllers/projectnotfication");
require("dotenv").config();
const handleNewProject = async (req, res, io) => {
  console.log("project body");
  console.log(req.body);
  const {
    name,
    project_managers,
    technical_managers,
    start_date,
    end_date,
    document_type_id,
    document_description,
    members,
    division_id,
    description,
    budget,
  } = req.body;

  if (
    !name ||
    !start_date ||
    !end_date ||
    !document_type_id ||
    !project_managers ||
    !technical_managers ||
    !members
  ) {
    return res
      .status(400)
      .json({ message: "Please provide required project information" });
  }

  console.log("members===", members);
  const uuid = uuidv4();
  try {
    var allMembers =
      members + "," + project_managers + "," + technical_managers;
    allMembers = allMembers.split(",");
    var newmembers = members.split(",");
    var newproject_managers = project_managers.split(",");
    var newtechnical_managers = technical_managers.split(",");

    // Create a map to associate user IDs with roles
    const roleMap = {};
    newproject_managers.forEach((id) => (roleMap[id] = "Project Manager"));
    newtechnical_managers.forEach((id) => (roleMap[id] = "Technical Manager"));
    newmembers.forEach((id) => (roleMap[id] = "Project Member"));

    const existingProject = await Project.findOne({ where: { name: name } });
    if (existingProject) {
      return res.status(409).json({ message: "Project name already exists" });
    }
    const existingDocumentType = await DocumentType.findOne({
      where: { document_type_id },
    });
    if (!existingDocumentType) {
      return res.status(400).json({ message: "Document type not found" });
    }
    const project = await Project.create({
      project_id: uuid,
      name,
      overall_progress: "On Progress",
      start_date,
      end_date,
      division_id,
      description,
      budget,
    });
    console.log("creating project managers");
    for (let i = 0; i < newproject_managers.length; i++) {
      const projectManager = await UserRole.create({
        user_role_id: uuidv4(),
        user_id: newproject_managers[i],
        project_id: uuid,
        role_id: process.env.PROJECT_MANAGER,
      });
    }
    console.log("creating technical managers");
    for (let i = 0; i < newtechnical_managers.length; i++) {
      const technicalManager = await UserRole.create({
        user_role_id: uuidv4(),
        user_id: newtechnical_managers[i],
        project_id: uuid,
        role_id: process.env.TECHNICAL_MANAGER,
      });
    }
    for (let i = 0; i < newmembers.length; i++) {
      const memberRole = await UserRole.create({
        user_role_id: uuidv4(),
        user_id: newmembers[i],
        project_id: uuid,
        role_id: process.env.PROJECT_MEMBER,
      });
    }
    for (let i = 0; i < allMembers.length; i++) {
      const projectMember = await ProjectMembers.create({
        project_member_id: uuidv4(),
        user_id: allMembers[i],
        project_id: uuid,
      });
    }

    for (let i = 0; i < req.files.length; i++) {
      const documents = await Document.create({
        document_id: uuidv4(),
        document_type_id,
        project_id: uuid,
        document: req.files[i].filename,
        description: document_description,
      });
    }

    const allMembersofProject = [
      ...new Set([
        ...newmembers,
        ...newproject_managers,
        ...newtechnical_managers,
      ]),
    ];

    // Create notifications for each project member with their role
    const notifications = [];
    for (let i = 0; i < allMembersofProject.length; i++) {
      const role = roleMap[allMembersofProject[i]];
      const notification = await Notification.create({
        notification_id: uuidv4(),
        message: `A new project named ${name} has been created and you have been assigned as a ${role}.`,
        user_id: allMembersofProject[i],
        project_id: project.project_id,
      });
      notifications.push(notification);
    }

    try {
      const projectData = {
        project_id: project.project_id,
        name: project.name,
        start_date: project.start_date,
        end_date: project.end_date,
      };
      let notificationArray = [];
      const notifications = await Notification.findAll({
        where: {
          read: 0,
        },
      });

      let customId = 1;

      for (const notification of notifications) {
        notificationArray.push({
          id: customId,
          notification_id: notification.notification_id,
          message: notification.message,
          user_id: notification.user_id,
          date: new Date(notification.createdAt).toLocaleTimeString(),
        });

        customId++;
      }
      setTimeout(() => {
        io.emit("notification", notificationArray);
      }, 3000);

      return res
        .status(201)
        .json({ message: "New project created", project: projectData });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: "Error creating project", error });
    }
  } catch (error) {
    try {
      await Document.destroy({ where: { project_id: uuid } });
      await UserRole.destroy({ where: { project_id: uuid } });
      await ProjectMembers.destroy({ where: { project_id: uuid } });
      await Milestone.destroy({ where: { project_id: uuid } });
      await Project.destroy({ where: { project_id: uuid } });
    } catch (error) {
      console.log("Creating project error and project info deleted");
      return res
        .status(501)
        .json({ message: "Creating project error and project info deleted" });
    }
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleGetAllProjects = async (req, res, io) => {
  try {
    const projects = await Project.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: db.Division,
          as: "division",
        },
        {
          model: db.Activity,
          as: "activity",
        },
      ],
    });
    for (let i = 0; i < projects.length; i++) {
      var manager1 = await UserRole.findAll({
        where: {
          project_id: projects[i].project_id,
          role_id: process.env.TECHNICAL_MANAGER,
        },
        include: [{ model: User, as: "UserRoleToUser" }],
      });
      var manager = await UserRole.findAll({
        where: {
          project_id: projects[i].project_id,
          role_id: process.env.PROJECT_MANAGER,
        },
        include: [{ model: User, as: "UserRoleToUser" }],
      });
      var member = await UserRole.findAll({
        where: {
          project_id: projects[i].project_id,
          role_id: process.env.PROJECT_MEMBER,
        },
        include: [{ model: User, as: "UserRoleToUser" }],
      });
      projects[i].dataValues.project_manager = manager;
      projects[i].dataValues.technical_manager = manager1;
      projects[i].dataValues.project_member = member;
    }

    return res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleGetProjectById = async (req, res) => {
  const project_id = req.params.projectId;
  try {
    const project = await Project.findOne({
      where: { project_id, is_deleted: false },
      include: [
        {
          model: Roles,
          as: "ProjectRoles",
          include: [
            { model: UserRole, as: "RolesToUserRole", where: { project_id } },
          ],
        },
      ],
    });
    // const users = await UserRole.findOne({
    //   where: { project_id,is_deleted:false},
    //   // include:[{model:Roles,as:"ProjectRoles"}],
    //   include:[{model:User,as:"Users"}]
    // });
    var combinations = [];

    // for(let i=0;i<project.dataValues.Users.length;i++){
    //   const role=await UserRole.findOne({where:{project_id,user_id:project.dataValues.Users[i].dataValues.user_id}})
    //   roles.push(role)
    // }
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const handleGetProjectMemberById = async (req, res) => {
  const id = req.params.projectId;
  try {
    const projectMembers = await ProjectMembers.findAll({
      where: { project_id: id, is_deleted: true },
      include: [{ model: User, as: "UserInfo" }],
    });
    if (!projectMembers) {
      return res.status(404).json({ message: "project not found" });
    }
    return res.status(200).json(projectMembers);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const handleUpdateProject = async (req, res) => {
  const project_id = req.params.projectId;
  const name = req.body.title;
  const project_managers = req.body.projectManager;
  const technical_managers = req.body.technicalManager;
  const start_date = req.body.startDate;
  const end_date = req.body.endDate;
  const members = req.body.members;
  const description = req.body.description;
  const budget = req.body.budget;
  const division_id = req.body.division_id;

  if (
    !name ||
    !start_date ||
    !end_date ||
    !project_managers ||
    !technical_managers ||
    !members ||
    !project_id
  ) {
    return res.status(400).json({
      message:
        "Please provide project id, name, start_date, end_date, properly",
    });
  }

  try {
    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    await project.update({
      name,
      start_date,
      end_date,
      description,
      budget,
      division_id,
    });

    // Get existing user roles
    const existingUserRoles = await UserRole.findAll({ where: { project_id } });

    // Flatten arrays of users and map to user IDs
    const newProjectManagerIds = project_managers.map((user) => user.value);
    const newTechnicalManagerIds = technical_managers.map((user) => user.value);
    const newMemberIds = members.map((user) => user.value);
    const newUserIds = [
      ...new Set([
        ...newProjectManagerIds,
        ...newTechnicalManagerIds,
        ...newMemberIds,
      ]),
    ];

    // Delete roles that are not in the new list
    for (const role of existingUserRoles) {
      const { user_id, role_id } = role;

      // If the user ID exists in newUserIds, check if the role should be updated
      if (newUserIds.includes(user_id)) {
        const isNewProjectManager = newProjectManagerIds.includes(user_id);
        const isNewTechnicalManager = newTechnicalManagerIds.includes(user_id);
        const isNewMember = newMemberIds.includes(user_id);

        // If the current role is PROJECT_MANAGER but the user should no longer be a PROJECT_MANAGER
        if (role_id === process.env.PROJECT_MANAGER && !isNewProjectManager) {
          await UserRole.destroy({
            where: { user_role_id: role.user_role_id },
          });
        }
        // If the current role is TECHNICAL_MANAGER but the user should no longer be a TECHNICAL_MANAGER
        else if (
          role_id === process.env.TECHNICAL_MANAGER &&
          !isNewTechnicalManager
        ) {
          await UserRole.destroy({
            where: { user_role_id: role.user_role_id },
          });
        }
        // If the current role is PROJECT_MEMBER but the user should no longer be a PROJECT_MEMBER
        else if (role_id === process.env.PROJECT_MEMBER && !isNewMember) {
          await UserRole.destroy({
            where: { user_role_id: role.user_role_id },
          });
        }
      } else {
        // If the user ID does not exist in newUserIds, delete all their roles
        await UserRole.destroy({ where: { user_role_id: role.user_role_id } });
      }
    }

    // Add or update new roles
    const createUserRole = async (user, role_id) => {
      const existingRole = existingUserRoles.find(
        (role) => role.user_id === user.value && role.role_id === role_id
      );
      if (!existingRole) {
        await UserRole.create({
          user_role_id: uuidv4(),
          user_id: user.value,
          project_id,
          role_id,
        });
      }
    };

    for (const user of project_managers) {
      await createUserRole(user, process.env.PROJECT_MANAGER);
    }

    for (const user of technical_managers) {
      await createUserRole(user, process.env.TECHNICAL_MANAGER);
    }

    for (const user of members) {
      if (!project_managers.some((pm) => pm.value === user.value)) {
        await createUserRole(user, process.env.PROJECT_MEMBER);
      }
    }

    // Get existing project members
    const existingProjectMembers = await ProjectMembers.findAll({
      where: { project_id },
    });
    const existingProjectMemberIds = existingProjectMembers.map(
      (member) => member.user_id
    );

    // Remove project members that are no longer in the project
    const projectMembersToDelete = existingProjectMembers.filter(
      (member) => !newUserIds.includes(member.user_id)
    );
    for (const member of projectMembersToDelete) {
      await SubTaskMembers.destroy({
        where: { project_member_id: member.project_member_id },
      });
      await TaskMembers.destroy({
        where: { project_member_id: member.project_member_id },
      });
      await ActivityMembers.destroy({
        where: { project_member_id: member.project_member_id },
      });
      await ProjectMembers.destroy({
        where: { project_member_id: member.project_member_id },
      });
    }

    // Add new project members
    for (const user of newUserIds) {
      if (!existingProjectMemberIds.includes(user)) {
        await ProjectMembers.create({
          project_member_id: uuidv4(),
          user_id: user,
          project_id,
        });
      }
    }

    return res.status(201).json({ message: "project updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const AddUserToProject = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    if (!user_id) {
      return res
        .status(400)
        .json({ message: "Please provide user id properly" });
    }
    //check user availabiliry
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    //check project availability
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }
    //check if the user is already a member
    const existingMember = await ProjectMembers.findOne({
      where: { user_id, project_id: id },
    });
    if (existingMember) {
      return res.status(404).json({ message: "user already a member" });
    }
    const member = await ProjectMembers.create({
      project_member_id: uuidv4(),
      user_id,
      project_id: id,
    });

    return res
      .status(200)
      .json({ message: "new member is added to the project ", member: member });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handleGetProjectMemberById,
  handleNewProject,
  handleGetAllProjects,
  handleGetProjectById,
  handleUpdateProject,
  AddUserToProject,
};
