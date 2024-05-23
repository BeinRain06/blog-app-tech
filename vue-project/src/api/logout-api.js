const base_url = import.meta.env.VITE_API_URL

export const logoutapi = async () => {
  const user = {}
  const postLogout = await fetch(`${base_url}/logout`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  console.log('user logout - data resetting', postLogout)

  return postLogout
}
