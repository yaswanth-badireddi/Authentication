// nodemailer.config.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

export const sender = {
  email: process.env.USER,
  name: "yaswanth",
};
