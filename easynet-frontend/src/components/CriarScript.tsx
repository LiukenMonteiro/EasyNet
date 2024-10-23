import React, { useState } from 'react';
import styled from 'styled-components';
import { templates } from './templates'; // Importa os templates do arquivo templates.js

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

const Input = styled.input`
  width: 100%; /* Largura total do container */
  padding: 8px;  
  margin: 8px 0; 
  border: 1px solid #007bff; /* Borda azul padrão */
  border-radius: 4px;
  font-size: 0.9rem; 

  &:focus {
    border-color: #0056b3; /* Borda azul mais escura ao focar */
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

const Select = styled.select`
  width: 100%; /* Largura total do container */
  padding: 8px; 
  margin: 8px 0; 
  border: 1px solid #007bff; /* Borda azul para o seletor */
  border-radius: 4px;
  font-size: 0.9rem; 

  &:focus {
    border-color: #0056b3; /* Borda azul mais escura ao focar */
    outline: none;
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
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [fields, setFields] = useState<any>({});
  const [message, setMessage] = useState('');

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = e.target.value as keyof typeof templates;
    setSelectedTemplate(template);
    setFields(templates[template] || {});
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields: any) => ({
      ...prevFields,
      [name]: value,
    }));
    console.log(fields);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const importedScript = event.target?.result as string;
        
        try {
          const data = JSON.parse(importedScript); 
          setFields(data);
          
        } catch (error) {
          console.error('Erro ao importar o script:', error);
          alert('Erro ao importar o script. Verifique o formato do arquivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(fields);

    const response = await fetch('http://localhost:3000/api/scripts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:1234'), // Substitua pelas credenciais corretas
      },
      body: JSON.stringify({
        template: selectedTemplate,
        fields,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.message);
      alert(data.message);
    } else {
      setMessage('Script gerado com sucesso!');
      console.log('Script gerado:', data.script);
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  return (
    <Container>
      <Title>Criar Script</Title>
      <Form onSubmit={handleSubmit}>
        <Select value={selectedTemplate} onChange={handleTemplateChange} required>
          <option value="">Selecione o Template</option>
          <option value="mikrotik">Mikrotik</option>
          <option value="cisco">Cisco</option>
          <option value="ubiquiti">Ubiquiti</option>
          <option value="arista">Arista</option>
          <option value="juniper">Juniper</option>
        </Select>

        {selectedTemplate &&
          Object.keys(fields).map((fieldKey) => (
            <Input
              key={fieldKey}
              name={fieldKey}
              value={fields[fieldKey]}
              placeholder={fieldKey}
              onChange={handleFieldChange}
              required
            />
          ))}

        <FileInputWrapper>
          <FileInput 
            type="file" 
            accept=".txt" 
            onChange={handleFileChange} 
            id="fileInput" 
          />
          <ImportButton onClick={() => document.getElementById('fileInput')?.click()}>
            Importar Script
          </ImportButton>
        </FileInputWrapper>

        <Button type="submit">Gerar Script</Button>
      </Form>
      <Popup visible={message !== ''}>{message}</Popup>
    </Container>
  );
};

export default CriarScript;
