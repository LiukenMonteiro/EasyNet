const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
// const Equipment = require('../models/Equipment');

const Template = sequelize.define('Template', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// Template.belongsTo(Equipment, {
//     foreignKey: 'equipmentId',
//     as: 'equipment'
// });

module.exports = Template;