const Equipment = require('../models/Equipment');

exports.createEquipment = async (req, res) => {
    const { name, ip } = req.body;
    try {
        const equipment = await Equipment.create({ name, ip });
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar equipamento' });
    }
};