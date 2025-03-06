import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Importe o cookie-parser
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import authMiddleware from './middlewares/authMiddleware';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({
  origin: 'http://localhost:5500', // Substitua pela origem do seu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Authorization', 'Content-Type'], // Cabeçalhos permitidos
  credentials: true, // Permite o envio de cookies
}));

// Configuração do cookie-parser
app.use(cookieParser());

app.use(express.json());

const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

app.get('/main', authMiddleware, (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/main.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(frontendPath, 'pages/register.html'));
});

app.post('/api/auth/logout', (req, res) => {
  // Remove o cookie 'token'
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Logout realizado com sucesso' });
});

app.get('/api', (req, res) => {
  res.send('API de Atividades de Voluntariado');
});

export default app;