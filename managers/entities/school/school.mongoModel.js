const mongoose = require("mongoose");

const schoolSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  administrator: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("School", schoolSchema);
