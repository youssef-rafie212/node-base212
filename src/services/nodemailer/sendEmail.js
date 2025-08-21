import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log("📧 Sending email to:", to);
        console.log("EMAIL HOST:", process.env.EMAIL_HOST);
        console.log("EMAIL USER:", process.env.EMAIL_USER);
        console.log("EMAIL PASS:", process.env.EMAIL_PASS);
        console.log("EMAIL PORT:", process.env.EMAIL_PORT);
        console.log("EMAIL SECURE:", process.env.EMAIL_SECURE);


        // Send email
        const info = await transporter.sendMail({
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`,
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
