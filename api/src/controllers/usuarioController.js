import usuarioService from '../services/usuarioService.js';

function sanitizeNome(nome) {
  // Permite apenas letras, espaços e acentos
  return typeof nome === 'string' && /^[A-Za-zÀ-ÿçÇ\s]{3,50}$/.test(nome);
}

export default {
  async alterarNome(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { nome } = req.body;
      if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
      if (!nome || !sanitizeNome(nome)) return res.status(400).json({ erro: 'Nome inválido' });
      await usuarioService.alterarNome(token, nome);
      res.status(200).json({ mensagem: 'Nome alterado com sucesso' });
    } catch (err) {
      res.status(400).json({ erro: 'Não foi possível alterar o nome.' });
    }
  },
  async trocarSenha(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const { senhaAtual, novaSenha } = req.body;
      if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
      if (!senhaAtual || !novaSenha) return res.status(400).json({ erro: 'Campos obrigatórios' });
      if (typeof novaSenha !== 'string' || novaSenha.length < 6 || !/[A-Za-z]/.test(novaSenha) || !/\d/.test(novaSenha)) {
        return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 6 caracteres, letras e números.' });
      }
      await usuarioService.trocarSenha(token, senhaAtual, novaSenha);
      res.status(200).json({ mensagem: 'Senha alterada com sucesso' });
    } catch (err) {
      // Mensagem específica para senha incorreta
      if (err.message === 'Senha atual incorreta') {
        return res.status(400).json({ erro: 'Senha atual incorreta' });
      }
      res.status(400).json({ erro: 'Não foi possível alterar a senha.' });
    }
  }
};
