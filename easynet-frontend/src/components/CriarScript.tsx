import React, { useState } from 'react';
import styled from 'styled-components';
import { addScript } from '../utils/storage'; // importa a função addScript
import { v4 as uuidv4 } from 'uuid'; // Gera IDs únicos


const Container = styled.div`
  width: 300px; /* Largura menor para destacar o container */
  margin: 20px auto; /* Centralizar com margem superior e inferior */
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3); /* Sombra mais forte */
  overflow-y: auto;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center; /* Centraliza o título */
`;

const Form = styled.form`
  display: flex;
  flex-direction: column; /* Colocar todos os elementos em coluna */
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%; /* Largura total do container */
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Popup = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

const FileInput = styled.input`
  display: none; /* Oculta o input padrão */
`;

const FileInputWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Coloca os elementos em coluna */
  align-items: center; /* Centraliza os elementos */
  margin: 8px 0; /* Margem entre os elementos */
`;

const ImportButton = styled.button`
  width: 100%; /* Largura total do container */
  padding: 8px;
  margin-top: 8px; /* Espaçamento acima do botão de importação */
  background-color: #007bff; /* Azul */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #0056b3; /* Azul mais escuro ao passar o mouse */
  }
`;

const CriarScript = () => {
  const [fields, setFields] = useState<any>({});
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newScript = {
      id: uuidv4(), // ID único
      name: fields.name || 'Script sem nome',
      content: fields.script,
    };

    addScript(newScript); // salva no localStorage

    setMessage('Script salvo com sucesso!');
    setTimeout(() => setMessage(''), 3000);

    setFields({}); // limpa os campos após salvar
  };

  return (
    <Container>
      <Title>Criar Script</Title>
      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do script"
          value={fields.name || ""}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          required
        />
        <TextArea
          rows={10}
          placeholder="Digite o seu script aqui..."
          value={fields.script || ""}
          onChange={(e) => setFields({ ...fields, script: e.target.value })}
          required
        />
        <Button type="submit">Salvar Script</Button>
      </Form>
      <Popup visible={message !== ''}>{message}</Popup>
    </Container>
  );
};

export default CriarScript;