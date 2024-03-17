// Import necessary modules from Mongoose and bcrypt
import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from 'bcryptjs';

// Regular expression to validate email format
const emailRegex: RegExp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

// Interface defining the structure of the user document
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: {
        public_id: string;
        url: string;
    };
    role: string;
    isVerified: boolean;
    courses: Array<{ course_id: string }>;
    comparePassword: (password: string) => Promise<boolean>;
}

// Define the user schema
const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        validate: {
            validator: function (value: string) {
                return emailRegex.test(value);
            },
            message: "Please enter a valid email"
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false, // Password field will not be included in query results by default
    },
    avatar: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    courses: [{
        course_id: String,
    }],
}, { timestamps: true }); // Include timestamps for createdAt and updatedAt fields

// Middleware to hash the password before saving user document
userSchema.pre<IUser>('save', async function (next) {
    // Check if the password has been modified before hashing
    if (!this.isModified('password')) {
        return next();
    }
    // Hash the password using bcrypt with a salt rounds of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to compare entered password with the stored hashed password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    // Use bcrypt to compare the entered password with the hashed password
    return await bcrypt.compare(enteredPassword, this.password);
}

// Create the User model using the user schema
const userModel: Model<IUser> = mongoose.model("User", userSchema);

// Export the User model
export default userModel;
