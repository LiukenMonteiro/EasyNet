import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateScript } from '../utils/storage';

interface Script {
  id: string;
  name: string;
  brand: string;
  content: string;
  portas: string[];
}

interface ScriptPart {
  id: number;
  content: string;
  isEditable: boolean;
  value: string;
  isSelect?: boolean;
  options?: string[];
}

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  border-radius: 8px;
  box-shadow: 0 6px 75px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
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
`;

const Input = styled.input`
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

const Select = styled.select`
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
  width: 100%;
  padding: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 20px;

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

const EditarScript = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [script, setScript] = useState<Script>(
    (location.state?.script as Script) || { id: '', name: '', brand: '', content: '', portas: [] }
  );
  const [parts, setParts] = useState<ScriptPart[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (script.content) {
      const contentParts = splitContent(script.content);
      setParts(contentParts);
    }
  }, [script.content]);

  const splitContent = (content: string): ScriptPart[] => {
    return content.split(/(\*\*\[.*?\]\*\*|\*\*\*[^*]+\*\*\*)/).map((part, index) => {
      if (part.startsWith('***') && part.endsWith('***')) {
        return {
          id: index,
          content: part,
          isEditable: true,
          value: part.slice(3, -3),
        };
      } else if (part.startsWith('**[') && part.endsWith(']**')) {
        const options = part.slice(3, -3).split(',').map(option => option.trim());
        return {
          id: index,
          content: part,
          isEditable: true,
          isSelect: true,
          options: options,
          value: options[0] || "",
        };
      } else {
        return {
          id: index,
          content: part,
          isEditable: false,
          value: part,
        };
      }
    });
  };

  const handleInputChange = (index: number, newValue: string) => {
    setParts(currentParts =>
      currentParts.map((part, i) =>
        i === index ? { ...part, value: newValue } : part
      )
    );
  };

  const handleSave = () => {
    const updatedContent = parts
      .map(part => {
        if (part.isEditable) {
          return part.isSelect
            ? `**[${part.value}]**`
            : `***${part.value}***`;
        }
        return part.value;
      })
      .join('');

    const updatedScript: Script = {
      ...script,
      content: updatedContent,
    };

    updateScript(updatedScript);
    setMessage('Script atualizado com sucesso!');
    setTimeout(() => {
      setMessage('');
      navigate('/dashboard/listar-scripts');
    }, 2000);
  };

  return (
    <Container>
      <Title>Editar Script</Title>
      <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Input
          type="text"
          value={script.brand || ''}
          onChange={(e) => setScript({ ...script, brand: e.target.value })}
          placeholder="Marca do script"
          required
        />
        <Input
          type="text"
          value={script.name || ''}
          onChange={(e) => setScript({ ...script, name: e.target.value })}
          placeholder="Nome do script"
          required
        />
        
        {parts.map((part, index) => (
          part.isEditable ? (
            part.isSelect ? (
              <Select
                key={part.id}
                value={part.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
              >
                {part.options?.map((option, i) => (
                  <option key={i} value={option}>{option}</option>
                ))}
              </Select>
            ) : (
              <Input
                key={part.id}
                type="text"
                value={part.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
            )
          ) : (
            <span key={part.id}>{part.value}</span>
          )
        ))}
        
        <Button type="submit">Salvar Alterações</Button>
      </Form>
      <Popup visible={message !== ''}>{message}</Popup>
    </Container>
  );
};

export default EditarScript;
