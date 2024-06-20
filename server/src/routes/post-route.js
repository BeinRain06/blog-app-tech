const User = require("../models/user.js");
const Post = require("../models/post.js");
const express = require("express");
const compareAsc = require("date-fns/compareAsc");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs").promises;
const router = express.Router();
const { format } = require("date-fns");
const { generateToken } = require("../protect-api/authorization-jwt");

router.use(express.urlencoded({ extended: false }));

router.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

require("dotenv").config({ path: path.join(__dirname, "..") });

//multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../public/images"));
  },
  filename: function (req, file, callback) {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;

    callback(null, filename);
  },
});

//multer config size img
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
});

//middleware destination image - express
router.use(`/images`, express.static(path.join(__dirname, "../public/images")));

router.post("/image/create", upload.single("cover"), (req, res) => {
  try {
    if (req.body.userid !== null || req.body.userid !== undefined) {
      return res.status(200).json({
        success: true,
        image_path: `images/${req.file.filename}`,
      });
    } else {
      throw new Error("User Not Login! ");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, summary, image_path, content, userid, username } = req.body;

    const PORT = process.env.PORT;

    const base_url = process.env.API_BASE;

    // image_url to store on mongDB as string
    const image_url = `http://localhost:${PORT}/${base_url}/post/${image_path}`;

    let prevCookie;
    let refreshDataUser;
    let userId;

    if (userid !== null || userid !== undefined) {
      if (req.cookies.userInfo !== undefined) {
        prevCookie = req.cookies.userInfo;
        userId = prevCookie.userId;
      } else {
        refreshDataUser = await User.findById(userid);
        userId = refreshDataUser.id;
      }
    }

    let date = format(new Date(), "dd MMM yyyy ,  hh:mm a");

    let post = new Post({
      title: title,
      summary: summary,
      image: image_url,
      content: content,
      author: userId,
      date: date,
    });

    post = await post.save();

    const allUserPost = await Post.find({ author: userId });

    const thisUser = await User.findById(userId);

    const countAllPost = allUserPost.length;
    let access_token;

    if (thisUser.admin) {
      //access_token
      access_token = await generateToken(thisUser, "admin", "access");
    } else {
      //access_token
      access_token = await generateToken(thisUser, "common", "access");
    }

    const infosNewPost = {
      title: post.title,
      author: thisUser.username,
      date: date,
      countPost: countAllPost,
      access_token: access_token,
    };

    res.status(200).json({ success: true, data: infosNewPost });
  } catch (err) {
    console.log(err);
  }
});

router.post("/edit/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    let date = format(new Date(), "dd MMM yyyy ,  hh:mm a");

    const newPost = req.body;

    const PORT = process.env.PORT;

    const base_url = process.env.API_BASE;

    const image_path = newPost.image;

    const image_url = `http://localhost:${PORT}/${base_url}/post/${image_path}`;

    let updationPost;

    if (req.body.image !== "") {
      updationPost = await Post.findByIdAndUpdate(
        postId,
        {
          $set: {
            title: newPost.title,
            summary: newPost.summary,
            image: image_url,
            content: newPost.content,
            date: date,
          },
        },
        { new: true }
      );
    } else {
      updationPost = await Post.findByIdAndUpdate(
        postId,
        {
          title: newPost.title,
          summary: newPost.summary,
          content: newPost.content,
          date: date,
        },
        { new: true }
      );
    }

    res.status(200).json({ success: true, data: updationPost });
  } catch (err) {
    console.log(err);
  }
});

router.post("/image/delete/:nameImg", async (req, res) => {
  try {
    const nameImg = req.params.nameImg;

    const filePath = path.join(__dirname, `../public/images/${nameImg}`);

    await fs.unlink(filePath);

    console.log(`File ${filePath} has been deleted.`);

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
  }
});

router.get("/dedicate/:label", async (req, res) => {
  try {
    const label = req.params.label;
    const valueOfSearch = req.query.input;
    const authorId = req.query.author;

    let posts = await Post.find().populate("author", ["id", "username"]);

    if (label === "theme") {
      posts = posts.filter((post) => {
        if (
          post.title.includes(valueOfSearch) ||
          post.summary.includes(valueOfSearch)
        ) {
          return post;
        }
      });
    } else if (label === "author") {
      const userPostId = await User.findById(authorId);

      posts = posts.filter((post) => post.author.id === authorId);
    } else if (label === "standard") {
      posts = posts.filter((post) => {
        if (post.content.includes(valueOfSearch)) return post;
      });
    }

    if (posts.length === 0) {
      posts = null;
    }

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.log(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    let posts = await Post.find().populate("author", "username");

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
