import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoDBUri =
      process.env.MONGODBURI || "mongodb://localhost:27017/pennywise";

    const connection = await mongoose.connect(mongoDBUri);

    console.log("======================================");
    console.log("MongoDB Connected Successfully");
    console.log(`Database: ${connection.connection.name}`);
    console.log(`Host: ${connection.connection.host}`);
    console.log("======================================");
  } catch (error) {
    console.error("======================================");
    console.error("MongoDB connection Error", error);
    console.error("======================================");
    process.exit(1);
  }
};

export default connectDB;
