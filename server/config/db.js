import mongoose from "mongoose"; 

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI); 
    console.log(`Mongodb connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed ${error.message}`)
    process.exit(1); 
  }
}

export default connectDb; 