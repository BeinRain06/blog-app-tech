const base_url = import.meta.env.VITE_API_URL
const base_url_1 = import.meta.env.VITE_API_URL_ONE

export const redirectloginapi = async (access_token) => {
  const access = {
    access: access_token
  }
  const newUserInfo = await fetch(`${base_url_1}/login/redirect`, {
    method: 'POST',
    body: JSON.stringify(access),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  return newUserInfo
}

export const loginapi = async (userInfo) => {
  const user = {
    email: userInfo.email,
    password: userInfo.password
  }

  const userFetching = await fetch(`${base_url_1}/login`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  return userFetching
}

export const loginadminapi = async (userInfo) => {
  const newUserInfo = await fetch(`${base_url_1}/login/admin/auth`, {
    method: 'POST',
    body: JSON.stringify(userInfo),
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  return newUserInfo
}

export const getauthorsandthemesapi = async () => {
  const authorsAndThemes = await fetch(`${base_url_1}/login/admin/authors-themes`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  return authorsAndThemes
}
