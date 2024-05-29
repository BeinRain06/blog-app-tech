const { errorToken, generateToken } = require("./authorization-jwt");

const applyNewAccessToken = async function (userFetch) {
  const newAcessToken = generateToken(userFetch, "admin", "access");
  const newUserInfo = {
    username: userFetch.userName,
    access: newAcessToken,
    admin: false,
  };

  return newUserInfo;
};

module.exports.checkAccessToken = async function (token, userFetch) {
  if (token) {
    const newUserInfo = {
      username: prevCookie.userName,
      access: token,
      admin: true, // 02 redirections -> standard login , or loginadmin
    };
    return newUserInfo;
  } else if (token.name === "TokenExpiredError") {
    const newUserInfo = applyNewAccessToken(userFetch);
    return newUserInfo;
  } else if (
    token.name === "JsonWebTokenError" ||
    token.name === "NotBeforeError"
  ) {
    errorToken("something went wrong parsing access_token jwt ! ");
  }
};

module.exports.applyNewToken = async function (userFetch, identity) {
  const admin = identity === "admin" ? true : false;
  let newSessionToken = await generateToken(userFetch, "common", "session");
  let newAcessToken = await generateToken(userFetch, "common", "access");
  if (admin) {
    newSessionToken = await generateToken(userFetch, "admin", "session");
    newAcessToken = await generateToken(userFetch, "admin", "access");
  } else {
    newSessionToken = await generateToken(userFetch, "common", "session");
    newAcessToken = await generateToken(userFetch, "common", "access");
  }

  const newUserInfo = {
    id: userFetch.id,
    username: userFetch.username,
    access: newAcessToken,
    session: newSessionToken,
    admin: admin,
  };

  return newUserInfo;
};
