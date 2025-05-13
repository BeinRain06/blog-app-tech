const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/user");

require("dotenv").config({ path: path.join(__dirname, "..") });

const {
  verifyToken,
  generateToken,
} = require("../protect-api/authorization-jwt");

module.exports.requestInitUser = async function (req, res, next) {
  // request cookie userInfo in all cookies

  console.log("req.cookies :", req.cookies);

  const userCatch = req.body;

  if (!req.cookies.userInfo) {
    req.requestInitUser = {
      token_access: false,
      new_access_token: null,
      userId: null,
      userName: null,
      userEmail: null,
      admin: null,
      message: "proceed check with password",
    };

    return next();
  }

  const userInfo = JSON.parse(req.cookies.userInfo);

  if (userInfo.userEmail !== userCatch.email) {
    req.requestInitUser = {
      token_access: false,
      new_access_token: null,
      userId: null,
      userName: null,
      userEmail: null,
      admin: null,
      message: "proceed check with password",
    };

    return next();
  }

  // console.log("requestInitUser--userInfo:", userInfo);

  const access_token = userInfo.access_token;
  const isAdmin = userInfo.admin;
  const userId = userInfo.userId;
  const userName = userInfo.userName;
  const userEmail = userInfo.userEmail;

  // console.log("requestInitUser--access_token:", access_token);

  const checkAccessToken = await verifyToken(access_token, "access", isAdmin);

  // console.log("requestInitUser--checkAccessToken:", checkAccessToken);

  //access token still valid
  if (checkAccessToken.userEmail) {
    const stringAdmin = isAdmin ? "admin" : "common";
    const { access_token, ...newUserCatch } = userInfo;

    const new_access_token = await generateToken(
      newUserCatch,
      stringAdmin,
      "access"
    );

    req.requestInitUser = {
      token_access: true,
      new_access_token,
      userId,
      userName,
      userEmail,
      admin: isAdmin,
      message: "proceed with data",
    };

    return next();
  }

  req.requestInitUser = {
    token_access: false,
    new_access_token: null,
    userId,
    userName,
    userEmail,
    admin: isAdmin,
    message: "look firstly refresh_token valid",
  };

  next();
};

module.exports.requestLoginByEmail = async function (req, res, next) {
  // user obj from requestInitUser middleware
  const user = req.requestInitUser;

  console.log("req.requestInitUser :", user);

  let userRes = {
    success: false,
    userId: user.userId,
    userName: user.userName,
    userEmail: user.userEmail,
    admin: user.admin,
    access_token: user.new_access_token,
    error: "",
    message: "",
  };

  const userPrimarInfo = req.body; // password , Email

  // case you have to fetch user data again
  if (!user.token_access) {
    // case old access_token expired
    const userDataBase = await User.findOne({
      email: userPrimarInfo.email,
    });

    if (!userDataBase) {
      userRes.success = false;
      userRes.error = "user not found";
      userRes.message = "error";
      req.requestLoginByEmail = userRes;

      return next();
    }

    userRes.userId = userDataBase.id;
    userRes.userName = userDataBase.username;
    userRes.userEmail = userDataBase.email;
    userRes.admin = userDataBase.admin;

    const userToken = {
      userId: userDataBase.id,
      userName: userDataBase.username,
      userEmail: userDataBase.email,
      admin: userDataBase.admin,
    };

    switch (user.message) {
      case "proceed check with password":
        // do something

        const checkPwd = bcrypt.compareSync(
          userPrimarInfo.password,
          userDataBase.password
        );

        if (!checkPwd) {
          userRes.success = false;
          userRes.error = "wrong password ";
          userRes.message = "error";
        } else {
          userRes.success = true;
          userRes.error = "";
          userRes.message = "update all tokens before sending data";
        }

        break;
      case "look firstly refresh token valid":
        // do something

        const checkRefreshToken = verifyToken(
          userDataBase.refresh_token,
          "refresh",
          user.admin
        );

        if (checkRefreshToken.userEmail) {
          userRes.success = true;
          userRes.error = "";
          userRes.message = "send data to client side";
        } else {
          userRes.success = true;
          userRes.error = "";
          userRes.message = "update all tokens before sending data";
        }

        break;
      case "proceed with data":
        // do something
        userRes.success = true;
        userRes.error = "";
        userRes.message = "send data to client side";
        break;

      default:
        throw new Error("something wrong in requestLoginByEmail");
    }

    req.requestLoginByEmail = userRes;
    return next();
  } else {
    //case all access_token still valid
    userRes.success = true;
    userRes.error = "";
    userRes.message = "send data to client side";
    req.requestLoginByEmail = userRes;
    return next();
  }
};
