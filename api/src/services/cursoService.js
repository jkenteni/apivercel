import cursoRepository from '../repositories/cursoRepository.js';

export default {
  async Listar() {
    return await cursoRepository.Listar();
  },
  async Inserir(curso) {
    return await cursoRepository.Inserir(curso);
  },
  async Editar(id, dados) {
    return await cursoRepository.Editar(id, dados);
  },
  async Excluir(id) {
    return await cursoRepository.Excluir(id);
  },
};
