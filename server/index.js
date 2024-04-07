const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./dbConfig/dbConnect");
const routes = require("./routes/routes");
const rateLimit = require('express-rate-limit');
const cors = require("cors");
require("dotenv").config();

// ********** Initialize Express application **********
const app = express();

// ********** Enable CORS with credentials **********
app.use(cors({ credentials: true, origin: true }));

// ********** Connect to the MongoDB database **********
connectDB();

// ********** Define the port for the server **********
const port = process.env.PORT || 5000;

// ********** Rate limiter middleware to limit API requests **********
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// ********** Parse JSON request bodies **********
app.use(express.json());

// ********** Apply rate limiter to the "/api" route **********
app.use("/api", apiLimiter);

// ********** Define routes for the API **********
app.use("/api", routes);

// ********** Start the server **********
app.listen(port, () => {
    console.log(`Server is running on ${port} port`);
});
