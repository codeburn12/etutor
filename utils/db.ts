// Importing the mongoose library for MongoDB connection
import mongoose from "mongoose";
// Loading environment variables from a .env file
require("dotenv").config();

// Retrieve the MongoDB connection URL from the environment variables
const dbUrl: string = process.env.DB_URL || '';

// Function to connect to MongoDB database asynchronously
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database
        await mongoose.connect(dbUrl).then((data: any) => {
            // Log a success message if the connection is established
            console.log(`MongoDB connected with ${data.connection.host}`);
        });
    } catch (error: any) {
        // Log an error message if connection fails
        console.log(error.message);
        // Retry connecting after a delay of 3 seconds (3000 milliseconds)
        setTimeout(connectDB, 3000);
    }
}

// Export the connectDB function as default
export default connectDB;
