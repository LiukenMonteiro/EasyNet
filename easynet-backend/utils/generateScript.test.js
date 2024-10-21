const { generateScript } = require('./generateScript');

describe('Testes para a função generateScript', () => {
  it('deve gerar um script com os parâmetros fornecidos', () => {
    const script = generateScript('./templates/mikrotik_template.txt', {
      NOME: 'MK01',
      IP_ADDRESS: '192.168.1.10',
      INTERFACE: 'ether1',
      GATEWAY: '192.168.1.1',
      TIMEZONE: 'America/Sao_Paulo',
      NOME_INTERFACE: 'LAN',
      CONTATO: 'admin@example.com',
      LOCALIZACAO: 'Data Center',
      DNS_SERVER1: '8.8.8.8',
      DNS_SERVER2: '8.8.4.4',
      BRIDGE_NAME: 'Bridge1',
      INTERFACE_BRIDGE: 'ether2',
      BLOCKED_IP: '10.0.0.0/24'
    });

   
    expect(script).toContain('MK01'); 
  });

  it('deve lançar erro se o template estiver ausente', () => {
    expect(() => {
      generateScript(null, {});
    }).toThrow('Template not found');
  });
});
