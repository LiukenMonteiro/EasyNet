// src/components/CriarScript.js
import React, { useState } from 'react';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/script/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            device: "Router", // Substitua conforme necessário
            commands,
          },
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setMessage('Erro ao gerar script.');
      }
    } catch (error) {
      setMessage('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div>
      <h2>Criar Script</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tipo de Dispositivo"
          value={device}
          onChange={(e) => setDevice(e.target.value)}
          required
        />
        {commands.map((command, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Comando ${index + 1}`}
            value={command}
            onChange={(e) => handleCommandChange(index, e.target.value)}
            required
          />
        ))}
        <button type="button" onClick={addCommand}>Adicionar Comando</button>
        <button type="submit">Gerar Script</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CriarScript;
