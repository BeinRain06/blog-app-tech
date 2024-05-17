const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const User = require("../models/user");
const { format } = require("date-fns");

const router = express.Router();

router.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  })
);

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  const user = req.user;
  const newUser = req.body.user;

  console.log(user);
  console.log(newUser);

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

    // encrypt password
    const salt = bcrypt.genSalt(10);
    const passwordHash = bcrypt.hashSync(userCatch.password, 10); //10 autogen salt
    let secret;

    //generate session_token
    const userEmail = userCatch.email;
    const userName = userCatch.username;
    if (userCatch.secret === process.env.admin_secret) {
      secret = user.secret;
    } else {
      secret = process.env.common_secret;
    }

    const session_token = jwt.sign({ userEmail: userCatch.email }, secret, {
      expiresIn: "2d",
    });

    const access_token = jwt.sign(
      { userToken: userEmail.concat(userName) },
      secret,
      {
        expiresIn: "10w",
      }
    );

    let date = format(new Date(), "dd, MMMM yyyy");

    console.log("date:", date);

    let user = new User({
      email: userCatch.email,
      username: userCatch.username,
      password: passwordHash,
      secret: access_token,
      registrationDate: date,
    });

    user = await user.save();

    console.log("user saved :", user.username);

    //send cookies
    const userId = user.id;
    const maxAge = 2 * 24 * 60 * 60; // in sec
    res.cookie("userInfo", [userId, userName, session_token], {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    //send final json response
    res.json({ success: true, data: user.username });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
