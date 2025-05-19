import bcrypt from 'bcryptjs';
import pool from '../database/connection.js';

// Altere os dados conforme necessário
const nome = 'Kenteni Alves';
const email = 'teste@prof.ce.gov.br';
const senhaPura = '123';

async function criarAdmin() {
  const senhaHash = await bcrypt.hash(senhaPura, 10);
  const sql = `
    INSERT INTO usuarios (nome, email, senha)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE nome = VALUES(nome), senha = VALUES(senha)
  `;
  pool.query(sql, [nome, email, senhaHash], (err, result) => {
    if (err) {
      console.error('Erro ao criar admin:', err);
    } else {
      console.log('Usuário admin criado/atualizado com sucesso!');
    }
    pool.end();
  });
}

criarAdmin();

//node src/scripts/createAdmin.js