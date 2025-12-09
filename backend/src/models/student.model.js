import mongoose from "mongoose";

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

    email: {
      type: String,
      lowercase: true,
    },
    contact: {
      type: String,
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

    feeStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "PENDING"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
