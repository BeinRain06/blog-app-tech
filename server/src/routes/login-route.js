const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
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

router.use(
  "/",
  createProxyMiddleware({
    target: "https://blog-app-server-tech.vercel.app/blogtech/api/login",
    changeOrigin: true,
  })
);

router.use(
  "/admin/authors-theme",
  createProxyMiddleware({
    target: "https://blog-app-server-tech.vercel.app/blogtech/api/login",
    changeOrigin: true,
  })
);

router.use(
  "/redirect",
  createProxyMiddleware({
    target: "https://blog-app-server-tech.vercel.app/blogtech/api/login",
    changeOrigin: true,
  })
);

router.use(
  "/admin/auth",
  createProxyMiddleware({
    target: "https://blog-app-server-tech.vercel.app/blogtech/api/login",
    changeOrigin: true,
  })
);

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

    res.status(200).json({ success: true, data: postsInfos });
  } catch (err) {
    console.log(err);
  }
});

router.post("/", requestInitUser, async (req, res) => {
  try {
    const user = req.requestInitUser;
    const newUserInfo = await applyNewToken(user, "standard");

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

    if (prevCookie !== undefined) {
      const userId = prevCookie.userId;
      const userFetch = await User.findById(userId).select("-password");

      const session_token = prevCookie.session_token;
      const access_token = req.body.access;

      if (session_token) {
        // ==> ==>
        const newUserInfo = await checkPrevToken(
          userFetch,
          session_token,
          access_token
        );

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

    if (!user.admin) {
      return res.status(200).json({ success: false, data: "null" });
    }

    const newUserInfo = await applyNewToken(user, "admin");

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
