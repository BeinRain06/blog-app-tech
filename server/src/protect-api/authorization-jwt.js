const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookie = require("cookie-parser");
const jwtPrivateKey = path.resolve("") + "/keys/private_key.pem";
const jwtPublicKey = path.resolve("") + "/keys/public_key.pem";
const jwtPrivateFakeKey = path.resolve("") + "/keys/private_key_fake.pem";

require("dotenv").config({ path: path.join(__dirname, "..") });

module.exports.generateToken = async function (payload, type, label) {
  const token = await JWTSign(payload, type, label);
  return token;
};

// allowInsecureKeySizes: true;
function JWTSign(payload, type, label) {
  const options =
    label === "session"
      ? { algorithm: "RS256", expiresIn: "6h" }
      : { algorithm: "RS256", expiresIn: "15m" };

  const userEmail = payload.email;

  if (type === "common") {
    return new Promise((resolve, reject) => {
      try {
        /* const secret = process.env.common_secret; */
        const secret = fs.readFileSync(jwtPrivateFakeKey);
        const token = jwt.sign({ userEmail: payload.email }, secret, options);
        console.log("token token 1:", token);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  } else {
    return new Promise((resolve, reject) => {
      try {
        const secret = fs.readFileSync(jwtPrivateKey);
        const token = jwt.sign({ userEmail: payload.email }, secret, options);
        console.log("token token 2:", token);
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports.getPayloadFromToken = async function (token, label) {
  const payload = await JWTVerify(token, label);
  return payload;
};

module.exports.verifyToken = async function (token, label) {
  const result = await JWTVerify(token, label);
  return result;
};

// allowInsecureKeySizes: true;
function JWTVerify(token, label) {
  const options =
    label === "session"
      ? { algorithm: "RS256", expiresIn: "6h" }
      : { algorithm: "RS256", expiresIn: "15m" };

  console.log("out token:", token);

  return new Promise((resolve, reject) => {
    try {
      const secret = fs.readFileSync(jwtPublicKey);
      const result = jwt.verify(token, secret, options);
      console.log("token token out :", token);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports.errorToken = function (msgErr) {
  throw new Error(msgErr);
};
