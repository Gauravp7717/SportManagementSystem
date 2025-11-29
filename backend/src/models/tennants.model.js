<<<<<<< Updated upstream
import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    clubName: {
=======
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
>>>>>>> Stashed changes
      type: String,
      required: true,
      unique: true,
    },
<<<<<<< Updated upstream
    clubAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subDomain: {
=======

    subdomain: {
>>>>>>> Stashed changes
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO", "ENTERPRISE"],
      default: "FREE",
      required: true,
    },
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
<<<<<<< Updated upstream
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Virtual for reverse lookup (Tenant -> User admin)
tenantSchema.virtual("admin", {
  ref: "User",
  localField: "clubAdmin",
  foreignField: "_id",
  justOne: true,
});

tenantSchema.set("toJSON", { virtuals: true });
tenantSchema.set("toObject", { virtuals: true });

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;
=======

    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible JSON object
      default: {},
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Tenant", tenantSchema);
>>>>>>> Stashed changes
