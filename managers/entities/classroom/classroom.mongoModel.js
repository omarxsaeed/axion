const mongoose = require("mongoose");

const classroomSchema = new mongoose.Schema({
  name: { type: String, required: true },

  school: { type: mongoose.Schema.Types.ObjectId, ref: "School" },

  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Classroom", classroomSchema);
