import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Sends an email to a candidate when they are shortlisted for a job.
 */
export const sendShortlistedEmail = async (
  toEmail: string,
  candidateName: string,
  jobTitle: string,
  companyName: string
) => {
  try {
    const mailOptions = {
      from: `"${companyName} (via Jagir)" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Congratulations! You've been shortlisted for ${jobTitle} at ${companyName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2563eb;">Great news, ${candidateName}!</h2>
          <p>We are thrilled to inform you that your application for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong> has been <strong>shortlisted</strong>.</p>
          <p>The hiring team was very impressed with your profile and skills.</p>
          <p><strong>What's next?</strong></p>
          <p>The HR team at ${companyName} will be in touch with you shortly regarding the next steps in the interview process. Keep an eye on your inbox and your Jagir messages!</p>
          <br />
          <p>Best of luck,</p>
          <p><strong>The Jagir Team</strong></p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
