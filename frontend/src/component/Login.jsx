import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resposta = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (resposta.ok) {
      localStorage.setItem('token', dados.token);
      if (dados.nome) {
        localStorage.setItem('admin_nome', dados.nome);
      }
      navigate('/home');
    } else {
      setErro(dados.error || 'Erro no login');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="welcome-panel">
          <div className="panel-content">
            <h1 className="welcome-title">Olá,<br />Bem-Vindo!</h1>
            <p className="welcome-description">
              Sistema desenvolvido para <strong>otimizar o processo de seleção de alunos</strong>,
              totalmente <strong>criado e implementado por estudantes</strong> da EEEP Padre Bosco de Lima.
            </p>
            <a href="https://www.instagram.com/eeeppejoaoboscodelima/">
            <button className="see-more-btn">Veja Mais</button>
            </a>
          </div>
        </div>

        <div className="login-form">
          <img src="/img/logo.png" alt="Logo" className="form-logo" />
          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Usuário</label>
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder=" "
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <label>Senha</label>
            </div>

            <button type="submit" className="submit-button">Entrar</button>
            {erro && <p style={{ color: 'red', marginTop: '10px' }}>{erro}</p>}
          </form>
        </div>
      </div>

      <footer className="page-footer">
        <a href="https://www.instagram.com/jkenteni/">@jkenteni 2025</a> | Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default Login;
