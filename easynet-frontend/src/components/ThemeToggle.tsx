import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px;
  /* Alinhar a margem automaticamente em telas menores */
  @media (max-width: 768px) {
    margin: 10px;
  }
`;

const Icon = styled.div<{ isDark: boolean }>`
  font-size: 2rem;  /* Tamanho maior para telas maiores */
  cursor: pointer;
  margin-right: 10px;
  color: ${({ isDark }) => (isDark ? 'yellow' : 'blue')};

  @media (max-width: 768px) {
    font-size: 1.5rem;  /* Reduzir o tamanho do ícone em telas menores */
    margin-right: 5px;  /* Ajuste de margem em telas menores */
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;  /* Tamanho ainda menor para telas muito pequenas */
  }
`;

const ThemeToggle = ({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) => {
  return (
    <ToggleContainer>
      <Icon isDark={isDark} onClick={toggleTheme}>
        {isDark ? <FaSun /> : <FaMoon />}
      </Icon>
    </ToggleContainer>
  );
};

export default ThemeToggle;
