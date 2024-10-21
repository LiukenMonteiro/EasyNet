// src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom'; // Importando Outlet para renderizar rotas aninhadas
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import { lightTheme, darkTheme } from '../theme';
import ThemeToggle from './ThemeToggle';
import { FaFileCode, FaListAlt, FaUserCog, FaAngleLeft, FaAngleRight } from 'react-icons/fa';

// Estilização dos componentes
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease-in-out;
`;

const Sidebar = styled.div<{ isOpen: boolean }>`
  width: ${({ isOpen }) => (isOpen ? '250px' : '60px')};
  background-color: ${({ theme }) => theme.sidebar};
  padding: ${({ isOpen }) => (isOpen ? '20px' : '10px')};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  transition: all 0.3s ease-in-out;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const SidebarItem = styled(Link)<{ active: boolean }>`
  padding: 15px 10px;
  text-decoration: none;
  color: ${({ active, theme }) => (active ? theme.body : theme.text)};
  display: flex;
  align-items: center;
  border-radius: 5px;
  margin: 5px 0;
  background-color: ${({ active, theme }) => (active ? theme.button : 'transparent')};
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.buttonHover};
    color: ${({ theme }) => (theme.body === '#333' ? '#ffffff' : theme.body)};
  }
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
  font-size: 20px;
  color: ${({ theme }) => theme.icon};
`;

const ContentArea = styled.div`
  flex-grow: 1;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  color: ${({ theme }) => (theme.body === '#333' ? '#00ccff' : theme.button)};
  margin: 20px 0;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const Dashboard = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const location = useLocation();

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <GlobalStyle />
      <DashboardContainer>
        <Sidebar isOpen={isSidebarOpen}>
          <ToggleButton onClick={toggleSidebar}>
            {isSidebarOpen ? <FaAngleLeft /> : <FaAngleRight />}
          </ToggleButton>
          {isSidebarOpen && (
            <>
              <SidebarItem to="/dashboard/criar-script" active={location.pathname === '/dashboard/criar-script'}>
                <SidebarIcon><FaFileCode /></SidebarIcon>
                Criar Script
              </SidebarItem>
              <SidebarItem to="/dashboard/listar-scripts" active={location.pathname === '/dashboard/listar-scripts'}>
                <SidebarIcon><FaListAlt /></SidebarIcon>
                Listar Scripts
              </SidebarItem>
              <SidebarItem to="/dashboard/gerenciar-usuarios" active={location.pathname === '/dashboard/gerenciar-usuarios'}>
                <SidebarIcon><FaUserCog /></SidebarIcon>
                Gerenciar Usuários
              </SidebarItem>
            </>
          )}
        </Sidebar>
        <ContentArea>
          <Header>
            <h2>Dashboard EASYNET</h2>
            <ThemeToggle toggleTheme={toggleTheme} isDark={theme === 'dark'} />
          </Header>
          {/* Aqui você renderiza as rotas aninhadas usando o Outlet */}
          <Outlet />
        </ContentArea>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
