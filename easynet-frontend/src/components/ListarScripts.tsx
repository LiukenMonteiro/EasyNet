import { FaEdit, FaTrashAlt, FaWifi, FaCloud, FaPlug, FaNetworkWired, FaSatelliteDish, FaRegHandshake } from 'react-icons/fa';
import { MdRouter } from 'react-icons/md'; // ícone de roteador
import { IoIosCloud } from 'react-icons/io'; // ícone de nuvem
import { GiNetworkBars, GiElectric, GiCircuitry } from 'react-icons/gi'; // Ícones para diferentes marcas
import { RiRouterFill } from 'react-icons/ri'; // Outro ícone de roteador
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getScripts, deleteScript } from '../utils/storage';
import { useNavigate } from 'react-router-dom';

interface Script {
  id: string;
  name: string;
  marca: string;
  content: string;
  portas: string[];
}

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 600px;
  margin: 20px auto;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 20px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const ScriptGroup = styled.div`
  margin-top: 20px;
`;

const ScriptItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #007bff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScriptName = styled.span`
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const IconContainer = styled.div`
  display: flex;
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

const LoadingIndicator = styled.div`
  font-size: 1.2rem;
  text-align: center;
  color: #007bff;
  margin-top: 20px;
`;

const ListarScripts = () => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMarcas, setExpandedMarcas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadedScripts = getScripts() as Script[];
    setScripts(loadedScripts.sort((a, b) => b.id.localeCompare(a.id))); // Ordena do mais recente ao mais antigo
    setLoading(false);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este script?')) {
      setLoading(true);
      deleteScript(id);
      setScripts((prevScripts) => prevScripts.filter(script => script.id !== id));
      setLoading(false);
    }
  };

  const handleToggleMarca = (marca: string) => {
    const newExpandedMarcas = new Set(expandedMarcas);
    if (newExpandedMarcas.has(marca)) {
      newExpandedMarcas.delete(marca);
    } else {
      newExpandedMarcas.add(marca);
    }
    setExpandedMarcas(newExpandedMarcas);
  };

  // Mapa para ícones das marcas
  const iconMap: Record<string, JSX.Element> = {
    mikrotik: <GiNetworkBars />,
    huawei: <IoIosCloud />,
    ubiquiti: <FaSatelliteDish />,
    cisco: <MdRouter />,
    juniper: <FaNetworkWired />,
    arista: <GiElectric />,
    fortinet: <GiCircuitry />,
    intelbras: <GiNetworkBars />,
    mikrotik3: <RiRouterFill />,
  };

  const getMarcaIcon = (marca: string) => iconMap[marca.toLowerCase()] || <FaRegHandshake />;

  const filteredScripts = scripts.filter(script =>
    script.marca && script.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedScripts = filteredScripts.reduce<Record<string, Script[]>>((groups, script) => {
    const marca = script.marca.toLowerCase(); 
    if (!groups[marca]) groups[marca] = [];
    groups[marca].push(script);
    return groups;
  }, {});

  return (
    <Container>
      <h2>Scripts Salvos</h2>
      <SearchInput
        type="text"
        placeholder="Buscar por marca..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Buscar por marca"
      />

      {loading ? (
        <LoadingIndicator>Carregando scripts...</LoadingIndicator>
      ) : Object.keys(groupedScripts).length === 0 ? (
        <LoadingIndicator>Nenhum script encontrado.</LoadingIndicator>
      ) : (
        Object.entries(groupedScripts).map(([marca, scripts]) => (
          <ScriptGroup key={marca}>
            <h3 
              onClick={() => handleToggleMarca(marca)} 
              style={{ cursor: 'pointer', color: '#007bff' }}
              aria-label={`Toggle scripts da marca ${marca}`}
            >
              {getMarcaIcon(marca)} {/* Exibe o ícone da marca */}
              {marca}
            </h3>
            {expandedMarcas.has(marca) && (
              scripts.map((script) => (
                <ScriptItem key={script.id}>
                  <ScriptName>{script.name}</ScriptName>
                  <IconContainer>
                    <IconButton
                      onClick={() => navigate('/dashboard/editar-script', { state: { script } })}
                      aria-label={`Editar script ${script.name}`}
                    >
                      <FaEdit />
                    </IconButton>
                    <DeleteButton
                      onClick={() => handleDelete(script.id)}
                      aria-label={`Excluir script ${script.name}`}
                    >
                      <FaTrashAlt />
                    </DeleteButton>
                  </IconContainer>
                </ScriptItem>
              ))
            )}
          </ScriptGroup>
        ))
      )}
    </Container>
  );
};

export default ListarScripts;
