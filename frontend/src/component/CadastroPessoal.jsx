import { useState } from 'react';
import styles from './Cadastro.module.css';

function CadastroPessoal({ onNext }) {
  const [form, setForm] = useState({
    nome: '',
    cpf: '',
    curso: '',
    cota: '',
  });

  // Estado para o CPF formatado visualmente
  const [cpfDisplay, setCpfDisplay] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      // Remove todos os não-dígitos
      const apenasNumeros = value.replace(/\D/g, '');
      
      // Atualiza o valor real (sem formatação)
      setForm({ ...form, cpf: apenasNumeros });
      
      // Formatação visual
      let formattedValue = '';
      if (apenasNumeros.length > 0) {
        formattedValue = apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      }
      setCpfDisplay(formattedValue);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(form); // Envia o CPF sem formatação
  };

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Cadastrar Aluno</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Nome - linha inteira */}
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
            />
          </div>

          {/* CPF - linha inteira abaixo do nome */}
          <div className={styles.fullRow}>
            <label htmlFor="cpf" className={styles.label}>CPF:</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={cpfDisplay}
              onChange={handleChange}
              placeholder="000.000.000-00"
              maxLength="14"
              required
              className={styles.input}
            />
            <small className={styles.hint}>A formatação é automática</small>
          </div>

          {/* Selects lado a lado */}
          <div className={styles.selectRow}>
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
                <option value="AGR">Agropecuária</option>
                <option value="ADM">Administração</option>
                <option value="FIN">Finanças</option>
                <option value="INF">Informática</option>
                <option value="SER">Energias Renováveis</option>
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

          <button type="submit" className={styles.button}>Próximo</button>
        </form>
      </div>
    </div>
  );
}

export default CadastroPessoal;