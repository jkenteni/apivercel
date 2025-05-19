import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../database/connection.js';

const SECRET = process.env.JWT_SECRET || 'segredo';

function getUserIdFromToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET);
    if (!decoded || !decoded.id) throw new Error();
    return decoded.id;
  } catch {
    throw new Error('Token inválido');
  }
}

export default {
  async alterarNome(token, novoNome) {
    const userId = getUserIdFromToken(token);
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE usuarios SET nome = ? WHERE id = ?',
        [novoNome, userId],
        (err, result) => {
          if (err) return reject(new Error('Erro ao atualizar nome'));
          if (result.affectedRows === 0) return reject(new Error('Usuário não encontrado'));
          resolve();
        }
      );
    });
  },
  async trocarSenha(token, senhaAtual, novaSenha) {
    const userId = getUserIdFromToken(token);
    // Busca senha atual
    const usuario = await new Promise((resolve, reject) => {
      pool.query('SELECT senha FROM usuarios WHERE id = ?', [userId], (err, results) => {
        if (err) return reject(new Error('Erro ao buscar usuário'));
        if (!results || results.length === 0) return reject(new Error('Usuário não encontrado'));
        resolve(results[0]);
      });
    });
    // Validação correta da senha anterior
    const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaCorreta) throw new Error('Senha atual incorreta');
    const hash = await bcrypt.hash(novaSenha, 10);
    return new Promise((resolve, reject) => {
      pool.query(
        'UPDATE usuarios SET senha = ? WHERE id = ?',
        [hash, userId],
        (err, result) => {
          if (err) return reject(new Error('Erro ao atualizar senha'));
          if (result.affectedRows === 0) return reject(new Error('Usuário não encontrado'));
          resolve();
        }
      );
    });
  }
};
