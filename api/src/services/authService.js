import authRepository from '../repositories/authRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'segredo';

export default {
  async login(email, senha) {
    const usuario = await authRepository.BuscarPorEmail(email);
    if (!usuario) throw new Error('Usuário ou senha inválidos');

    // Comparação segura usando bcrypt
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) throw new Error('Usuário ou senha inválidos');

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      SECRET,
      { expiresIn: '1d' }
    );
    return { token, nome: usuario.nome, email: usuario.email };
  }
};
