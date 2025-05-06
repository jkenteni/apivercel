import alunoService from '../services/alunoService.js';

export default {
  async Inserir(req, res) {
    try {
      const aluno = req.body;
      const resultado = await alunoService.Inserir(aluno);
      res.status(201).json(resultado);
    } catch (error) {
      console.error('Erro ao inserir aluno:', error);
      res.status(500).json({ erro: 'Erro ao inserir aluno' });
    }
  },

  async Listar(req, res) {
    try {
      const alunos = await alunoService.Listar();
      res.status(200).json(alunos);
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      res.status(500).json({ erro: 'Erro ao listar alunos' });
    }
  },

  async Editar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const resultado = await alunoService.Editar(id, dados);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao editar aluno:', error);
      res.status(500).json({ erro: 'Erro ao editar aluno' });
    }
  },

  async Excluir(req, res) {
    try {
      const { id } = req.params;
      const resultado = await alunoService.Excluir(id);
      res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao excluir aluno:', error);
      res.status(500).json({ erro: 'Erro ao excluir aluno' });
    }
  },
};
