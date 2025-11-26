import Tenant from "../models/tennants.model.js";
import User from "../models/User.model.js";

const addTennant = async (req, res) => {
  const { clubName, subDomain, plan, status, metadata } = req.body;
  // TODO: input validation

  try {
    const tenant = await Tenant.create({
      clubName,
      subDomain,
      plan,
      status,
      metadata,
    });

    return res
      .status(201)
      .json({ success: true, message: "tenant has been added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getAllTennants = async (req, res) => {
  try {
    const tenants = await Tenant.find({});
    return res.json({ success: true, tenants });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const createClubAdmin = async (req, res) => {
  try {
    const { username, email, role, clubName, password } = req.body;
    const club = await Tenant.findOne({ clubName });
    if (!club) {
      return res.json({ success: false, message: "invalid club" });
    }

    const clubAdmin = await User.create({
      username,
      email,
      role,
      password,
    });

    await Tenant.updateOne(
      { clubName },
      {
        $set: {
          clubAdmin: clubAdmin._id,
        },
      }
    );

    return res.json({
      success: true,
      message: "club admin created successfully ",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getAllClubAdmins = async (req, res) => {
  try {
    const clubAdmins = await User.find({});
    return res.json({ clubAdmins });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export { addTennant, getAllTennants, createClubAdmin, getAllClubAdmins };
