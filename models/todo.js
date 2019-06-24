module.exports = (sequelize, Sequelize) =>
{
    return sequelize.define('todo', {
        // attributes
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        creation_date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        completion_target_date: {
            type: Sequelize.DATE
            // allowNull defaults to true
        },
        completion_date: {
            type: Sequelize.DATE
            // allowNull defaults to true
        }
        }, {
            // options
        });
};