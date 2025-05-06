const db = require('../db');

exports.criarAluno = async ({ nome, cpf, curso, cota }) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO alunos (nome, cpf, curso, cota) VALUES (?, ?, ?, ?)';
    const valores = [nome, cpf, curso, cota];

    db.query(sql, valores, (err, result) => {
      if (err) {
        console.error('Erro ao inserir aluno:', err);
        return reject(err);
      }

      resolve({ mensagem: 'Aluno cadastrado com sucesso!', id: result.insertId });
    });
  });
};
