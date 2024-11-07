// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CriarScript from './components/CriarScript';
import ListarScripts from './components/ListarScripts';
import EditarScript from './components/EditarScript';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    console.log("Usuário autenticado!");
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Página de login na rota raiz */}
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        
        {/* Rotas do Dashboard com autenticação */}
        {isAuthenticated ? (
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Redireciona "/dashboard" para "/dashboard/listar-scripts" */}
            <Route index element={<Navigate to="listar-scripts" replace />} />
            <Route path="criar-script" element={<CriarScript />} />
            <Route path="listar-scripts" element={<ListarScripts />} />
            <Route path="editar-script" element={<EditarScript />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
