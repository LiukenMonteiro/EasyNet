const fs = require('fs');

function generateScript(templatePath, fields) {
    console.log('Gerando script com template:', templatePath);
    console.log('Campos recebidos:', fields);

    if (!templatePath) {
        throw new Error('Template não encontrado');
    }

    // Lê o template
    let template;
    try {
        template = fs.readFileSync(templatePath, 'utf-8');
        console.log('Template carregado com sucesso');
    } catch (error) {
        console.error('Erro ao ler template:', error);
        throw new Error(`Erro ao ler arquivo do template: ${error.message}`);
    }

    // Realiza as substituições linha por linha
    let scriptLines = template.split('\n');
    let finalScript = [];

    for (let line of scriptLines) {
        let modifiedLine = line;
        const variables = line.match(/{{([^}]+)}}/g) || [];
        
        for (let variable of variables) {
            const fieldName = variable.replace(/[{}]/g, '');
            const value = fields[fieldName];
            
            if (value !== undefined && value !== null) {
                modifiedLine = modifiedLine.replace(new RegExp(variable, 'g'), value);
                console.log(`Substituída variável ${fieldName} com valor ${value}`);
            }
        }
        
        finalScript.push(modifiedLine);
    }

    // Junta as linhas de volta em um único script
    const resultScript = finalScript.join('\n');

    // Verifica se ainda existem variáveis não substituídas
    const remainingVariables = resultScript.match(/{{([^}]+)}}/g);
    if (remainingVariables) {
        console.error('Variáveis não substituídas:', remainingVariables);
        
        // Verifica quais campos estão faltando
        const missingFields = remainingVariables
            .map(v => v.replace(/[{}]/g, ''))
            .filter(field => !fields[field]);
            
        if (missingFields.length > 0) {
            throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
        }
    }

    // Validação final
    if (resultScript === template) {
        throw new Error('Nenhuma substituição foi realizada no template');
    }

    console.log('Script gerado com sucesso');
    return resultScript;
}

// Função auxiliar para validar os campos antes da geração
function validateFields(fields) {
    const requiredFields = [
        'NOME', 'IP_ADDRESS', 'INTERFACE', 'GATEWAY', 'TIMEZONE',
        'INTERFACE_NAME', 'CONTATO', 'LOCALIZACAO', 'DNS_SERVER1',
        'DNS_SERVER2', 'BRIDGE_NAME', 'INTERFACE_BRIDGE', 'BLOCKED_IP'
    ];

    const missingFields = requiredFields.filter(field => !fields[field]);
    
    if (missingFields.length > 0) {
        throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
    }

    return true;
}

module.exports = { generateScript, validateFields };