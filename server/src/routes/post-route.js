const express = require("express");
const compareAsc = require("date-fns/compareAsc");
const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  const loginRoute = {
    name: "posting",
    password: "hiwaouh",
  };

  res.status(200).json({ data: loginRoute });
});

module.exports = router;
