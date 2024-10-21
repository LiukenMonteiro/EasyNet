// src/components/CriarScript.tsx
import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const CriarScript = () => {
  const [device, setDevice] = useState('');
  const [commands, setCommands] = useState(['']);
  const [message, setMessage] = useState('');

  const handleCommandChange = (index: number, value: string) => {
    const newCommands = [...commands];
    newCommands[index] = value;
    setCommands(newCommands);
  };

  const addCommand = () => {
    setCommands([...commands, '']);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    const response = await fetch('/script/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template: 'your-template-here', // Ajuste para o template desejado
        fields: { device, commands }, // Exemplo de estrutura de dados
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message); // Log da mensagem de erro
      alert(data.message);
    } else {
      // Aqui você pode redirecionar ou mostrar o script gerado
      console.log('Script gerado:', data.script);
      setMessage('Script gerado com sucesso!'); // Mensagem de sucesso
    }
  };

  return (
    <Container>
      <Title>Criar Script</Title>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Tipo de Dispositivo"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          required
        />
        {commands.map((command, index) => (
          <Input
            key={index}
            type="text"
            placeholder={`Comando ${index + 1}`}
            value={command}
            onChange={(e) => handleCommandChange(index, e.target.value)}
            required
          />
        ))}
        <Button type="button" onClick={addCommand}>Adicionar Comando</Button>
        <Button type="submit">Gerar Script</Button>
      </form>
      {message && <p>{message}</p>}
    </Container>
  );
};

export default CriarScript;
