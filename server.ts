// Importing the Express application instance from the app.js file
import { app } from './app';

// Importing the connectDB function from the db.js file
import connectDB from './utils/db';

// Loading environment variables from a .env file
require('dotenv').config();

// Create Server
// Starting the Express server and connecting to the database
app.listen(process.env.PORT, () => {
    // Logging a message to indicate that the server is listening on the specified port
    console.log(`Listening on PORT ${process.env.PORT}`);

    // Connecting to the database
    connectDB();
})
