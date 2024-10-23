import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaFileCode, FaListAlt, FaUserCog } from 'react-icons/fa';

const SidebarContainer = styled.div`
  background-color: ${(props) => props.theme.body};
  width: 250px;
  padding: 20px;
  min-height: 100vh; /* Garante que a sidebar ocupe pelo menos 100% da altura da tela */
  position: fixed; 
  top: 0; 
  left: 0; 
  overflow-y: auto; 
`;

const SidebarItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${(props) => (props.active ? '#ffffff' : props.theme.text)}; /* Branco para o link ativo */
  text-decoration: none;
  border-left: 4px solid ${(props) => (props.active ? props.theme.button : 'transparent')};
  background-color: ${(props) => (props.active ? props.theme.button : 'transparent')}; /* Azul para o background do link ativo */
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? props.theme.buttonHover : '#ee1e1')}; /* Ajuste aqui, se necessário */
    color: ${(props) => (props.active ? '#ffffff' : props.theme.text)}; /* Garantindo que o texto continue legível ao passar o mouse */
  }
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const Sidebar = () => {
  const location = useLocation(); 
  return (
    <SidebarContainer>
      <SidebarItem to="/criar-script" active={location.pathname === '/criar-script'}>
        <SidebarIcon><FaFileCode /></SidebarIcon>
        Criar Script
      </SidebarItem>
      <SidebarItem to="/listar-scripts" active={location.pathname === '/listar-scripts'}>
        <SidebarIcon><FaListAlt /></SidebarIcon>
        Listar Scripts
      </SidebarItem>
      <SidebarItem to="/gerenciar-usuarios" active={location.pathname === '/gerenciar-usuarios'}>
        <SidebarIcon><FaUserCog /></SidebarIcon>
        Gerenciar Usuários
      </SidebarItem>
    </SidebarContainer>
  );
};

export default Sidebar;
