const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interface = sequelize.define('Interface', {
    vendor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    interfaceName: {
        type: DataTypes.STRING,
        allowNull: false
    } 
});

module.exports = Interface;