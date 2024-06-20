const base_url = import.meta.env.VITE_API_URL
const base_url_1 = import.meta.env.VITE_API_URL_ONE

export const logoutapi = async () => {
  const user = {}
  const postLogout = await fetch(`${base_url_1}/logout`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((newres) => newres.data)

  return postLogout
}
