const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./process.env" });
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require("./models/user.js");
const Exercise = require("./models/exercise.js");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/users", async (req, res, next) => {
  const username = req.body.username;
  if (!username || JSON.stringify(req.body.username) == "{}") {
    res.sendStatus(404);
  } else {
    try {
      const userCreated = await User.create({ username: username });
      if (userCreated) {
        res.json({ username: userCreated.username, _id: userCreated._id });
      }
    } catch (e) {
      console.log(e);
    }
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    const users = await User.find();
    if (users) {
      res.json(users);
    }
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/users/:_id/exercises", async (req, res, use) => {
  // Get form data
  const { description, duration, date } = req.body;
  const _id = req.params._id;
  let newDate;

  // Get date
  if (date) {
    dateSplit = date.split("-");
    newDate = new Date(
      Number(dateSplit[0]),
      Number(dateSplit[1] - 1),
      Number(dateSplit[2])
    );
  } else {
    newDate = new Date();
  }
  let dateToString = newDate.toDateString();
  try {
    const user = await User.findOne({ _id: _id }).lean();
    const exerciseCreated = await Exercise.create({
      username: user.username,
      userId: user._id,
      description: description,
      duration: duration,
      date: dateToString,
      dateFormat: newDate,
    });

    if (exerciseCreated) {
      res.json({
        _id: exerciseCreated.userId,
        username: exerciseCreated.username,
        date: exerciseCreated.date,
        duration: Number(duration),
        description: description,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

app.get("/api/users/:_id/logs", async (req, res, next) => {
  const _id = req.params._id;
  const { from, to, limit } = req.query;
  console.log(req.query, from, to, limit);

  const date = {};
  if (from) {
    date["$gte"] = new Date(from);
  }
  if (to) {
    date["$lte"] = new Date(to);
  }
  let exercises;
  try {
    if (JSON.stringify(date) !== "{}") {
      exercises = await Exercise.find(
        { userId: _id, dateFormat: { ...date } },
        "description duration date"
      ).limit(Number(limit));
    } else {
      exercises = await Exercise.find(
        { userId: _id },
        "description duration date"
      ).limit(Number(limit));
    }

    res.json({
      _id: _id,
      username: exercises.username,
      count: exercises.length,
      log: exercises,
    });
  } catch (e) {
    console.log(e);
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
