const express = require("express");

const cookie = require("cookie-parser");

const router = express.Router();
router.use(cookie());
router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  const prevCookie = req.cookies.userInfo;
  console.log("prevCookie:", prevCookie);

  // res.cookie("userInfo", null);

  res.status(200).json({ success: true, data: `${prevCookie.userName}` });
});

module.exports = router;
