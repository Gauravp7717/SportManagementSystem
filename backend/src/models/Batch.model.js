import mongoose from "mongoose";

const batchSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
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
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
export default Batch;
