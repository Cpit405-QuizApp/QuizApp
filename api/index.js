const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("./models/user");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);
const CookieParser = require("cookie-parser");

app.use(express.json());
app.use(CookieParser());

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGOOSE_URL);

mongoose.connect(process.env.MONGOOSE_URL).then(() => {
  console.log("Successfully connected to MongoDB Atlas!");
}).catch(err => {
  console.error("Error connecting to MongoDB Atlas:", err.message);
});

app.get("/test", (req, res) => {
  res.json("test ok");
});

app.post("/register", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      birthdate,
      password,
    } = req.body;

    const userInstance = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      birthdate,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userInstance);
  } catch (e) {
    if (e.code === 11000) {
      const field = Object.keys(e.keyPattern)[0];
      res.status(422).json({ message: `The ${field} is already in use.` });
    } else {
      res.status(422).json({ message: e.message });
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }


    res.json({ success: true, message: "Login successful" });
  } catch (e) {
    console.error("Login Error:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
