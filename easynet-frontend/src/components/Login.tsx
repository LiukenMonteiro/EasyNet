import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import { lightTheme, darkTheme } from '../theme';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

// Importe a imagem corretamente
import userProfileImage from '../img/user-2.png';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease-in-out;
  position: relative;
`;

const LoginBox = styled.div`
  background-color: ${({ theme }) => theme.loginBox};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #007bff; /* Borda azul */
  outline: none; /* Remove o contorno padrão ao focar */
  
  &:focus {
    border-color: #0056b3; /* Borda azul mais escura ao focar */
  }
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
  margin-left: -30px;
`;

const ThemeToggleWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
`;

const ProfileImage = styled.img`
  width: 80px; /* Ajuste o tamanho conforme necessário */
  height: 80px;
  border-radius: 50%;
  border: 3px solid #007bff; /* Bordas azuis */
  position: absolute;
  top: 80px; /* Posição padrão para telas maiores */
  left: 50%;
  transform: translateX(-50%); /* Centraliza a imagem horizontalmente */
  margin-bottom: 120px; /* Espaço padrão entre a imagem e a caixa de login */

  @media (max-width: 480px) {
    top: 50px; /* Ajuste a posição para telas menores */
    margin-bottom: 40px; /* Ajuste o espaço entre a imagem e a caixa de login */
  }
`;

interface LoginProps {
  onLogin: () => void; // Define the onLogin prop type
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
    }
  }, []);

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
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (data.success) {
        setError(null);
        onLogin(); // Call onLogin from props
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
        <ThemeToggleWrapper>
          <ThemeToggle toggleTheme={toggleTheme} isDark={theme === 'dark'} />
        </ThemeToggleWrapper>
        <LoginBox>
          {/* Imagem de perfil */}
          <ProfileImage src={userProfileImage} alt="Imagem de perfil" />
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
      </LoginContainer>
    </ThemeProvider>
  );
};

export default Login;
