import { useWarningStore } from "../stores/warning";

import { getauthorsandthemesapi } from "@/api/login-api";

export const checkInputError = (user, label) => {
  if (label === "login") {
    return checkInputErrorLogin(user);
  }

  if (label === "loginadmin") {
    return checkInputErrorLoginAdmin(user);
  }

  if (label === "register") {
    return checkInputErrorRegister(user);
  }
};

export const resetUserInput = (user, inputPwd) => {
  if (inputPwd !== null) {
    inputPwd.setAttribute("type", "password");
  }

  setTimeout(() => {
    const userKeys = Object.keys(user);
    userKeys.forEach((key) => (user[key] = ""));
  }, 4800);
};

const checkInputErrorRegister = (user) => {
  const reg = /^([\w\-]+)@(\w+)\.([A-Za-z]{2,5})$/;

  const reg2 = /\@/;
  const checkExc = reg2.exec(user.username);

  const warningPop = useWarningStore();

  if (
    user.email === "" ||
    user.username === "" ||
    user.password === "" ||
    user.confirm_password === ""
  ) {
    warningPop.warningUpdate("input Fields Empty!", user);
    return;
  }

  if (!reg.test(user.email)) {
    warningPop.warningUpdate("invalid Email! Try again", user);
    return;
  }

  if (checkExc !== null) {
    warningPop.warningUpdate("username cannot contains character - @", user);
    return;
  } else if (user.username.length < 5) {
    warningPop.warningUpdate("username, at least 5 characters", user);
    return;
  }

  if (user.password.length < 6 || user.confirm_password.length < 6) {
    warningPop.warningUpdate("password could be at least 06 characters", user);
    return;
  } else if (user.password !== user.confirm_password) {
    warningPop.warningUpdate("password fields incorrect!", user);
    return;
  }
};

const checkInputErrorLogin = (user) => {
  const reg = /^([\w\-]+)@(\w+)\.([A-Za-z]{2,5})$/;

  const warningPop = useWarningStore();

  if (user.email === "" && user.password === "") {
    setTimeout(() => {
      warningPop.warningUpdate("input Fields Empty!", user);
    }, 4100);
    return true;
  } else if (!reg.test(user.email)) {
    setTimeout(() => {
      warningPop.warningUpdate("wrong Email! ", user);
    }, 4100);
    return true;
  }

  return false;
};

export const checkInputErrorLoginAdmin = (user) => {
  const reg = /^([\w\-]+)@(\w+)\.([A-Za-z]{2,5})$/;

  const warningPop = useWarningStore();

  console.log("we are here");
  if ((user.email === "" && user.password === "") || user.custom === "") {
    setTimeout(() => {
      warningPop.warningUpdate("input Fields Empty!", user);
    }, 4100);
    return true;
  } else if (!reg.test(user.email)) {
    setTimeout(() => {
      warningPop.warningUpdate("Email not available! ", user);
    }, 4100);

    return true;
  }

  return false;
};

export const populateLocalStorage = async () => {
  const authorsAndThemes = await getauthorsandthemesapi();

  const allThemes = authorsAndThemes.map((item) => item.theme);
  const allAuthors = authorsAndThemes.map((item) => item.author);

  if (localStorage.getItem("list-authors") === undefined) {
    localStorage.setItem("list-authors", "[]");
  }
  if (localStorage.getItem("list-themes") === undefined) {
    localStorage.setItem("list-themes", "[]");
  }

  let arrAuthors = JSON.parse(localStorage.getItem("list-authors"));

  let arrThemes = JSON.parse(localStorage.getItem("list-themes"));

  if (arrThemes?.length !== allThemes.length) {
    arrThemes = allThemes;
  }

  if (arrAuthors?.length !== allAuthors.length) {
    arrAuthors = allAuthors;
  }

  localStorage.setItem("list-authors", JSON.stringify(arrAuthors));
  localStorage.setItem("list-themes", JSON.stringify(arrThemes));
};

export const shortNameUser = (userSentName) => {
  const username = userSentName;

  let shortname;
  const regex = /[\s|\-|_|.]/;
  if (!username) {
    shortname = "";
  } else {
    let matchName = username.match(regex);
    // console.log("matchName:", matchName);

    if (matchName !== null) {
      const indexEnd = matchName.index;
      shortname = username.slice(0, indexEnd);
    } else {
      shortname = username;
    }
  }

  return shortname;
};

export const updateSessionStorage = (newUser) => {
  newUser.admin
    ? sessionStorage.setItem("navbar-state", "admin")
    : sessionStorage.setItem("navbar-state", "standard");

  sessionStorage.setItem("userid", newUser.userId);
  sessionStorage.setItem("username", newUser.userName);
};
