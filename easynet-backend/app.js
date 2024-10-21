// Importar dependências
const express = require('express');
const app = express();
const equipmentRoutes = require('./routes/equipmentRoutes');
const templateRoutes = require('./routes/templateRoutes');
const scriptRoutes = require('./routes/scriptRoutes');
const authRoutes = require('./routes/authRoutes'); // Importar rotas de autenticação
const cron = require('node-cron');
const backupService = require('./services/backupService');
const winston = require('winston');
const cors = require('cors');

// Configuração do logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }) // Log de todas as requisições
    ]
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
    logger.error('Erro não tratado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
});

// Middleware para log de requisições
app.use((req, res, next) => {
    logger.info(`Requisição: ${req.method} ${req.originalUrl}`);
    next();
});

// Executar o backup diariamente às 2h da manhã
cron.schedule('0 2 * * *', () => {
    backupService.generateBackup();
    console.log('Backup diário concluído.');
});

// Middleware para analisar JSON
app.use(express.json());

// Configuração do CORS
app.use(cors());

// Configuração das rotas
app.use('/api/equipment', equipmentRoutes); // Rotas de equipamentos
app.use('/api/templates', templateRoutes);   // Rotas de templates
app.use('/api/scripts', scriptRoutes);       // Rotas de scripts
app.use('/api', authRoutes);           // Rotas de autenticação

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
