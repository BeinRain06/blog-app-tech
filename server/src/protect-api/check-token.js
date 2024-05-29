const {
  errorToken,
  verifyFakeToken,
  verifyToken,
} = require("./authorization-jwt");
const { applyNewToken } = require("./renew-token");

module.exports.checkPrevToken = async function (
  userFetch,
  session_token,
  access_token
) {
  console.log("usey uerFetch:", userFetch);

  let session;
  let newUserInfo;
  let isAdmin = userFetch.admin;

  if (!isAdmin) {
    session = await verifyFakeToken(session_token, "session");
  } else {
    session = isUsingTheMatchLogin(session_token);

    if ((session = "null")) {
      newUserInfo = "null";
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

  if (session && isAdmin) {
    if (access_token) {
      let accessOne = await verifyToken(access_token, "access");
      if (accessOne || accessOne.name === "TokenExpiredError") {
        newUserInfo = applyNewToken(userFetch, "admin");
        return newUserInfo;
      }
    } else if (access_token === null) {
      newUserInfo = "null";
      return newUserInfo;
    }
  } else if (session && !isAdmin) {
    if (access_token) {
      let accessTwo = await verifyFakeToken(access_token, "access");
      if (accessTwo || accessTwo.name === "TokenExpiredError") {
        newUserInfo = applyNewToken(userFetch, "standard");
        return newUserInfo;
      }
    } else if (access_token === null) {
      newUserInfo = "null";
      return newUserInfo;
    }
  }
};

const isUsingTheMatchLogin = (session_token) => {
  return new Promise(async (resolve, reject) => {
    try {
      const session = await verifyToken(session_token, "session");
      resolve(session);
    } catch (err) {
      resolve("null");
      reject(err);
    }
  });
};
