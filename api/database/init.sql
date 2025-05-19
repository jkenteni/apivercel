-- Apaga todas as tabelas relacionadas antes de criar novamente
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
  cota VARCHAR(50) NOT NULL,
  dataNascimento DATE,
  notas LONGTEXT,
  media FLOAT 
);

-- Criação da tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  sigla VARCHAR(10) NOT NULL
);

-- Inserção de 20 alunos de exemplo
INSERT INTO alunos (nome, cpf, curso, cota, dataNascimento, notas, media) VALUES
('Ana Souza', '12345678901', 'INF', 'rede_publica_ampla', '2008-01-15', NULL, NULL),
('Bruno Lima', '23456789012', 'ADM', 'rede_privada_ampla', '2007-03-22', NULL, NULL),
('Carla Dias', '34567890123', 'INF', 'rede_publica_territorio', '2008-07-09', NULL, NULL),
('Diego Alves', '45678901234', 'SER', 'rede_privada_territorio', '2007-11-30', NULL, NULL),
('Elisa Martins', '56789012345', 'ADM', 'estudante_com_deficiencia', '2008-05-17', NULL, NULL),
('Fábio Silva', '67890123456', 'INF', 'rede_publica_ampla', '2008-02-28', NULL, NULL),
('Gabriela Costa', '78901234567', 'SER', 'rede_publica_territorio', '2007-09-14', NULL, NULL),
('Henrique Ramos', '89012345678', 'ADM', 'rede_privada_ampla', '2008-12-01', NULL, NULL),
('Isabela Rocha', '90123456789', 'INF', 'rede_publica_ampla', '2008-04-10', NULL, NULL),
('João Pedro', '01234567890', 'SER', 'rede_privada_territorio', '2007-06-25', NULL, NULL),
('Karla Nunes', '11223344556', 'ADM', 'rede_publica_territorio', '2008-08-19', NULL, NULL),
('Lucas Pinto', '22334455667', 'INF', 'rede_privada_ampla', '2008-10-05', NULL, NULL),
('Marina Lopes', '33445566778', 'SER', 'rede_publica_ampla', '2007-12-12', NULL, NULL),
('Natan Borges', '44556677889', 'ADM', 'rede_privada_territorio', '2008-03-03', NULL, NULL),
('Olívia Freitas', '55667788990', 'INF', 'estudante_com_deficiencia', '2008-06-21', NULL, NULL),
('Paulo César', '66778899001', 'SER', 'rede_publica_territorio', '2007-05-08', NULL, NULL),
('Quésia Barros', '77889900112', 'ADM', 'rede_privada_ampla', '2008-09-27', NULL, NULL),
('Rafael Teixeira', '88990011223', 'INF', 'rede_publica_ampla', '2008-11-15', NULL, NULL),
('Sabrina Melo', '99001122334', 'SER', 'rede_privada_territorio', '2007-02-02', NULL, NULL),
('Tiago Farias', '10111213141', 'ADM', 'rede_publica_territorio', '2008-07-30', NULL, NULL),
('Ursula Prado', '12131415161', 'INF', 'rede_privada_ampla', '2008-01-01', NULL, NULL),
('Vitor Hugo', '13141516171', 'SER', 'rede_publica_ampla', '2007-04-18', NULL, NULL),
('Wesley Souza', '14151617181', 'ADM', 'rede_privada_territorio', '2008-06-11', NULL, NULL),
('Xuxa Menezes', '15161718191', 'INF', 'estudante_com_deficiencia', '2008-03-29', NULL, NULL),
('Yasmin Duarte', '16171819201', 'SER', 'rede_publica_territorio', '2007-10-23', NULL, NULL);
