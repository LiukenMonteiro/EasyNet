import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addScript } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import { FaFileImport } from 'react-icons/fa';

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

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ImportButton = styled(Button)`
  background-color: #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #218838;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Popup = styled.div<{ visible: boolean; isError?: boolean }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ isError }) => (isError ? '#dc3545' : '#007bff')};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition: opacity 0.5s ease;
`;

interface ImportedScript {
  marca?: string;
  name?: string;
  content?: string;
}

const CriarScript = () => {
  const location = useLocation();
  const scriptToEdit = location.state?.script;
  const [fields, setFields] = useState<any>(scriptToEdit || {});
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scriptToEdit) {
      setFields({
        marca: scriptToEdit.marca,
        name: scriptToEdit.name,
        script: scriptToEdit.content,
      });
    }
  }, [scriptToEdit]);

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const content = await file.text();
      
      // Try to parse the content as JSON first
      try {
        const jsonContent: ImportedScript = JSON.parse(content);
        setFields({
          marca: jsonContent.marca || '',
          name: jsonContent.name || file.name.replace('.txt', '').replace('.json', ''),
          script: jsonContent.content || content,
        });
      } catch {
        // If JSON parsing fails, treat it as a plain text script
        setFields({
          ...fields,
          name: file.name.replace('.txt', ''),
          script: content,
        });
      }

      setMessage('Script importado com sucesso!');
      setIsError(false);
    } catch (error) {
      setMessage('Erro ao importar o arquivo. Verifique o formato.');
      setIsError(true);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const portas = fields.script
      .match(/\*\*\[(.*?)\]\*\*/)?.[1]
      ?.split(',')
      .map((porta: string) => porta.trim())
      .filter(Boolean) || [];

    if (portas.length === 0 && fields.script.includes('**[')) {
      setMessage('Por favor, insira pelo menos uma porta válida.');
      setIsError(true);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const newScript = {
      id: scriptToEdit?.id || uuidv4(),
      marca: fields.marca || 'Marca não especificada',
      name: fields.name || 'Script sem nome',
      content: fields.script,
      portas,
    };

    setIsLoading(true);

    try {
      if (scriptToEdit) {
        // Adicione aqui a lógica de atualização
        console.log('Script editado', newScript);
      } else {
        addScript(newScript);
        setMessage('Script salvo com sucesso!');
        setIsError(false);
      }

      setFields({ marca: '', name: '', script: '' });
    } catch (error) {
      setMessage('Erro ao salvar o script.');
      setIsError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <Container>
      <Title>{scriptToEdit ? 'Editar Script' : 'Criar Script'}</Title>
      <Form onSubmit={handleSubmit}>
        <FileInput
          type="file"
          accept=".txt,.json"
          onChange={handleFileImport}
          ref={fileInputRef}
        />
        <ImportButton
          type="button"
          onClick={handleImportClick}
          disabled={isLoading}
        >
          <FaFileImport />
          Importar Script
        </ImportButton>
        
        <Input
          type="text"
          placeholder="Marca do script"
          value={fields.marca || ''}
          onChange={(e) => setFields({ ...fields, marca: e.target.value })}
          required
        />
        <Input
          type="text"
          placeholder="Nome do script"
          value={fields.name || ''}
          onChange={(e) => setFields({ ...fields, name: e.target.value })}
          required
        />
        <TextArea
          rows={10}
          placeholder="Digite o seu script aqui... (ex: Meu script usa portas **[porta1,, porta3]**)"
          value={fields.script || ''}
          onChange={(e) => setFields({ ...fields, script: e.target.value })}
          required
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : scriptToEdit ? 'Atualizar Script' : 'Salvar Script'}
        </Button>
      </Form>
      <Popup visible={message !== ''} isError={isError}>
        {message}
      </Popup>
    </Container>
  );
};

export default CriarScript;