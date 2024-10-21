import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import styled from 'styled-components';

const ToggleContainer = styled.button`
  position: absolute;
  top: 20px;
  right: 20px; /* Mover para a direita */
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1); /* Animação ao passar o mouse */
  }
`;

const ThemeToggle = ({ toggleTheme, isDark }: { toggleTheme: () => void; isDark: boolean }) => {
  return (
    <ToggleContainer onClick={toggleTheme}>
      {isDark ? <FaSun size={24} /> : <FaMoon size={24} />}
    </ToggleContainer>
  );
};

export default ThemeToggle;
