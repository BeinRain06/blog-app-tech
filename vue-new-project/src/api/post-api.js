const base_url = import.meta.env.VITE_API_URL;
const base_url_1 = import.meta.env.VITE_API_URL_ONE;

export const createpostapi = async (postElt) => {
  try {
    const userId = sessionStorage.getItem("userid");

    const fetchInfos = await fetch(`${base_url}/post/${userId}`, {
      method: "POST",
      body: JSON.stringify(postElt),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((newres) => newres);

    // console.log("fetchInfos --post-api-- :", fetchInfos);

    if (!fetchInfos.success) {
      alert(fetchInfos.error);
      return;
    }

    const postInfos = fetchInfos.data;

    return postInfos;
  } catch (err) {
    console.log(err);
  }
};

export const primarimageapi = async (myInputFile, thisUserId) => {
  try {
    // const file = myInputFile.files[0];

    const file = myInputFile;

    console.log("--primarimageapi-- file:", file);

    //formData instance
    const formData = new FormData();
    //add element
    formData.append("cover", file);
    formData.append("userid", thisUserId);

    const prePostImg = await fetch(`${base_url}/post/image/create`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((newres) => newres.image_path);

    return prePostImg;
  } catch (err) {
    console.log(err);
  }
};

export const deleteimageapi = async (nameImg) => {
  try {
    const sendImage = await fetch(`${base_url}/post/image/delete/${nameImg}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((newres) => newres);

    return sendImage;
  } catch (err) {
    console.log(err);
  }
};

export const getpostsapi = async () => {
  try {
    const postsFetch = await fetch(`${base_url}/post/all`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((newres) => newres.data);

    const posts = postsFetch.reverse();

    return posts;
  } catch (err) {
    console.log(err);
  }
};

export const editpostapi = async (post) => {
  try {
    const postId = post.id;

    const updatedPost = await fetch(`${base_url}/post/edit/${postId}`, {
      method: "PUT",
      body: JSON.stringify(post),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((newres) => newres);

    return updatedPost;
  } catch (err) {
    console.log(err);
  }
};

export const fetchspecificarticlesapi = async (label, inputValue, authorId) => {
  try {
    const grabArticles = await fetch(
      `${base_url}/post/dedicate/${label}?input=${inputValue}&author=${authorId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((newres) => newres.data);

    return grabArticles;
  } catch (err) {
    console.log(err);
  }
};
