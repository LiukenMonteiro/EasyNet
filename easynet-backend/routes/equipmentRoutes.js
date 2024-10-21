const express = require('express');
const router = express.Router();
const validateEquipment = require('../validators/equipmentValidator')
// const equipmentController = require('../controllers/equipmentController');
const Equipment = require('../models/Equipment');

// router.post('/create', equipmentController.createEquipment);

router.post('equipments', async (req, res) => {
    const { error } = validateEquipment(req.body);

    if (error) {
        res.status(400).send(error.details[0].message);
    }
    try {
        const newEquipment = await Equipment.create(req.body);
        res.status(201).json(newEquipment);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar equipamento', err });
    }
});

module.exports = router;