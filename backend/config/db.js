import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB Connected");
    });

    mongoose.connection.on("error", (err) => {
      console.log("MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB Disconnected");
    });

    const mongoUrl = process.env.MONGODB_URL.replace(/\/$/, '');
    await mongoose.connect(`${mongoUrl}/problemRegPortal`);
  } catch (error) {
    console.log("Error connecting DB:", error);
  }
};
