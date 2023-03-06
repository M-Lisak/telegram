const {Sequelize} = require('sequelize');

module.exports = new Sequelize(
    'postgres1',//'postgres',
    'postgres1',//'postgres',
    'root',
    {
        host: '5.188.76.226',// host: 'localhost',
        port: '6432',
        dialect: 'postgres'
    }
)
