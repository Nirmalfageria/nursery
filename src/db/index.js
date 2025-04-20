import mongoose from "mongoose";
const DB_NAME = "nursery"

const DbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
    });

    console.log(`\n Database connected successfully`);
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};

export default DbConnect;
