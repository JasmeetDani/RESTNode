const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Requiring routes
const todoRoutes = require("./routes/todos");
const notesRoutes = require("./routes/notes");


// Below should go before the routes config
app.use(bodyParser.json({ type : "application/json" }));


app.use("/todos", todoRoutes);
app.use("/todos/:id([0-9]+)/notes", notesRoutes);


app.listen(9000, function()
{
    console.log("Server has started...");
});