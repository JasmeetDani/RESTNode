const express = require("express");
const router  = express.Router({ mergeParams: true });
const middleware = require("../middleware");

const { Todo, Note } = require("../sequelize");
const { check } = require("express-validator/check");

const checks =
    [
        check("todo_id").isInt(),
        check("note_text").isLength({ min: 1, max: 255 })
    ];


// List all Notes for the given Todo item, GET : /todos/:id/notes
router.get("/", function(req, res)
{
    Note.findAll(
        { 
            where: { todo_id: req.params.id }
        })
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(data => {
            if(data.length == 0) throw error;
            res.json(data);
        })
        .catch(error => res.status(400).json({ err: "Todo with id " + req.params.id + " doesn't exist." }));
});

// Get a Note given its id and its parent Todo item id, GET : /todos/:id/notes/:noteid
router.get("/:noteid([0-9]+)", middleware.lookupNote, function(req, res)
{
    res.json(req.note);
});

// Create a new Note, POST : /todos/:id/notes
router.post("/", checks, middleware.validateChecks, function(req, res)
{
    // Ref : http://docs.sequelizejs.com/class/lib/model.js~Model.html
    Note.create(req.body)
        .catch(error => {
            // 400 — BAD REQUEST, The request was malformed or invalid
            res.statusCode = 400;
            if(error.errors != undefined)
            {
                res.json({ errors: error.errors.map(e => { return e.message }) });
            }
            else
            {
                // Foreign key violation here
                // The operation is still incrementing the ID primary key field
                res.json({ errors: error.original.sqlMessage });
            }
        })
        // If todo_id is a string convertible to an int, the create succeeds with the json returned containing the 
        // former as a string
        .then(note => res.json(note));
});

// Edit an existing Note given its id and its parent Todo item id, PUT : /todos/:id/notes/:noteid
router.put("/:noteid([0-9]+)", checks, middleware.validateChecks, middleware.lookupNote, function(req, res)
{
    req.note.update(req.body)
        .catch(error => {
            // 400 — BAD REQUEST, The request was malformed or invalid
            res.statusCode = 400;
            if(error.errors != undefined)
            {
                res.json({ errors: error.errors.map(e => { return e.message }) });
            }
            else
            {
                // Foreign key violation here
                res.json({ errors: error.original.sqlMessage });
            }
        })
        .then(note => {
            res.json(note);
        });
});

// Delete an existing Note given its id and its parent Todo item id, DELETE : /todos/:id/notes/:noteid
router.delete("/:noteid([0-9]+)", middleware.lookupNote, function(req, res)
{
    req.note.destroy(null)
        .then(note => {
            res.json(note);
        });
});


module.exports = router;