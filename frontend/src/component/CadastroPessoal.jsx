import { useState, useEffect } from 'react';
import styles from './Cadastro.module.css';

function formatCpfInput(value) {
  // Remove tudo que não for número
  let v = value.replace(/\D/g, '').slice(0, 11);
  // Aplica a máscara dinamicamente
  if (v.length > 9) return v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  if (v.length > 6) return v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  if (v.length > 3) return v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  return v;
}

function isCpfFormatValid(str) {
  return /^(\d{0,3})(\.\d{0,3})?(\.\d{0,3})?(-\d{0,2})?$/.test(str);
}

function CadastroPessoal({ onNext }) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    curso: '',
    cota: '',
    dataNascimento: '',
  });

  const [cpfDisplay, setCpfDisplay] = useState('');
  const [cursos, setCursos] = useState([]);
  const [cpfInvalid, setCpfInvalid] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/cursos')
      .then(res => res.json())
      .then(data => setCursos(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      // Formata enquanto digita
      const formatted = formatCpfInput(value);
      setCpfDisplay(formatted);

      // Extrai só números para enviar ao backend
      const apenasNumeros = formatted.replace(/\D/g, '');
      setForm({ ...form, cpf: apenasNumeros });

      // Validação visual
      setCpfInvalid(!isCpfFormatValid(formatted));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleBlurCpf = () => {
    // Se não está vazio e não tem 14 caracteres (com máscara), marca como inválido
    if (cpfDisplay && cpfDisplay.length !== 14) setCpfInvalid(true);
    else setCpfInvalid(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.cpf.length !== 11) {
      setCpfInvalid(true);
      alert('O CPF deve conter 11 números.');
      return;
    }
    if (!form.dataNascimento) {
      alert('Informe a data de nascimento.');
      return;
    }
    onNext(form);
  };

  return (
    <div className={`${styles.cadastroPessoalContainer}`}>
      <button
        className={styles.buscaVoltarBtn}
        type="button"
        onClick={() => window.history.back()}
      >
        &#8592; Voltar
      </button>
      <h2 className={styles.title}>Cadastrar Aluno</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fullRow}>
          <label htmlFor="nome" className={styles.label}>Nome Completo:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            pattern="[A-Za-zÀ-ÿçÇ\s]+"
            required
            className={styles.input}
            placeholder="Digite o nome completo"
            autoComplete="off"
          />
        </div>
        <div className={styles.fullRow}>
          <label htmlFor="cpf" className={styles.label}>CPF:</label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={cpfDisplay}
            onChange={handleChange}
            onBlur={handleBlurCpf}
            placeholder="000.000.000-00"
            maxLength="14"
            required
            className={styles.input}
            autoComplete="off"
            inputMode="numeric"
            style={cpfInvalid ? { boxShadow: '0 0 0 2px #e53e3e' } : undefined}
          />
        </div>
        <div className={styles.fullRow}>
          <label htmlFor="dataNascimento" className={styles.label}>Data de Nascimento:</label>
          <input
            type="date"
            id="dataNascimento"
            name="dataNascimento"
            value={form.dataNascimento}
            onChange={handleChange}
            required
            className={styles.input}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div className={styles.flexContainer}>
          <div className={styles.selectGroup}>
            <label htmlFor="curso" className={styles.label}>Curso:</label>
            <select
              name="curso"
              value={form.curso}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Selecione...</option>
              {cursos.map(curso => (
                <option key={curso.id} value={curso.sigla}>
                  {curso.nome}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.selectGroup}>
            <label htmlFor="cota" className={styles.label}>Cotas:</label>
            <select
              name="cota"
              value={form.cota}
              onChange={handleChange}
              required
              className={styles.select}
            >
              <option value="">Selecione...</option>
              <option value="rede_publica_ampla">Rede Pública - Ampla</option>
              <option value="rede_publica_territorio">Rede Pública - Território</option>
              <option value="rede_privada_ampla">Rede Privada - Ampla</option>
              <option value="rede_privada_territorio">Rede Privada - Território</option>
              <option value="estudante_com_deficiencia">Estudante com Deficiência</option>
            </select>
          </div>
        </div>
        <button type="submit" className={styles.cadastraButton}>Próximo</button>
      </form>
    </div>
  );
}

export default CadastroPessoal;