import { Router } from 'express';
import controllerAluno from './controllers/alunoController.js';
import authController from './controllers/authController.js';
import cursoController from './controllers/cursoController.js';
import usuarioController from './controllers/usuarioController.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).send('Página HOME');
});

// Rota de login
router.post('/login', authController.login);

// Rotas de alunos
router.post('/alunos', controllerAluno.Inserir);
router.get('/alunos', controllerAluno.Listar);
router.put('/alunos/:id', controllerAluno.Editar);
router.delete('/alunos/:id', controllerAluno.Excluir);
router.get('/alunos/estatisticas', controllerAluno.Estatisticas);
router.get('/alunos/exportar', controllerAluno.ExportarExcel);

// Rotas de cursos
router.get('/cursos', cursoController.Listar);
router.post('/cursos', cursoController.Inserir);
router.put('/cursos/:id', cursoController.Editar);
router.delete('/cursos/:id', cursoController.Excluir);

// Rotas de usuário (configurações)
router.post('/usuarios/alterar-nome', usuarioController.alterarNome);
router.post('/usuarios/trocar-senha', usuarioController.trocarSenha);

export default router;
