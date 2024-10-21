import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 300px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
  resize: none;
  font-family: monospace;
  background-color: ${({ theme }) => (theme.body === '#f5f5f5' ? '#333' : '#f5f5f5')}; /* Fundo inverso */
  color: ${({ theme }) => (theme.body === '#f5f5f5' ? '#f5f5f5' : '#333')}; /* Texto inverso */
  transition: border 0.3s ease;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const EditarScript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [script, setScript] = useState<any>({ name: '', content: '' });

  useEffect(() => {
    if (location.state && location.state.script) {
      setScript(location.state.script);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScript({ ...script, content: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Aqui você pode adicionar a lógica para atualizar o script no backend
    // Exemplo: await fetch(`http://localhost:3000/api/scripts/update/${script.id}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(script),
    // });

    alert('Script atualizado com sucesso!'); // Substitua pelo feedback real da API
    navigate('/dashboard/listar-scripts');
  };

  return (
    <Container>
      <Title>Editar Script</Title>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={script.content}
          onChange={handleChange}
          placeholder="Edite o conteúdo do script aqui..."
        />
        <ButtonContainer>
          <Button type="submit">Salvar</Button>
          <Button onClick={() => navigate('/dashboard/listar-scripts')}>Cancelar</Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

export default EditarScript;
