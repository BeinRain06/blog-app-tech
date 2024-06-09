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
  console.log("usey uerFetch:", userFetch);

  let session;
  let result;
  let newUserInfo;
  let isAdmin = userFetch.admin;

  if (!isAdmin) {
    console.log("session_token:", session_token);
    result = await verifyFakeToken(session_token, "session");
    console.log("session AA:", result);

    const rightTime = Date.now();

    const currentTime = Math.floor(rightTime / 1000);
    if (result.exp > currentTime) {
      session = session_token;
      newUserInfo = applyNewToken(userFetch, "standard");
      return newUserInfo;
      /*   const access_token = generateToken(userFetch, "common", "access");
      newUserInfo = { ...userFetch, access: access_token, session: session };
      return newUserInfo; */
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
      /* const access_token = generateToken(userFetch, "common", "access");
      newUserInfo = { ...userFetch, access: access_token, session: session };
      return newUserInfo; */
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

  /* if (session && isAdmin) {
    if (access_token) {
      let accessOne = await verifyToken(access_token, "access");
      console.log("accessOne CC:", accessOne);
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
      console.log("accessTwo DD:", accessTwo);
      if (accessTwo || accessTwo.name === "TokenExpiredError") {
        newUserInfo = applyNewToken(userFetch, "standard");
        return newUserInfo;
      }
    } else if (access_token === null) {
      newUserInfo = "null";
      return newUserInfo;
    }
  } */
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
