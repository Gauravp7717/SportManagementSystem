import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    clubName: {
      type: String,
      required: true,
      unique: true,
    },
    clubAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    subDomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO", "ENTERPRISE"],
      default: "FREE",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
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
