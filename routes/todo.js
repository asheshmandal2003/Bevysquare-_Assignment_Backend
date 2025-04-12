const express = require("express");
const {
  getTodos,
  createTodo,
  getTodo,
  deleteTodo,
  updateTodoDescription,
  updateTodoTitle,
  searchTodo,
  searchTodoByName,
} = require("../controllers/todo.js");

const router = express.Router();

router.get("/search", searchTodo);
router.get("/search/name", searchTodoByName);
router.route("/").get(getTodos).post(createTodo);
router.route("/:id/title").put(updateTodoTitle);
router.route("/:id/description").put(updateTodoDescription);
router.route("/:id").get(getTodo).delete(deleteTodo);

module.exports = router;
