// src/components/ThemeToggle.tsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 20px; /* Ajuste a margem conforme necessário */
`;

const Icon = styled.div<{ isDark: boolean }>`
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 10px; 
  color: ${({ isDark }) => (isDark ? 'yellow' : 'blue')}; 
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
