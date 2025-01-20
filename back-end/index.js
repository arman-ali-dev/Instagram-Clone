require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const { app, server } = require("./socket/socket");
const PORT = process.env.PORT;

const _dirname = path.resolve();

const connectDB = require("./configuration/db");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const messageRoute = require("./routes/messageRoute");

const auth = require("./middlewares/authMiddleware");

app.use(cookieParser());
app.use(
  cors({
    origin: "https://arman-instagram.onrender.com/",
    credentials: true,
  })
);
app.use(express.json());

connectDB()
  .then(() => console.log("Database Connected Successfully!"))
  .catch(() => console.log("Database Connection FAILED!"));

app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/messages", auth, messageRoute);

app.use(express.static(path.join(_dirname, "/front-end/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "front-end", "dist", "index.html"));
});

server.listen(PORT, () =>
  console.log(`Instagram is listening on PORT: ${PORT}`)
);
