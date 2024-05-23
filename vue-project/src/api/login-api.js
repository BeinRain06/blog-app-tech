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

  console.log('user:', user)

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

  console.log('userFetching:', userFetching)

  return userFetching
}
