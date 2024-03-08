const Board = require("../models/board");
const User = require("../models/user");
const createTask = async (req, res) => {
  const { boardId } = req.params;
  console.log("hello");
  const { title, content, status, priority } = req.body;
  if (!boardId) {
    return res.status(400).json({ message: "boardId not provided" });
  }
  if (!title || !content || !status || !priority) {
    return res
      .status(400)
      .json({ message: "Title, content, status and priority  are required" });
  } 
  try {
    const newTask = { title, content, status, priority };
    const board = await Board.findById(boardId);
    board.tasks.push(newTask);
    await board.save();
    return res.status(200).json({ message: "Task created successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const getAllTaskItems = async (req, res) => {
  const { userId } = req.params;
  console.log(userId);
  try {
    const allTasks = await Board.aggregate([
      {
        $match: { 
          _id: { $in: (await User.findById(userId)).boards }
        }
      },
      {
        $unwind: "$tasks"
      },
      {
        $replaceRoot: { newRoot: "$tasks" }
      }
    ]);

    return res.status(200).json(allTasks);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTasks = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    return res.status(200).json(board.tasks);
  } catch (err) {
    console.log(err.message);
  }
};

const deleteTask = async (req, res) => {
  const { boardId, taskId } = req.params;
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board does not exist" });
    }
    const taskIndex = board.tasks.findIndex((task) => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found in the board" });
    }
    board.tasks.splice(taskIndex, 1);
    await board.save();

    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
const updateTask = async (req, res) => {
  const { taskId, boardId } = req.params;
  console.log("taskId", taskId, "boardId", boardId);
  const { title, content, status, priority } = req.body;
  if (!title || !content || !status || !priority) {
    return res
      .status(400)
      .json({ message: "Title, content, status and priority are required" });
  }
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not Found" });
    }
    const taskIndex = board.tasks.findIndex((task) => task._id.toString() === taskId);
    if (taskIndex === -1) {
      return res.status(404).json(taskIndex );
    }

    board.tasks[taskIndex].title = title;
    board.tasks[taskIndex].content = content;
    board.tasks[taskIndex].status = status;
    board.tasks[taskIndex].priority= priority;

    await board.save();
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};
module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTaskItems,
};
