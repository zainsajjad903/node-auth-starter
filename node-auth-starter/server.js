const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/userdb", {
  useNewUrlParser: true, useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const userExist = await User.findOne({ email });

  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(200).json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  res.status(200).json({ message: "Login successful" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
