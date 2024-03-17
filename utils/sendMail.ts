require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs, { Template } from 'ejs';
import path from 'path';

interface emailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any }
}

export const sendMail = async (options: emailOptions): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const { email, subject, template, data } = options;

    const templatePath = path.join(__dirname, '../mails', template);

    const html: string = await ejs.renderFile(templatePath, data);


}