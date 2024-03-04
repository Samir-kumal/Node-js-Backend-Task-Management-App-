const Board = require("../models/board");
const User = require("../models/user");
const Task = require("../models/task");
const createBoard = async (req, res) => {
  const { title } = req.body;
  const { userId } = req.params;
  if (!title) return res.status(400).json({ message: "Title is required" });
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });

    const newBoard = new Board({ title, tasks:[] });
    await newBoard.save();
    user.boards.push(newBoard);
    await user.save();
    return res.status(200).json({ message: "Board created successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const getBoards = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("boards");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.boards) {
     return res.status(200).json(user.boards);
    }
    return res.status(404).json({ message: "No boards found" });
  } catch (err) {
    console.log(err.message);
  }
};

const updateBoard = async (req, res) => {
  const { boardId } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });
  if (!boardId) return res.status(400).json({ message: "BoardId is required" });
  try {
    const board = await Board.findById(boardId);
    if (!board) return res.status(400).json({ message: "Board not found" });
    board.title = title;
    await board.save();
    return res.status(200).json({ message: "Board updated successfully" });
  } catch (err) {
    console.log(err.message);
  }
};

const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  if (!boardId) return res.status(400).json({ message: "BoardId is required" });
  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    // Check if the 'board' object is null before accessing its 'tasks' property

    // Delete the boardddd
    await Board.findByIdAndDelete(boardId);
    return res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createBoard, getBoards, updateBoard, deleteBoard };
