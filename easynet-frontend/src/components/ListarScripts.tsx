// src/components/ListarScripts.tsx
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
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ListarScripts = () => {
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScripts = async () => {
      const username = 'admin'; // Substitua pelo nome de usuário real
      const password = '1234'; // Substitua pela senha real

      try {
        const response = await fetch('http://localhost:3000/api/scripts/list', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`), // Adiciona autenticação
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao buscar scripts: ' + response.status);
        }

        const data = await response.json();
        setScripts(data);
      } catch (error) {
        console.error(error);
        alert('Erro ao buscar scripts.');
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  const handleEdit = (script: any) => {
    navigate('/dashboard/editar-script', { state: { script } });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este script?')) {
      const username = 'seu_usuario'; // Substitua pelo nome de usuário real
      const password = 'sua_senha'; // Substitua pela senha real

      try {
        const response = await fetch(`http://localhost:3000/api/scripts/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa(`${username}:${password}`), // Adiciona autenticação
          },
        });

        if (response.ok) {
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
    return <div>Carregando scripts...</div>;
  }

  return (
    <Container>
      <h2>Scripts Salvos</h2>
      {scripts.map((script) => (
        <ScriptItem key={script.id}>
          <span>{script.name}</span>
          <div>
            <Button onClick={() => handleEdit(script)}>Editar</Button>
            <Button onClick={() => handleDelete(script.id)}>Apagar</Button>
          </div>
        </ScriptItem>
      ))}
    </Container>
  );
};

export default ListarScripts;
