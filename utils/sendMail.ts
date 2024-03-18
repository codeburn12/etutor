// Import necessary modules
require('dotenv').config(); // Load environment variables from a .env file
import nodemailer, { Transporter } from 'nodemailer'; // Import nodemailer and Transporter type
import ejs, { Template } from 'ejs'; // Import ejs and Template type
import path from 'path'; // Import path module for file paths

// Define an interface for email options
interface emailOptions {
    email: string; // Recipient's email address
    subject: string; // Email subject
    template: string; // EJS template file name
    data: { [key: string]: any }; // Data to be passed to the EJS template
}

// Function to send email using nodemailer
export const sendMail = async (options: emailOptions): Promise<void> => {
    // Create a nodemailer Transporter instance
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, // SMTP server host
        port: parseInt(process.env.SMTP_PORT || '587'), // SMTP server port
        service: process.env.SMTP_SERVICE, // SMTP service provider (e.g., Gmail, Outlook, etc.)
        auth: {
            user: process.env.SMTP_MAIL, // SMTP email address
            pass: process.env.SMTP_PASSWORD, // SMTP password
        },
    });

    // Destructure options object
    const { email, subject, template, data } = options;

    // Get the file path of the EJS template
    const templatePath = path.join(__dirname, '../mails', template);

    // Render the EJS template with the provided data
    const html: string = await ejs.renderFile(templatePath, data);

    // Define mail options for nodemailer
    const mailOptions = {
        from: process.env.SMTP_MAIL, // Sender's email address
        to: email, // Recipient's email address
        subject, // Email subject
        html, // HTML content of the email
    };

    // Send the email using nodemailer
    await transporter.sendMail(mailOptions);
};

// Export the sendMail function as default
export default sendMail;
