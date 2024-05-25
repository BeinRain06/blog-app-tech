const bcrypt = require("bcryptjs");
const User = require("../models/user");

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

  const sendingUser = {
    id: userAttribute.id,
    username: userAttribute.username,
    secret: userAttribute.secret,
  };

  req.requestInitUser = sendingUser;

  next();
};

module.exports = requestInitUser;
