// models/Batch.model.js - FIXED
import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    batchName: {
      // ✅ ADDED - Missing!
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      // ✅ ADDED - Missing!
      type: Number,
      required: true,
      min: 1,
    },
    batchStartTime: {
      type: String,
      required: true,
    },
    batchEndTime: {
      type: String,
      required: true,
    },
    sportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sport",
      required: true,
    },
    coaches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    schedule: {
      // ✅ FIXED: Changed to ARRAY
      type: [String], // Array of days ["Mon", "Tue"]
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one day must be selected",
      },
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
