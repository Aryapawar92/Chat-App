import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(uri);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    connection.on("error", (err) => {
      console.log("❌MongoDB connection error", err);
      //process.exit(1);
    });
  } catch (error) {
    console.error("❌Something went wrong in connecting the DB", error);
    //process.exit(1);
  }
};
