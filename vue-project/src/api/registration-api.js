const base_url = import.meta.env.VITE_API_URL

console.log('base_url:', base_url)

export const registrationapi = async (userInfo) => {
  const user = {
    email: userInfo.email,
    username: userInfo.username,
    password: userInfo.password,
    secret: userInfo.custom
  }

  const userCreation = await fetch(`${base_url}/register`, {
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

  return userCreation
}
