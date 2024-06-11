const mongoose = require("mongoose");

const myDB = mongoose.connection.useDb("ExerciseTracker");

const exerciseSchema = new mongoose.Schema({
  username: { type: String },
  userId: { type: String },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: String },
  dateFormat: { type: Date },
});

module.exports = myDB.model("exercise", exerciseSchema);
