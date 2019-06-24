// All the middleare goes here
var middlewareObj = {};

const { Todo, Note } = require("../sequelize");
const { validationResult } = require("express-validator/check");


middlewareObj.lookupTodoItem = function (req, res, next)
{
    Todo.findByPk(req.params.id)
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(todo => {
            if(todo == null) throw error;
            req.todo = todo;
            next();
        })
        .catch(error => {
            // 404 — NOT FOUND, The requested resource could not be found
            res.statusCode = 404;
            res.json({ err: "Todo with id " + req.params.id + " doesn't exist." });
        });
}

middlewareObj.lookupNote = function (req, res, next)
{
    Note.findByPk(req.params.noteid)
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(note => {
            if(note == null) throw error;
            req.note = note;
            next();
        })
        .catch(error => {
            // 404 — NOT FOUND, The requested resource could not be found
            res.statusCode = 404;
            res.json({ err: "Note with id " + req.params.noteid + " doesn't exist." });
        });
}


middlewareObj.validateChecks =  function (req, res, next)
{
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty())
    {
        // 422 — Unprocessable Entity
        return res.status(422).json({ errors: errors.array() });
    }

    next();
}


module.exports = middlewareObj;