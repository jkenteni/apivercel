import pool from '../database/connection.js';

export default {
  Listar() {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM cursos', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  Inserir({ nome, sigla }) {
    return new Promise((resolve, reject) => {
      // Validação: sigla deve ter exatamente 3 letras
      if (!/^[A-Za-z]{3}$/.test(sigla)) {
        return reject(new Error('A sigla deve conter exatamente 3 letras.'));
      }
      pool.query(
        'INSERT INTO cursos (nome, sigla) VALUES (?, ?)',
        [nome, sigla.toUpperCase()],
        (err, result) => {
          if (err) return reject(err);
          resolve({ mensagem: 'Curso cadastrado com sucesso', id: result.insertId });
        }
      );
    });
  },
  Editar(id, { nome, sigla }) {
    return new Promise((resolve, reject) => {
      // Validação: sigla deve ter exatamente 3 letras
      if (sigla && !/^[A-Za-z]{3}$/.test(sigla)) {
        return reject(new Error('A sigla deve conter exatamente 3 letras.'));
      }
      pool.query(
        'UPDATE cursos SET nome = ?, sigla = ? WHERE id = ?',
        [nome, sigla.toUpperCase(), id],
        (err, result) => {
          if (err) return reject(err);
          resolve({ mensagem: 'Curso atualizado com sucesso' });
        }
      );
    });
  },
  Excluir(id) {
    return new Promise((resolve, reject) => {
      pool.query(
        'DELETE FROM cursos WHERE id = ?',
        [id],
        (err, result) => {
          if (err) return reject(err);
          resolve({ mensagem: 'Curso excluído com sucesso' });
        }
      );
    });
  },
};
