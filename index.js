const express = require('express');

const server = express();

server.use(express.json());

/**
 * A variável `projects` pode ser `const` porque um `array`
 * pode receber adições ou exclusões mesmo sendo uma constante.
 */
const projects = [];

/**
 * Middleware que checa se o projeto existe
 */
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project) {
    return res.status(400).json({ error: 'Projeto não encontrado!'});
  }

  return next();
}

/**
 * Middleware que dá log no número de requisições
 */
function logRequest(req, res, next) {
  console.count("Número de requisições");

  return next();
}

server.use(logRequest);

/**
 * Retorna todos os projetos
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/**
 * Cadastra um novo projeto
 */
server.post('/projects', (req, res) => {
  const { id, title }  = req.body; // pode colocar todos na mesma declaração

  const project = {id,
    title,
    tasks:[]
  };

  projects.push(project);

  return res.json(projects);
});

/**
 * Adiciona uma nova tarefa no projeto escolhido via id; 
 */
server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

/**
 * Altera o título do projeto com o id presente nos parâmetros da rota.
 */
server.put('/projects/:id', checkIdExists, (req, res) => {

  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

/**
 * Deleta o projeto associado ao id presente nos parâmetros da rota.
 */
server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);

  return res.json({ messagem: "Projeto deletado!"})
});

server.listen(3000);