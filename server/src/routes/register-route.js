const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { format } = require("date-fns");

const router = express.Router();

router.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173"],
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
    const passwordHash = bcrypt.hashSync(`${userCatch.password}`, 10); //10 autogen salt & hash
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
      expiresIn: "6h",
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

    /* console.log("req cookie:", req.cookies); */

    /* res.redirect("http://localhost:5173"); */

    //send cookies
    const userId = user.id;
    const maxAge = 6 * 60 * 60; // in sec
    const maxAge2 = 30;

    res.cookie(
      "userInfo",
      { userId, userName, session_token },
      {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }
    );

    //send final json response
    res.json({ success: true, data: user.username });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
