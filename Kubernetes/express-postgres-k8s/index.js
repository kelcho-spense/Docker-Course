const express = require('express');
const Todo = require('./todo.model');

const app = express();
app.use(express.json());

app.get('/', async (req,res) => {
    res.status(200).json({message: "hello, server running"})
})

// Create a new to-do
app.post('/todos', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all to-dos
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.status(200).json(todos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single to-do by ID
app.get('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: 'To-do not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a to-do
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.update(req.body);
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: 'To-do not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a to-do
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (todo) {
      await todo.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'To-do not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});