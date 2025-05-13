import { useEffect, useState } from 'react';
import styles from './Cadastro.module.css';

function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [nome, setNome] = useState('');
  const [sigla, setSigla] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.container}>
        {/* Botão Voltar */}
        <button
          className={styles.voltarBtn}
          type="button"
          onClick={() => window.history.back()}
        >
          &#8592; Voltar
        </button>
        <h2 className={styles.title}>Gerenciar Cursos</h2>
        <form onSubmit={handleAdd} className={styles.form} style={{marginBottom: 30}}>
          <div className={styles.selectRow}>
            <div className={styles.selectGroup}>
              <label className={styles.label}>Nome do Curso</label>
              <input
                className={styles.input}
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
                placeholder="Ex: Agropecuária"
              />
            </div>
            <div className={styles.selectGroup}>
              <label className={styles.label}>Sigla</label>
              <input
                className={styles.input}
                value={sigla}
                onChange={e => setSigla(e.target.value)}
                required
                maxLength={10}
                placeholder="Ex: AGR"
              />
            </div>
            <button type="submit" className={styles.button} style={{maxHeight: 48, alignSelf: 'end'}}>Adicionar</button>
          </div>
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
                      className={styles["excluir"]}
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
  );
}

export default Cursos;
