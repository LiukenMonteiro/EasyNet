import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaFileCode, FaListAlt, FaBars } from 'react-icons/fa';
import { useState } from 'react';

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  background-color: ${(props) => props.theme.body};
  width: ${(props) => (props.isOpen ? '250px' : '70px')};
  padding: 20px;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  transition: width 0.3s;

  @media (max-width: 768px) {
    width: ${(props) => (props.isOpen ? '250px' : '0')};
    padding: ${(props) => (props.isOpen ? '20px' : '0')};
    overflow: hidden;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: -40px;
  background: ${(props) => props.theme.button};
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 50%; /* Torna o botão redondo */

  @media (min-width: 768px) {
    display: none;
  }
`;

const SidebarItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${(props) => (props.active ? '#ffffff' : props.theme.text)};
  text-decoration: none;
  border-left: 4px solid ${(props) => (props.active ? props.theme.button : 'transparent')};
  background-color: ${(props) => (props.active ? props.theme.button : 'transparent')};
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? props.theme.buttonHover : '#ee1e1')};
    color: ${(props) => (props.active ? '#ffffff' : props.theme.text)};
  }
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <ToggleButton onClick={toggleSidebar}>
          {/* Usando a cor do tema para o ícone */}
          <FaBars style={{ color: '#003f5c' }} /> {/* Cor azul mais escura */}
        </ToggleButton>
        {isOpen && (
          <>
            <SidebarItem to="/criar-script" active={location.pathname === '/criar-script'}>
              <SidebarIcon><FaFileCode /></SidebarIcon>
              Criar Script
            </SidebarItem>
            <SidebarItem to="/listar-scripts" active={location.pathname === '/listar-scripts'}>
              <SidebarIcon><FaListAlt /></SidebarIcon>
              Listar Scripts
            </SidebarItem>
          </>
        )}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
