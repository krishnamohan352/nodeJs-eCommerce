import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB");
        });
        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;