const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 8080;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(storedNotes[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newConstructedNote = req.body;
    let uniqueID = (storedNotes.length).toString();
    newConstructedNote.id = uniqueID;
    storedNotes.push(newConstructedNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
    console.log("Note saved to db.json. Content: ", newConstructedNote);
    res.json(storedNotes);
})

app.delete("/api/notes/:id", function(req, res) {
    let storedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    storedNotes = storedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of storedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(storedNotes));
    res.json(storedNotes);
})

app.listen(port, function() {
    console.log(`Now listening to port ${port}. Enjoy your stay!`);
})