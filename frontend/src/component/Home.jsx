import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <h1>Página Principal</h1>
      <p>Bem-vindo(a), administrador!</p>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}

export default Home;
