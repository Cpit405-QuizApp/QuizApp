const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
const User = require("./models/user");
require("dotenv").config();
const salt = bcrypt.genSaltSync(10);
const CookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const jwtSecret = "JHjksG678gJKslj7gslJISP8hulSLIjl8j9";
app.use(CookieParser());

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

    if (user) {
      const correctPass = bcrypt.compareSync(password, user.password);

      if (correctPass) {
        jwt.sign(
          {
            email: user.email,
            id: user._id,
          },
          jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            if (err) {
              console.error(err);
              res.status(500).json({ message: "Internal server error" });
            } else {
              
              res.cookie('token', token).json({ success: true, message: "Login successful", token: token });
            }
          }
        );
      } else {
        res.status(422).json({ message: "Wrong password" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, decodedToken) => {
      if (err) {
        res.json(null); 
      } else {
        const userId = decodedToken.id; 
        try {
          const { firstName, lastName, email, _id } =
            await User.findById(userId);
          res.json({ firstName, lastName, email, _id });
        } catch (error) {
          res.json(null); 
        }
      }
    });
  } else {
    res.json(null); 
  }
});


app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
