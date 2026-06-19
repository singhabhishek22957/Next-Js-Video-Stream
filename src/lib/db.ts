import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;
const MONGO_DB = process.env.MONGO_DB!;

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    if (isConnected) return;

    const conn = await mongoose.connect(
      `${MONGO_URL}${MONGO_DB}`
    );

    isConnected = conn.connections[0].readyState === 1;

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};