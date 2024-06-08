const base_url = import.meta.env.VITE_API_URL

export const createpostapi = async (postElt, thisUserId) => {
  try {
    const newPostElt = { ...postElt, userid: thisUserId }

    const postInfos = await fetch(`${base_url}/post`, {
      method: 'POST',
      body: JSON.stringify(newPostElt),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres.data)

    console.log('postInfos :', postInfos)

    return postInfos
  } catch (err) {
    console.log(err)
  }
}

export const primarimageapi = async (myInputFile, thisUserId) => {
  try {
    const file = myInputFile.files[0]

    console.log('our api file:', file)

    //formData instance
    const formData = new FormData()
    //add element
    formData.append('file', file)
    formData.append('userid', thisUserId)

    const prePostImg = await fetch(`${base_url}/post/image/create`, {
      method: 'POST',
      body: formData
    })
      .then((res) => res.json())
      .then((newres) => newres.image_path)

    console.log('image_path:', prePostImg)

    return prePostImg
  } catch (err) {
    console.log(err)
  }
}

export const getpostsapi = async () => {
  try {
    const posts = await fetch(`${base_url}/post/all`, {
      mehod: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres.data)

    return posts
  } catch (err) {
    console.log(err)
  }
}
