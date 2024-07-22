const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const cors = require("cors");
const app = express();

app.use(cors());
const port = 3000;
const dataFile = path.join(__dirname, "todo.json");

app.use(express.json());

// Helper function to read tasks from file
async function readTasks() {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return an empty array
    return [];
  }
}

// Helper function to write tasks to file
async function writeTasks(tasks) {
  await fs.writeFile(dataFile, JSON.stringify(tasks, null, 2));
}

// GET all tasks
app.get("/", async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// POST a new task
app.post("/", async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  const tasks = await readTasks();
  const newTask = {
    id: Date.now(),
    title,
    completed: false,
  };
  tasks.push(newTask);
  await writeTasks(tasks);
  res.status(201).json(newTask);
});

// PUT to update a task
app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (title) {
    tasks[taskIndex].title = title;
  }
  await writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// PATCH to mark a task as completed
app.patch("/:id/complete", async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks[taskIndex].completed = true;
  await writeTasks(tasks);
  res.json(tasks[taskIndex]);
});

// DELETE a task
app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(taskIndex, 1);
  await writeTasks(tasks);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Todo List API running on port ${port}`);
});
