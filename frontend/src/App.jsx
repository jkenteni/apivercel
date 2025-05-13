import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Cadastro from './component/Cadastro';
import PrivateRoute from './component/PrivateRoute';
import Cursos from './component/Cursos';

function Placeholder({ title }) {
  return (
    <div style={{ padding: 40 }}>
      <h2>{title}</h2>
      <p>Em breve...</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/cadastro" element={
          <PrivateRoute>
            <Cadastro />
          </PrivateRoute>
        } />
        <Route path="/alunos" element={
          <PrivateRoute>
            <Placeholder title="Alunos" />
          </PrivateRoute>
        } />
        <Route path="/cursos" element={
          <PrivateRoute>
            <Cursos />
          </PrivateRoute>
        } />
        <Route path="/relatorios" element={
          <PrivateRoute>
            <Placeholder title="Relatórios" />
          </PrivateRoute>
        } />
        <Route path="/configuracoes" element={
          <PrivateRoute>
            <Placeholder title="Configurações" />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
