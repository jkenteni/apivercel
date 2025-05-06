import express from 'express';
import cors from 'cors';
import router from './routes.js';
import connect from './database/connection.js'; // Importa a função connect

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(router);

(async () => {
  try {
    const db = await connect(); // Aguarda a conexão com o banco
    console.log('Conectado ao banco de dados!');

    // Inicia o servidor após a conexão com o banco
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
    process.exit(1); // Finaliza o processo em caso de erro
  }
})();