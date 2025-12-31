require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // New
const app = express();

app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB!"))
    .catch(err => console.log("DB Connection Error:", err));

// Define what a "Todo" looks like in the database
const TodoSchema = new mongoose.Schema({ 
    task: String, 
    status: { 
        type: String, 
        default: 'active' // This automatically marks new tasks as 'active'
    } 
});

const Todo = mongoose.model('Todo', TodoSchema);

// GET: Fetch all todos
app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos); // This sends: [{_id: '123', task: 'Buy milk'}, ...]
});

// Add a new task
app.post('/api/todos', async (req, res) => {
  try {
    const { task } = req.body; // Getting the task text from the frontend
    const newTodo = new Todo({ task }); // Creating a new MongoDB document
    await newTodo.save(); // Saving to the database
    res.json(newTodo); // Sending the saved task back to frontend
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});
// Add this in backend/server.js
app.get('/', (req, res) => {
    res.send("Backend API is running. Go to /api/todos to see data.");
});

// POST: Save a new todo
// DELETE: Delete multiple selected tasks
app.post('/api/todos/delete-bulk', async (req, res) => {
    const { ids } = req.body;
    await Todo.deleteMany({ _id: { $in: ids } });
    const allTodos = await Todo.find();
    res.json(allTodos);
});

// PUT: Archive multiple selected tasks (we'll add a 'status' field)
app.post('/api/todos/archive-bulk', async (req, res) => {
    const { ids } = req.body;
    // We update the 'status' to archived
    await Todo.updateMany({ _id: { $in: ids } }, { status: 'archived' });
    const allTodos = await Todo.find();
    res.json(allTodos);
});

// DELETE: Remove a task by its ID
app.delete('/api/todos/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    const allTodos = await Todo.find();
    res.json({ message: "Deleted!", todos: allTodos });
});

// UPDATE: Edit an existing task by its ID
// UPDATE: Bulk save edited tasks
app.put('/api/todos/bulk-save', async (req, res) => {
    const { updates } = req.body; // Array of {id, task}
    const promises = updates.map(u => Todo.findByIdAndUpdate(u.id, { task: u.task }));
    await Promise.all(promises);
    const allTodos = await Todo.find();
    res.json(allTodos);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));