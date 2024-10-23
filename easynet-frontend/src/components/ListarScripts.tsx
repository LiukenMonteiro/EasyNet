import { FaEdit, FaTrashAlt } from 'react-icons/fa';
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

  if (loading) {
    return <LoadingIndicator>Carregando scripts...</LoadingIndicator>;
  }

  return (
    <Container>
      <h2>Scripts Salvos</h2>
      {scripts.map((script) => (
        <ScriptItem key={script.id}>
          <span>{script.name}</span>
          <div>
            <IconButton onClick={() => handleEdit(script)}>
              <FaEdit />
            </IconButton>
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
