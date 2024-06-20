const User = require("../models/user");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { format } = require("date-fns");
const { generateToken } = require("../protect-api/authorization-jwt");

const router = express.Router();

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
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      secret: req.body.secret,
    };

    const checkExistUser = await User.findOne({ username: userCatch.username });

    if (checkExistUser) {
      const collected = null;
      return res.json({ success: true, data: collected });
    }

    // encrypt password
    const passwordHash = bcrypt.hashSync(`${userCatch.password}`, 10); //10 autogen salt & hash
    let secret;

    //generate session_token & access_token
    const userName = userCatch.username;
    let session_token;
    let access_token;
    let admin = false;
    if (userCatch.secret === process.env.admin_secret) {
      secret = userCatch.secret;
      //session_token
      session_token = await generateToken(userCatch, "admin", "session");
      //access_token
      access_token = await generateToken(userCatch, "admin", "access");
      admin = true;
    } else {
      //session_token
      session_token = await generateToken(userCatch, "common", "session");
      //access_token
      access_token = await generateToken(userCatch, "common", "access");
      admin = false;
    }

    let date = format(new Date(), "dd, MMMM yyyy");

    let user = new User({
      email: userCatch.email,
      username: userCatch.username,
      password: passwordHash,
      admin: admin,
      registrationDate: date,
    });

    user = await user.save();

    //send session_tokies in cookie
    const userId = user.id;
    const maxAge = 6 * 60 * 60; // in sec

    res.cookie(
      "userInfo",
      { userId, userName, session_token },
      {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }
    );

    const collected = {
      username: user.username,
      userId: userId,
      access: access_token,
      admin: admin,
    };

    //send final json response (with access_token inside)
    res.json({ success: true, data: collected });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
