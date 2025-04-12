const mongoose = require("mongoose");
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    title: {
      type: String,
      default: "New Addition",
      trim: true,
      minlength: 5,
      maxlength: 50,
    },
    description: {
      type: String,
      default: "<p>To stay representative of framework & new example apps.</p>",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

todoSchema.index({ title: "text" });

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
