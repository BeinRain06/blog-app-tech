const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  secret: {
    type: String,
  },
  registrationDate: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
