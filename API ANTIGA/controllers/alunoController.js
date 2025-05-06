const alunoService = require('../services/alunoService');

exports.criarAluno = async (req, res) => {
  try {
    const resultado = await alunoService.criarAluno(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    res.status(500).json({ error: 'Erro ao cadastrar aluno' });
  }
};
