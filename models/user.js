const mongoose = require("mongoose");
const exercise = require("./exercise");

const myDB = mongoose.connection.useDb("ExerciseTracker");

const userSchema = new mongoose.Schema({
  username: { type: String },
  // exercise: {
  //   type: [
  //     {
  //       description: { type: String},
  //       duration: { type: Number },
  //       date: { type: String },
  //     },
  //   ],
  // },
});

module.exports = myDB.model("user", userSchema);
