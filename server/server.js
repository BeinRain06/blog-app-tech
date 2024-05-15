const express = require("express");
const cors = require("cors");
const path = require("path");

const postRouter = require("./src/routes/post-route");
const registerRouter = require("./src/routes/register-route");
const loginRouter = require("./src/routes/login-route");

require("dotenv").config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT;
const base_url = process.env.API_BASE;

//alias Routes Middleware
app.use(`/${base_url}/post`, postRouter);
app.use(`/${base_url}/register`, registerRouter);
app.use(`/${base_url}/login`, loginRouter);

app.get("/", (req, res) => {
  const post = {
    title: "breathe",
    summary: "i'm breathing that¹s why almight count",
    name: "Leave",
  };

  console.log(base_url);
  res.status(200).json({ data: post });
});

//connect server to MONGODB and start it!
const connectDB = require("./src/config/db");

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
});
