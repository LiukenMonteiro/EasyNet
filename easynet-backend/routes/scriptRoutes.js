// routes/scriptRoutes.js
const express = require('express');
const fs = require('fs'); 
const path = require('path');
const Script = require('../models/Script');
const { generateScript } = require('../utils/generateScript');
const { compareScripts } = require('../utils/compareScripts');
const scriptController = require('../controllers/scriptController');
const router = express.Router();
const authenticateBasic = require('../middleware/auth'); // Mantenha a importação


// Rota de geração de script
router.post('/generate', authenticateBasic, async (req, res) => {
    const { template, fields } = req.body;

    if (!template) {
        return res.status(400).json({ message: 'Template não fornecido' });
    }

    if (!fields || typeof fields !== 'object') {
        return res.status(400).json({ message: 'Fields não fornecidos ou inválidos' });
    }

    const scriptPath = path.join(__dirname, '../templates', `${template}.txt`);

    fs.access(scriptPath, fs.constants.F_OK, async (err) => {
        if (err) {
            console.error(`Template não encontrado: ${scriptPath}`);
            return res.status(404).json({ message: 'Template não encontrado' });
        }    

        try {
            const script = generateScript(scriptPath, fields);
            // console.log(fields)
            const newScript = await Script.create({ name: fields.NOME, content: script });
            

            return res.status(201).json({ script, storedScript: newScript });
        } catch (error) {
            console.error('Erro ao gerar o script ou ao salvar no banco de dados:', error);
            return res.status(500).json({ message: 'Erro ao gerar o script ou ao salvar no banco de dados' });
        }
    });
});

// Rota de comparação de scripts
router.post('/compare', authenticateBasic, (req, res) => {
    const { script1, script2 } = req.body;

    if (!script1 || !script2) {
        return res.status(400).json({ message: 'Ambos os scripts devem ser fornecidos' });
    }

    const differences = compareScripts(script1, script2);
    res.json(differences);
});

// Rota para adicionar um novo script
router.post('/add', authenticateBasic, async (req, res) => {
    const { name, content } = req.body;

    try {
        const newScript = await Script.create({ name, content });
        res.status(201).json(newScript);
    } catch (error) {
        console.error('Erro ao adicionar script:', error);
        res.status(500).json({ message: 'Erro ao adicionar script' });
    }
});

// Rota para deletar um script pelo ID
router.delete('/delete/:id', authenticateBasic, async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedScript = await Script.destroy({ where: { id } });
        
        if (deletedScript) {
            const remainingScripts = await Script.findAll();
            if (remainingScripts.length === 0) {
                await Script.sequelize.query('ALTER TABLE Scripts AUTO_INCREMENT = 1');
                console.log('Contador de IDs resetado.');
            }
            res.status(200).json({ message: `Script com ID ${id} deletado com sucesso.` });
        } else {
            res.status(404).json({ message: `Script com ID ${id} não encontrado.` });
        }
    } catch (error) {
        console.error('Erro ao deletar script:', error);
        res.status(500).json({ message: 'Erro ao deletar script' });
    }
});

router.put('/edit/:id', authenticateBasic, async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;

    try {
        const updatedScript = await Script.update(
            { name, content },
            { where: { id } }
        );

        if (updatedScript[0] > 0) {
            res.status(200).json({ message: 'Script atualizado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Script não encontrado.' });
        }
    } catch (error) {
        console.error('Erro ao atualizar script:', error);
        res.status(500).json({ message: 'Erro ao atualizar script' });
    }
});

// Rotas adicionais
router.get('/test', (req, res) => {
    res.send('Rota de teste funcionando!');
});

router.get('/list', authenticateBasic, scriptController.listScripts);
router.post('/', authenticateBasic, scriptController.createScript);
router.get('/backup/download', authenticateBasic, scriptController.downloadBackup);

module.exports = router;
