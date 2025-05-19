import { useState, useEffect } from 'react';
import styles from './Cadastro.module.css';
import { useNavigate } from 'react-router-dom';

const materiasPadrao = [
  'Língua Portuguesa',
  'Matemática',
  'Ciências',
  'História',
  'Geografia',
  'Inglês',
  'Artes',
  'Educação Física'
];

const anos = [
  { ano: 6, cor: '#007a32' },
  { ano: 7, cor: '#ffd600' },
  { ano: 8, cor: '#A020F0' },
  { ano: 9, cor: '#d32f2f' }
];

function CadastroNotas({ alunoId, onSalvar, modoEdicao = false }) {
  const [anoAtivo, setAnoAtivo] = useState(6);
  const [notas, setNotas] = useState({
    6: materiasPadrao.map(m => ({ materia: m, bimestres: ['', '', '', ''] })),
    7: materiasPadrao.map(m => ({ materia: m, bimestres: ['', '', '', ''] })),
    8: materiasPadrao.map(m => ({ materia: m, bimestres: ['', '', '', ''] })),
    9: materiasPadrao.map(m => ({ materia: m, bimestres: ['', '', '', ''] })),
  });
  const [novaMateria, setNovaMateria] = useState({ 6: '', 7: '', 8: '', 9: '' });
  const [carregando, setCarregando] = useState(false);
  const [notasPendentes, setNotasPendentes] = useState({}); // { ano: { idx: [bim, ...] } }

  const navigate = useNavigate();

  useEffect(() => {
    if (modoEdicao && alunoId) {
      setCarregando(true);
      fetch(`http://localhost:3000/api/alunos`)
        .then(res => res.json())
        .then(alunos => {
          const aluno = alunos.find(a => a.id === Number(alunoId));
          if (aluno && aluno.notas) {
            // Garante estrutura robusta para cada ano/matéria/bimestre
            const notasComPadrao = {};
            for (const a of [6,7,8,9]) {
              // Se não existir, cria array vazio
              let orig = Array.isArray(aluno.notas?.[a]) ? aluno.notas[a] : [];
              // Garante que cada matéria padrão exista
              const materiasExistentes = orig.map(x => x.materia);
              // Adiciona matérias padrão faltantes
              const materiasPadraoFaltantes = materiasPadrao.filter(m => !materiasExistentes.includes(m)).map(m => ({
                materia: m, bimestres: ['', '', '', '']
              }));
              // Garante que cada matéria tenha 4 bimestres (preenche faltantes com '')
              orig = orig.map(mat => ({
                materia: mat.materia,
                bimestres: Array.isArray(mat.bimestres)
                  ? [...mat.bimestres, '', '', '', ''].slice(0, 4)
                  : ['', '', '', '']
              }));
              notasComPadrao[a] = [...materiasPadraoFaltantes, ...orig];
            }
            setNotas(notasComPadrao);
          }
        })
        .finally(() => setCarregando(false));
    }
  // eslint-disable-next-line
  }, [alunoId, modoEdicao]);

  // Adiciona matéria
  const handleAddMateria = (ano) => {
    const nome = novaMateria[ano].trim();
    if (!nome) return;
    setNotas(notasAntigas => ({
      ...notasAntigas,
      [ano]: [...notasAntigas[ano], { materia: nome, bimestres: ['', '', '', ''] }]
    }));
    setNovaMateria(n => ({ ...n, [ano]: '' }));
  };

  // Atualiza nota
  const handleNotaChange = (ano, idx, bim, valor) => {
    setNotas(notasAntigas => {
      const novo = { ...notasAntigas };
      novo[ano] = novo[ano].map((linha, i) =>
        i === idx
          ? { ...linha, bimestres: linha.bimestres.map((n, j) => j === bim ? valor : n) }
          : linha
      );
      return novo;
    });
  };

  // Calcula média anual da matéria
  const mediaMateria = (bimestres) => {
    const nums = bimestres.map(v => parseFloat(v)).filter(v => !isNaN(v));
    if (nums.length === 0) return '-';
    return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1);
  };

  // Calcula média geral do ano
  const mediaAno = (ano) => {
    const arr = notas[ano];
    const medias = arr.map(l => parseFloat(mediaMateria(l.bimestres))).filter(v => !isNaN(v));
    if (medias.length === 0) return '-';
    return (medias.reduce((a, b) => a + b, 0) / medias.length).toFixed(2);
  };

  // Validação obrigatória
  const validarNotas = () => {
    const anosPendentes = [];
    const pendentes = {};
    for (const a of [6,7,8,9]) {
      const arr = notas[a];
      arr.forEach((linha, idx) => {
        linha.bimestres.forEach((b, bim) => {
          if (b === '' || b === null || isNaN(Number(b))) {
            if (!pendentes[a]) pendentes[a] = {};
            if (!pendentes[a][idx]) pendentes[a][idx] = [];
            pendentes[a][idx].push(bim);
          }
        });
      });
      if (
        arr.length === 0 ||
        arr.some(linha => linha.bimestres.some(b => b === '' || b === null || isNaN(Number(b))))
      ) {
        anosPendentes.push(`${a}°`);
      }
    }
    setNotasPendentes(pendentes);
    return anosPendentes;
  };

  // Salvar notas (chama callback do pai)
  const handleSalvar = () => {
    const pendentes = validarNotas();
    if (pendentes.length > 0) {
      alert(`Notas pendentes no ${pendentes.join(', ')} ano${pendentes.length > 1 ? 's' : ''}`);
      return;
    }
    // Calcula média geral final
    let soma = 0, count = 0;
    for (const a of [6,7,8,9]) {
      const arr = notas[a];
      arr.forEach(linha => {
        const m = parseFloat(mediaMateria(linha.bimestres));
        if (!isNaN(m)) { soma += m; count++; }
      });
    }
    const mediaFinal = count > 0 ? (soma / count).toFixed(2) : null;
    if (onSalvar) onSalvar(notas, mediaFinal);
  };

  if (carregando) return <div className={styles.cadastroContainer}><div className={styles.container}>Carregando...</div></div>;

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.container}>
        <button
          className={styles.buscaVoltarBtn}
          type="button"
          onClick={() => navigate(-1)}
        >
          &#8592; Voltar
        </button>
        <h1 className={styles.title}>{modoEdicao ? 'Editar Notas' : 'Cadastro de Notas'}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {anos.map(a => (
            <button
              key={a.ano}
              className={`${styles.cadastraButton} ${anoAtivo === a.ano ? styles.primaryButton : ''}`}
              style={{
                background: anoAtivo === a.ano ? a.cor : undefined,
                color: anoAtivo === a.ano && a.ano === 7 ? '#333' : undefined,
                minWidth: 90
              }}
              onClick={() => setAnoAtivo(a.ano)}
              type="button"
            >
              {a.ano}° Ano
            </button>
          ))}
        </div>
        {anos.map(a => (
          <div
            key={a.ano}
            style={{ display: anoAtivo === a.ano ? 'block' : 'none', animation: 'fadeIn 0.3s' }}
            id={`notasAno${a.ano}`}
          >
            <h2 className={styles.subtitle} style={{ color: a.cor }}>{a.ano}° Ano</h2>
            <table className={styles.buscaTable}>
              <thead>
                <tr>
                  <th className={styles.buscaTh}>Matéria</th>
                  <th className={styles.buscaTh}>1° Bim.</th>
                  <th className={styles.buscaTh}>2° Bim.</th>
                  <th className={styles.buscaTh}>3° Bim.</th>
                  <th className={styles.buscaTh}>4° Bim.</th>
                  <th className={styles.buscaTh}>Média Anual</th>
                </tr>
              </thead>
              <tbody>
                {notas[a.ano].map((linha, idx) => (
                  <tr key={linha.materia + idx}>
                    <td className={styles.buscaTd}>{linha.materia}</td>
                    {[0, 1, 2, 3].map(bim => (
                      <td className={styles.buscaTd} key={bim}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          className={styles.buscaInput}
                          value={linha.bimestres[bim]}
                          onChange={e => handleNotaChange(a.ano, idx, bim, e.target.value)}
                          style={
                            notasPendentes[a.ano] &&
                            notasPendentes[a.ano][idx] &&
                            notasPendentes[a.ano][idx].includes(bim)
                              ? { boxShadow: '0 0 0 2px #e53e3e' }
                              : undefined
                          }
                        />
                      </td>
                    ))}
                    <td className={styles.buscaTd} style={{ fontWeight: 600 }}>
                      {mediaMateria(linha.bimestres)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Nome da nova matéria"
                className={styles.buscaInput}
                value={novaMateria[a.ano]}
                onChange={e => setNovaMateria(n => ({ ...n, [a.ano]: e.target.value }))}
                style={{ flexGrow: 1 }}
              />
              <button
                className={styles.cadastraButton}
                style={{ background: a.cor, color: a.ano === 7 ? '#333' : '#fff' }}
                type="button"
                onClick={() => handleAddMateria(a.ano)}
              >
                Adicionar Matéria
              </button>
            </div>
            <div style={{ marginTop: 18, textAlign: 'right', fontWeight: 500 }}>
              Média Geral do Ano: <span style={{ color: a.cor }}>{mediaAno(a.ano)}</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <button className={styles.cadastraButton} onClick={handleSalvar}>
            {modoEdicao ? 'Salvar Alterações' : 'Salvar Notas'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CadastroNotas;
