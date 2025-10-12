const { QueryTypes } = require("sequelize");
const db = require("../config/db");
const RolePermission = db.role_permission;
const ProjectMembers = db.Project_member;
const Roles = db.Roles;
//const user_role = db.user_role; // Ensure this path is correct

const verifyAccessWithProject = (permission_id) => {
  return async (req, res, next) => {
    if (!req?.roles || !req.params.project_id) return res.sendStatus(401);

    const projectId = req.params.project_id;
    const userId = req.id;
    console.log("=================", userId);

    try {
      const projectMember = await ProjectMembers.findOne({
        where: { project_id: projectId, user_id: userId },
      });

      if (!projectMember) {
        return res.sendStatus(401);
      }

      console.log("=================", projectMember);

      const roles = await db.sequelize.query(
        `
        SELECT Roles.role_id FROM user_roles 
        JOIN Roles ON user_roles.role_id = Roles.role_id 
        WHERE user_roles.user_id = :user_id 
        AND Roles.project_related = true
      `,
        {
          replacements: { user_id: userId },
          type: QueryTypes.SELECT,
        }
      );

      if (!roles.length) {
        return res.sendStatus(401);
      }

      const roleIds = roles.map((role) => role.role_id);
      console.log("==================", roleIds);

      // Check if any of the roles have the required permission
      let permissionExist = false;
      for (const roleId of roleIds) {
        const rolePermission = await RolePermission.findOne({
          where: {
            role_id: roleId,
            permission_id,
          },
        });

        if (rolePermission) {
          permissionExist = true;
          break;
        }
      }

      if (!permissionExist) {
        return res
          .status(401)
          .json({ message: "Not authorized for this permission" });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = verifyAccessWithProject;
