const express = require('express');
const router = express.Router();
const validateTemplate = require('../validators/templateValidator');
const Template = require('../models/Template');

router.post('/templates', async (req, res) => {
    const { error } = validateTemplate(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    try {
        const newTemplate = await Template.create(req.body);
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar template', err });
    }
});

module.exports = router;