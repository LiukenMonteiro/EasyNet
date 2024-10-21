const Joi = require('joi');

const templateSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    content: Joi.string().min(5).required(),
    equipmentId: Joi.number().integer().required()
});

const validateTemplate = (data) => {
    return templateSchema.validate(data);
};

module.exports = validateTemplate;