const Task = require("../models/task");
const Board = require("../models/board");
const User = require("../models/user")
const createTask = async (req, res) => {
  const { boardId } = req.params;
  const { title, content, status } = req.body;
  if (!boardId) {
    return res.status(400).json({ message: "boardId not provided" });
  }
  if (!title || !content || !status) {
    return res
      .status(400)
      .json({ message: "Title, content and status are required" });
  }
  try {
    const newTask = new Task({ title, content, status });
    await newTask.save();
    const board = await Board.findById(boardId);
    board.tasks.push(newTask);
    await board.save();
    return res.status(200).json({ message: "Task created successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const getAllTasks = async(req, res) =>{
  const {userId} = req.params;
  try {
    const tasks = await Task.find();
    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    return res.status(200).json(tasks);
  } catch (err) {
    console.log(err.message);
  }

}
const getAllTaskItems = async (req, res) => {
  const { userId } = req.params;
  console.log(userId)
  try {
    const allTasks = await Board.aggregate([
      {
        $match: { 
          _id: { $in: (await User.findById(userId)).boards }
        }
      },
      {
        $lookup: {
          from: "tasks",
          localField: "tasks",
          foreignField: "_id",
          as: "tasks"
        }
      },
      {
        $project: {
          tasks: 1
        }
      },
      {
        $unwind: "$tasks"
      },
      {
        $replaceRoot: { newRoot: "$tasks" }
      }
    ]);

    if (allTasks.length > 0) {
      return res.status(200).json(allTasks);
    } else {
      return res.status(404).json({ message: "No tasks found" });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId).populate("tasks");
    if (!board) return res.status(404).json({ message: "Board not found" });
    
    return res.status(200).json(board.tasks);
  } catch (err) {
    console.log(err.message);
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    await Task.findByIdAndDelete(taskId);
   return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, content, status } = req.body;
  if (!title || !content || !status) {
    return res
      .status(400)
      .json({ message: "Title, content and status are required" });
  }
  try {
    const task = await Task.findById(taskId);
    task.title = title;
    task.content = content;
    task.status = status;
    await task.save();
   return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = { createTask, getTasks,getAllTasks, updateTask, deleteTask,getAllTaskItems };
