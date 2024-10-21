const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Template = require('./Template');

const Equipment = sequelize.define('Equipment', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    configurations: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

// Equipment.hasMany(Template, {
//     foreignKey: 'equipmentId',
// });

module.exports = Equipment;