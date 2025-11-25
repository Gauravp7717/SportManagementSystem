import mongoose from "mongoose";

export async function connectDB() {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB_URI}/sport-management-system`
    );

    console.log("Connected to", response.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }
}

export default connectDB;
