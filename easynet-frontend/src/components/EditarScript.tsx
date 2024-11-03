import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateScript } from '../utils/storage';

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
  border: 1px solid #007bff; /* Borda azul */
  margin-bottom: 20px;
  resize: none;
  font-family: monospace;
  background-color: ${({ theme }) => (theme.body === '#f5f5f5' ? '#333' : '#f5f5f5')};
  color: ${({ theme }) => (theme.body === '#f5f5f5' ? '#f5f5f5' : '#333')};
  transition: border 0.3s ease;

  &:focus {
    border-color: #0056b3; /* Borda azul mais escura em foco */
    outline: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #007bff; /* Borda azul */
  margin-bottom: 20px;
  font-size: 1rem;

  &:focus {
    border-color: #0056b3; /* Borda azul mais escura em foco */
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
  const [script, setScript] = useState<any>(location.state?.script || {});

  const handleSave = () => {
    updateScript(script); // Atualiza o script no localStorage
    alert('Script atualizado com sucesso!');
    navigate('/dashboard/listar-scripts');
  };

  return (
    <Container>
      <h2>Editar Script</h2>
      <input
        type="text"
        value={script.name}
        onChange={(e) => setScript({ ...script, name: e.target.value })}
      />
      <textarea
        value={script.content}
        onChange={(e) => setScript({ ...script, content: e.target.value })}
      />
      <button onClick={handleSave}>Salvar</button>
    </Container>
  );
};

export default EditarScript;