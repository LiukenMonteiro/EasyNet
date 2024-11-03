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
// routes/scripts.js
router.post('/generate', authenticateBasic, async (req, res) => {
    const { template, fields, name } = req.body;

    console.log('Dados recebidos do frontend:', { template, fields, name });

    // Validações iniciais
    if (!template) {
        return res.status(400).json({ success: false, message: 'Template não fornecido' });
    }

    if (!fields || typeof fields !== 'object') {
        return res.status(400).json({ success: false, message: 'Fields não fornecidos ou inválidos' });
    }

    if (!name) {
        return res.status(400).json({ success: false, message: 'Nome do script não fornecido' });
    }

    const scriptPath = path.join(__dirname, '../templates', `${template}.txt`);

    try {
        // Verifica se o template existe
        await fs.promises.access(scriptPath, fs.constants.F_OK);
        
        // Prepara os campos incluindo o nome
        const fieldsWithName = { ...fields, name };
        
        // Gera o script
        const generatedScript = generateScript(scriptPath, fieldsWithName);
        
        // Salva no banco de dados
        const newScript = await Script.create({ 
            name: name,
            content: generatedScript
        });
        
        return res.status(201).json({ 
            success: true,
            script: generatedScript,
            storedScript: newScript 
        });
        
    } catch (error) {
        console.error('Erro ao processar script:', error);
        
        // Tratamento específico para erro de template não encontrado
        if (error.code === 'ENOENT') {
            return res.status(404).json({ 
                success: false, 
                message: 'Template não encontrado' 
            });
        }
        
        // Tratamento para outros erros
        return res.status(400).json({ 
            success: false,
            message: error.message || 'Erro ao gerar o script'
        });
    }
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

// Rota para editar um script pelo ID
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
