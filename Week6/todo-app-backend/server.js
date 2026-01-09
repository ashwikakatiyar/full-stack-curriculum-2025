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
const { admin } = require("./firebase");


//middleware
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
app.get("/", async (req, res) => {
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
  try {
    const userId = req.token.uid;

    const snapshot = await db
      .collection("tasks")
      .where("user", "==", userId)
      .get();

    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// POST: Endpoint to add a new task
app.post("/tasks", async (req, res) => {
  try {
    const newTask = {
      user: req.body.user,
      name: req.body.name,
      finished: false,
    }

    const docRef = await db.collection("tasks").add(newTask);

    const createdTask = {
      id: docRef.id,
      ...newTask,
    }

    res.status(201).send(createdTask);
  } catch (error) {
    res.status(500).send(error.message);
  }
})

// DELETE: Endpoint to remove a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
      res.status(404).send({ message: "Task not found" });
    } else {
      await taskRef.delete();
      res.status(200).send({ id, ...taskSnapshot.data() });
    }
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