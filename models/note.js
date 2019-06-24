module.exports = (sequelize, Sequelize) =>
{
    return sequelize.define('note', {
        // attributes
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        todo_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        note_text: {
            type: Sequelize.STRING,
            allowNull: false
        },
        creation_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
        }, {
            // options
            underscored: true
        });
};