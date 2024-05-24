const express = require("express");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(express.urlencoded({ extended: false }));

router.post("/", async (req, res) => {
  try {
    const userDetails = req.body;
    console.log("userDetails:", userDetails);

    const userAttribute = await User.findOne({ email: userDetails.email });

    if (!userAttribute) {
      throw new Error("user not Found");
    }

    const checkPwd = bcrypt.compareSync(
      userDetails.password,
      userAttribute.password
    );

    if (!checkPwd) {
      throw new Error("wrong passord ");
    }
    const secret = process.env.common_secret;

    const session_token = jwt.sign({ userEmail: userDetails.email }, secret, {
      expiresIn: "6h",
    });

    const userId = userAttribute.id;
    const userName = userAttribute.username;
    const maxAge = 6 * 60 * 60; // in sec
    const maxAge2 = 30;
    res.cookie(
      "userInfo",
      { userId, userName, session_token },
      { httpOnly: true, maxAge: maxAge * 1000 }
    );

    res.status(200).json({ success: true, data: userName });
  } catch (err) {
    console.log(err);
  }
});

router.post("/redirect", (req, res) => {
  const prevCookie = req.cookies.userInfo;

  if (prevCookie !== undefined) {
    res.status(200).json({ success: true, data: prevCookie.userName });
  } else {
    res.status(200).json({ success: true, data: "null" });
  }
});

module.exports = router;
