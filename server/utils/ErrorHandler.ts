// Define a custom error handler class that extends the built-in Error class
class ErrorHandler extends Error {
    statusCode: number; // Property to hold the HTTP status code associated with the error

    // Constructor for the ErrorHandler class
    constructor(message: any, statusCode: number) {
        // Call the constructor of the parent class (Error) with the error message
        super(message);
        // Set the statusCode property of the instance to the provided status code
        this.statusCode = statusCode;
        // Capture the stack trace for the error
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the ErrorHandler class as default
export default ErrorHandler;
