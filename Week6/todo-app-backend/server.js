// Importing required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Creating an instance of Express
const app = express();

// Loading environment variables from a .env file into process.env
require("dotenv").config();

// Importing the Firestore database instance from firebase.js
const db = require("./firebase");

// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Firebase Admin Authentication Middleware
const auth = (req, res, next) => {
  try {
    const tokenId = req.get("Authorization").split("Bearer ")[1];
    admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        req.token = decoded;
        next();
      })
      .catch((error) => res.status(401).send(error));
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Your API routes will go here...

// GET: Endpoint to retrieve all tasks
app.get("/tasks", async (req, res) => {
  try {
    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// GET: Endpoint to retrieve all tasks for a user
app.get("/tasks/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching tasks for user:", userId);
    
    // Get ALL tasks first
    const snapshot = await db.collection("tasks").get();
    
    let tasks = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Filter by user in JavaScript
      if (data.user === userId) {
        tasks.push({
          id: doc.id,
          ...data,
        });
      }
    });
    
    console.log(`Found ${tasks.length} tasks for user ${userId}`);
    res.status(200).send(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send(error.message);
  }
});

// POST: Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  try {
    const taskData = req.body;
    
    console.log("Received task data:", taskData);
    
    const addedTask = await db.collection("tasks").add(taskData);
    
    console.log("Task added with ID:", addedTask.id);
    
    res.status(201).send({
      id: addedTask.id,
      ...taskData,
    });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE: Endpoint to remove a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.collection("tasks").doc(id).delete();
    
    res.status(200).send({ 
      message: "Task deleted successfully",
      id: id 
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Start server (Vercel will handle this in production)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;