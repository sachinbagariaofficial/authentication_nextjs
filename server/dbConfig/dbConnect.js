const mongoose = require("mongoose");


async function connectDB() {
  const monodbUrl = process.env.MONGO_DB_URL;

  try {
    mongoose.connect(monodbUrl);
    const connection = mongoose.connection;
    connection.once("connected", () => {
      console.log("MongoDB connected successfully");
    });
    connection.on("error", (err) => {
      console.error(`connection error: ${err}`);
    });
  } catch (err) {
    console.log("Something goes wrong!");
    console.error(err);
  }
}
 
module.exports = connectDB;