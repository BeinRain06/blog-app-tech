const express = require("express");
const path = require("path");
const User = require("../models/user");
const Post = require("../models/post");
const router = express.Router();
const cookie = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const {
  requestInitUser,
  requestLoginByEmail,
} = require("../protect-api/authenticate-helper-user");

const { generateToken } = require("../protect-api/authorization-jwt");

const { checkPrevToken } = require("../protect-api/check-token");

//subdirectory requiry .env variable( file located in root directory)
require("dotenv").config({ path: path.join(__dirname, "..") });

router.use(cookie());

router.use(express.urlencoded({ extended: false }));

router.use(
  cors({
    origin: [
      "https://blog-app-server-tech.vercel.app",
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

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

    res.status(200).json({ success: true, data: postsInfos });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", requestInitUser, requestLoginByEmail, async (req, res) => {
  try {
    const userProceed = req.requestLoginByEmail;

    // console.log("login-route --userProceed-- :", userProceed);

    // first case
    if (
      userProceed.message === "error" &&
      userProceed.error === "user not found"
    ) {
      return res.status(404).json({ success: false, data: null });
    }

    if (
      userProceed.message === "error" &&
      userProceed.error === "wrong password"
    ) {
      return res.status(301).json({ success: false, data: null });
    }

    // second case - update all token
    if (userProceed.message === "update all tokens before sending data") {
      return res.status(200).json({ success: true, data: userProceed });
    }

    // third case - send to client-side

    const maxAge = 6 * 60 * 60; // in sec

    const allUserPost = await Post.find().populate("author", "username");

    const filterPost = allUserPost.filter(
      (item) => item.author.id === userProceed.userId
    );

    const userInCookie = {
      userId: userProceed.userId,
      userName: userProceed.userName,
      userEmail: userProceed.userEmail,
      access_token: userProceed.access_token,
      admin: userProceed.admin,
    };

    res.cookie("userInfo", JSON.stringify(userInCookie), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    let newUserProceed = { ...userProceed, numberOfPosts: filterPost.length };

    res.status(200).json({ success: true, data: newUserProceed });
  } catch (err) {
    console.log(err);
  }
});

router.put("/tokens/update/:userId", async (req, res) => {
  const userPrimarInfo = req.body;

  const userCatch = {
    userId: userPrimarInfo.userId,
    userName: userPrimarInfo.userName,
    userEmail: userPrimarInfo.userEmail,
    admin: userPrimarInfo.admin,
    access_token: userPrimarInfo.access_token,
  };

  // console.log("update-token --userCatch :", userCatch);

  const { access_token, ...newUserCatch } = userCatch;

  const stringAdmin = userPrimarInfo.admin ? "admin" : "common";

  const new_access_token = await generateToken(
    newUserCatch,
    stringAdmin,
    "access"
  );

  const new_refresh_token = await generateToken(
    newUserCatch,
    stringAdmin,
    "refresh"
  );

  // encrypt refresh_toen
  const newRefreshTokenHash = bcrypt.hashSync(`${new_refresh_token}`, 10); //10 autogen salt & hash

  try {
    await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { refresh_token: newRefreshTokenHash } },
      { new: true }
    );

    const maxAge = 6 * 60 * 60; // in sec

    const allUserPost = await Post.find({ author: req.params.userId });

    const numbersPost = allUserPost.length;

    userCatch.access_token = new_access_token;

    const userInCookies = userCatch;

    res.cookie("userInfo", JSON.stringify(userInCookies), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    newUserCatch.postsCount = numbersPost;

    res.status(200).json({ success: true, data: newUserCatch });
  } catch (err) {
    console.error(err);
  }
});

router.put("/admin/auth", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userName = req.body.userName;
    const secret = req.body.secret;

    if (process.env.admin_secret !== secret) {
      return res.status(400).json({
        success: false,
        data: {
          error: "not authorized",
        },
      });
    }

    const userInfo = JSON.parse(req.cookies.userInfo);

    // console.log("login-route --cookiesFetch-- :", userInfo);

    const { access_token, ...userCatch } = userInfo;

    const new_access_token = await generateToken(userCatch, "admin", "access");

    const new_refresh_token = await generateToken(
      userCatch,
      "admin",
      "refresh"
    );

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          admin: true,
          refresh_token: new_refresh_token,
        },
      },
      { new: true }
    );

    const maxAge = 6 * 60 * 60; // in sec

    const userInCookies = {
      ...userInfo,
      access_token: new_access_token,
      admin: user.admin,
    };

    res.cookie("userInfo", JSON.stringify(userInCookies), {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    const newUserInfo = {
      userId: user.id,
      userName: user.username,
      userEmail: user.email,
      admin: user.admin,
      access_token: new_access_token,
    };

    res.status(200).json({ success: true, data: newUserInfo });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
