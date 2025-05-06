import repositoryAluno from '../repositories/alunoRepository.js';

export default {
  async Inserir(aluno) {
    return await repositoryAluno.Inserir(aluno);
  },

  async Listar() {
    return await repositoryAluno.Listar();
  },

  async Editar(id, dados) {
    return await repositoryAluno.Editar(id, dados);
  },

  async Excluir(id) {
    return await repositoryAluno.Excluir(id);
  },
};
