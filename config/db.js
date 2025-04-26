import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGO_USER_DB}:${process.env.MONGO_PASSWORD_DB}@${process.env.MONGO_HOST_DB}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`
    );
    console.log("Conectado a Mongodb");
  } catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};

export default connectDB; 

