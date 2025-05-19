import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Home.module.css';

function Relatorios() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true' ? true : false;
  });
  const [userName, setUserName] = useState('Administrador');
  const [estatisticas, setEstatisticas] = useState(null);
  const [showEstatisticas, setShowEstatisticas] = useState(false);

  useEffect(() => {
    const nome = localStorage.getItem('admin_nome');
    if (nome) setUserName(nome);
  }, []);

  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCard = async (action) => {
    switch (action) {
      case 'pdf':
        alert('Função de geração de PDF em breve!');
        break;
      case 'estatisticas':
        setShowEstatisticas(true);
        setEstatisticas(null);
        try {
          const res = await fetch('http://localhost:3000/api/alunos/estatisticas');
          const data = await res.json();
          setEstatisticas(data);
        } catch {
          setEstatisticas({ erro: 'Erro ao buscar estatísticas' });
        }
        break;
      case 'exportar':
        // Exportar para Excel
        try {
          const res = await fetch('http://localhost:3000/api/alunos/exportar');
          if (!res.ok) throw new Error('Erro ao exportar');
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'alunos.xlsx';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } catch {
          alert('Erro ao exportar dados.');
        }
        break;
      default:
        break;
    }
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
      <div className={styles.topMenu}>
        <span className={styles.topMenuTitle}>
          <img src="/img/logo.png" alt="Logo da Instituição" className={styles.topMenuLogo} />
          <span>RELATÓRIOS</span>
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
            className={`${styles.navItem} ${window.location.pathname === '/relatorios' ? styles.active : ''}`}
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
            <i className="fas fa-book" style={{ marginRight: 10 }}></i>
            Relatórios e Exportações
          </h1>
        </div>
        <div className={styles.cardContainer}>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('pdf')}
          >
            <img src="/img/gerarpdf.png" alt="Ícone PDF" />
            <span>GERAR PDF</span>
            <p className={styles.cardDescription}>Gere relatórios em PDF dos alunos</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('estatisticas')}
          >
            <img src="/img/estatisticas.png" alt="Ícone Estatísticas" />
            <span>ESTATÍSTICAS</span>
            <p className={styles.cardDescription}>Visualize estatísticas gerais</p>
          </div>
          <div
            className={styles.card}
            tabIndex={0}
            role="button"
            onClick={() => handleCard('exportar')}
          >
            <img src="/img/excel.png" alt="Ícone Excel" />
            <span>EXPORTAR DADOS</span>
            <p className={styles.cardDescription}>Exporte dados para o formato Excel</p>
          </div>
        </div>
      </div>

      {/* Popup de Estatísticas */}
      {showEstatisticas && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => setShowEstatisticas(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              padding: 36,
              maxWidth: 480,
              width: '90%',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowEstatisticas(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 16,
                background: 'none',
                border: 'none',
                fontSize: 22,
                color: '#888',
                cursor: 'pointer'
              }}
              aria-label="Fechar"
            >
              &times;
            </button>
            <h2 style={{ marginBottom: 18, color: '#007a32' }}>Estatísticas Gerais</h2>
            {!estatisticas && <p>Carregando...</p>}
            {estatisticas && estatisticas.erro && <p style={{ color: 'red' }}>{estatisticas.erro}</p>}
            {estatisticas && !estatisticas.erro && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <strong>Total de alunos cadastrados:</strong> {estatisticas.totalAlunos}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <strong>Total por curso:</strong>
                  <ul style={{ marginTop: 6, marginBottom: 0 }}>
                    {estatisticas.porCurso.length === 0 && <li>Nenhum curso encontrado.</li>}
                    {estatisticas.porCurso.map(c =>
                      <li key={c.curso}>
                        {c.curso}: {c.total}
                      </li>
                    )}
                  </ul>
                </div>
                <div>
                  <strong>Total por tipo de cota:</strong>
                  <ul style={{ marginTop: 6 }}>
                    {estatisticas.porCota.length === 0 && <li>Nenhuma cota encontrada.</li>}
                    {estatisticas.porCota.map(c =>
                      <li key={c.cota}>
                        {({
                          'rede_publica_ampla': 'Rede Pública - Ampla',
                          'rede_publica_territorio': 'Rede Pública - Território',
                          'rede_privada_ampla': 'Rede Privada - Ampla',
                          'rede_privada_territorio': 'Rede Privada - Território',
                          'estudante_com_deficiencia': 'Estudante com Deficiência'
                        }[c.cota] || c.cota)}: {c.total}
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Relatorios;
