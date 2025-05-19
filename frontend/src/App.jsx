import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import Cadastro from './component/Cadastro';
import PrivateRoute from './component/PrivateRoute';
import Cursos from './component/Cursos';
import Busca from './component/Busca';
import CadastroNotas from './component/CadastroNotas';
import Relatorios from './component/Relatorios';
import Configuracoes from './component/Configurações';

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
            <Busca />
          </PrivateRoute>
        } />
        <Route path="/cursos" element={
          <PrivateRoute>
            <Cursos />
          </PrivateRoute>
        } />
        <Route path="/relatorios" element={
          <PrivateRoute>
            <Relatorios />
          </PrivateRoute>
        } />
        <Route path="/configuracoes" element={
          <PrivateRoute>
            <Configuracoes />
          </PrivateRoute>
        } />
        <Route path="/editar-notas/:id" element={
          <PrivateRoute>
            <EditarNotasWrapper />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

// Wrapper para passar props para CadastroNotas em modo edição
import { useParams, useNavigate } from 'react-router-dom';
function EditarNotasWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSalvar = async (notas, media) => {
    await fetch(`http://localhost:3000/api/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas, media }),
    });
    alert('Notas atualizadas com sucesso!');
    navigate('/alunos');
  };
  return <CadastroNotas alunoId={id} onSalvar={handleSalvar} modoEdicao />;
}

export default App;
