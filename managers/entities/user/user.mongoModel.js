const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude the 'password' field from query results
  },
  role: {
    type: String,
    enum: ["super_admin", "school_admin", "student"],
    default: "student",
  },
});

// Create the User model
module.exports = mongoose.model("User", userSchema);
