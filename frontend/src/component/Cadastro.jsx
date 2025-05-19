import { useState } from 'react';
import styles from './Cadastro.module.css';
import CadastroPessoal from './CadastroPessoal';
import CadastroNotas from './CadastroNotas';

function Cadastro() {
  const [etapa, setEtapa] = useState(1);
  const [alunoId, setAlunoId] = useState(null);

  // Após cadastro pessoal, salva aluno e vai para notas
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

      setAlunoId(json.id); // Salva o id do aluno cadastrado
      setEtapa(2); // Vai para etapa de notas
    } catch (err) {
      console.error('Erro no front:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  // Salvar notas (futuro: enviar para backend)
  const handleSalvarNotas = async (notas, media) => {
    if (!alunoId) return;
    // Salva as notas e a média no backend
    await fetch(`http://localhost:3000/api/alunos/${alunoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notas, media }),
    });
    alert('Notas salvas com sucesso!');
    // Redirecionar ou resetar se desejar
  };

  return (
    <>
      {etapa === 1 && <CadastroPessoal onNext={handleNext} />}
      {etapa === 2 && <CadastroNotas alunoId={alunoId} onSalvar={handleSalvarNotas} />}
    </>
  );
}

export default Cadastro;
