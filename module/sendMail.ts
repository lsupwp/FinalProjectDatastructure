import nodemailer from 'nodemailer';

const sendMail = async (email: string, subject: string, text: string) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: subject,
            html: text
        });

        console.log('Email sent: ' + info.response);
        return true
    } catch (error) {
        console.error('Error sending email:', error);
        return false
    }
};

export default sendMail;