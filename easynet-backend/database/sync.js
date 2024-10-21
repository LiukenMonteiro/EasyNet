// database/sync.js
const sequelize = require('../config/database');
const Equipment = require('../models/Equipment');
const Template = require('../models/Template');

const defineAssociations = () => {
    Equipment.hasMany(Template, {
        foreignKey: 'equipmentId',
        as: 'templates'
    });

    Template.belongsTo(Equipment, {
        foreignKey: 'equipmentId',
        as: 'equipment'
    });
};

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso!');

        defineAssociations();

        await sequelize.sync();
        console.log('Tabelas criadas ou atualizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } finally {
        await sequelize.close();
    }
};

testConnection();
