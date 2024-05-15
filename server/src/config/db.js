const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".."),
});

const connectDB = async () => {
  const url_mongo = await mongoose.connect(process.env.MONGO_URL);

  console.log(`MongoDB Connected: ${url_mongo.connection.host}`);
};

mongoose.set("strictQuery", true);

module.exports = connectDB;
