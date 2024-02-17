const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: { type: String, required: true, enum: ["todo", "doing", "done"] },
});
module.exports = mongoose.model("Task", taskSchema);
