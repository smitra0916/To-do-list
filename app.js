// app.js

const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/todoapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a schema for tasks
const taskSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model('Task', taskSchema);

// Create express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('index', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/add', async (req, res) => {
  try {
    const taskName = req.body.task;
    const newTask = new Task({ name: taskName });
    await newTask.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/delete', async (req, res) => {
  try {
    const taskId = req.body.taskId;
    await Task.findByIdAndRemove(taskId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

