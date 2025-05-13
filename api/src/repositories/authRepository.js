import pool from '../database/connection.js';

export default {
  BuscarPorEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id, nome, email, senha FROM usuarios WHERE email = ? LIMIT 1';
      pool.query(sql, [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
};
