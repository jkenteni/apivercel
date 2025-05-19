import pool from '../database/connection.js';

export default {
  Inserir({ nome, cpf, curso, cota, dataNascimento, notas = null, media = null }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO alunos (nome, cpf, curso, cota, dataNascimento, notas, media) VALUES (?, ?, ?, ?, ?, ?, ?)';
      pool.query(sql, [nome, cpf, curso, cota, dataNascimento, notas ? JSON.stringify(notas) : null, media], (err, result) => {
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
      pool.query(sql, (err, results) => {
        if (err) {
          console.error('Erro ao listar alunos:', err);
          return reject(err);
        }
        // Parse notas JSON
        results.forEach(aluno => {
          if (aluno.notas) {
            try { aluno.notas = JSON.parse(aluno.notas); } catch {}
          }
        });
        resolve(results);
      });
    });
  },

  Editar(id, { nome, cpf, curso, cota, dataNascimento, notas, media }) {
    return new Promise((resolve, reject) => {
      // Monta SQL dinâmico para editar qualquer campo
      const campos = [];
      const valores = [];
      if (nome !== undefined) { campos.push('nome = ?'); valores.push(nome); }
      if (cpf !== undefined) { campos.push('cpf = ?'); valores.push(cpf); }
      if (curso !== undefined) { campos.push('curso = ?'); valores.push(curso); }
      if (cota !== undefined) { campos.push('cota = ?'); valores.push(cota); }
      if (dataNascimento !== undefined) { campos.push('dataNascimento = ?'); valores.push(dataNascimento); }
      if (notas !== undefined) { campos.push('notas = ?'); valores.push(notas ? JSON.stringify(notas) : null); }
      if (media !== undefined) { campos.push('media = ?'); valores.push(media); }
      if (campos.length === 0) return resolve({ mensagem: 'Nada para atualizar' });
      const sql = `UPDATE alunos SET ${campos.join(', ')} WHERE id = ?`;
      valores.push(id);
      pool.query(sql, valores, (err, result) => {
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
      pool.query(sql, [id], (err, result) => {
        if (err) {
          console.error('Erro ao excluir aluno:', err);
          return reject(err);
        }
        resolve({ mensagem: 'Aluno excluído com sucesso' });
      });
    });
  },

  Estatisticas() {
    return new Promise((resolve, reject) => {
      // Total de alunos
      const sqlTotal = 'SELECT COUNT(*) as total FROM alunos';
      // Total por curso
      const sqlCurso = 'SELECT curso, COUNT(*) as total FROM alunos GROUP BY curso';
      // Total por cota
      const sqlCota = 'SELECT cota, COUNT(*) as total FROM alunos GROUP BY cota';

      pool.query(sqlTotal, (err, totalRes) => {
        if (err) return reject(err);
        pool.query(sqlCurso, (err, cursoRes) => {
          if (err) return reject(err);
          pool.query(sqlCota, (err, cotaRes) => {
            if (err) return reject(err);
            resolve({
              totalAlunos: totalRes[0]?.total || 0,
              porCurso: cursoRes,
              porCota: cotaRes
            });
          });
        });
      });
    });
  },
};
