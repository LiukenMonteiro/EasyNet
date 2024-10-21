const Equipment = require('./models/Equipment');
const Template = require('./models/Template');

Equipment.hasMany(Template, {
    foreignKey: 'equipmentId',
    as: 'templates'
});

Template.belongsTo(Equipment, {
    foreignKey: 'equipmentId',
    as: 'equipment'
});
