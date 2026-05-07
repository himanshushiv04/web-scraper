import mongoose from "mongoose";

const connectDB = async () => {
  // console.log("DB URI:", process.env.DATABASE_URI);
  // console.log("DB NAME:", process.env.DB_NAME);
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URI}/${process.env.DB_NAME}`
    );
    console.log(`MongoDB connected!! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("Connection ERR: ", error);
    process.exit(1);
  }
};


export default connectDB;