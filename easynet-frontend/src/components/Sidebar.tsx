import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { FaFileCode, FaListAlt, FaUserCog } from 'react-icons/fa';

const SidebarContainer = styled.div`
  background-color: ${(props) => props.theme.body};
  width: 250px;
  padding: 20px;
  height: 100vh;
`;

const SidebarItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${(props) => (props.active ? props.theme.button : props.theme.text)};
  text-decoration: none;
  border-left: 4px solid ${(props) => (props.active ? props.theme.button : 'transparent')};
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? props.theme.buttonHover : '#e1e1e1')};
  }
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const Sidebar = () => {
  const location = useLocation(); // Obtém a localização atual

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
