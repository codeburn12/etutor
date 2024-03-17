// Importing Redis from the ioredis library
import { Redis } from "ioredis";

// Loading environment variables from a .env file
require("dotenv").config();

// Function to initialize Redis client
const redisClient = () => {
    // Check if REDIS_URL environment variable is defined
    if (process.env.REDIS_URL) {
        // Log message indicating successful Redis connection
        console.log(`Redis connected`);
        // Return the Redis URL from the environment variable
        return process.env.REDIS_URL;
    }
    // If REDIS_URL is not defined, throw an error
    throw new Error(`Redis connection failed`);
}

// Create Redis instance using the Redis URL obtained from the redisClient function
export const redis = new Redis(redisClient());
