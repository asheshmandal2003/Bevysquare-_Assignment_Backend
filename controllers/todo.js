const Todo = require("../models/todo.js");
const CustomError = require("../utils/CustomeError.js");

/**
 * @desc Get all todos
 * @route GET /api/v1/todos
 * @access Public
 */
const getTodos = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    if (page < 1) {
      throw new CustomError("Page number must be greater than 0", 400);
    }

    if (limit < 1 || limit > 10) {
      throw new CustomError("Limit must be between 1 and 10", 400);
    }

    const skip = (page - 1) * limit;
    const [todos, total] = await Promise.all([
      Todo.find().skip(skip).limit(limit),
      Todo.countDocuments(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const response = {
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.log("Error in getTodos:", error);
    next(error);
  }
};

/**
 * @desc Create a new todo
 * @route POST /api/v1/todos
 * @access Public
 */
const createTodo = async (req, res, next) => {
  try {
    const newTodo = await Todo.create({});
    await newTodo.save();

    res.status(200).json({
      message: "Todo created successfully",
      id: newTodo._id,
    });
  } catch (error) {
    console.log("Error in createTodo:", error);
    next(error);
  }
};

/**
 * @desc Get a todo
 * @route GET /api/v1/todos/:id
 * @access Public
 */
const getTodo = async (req, res, next) => {
  try {
    const id = req.params?.id;

    if (!id || id.trim() === "") {
      throw new CustomError("Todo ID is required", 400);
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      throw new CustomError("Todo not found", 404);
    }
    res.status(200).json(todo);
  } catch (error) {
    console.log("Error in getTodo:", error);
    next(error);
  }
};

/**
 * @desc Update a todo title
 * @route PUT /api/v1/todos/:id/title
 * @access Public
 */
const updateTodoTitle = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!id || id.trim() === "") {
      throw new CustomError("Todo ID is required", 400);
    }
    const title = req.body?.title;
    if (
      !title ||
      title.trim() === "" ||
      title.length < 5 ||
      title.length > 50
    ) {
      throw new CustomError("Title is required", 400);
    }
    const todo = await Todo.findByIdAndUpdate(id, { title }, { new: true });
    if (!todo) {
      throw new CustomError("Todo not found", 404);
    }
    res.status(203).json({
      message: "Title updated successfully",
    });
  } catch (error) {
    console.log("Error in updateTodo:", error);
    next(error);
  }
};

/**
 * @desc Update a todo description
 * @route PUT /api/v1/todos/:id/description
 * @access Public
 */
const updateTodoDescription = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!id || id.trim() === "") {
      throw new CustomError("Todo ID is required", 400);
    }
    await Todo.findByIdAndUpdate(id, { description: req.body?.description });

    res.status(204).json({
      message: "Changes saved",
    });
  } catch (error) {
    console.log("Error in updateTodo:", error);
    next(error);
  }
};

/**
 * @desc Delete a todo
 * @route DELETE /api/v1/todos/:id
 * @access Public
 */
const deleteTodo = async (req, res, next) => {
  try {
    const id = req.params?.id;
    if (!id || id.trim() === "") {
      throw new CustomError("Todo ID is required", 400);
    }

    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      throw new CustomError("Todo not found", 404);
    }
    res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteTodo:", error);
    next(error);
  }
};

/**
 * @description Search for todos by title
 * @route GET /api/v1/todos/search
 * @access Public
 */
const searchTodo = async (req, res, next) => {
  try {
    const query = req.query?.query;

    if (!query || query.trim() === "") {
      throw new CustomError("Search term is required", 400);
    }

    const todos = await Todo.find({ $text: { $search: query.trim() } })
      .limit(10)
      .sort({ createdAt: -1 })
      .select("_id title");

    res.status(200).json({
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    console.error("Search error:", error);
    next(error);
  }
};

/**
 * @description Search for todos by title using regex
 * @route GET /api/v1/todos/search/name
 * @access Public
 */

const searchTodoByName = async (req, res, next) => {
  try {
    const query = req.query?.query;

    if (!query || query.trim() === "") {
      throw new CustomError("Search term is required", 400);
    }

    const todos = await Todo.find({
      title: { $regex: query.trim(), $options: "i" },
    })
      .limit(10)
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Search results",
      data: todos,
    });
  } catch (error) {
    console.error("Search error:", error);
    next(error);
  }
};

module.exports = {
  getTodos,
  createTodo,
  getTodo,
  updateTodoTitle,
  updateTodoDescription,
  deleteTodo,
  searchTodo,
  searchTodoByName,
};
