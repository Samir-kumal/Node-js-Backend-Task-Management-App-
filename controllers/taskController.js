const Task = require("../models/task");
const Board = require("../models/board");
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
const getTasks = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findById(boardId).populate("tasks");
    if (!board) return res.status(404).json({ message: "Board not found" });
    if (board.tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
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
module.exports = { createTask, getTasks, updateTask, deleteTask };
