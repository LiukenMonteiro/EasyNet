// src/app.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CriarScript from './components/CriarScript';
import ListarScripts from './components/ListarScripts';
import GerenciarUsuarios from './components/GerenciarUsuarios'; 
import EditarScript from './components/EditarScript'; // Adicione isso

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="criar-script" element={<CriarScript />} />
          <Route path="listar-scripts" element={<ListarScripts />} />
          <Route path="gerenciar-usuarios" element={<GerenciarUsuarios />} />
          <Route path="editar-script" element={<EditarScript />} /> {/* Rota para editar script */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
