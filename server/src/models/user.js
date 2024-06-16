const mongoose = require("mongoose");
const format = require("date-fns/format");

// format style : "D MMM YYYY, at HH:mm"

// format(new Date(), "DD, MMM YYYY")

// format(new Date(), "D MMM YYYY, at HH:mm")

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
  registrationDate: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("User", userSchema);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
userSchema.set("toJSON", { virtuals: true });

module.exports = User;

exports.userSchema = userSchema;
