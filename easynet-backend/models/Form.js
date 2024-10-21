const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Form = sequelize.define('Form', {
    forName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fields: {
        type: DataTypes.STRING,
        allowNull: false
    },
    templateId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Form;