export function parseMikrotikScript(script) {
    const json = {};
    const regexPatterns = {
        NOME: /\/system identity set name=(.+)/,
        IP_ADDRESS: /\/ip address add address=(.+) interface=(.+)/,
        GATEWAY: /\/ip route add gateway=(.+)/,
        TIMEZONE: /\/system clock set time-zone-name=(.+)/,
        NOME_INTERFACE: /\/interface ethernet set \[ find default-name=(.+) \] name=(.+)/,
        CONTATO: /\/snmp set enabled=yes contact="(.+)" location="(.+)"/,
        DNS_SERVER1: /\/ip dns set servers=(.+),/,
        DNS_SERVER2: /\/ip dns set servers=.+,(.+)/,
        BRIDGE_NAME: /\/interface bridge add name=(.+) comment="(.+)"/,
        INTERFACE_BRIDGE: /\/interface bridge port add bridge=(.+) interface=(.+)/,
        BLOCKED_IP: /\/ip firewall filter add chain=forward action=drop src-address=(.+)/
    };

    for (const [key, regex] of Object.entries(regexPatterns)) {
        const match = script.match(regex);
        if (match) {
            json[key] = match[1];
        }
    }

    return json;
}

export function parseCiscoScript(script) {
    const json = {};
    // Implementar lógica para identificar campos do script Cisco e convertê-los para JSON
    return json;
}

export function parseUbiquitiScript(script) {
    const json = {};
    // Implementar lógica para identificar campos do script Ubiquiti e convertê-los para JSON
    return json;
}

export function identifyScriptType(script) {
    if (script.includes('/system identity set')) {
        return 'mikrotik';
    } else if (script.includes('Cisco')) { // Ajustar com um identificador real
        return 'cisco';
    } else if (script.includes('Ubiquiti')) { // Ajustar com um identificador real
        return 'ubiquiti';
    }
    return null;
}
