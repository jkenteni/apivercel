import cursoService from '../services/cursoService.js';

export default {
  async Listar(req, res) {
    try {
      const cursos = await cursoService.Listar();
      res.status(200).json(cursos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar cursos' });
    }
  },
  async Inserir(req, res) {
    try {
      const curso = req.body;
      const resultado = await cursoService.Inserir(curso);
      res.status(201).json(resultado);
    } catch (error) {
      res.status(400).json({ erro: error.message || 'Erro ao inserir curso' });
    }
  },
  async Editar(req, res) {
    try {
      const { id } = req.params;
      const dados = req.body;
      const resultado = await cursoService.Editar(id, dados);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(400).json({ erro: error.message || 'Erro ao editar curso' });
    }
  },
  async Excluir(req, res) {
    try {
      const { id } = req.params;
      const resultado = await cursoService.Excluir(id);
      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao excluir curso' });
    }
  },
};
