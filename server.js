const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");

const app = express();

// EJS 
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// MongoDB 
mongoose.connect("mongodb://127.0.0.1:27017/todoapp", {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Home 
app.get("/", async (req, res) => {
  const tasks = await Task.find().lean();
  res.render("list", { items: tasks });
});

// Add 
app.post("/add", async (req, res) => {
  const { ele1, priority } = req.body;
  if (!ele1.trim()) {
    return res.send("<script>alert('Task cannot be empty!'); window.location.href='/'</script>");
  }
  await Task.create({ text: ele1, priority: priority || "low" });
  res.send("<script>alert('Task added successfully!'); window.location.href='/'</script>");
});

// Delete 
app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await Task.findByIdAndDelete(id);
  res.send("<script>alert('Task deleted successfully!'); window.location.href='/'</script>");
});

// Toggle Task
app.post("/toggle", async (req, res) => {
  const { id } = req.body;
  const task = await Task.findById(id);
  if (task) {
    task.done = !task.done;
    await task.save();
  }
  res.redirect("/");
});

// Edit 
app.post("/edit", async (req, res) => {
  const { id, newText } = req.body;
  if (newText.trim()) {
    await Task.findByIdAndUpdate(id, { text: newText });
    return res.send("<script>alert('Task updated successfully!'); window.location.href='/'</script>");
  }
  res.redirect("/");
});

// Priority
app.get("/filter", async (req, res) => {
  const { priority } = req.query;
  let tasks;
  if (priority) {
    tasks = await Task.find({ priority }).lean();
  } else {
    tasks = await Task.find().lean();
  }
  res.render("list", { items: tasks });
});

//  server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server started on http://localhost:${PORT}`));
