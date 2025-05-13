import express from 'express';
import cors from 'cors';
import router from './routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router); // Prefixo /api adicionado para todas as rotas

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});