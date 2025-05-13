import { useEffect, useState } from 'react';
import styles from './Cadastro.module.css';

function Busca() {
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Atualizar campos do formulário de edição
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

  return (
    <div className={styles.buscaContainer}>
      <div className={styles.buscaInner}>
        <button
          className={styles.buscaVoltarBtn}
          type="button"
          onClick={() => window.history.back()}
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
                  <th className={styles.buscaTh} style={{ textAlign: 'center' }}>Média Final</th>
                  <th className={styles.buscaTh} style={{ textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {alunosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.buscaEmptyMessage}>Nenhum aluno encontrado.</td>
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
                        cursos.find(c => c.sigla === aluno.curso)?.nome || aluno.curso
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
                    <td className={styles.buscaTd} style={{ textAlign: 'center' }}>
                      {/* Futuro: editar notas */}
                      <input
                        className={styles.buscaInput}
                        value={aluno.media !== undefined ? aluno.media : ''}
                        disabled
                        style={{ width: 70, textAlign: 'center', background: '#f5f5f5' }}
                        placeholder="—"
                        title="Média final (em breve editável)"
                      />
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
  );
}

export default Busca;
