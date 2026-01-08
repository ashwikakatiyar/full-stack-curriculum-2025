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
const corsOptions = {
  origin: [
    'http://localhost:3000',  // Local development
    'https://todo-app-frontend-taupe.vercel.app',  // Your frontend URL
  ],
  credentials: true,
  optionsSuccessStatus: 200
};


//middleware
app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON body

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
app.get("/tasks/:user", auth, async (req, res) => {
    const user = req.params.user;

    // Verify the user can only access their own tasks
    if (req.token.uid !== user) {
      return res.status(403).send({ error: "Unauthorized access" });
    }

    try {
      const snapshot = await db.collection("tasks").where("user", "==", user).get();
      let tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.status(200).send(tasks);
    } catch (error) {
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
// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});