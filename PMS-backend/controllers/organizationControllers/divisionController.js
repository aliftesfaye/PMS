const db = require("../../config/db");
const User = db.User;
const Sector = db.sector;
const Division = db.Division;
const Roles = db.Roles;
const Permission = db.Permission;
const { v4: uuidv4 } = require("uuid");
const uuid = uuidv4();

const handleNewDivision = async (req, res) => {
  if (req.body.head_id) var head_id = req.body.head_id;
  const { name, sector_id } = req.body;
  console.log(req.body);
  if (!name || !sector_id) {
    return res
      .status(400)
      .json({ message: "Please provide division info properly" });
  }
  try {
    const existingDivision = await Division.findOne({ where: { name } });
    if (existingDivision) {
      return res.status(409).json({ message: "division name already exists" });
    }
    const division = await Division.create({
      division_id: uuidv4(),
      sector_id,
      head_id,
      name,
    });
    return res
      .status(201)
      .json({ message: "New division created", division: division });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleGetAllDivision = async (req, res) => {
  try {
    const divisions = await Division.findAll({
      where: { is_deleted: false },
      include: [{ model: User, as: "Users" }],
    });

    const divisionsWithDetails = [];

    for (const division of divisions) {
      // Fetch  sector for the current division
      const sector = await Sector.findAll({
        where: { sector_id: division.sector_id },
      });

      // Fetch head for the current division
      const head = await User.findAll({
        where: { user_id: division.head_id },
      });

      divisionsWithDetails.push({
        division: division,
        sector: sector,
        head: head,
      });
    }
    return res.status(200).json(divisionsWithDetails);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleGetDivisionById = async (req, res) => {
  const { id } = req.params;
  try {
    const division = await Division.findByPk(id, {
      include: [{ model: User, as: "Users" }],
    });
    if (!division) {
      return res.status(404).json({ message: "division not found" });
    }
    return res.status(200).json(division);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const handleUpdateDivision = async (req, res) => {
  const { id } = req.params;
  const { sector_id } = req.body;
  console.log(req.body);
  const head_id = req.body.leader_id;
  const name = req.body.division_name;
  if (!name) {
    return res.status(400).json({
      message: "Please provide division name properly",
    });
  } else if (!id) {
    return res.status(401).json({
      message: "Please provide sector properly",
    });
  } else if (!head_id) {
    return res.status(402).json({
      message: "Please provide leader properly",
    });
  }
  try {
    const division = await Division.findByPk(id);
    if (!division) {
      return res.status(404).json({ message: "division not found" });
    }
    await division.update({ name, sector_id, head_id });
    return res.status(200).json({ message: "Division updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// handle all roles
const handleGetAllDefaultRole = async (req, res) => {
  console.log("getting roles ....");
  try {
    const excludedValues = [
      process.env.ORGANIZATION_ADMIN,
      process.env.SECTOR_ADMIN,
    ];
    const roles = await Roles.findAll({
      where: {
        project_related: false,
        role_id: {
          [Sequelize.Op.notIn]: excludedValues,
        },
      },
    });
    return res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const handleGetAllUsersInDivision = async (req, res) => {
  console.log("users in certain division called");
  const id = req.params.id;
  try {
    const users = await Division.findAll({
      where: { division_id: id },
      include: [
        {
          model: User,
          as: "Users",
        },
      ],
      attributes: ["division_id", "name"],
    });
    console.log(users);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const assignUsersToDivision = async (req, res) => {
  const { division_id } = req.params;
  let { user_ids, is_division_leader } = req.body;

  console.log("Received body:", req.body);

  if (!division_id || !user_ids) {
    return res.status(400).json({ message: "Please provide a valid division_id and user_ids" });
  }

  try {
    const division = await Division.findByPk(division_id);
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Ensure user_ids is an array and flatten it
    if (!Array.isArray(user_ids)) {
      user_ids = [user_ids]; // Convert to array if it's a single ID
    } else {
      user_ids = user_ids.flat(Infinity); // Flatten nested arrays recursively
    }

    // Convert is_division_leader to boolean if it's a string
    if (typeof is_division_leader === "string") {
      is_division_leader = is_division_leader.toLowerCase() === "true";
    }

    // Check if the division already has a leader if assigning a leader
    if (is_division_leader) {
      const existingLeader = await User.findOne({
        where: {
          division_id: division_id,
          is_division_leader: true,
        },
      });

      if (existingLeader) {
        return res.status(400).json({ message: "This division already has a leader" });
      }
    }

    const updateResults = [];
    for (let user_id of user_ids) {
      user_id = user_id.trim(); // Ensure there are no leading/trailing spaces
      try {
        const user = await User.findByPk(user_id);

        if (user) {
          const updateData = { division_id };
          if (is_division_leader !== undefined) {
            updateData.is_division_leader = is_division_leader;
          }
          await user.update(updateData);
          console.log(`User ${user_id} updated with:`, updateData);
          updateResults.push({ user_id, success: true });
        } else {
          console.error(`User with ID ${user_id} not found`);
          updateResults.push({ user_id, success: false, message: `User with ID ${user_id} not found` });
        }
      } catch (error) {
        console.error(`Error updating user with ID ${user_id}:`, error);
        updateResults.push({ user_id, success: false, message: error.message });
      }
    }

    const failedUpdates = updateResults.filter(result => !result.success);

    if (failedUpdates.length === 0) {
      return res.status(200).json({ message: "Users successfully assigned to the division" });
    } else if (failedUpdates.length === user_ids.length) {
      return res.status(400).json({ message: "None of the users could be assigned to the division", errors: failedUpdates });
    } else {
      return res.status(207).json({ message: "Some users could not be assigned to the division", errors: failedUpdates });
    }
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  handleGetAllUsersInDivision,
  handleGetAllDefaultRole,
  handleNewDivision,
  handleGetAllDivision,
  handleGetDivisionById,
  handleUpdateDivision,
  assignUsersToDivision,
};
