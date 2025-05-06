const jwt = require('jsonwebtoken');

// Temporariamente, dados simulados:
const mockAdmin = {
  id: 1,
  email: 'admin@escola.com',
  senha: '123456'
};

exports.login = async (email, senha) => {
  if (email !== mockAdmin.email || senha !== mockAdmin.senha) {
    throw new Error('Credenciais inválidas');
  }

  const token = jwt.sign({ id: mockAdmin.id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  return { auth: true, token };
};
