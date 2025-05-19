import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true' ? true : false;
  });
  const [userName, setUserName] = useState('Administrador');
  const navigate = useNavigate();

  useEffect(() => {
    const nome = localStorage.getItem('admin_nome');
    if (nome) setUserName(nome);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar_collapsed', !prev);
      return !prev;
    });
  };

  // Sidebar navigation
  const handleNav = (route) => {
    switch (route) {
      case 'dashboard':
        navigate('/home');
        break;
      case 'alunos':
        navigate('/alunos');
        break;
      case 'cursos':
        navigate('/cursos');
        break;
      case 'relatorios':
        navigate('/relatorios');
        break;
      case 'configuracoes':
        navigate('/configuracoes');
        break;
      default:
        break;
    }
  };

  // Cards actions
  const handleCard = (action) => {
    switch (action) {
      case 'cadastrar':
        navigate('/cadastro');
        break;
      case 'pesquisar':
        navigate('/alunos');
        break;
      case 'relatorios':
        navigate('/relatorios');
        break;
      case 'cursos':
        navigate('/cursos');
        break;
      default:
        break;
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      {/* Top Menu */}
      <div className={styles.topMenu}>
        <span className={styles.topMenuTitle}>
          <img src="/img/logo.png" alt="Logo da Instituição" className={styles.topMenuLogo} />
          <span>SISTEMA DE SELEÇÃO</span>
        </span>
      </div>

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.profile}>
          <img src="/img/user.jpg" alt="Foto do usuário" />
          <div className={styles.profileName}>{userName}</div>
        </div>
        <nav className={styles.sidebarNav} aria-label="Menu principal">
          <button
            className={`${styles.navItem} ${window.location.pathname === '/home' ? styles.active : ''}`}
            onClick={() => handleNav('dashboard')}
          >
            <i className="fas fa-home"></i>
            <span className={styles.navText}>Dashboard</span>
          </button>
          <button
            className={`${styles.navItem} ${window.location.pathname === '/alunos' ? styles.active : ''}`}
            onClick={() => handleNav('alunos')}
          >
            <i className="fas fa-users"></i>
            <span className={styles.navText}>Alunos</span>
          </button>
          <button
            className={styles.navItem}
            onClick={() => handleNav('cursos')}
          >
            <i className="fas fa-book"></i>
            <span className={styles.navText}>Cursos</span>
          </button>
          <button
            className={styles.navItem}
            onClick={() => handleNav('relatorios')}
          >
            <i className="fas fa-chart-bar"></i>
            <span className={styles.navText}>Relatórios</span>
          </button>
          <button
            className={styles.navItem}
            onClick={() => handleNav('configuracoes')}
          >
            <i className="fas fa-cog"></i>
            <span className={styles.navText}>Configurações</span>
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            <span className={styles.logoutText}>Sair</span>
          </button>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <button
        className={styles.sidebarToggleBtn}
        onClick={handleSidebarToggle}
        aria-label="Expandir/retrair menu"
        tabIndex={-1}
        type="button"
      >
        <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
      </button>

      {/* Main Content */}
      <div className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.dashboardHeader} style={{ justifyContent: 'center' }}>
          <h1 className={styles.dashboardTitle} style={{ textAlign: 'center', width: '100%' }}>
            <i className="fas fa-home" style={{ marginRight: 10 }}></i>
            Bem-vindo ao Sistema de Seleção
          </h1>
        </div>
        <div className={styles.cardContainer}>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('cadastrar')}
          >
            <img src="/img/adicionar.png" alt="Ícone de cadastro" />
            <span>CADASTRAR ALUNO</span>
            <p className={styles.cardDescription}>Adicione novos alunos ao sistema</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('pesquisar')}
          >
            <img src="/img/pesquisar.png" alt="Ícone de pesquisa" />
            <span>PESQUISAR ALUNO</span>
            <p className={styles.cardDescription}>Consulte e edite informações de alunos</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('relatorios')}
          >
            <img src="/img/relatorio.png" alt="Ícone de relatório" />
            <span>RELATÓRIOS</span>
            <p className={styles.cardDescription}>Gere relatórios e estatísticas</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('cursos')}
          >
            <img src="/img/curso.png" alt="Ícone de cursos" />
            <span>CURSOS</span>
            <p className={styles.cardDescription}>Gerencie cursos e turmas</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => navigate('/alunos?editarNotas=1')}
          >
            <img src="/img/editar.png" alt="Ícone de notas" /> 
            <span>EDITAR NOTAS</span>
            <p className={styles.cardDescription}>Edite as notas de um aluno</p>
          </div>
        </div>
      </div>
      {/* Rodapé com versão e contato */}
      <footer style={{
        width: '100%',
        textAlign: 'center',
        padding: '18px 0 10px 0',
        color: '#888',
        fontSize: 14,
        background: 'none',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 9999,
        letterSpacing: 0.2
      }}>
        Sistema de Seleção v1.0.0 &nbsp;|&nbsp; Desenvolvido por <a href="https://www.instagram.com/jkenteni/" style={{color:'#007a32'}}>Kenteni Alves</a>
      </footer>
    </div>
  );
}

export default Home;
