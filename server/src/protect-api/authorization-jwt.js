const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");
const cookie = require("cookie-parser");
const jwtPrivateKey = path.resolve("") + "/keys/private_key.pem";
const jwtPublicKey = path.resolve("") + "/keys/public_key.pem";
const jwtPublicFakeKey = path.resolve("") + "/keys/public_key_fake.pem";
const jwtPrivateFakeKey = path.resolve("") + "/keys/private_key_fake.pem";

require("dotenv").config({ path: path.join(__dirname, "..") });

module.exports.generateToken = async function (payload, type, label) {
  const token = await JWTSign(payload, type, label);
  return token;
};

// allowInsecureKeySizes: true;
function JWTSign(payload, type, label) {
  const options =
    label === "access"
      ? { algorithm: "RS256", expiresIn: "6h" }
      : { algorithm: "RS256", expiresIn: "2m" };

  let userEmail = payload.userEmail ? payload.userEmail : payload.email;

  const tokenGen = assignNewToken(userEmail, type, options);

  return tokenGen;
}

module.exports.getPayloadFromToken = async function (token, label, admin) {
  const payload = await JWTVerify(token, label, admin);
  return payload;
};

module.exports.verifyToken = async function (token, label, admin) {
  const result = await JWTVerify(token, label, admin);
  return result;
};

function JWTVerify(token, label, admin) {
  const options =
    label === "access"
      ? { algorithm: "RS256", expiresIn: "6h" }
      : { algorithm: "RS256", expiresIn: "2m" };

  const key_tool = admin ? jwtPublicKey : jwtPublicFakeKey;

  const tokenCheckRes = verifyThisToken(key_tool, token, options);

  return tokenCheckRes;
}

function assignNewToken(payload, type, options) {
  const hold_key = type === "admin" ? jwtPrivateKey : jwtPrivateFakeKey;

  return new Promise((resolve, reject) => {
    try {
      const secret = fs.readFileSync(hold_key);

      const token = jwt.sign({ userEmail: payload }, secret, options);
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
}

function verifyThisToken(key_tool, token, options) {
  return new Promise((resolve, reject) => {
    try {
      const cert = fs.readFileSync(key_tool);

      const result = jwt.verify(token, cert, options);
      resolve(result);
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        reject(err);
      } else {
        resolve(err);
      }
    }
  });
}

module.exports.errorToken = function (msgErr) {
  throw new Error(msgErr);
};
