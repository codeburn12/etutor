// Loading environment variables from a .env file
require('dotenv').config();

// Importing the Express application instance from the app.js file
import { app } from './app';

// Importing cloudinary v2 for image handling
import { v2 as cloudinary } from 'cloudinary';

// Configuring cloudinary with API credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY, // Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY, // Cloudinary API secret key
});

// Importing the connectDB function from the db.js file
import connectDB from './utils/db';

// Create Server
// Starting the Express server and connecting to the database
app.listen(process.env.PORT, () => {
    // Logging a message to indicate that the server is listening on the specified port
    console.log(`Listening on PORT ${process.env.PORT}`);

    // Connecting to the database
    connectDB();
});
