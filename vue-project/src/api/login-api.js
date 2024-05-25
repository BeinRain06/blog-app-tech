const base_url = import.meta.env.VITE_API_URL

export const redirectloginapi = async () => {
  const user = {}
  const catchUserName = await fetch(`${base_url}/login/redirect`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  console.log('catch username', catchUserName)

  return catchUserName
}

export const loginapi = async (userInfo) => {
  const user = {
    email: userInfo.email,
    password: userInfo.password
  }

  const userFetching = await fetch(`${base_url}/login`, {
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

export const initiateadminapi = async (userInfo) => {
  const user = {
    email: userInfo.email,
    password: userInfo.password,
    secret: userInfo.secret
  }

  console.log('user:', user)

  const userInitAdmin = await fetch(`${base_url}/login/admin/init`, {
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

  console.log('userInitAdmin:', userInitAdmin)

  return userInitAdmin
}

export const loginadminapi = async (userInfo) => {
  const booleanAdmin = await fetch(`${base_url}/login/admin/auth`, {
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

  console.log('booleanAdmin :', booleanAdmin)

  return booleanAdmin
}
