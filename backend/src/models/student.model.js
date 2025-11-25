const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    sports: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sport",
      },
    ],

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
    },

    feeStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "PENDING"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
