import express from 'express';
import dotenv from 'dotenv';
import path from 'path'; // Importar o módulo path para lidar com caminhos de arquivos
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes'; // Importar as rotas de atividades

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware para processar JSON
app.use(express.json());

// Configura o Express para servir arquivos estáticos da pasta "frontend"
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de atividades
app.use('/api/activities', activityRoutes);

// Rota para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/main.html'));
});

// Rota para servir o login.html
app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/login.html'));
});

// Rota para servir o register.html
app.get('/register', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/register.html'));
});

// Rota de teste (opcional, pode ser removida se não for mais necessária)
app.get('/api', (req, res) => {
  res.send('API de Atividades de Voluntariado');
});

export default app;