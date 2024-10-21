const fs = require('fs');

function generateScript(templatePath, fields) {
   
    if (!templatePath) {
        throw new Error('Template not found');
    }

    const template = fs.readFileSync(templatePath, 'utf-8');

    let script = template;
    for (const key in fields) {
        if (fields.hasOwnProperty(key)) {
            const regex = new RegExp(`{{${key}}}`, 'g');
            script = script.replace(regex, fields[key]); 
        }
    }

    return script;
}

module.exports = { generateScript };
