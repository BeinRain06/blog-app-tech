const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cookie = require("cookie-parser");

const router = express.Router();

router.use(
  "/",
  createProxyMiddleware({
    target: "https://blog-app-server-tech.vercel.app/blogtech/api/logout",
    changeOrigin: true,
  })
);

router.use(cookie());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  const prevCookie = req.cookies.userInfo;

  res.status(200).json({ success: true, data: `${prevCookie.userName}` });
});

module.exports = router;
