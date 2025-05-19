import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Cadastro.module.css';
import homeStyles from './Home.module.css';

function Busca() {
  // Sidebar collapsed global (salva no localStorage)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true' ? true : false;
  });
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editandoNotasId, setEditandoNotasId] = useState(null);
  const [editNotas, setEditNotas] = useState({ media: '', notas: '' });
  const navigate = useNavigate();

  // Buscar cursos para o select
  useEffect(() => {
    fetch('http://localhost:3000/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data));
  }, []);

  // Buscar alunos
  const fetchAlunos = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:3000/api/alunos');
    const data = await res.json();
    setAlunos(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  // Filtro de busca
  const alunosFiltrados = alunos.filter(aluno =>
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
    aluno.cpf.includes(busca) ||
    aluno.curso.toLowerCase().includes(busca.toLowerCase())
  );

  // Iniciar edição
  const handleEditar = (aluno) => {
    setEditandoId(aluno.id);
    setEditForm({
      nome: aluno.nome,
      cpf: aluno.cpf,
      curso: aluno.curso,
      cota: aluno.cota,
      dataNascimento: aluno.dataNascimento ? aluno.dataNascimento.slice(0, 10) : '', // yyyy-mm-dd
      // media: aluno.media, // futuro
    });
  };

  // Cancelar edição
  const handleCancelar = () => {
    setEditandoId(null);
    setEditForm({});
  };

  // Salvar edição
  const handleSalvar = async (id) => {
    await fetch(`http://localhost:3000/api/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    setEditandoId(null);
    setEditForm({});
    fetchAlunos();
  };

  // Excluir aluno
  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este aluno?')) return;
    await fetch(`http://localhost:3000/api/alunos/${id}`, { method: 'DELETE' });
    fetchAlunos();
  };

  // Iniciar edição de notas
  const handleEditarNotas = (aluno) => {
    setEditandoNotasId(aluno.id);
    setEditNotas({
      media: aluno.media || '',
      notas: aluno.notas || ''
    });
  };

  // Salvar edição de notas
  const handleSalvarNotas = async (id) => {
    await fetch(`http://localhost:3000/api/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editNotas }),
    });
    setEditandoNotasId(null);
    setEditNotas({ media: '', notas: '' });
    fetchAlunos();
  };

  // Atualizar campos do formulário de edição
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  // Atualizar campos do formulário de edição de notas
  const handleEditNotasChange = (e) => {
    const { name, value } = e.target;
    setEditNotas(f => ({ ...f, [name]: value }));
  };

  // Sempre que mudar, salva no localStorage
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
            <i className="fas fa-users" style={{marginRight: 8}}></i>
            PESQUISAR ALUNOS
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
            className={homeStyles.navItem}
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
        <div className={styles.buscaContainer}>
          <div className={styles.buscaInner}>
            <button
              className={styles.buscaVoltarBtn}
              type="button"
              onClick={() => navigate('/home')}
            >
              &#8592; Voltar
            </button>
            <h2 className={styles.buscaTitle}>Pesquisar Alunos</h2>
            <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
              <input
                className={styles.buscaInput}
                placeholder="Buscar por nome, CPF ou curso..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
              <button className={styles.buscaButton} onClick={fetchAlunos}>Atualizar</button>
            </div>
            {loading ? (
              <p className={styles.buscaLoading}>Carregando...</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className={styles.buscaTable}>
                  <thead>
                    <tr>
                      <th className={styles.buscaTh}>Nome</th>
                      <th className={styles.buscaTh}>CPF</th>
                      <th className={styles.buscaTh}>Curso</th>
                      <th className={styles.buscaTh}>Cota</th>
                      <th className={styles.buscaTh}>Data Nasc.</th>
                      <th className={styles.buscaTh} style={{ textAlign: 'center' }}>Média Final</th>
                      <th className={styles.buscaTh} style={{ textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan={7} className={styles.buscaEmptyMessage}>Nenhum aluno encontrado.</td>
                      </tr>
                    )}
                    {alunosFiltrados.map(aluno => (
                      <tr key={aluno.id} className={styles.buscaTr}>
                        <td className={styles.buscaTd}>
                          {editandoId === aluno.id ? (
                            <input
                              name="nome"
                              className={styles.buscaInput}
                              value={editForm.nome}
                              onChange={handleEditChange}
                            />
                          ) : (
                            aluno.nome
                          )}
                        </td>
                        <td className={styles.buscaTd}>
                          {editandoId === aluno.id ? (
                            <input
                              name="cpf"
                              className={styles.buscaInput}
                              value={editForm.cpf}
                              onChange={handleEditChange}
                            />
                          ) : (
                            aluno.cpf
                          )}
                        </td>
                        <td className={styles.buscaTd}>
                          {editandoId === aluno.id ? (
                            <select
                              name="curso"
                              className={styles.buscaSelect}
                              value={editForm.curso}
                              onChange={handleEditChange}
                            >
                              <option value="">Selecione...</option>
                              {cursos.map(curso => (
                                <option key={curso.id} value={curso.sigla}>{curso.nome}</option>
                              ))}
                            </select>
                          ) : (
                            // Busca robusta pelo nome do curso
                            (() => {
                              const cursoObj = cursos.find(
                                c => (c.sigla || '').trim().toLowerCase() === (aluno.curso || '').trim().toLowerCase()
                              );
                              return cursoObj ? cursoObj.nome : aluno.curso;
                            })()
                          )}
                        </td>
                        <td className={styles.buscaTd}>
                          {editandoId === aluno.id ? (
                            <select
                              name="cota"
                              className={styles.buscaSelect}
                              value={editForm.cota}
                              onChange={handleEditChange}
                            >
                              <option value="">Selecione...</option>
                              <option value="rede_publica_ampla">Rede Pública - Ampla</option>
                              <option value="rede_publica_territorio">Rede Pública - Território</option>
                              <option value="rede_privada_ampla">Rede Privada - Ampla</option>
                              <option value="rede_privada_territorio">Rede Privada - Território</option>
                              <option value="estudante_com_deficiencia">Estudante com Deficiência</option>
                            </select>
                          ) : (
                            {
                              'rede_publica_ampla': 'Rede Pública - Ampla',
                              'rede_publica_territorio': 'Rede Pública - Território',
                              'rede_privada_ampla': 'Rede Privada - Ampla',
                              'rede_privada_territorio': 'Rede Privada - Território',
                              'estudante_com_deficiencia': 'Estudante com Deficiência'
                            }[aluno.cota] || aluno.cota
                          )}
                        </td>
                        <td className={styles.buscaTd}>
                          {editandoId === aluno.id ? (
                            <input
                              name="dataNascimento"
                              type="date"
                              className={styles.buscaInput}
                              value={editForm.dataNascimento || ''}
                              onChange={handleEditChange}
                              max={new Date().toISOString().split('T')[0]}
                            />
                          ) : (
                            aluno.dataNascimento
                              ? new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')
                              : ''
                          )}
                        </td>
                        <td className={styles.buscaTd} style={{ textAlign: 'center' }}>
                          {editandoNotasId === aluno.id ? (
                            <>
                              <input
                                className={styles.buscaInput}
                                name="media"
                                value={editNotas.media}
                                onChange={handleEditNotasChange}
                                style={{ width: 70, textAlign: 'center' }}
                              />
                              {/* Se quiser editar notas detalhadas, adicione campos extras aqui */}
                            </>
                          ) : (
                            <input
                              className={styles.buscaInput}
                              value={aluno.media !== undefined ? aluno.media : ''}
                              disabled
                              style={{ width: 70, textAlign: 'center', background: '#f5f5f5' }}
                              placeholder="—"
                              title="Média final"
                            />
                          )}
                        </td>
                        <td className={styles.buscaTd} style={{ textAlign: 'center', minWidth: 140 }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            {editandoId === aluno.id ? (
                              <>
                                <button
                                  className={styles.buscaButton}
                                  onClick={() => handleSalvar(aluno.id)}
                                >
                                  Salvar
                                </button>
                                <button
                                  className={styles.buscaButton}
                                  style={{ background: '#ccc', color: '#333' }}
                                  onClick={handleCancelar}
                                  type="button"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className={styles.buscaButton}
                                  onClick={() => handleEditar(aluno)}
                                >
                                  Editar
                                </button>
                                <button
                                  className={styles.buscaButton}
                                  style={{ background: '#f7c948', color: '#333' }}
                                  onClick={() => navigate(`/editar-notas/${aluno.id}`)}
                                >
                                  Editar Notas
                                </button>
                                <button
                                  className={styles.buscaExcluir}
                                  onClick={() => handleExcluir(aluno.id)}
                                >
                                  Excluir
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Busca;
