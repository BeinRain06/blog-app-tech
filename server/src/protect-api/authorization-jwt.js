const jswebtok = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");
const cookie = require("cookie-parser");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..") });

const authWithJwtZero = async function (err, req, res, next) {
  const admin_secret = process.env.admin_secret;

  console.log("common secret:", common_secret);

  next();
  return expressjwt({
    secret: GetVerificationKey,
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

const authWithJwt = async function (err, req, res, next) {
  const admin_secret = process.env.admin_secret;

  console.log("common secret:", common_secret);

  const checkedToken = jwt.verify(
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
  );
  next();
};

module.exports = authWithJwt;
