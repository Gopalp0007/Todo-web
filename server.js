const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

// View Engine
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Connection (local)
mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const taskSchema = new mongoose.Schema({
    name: String,
    priority: String,
    done: Boolean
});

const Task = mongoose.model("Task", taskSchema);

// Home Route
app.get("/", function (req, res) {
    Task.find({}, function (err, foundItems) {
        if (err) {
            console.log(err);
        } else {
            res.render("list", { tasks: foundItems });
        }
    });
});

// Add 
app.post("/add", function (req, res) {
    const taskName = req.body.ele1;
    const priority = req.body.priority || "low";

    const newTask = new Task({
        name: taskName,
        priority: priority,
        done: false
    });

    newTask.save();
    res.redirect("/");
});

// Delete
app.post("/delete", function (req, res) {
    const check = req.body.id;
    Task.findByIdAndRemove(check, function (err) {
        if (!err) {
            console.log("Deleted");
            res.redirect("/");
        }
    });
});

// Toggle
app.post("/toggle", function (req, res) {
    const id = req.body.id;
    Task.findById(id, function (err, task) {
        if (!err && task) {
            task.done = !task.done;
            task.save();
            res.redirect("/");
        }
    });
});

// Edit
app.post("/edit", function (req, res) {
    const id = req.body.id;
    const newText = req.body.newText;

    if (newText.trim() !== "") {
        Task.findByIdAndUpdate(id, { name: newText }, function (err) {
            if (!err) {
                console.log("Updated");
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});

// Filter Priority
app.get("/filter", function (req, res) {
    const priority = req.query.priority;
    let query = {};
    if (priority) {
        query.priority = priority;
    }

    Task.find(query, function (err, foundItems) {
        if (!err) {
            res.render("list", { tasks: foundItems });
        }
    });
});

// Server
app.listen(3000, function () {
    console.log("✅ Server started at http://localhost:3000");
});

