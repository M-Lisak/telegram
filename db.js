const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'postgres',
    'postgres',
    'root',
    {
        host: 'localhost',
        dialect: 'postgres'
    }
)
