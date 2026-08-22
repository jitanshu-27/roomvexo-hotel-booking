import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("URI Length:", process.env.MONGODB_URI?.length);
        console.log("URI Prefix:", process.env.MONGODB_URI?.substring(0, 20));
        console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
        mongoose.connection.on("connected", () => {
            console.log("Database Connected");
        });

        await mongoose.connect(process.env.MONGODB_URI);

    } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
    }
};

export default connectDB;