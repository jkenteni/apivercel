import { useState } from 'react';
import './Cadastro.module.css'; // Ensure scoped styles are applied
import CadastroPessoal from './CadastroPessoal';
import CadastroNotas from './CadastroNotas';

function Cadastro() {
  const [etapa, setEtapa] = useState(1);
  const [formulario, setFormulario] = useState({
    nome: '',
    cpf: '',
    cota: '',
    curso: '',
    notas: {},
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
      setEtapa(2); // Ir para cadastro de notas se quiser manter
    } catch (err) {
      console.error('Erro no front:', err);
      alert('Erro de conexão com o servidor');
    }
  };

  const handleBack = () => {
    setEtapa(1);
  };

  const handleFinalSubmit = (notas) => {
    const alunoCompleto = { ...formulario, notas };
    console.log('Dados do aluno para enviar à API:', alunoCompleto);

    // Aqui você faria o fetch para a API
    // fetch('/api/alunos', { method: 'POST', body: JSON.stringify(alunoCompleto) })

    alert('Cadastro enviado com sucesso!');
  };

  return (
    <div className="cadastro-container">
      {etapa === 1 && <CadastroPessoal onNext={handleNext} />}
      {etapa === 2 && <CadastroNotas onBack={handleBack} onSubmit={handleFinalSubmit} />}
    </div>
  );
}

export default Cadastro;
