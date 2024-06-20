const {
  errorToken,
  verifyFakeToken,
  verifyToken,
  generateToken,
} = require("./authorization-jwt");
const { applyNewToken } = require("./renew-token");

module.exports.checkPrevToken = async function (
  userFetch,
  session_token,
  access_token
) {
  let session;
  let result;
  let newUserInfo;
  let isAdmin = userFetch.admin;

  if (!isAdmin) {
    result = await verifyFakeToken(session_token, "session");

    const rightTime = Date.now();

    const currentTime = Math.floor(rightTime / 1000);
    if (result.exp > currentTime) {
      session = session_token;
      newUserInfo = applyNewToken(userFetch, "standard");
      return newUserInfo;
    }
  } else {
    result = isUsingTheMatchLogin(session_token);

    const rightTime = Date.now();

    const currentTime = Math.floor(rightTime / 1000);

    console.log("session BB:", result);

    if ((result = "null")) {
      newUserInfo = "null";
      return newUserInfo;
    }

    if (result.exp > currentTime) {
      session = session_token;
      newUserInfo = applyNewToken(userFetch, "standard");
      return newUserInfo;
    }
  }

  if (session.name) {
    if (session.name === "TokenExpiredError") {
      newUserInfo = "null";
      return newUserInfo;
    } else {
      errorToken("Access_token , something wrong !");
    }
  }
};

const isUsingTheMatchLogin = (session_token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await verifyToken(session_token, "session");
      resolve(result);
    } catch (err) {
      resolve("null");
      reject(err);
    }
  });
};
