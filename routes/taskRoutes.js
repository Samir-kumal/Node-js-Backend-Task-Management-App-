const express = require("express");
const router = express.Router();
const { createTask, getTasks,getAllTaskItems, updateTask, deleteTask } = require("../controllers/taskController");
router.route("/tasks/:boardId").get(getTasks);
router.route("/:userId/allTaskItems").get(getAllTaskItems);
router.route("/createTask/:boardId").post(createTask);
router.route("/updateTask/:boardId/:taskId").put(updateTask);
router.route("/deleteTask/:boardId/:taskId").delete(deleteTask);
module.exports = router;