const express = require("express");
const path = require("path");
const User = require("../models/user");
const Post = require("../models/post");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requestInitUser = require("../protect-api/authenticate-pwd-user");
const {
  verifyFakeToken,
  verifyToken,
  errorToken,
} = require("../protect-api/authorization-jwt");

const { checkPrevToken } = require("../protect-api/check-token");

const {
  applyNewToken,
  checkAccessToken,
} = require("../protect-api/renew-token");

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(express.urlencoded({ extended: false }));

router.get("/admin/authors-themes", async (req, res) => {
  try {
    const allPosts = await Post.find()
      .populate("author", "username")
      .sort({ date: -1 });

    const postsInfos = allPosts.reduce((acc, val) => {
      const obj = {
        theme: val.title,
        author: val.author,
      };
      acc.push(obj);
      return acc;
    }, []);

    console.log("postsInfos:", postsInfos);

    res.status(200).json({ success: true, data: postsInfos });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", requestInitUser, async (req, res) => {
  try {
    const user = req.requestInitUser;
    const newUserInfo = await applyNewToken(user, "standard");

    console.log("new New User:", newUserInfo);

    const maxAge = 6 * 60 * 60; // in sec

    res.cookie(
      "userInfo",
      {
        userId: newUserInfo.id,
        userName: newUserInfo.username,
        session_token: newUserInfo.session,
      },
      {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }
    );

    res.status(200).json({ success: true, data: newUserInfo });
  } catch (err) {
    console.log(err);
  }
});

router.post("/redirect", async (req, res) => {
  try {
    const prevCookie = req.cookies.userInfo;

    console.log("req cookies:", req.cookies);

    if (prevCookie !== undefined) {
      const userId = prevCookie.userId;
      const userFetch = await User.findById(userId).select("-password");

      const session_token = prevCookie.session_token;
      const access_token = req.body.access;

      /* console.log("access_token:", access_token);

      if (access_token === null) {
        return res.status(200).json({ success: true, data: "null" });
      } */

      if (session_token) {
        // ==> ==>
        const newUserInfo = await checkPrevToken(
          userFetch,
          session_token,
          access_token
        );

        console.log("user new :", newUserInfo);

        if (newUserInfo === "null" || newUserInfo === undefined) {
          return res.status(200).json({ success: true, data: "null" });
        }

        return res.status(200).json({ success: true, data: newUserInfo });
      }
    } else {
      //prevCookie === undefined
      return res.status(200).json({ success: true, data: "null" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/admin/auth", requestInitUser, async (req, res) => {
  try {
    const user = req.requestInitUser;

    console.log("user req.requestInitUser:", user);

    if (!user.admin) {
      return res.status(200).json({ success: false, data: "null" });
    }

    const newUserInfo = await applyNewToken(user, "admin");

    console.log("newUserInfo:", newUserInfo);

    const maxAge = 6 * 60 * 60; // in sec

    res.cookie(
      "userInfo",
      {
        userId: newUserInfo.id,
        userName: newUserInfo.username,
        session_token: newUserInfo.session,
      },
      {
        httpOnly: true,
        maxAge: maxAge * 1000,
      }
    );

    res.status(200).json({ success: true, data: newUserInfo });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
