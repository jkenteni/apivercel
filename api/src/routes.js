import { Router } from 'express';
import controllerAluno from './controllers/alunoController.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Página HOME');
});

router.post('/alunos', controllerAluno.Inserir);
router.get('/alunos', controllerAluno.Listar);
router.put('/alunos/:id', controllerAluno.Editar);
router.delete('/alunos/:id', controllerAluno.Excluir);

export default router;
