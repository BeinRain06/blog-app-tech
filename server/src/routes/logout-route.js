const express = require("express");

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post("/", (req, res) => {
  const prevCookie = req.cookies.userInfo;
  console.log("prev cooki username:", prevCookie.userName);

  res.status(200).json({ success: true, data: `${prevCookie.userName}` });
});

module.exports = router;
