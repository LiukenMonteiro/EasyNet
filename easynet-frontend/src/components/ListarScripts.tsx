import { FaEdit, FaTrashAlt, FaDownload } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ScriptItem = styled.div`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #007bff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    color: #007bff;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const DeleteButton = styled(IconButton)`
  color: red;

  &:hover {
    color: darkred;
  }
`;

const DownloadButton = styled(IconButton)`
  color: #007bff;

  &:hover {
    color: #0056b3;
  }
`;

const LoadingIndicator = styled.div`
  font-size: 1.5rem;
  text-align: center;
  color: #007bff;
  margin-top: 20px;
`;

const ListarScripts = () => {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchScripts = async () => {
    const username = 'admin';
    const password = '1234';

    try {
      const response = await fetch('http://localhost:3000/api/scripts/list', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${username}:${password}`),
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar scripts: ' + response.status);
      }

      const data = await response.json();
      console.log(data);
      setScripts(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao buscar scripts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScripts();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      fetchScripts(); // Re-fetch quando voltar da edição
    };
    window.addEventListener('focus', handleRefresh); // Adiciona listener ao focar na janela
    return () => {
      window.removeEventListener('focus', handleRefresh); // Limpa o listener
    };
  }, []);

  const handleEdit = (script: any) => {
    navigate('/dashboard/editar-script', { state: { script } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este script?')) {
      const username = 'admin';
      const password = '1234';

      try {
        const response = await fetch(`http://localhost:3000/api/scripts/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`),
          },
        });

        if (response.ok) {
          // Atualiza a lista de scripts após deletar
          setScripts((prevScripts) => prevScripts.filter((script) => script.id !== id));
        } else {
          throw new Error('Erro ao apagar o script.');
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao apagar o script.');
      }
    }
  };

const handleDownload = (script: any) => {
  const content = `
# Configuração básica do Mikrotik
/system identity set name=${script.NOME || "Nome não disponível"}
/ip address add address=${script.IP_ADDRESS || "IP_ADDRESS não disponível"} interface=${script.INTERFACE || "Interface não disponível"}
/ip route add gateway=${script.GATEWAY || "Gateway não disponível"}
/system clock set time-zone-name=${script.TIMEZONE || "Timezone não disponível"}
/interface ethernet set [ find default-name=${script.INTERFACE || "Interface não disponível"} ] name=${script.NOME_INTERFACE || "Interface nome não disponível"}
/snmp set enabled=yes contact="${script.CONTATO || "Contato não disponível"}" location="${script.LOCALIZACAO || "Localização não disponível"}"
/ip dns set servers=${script.DNS_SERVER1 || "DNS1 não disponível"},${script.DNS_SERVER2 || "DNS2 não disponível"}
/interface bridge add name=${script.BRIDGE_NAME || "Bridge não disponível"} comment="Bridge de teste"
/interface bridge port add bridge=${script.BRIDGE_NAME || "Bridge não disponível"} interface=${script.INTERFACE_BRIDGE || "Interface bridge não disponível"}
/ip firewall filter add chain=forward action=drop src-address=${script.BLOCKED_IP || "IP bloqueado não disponível"} comment="Bloquear rede indesejada"
  `;

  const fileName = `${script.NOME || "script"}.txt`;
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

  
  
  if (loading) {
    return <LoadingIndicator>Carregando scripts...</LoadingIndicator>;
  }

  return (
    <Container>
      <h2>Scripts Salvos</h2>
      {scripts.map((script) => (
  <ScriptItem key={script.id}>
    <span>{script.NOME || script.name || "Nome não disponível"}</span> {/* Verifica as opções de nome */}
    <div>
      <IconButton onClick={() => handleEdit(script)}>
        <FaEdit />
      </IconButton>
      <DownloadButton onClick={() => handleDownload(script)}>
        <FaDownload />
      </DownloadButton>
      <DeleteButton onClick={() => handleDelete(script.id)}>
        <FaTrashAlt />
      </DeleteButton>
    </div>
  </ScriptItem>
))}

    </Container>
  );
};

export default ListarScripts;
