const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true
  },
   password: {
    type: String, 
    required:true
  },
  boards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board"
  }],
  emailToken: {
    type: String,
  },
  image: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
