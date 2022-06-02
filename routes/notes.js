const notes = require("express").Router();
const { readFromFile, readAndAppend, writeToFile } = require("../helpers/fsUtils");
const { v4: uuidv4 } = require("uuid");

notes.get("/notes", (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notes.post("/notes", (req, res) => {
  console.info(`${req.method} request received to add note`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      feedback_id: uuidv4(),
    };
    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting feedback");
  }
});

notes.delete("/notes/:id", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    const notes = JSON.parse(data);
    console.log(notes)
    const note = notes.find((c) => c.feedback_id === req.params.id);
    if (!note) return res.status(404).send("Note with given id not found");
    const index = notes.indexOf(note);
    console.log(index)
    notes.splice(index, 1);

    writeToFile("./db/db.json", notes)
    res.send(`note deleted`);
  });
});
module.exports = notes;