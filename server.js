const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

// Endpoint de registro
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'Email já cadastrado' });
    }
    users.push({ name, email, password, tasks: [], trash: [] });
    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
});

// Endpoint de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login realizado com sucesso', email });
    } else {
        res.status(400).json({ message: 'Credenciais inválidas' });
    }
});

// Endpoint para obter dados do usuário
app.get('/user', (req, res) => {
    const { email } = req.query;
    const user = users.find(user => user.email === email);
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

// Endpoint para atualizar tarefas
app.post('/updateTasks', (req, res) => {
    const { email, tasks, trash } = req.body;
    const user = users.find(user => user.email === email);
    if (user) {
        user.tasks = tasks;
        user.trash = trash;
        res.status(200).json({ message: 'Tarefas atualizadas com sucesso' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

// Endpoint para atualizar email
app.post('/updateEmail', (req, res) => {
    const { currentEmail, newEmail } = req.body;
    const user = users.find(user => user.email === currentEmail);
    if (user) {
        if (users.find(u => u.email === newEmail)) {
            return res.status(400).json({ message: 'Novo email já está em uso' });
        }
        user.email = newEmail;
        res.status(200).json({ message: 'Email atualizado com sucesso' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
