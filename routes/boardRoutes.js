const express = require("express");
const router = express.Router();
const {
  createBoard,
  getBoards,

  updateBoard,
  deleteBoard,
} = require("../controllers/boardController");

router.route("/boards/:userId").get(getBoards);
router.route("/createBoard/:userId").post(createBoard);
router.route("/updateBoard/:boardId").put(updateBoard);
router.route("/deleteBoard/:boardId").delete(deleteBoard);

module.exports = router;
