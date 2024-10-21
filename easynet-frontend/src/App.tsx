// src/app.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CriarScript from './components/CriarScript'; // Importando o componente CriarScript
import ListarScripts from './components/ListarScripts'; // Importando outros componentes, se necessário
import GerenciarUsuarios from './components/GerenciarUsuarios'; // Importando o componente para gerenciar usuários


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="criar-script" element={<CriarScript />} />
          <Route path="listar-scripts" element={<ListarScripts />} />
          <Route path="gerenciar-usuarios" element={<GerenciarUsuarios />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
