const express = require("express");

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  const loginRoute = {
    name: "regis",
    password: "hihou",
  };

  res.status(200).json({ data: loginRoute });
});

module.exports = router;
