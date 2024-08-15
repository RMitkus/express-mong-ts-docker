import mongoose from "mongoose";

const environment = {
  mongodbUri: process.env.MONGODB_URI,
  port: process.env.PORT,
};

export const connectDatabase = () => {
  mongoose.connect(environment.mongodbUri as string);

  mongoose.connection.on("error", (err) => {
    console.error("Mongoose connection error caught", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
  });
};
