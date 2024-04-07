const nodemailer = require("nodemailer");
const bcryptjs = require("bcrypt");
const User = require("../Model/userModel");

// ********** Define the function to send emails **********
const sendEmail = async ({ email, emailType, userId }) => {
  try {
    // ********** Generate a hashed token using userId **********
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // ********** Update user document based on emailType **********
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // Token expiry time: 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // Token expiry time: 1 hour
      });
    }

    // ********** Create nodemailer transport **********
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILERUSER,
        pass: process.env.NODEMAILERPASS,
      },
    });

    // ********** Define email options **********
    const mailOptions = {
      from: "hitesh@gmail.com",
      to: email,
      subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<p>Click <a href="http://localhost:3000/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
        or copy and paste the link below in your browser. <br> http://localhost:3000/verifyemail?token=${hashedToken}
        </p>`,
    };

    // ********** Send the email **********
    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error) {
    // ********** Throw error if any exception occurs **********
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
