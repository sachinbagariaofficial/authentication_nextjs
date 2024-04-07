const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../Model/userModel");
const bcryptjs = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../helper/sendEmail");

// ********** Middleware for form validation using express-validator **********
const formValidationMiddleware = [
  // Validate username length
  body("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long")
    .optional(),
  // Validate email format
  body("email").trim().isEmail().withMessage("Please enter a valid email"),
  // Validate password length
  body("password")
    .trim()
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long"),
];

// ********** Signup Api router **********
router.post("/signup", formValidationMiddleware, async (req, res) => {
  try {
    let { username, password, email } = req.body;

    // Validate input data using the defined formValidationMiddleware
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: validationErrors.array(), status: false });
    }

    // Check if user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User with this email already exists.",
        status: false,
      });
    }

    // Hash the password before saving it to the database
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    // Create a new user object with hashed password and save it to the database
    const newUser = new User({ username, email, password: hashPassword });
    const savedUser = await newUser.save();

    // Send verification email to the user
    await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });

    return res.status(201).json({
      message: "User created successfully.",
      user: savedUser,
      status: true,
    });
  } catch (error) {
    console.error("Error while signing up:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      status: false,
    });
  }
});

// ********** Login endpoint **********
router.post("/login", formValidationMiddleware, async (req, res) => {
  try {
    const { email, password } = req.body;
    const validationErrors = validationResult(req);

    // Validate input data using the defined formValidationMiddleware
    if (!validationErrors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: validationErrors.array(), status: false });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(400).json({
        message: "User does not exist",
        status: false,
      });
    }

    // ********** Check if the user's email is verified **********

    if (!userExists.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        status: false,
      });
    }

    // Compare the provided password with the hashed password in the database
    const validPassword = await bcryptjs.compare(password, userExists.password);

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid password",
        status: false,
      });
    }

    // Generate JWT token for authenticated user
    const tokenData = {
      id: userExists._id,
      email: userExists.email,
      password: userExists.password,
    };
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });

    // Set token in a cookie and send response
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login Successfully",
      status: true,
    });
  } catch (error) {
    console.error("Error while signing up:", error);
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
      status: false,
    });
  }
});

// ********** Endpoint for verifying email **********
router.post("/verifyemail", async (req, res) => {
  try {
    const { token } = req.body;

    // Find the user with the verification token and check its validity
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gte: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        status: false,
      });
    }

    // Mark user as verified and remove verification token
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
      status: false,
    });
  }
});

// ********** Endpoint for logout email **********
router.get("/logout", async (req, res) => {
  try {
    // Remove token in a cookie and send response
    res.cookie("token", "", {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Logout Successfully",
      status: true,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong. Please try again later.",
      status: false,
    });
  }
});

module.exports = router;
