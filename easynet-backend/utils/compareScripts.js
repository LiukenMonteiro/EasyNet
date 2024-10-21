const diff = require('diff');

exports.compareScripts = (script1, script2) => {
    const differences = diff.diffLines(script1, script2);
    return differences.map(part => {
        let description;
        if (part.added) {
            description = `Linha adicionada: '${part.value.trim()}'`; 
        } else if (part.removed) {
            description = `Linha removida: '${part.value.trim()}'`;
        } else {
            description = `Linha sem alteração: '${part.value.trim()}'`;
        }
        return { text: part.value, description };
    });
};

//Linha adicionada: Indica que uma nova linha foi inserida, mostrando o conteúdo da linha adicionada.
//Linha removida: Indica que uma linha foi excluída, mostrando o conteúdo da linha removida.
//Linha sem alteração: Indica que a linha não sofreu nenhuma modificação.