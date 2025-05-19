import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';
import configStyles from './Configuracoes.module.css';

function Configuracoes() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true' ? true : false;
  });
  const [showSenhaPopup, setShowSenhaPopup] = useState(false);
  const [showCreditos, setShowCreditos] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  // Dados do usuário
  const localNome = localStorage.getItem('admin_nome') || 'Administrador';
  const localEmail = localStorage.getItem('admin_email') || 'admin@exemplo.com';
  const [userName, setUserName] = useState(localNome);
  const [editandoNome, setEditandoNome] = useState(false);
  const [novoNome, setNovoNome] = useState(localNome);

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
    localStorage.removeItem('admin_nome');
    localStorage.removeItem('admin_email');
    navigate('/');
  };

  // Alterar nome (frontend + backend)
  const handleSalvarNome = async () => {
    if (!novoNome.trim() || novoNome === userName) {
      setEditandoNome(false);
      return;
    }
    setLoading(true);
    setMensagem('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/usuarios/alterar-nome', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ nome: novoNome })
      });
      const data = await res.json();
      if (res.ok) {
        setUserName(novoNome);
        localStorage.setItem('admin_nome', novoNome);
        setEditandoNome(false);
      } else {
        setMensagem(data.erro || 'Erro ao alterar nome.');
      }
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    }
    setLoading(false);
  };

  // Alterar senha (backend, faz logout ao sucesso)
  const handleTrocarSenha = async (e) => {
    e.preventDefault();
    setMensagem('');
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setMensagem('Preencha todos os campos.');
      return;
    }
    if (novaSenha.length < 6) {
      setMensagem('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setMensagem('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/usuarios/trocar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ senhaAtual, novaSenha })
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem('Senha alterada com sucesso! Redirecionando para login...');
        setTimeout(() => {
          handleLogout();
        }, 1500);
      } else {
        setMensagem(data.erro || 'Erro ao trocar senha.');
      }
    } catch {
      setMensagem('Erro de conexão com o servidor.');
    }
    setLoading(false);
  };

  const handleEditarNome = () => {
    setEditandoNome(true);
    setNovoNome(userName);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar_collapsed', !prev);
      return !prev;
    });
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Top Menu */}
      <div className={styles.topMenu}>
        <span className={styles.topMenuTitle}>
          <img src="/img/logo.png" alt="Logo da Instituição" className={styles.topMenuLogo} />
          <span>
            <i className="fas fa-cog" style={{ marginRight: 8 }}></i>
            CONFIGURAÇÕES
          </span>
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
            className={`${styles.navItem} ${window.location.pathname === '/configuracoes' ? styles.active : ''}`}
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
      <div
        className={`${styles.mainContent} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          paddingBottom: 0
        }}
      >
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>
            <i className="fas fa-cog" style={{ marginRight: 10 }}></i>
            Configurações do Sistema
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            width: '100%',
            minHeight: 0
          }}
        >
          {/* Opções centralizadas + usuário dentro do container */}
          <div className={configStyles.optionsCard}>
            {/* Usuário centralizado dentro do card */}
            <div className={configStyles.userBox}>
              <img src="/img/user.jpg" alt="Usuário" className={configStyles.userImg} />
              <div className={configStyles.userNameRow}>
                {editandoNome ? (
                  <>
                    <input
                      className={configStyles.userNameInput}
                      value={novoNome}
                      onChange={e => setNovoNome(e.target.value)}
                      autoFocus
                      onBlur={handleSalvarNome}
                      onKeyDown={e => { if (e.key === 'Enter') handleSalvarNome(); }}
                      disabled={loading}
                    />
                    <button className={configStyles.userNameSaveBtn} onClick={handleSalvarNome} title="Salvar" disabled={loading}>
                      <i className="fas fa-check"></i>
                    </button>
                  </>
                ) : (
                  <>
                    <span className={configStyles.userName}>{userName}</span>
                    <button className={configStyles.userNameEditBtn} onClick={handleEditarNome} title="Editar nome">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </>
                )}
              </div>
              <div className={configStyles.userEmail}>
                <i className="fas fa-envelope" style={{ marginRight: 6, color: '#888' }}></i>
                <span>{localEmail}</span>
              </div>
            </div>
            {/* Botões de ação */}
            <button
              className={configStyles.actionBtn}
              onClick={() => setShowSenhaPopup(true)}
            >
              <i className="fas fa-key"></i> Alterar Senha
            </button>
            <button
              className={configStyles.actionBtn}
              style={{ background: '#eee', color: '#007a32' }}
              onClick={() => setShowCreditos(true)}
            >
              <i className="fas fa-star"></i> Créditos & Agradecimentos
            </button>
            {/* Espaço para contato do suporte - agora dentro do card, no final */}
            <div className={configStyles.suporteBox} style={{ marginTop: 28 }}>
              <div className={configStyles.suporteTitle}>
                <i className="fas fa-headset" style={{ marginRight: 8 }}></i>
                Suporte
              </div>
              <div className={configStyles.suporteContato}>
                <span>Email: <a href="mailto:josekenteniab@gmail.com">josekenteniab@gmail.com</a></span>
                <span>WhatsApp: <a href="https://wa.me/5588981055493" target="_blank" rel="noopener noreferrer">(88) 98105-5493</a></span>
              </div>
            </div>
            {/* Rodapé dentro do card */}
            <div
              style={{
                marginTop: 32,
                marginBottom: 0,
                background: 'none',
                width: '100%',
                textAlign: 'center',
                fontSize: 14,
                color: '#888'
              }}
            >
              Sistema de Seleção v1.0.0 &nbsp;|&nbsp; Desenvolvido por{' '}
              <a
                href="https://www.instagram.com/jkenteni/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007a32' }}
              >
                Kenteni Alves
              </a>
            </div>
          </div>
        </div>
        {/* Popup de Alterar Senha */}
        {showSenhaPopup && (
          <div className={configStyles.popupOverlay} onClick={() => setShowSenhaPopup(false)}>
            <div
              className={configStyles.popupCard}
              onClick={e => e.stopPropagation()}
            >
              <button
                className={configStyles.popupClose}
                onClick={() => setShowSenhaPopup(false)}
                aria-label="Fechar"
                type="button"
              >
                &times;
              </button>
              <h2 className={configStyles.popupTitle}><i className="fas fa-key" style={{marginRight:8}}></i>Alterar Senha</h2>
              <form className={configStyles.form} onSubmit={handleTrocarSenha} autoComplete="off">
                <div className={configStyles.formGroup}>
                  <label>Senha Atual</label>
                  <input
                    type="password"
                    value={senhaAtual}
                    onChange={e => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className={configStyles.formGroup}>
                  <label>Nova Senha</label>
                  <input
                    type="password"
                    value={novaSenha}
                    onChange={e => setNovaSenha(e.target.value)}
                    placeholder="Nova senha"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <div className={configStyles.formGroup}>
                  <label>Confirmar Nova Senha</label>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={e => setConfirmarSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <button className={configStyles.saveBtn} type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
                {mensagem && (
                  <div className={mensagem.includes('sucesso') ? configStyles.successMsg : configStyles.errorMsg}>
                    {mensagem}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
        {/* Popup de Créditos */}
        {showCreditos && (
          <div className={configStyles.popupOverlay} onClick={() => setShowCreditos(false)}>
            <div
              className={configStyles.popupCard}
              onClick={e => e.stopPropagation()}
              style={{maxWidth: 500}}
            >
              <button
                className={configStyles.popupClose}
                onClick={() => setShowCreditos(false)}
                aria-label="Fechar"
                type="button"
              >
                &times;
              </button>
              <h2 className={configStyles.popupTitle}>
                <i className="fas fa-star" style={{ marginRight: 8 }}></i>
                Créditos & Agradecimentos
              </h2>
              <div style={{ margin: '18px 0', color: '#333', fontSize: 16, lineHeight: 1.6 }}>
                <strong>Sistema de Seleção</strong> criado por:
                <br />
                <a
                  href="https://www.instagram.com/jkenteni/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007a32', textDecoration: 'none' }}
                >
                  Kenteni Alves
                </a>
                {' e '}
                <a
                  href="https://www.instagram.com/israelicaro_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007a32', textDecoration: 'none' }}
                >
                  Icaro Israel
                </a>
                .
                <br />
                <br />
                <strong>Agradecimentos:</strong>
                <ul style={{ paddingLeft: 20 }}>
                  <li>EEEP Pe. João Bosco de Lima</li>
                  <li>Professores, alunos do 3° Informática 2025 e equipe gestora</li>
                  <li>Todos que colaboraram com sugestões e testes</li>
                </ul>
                <br />
                <span style={{ fontSize: 13, color: '#888' }}>Versão 1.0.0</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Configuracoes;
