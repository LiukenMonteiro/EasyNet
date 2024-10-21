const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

exports.generateBackup = () => {
    const backupPath = path.join(__dirname, '../backups/easynet_backup.sql');

    const command = `mysqldump -u ${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupPath}`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao fazer backup: ${error.message}`);
            return;
        }
        console.log('Backup gerado com sucesso:', backupPath);
    });
};
