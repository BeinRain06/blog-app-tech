const User = require("../models/user");
const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
const { generateToken } = require("../protect-api/authorization-jwt");

const router = express.Router();

router.use(cookie());

router.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://blog-app-server-tech.vercel.app",
    ],
    credentials: true,
  })
);

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  const user = req.user;
  const newUser = req.body.user;
  const ab = req.cookie;

  res.status(200).json({ success: true, data: user });
});

router.post("/", async (req, res) => {
  try {
    const userCatch = {
      userEmail: req.body.email,
      userName: req.body.username,
      password: req.body.password,
    };

    // console.log("register-route-userCatch :", userCatch);

    const checkExistUser = await User.findOne({ email: userCatch.userEmail });

    // console.log("register-checkExistUser :", checkExistUser);

    if (checkExistUser) {
      const collected = null;
      return res.json({ success: true, data: collected });
    }

    // encrypt password
    const passwordHash = bcrypt.hashSync(`${userCatch.password}`, 10); //10 autogen salt & hash

    /* let secret; */

    //generate refresh_token & access_token

    let refresh_token, access_token;
    const { password, ...newUserCatch } = userCatch;

    //refresh_token
    refresh_token = await generateToken(newUserCatch, "common", "refresh");

    // encrypt refresh_token
    const refreshTokenHash = bcrypt.hashSync(`${refresh_token}`, 10); //10 autogen salt & hash

    //access_token
    access_token = await generateToken(newUserCatch, "common", "access");

    let date = format(new Date(), "dd, MMMM yyyy");

    let user = new User({
      email: userCatch.userEmail,
      username: userCatch.userName,
      password: passwordHash,
      admin: false,
      refresh_token: refreshTokenHash,
      registrationDate: date,
    });

    user = await user.save();

    //send session_token in cookie
    const userId = user.id;
    const maxAge = 6 * 60 * 60; // in sec

    const userInCookie = {
      userId: user.id,
      userName: user.username,
      access_token: access_token,
      admin: false,
      userEmail: user.email,
    };

    res.cookie("userInfo", JSON.stringify(userInCookie), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    const newUserInfo = {
      userName: user.username,
      userId: userId,
      admin: false,
    };

    //send final json response (with access_token inside)
    res.json({ success: true, data: newUserInfo });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
