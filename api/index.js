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
const Quiz = require("./models/quizSchema");
app.use(express.json());
app.use(CookieParser());
const Attempt = require("./models/attemptSchema");
const authenticate = require("./middleware/authenticate");

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGOOSE_URL);

mongoose
  .connect(process.env.MONGOOSE_URL)
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((err) => {
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
              res
                .cookie("token", token)
                .json({
                  success: true,
                  message: "Login successful",
                  token: token,
                });
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
          const { firstName, lastName, email, _id } = await User.findById(
            userId
          );
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

app.post("/quizzes", authenticate, async (req, res) => {
  try {
    const quizData = {
      ...req.body,
      userId: req.userId,
    };

    const newQuiz = new Quiz(quizData);
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/quizzes/myquizzes", authenticate, async (req, res) => {
  try {
    const userQuizzes = await Quiz.find({ userId: req.userId });
    res.json(userQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/quizzes/community", async (req, res) => {
  try {
    const communityQuizzes = await Quiz.find({}); // Fetch all quizzes without filtering by userId
    res.json(communityQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/quizzes/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
app.post("/quizzes/:quizId/submit", authenticate, async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.userId; // Assuming user ID is stored in req.user
    const { score } = req.body;

    const newAttempt = new Attempt({
      quiz: quizId,
      user: userId,
      score: score,
    });
    await newAttempt.save();

    res.json({ message: "Quiz submitted successfully", score });
  } catch (error) {
    console.error("Error details:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

app.put("/quizzes/:quizId", async (req, res) => {
  const { quizId } = req.params;
  const updatedData = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, updatedData, {
      new: true,
    });
    res.status(200).json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Error updating quiz", error });
  }
});

app.delete("/quizzes/:quizId", async (req, res) => {
  const { quizId } = req.params;

  try {
    await Quiz.findByIdAndDelete(quizId);
    res.status(200).json({ message: "Quiz successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting quiz", error });
  }
});

app.get("/attempts", authenticate, async (req, res) => {
  try {
    const { quizIds } = req.query;
    const quizIdArray = quizIds.split(",");
    const userAttempts = await Attempt.find({
      quiz: { $in: quizIdArray },
    }).populate("user", "firstName lastName"); // Populate user details
    res.json(userAttempts);
  } catch (error) {
    console.error("Error fetching user's quiz attempts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.get('/quizzes/:quizId/attempts', async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const attempts = await Attempt.find({ quiz: quizId }).populate('user', 'firstName lastName');
    if (attempts.length > 0) {
      res.json(attempts);
    } else {
      res.status(404).json({ message: 'No attempts found for this quiz.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


app.get('/leaderboard', async (req, res) => {
  try {
    const leaderboardData = await Attempt.aggregate([
      {
        $group: {
          _id: '$user',
          totalScore: { $sum: '$score' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { totalScore: -1, count: -1 },
      },
      {
        $lookup: {
          from: 'users', 
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
          },
          totalScore: 1,
          count: 1,
        },
      },
    ]);

    res.json(leaderboardData);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
