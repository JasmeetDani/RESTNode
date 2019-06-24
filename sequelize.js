const SequelizeORM = require("sequelize");

const TodoModel = require("./models/todo")
const NoteModel = require("./models/note")


// Change connection settings according to MYSQl setup
const sequelize = new SequelizeORM('test', 'foo', 'bar', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    define: {
        // The `timestamps` field specify whether or not the `createdAt` and `updatedAt` fields will be created.
        timestamps: false
    }
});


// Pass in sequelize instance and library itself to the models
const Todo = TodoModel(sequelize, SequelizeORM);
const Note = NoteModel(sequelize, SequelizeORM);


Todo.hasMany(Note);


module.exports = { Todo, Note, sequelize };