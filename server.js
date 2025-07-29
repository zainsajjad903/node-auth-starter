const express = require("express");
   const bcryptjs = require("bcryptjs");
     const bodyParser = require("body-parser");
       const cors = require("cors");
         const path = require("path");
       const mongoose = require("mongoose");
     const User = require("./models/User"); // 👈 ADD THIS LINE
   const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/userdb", {
  useNewUrlParser: true,
   useUnifiedTopology: true
})
   .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.log("❌ MongoDB error:", err));
      app.use(cors());
        app.use(bodyParser.json());
          app.use(express.static("public"));
        app.post("/signup", async (req, res) => {
      const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword
  });
  await user.save();
  res.status(200).json({ message: "User created successfully" });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });
  res.status(200).json({ message: "Login successful" });
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(3000, () => {
  console.log(`🚀 Server is running on http://localhost:3000`);
});
const nodemailer = require("nodemailer");
const resetCodes = {}; // Memory store (you can use MongoDB too)
app.post("/send-reset-code", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Email not registered" });
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodes[email] = code;
  // Setup transporter
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "muhammedzain759@gmail.com", // replace
      pass: "srtueqcqngnfkwob"      // replace (use App password)
    }
  });
  await transporter.sendMail({
    to: email,
    subject: "Password Reset Code",
    text: `Your reset code is: ${code}`
  });
  res.json({ message: "Reset code sent to your email." });
});
app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (resetCodes[email] !== code) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }
  const hashedPassword = await bcryptjs.hash(newPassword, 10);
  await User.updateOne({ email }, { password: hashedPassword });
  delete resetCodes[email];
  res.json({ message: "Password updated successfully" });
});

