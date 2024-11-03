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
// const bodyParser = require('body-parser');

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

// app.use(bodyParser.json());
// Middleware para tratamento de erros
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/api/templates/:name', (req, res) => {
    const templateName = req.params.name;
    const filePath = path.join(__dirname, 'templates', `${templateName}.txt`);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Erro ao ler o template:', err);
        return res.status(404).json({ error: 'Template não encontrado' });
      }
      res.json({ content: data });
    });
  });
  
app.use((req, res, next) => {
    logger.info(`Requisição: ${req.method} ${req.originalUrl}`);
    next();
});

app.use((err, req, res, next) => {
    logger.error('Erro não tratado: ' + err.message);
    res.status(500).json({ message: 'Erro interno no servidor' });
});

// Middleware para log de requisições

// Executar o backup diariamente às 2h da manhã
cron.schedule('0 2 * * *', () => {
    backupService.generateBackup();
    console.log('Backup diário concluído.');
});

// Middleware para analisar JSON

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
