const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Config = sequelize.define('Config', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    equipmentName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    script: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    templateId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Template',
            key: 'id'
        }
    }
});

module.exports = Config;