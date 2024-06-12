const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/user");

require("dotenv").config({ path: path.join(__dirname, "..") });

const requestInitUser = async function (req, res, next) {
  const userDetails = req.body;
  const userAttribute = await User.findOne({ email: userDetails.email });
  if (!userAttribute) {
    throw new Error("user not Found");
  }

  const checkPwd = bcrypt.compareSync(
    userDetails.password,
    userAttribute.password
  );

  if (!checkPwd) {
    throw new Error("wrong password ");
  }

  let admin = false;

  if (userDetails.secret === process.env.admin_secret && userAttribute.admin) {
    const check =
      userDetails.secret === process.env.admin_secret ? true : false;

    admin = check;
  }

  const sendingUser = {
    id: userAttribute.id,
    username: userAttribute.username,
    email: userAttribute.email,
    admin: admin,
  };

  req.requestInitUser = sendingUser;

  next();
};

module.exports = requestInitUser;
