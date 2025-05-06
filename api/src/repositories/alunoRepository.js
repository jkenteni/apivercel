import connection from '../database/connection.js';

export default {
  Inserir({ nome, cpf, curso, cota }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO alunos (nome, cpf, curso, cota) VALUES (?, ?, ?, ?)';
      connection.query(sql, [nome, cpf, curso, cota], (err, result) => {
        if (err) {
          console.error('Erro ao inserir aluno:', err);
          return reject(err);
        }
        resolve({ mensagem: 'Aluno cadastrado com sucesso', id: result.insertId });
      });
    });
  },

  Listar() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM alunos';
      connection.query(sql, (err, results) => {
        if (err) {
          console.error('Erro ao listar alunos:', err);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  Editar(id, { nome, cpf, curso, cota }) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE alunos SET nome = ?, cpf = ?, curso = ?, cota = ? WHERE id = ?';
      connection.query(sql, [nome, cpf, curso, cota, id], (err, result) => {
        if (err) {
          console.error('Erro ao editar aluno:', err);
          return reject(err);
        }
        resolve({ mensagem: 'Aluno atualizado com sucesso' });
      });
    });
  },

  Excluir(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM alunos WHERE id = ?';
      connection.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Erro ao excluir aluno:', err);
          return reject(err);
        }
        resolve({ mensagem: 'Aluno excluído com sucesso' });
      });
    });
  },
};
