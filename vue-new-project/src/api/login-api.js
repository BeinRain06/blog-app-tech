const base_url = import.meta.env.VITE_API_URL;
const base_url_1 = import.meta.env.VITE_API_URL_ONE;

export const loginapi = async (userInfo) => {
  const user = {
    email: userInfo.email,
    password: userInfo.password,
  };

  const userFetching = await fetch(`${base_url}/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((newres) => newres.data);

  return userFetching;
};

export const loginUpdateTokensFirst = async (userInfo) => {
  const userId = userInfo.userId;

  const newUserInfo = await fetch(`${base_url}/login/tokens/update/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((newres) => newres.data);

  return newUserInfo;
};

export const loginadminapi = async (userInfo) => {
  const newUserInfo = await fetch(`${base_url}/login/admin/auth`, {
    method: "PUT",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: "include",
  })
    .then((res) => res.json())
    .then((newres) => newres.data);

  return newUserInfo;
};

export const getauthorsandthemesapi = async () => {
  const authorsAndThemes = await fetch(
    `${base_url}/login/admin/authors-themes`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      credentials: "include",
    }
  )
    .then((res) => res.json())
    .then((newres) => newres.data);

  return authorsAndThemes;
};
