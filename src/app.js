const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use((request, _response, next) => {
  let message = `[${request.method}]: ${request.url}`;
  console.time(message);
  next();
  console.timeEnd(message);
});

const validateUuid = (request, response, next) => {

  if (request.params.id && !isUuid(request.params.id)) {
    return response.status(400).json({ error: 'Invalid uuid' });
  }

  return next();
};

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  response.status(201).json(repository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {
  const { title, url, techs } = request.body;
  const index = repositories.findIndex(item => item.id === request.params.id);
  
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  let repository = repositories[index];
  repository = { ...repository, title, url, techs };

  return response.json(repository);
});

app.delete("/repositories/:id", validateUuid, (request, response) => {
  const index = repositories.findIndex(item => item.id === request.params.id);
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }
  repositories.splice(index, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateUuid, (request, response) => {
  const index = repositories.findIndex(item => item.id === request.params.id);
  
  if (index < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  let repository = repositories[index];
  ++repository.likes;

  return response.status(201).json(repository);
});

module.exports = app;
