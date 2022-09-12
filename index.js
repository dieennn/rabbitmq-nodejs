const express = require("express");
require("dotenv").config();

const clientToDo = require("./worker-todo.js");
const db = require("./models/todo.js");
const mq = require("./services/MQService");

const app = express();

app.use(express.json());
const PORT = 3000;

// create listening req.create.todo
clientToDo();

app.post(
  "/send",
  (req, res, next) => {
    if (req.body.name) {
      next();
    } else {
      res.status(400).json({ message: "name is required" });
    }
  },
  (req, res) => {
    const body = {
      name: req.body.name,
    };
    mq.publishToQueue("req.create.todo", body);
    res.status(200).json(req.body);
  }
);

app.post(
  "/delete",
  (req, res, next) => {
    if (req.body.id) {
      next();
    } else {
      res.status(400).json({ message: "id is required" });
    }
  },
  (req, res) => {
    const body = {
      id: req.body.id,
    };
    mq.publishToQueue("req.delete.todo", body);
    res.status(200).json(req.body);
  }
);

app.get("/", async (req, res) => {
  res.status(200).json(JSON.parse(await db.read()));
});

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
