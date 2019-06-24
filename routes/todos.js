const express = require("express");
const router  = express.Router();
const middleware = require("../middleware");

const { Todo, Note, sequelize } = require("../sequelize");
const { body, check } = require("express-validator/check");
const validator = require("validator");


function checkDateValiditiy(value)
{
    if (value === undefined) {
        // Indicates the success of this synchronous custom validator
        return true;
    }
    else
    {
        if(!validator.isISO8601(value))
        {
            throw new Error("Not a valid ISO date");
        }

        return true;
    }
}

const checks =
    [
        check("title").isLength({ min: 1, max: 25 }),

        // If description is not there in the request JSON this check seems to have no effect
        check("description").isLength({ min: 0, max: 255 }),

        body("completion_target_date").custom(checkDateValiditiy),
        body("completion_date").custom(checkDateValiditiy)
    ];


// List all Todo items, GET : /todos
router.get("/", function(req, res)
{
    Todo.findAll()
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(todos => {
            var result = todos.map(todo => {
                return {
                    id: todo.id,
                    title: todo.title
                };
            });

            if(result.length === 0) throw error;
            res.json(result);
        })
        .catch(error => {
            // 404 — NOT FOUND, The requested resource could not be found
            res.statusCode = 404;
            res.json({ errors: ["Could not retrieve data"] });
        });
});

// Get a Todo item given its id, GET : /todos/:id
// The route also returns the total number of associated comments apart from the Todo item details 
router.get("/:id([0-9]+)", middleware.lookupTodoItem, function(req, res)
{
    res.json(req.todo);
});

// Get a Todo item given its id, GET : /todos/partial/:id
// The route also returns the total number of associated comments apart from the Todo item details 
router.get("/partial/:id([0-9]+)", middleware.lookupTodoItem, function(req, res)
{
   Todo.findByPk(req.params.id,
        {
            include:
            [
                { 
                    model: Note,
                    where: { todo_id: req.params.id },
                    required: false,
                    attributes: []
                }
            ],
            attributes:
            { 
                include: 
                [
                    [
                        sequelize.fn("COUNT",
                        sequelize.col("todo_id")),
                        "numberofnotes"
                    ]
                ]
            }
        })
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(todo => {
            if(todo == null) throw error;
            res.json(todo);
        })
        .catch(error => {
            // 404 — NOT FOUND, The requested resource could not be found
            res.statusCode = 404;
            res.json({ err: "Todo with id " + req.params.id + " doesn't exist." });
        });
});

// Get a Todo item given its id, GET : /todos/full/:id
// The route also returns the associated comments apart from the Todo item details 
router.get("/full/:id([0-9]+)", function(req, res)
{
    Todo.findByPk(req.params.id,
        { 
            include:
            [
                { 
                    model: Note,
                    where: { todo_id: req.params.id },
                    required: false
                }
            ]
        })
        .catch(error => {
            // 500 — INTERNAL SERVER ERROR, Unknown server error has occurred, not user's fault
            res.statusCode = 500;
            res.json({ errors: ["Internal Server error"] });
        })
        .then(todo => {
            if(todo == null) throw error;
            res.json(todo);
        })
        .catch(error => {
            // 404 — NOT FOUND, The requested resource could not be found
            res.statusCode = 404;
            res.json({ err: "Todo with id " + req.params.id + " doesn't exist." });
        });
});

// Create a new Todo, POST : /todos
router.post("/", checks, middleware.validateChecks, function(req, res)
{
    // Ref : http://docs.sequelizejs.com/class/lib/model.js~Model.html
    Todo.create(req.body)
        .catch(error => {
            // If our model is incorrectly mapped or we violate a db constraint which is not caught
            // by the express validator checks, we can land up here
            // 400 — BAD REQUEST, The request was malformed or invalid
            res.statusCode = 400;
            res.json({ errors: error.errors.map(e => { return e.message }) });
        })
        .then(todo => res.json(todo));
});

// Edit an existing Todo item, PUT : /todos/:id
router.put("/:id([0-9]+)", checks, middleware.validateChecks, middleware.lookupTodoItem, function(req, res)
{
    req.todo.update(req.body)
        .catch(error => {
            // A completely invalid JSON seems to not update the corresponding record in the model, so
            // will we come here ever, TODO : revisit
            
            // 400 — BAD REQUEST, The request was malformed or invalid
            res.statusCode = 400;
            res.json({ errors: error.errors.map(e => { return e.message }) });
        })
        .then(todo => {
            res.json(todo);
        });
});

// Delete an existing Todo item, DELETE : /todos/:id
router.delete("/:id([0-9]+)", middleware.lookupTodoItem, function(req, res)
{
    req.todo.destroy(null)
        .then(todo => {
            res.json(todo);
        });
});


module.exports = router;