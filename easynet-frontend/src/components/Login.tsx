// src/components/Login.tsx
import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import { lightTheme, darkTheme } from '../theme';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease-in-out;
`;

const LoginBox = styled.div`
  background-color: ${({ theme }) => theme.loginBox};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: ${({ theme }) => theme.button};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin: 10px 0;
`;

const TogglePasswordButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text};
  margin-left: -30px; /* Ajuste a posição conforme necessário */
`;

const Login = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Recupera o tema salvo no localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

  // Alterna o tema e salva no localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (data.success) {
        setError(null);
        navigate('/dashboard');
      } else {
        setError('Usuário ou senha incorretos.');
      }
    } catch (error) {
      setError('Erro ao conectar com o servidor.');
    }
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <LoginContainer>
        <LoginBox>
          <h2>Login</h2>
          <Input 
            type="text" 
            placeholder="Usuário" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <TogglePasswordButton onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </TogglePasswordButton>
          </div>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button onClick={handleLogin}>Entrar</Button>
        </LoginBox>
        <ThemeToggle toggleTheme={toggleTheme} isDark={theme === 'dark'} />
      </LoginContainer>
    </ThemeProvider>
  );
};

export default Login;
