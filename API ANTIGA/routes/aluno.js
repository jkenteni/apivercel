const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/alunoController');

router.post('/alunos', alunoController.criarAluno);

module.exports = router;
