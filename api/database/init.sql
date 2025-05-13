-- Apaga todas as tabelas relacionadas antes de criar novamente (atenção à ordem por FK, se houver)
DROP TABLE IF EXISTS alunos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS cursos;

-- Criação da tabela de usuários (admin do sistema)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

-- Criação da tabela de alunos
CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  curso VARCHAR(10) NOT NULL,
  cota VARCHAR(50) NOT NULL
);

-- Criação da tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sigla VARCHAR(10) NOT NULL
);
