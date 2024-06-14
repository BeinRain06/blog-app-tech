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

    console.log('our api cover:', file)

    //formData instance
    const formData = new FormData()
    //add element
    formData.append('cover', file)
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

export const deleteimageapi = async (nameImg) => {
  try {
    const sendImage = await fetch(`${base_url}/post/image/delete/${nameImg}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres)

    return sendImage
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

export const editpostapi = async (post) => {
  try {
    const postId = post.id

    console.log('postId:', postId)

    const updatedPost = await fetch(`${base_url}/post/edit/${postId}`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres)

    console.log('updatedPost:', updatedPost)

    return updatedPost
  } catch (err) {
    console.log(err)
  }
}
