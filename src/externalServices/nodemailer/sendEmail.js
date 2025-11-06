import nodemailer from "nodemailer";
import { EmailConfig } from "../../../config/index.js";

// send emails using nodemailer
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // create a transporter
        const transporter = nodemailer.createTransport({
            host: EmailConfig.host,
            port: EmailConfig.port,
            secure: EmailConfig.secure,
            auth: {
                user: EmailConfig.user,
                pass: EmailConfig.password,
            },
        });

        // send the email
        const info = await transporter.sendMail({
            from: `"${EmailConfig.from}" <${EmailConfig.user}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email send error:", error);
        throw error;
    }
};

export default sendEmail;
