import React, { useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { getScripts, deleteScript } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { FaEdit, FaTrashAlt, FaDownload, FaRegHandshake } from 'react-icons/fa';
import { ReactComponent as CiscoIcon } from '../svg/cisco.svg';
import { ReactComponent as UbiquitiIcon } from '../svg/ubiquiti.svg';
import { ReactComponent as MikrotikIcon } from '../svg/mk.svg';
import { ReactComponent as HuaweiIcon } from '../svg/huwawi.svg';
import { ReactComponent as JuniperIcon } from '../svg/network.svg';
import { ReactComponent as FortinetIcon } from '../svg/network.svg';

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
  max-width: 1000px;
  margin: 20px auto;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const SearchIcon = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const SearchInput = styled.input<{ isVisible: boolean }>`
  width: ${({ isVisible }) => (isVisible ? '100%' : '0')};
  padding: ${({ isVisible }) => (isVisible ? '8px 16px' : '0')};
  border: 2px solid #007bff;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.4);
  }
`;

const MarcaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const MarcaCard = styled.div<{ isActive: boolean }>`
  padding: 20px;
  background-color: ${({ theme, isActive }) =>
    isActive ? 'rgba(0, 123, 255, 0.3)' : theme.body === '#ffffff' ? '#000' : '#444'};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
  box-shadow: ${({ isActive }) => (isActive ? '0 4px 15px rgba(0, 123, 255, 0.5)' : '0 4px 8px rgba(0, 0, 0, 0.1)')};
  cursor: pointer;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.5);
  }

  ${({ isActive }) =>
    isActive &&
    `
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.5);
    `}
`;

const MarcaTitle = styled.h3`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin: 0;
  position: relative;
  color: ${({ theme }) => theme.body === '#ffffff' ? '#fff' : '#000'};

  div:first-child {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    padding-top: 2px;

    svg {
      width: 50px;
      height: 50px;
      margin-top: -8px;
    }
  }

  div:last-child {
    display: flex;
    align-items: center;
    gap: 5px;
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 1rem;

    span {
      color: #007bff;
    }
  }
`;

const ScriptList = styled.div`
  margin-top: 20px;
`;

const ScriptItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.body === '#ffffff' ? '#000' : '#333'};
  color: ${({ theme }) => theme.body === '#ffffff' ? '#fff' : '#000'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.6);
  }
`;

const ScriptName = styled.span`
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.body === '#ffffff' ? '#000' : '#fff'};
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

const EditButton = styled(IconButton)`
  color: blue;

  &:hover {
    color: darkblue;
  }
`;

const DownloadButton = styled(IconButton)`
  color: blue;

  &:hover {
    color: darkblue;
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
  const [expandedMarca, setExpandedMarca] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const normalizeString = (str: string) => str.toLowerCase().trim();

  const iconMap: Record<string, JSX.Element> = {
    mikrotik: <MikrotikIcon />,
    huawei: <HuaweiIcon />,
    ubiquiti: <UbiquitiIcon />,
    cisco: <CiscoIcon />,
    juniper: <JuniperIcon />,
    fortinet: <FortinetIcon />,
  };

  useEffect(() => {
    const loadedScripts = getScripts() as Script[];
    const normalizedScripts = loadedScripts
      .sort((a, b) => b.id.localeCompare(a.id))
      .map(script => ({
        ...script,
        marca: normalizeString(script.marca)
      }));
    setScripts(normalizedScripts);
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
    setExpandedMarca(prevMarca => (prevMarca === marca ? null : marca));
  };

  const getMarcaIcon = (marca: string) => {
    const normalizedMarca = normalizeString(marca);
    const icon = iconMap[normalizedMarca] || <FaRegHandshake />;
    const iconColor = getIconColor();

    return React.cloneElement(icon, {
      style: { fill: iconColor },
    });
  };

  const getIconColor = () => {
    return theme.body === '#ffffff' ? '#000000' : '#ffffff';
  };

  const downloadScript = (script: Script) => {
    const element = document.createElement('a');
    const file = new Blob([script.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${script.name}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        document.querySelector('input')?.focus();
      }, 100);
    }
  };

  const filteredScripts = scripts.filter((script) =>
    normalizeString(script.name).includes(normalizeString(searchTerm))
  );

  const groupedScripts = filteredScripts.reduce((acc: Record<string, Script[]>, script) => {
    const normalizedMarca = normalizeString(script.marca);
    (acc[normalizedMarca] = acc[normalizedMarca] || []).push(script);
    return acc;
  }, {});

  return (
    <Container>
      <SearchContainer>
        <SearchIcon onClick={toggleSearch}>
          <Search size={24} />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="Buscar por script"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          isVisible={isSearchVisible}
        />
      </SearchContainer>

      {loading ? (
        <LoadingIndicator>Carregando scripts...</LoadingIndicator>
      ) : (
        <>
          {filteredScripts.length === 0 ? (
            <LoadingIndicator>Nenhum script para ser exibido</LoadingIndicator>
          ) : (
            <>
              <MarcaGrid>
                {Object.keys(groupedScripts).map((marca) => (
                  <MarcaCard
                    key={marca}
                    isActive={expandedMarca === marca}
                    onClick={() => handleToggleMarca(marca)}
                  >
                    <MarcaTitle>
                      <div>{getMarcaIcon(marca)}</div>
                      <div>
                        {marca.charAt(0).toUpperCase() + marca.slice(1)} <span>({groupedScripts[marca].length})</span>
                      </div>
                    </MarcaTitle>
                  </MarcaCard>
                ))}
              </MarcaGrid>

              <ScriptList>
                {Object.entries(groupedScripts).map(([marca, scripts]) => (
                  <div key={marca}>
                    {expandedMarca === marca && (
                      <>
                        {scripts.map((script) => (
                          <ScriptItem key={script.id}>
                            <ScriptName>{script.name}</ScriptName>
                            <DownloadButton onClick={() => downloadScript(script)}>
                              <FaDownload />
                            </DownloadButton>
                            <IconContainer>
                              <EditButton onClick={() => navigate('/dashboard/editar-script', { state: { script } })}>
                                <FaEdit />
                              </EditButton>
                              <DeleteButton onClick={() => handleDelete(script.id)}>
                                <FaTrashAlt />
                              </DeleteButton>
                            </IconContainer>
                          </ScriptItem>
                        ))}
                      </>
                    )}
                  </div>
                ))}
              </ScriptList>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default ListarScripts;
