import { useEffect, useState } from 'react';
import styles from './Cadastro.module.css';
import homeStyles from './Home.module.css';
import { useNavigate } from 'react-router-dom';

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true' ? true : false;
  });
  const navigate = useNavigate();

  const fetchCursos = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:3000/api/cursos');
    const data = await res.json();
    setCursos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!nome || !sigla) return;
    if (sigla.length !== 3) {
      alert('A sigla deve conter exatamente 3 letras.');
      return;
    }
    await fetch('http://localhost:3000/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, sigla }),
    });
    setNome('');
    setSigla('');
    fetchCursos();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/cursos/${id}`, { method: 'DELETE' });
    fetchCursos();
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar_collapsed', !prev);
      return !prev;
    });
  };

  return (
    <div>
      {/* Top Menu */}
      <div className={homeStyles.topMenu}>
        <span className={homeStyles.topMenuTitle}>
          <img src="/img/logo.png" alt="Logo da Instituição" className={homeStyles.topMenuLogo} />
          <span>
            <i className="fas fa-book" style={{marginRight: 8}}></i>
            GERENCIAR CURSOS
          </span>
        </span>
      </div>

      {/* Sidebar */}
      <div className={`${homeStyles.sidebar} ${sidebarCollapsed ? homeStyles.collapsed : ''}`}>
        <div className={homeStyles.profile}>
          <img src="/img/user.jpg" alt="Foto do usuário" />
          <div className={homeStyles.profileName}>{localStorage.getItem('admin_nome') || 'Administrador'}</div>
        </div>
        <nav className={homeStyles.sidebarNav} aria-label="Menu principal">
          <button
            className={`${homeStyles.navItem} ${window.location.pathname === '/home' ? homeStyles.active : ''}`}
            onClick={() => navigate('/home')}
          >
            <i className="fas fa-home"></i>
            <span className={homeStyles.navText}>Dashboard</span>
          </button>
          <button
            className={`${homeStyles.navItem} ${window.location.pathname === '/alunos' ? homeStyles.active : ''}`}
            onClick={() => navigate('/alunos')}
          >
            <i className="fas fa-users"></i>
            <span className={homeStyles.navText}>Alunos</span>
          </button>
          <button
            className={`${homeStyles.navItem} ${window.location.pathname === '/cursos' ? homeStyles.active : ''}`}
            onClick={() => navigate('/cursos')}
          >
            <i className="fas fa-book"></i>
            <span className={homeStyles.navText}>Cursos</span>
          </button>
          <button
            className={homeStyles.navItem}
            onClick={() => navigate('/relatorios')}
          >
            <i className="fas fa-chart-bar"></i>
            <span className={homeStyles.navText}>Relatórios</span>
          </button>
          <button
            className={homeStyles.navItem}
            onClick={() => navigate('/configuracoes')}
          >
            <i className="fas fa-cog"></i>
            <span className={homeStyles.navText}>Configurações</span>
          </button>
        </nav>
        <div className={homeStyles.sidebarFooter}>
          <button className={homeStyles.logoutBtn} onClick={() => {
            localStorage.removeItem('token');
            navigate('/');
          }}>
            <i className="fas fa-sign-out-alt"></i>
            <span className={homeStyles.logoutText}>Sair</span>
          </button>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <button
        className={homeStyles.sidebarToggleBtn}
        onClick={handleSidebarToggle}
        aria-label="Expandir/retrair menu"
        tabIndex={-1}
        type="button"
      >
        <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      {/* Conteúdo principal */}
      <div className={`${homeStyles.mainContent} ${sidebarCollapsed ? homeStyles.sidebarCollapsed : ''}`}>
        <div className={styles.cadastroContainer}>
          <div className={styles.container}>
            {/* Botão Voltar */}
            <button
              className={styles.buscaVoltarBtn}
              type="button"
              onClick={() => window.history.back()}
            >
              &#8592; Voltar
            </button>
            <h2 className={styles.title}>Gerenciar Cursos</h2>
            <form onSubmit={handleAdd} className={styles.form} style={{marginBottom: 30}}>
              <div className={styles.flexContainer}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome do Curso</label>
                  <input
                    className={styles.input}
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    required
                    placeholder="Ex: Informática"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sigla</label>
                  <input
                    className={styles.input}
                    value={sigla}
                    onChange={e => {
                      // Permite apenas letras e máximo 3 caracteres
                      const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
                      setSigla(val);
                    }}
                    required
                    maxLength={3}
                    placeholder="Ex: INF"
                  />
                </div>
              </div>
              <button
                type="submit"
                className={styles.cadastraButton}
                style={{maxHeight: 48, marginTop: 18, alignSelf: 'center'}}
              >
                Adicionar
              </button>
            </form>
            <h3 style={{marginBottom: 10}}>Cursos Cadastrados</h3>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <table style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                  <tr>
                    <th style={{textAlign: 'left', padding: 8}}>Nome</th>
                    <th style={{textAlign: 'left', padding: 8}}>Sigla</th>
                    <th style={{padding: 8}}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {(cursos.slice().sort((a, b) => a.nome.localeCompare(b.nome))).map(curso => (
                    <tr key={curso.id}>
                      <td>{curso.nome}</td>
                      <td>{curso.sigla}</td>
                      <td style={{textAlign: 'center'}}>
                        <button
                          className={styles.buscaExcluir}
                          onClick={() => handleDelete(curso.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                  {cursos.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{textAlign: 'center', padding: 16}}>Nenhum curso cadastrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cursos;
