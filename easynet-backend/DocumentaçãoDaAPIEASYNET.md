### Documentação da API EASYNET ###

Base URL
arduino
http://localhost:3000

Endpoints
### 1. Gerar Script
Endpoint: /script/generate
Método: POST
Descrição: Gera um novo script de configuração para equipamentos de rede.

Parâmetros de Requisição

{
  "config": {
    "device": "string",  // Tipo de dispositivo
    "commands": [        // Lista de comandos a serem incluídos
      "string"
    ]
  }
}

Exemplo de Requisição

POST /script/generate
{
  "config": {
    "device": "Router",
    "commands": [
      "interface g0/0",
      "ip address 192.168.1.1 255.255.255.0"
    ]
  }
}

Exemplo de Resposta

{
  "success": true,
  "message": "Script gerado com sucesso.",
  "script": {
    "id": "12345",
    "device": "Router",
    "commands": [
      "interface g0/0",
      "ip address 192.168.1.1 255.255.255.0"
    ],
    "createdAt": "2024-10-17T10:00:00Z"
  }
}
### 2. Listar Scripts

Endpoint: /script
Método: GET
Descrição: Lista todos os scripts gerados.
Exemplo de Requisição http

GET /script
[
  {
    "id": "12345",
    "device": "Router",
    "commands": [
      "interface g0/0",
      "ip address 192.168.1.1 255.255.255.0"
    ],
    "createdAt": "2024-10-17T10:00:00Z"
  },
  {
    "id": "12346",
    "device": "Switch",
    "commands": [
      "interface g1/0",
      "switchport mode access"
    ],
    "createdAt": "2024-10-17T10:05:00Z"
  }
]

### 3. Download Script em PDF
Endpoint: /script/download/:id
Método: GET
Descrição: Faz o download de um script específico em formato PDF.
Parâmetros de Rota
id (string): ID do script a ser baixado.
Exemplo de Requisição http

GET /script/download/12345
Exemplo de Resposta
Status: 200 OK
Conteúdo: Arquivo PDF do script.

### 4. Backup de Scripts
Endpoint: /backup
Método: POST
Descrição: Cria um backup de todos os scripts gerados.
Exemplo de Requisição http
POST /backup
Exemplo de Resposta

{
  "success": true,
  "message": "Backup realizado com sucesso.",
  "backupFile": "easynet_backup.sql"
}


#### Erros Comuns

# 1. Script Não Encontrado
Status: 404 Not Found
Mensagem: "Script não encontrado."

# 2. Erro Interno do Servidor
Status: 500 Internal Server Error
Mensagem: "Ocorreu um erro inesperado. Tente novamente mais tarde."

# Conclusão
Essa documentação fornece uma visão geral dos principais endpoints da API EASYNET. Para mais informações ou sugestões, entre em contato com a equipe de desenvolvimento.