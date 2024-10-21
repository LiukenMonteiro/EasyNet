const Joi = require('joi');

const equipmentSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    ip: Joi.string().ip({version: ['ipv4']}).required(),
    type: Joi.string().valid('Router', 'Switch', 'Firewall').required(),
    configurations: Joi.string().optional()
});

const validateEquipment = (data) => {
    return equipmentSchema.validate(data);
};

module.exports = validateEquipment;