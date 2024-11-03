const Script = require('../models/Script');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const logger = require('../logs/logger');

exports.createScript = async (req, res) => {
    console.log('Corpo da requisição:', req.body);
    const { name, content } = req.body;

    if (!name || !content) {
        return res.status(400).json({ message: 'Nome e conteúdo são obrigatórios.' });
    } 

    try {
        const newScript = await Script.create({ name, content });
        logger.info('Script criado com sucesso');
        res.status(201).json(newScript);
    }catch (err) {
        logger.error('Erro ao criar script: ', err); // Log detalhado
        res.status(500).json({ message: 'Erro ao criar script', err });
    }
};


exports.listScripts = async (req, res) => {
    try {
        const scripts = await Script.findAll();
        logger.info('Scripts listados com sucesso');
        res.status(200).json(scripts);
    } catch (err) {
        logger.error('Erro ao listar scripts: ' + err.message);
        res.status(500).json({ message: 'Erro ao listar scripts', err });
    }
};

exports.downloadBackup = async (req, res) => {
    const doc = new PDFDocument();

    // Configura os cabeçalhos da resposta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=backup.pdf');

    doc.pipe(res);
    
    // Adiciona título ao PDF
    doc.fontSize(25).text('Backup de Scripts', { align: 'center' });
    doc.moveDown();

    try {
        const scripts = await Script.findAll(); // Pega todos os scripts do banco de dados

        if (scripts.length === 0) {
            doc.fontSize(12).text('Nenhum script encontrado.', { width: 410, align: 'left' });
        } else {
            scripts.forEach(script => {
                doc.fontSize(12).text(`ID: ${script.id}`, { width: 410, align: 'left' });
                doc.text(`Nome: ${script.name}`);
                doc.text(`Conteúdo: ${script.content}`);
                doc.text('-----------------------------------');
                doc.moveDown(); // Espaçamento entre os scripts
            });
        }

        // Finaliza o documento
        doc.end();
        logger.info('Backup gerado com sucesso');
    } catch (err) {
        logger.error('Erro ao listar scripts para o backup: ' + err.message);
        doc.end(); 
        res.status(500).send('Erro ao gerar o backup');
    }
};

exports.editScript = async (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;

    console.log(`Tentando editar script com ID: ${id}`);

    try {
        const script = await Script.findByPk(id);
        console.log(`Resultado da busca: ${JSON.stringify(script)}`);

        if (!script) {
            return res.status(404).json({ message: 'Script não encontrado' });
        }

        // Atualiza os campos do script
        script.name = name;
        script.content = content;

        await script.save(); // Salva as alterações
        logger.info(`Script ${id} editado com sucesso`);
        res.status(200).json(script);
    } catch (err) {
        logger.error('Erro ao editar script: ' + err.message);
        res.status(500).json({ message: 'Erro ao editar script', err });
    }
};
