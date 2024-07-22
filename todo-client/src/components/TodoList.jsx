import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  const API_URL = "http://localhost:3000"; // Adjust if your API is on a different port

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      try {
        const response = await axios.post(`${API_URL}/`, {
          title: newTask,
        });
        setTasks([...tasks, response.data]);
        setNewTask("");
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const updateTask = async () => {
    if (editingTask && editingTask.title.trim() !== "") {
      try {
        const response = await axios.put(`${API_URL}/${editingTask.id}`, {
          title: editingTask.title,
        });
        setTasks(
          tasks.map((task) =>
            task.id === response.data.id ? response.data : task
          )
        );
        setEditingTask(null);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/complete`);
      setTasks(
        tasks.map((task) =>
          task.id === response.data.id ? response.data : task
        )
      );
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (task) => {
    setEditingTask({ ...task });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
            />
            {editingTask && editingTask.id === task.id ? (
              <>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
                <button onClick={updateTask}>Update</button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </span>
                <button onClick={() => startEditing(task)}>Edit</button>
              </>
            )}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
