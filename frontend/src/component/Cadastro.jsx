import { useState } from 'react';
import styles from './Cadastro.module.css'; // Corrigido para importar como módulo
import CadastroPessoal from './CadastroPessoal';

function Cadastro() {
  const [etapa, setEtapa] = useState(1);
  const [formulario, setFormulario] = useState({
    nome: '',
    cpf: '',
    cota: '',
    curso: '',
  });

  const handleNext = async (dadosPessoais) => {
    try {
      const resposta = await fetch('http://localhost:3000/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosPessoais),
      });

      const json = await resposta.json();

      if (!resposta.ok) {
        alert('Erro ao cadastrar aluno: ' + (json.error || 'desconhecido'));
        return;
      }

      console.log('Aluno cadastrado:', json);
      setFormulario((prev) => ({ ...prev, ...dadosPessoais }));
      alert('Cadastro enviado com sucesso!');
    } catch (err) {
      console.error('Erro no front:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  return (
    <div className={styles.cadastroContainer}>
      <div className={styles.container}>
        <button
          className={styles.voltarBtn}
          type="button"
          onClick={() => window.history.back()}
        >
          &#8592; Voltar
        </button>
        <CadastroPessoal onNext={handleNext} />
      </div>
    </div>
  );
}

export default Cadastro;
