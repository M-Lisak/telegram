const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const Tables = sequelize.define('tables', {
    id: {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true},
    key_API: {type: DataTypes.STRING},
    linkToTable: {type: DataTypes.STRING, unique: true},
})

module.exports = Tables;
