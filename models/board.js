const mongoose = require("mongoose");
const boardSchema = new mongoose.Schema({
  title: String,
  tasks: [
    {
      title: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true, 
        enum: ["todo", "doing", "done"],
      },
      priority: {
        type: String,
        required:true,
        enum:["low","normal","high"]
      }
    },
  ],
  created: {
    type:Date,
    default: Date.now()
  }
});
module.exports = mongoose.model("Board", boardSchema);
