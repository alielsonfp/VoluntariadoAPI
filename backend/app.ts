import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes'; // Importar as rotas de atividades

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas de atividades
app.use('/api/activities', activityRoutes); // Adicionar as rotas de atividades

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Atividades de Voluntariado');
});

export default app;