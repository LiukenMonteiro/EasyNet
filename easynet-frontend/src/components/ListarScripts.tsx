import { FaEdit, FaTrashAlt, FaDownload } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getScripts, deleteScript } from '../utils/storage'; 
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
  const navigate = useNavigate();

  const loadScripts = () => {
    setScripts(getScripts()); // Carrega scripts do localStorage
  };

  useEffect(() => {
    loadScripts();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este script?')) {
      deleteScript(id); // Apaga do localStorage
      loadScripts(); // Atualiza a lista
    }
  };

  return (
    <Container>
      <h2>Scripts Salvos</h2>
      {scripts.map((script) => (
        <ScriptItem key={script.id}>
          <span>{script.name}</span>
          <div>
            <button onClick={() => navigate('/dashboard/editar-script', { state: { script } })}>Editar</button>
            <button onClick={() => handleDelete(script.id)}>Apagar</button>
          </div>
        </ScriptItem>
      ))}
    </Container>
  );
};

export default ListarScripts;