import React, { useState } from 'react';
import styled from 'styled-components';
import { addScript } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 15px;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #007bff;
  border-radius: 4px;
  font-size: 0.9rem;

  &:focus {
    border-color: #0056b3;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
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

const CriarScript = () => {
  const [fields, setFields] = useState<any>({});
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const portas = fields.script
      .match(/\*\*\[(.*?)\]\*\*/)?.[1]
      ?.split(',')
      .map((porta: string) => porta.trim())
      .filter(Boolean) || [];

      const newScript = {
        id: uuidv4(),
        marca: fields.brand || 'Marca não especificada', // Alterado de 'brand' para 'marca'
        name: fields.name || 'Script sem nome',
        content: fields.script,
        portas,
      };

    addScript(newScript);

    setMessage('Script salvo com sucesso!');
    setTimeout(() => setMessage(''), 3000);

    setFields({ brand: '', name: '', script: '' }); // Limpa os campos após salvar
  };

  return (
    <Container>
      <Title>Criar Script</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Marca do script"
          value={fields.brand || ""}
          onChange={(e) => setFields({ ...fields, brand: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Nome do script"
          value={fields.name || ""}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          required
        />
        <TextArea
          rows={10}
          placeholder="Digite o seu script aqui... (ex: Meu script usa portas **[porta1,, porta3]**)"
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
