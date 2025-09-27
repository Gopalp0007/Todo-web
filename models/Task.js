const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  priority: { type: String, enum: ["high", "medium", "low"], default: "low" },
  done: { type: Boolean, default: false }
});

module.exports = mongoose.model("Task", taskSchema);
