const base_url = import.meta.env.VITE_API_URL
const base_url_1 = import.meta.env.VITE_API_URL_ONE

export const createpostapi = async (postElt, thisUserId) => {
  try {
    const newPostElt = { ...postElt, userid: thisUserId }

    const postInfos = await fetch(`${base_url_1}/post`, {
      method: 'POST',
      body: JSON.stringify(newPostElt),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres.data)

    return postInfos
  } catch (err) {
    console.log(err)
  }
}

export const primarimageapi = async (myInputFile, thisUserId) => {
  try {
    const file = myInputFile.files[0]

    //formData instance
    const formData = new FormData()
    //add element
    formData.append('cover', file)
    formData.append('userid', thisUserId)

    const prePostImg = await fetch(`${base_url_1}/post/image/create`, {
      method: 'POST',
      body: formData
    })
      .then((res) => res.json())
      .then((newres) => newres.image_path)

    return prePostImg
  } catch (err) {
    console.log(err)
  }
}

export const deleteimageapi = async (nameImg) => {
  try {
    const sendImage = await fetch(`${base_url_1}/post/image/delete/${nameImg}`, {
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
    const posts = await fetch(`${base_url_1}/post/all`, {
      method: 'GET',
      mode: 'cors',
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

    const updatedPost = await fetch(`${base_url_1}/post/edit/${postId}`, {
      method: 'POST',
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((newres) => newres)

    return updatedPost
  } catch (err) {
    console.log(err)
  }
}

export const fetchspecificarticlesapi = async (label, inputValue, authorId) => {
  try {
    const grabArticles = await fetch(
      `${base_url_1}/post/dedicate/${label}?input=${inputValue}&author=${authorId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }
    )
      .then((res) => res.json())
      .then((newres) => newres.data)

    return grabArticles
  } catch (err) {
    console.log(err)
  }
}
