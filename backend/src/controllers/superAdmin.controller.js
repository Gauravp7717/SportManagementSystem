import Tenant from "../models/tennants.model.js";
import User from "../models/User.model.js";

const addTennant = async (req, res) => {
  const { clubName, subDomain, plan, status, metadata } = req.body;

  try {
    const tenant = await Tenant.create({
      clubName,
      subDomain,
      plan,
      status,
      metadata,
    });

    return res.status(201).json({
      success: true,
      message: "tenant has been added successfully",
      data: tenant,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getAllTennants = async (req, res) => {
  try {
    const tenants = await Tenant.find({}).populate(
      "clubAdmin",
      "username email fullname"
    );
    return res.json({ success: true, tenants });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const createClubAdmin = async (req, res) => {
  try {
    const { username, email, fullname, role, clubName, password } = req.body;
    const club = await Tenant.findOne({ clubName });

    if (!club) {
      return res.json({ success: false, message: "invalid club" });
    }

    const clubAdmin = await User.create({
      username,
      email,
      fullname,
      role: role || "CLUB_ADMIN",
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

    // Return populated admin
    const adminWithClub = await User.findById(clubAdmin._id).populate("club");

    return res.json({
      success: true,
      message: "club admin created successfully",
      data: adminWithClub,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

const getAllClubAdmins = async (req, res) => {
  try {
    const clubAdmins = await User.find({ role: "CLUB_ADMIN" })
      .populate({
        path: "club",
        select: "clubName subDomain plan status",
        match: { clubAdmin: { $exists: true, $ne: null } },
      })
      .select("-password -refreshToken")
      .lean();

    return res.json({
      success: true,
      clubAdmins,
      count: clubAdmins.length,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export { addTennant, getAllTennants, createClubAdmin, getAllClubAdmins };
