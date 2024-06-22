const express = require("express");
const cors = require("cors");
const User = require("./src/models/user.js");
const Post = require("./src/models/post.js");
const path = require("path");
const cookie = require("cookie-parser");
const postRouter = require("./src/routes/post-route");
const registerRouter = require("./src/routes/register-route");
const loginRouter = require("./src/routes/login-route");
const logoutRouter = require("./src/routes/logout-route");

const app = express();

app.use(
  cors({
    origin: [
      "https://blog-app-server-tech.vercel.app",
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(cookie());

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;

const base_url = process.env.API_BASE;

/* const NEW_PORT = "https://blog-app-server-tech.vercel.app"; */

const NEW_PORT = 8080;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  next();
});

//alias Routes Middleware
app.use(`/${base_url}/post`, postRouter);
app.use(`/${base_url}/register`, registerRouter);
app.use(`/${base_url}/login`, loginRouter);
app.use(`/${base_url}/logout`, logoutRouter);

app.get("/", (req, res) => {
  const post = {
    title: "breathe",
    summary: "i'm breathing that¹s why almight count",
    name: "Leave",
  };

  res.status(200).json({ data: post });
});

app.get("/post/all", async (req, res) => {
  try {
    let posts = await Post.find().populate("author", "username");

    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.log(err);
  }
});

//connect server to MONGODB and start it!
const connectDB = require("./src/config/db");

//listen on local
/* connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}); !important */

// listen on PORT 80 (add an url)
connectDB().then(() => {
  app.listen(NEW_PORT, () => {
    console.log(`server running on ${NEW_PORT}`);
  });
});

module.exports = app;

/* {
  "version": 2,
  "name": "blog-app-tech",
  "routes": [
    { "src": "/", "dest": "/server.js" },
    { "src": "/post", "dest": "/server.js" },
    {
      "src": "/blogtech/api/register/(.*)",
      "dest": "/routes/register-route.js"
    },
    { "src": "/blogtech/api/login/(.*)", "dest": "/routes/login-route.js" },
    { "src": "/blogtech/api/logout/(.*)", "dest": "/routes/logout-route.js" },
    { "src": "/blogtech/api/post/all", "dest": "/routes/post-route.js" }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}, */

/* {
  "version": 2,
  "name": "blog-app-tech",
  "rewrites": [{ "source": "/(.*)", "destination": "/server.js" }]
} */
