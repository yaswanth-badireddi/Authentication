import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemp.js";
import { transporter, sender } from "./nodemailer.config.js";

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const subject = "Verify your email";
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken
  );

  return sendMail({ to: email, subject, html });
};

export const sendWelcomeEmail = async (email, name) => {
  const subject = "Welcome to our service!";
  const html = `
    <h2>Hello ${name}!</h2>
    <p>Welcome to Test_Company_info_name. We're glad to have you here.</p>
  `;

  return sendMail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const subject = "Reset your password";
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  return sendMail({ to: email, subject, html });
};

export const sendResetSuccessEmail = async (email) => {
  const subject = "Password reset successful";
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

  return sendMail({ to: email, subject, html });
};
