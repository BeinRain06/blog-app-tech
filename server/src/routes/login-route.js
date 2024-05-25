const express = require("express");
const path = require("path");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requestInitUser = require("../protect-api/authenticate-pwd-user");
const authWithJwt = require("../protect-api/authorization-jwt");
const User = require("../models/user");

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(express.urlencoded({ extended: false }));

router.post("/", requestInitUser, async (req, res) => {
  try {
    const secret = process.env.common_secret;

    const session_token = jwt.sign(
      { userEmail: userDetails.email, userToken: userAttribute.secret },
      secret,
      {
        expiresIn: "6h",
      }
    );

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

router.post("/admin/init", requestInitUser, async (req, res) => {
  try {
    const userDetails = req.body;

    const userIn = req.requestInitUser;

    res.status(200).json({ success: true, data: userIn });
  } catch (err) {
    console.log(err);
  }
});

const authWithJwtZero = async function (err, req, res, next) {
  const admin_secret = process.env.admin_secret;

  console.log("req here:", req.body);

  return expressjwt({
    secret: GetVerificationKey(next),
    algorithm: ["HS256"],
    /*  onExpired: onExpired,
    IsRevoked: IsRevoked, */
  });
};

const GetVerificationKey = async function (req, payload, next) {
  const user = req.body;
  const admin_secret = process.env.admin_secret;
  const access_token = req.body.access_token;
  console.log("payload GetVerificationKey:", payload);
  console.log("admin_secret:", admin_secret);
  console.log("access_token", access_token);
  console.log("user:", user);

  next();
};

router.post("/admin/auth", authWithJwtZero, async (req, res) => {
  try {
    const userInfo = req.body;
    console.log("userInfo:", userInfo);

    let newObj;
    let success;
    /* const checkedToken = jwt.verify(
      userInfo.access_token,
      secret,
      function (err, decoded) {
        if (err.name === "TokenExpiredError") {
        } else if (
          err.name === "JsonWebTokenError" ||
          err.name === "NotBeforeError"
        ) {
          throw new Error(`wrong token -Err: ${err.name}`);
        }

        console.log("decoded userAccess :", decoded.userAccess);

        if (decoded.userAccess !== undefined) {
          newObj = {
            success: true,
            data: {},
          };
        } else {
          newObj = {
            success: false,
            data: {},
          };
        }
      }
    ); */

    /*  res.status(200).json({ success: true, data: newUser }); */
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
