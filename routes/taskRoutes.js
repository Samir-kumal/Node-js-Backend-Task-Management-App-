const express = require("express");
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
router.route("/tasks/:boardId").get(getTasks);
router.route("/createTask/:boardId").post(createTask);
router.route("/updateTask/:taskId").put(updateTask);
router.route("/deleteTask/:taskId").delete(deleteTask);
module.exports = router;